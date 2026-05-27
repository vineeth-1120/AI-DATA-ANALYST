from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base_class import Base

class Dataset(Base):
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, index=True, nullable=False)
    file_path = Column(String, nullable=False)
    upload_time = Column(DateTime, default=datetime.utcnow)
    columns_info = Column(JSON, nullable=True)  # Store column info metadata
    row_count = Column(Integer, nullable=True)
    
    owner_id = Column(Integer, ForeignKey("user.id"))
    owner = relationship("User", backref="datasets")
