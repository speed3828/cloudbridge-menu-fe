from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class StoreStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    PENDING = "pending"
    SUSPENDED = "suspended"

class StoreCategory(str, Enum):
    RESTAURANT = "restaurant"
    RETAIL = "retail"
    SERVICE = "service"
    OTHER = "other"

class StoreBase(BaseModel):
    name: str
    description: Optional[str] = None
    category: StoreCategory
    owner_id: str
    address: str
    city: str
    state: Optional[str] = None
    country: str
    postal_code: str
    phone: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None

class StoreCreate(StoreBase):
    pass

class Store(StoreBase):
    id: str = Field(..., description="Store unique identifier")
    status: StoreStatus = StoreStatus.PENDING
    rating: Optional[float] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True 