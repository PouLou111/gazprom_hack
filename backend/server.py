import os
import json
import uuid
import logging
import subprocess
from fastapi import FastAPI, Depends, HTTPException, Header, Request
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import AsyncGenerator
import asyncpg
import base64

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Разрешаем CORS для всех источников
    allow_credentials=True,
    allow_methods=["*"],  # Позволяем все методы
    allow_headers=["*"],
)

app.mount("/output_final", StaticFiles(directory="output_final"), name="output_final")
app.mount("/output_remover", StaticFiles(directory="output_remover"), name="output_remover")

DATABASE_URL = "postgresql://postgres:postgres@127.0.0.1:5432/gazp"

async def get_db_pool() -> AsyncGenerator:
    pool = None
    logger.info("Connecting to the database...")
    try:
        pool = await asyncpg.create_pool(
            DATABASE_URL,
            min_size=1,  # Минимальное количество соединений в пуле
            max_size=10,  # Максимальное количество соединений в пуле
            timeout=60.0,  # Таймаут подключения
        )
        logger.info("Database connection established.")
        yield pool
    except Exception as e:
        logger.error(f"Failed to connect to the database: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to connect to the database")
    finally:
        if pool:
            await pool.close()
            logger.info("Database connection closed.")

@app.options("/authorize")  # Обработка метода OPTIONS для /authorize
async def options_authorize():
    return JSONResponse(content={}, headers={
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,OPTIONS',
        'Access-Control-Allow-Headers': 'Authorization',
    })

@app.get("/authorize")
async def authorize(authorization: str = Header(...), pool=Depends(get_db_pool)):
    try:
        # Декодирование заголовка авторизации
        _, encoded_credentials = authorization.split(" ")
        decoded_credentials = base64.b64decode(encoded_credentials).decode("utf-8")
        login, password = decoded_credentials.split(":")
    except Exception as e:
        logger.error(f"Invalid authorization format: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Invalid authorization format: {str(e)}")

    async with pool.acquire() as connection:
        user = await connection.fetchrow(
            "SELECT * FROM users WHERE login = $1 AND key = $2",
            login, password
        )
        if not user:
            logger.warning("Unauthorized access attempt.")
            raise HTTPException(status_code=401, detail="Unauthorized")
        return JSONResponse(content={"status": "authorized"})

@app.get("/info")
async def get_info(client_id: int, pool=Depends(get_db_pool)):
    async with pool.acquire() as connection:
        client = await connection.fetchrow("SELECT * FROM clients WHERE id = $1", client_id)
        if not client:
            logger.warning(f"Client not found: {client_id}")
            raise HTTPException(status_code=404, detail="Client not found")
        client_data = dict(client)
        if 'images' not in client_data:
            client_data['images'] = []  # Добавляем пустой массив изображений, если он отсутствует
        if 'product_type' not in client_data:
            client_data['product_type'] = "Unknown"  # Добавляем поле product_type, если оно отсутствует
        return JSONResponse(content=client_data)

class ImageRequest(BaseModel):
    config: dict

@app.post("/process_image")
async def process_image(image_request: ImageRequest):
    try:
        logger.info("Processing image generation request...")
        server_directory = os.path.dirname(os.path.abspath(__file__))
        config_path = os.path.join(server_directory, f"config_{uuid.uuid4()}.json")
        with open(config_path, "w") as f:
            json.dump(image_request.config, f)

        script_path = os.path.join(server_directory, "generate.py")
        result = subprocess.run(
            ["python3", script_path, config_path],
            capture_output=True,
            text=True
        )

        if result.returncode != 0:
            logger.error(f"Image processing failed: {result.stderr}")
            raise HTTPException(status_code=500, detail=f"Image processing failed: {result.stderr}")

        processed_images = [line for line in result.stdout.strip().split('\n') if line.strip() and not line.startswith('DEBUG') and not line.startswith('PERFORMANCE')]  # Убираем пустые строки и отладочные сообщения

        os.remove(config_path)
        
        logger.info("Image generation completed successfully.")
        return {"processed_images": processed_images}
    except Exception as e:
        logger.error(f"Image processing error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

class AddBackgroundRequest(BaseModel):
    image: str
    sizeX: int
    sizeY: int
    backgroundColor: str

@app.post("/add_background")
async def add_background(request: AddBackgroundRequest):
    try:
        logger.info("Adding background to the image...")
        from generate import apply_background
        background_output_path = apply_background(request.image, request.sizeX, request.sizeY, request.backgroundColor)
        logger.info("Background added successfully.")
        return {"final_image": background_output_path}
    except Exception as e:
        logger.error(f"Background addition error: {str(e)}")
        raise HTTPException(status_code=500, detail="Background addition error")

@app.get("/download/{filename}")
async def download_file(filename: str):
    file_path = os.path.join("output_final", filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(path=file_path, filename=filename, media_type='application/octet-stream')

@app.post("/shutdown")
async def shutdown():
    os._exit(0)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

