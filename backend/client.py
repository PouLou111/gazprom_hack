import httpx
import asyncio
import base64
import requests


async def test_authorize(login: str, password: str):
    url = "http://localhost:8000/authorize"
    credentials = f"{login}:{password}"
    encoded_credentials = base64.b64encode(credentials.encode("utf-8")).decode("utf-8")
    headers = {
        "authorization": encoded_credentials
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=headers)
        if response.status_code == 200:
            print("Authorization successful!")
            return response.json()["key"]
        elif response.status_code == 401:
            print("Authorization failed: Unauthorized")
            return None
        else:
            print(f"Authorization failed: {response.status_code}")
            print("Response data:", response.text)
            return None

def get_client_info(client_id: int):
    url = f"http://127.0.0.1:8000/info?client_id={client_id}"
    response = requests.get(url)
    
    if response.status_code == 200:
        return response.json()
    else:
        return {"status": "error", "detail": response.json().get("detail", "Unknown error")}

if __name__ == "__main__":
    login = "admin"
    password = "admin"
    client_id = 1  # Замените на нужный вам ID клиента
    result = get_client_info(client_id)
    print(result)
