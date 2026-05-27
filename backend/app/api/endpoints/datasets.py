import os
import shutil
import pandas as pd
from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.dataset import Dataset
from app.schemas.dataset import DatasetResponse
from app.api.deps import CurrentUser

router = APIRouter()

UPLOAD_DIR = "uploaded_datasets"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload", response_model=DatasetResponse)
async def upload_dataset(
    current_user: CurrentUser,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    if not file.filename.endswith(('.csv', '.xlsx')):
        raise HTTPException(status_code=400, detail="Only CSV or XLSX files are allowed.")
    
    file_path = os.path.join(UPLOAD_DIR, f"{current_user.id}_{file.filename}")
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    try:
        if file.filename.endswith('.csv'):
            df = pd.read_csv(file_path)
        else:
            df = pd.read_excel(file_path)
            
        columns_info = {col: str(df[col].dtype) for col in df.columns}
        row_count = len(df)
    except Exception as e:
        os.remove(file_path)
        raise HTTPException(status_code=400, detail=f"Error reading file: {str(e)}")

    dataset = Dataset(
        filename=file.filename,
        file_path=file_path,
        columns_info=columns_info,
        row_count=row_count,
        owner_id=current_user.id
    )
    
    db.add(dataset)
    db.commit()
    db.refresh(dataset)
    
    return dataset

@router.get("/", response_model=List[DatasetResponse])
def list_datasets(current_user: CurrentUser, db: Session = Depends(get_db)):
    datasets = db.query(Dataset).filter(Dataset.owner_id == current_user.id).all()
    return datasets
