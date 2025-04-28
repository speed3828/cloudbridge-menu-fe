from typing import Dict, Optional
from fastapi import APIRouter, HTTPException, Depends
from firebase_admin import messaging, credentials, initialize_app
import json
import os

router = APIRouter()

# Firebase Admin SDK 초기화
cred = credentials.Certificate(os.getenv("GOOGLE_APPLICATION_CREDENTIALS"))
firebase_app = initialize_app(cred)

class PushNotification:
    def __init__(
        self,
        title: str,
        body: str,
        token: str,
        data: Optional[Dict] = None,
        image: Optional[str] = None,
    ):
        self.title = title
        self.body = body
        self.token = token
        self.data = data or {}
        self.image = image

    def to_message(self) -> messaging.Message:
        """FCM 메시지 객체로 변환"""
        return messaging.Message(
            notification=messaging.Notification(
                title=self.title,
                body=self.body,
                image=self.image,
            ),
            data=self.data,
            token=self.token,
        )

@router.post("/push/send")
async def send_push(notification: PushNotification):
    """단일 디바이스로 푸시 알림 전송"""
    try:
        message = notification.to_message()
        response = messaging.send(message)
        return {"message_id": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/push/send-batch")
async def send_batch_push(notifications: list[PushNotification]):
    """여러 디바이스로 푸시 알림 일괄 전송"""
    try:
        messages = [n.to_message() for n in notifications]
        response = messaging.send_all(messages)
        return {
            "success_count": response.success_count,
            "failure_count": response.failure_count,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/push/topic/{topic}")
async def send_topic_push(
    topic: str,
    notification: PushNotification
):
    """토픽 기반 푸시 알림 전송"""
    try:
        # 토픽 조건 설정
        condition = f"'{topic}' in topics"
        
        message = messaging.Message(
            notification=messaging.Notification(
                title=notification.title,
                body=notification.body,
                image=notification.image,
            ),
            data=notification.data,
            condition=condition,
        )
        
        response = messaging.send(message)
        return {"message_id": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/push/subscribe/{topic}")
async def subscribe_to_topic(topic: str, tokens: list[str]):
    """토픽 구독 등록"""
    try:
        response = messaging.subscribe_to_topic(tokens, topic)
        return {
            "success_count": response.success_count,
            "failure_count": response.failure_count,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/push/unsubscribe/{topic}")
async def unsubscribe_from_topic(topic: str, tokens: list[str]):
    """토픽 구독 해제"""
    try:
        response = messaging.unsubscribe_from_topic(tokens, topic)
        return {
            "success_count": response.success_count,
            "failure_count": response.failure_count,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 