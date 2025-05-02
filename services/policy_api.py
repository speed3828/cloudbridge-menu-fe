import os
import json
from flask import Flask, request, jsonify
from datetime import datetime
import logging
from policy_ingestion import run_ingestion
from policy_broadcast import run_broadcast

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler(os.path.join(os.path.dirname(__file__), 'policy_api.log'))
    ]
)
logger = logging.getLogger('policy_api')

# Create Flask app
app = Flask(__name__)

# Get authentication token from environment
API_TOKEN = os.environ.get('POLICY_API_TOKEN', 'default-secure-token')

def authenticate(request):
    """Authenticate API request"""
    token = request.headers.get('Authorization')
    if not token:
        return False
    
    # Remove 'Bearer ' prefix if present
    if token.startswith('Bearer '):
        token = token[7:]
    
    return token == API_TOKEN

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/policies/ingestion', methods=['POST'])
def trigger_ingestion():
    """API endpoint to trigger policy ingestion"""
    # Authenticate request
    if not authenticate(request):
        logger.warning(f"Unauthorized ingestion request from {request.remote_addr}")
        return jsonify({
            'status': 'error',
            'message': 'Unauthorized'
        }), 401
    
    logger.info(f"Received ingestion request from {request.remote_addr}")
    
    try:
        # Parse request data (optional parameters)
        data = request.json if request.is_json else {}
        source_type = data.get('source_type', 'all')  # 'gov', 'welfare', or 'all'
        
        # Run ingestion
        result = run_ingestion()
        
        logger.info(f"Ingestion completed successfully")
        return jsonify({
            'status': 'success',
            'message': 'Policy ingestion triggered successfully',
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error triggering ingestion: {str(e)}", exc_info=True)
        return jsonify({
            'status': 'error',
            'message': f'Error triggering ingestion: {str(e)}',
            'timestamp': datetime.now().isoformat()
        }), 500

@app.route('/api/policies/broadcast', methods=['POST'])
def trigger_broadcast():
    """API endpoint to trigger policy broadcast"""
    # Authenticate request
    if not authenticate(request):
        logger.warning(f"Unauthorized broadcast request from {request.remote_addr}")
        return jsonify({
            'status': 'error',
            'message': 'Unauthorized'
        }), 401
    
    logger.info(f"Received broadcast request from {request.remote_addr}")
    
    try:
        # Parse request data (optional parameters)
        data = request.json if request.is_json else {}
        hours = data.get('hours', 24)  # Default to 24 hours
        
        # Run broadcast
        result = run_broadcast(hours=hours)
        
        logger.info(f"Broadcast completed successfully")
        return jsonify({
            'status': 'success',
            'message': f'Policy broadcast for last {hours} hours triggered successfully',
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error triggering broadcast: {str(e)}", exc_info=True)
        return jsonify({
            'status': 'error',
            'message': f'Error triggering broadcast: {str(e)}',
            'timestamp': datetime.now().isoformat()
        }), 500

@app.route('/api/policies/status', methods=['GET'])
def get_status():
    """API endpoint to get status of policy system"""
    # Authenticate request
    if not authenticate(request):
        logger.warning(f"Unauthorized status request from {request.remote_addr}")
        return jsonify({
            'status': 'error',
            'message': 'Unauthorized'
        }), 401
    
    try:
        # Get service status information
        # In a real implementation, this would query the database 
        # or check service metrics/logs
        status_info = {
            'services': {
                'ingestion': 'running',
                'broadcast': 'running',
                'api': 'running'
            },
            'last_run': {
                'ingestion': datetime.now().isoformat(),
                'broadcast': datetime.now().isoformat()
            },
            'timestamp': datetime.now().isoformat()
        }
        
        return jsonify(status_info)
        
    except Exception as e:
        logger.error(f"Error getting status: {str(e)}", exc_info=True)
        return jsonify({
            'status': 'error',
            'message': f'Error getting status: {str(e)}',
            'timestamp': datetime.now().isoformat()
        }), 500

def run_api(host='0.0.0.0', port=5000, debug=False):
    """Run the API server"""
    logger.info(f"Starting Policy API server on {host}:{port}")
    app.run(host=host, port=port, debug=debug)

if __name__ == "__main__":
    # Get port from environment or use default
    port = int(os.environ.get('POLICY_API_PORT', 5000))
    debug = os.environ.get('POLICY_API_DEBUG', 'false').lower() == 'true'
    
    # Run API server
    run_api(port=port, debug=debug) 