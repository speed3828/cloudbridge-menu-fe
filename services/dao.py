import uuid
import json
from datetime import datetime
import os
from typing import Dict, List, Any, Optional

class BaseDao:
    def __init__(self, sheet_id: str, schema: Dict[str, str]):
        self.sheet_id = sheet_id
        self.schema = schema
        self.primary_key = next((k for k, v in schema.items() if v == "uuid"), None)
        
    def append(self, item: Dict[str, Any]) -> str:
        """항목을 추가합니다."""
        if self.primary_key and self.primary_key not in item:
            item[self.primary_key] = str(uuid.uuid4())
            
        # 실제 구현시 Google Sheets API 호출
        print(f"[DAO] Append: {json.dumps(item)}")
        return item.get(self.primary_key, "")

    def read(self, query: Dict[str, Any] = None, order: str = None, limit: int = None) -> List[Dict[str, Any]]:
        """쿼리 조건에 맞는 항목을 조회합니다."""
        # 실제 구현시 Google Sheets API 호출
        print(f"[DAO] Read with query: {json.dumps(query) if query else 'None'}, order: {order}, limit: {limit}")
        return []
        
    def exists(self, **kwargs) -> bool:
        """특정 조건을 만족하는 항목이 존재하는지 확인합니다."""
        items = self.read(kwargs)
        return len(items) > 0

    def get(self, **kwargs) -> Dict[str, Any]:
        """특정 조건을 만족하는 첫 번째 항목을 조회합니다."""
        items = self.read(kwargs)
        return items[0] if items else {}

    def update(self, data: Dict[str, Any], **kwargs) -> bool:
        """특정 조건을 만족하는 항목을 업데이트합니다."""
        print(f"[DAO] Update with query: {json.dumps(kwargs)}, data: {json.dumps(data)}")
        return True

# 정부 정책 DAO
class GovPolicyDao(BaseDao):
    def __init__(self):
        schema = {
            "policy_id": "uuid",
            "title": "string",
            "agency": "string",
            "target_group": "string",
            "support_type": "string",
            "apply_url": "string",
            "publish_from": "date",
            "publish_to": "date",
            "created_at": "timestamp"
        }
        sheet_id = os.environ.get('GOOGLE_GOV_POLICY_SHEET_ID', '')
        super().__init__(sheet_id, schema)

# 복지 정책 DAO
class WelfarePolicyDao(BaseDao):
    def __init__(self):
        schema = {
            "policy_id": "uuid",
            "title": "string",
            "agency": "string",
            "target_group": "string",
            "support_type": "string",
            "apply_url": "string",
            "publish_from": "date",
            "publish_to": "date",
            "created_at": "timestamp"
        }
        sheet_id = os.environ.get('GOOGLE_WELFARE_POLICY_SHEET_ID', '')
        super().__init__(sheet_id, schema)

# 밴드 DAO
class BandDao(BaseDao):
    def __init__(self):
        schema = {
            "band_id": "uuid",
            "name": "string",
            "category": "string",
            "description": "text",
            "thumbnail": "string",
            "created_by": "string",
            "created_at": "timestamp"
        }
        sheet_id = os.environ.get('GOOGLE_BAND_SHEET_ID', '')
        super().__init__(sheet_id, schema)

# 밴드 게시글 DAO
class BandPostDao(BaseDao):
    def __init__(self):
        schema = {
            "post_id": "uuid",
            "band_id": "string",
            "title": "string",
            "content": "text",
            "author": "string",
            "views": "int",
            "likes": "int",
            "created_at": "timestamp"
        }
        sheet_id = os.environ.get('GOOGLE_BAND_POST_SHEET_ID', '')
        super().__init__(sheet_id, schema)

# 라이브 뉴스 DAO
class LiveNewsDao(BaseDao):
    def __init__(self):
        schema = {
            "live_id": "uuid",
            "title": "string",
            "body": "text",
            "image_url": "string",
            "source": "string",
            "source_url": "string",
            "publish_time": "timestamp",
            "created_at": "timestamp"
        }
        sheet_id = os.environ.get('GOOGLE_LIVE_NEWS_SHEET_ID', '')
        super().__init__(sheet_id, schema)

# 라이브 게시글 DAO
class LivePostDao(BaseDao):
    def __init__(self):
        schema = {
            "post_id": "uuid",
            "title": "string",
            "body": "text",
            "image_url": "string",
            "author": "string",
            "created_at": "timestamp"
        }
        sheet_id = os.environ.get('GOOGLE_LIVE_POST_SHEET_ID', '')
        super().__init__(sheet_id, schema)

# DAO 인스턴스 생성
govPolicyDao = GovPolicyDao()
welfarePolicyDao = WelfarePolicyDao()
bandDao = BandDao()
bandPostDao = BandPostDao()
liveNewsDao = LiveNewsDao()
livePostDao = LivePostDao()

# 스토리 게시글 DAO
class StoryPostDao(BaseDao):
    def __init__(self):
        schema = {
            "post_id": "uuid",
            "title": "string",
            "body": "text",
            "images": "json",
            "author_email": "string",
            "likes": "int",
            "views": "int",
            "created_at": "timestamp"
        }
        sheet_id = os.environ.get('GOOGLE_STORY_POST_SHEET_ID', '')
        super().__init__(sheet_id, schema)

# 스토리 댓글 DAO
class StoryCommentDao(BaseDao):
    def __init__(self):
        schema = {
            "comment_id": "uuid",
            "post_id": "string",
            "body": "text",
            "author_email": "string",
            "created_at": "timestamp"
        }
        sheet_id = os.environ.get('GOOGLE_STORY_COMMENT_SHEET_ID', '')
        super().__init__(sheet_id, schema)

# 추가 DAO 인스턴스 생성
storyPostDao = StoryPostDao()
storyCommentDao = StoryCommentDao() 