from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from app.api.router import api_router
from app.db.session import engine
from app.db.base_class import Base

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Autonomous AI Data Analyst API",
    description="Backend API for AI Data Analyst platform",
    version="1.0.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to Autonomous AI Data Analyst API"}

@app.get("/health")
async def health_check():
    return {"status": "ok"}

app.include_router(api_router, prefix="/api")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
