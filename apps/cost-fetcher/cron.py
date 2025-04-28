import os
import sys
import logging
from datetime import datetime
import requests
from dotenv import load_dotenv

# 로깅 설정
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('aws-cost-daily')

def collect_costs():
    """일일 AWS 비용 데이터 수집"""
    try:
        # 환경 변수 로드
        load_dotenv()
        
        # API 엔드포인트 설정
        api_url = "http://localhost:5000/costs/daily"
        
        # API 호출
        response = requests.get(api_url, params={
            "region": os.getenv("AWS_REGION", "ap-northeast-2"),
            "budget_name": os.getenv("AWS_BUDGET_NAME", "cloudbridge-monthly")
        })
        
        if response.status_code != 200:
            logger.error(f"API 호출 실패: {response.text}")
            sys.exit(1)
            
        data = response.json()
        logger.info(f"비용 데이터 수집 완료: {data['message']}")
        
        # 예산 상태 확인
        budget_response = requests.get(
            "http://localhost:5000/costs/budget",
            params={
                "region": os.getenv("AWS_REGION", "ap-northeast-2"),
                "budget_name": os.getenv("AWS_BUDGET_NAME", "cloudbridge-monthly")
            }
        )
        
        if budget_response.status_code == 200:
            budget_data = budget_response.json()
            logger.info(f"예산 상태: {budget_data['budget']}")
        else:
            logger.warning(f"예산 상태 조회 실패: {budget_response.text}")
        
        return True
        
    except Exception as e:
        logger.error(f"비용 데이터 수집 중 오류 발생: {str(e)}")
        return False

if __name__ == "__main__":
    logger.info("AWS 비용 데이터 수집 시작")
    success = collect_costs()
    if success:
        logger.info("작업 완료")
        sys.exit(0)
    else:
        logger.error("작업 실패")
        sys.exit(1) 