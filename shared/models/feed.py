from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class FeedType(str, Enum):
    NEWS = "news"
    PROMOTION = "promotion"
    EVENT = "event"
    UPDATE = "update"
    OTHER = "other"

class FeedStatus(str, Enum):
    PUBLISHED = "published"
    DRAFT = "draft"
    ARCHIVED = "archived"

class FeedBase(BaseModel):
    title: str
    content: str
    author_id: str
    feed_type: FeedType
    tags: Optional[List[str]] = None
    image_url: Optional[str] = None

class FeedCreate(FeedBase):
    pass

class Feed(FeedBase):
    id: str = Field(..., description="Feed unique identifier")
    status: FeedStatus = FeedStatus.DRAFT
    published_at: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    like_count: int = 0
    comment_count: int = 0
    view_count: int = 0

    class Config:
        from_attributes = True 