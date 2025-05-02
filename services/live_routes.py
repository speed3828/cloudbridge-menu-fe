from dao import liveNewsDao, livePostDao
from ws_server import broadcast
from datetime import datetime
import uuid

def feed(request):
    # 최신 뉴스 30 + 제보 30 → 최신순 혼합
    news = liveNewsDao.read(order="-publish_time", limit=30)
    posts = livePostDao.read(order="-created_at", limit=30)
    merged = sorted(news + posts, key=lambda x: x.get("publish_time") or x["created_at"], reverse=True)
    return merged[:50]

def upload_post(request):
    data = request.json()
    post_id = str(uuid.uuid4())
    livePostDao.append({
        "post_id": post_id,
        "title": data["title"],
        "body": data["body"],
        "image_url": data.get("image_url",""),
        "author": request.user,
        "created_at": datetime.utcnow().isoformat()
    })
    broadcast("main-feed", {"type":"live","title":data["title"],"id":post_id})
    return {"post_id": post_id} 