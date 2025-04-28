from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from auth import router as auth_router

app = FastAPI(
    title="Cloudbridge Platform Main API",
    description="Main API for Cloudbridge Platform",
    version="0.1.0",
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)

@app.get("/", tags=["Root"])
async def read_root():
    return {"message": "Welcome to Cloudbridge Platform Main API"}

@app.get("/healthz", tags=["Health"])
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=4000, reload=True) 