from dao import bandDao, bandPostDao
from ws_server import broadcast
from datetime import datetime
import uuid, hashlib

def handle_band(request):
    if request.method=="GET":
        return bandDao.read()
    data=request.json()
    band_id=str(uuid.uuid4())
    bandDao.append({**data,"band_id":band_id,"created_by":request.user,"created_at":datetime.utcnow().isoformat()})
    return {"band_id":band_id}

def handle_post(request, band_id):
    if request.method=="GET":
        return bandPostDao.read({"band_id":band_id})
    data=request.json()
    post_id=str(uuid.uuid4())
    bandPostDao.append({**data,"band_id":band_id,"post_id":post_id,"author":request.user,"views":0,"likes":0,"created_at":datetime.utcnow().isoformat()})
    broadcast("band-feed",{"type":"band-post","band":band_id,"title":data['title'],"post_id":post_id})
    return {"post_id":post_id}

def like_post(request, post_id):
    post = bandPostDao.get(post_id=post_id)
    post['likes'] += 1
    bandPostDao.update(post_id=post_id, data=post)
    return {"likes":post['likes']}

def latest_feed(request):
    return bandPostDao.read(order="-created_at",limit=20)

def popular_feed(request):
    return bandPostDao.read(order="-likes",limit=20) 