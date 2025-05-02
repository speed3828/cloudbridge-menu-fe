import asyncio
import json
import logging
from typing import Dict, List, Any

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ws_server")

# Dictionary to store active WebSocket connections based on topics
connections: Dict[str, List[Any]] = {}

async def register(websocket, topic: str):
    """Register a WebSocket connection for a specific topic"""
    if topic not in connections:
        connections[topic] = []
    connections[topic].append(websocket)
    logger.info(f"Client registered for topic: {topic}")

async def unregister(websocket, topic: str):
    """Unregister a WebSocket connection"""
    if topic in connections:
        try:
            connections[topic].remove(websocket)
            logger.info(f"Client unregistered from topic: {topic}")
            if not connections[topic]:  # Remove topic if no connections
                del connections[topic]
        except ValueError:
            pass

def broadcast(topic: str, message: Any):
    """Broadcast a message to all connected clients subscribed to the topic"""
    if topic not in connections or not connections[topic]:
        logger.info(f"No active connections for topic: {topic}")
        return False

    # Convert message to JSON if it's not already a string
    if not isinstance(message, str):
        message = json.dumps(message)

    # Use asyncio to run the async broadcast function
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    task = loop.create_task(_async_broadcast(topic, message))
    loop.run_until_complete(task)
    loop.close()
    return True

async def _async_broadcast(topic: str, message: str):
    """Internal async function to broadcast message to websockets"""
    if topic not in connections:
        return

    # Create a copy to avoid modification during iteration
    clients = connections[topic].copy()
    logger.info(f"Broadcasting to {len(clients)} clients on topic: {topic}")
    
    for websocket in clients:
        try:
            await websocket.send(message)
        except Exception as e:
            logger.error(f"Error broadcasting to client: {str(e)}")
            # We'll let the connection handler deal with removing failed connections

# WebSocket handler function to be used with a framework like FastAPI
async def websocket_handler(websocket, topic: str):
    """Handle WebSocket connection for real-time notifications"""
    await register(websocket, topic)
    try:
        # Keep the connection alive and handle incoming messages
        async for message in websocket:
            # If you want to handle client messages, process them here
            logger.debug(f"Received message from client on topic {topic}: {message}")
            # For now, we're just using this as a one-way notification channel
    except Exception as e:
        logger.error(f"WebSocket error: {str(e)}")
    finally:
        await unregister(websocket, topic) 