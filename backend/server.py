from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from diffusers import StableDiffusionPipeline
from typing import AsyncGenerator
import asyncpg
import base64
import os
import subprocess
import json
import uuid

app = FastAPI()

DATABASE_URL = "postgresql://danya:admin@192.168.0.78/gazp"

async def get_db_pool() -> AsyncGenerator:
    pool = await asyncpg.create_pool(DATABASE_URL)
    try:
        yield pool
    finally:
        await pool.close()

class ImageRequest(BaseModel):
    image_id: int
    additional_data: dict  # Дополнительные данные для скрипта

class AuthRequest(BaseModel):
    username: str
    password: str

@app.get("/authorize")
async def authorize(authorization: str = Header(...), pool=Depends(get_db_pool)):
    try:
        # Декодирование заголовка авторизации
        decoded_credentials = base64.b64decode(authorization).decode("utf-8")
        login, password = decoded_credentials.split(":")
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid authorization format")

    async with pool.acquire() as connection:
        user = await connection.fetchrow(
            "SELECT * FROM users WHERE login = $1 AND key = $2",
            login, password
        )
        if not user:
            raise HTTPException(status_code=401, detail="Unauthorized")
        return JSONResponse(content={"status": "authorized"})

@app.get("/info")
async def get_info(client_id: int, db_pool=Depends(get_db_pool)):
    async with db_pool.acquire() as connection:
        client = await connection.fetchrow("SELECT * FROM clients WHERE id = $1", client_id)
        if not client:
            raise HTTPException(status_code=404, detail="Client not found")
        return JSONResponse(content=dict(client))

class ImageRequest(BaseModel):
    config: dict

@app.post("/process_image")
async def process_image(image_request: ImageRequest):
    try:
        # Определение текущей директории сервера
        server_directory = os.path.dirname(os.path.abspath(__file__))
        
        # Создание временного файла для конфигурации в текущей директории сервера
        config_path = os.path.join(server_directory, f"config_{uuid.uuid4()}.json")
        with open(config_path, "w") as f:
            json.dump(image_request.config, f)

        # Вызов внешнего Python-скрипта для обработки изображений
        script_path = os.path.join(server_directory, "generate.py")
        result = subprocess.run(
            ["python", script_path, config_path],
            capture_output=True,
            text=True
        )

        if result.returncode != 0:
            raise HTTPException(status_code=500, detail=f"Image processing failed: {result.stderr}")

        processed_images = result.stdout.strip().split('\n')

        # Удаление временного файла конфигурации
        os.remove(config_path)

        return {"processed_images": processed_images}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/shutdown")
async def shutdown():
    os._exit(0)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
