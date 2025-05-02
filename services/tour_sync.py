import requests
import hashlib
from datetime import datetime
from bs4 import BeautifulSoup
from dao import tourDao

def fetch_gyeonggi_tour():
    """경기도 관광 정보 크롤링"""
    url = "https://www.ggtour.or.kr/tour/main"
    
    try:
        response = requests.get(url, timeout=10)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        for e in soup.select('.tour-list .item'):
            if "양평" not in e.title and "양평" not in e.summary: continue
            
            tourDao.append({
                "tour_id": hashlib.md5(e.a['href'].encode()).hexdigest(),
                "title": e.select_one('.title').text.strip(),
                "description": e.select_one('.summary').text.strip(),
                "image_url": e.select_one('img')['src'],
                "source_url": e.a['href'],
                "region": "양평",
                "created_at": datetime.utcnow().isoformat()
            })
    except Exception as e:
        print(f"Error fetching Gyeonggi tour data: {e}")

def handler():
    """메인 핸들러 함수"""
    fetch_gyeonggi_tour()

if __name__ == "__main__":
    handler() 