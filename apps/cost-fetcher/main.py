import os
from datetime import datetime, timedelta
from typing import Dict, Optional

import boto3
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import clickhouse_connect
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(title="CloudBridge Cost Fetcher")

# AWS Credentials from Key Vault
AWS_ACCESS_KEY = os.getenv("AWS_COST_ACCESS_KEY")
AWS_SECRET_KEY = os.getenv("AWS_COST_SECRET_KEY")

# ClickHouse connection
CLICKHOUSE_URL = os.getenv("CLICKHOUSE_URL", "http://clickhouse:8123")
clickhouse_client = clickhouse_connect.get_client(
    host='clickhouse',
    port=8123
)

class CostData(BaseModel):
    date: str
    amount: float
    currency: str
    service: str
    region: str

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/costs/daily")
async def get_daily_costs(
    region: str = "ap-northeast-2",
    budget_name: str = "cloudbridge-monthly"
):
    """Fetch daily AWS costs and store in ClickHouse"""
    try:
        # Initialize AWS Cost Explorer client
        cost_explorer = boto3.client(
            'ce',
            aws_access_key_id=AWS_ACCESS_KEY,
            aws_secret_access_key=AWS_SECRET_KEY,
            region_name=region
        )

        # Get today's date and 7 days ago
        end_date = datetime.now().strftime('%Y-%m-%d')
        start_date = (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d')

        # Get cost and usage data
        response = cost_explorer.get_cost_and_usage(
            TimePeriod={
                'Start': start_date,
                'End': end_date
            },
            Granularity='DAILY',
            Metrics=['UnblendedCost'],
            GroupBy=[
                {'Type': 'DIMENSION', 'Key': 'SERVICE'},
                {'Type': 'DIMENSION', 'Key': 'REGION'}
            ]
        )

        # Process and store cost data
        costs = []
        for result in response['ResultsByTime']:
            date = result['TimePeriod']['Start']
            for group in result['Groups']:
                service = group['Keys'][0]
                region = group['Keys'][1]
                amount = float(group['Metrics']['UnblendedCost']['Amount'])
                currency = group['Metrics']['UnblendedCost']['Unit']
                
                cost_data = CostData(
                    date=date,
                    amount=amount,
                    currency=currency,
                    service=service,
                    region=region
                )
                costs.append(cost_data)

                # Store in ClickHouse
                clickhouse_client.command(
                    '''
                    INSERT INTO aws_costs 
                    (date, amount, currency, service, region)
                    VALUES
                    ''',
                    parameters=[
                        date,
                        amount,
                        currency,
                        service,
                        region
                    ]
                )

        return {
            "success": True,
            "message": f"Processed {len(costs)} cost entries",
            "costs": costs
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch AWS costs: {str(e)}"
        )

@app.get("/costs/budget")
async def get_budget_status(
    region: str = "ap-northeast-2",
    budget_name: str = "cloudbridge-monthly"
):
    """Get current AWS budget status"""
    try:
        if not AWS_ACCESS_KEY:
            raise HTTPException(
                status_code=500,
                detail="AWS credentials not found"
            )

        # AWS 계정 ID 추출 (액세스 키에서 추출 또는 환경 변수에서 가져오기)
        account_id = os.getenv("AWS_ACCOUNT_ID")
        if not account_id and AWS_ACCESS_KEY:
            # AWS 액세스 키의 첫 부분이 계정 ID인 경우
            account_id = AWS_ACCESS_KEY.split('_')[0] if '_' in AWS_ACCESS_KEY else None
        
        if not account_id:
            raise HTTPException(
                status_code=500,
                detail="AWS account ID not found"
            )

        budgets = boto3.client(
            'budgets',
            aws_access_key_id=AWS_ACCESS_KEY,
            aws_secret_access_key=AWS_SECRET_KEY,
            region_name=region
        )

        response = budgets.describe_budget(
            AccountId=account_id,
            BudgetName=budget_name
        )

        return {
            "success": True,
            "budget": response['Budget']
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch budget status: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000) 