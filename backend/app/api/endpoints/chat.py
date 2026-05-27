import os
import pandas as pd
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.db.session import get_db
from app.models.dataset import Dataset
from app.api.deps import CurrentUser
from app.services.ai_agent import process_query

router = APIRouter()

class QueryRequest(BaseModel):
    dataset_id: int
    query: str

class QueryResponse(BaseModel):
    text: str
    chart_data: dict | None

@router.post("/", response_model=QueryResponse)
async def chat_with_data(
    request: QueryRequest,
    current_user: CurrentUser,
    db: Session = Depends(get_db)
):
    dataset = db.query(Dataset).filter(
        Dataset.id == request.dataset_id,
        Dataset.owner_id == current_user.id
    ).first()
    
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
        
    try:
        if dataset.file_path.endswith('.csv'):
            df = pd.read_csv(dataset.file_path)
        else:
            df = pd.read_excel(dataset.file_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading dataset: {str(e)}")
        
    try:
        result = process_query(df, request.query)
    except Exception as e:
        print("Incoming AI request error:", str(e))
        raise HTTPException(status_code=500, detail=str(e))
    return QueryResponse(
        text=result.get("text", "No text generated."),
        chart_data=result.get("chart_data")
    )
