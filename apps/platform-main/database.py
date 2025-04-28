import os
from motor.motor_asyncio import AsyncIOMotorClient
from redis import Redis
from pydantic import BaseSettings
from typing import Optional

class DatabaseSettings(BaseSettings):
    MONGO_URL: str = os.getenv("MONGO_URL", "mongodb://localhost:27017/cloudbridge")
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379")

    class Config:
        env_file = ".env"

db_settings = DatabaseSettings()

# MongoDB 연결
mongo_client = AsyncIOMotorClient(db_settings.MONGO_URL)
mongo_db = mongo_client.get_database()

# Redis 연결
redis_client: Optional[Redis] = Redis.from_url(db_settings.REDIS_URL, decode_responses=True)

async def get_mongo_db():
    return mongo_db

def get_redis_client() -> Optional[Redis]:
    return redis_client

# 애플리케이션 시작 시 연결 확인
async def connect_db():
    try:
        await mongo_client.server_info()
        print("MongoDB 연결 성공")
    except Exception as e:
        print(f"MongoDB 연결 실패: {e}")
    
    try:
        if redis_client and redis_client.ping():
            print("Redis 연결 성공")
    except Exception as e:
        print(f"Redis 연결 실패: {e}")

# 애플리케이션 종료 시 연결 종료
async def close_db():
    try:
        mongo_client.close()
        print("MongoDB 연결 종료")
    except Exception as e:
        print(f"MongoDB 연결 종료 실패: {e}")
    
    try:
        if redis_client:
            redis_client.close()
            print("Redis 연결 종료")
    except Exception as e:
        print(f"Redis 연결 종료 실패: {e}") 