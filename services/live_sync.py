from dao import liveNewsDao
from ws_server import broadcast
from datetime import datetime
import uuid, hashlib, feedparser, requests

NAVER_NEWS_URL = "https://openapi.naver.com/v1/search/news.json?query=양평&sort=date&display=20"

def hash_id(url:str): return hashlib.sha256(url.encode()).hexdigest()

def fetch_naver():
    hdr={"X-Naver-Client-Id": "TODO","X-Naver-Client-Secret":"TODO"}
    for item in requests.get(NAVER_NEWS_URL, headers=hdr, timeout=5).json().get("items",[]):
        _id = hash_id(item["link"])
        if not liveNewsDao.exists(live_id=_id):
            liveNewsDao.append({
                "live_id": _id,
                "title": item["title"],
                "body": item["description"],
                "image_url": item.get("thumbnail",""),
                "source":"네이버뉴스",
                "source_url": item["link"],
                "publish_time": datetime.utcnow().isoformat(),
                "created_at": datetime.utcnow().isoformat()
            })
            broadcast("main-feed", {"type":"live","title":item['title'],"id":_id})

def handler():
    fetch_naver()
    # fetch only posts with hashtag #양평
    # ... 구현 예: if \"양평\" in post.message: ...
if __name__=="__main__": handler() 