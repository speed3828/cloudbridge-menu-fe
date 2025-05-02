# Policy Data Management System

This system manages government and welfare policy data by ingesting from various sources, storing the data, and broadcasting notifications about new policies.

## System Components

### 1. Data Access Objects (DAO)
- `dao.py`: Base DAO class and specialized DAOs for government and welfare policies
- Uses Google Sheets as the data store

### 2. Data Ingestion
- `policy_ingestion.py`: Fetches policy data from RSS feeds and APIs
- Normalizes and stores policy data via DAOs

### 3. Notification Broadcasting
- `policy_broadcast.py`: Sends notifications about new policies
- Formats messages for Slack and other notification channels

### 4. Scheduled Jobs
- `policy_cron.py`: Manages scheduled ingestion and broadcasting jobs
- Uses the schedule library for time-based job execution

### 5. API Endpoints
- `policy_api.py`: Provides REST API for manual triggering of processes
- Includes authentication and status endpoints

## Setup Instructions

### Prerequisites
- Python 3.8 or higher
- Google Sheets API access and credentials
- Slack webhook URL (for notifications)

### Installation

1. Install dependencies:
```
pip install -r requirements.txt
```

2. Set up environment variables:
```
# Google Sheets
export GOOGLE_GOV_POLICY_SHEET_ID=your_sheet_id
export GOOGLE_WELFARE_POLICY_SHEET_ID=your_sheet_id
export GOOGLE_APPLICATION_CREDENTIALS=path/to/credentials.json

# Data Sources
export GOV_POLICY_RSS_URL=https://example.gov/feed.xml
export WELFARE_POLICY_API_URL=https://api.example.org/welfare
export WELFARE_POLICY_API_KEY=your_api_key

# Notifications
export POLICY_WEBHOOK_URL=https://hooks.slack.com/services/...
export POLICY_SLACK_CHANNEL=#policy-notifications

# API
export POLICY_API_TOKEN=your_secure_token
export POLICY_API_PORT=5000
```

3. Verify setup by running a test ingestion:
```
python policy_ingestion.py
```

## Usage

### Running the Scheduler
To start the scheduled jobs:
```
python policy_cron.py
```

### Running the API Server
To start the API server:
```
python policy_api.py
```

### Manual Trigger via API
To manually trigger policy ingestion:
```
curl -X POST \
  http://localhost:5000/api/policies/ingestion \
  -H 'Authorization: Bearer your_secure_token' \
  -H 'Content-Type: application/json'
```

To manually trigger policy broadcast:
```
curl -X POST \
  http://localhost:5000/api/policies/broadcast \
  -H 'Authorization: Bearer your_secure_token' \
  -H 'Content-Type: application/json' \
  -d '{"hours": 48}'
```

## Maintenance

### Logs
Log files are stored in the same directory as the scripts:
- `policy_cron.log`: Scheduler logs
- `policy_api.log`: API server logs

### Monitoring
Check service status via API:
```
curl -X GET \
  http://localhost:5000/api/policies/status \
  -H 'Authorization: Bearer your_secure_token'
``` 