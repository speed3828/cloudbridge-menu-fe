import os
from typing import Dict, Optional
from fastapi import FastAPI, HTTPException
from firebase_admin import initialize_app, messaging
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Firebase Admin SDK
firebase_app = initialize_app()

# Create FastAPI app
app = FastAPI(title="CloudBridge Push Notification Handler")

@app.post("/send-push")
async def send_push_notification(
    data: Dict[str, str],
    token: Optional[str] = None,
    topic: Optional[str] = None
):
    """
    Send push notification to either a specific device token or a topic.
    
    Args:
        data (Dict[str, str]): Notification data including title and body
        token (Optional[str]): FCM device token
        topic (Optional[str]): FCM topic name
    
    Returns:
        Dict: Response with message ID
    """
    if not token and not topic:
        raise HTTPException(
            status_code=400,
            detail="Either device token or topic must be provided"
        )
    
    try:
        message = messaging.Message(
            notification=messaging.Notification(
                title=data.get("title", "CloudBridge Notification"),
                body=data.get("body", "")
            ),
            data=data,
            token=token if token else None,
            topic=topic if topic else None
        )
        
        response = messaging.send(message)
        return {"success": True, "message_id": response}
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to send notification: {str(e)}"
        )

@app.post("/subscribe-to-topic")
async def subscribe_to_topic(topic: str, tokens: list[str]):
    """
    Subscribe device tokens to a FCM topic.
    
    Args:
        topic (str): Topic name
        tokens (list[str]): List of device tokens
    
    Returns:
        Dict: Response with success count
    """
    try:
        response = messaging.subscribe_to_topic(tokens, topic)
        return {
            "success": True,
            "success_count": response.success_count,
            "failure_count": response.failure_count
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to subscribe to topic: {str(e)}"
        )

@app.post("/unsubscribe-from-topic")
async def unsubscribe_from_topic(topic: str, tokens: list[str]):
    """
    Unsubscribe device tokens from a FCM topic.
    
    Args:
        topic (str): Topic name
        tokens (list[str]): List of device tokens
    
    Returns:
        Dict: Response with success count
    """
    try:
        response = messaging.unsubscribe_from_topic(tokens, topic)
        return {
            "success": True,
            "success_count": response.success_count,
            "failure_count": response.failure_count
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to unsubscribe from topic: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 