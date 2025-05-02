from dao import storyPostDao, storyCommentDao
from ws_server import broadcast
from datetime import datetime
import uuid, json

def _serialize_images(arr):
    return json.dumps(arr) if isinstance(arr, list) else "[]"

def handle_story(request):
    if request.method=="GET":
        sort = request.query.get("sort","latest")
        order = "-likes" if sort=="popular" else "-created_at"
        return storyPostDao.read(order=order, limit=40)
    data=request.json()
    post_id=str(uuid.uuid4())
    storyPostDao.append({
        "post_id":post_id,
        "title":data["title"],
        "body":data["body"],
        "images":_serialize_images(data.get("images",[])),
        "author_email":request.user,
        "likes":0,"views":0,
        "created_at":datetime.utcnow().isoformat()
    })
    broadcast("main-feed",{"type":"story","title":data['title'],"id":post_id})
    return {"post_id":post_id}

def detail(request,id):
    post = storyPostDao.get(post_id=id)
    post["views"] += 1
    storyPostDao.update(post_id=id,data=post)
    return post

def like(request,id):
    post = storyPostDao.get(post_id=id)
    post["likes"] += 1
    storyPostDao.update(post_id=id,data=post)
    broadcast("main-feed",{"type":"story-like","title":post['title'],"id":id})
    return {"likes":post["likes"]}

def comment(request,id):
    if request.method=="GET":
        return storyCommentDao.read({"post_id":id},order="-created_at")
    data=request.json()
    storyCommentDao.append({
        "comment_id":str(uuid.uuid4()),
        "post_id":id,
        "body":data["body"],
        "author_email":request.user,
        "created_at":datetime.utcnow().isoformat()
    })
    broadcast("main-feed",{"type":"story-comment","title":data['body'][:20]+"…","id":id})
    return {"status":"ok"} 