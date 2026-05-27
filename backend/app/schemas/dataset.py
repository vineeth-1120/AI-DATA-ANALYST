from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Dict, Any

class DatasetBase(BaseModel):
    filename: str

class DatasetCreate(DatasetBase):
    file_path: str
    columns_info: Optional[Dict[str, Any]] = None
    row_count: Optional[int] = None

class DatasetResponse(DatasetBase):
    id: int
    upload_time: datetime
    columns_info: Optional[Dict[str, Any]] = None
    row_count: Optional[int] = None
    owner_id: int

    class Config:
        from_attributes = True
