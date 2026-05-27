from fastapi import APIRouter
from app.api.endpoints import auth, datasets, chat

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(datasets.router, prefix="/datasets", tags=["datasets"])
api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
