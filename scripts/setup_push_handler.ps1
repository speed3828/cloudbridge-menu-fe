# CloudBridge Platform 푸시 알림 핸들러 설정 스크립트

Write-Host "===== CloudBridge Platform 푸시 알림 핸들러 설정 시작 =====" -ForegroundColor Cyan

# 1. Python 가상환경 생성 및 활성화
Write-Host "`n[1/4] Python 가상환경 설정" -ForegroundColor Yellow
Write-Host "가상환경을 생성하고 활성화합니다..."
python -m venv venv
.\venv\Scripts\activate

# 2. 필요한 패키지 설치
Write-Host "`n[2/4] 패키지 설치" -ForegroundColor Yellow
Write-Host "Firebase Admin SDK 및 FastAPI 패키지를 설치합니다..."
pip install firebase-admin fastapi uvicorn[standard] python-dotenv

# 3. requirements.txt 업데이트
Write-Host "`n[3/4] Requirements 파일 업데이트" -ForegroundColor Yellow
Write-Host "설치된 패키지 목록을 requirements.txt에 저장합니다..."
pip freeze > requirements.txt

# 4. Firebase 서비스 계정 설정
Write-Host "`n[4/4] Firebase 설정" -ForegroundColor Yellow
Write-Host @"
Firebase 서비스 계정 설정 방법:

1. Firebase Console에서 프로젝트 설정 → 서비스 계정으로 이동
2. 'Python' 선택 후 '새 비공개 키 생성' 클릭
3. 다운로드된 JSON 파일을 안전한 위치에 저장
4. .env 파일에 다음 내용 추가:
   GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/serviceAccountKey.json

주의: 서비스 계정 키는 절대 버전 관리에 포함하지 마세요!
"@

Write-Host "`n===== CloudBridge Platform 푸시 알림 핸들러 설정 완료 =====" -ForegroundColor Cyan

Write-Host "`n주의사항:" -ForegroundColor Yellow
Write-Host "1. 가상환경이 활성화되어 있는지 확인하세요."
Write-Host "2. Firebase 서비스 계정 키가 올바른 위치에 있는지 확인하세요."
Write-Host "3. .env 파일이 .gitignore에 포함되어 있는지 확인하세요."
Write-Host "4. requirements.txt가 최신 상태인지 확인하세요."

Write-Host "`n환경 설정:" -ForegroundColor Green
Write-Host "• Python 가상환경: ./venv"
Write-Host "• 필수 패키지: firebase-admin, fastapi, uvicorn"
Write-Host "• 설정 파일: .env, serviceAccountKey.json" 