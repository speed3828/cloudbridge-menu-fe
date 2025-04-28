from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.responses import RedirectResponse
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional
import os
import requests
from pydantic import BaseModel

router = APIRouter(prefix="/auth", tags=["Authentication"])

# Simulating environment variables (in a real app, these would be in .env file)
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "google-client-id")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET", "google-client-secret")
NAVER_CLIENT_ID = os.getenv("NAVER_CLIENT_ID", "naver-client-id")
NAVER_CLIENT_SECRET = os.getenv("NAVER_CLIENT_SECRET", "naver-client-secret")
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# OAuth endpoints

@router.get("/google/login")
async def google_login():
    redirect_uri = "http://localhost:4000/auth/google/callback"
    return RedirectResponse(
        f"https://accounts.google.com/o/oauth2/auth?response_type=code&client_id={GOOGLE_CLIENT_ID}&redirect_uri={redirect_uri}&scope=email%20profile"
    )

@router.get("/google/callback")
async def google_callback(code: str):
    # In a real app, you'd exchange the code for tokens and validate
    # For now, we'll return a simulated token
    return create_access_token(data={"sub": "google-user@example.com"})

@router.get("/naver/login")
async def naver_login():
    redirect_uri = "http://localhost:4000/auth/naver/callback"
    return RedirectResponse(
        f"https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id={NAVER_CLIENT_ID}&redirect_uri={redirect_uri}&state=STATE_STRING"
    )

@router.get("/naver/callback")
async def naver_callback(code: str, state: str):
    # In a real app, you'd exchange the code for tokens and validate
    # For now, we'll return a simulated token
    return create_access_token(data={"sub": "naver-user@example.com"})

# JWT Token creation
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return {"access_token": encoded_jwt, "token_type": "bearer"} 