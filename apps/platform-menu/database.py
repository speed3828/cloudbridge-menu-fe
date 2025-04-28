import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from sqlalchemy import text
from redis import Redis
from pydantic import BaseSettings
from typing import Optional

class DatabaseSettings(BaseSettings):
    POSTGRES_URL: str = os.getenv("POSTGRES_URL", "postgresql+asyncpg://cloudbridge:pass@localhost:5432/cloudbridge")
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379")

    class Config:
        env_file = ".env"

db_settings = DatabaseSettings()

# PostgreSQL 연결
engine = create_async_engine(db_settings.POSTGRES_URL, echo=True)
async_session = async_sessionmaker(
    engine, 
    expire_on_commit=False, 
    class_=AsyncSession
)
Base = declarative_base()

# Redis 연결
redis_client: Optional[Redis] = Redis.from_url(db_settings.REDIS_URL, decode_responses=True)

async def get_db():
    async with async_session() as session:
        try:
            yield session
        finally:
            await session.close()

def get_redis_client() -> Optional[Redis]:
    return redis_client

# 애플리케이션 시작 시 연결 확인
async def connect_db():
    try:
        async with engine.begin() as conn:
            await conn.execute(text("SELECT 1"))
        print("PostgreSQL 연결 성공")
    except Exception as e:
        print(f"PostgreSQL 연결 실패: {e}")
    
    try:
        if redis_client and redis_client.ping():
            print("Redis 연결 성공")
    except Exception as e:
        print(f"Redis 연결 실패: {e}")

# 애플리케이션 종료 시 연결 종료
async def close_db():
    try:
        await engine.dispose()
        print("PostgreSQL 연결 종료")
    except Exception as e:
        print(f"PostgreSQL 연결 종료 실패: {e}")
    
    try:
        if redis_client:
            redis_client.close()
            print("Redis 연결 종료")
    except Exception as e:
        print(f"Redis 연결 종료 실패: {e}") 