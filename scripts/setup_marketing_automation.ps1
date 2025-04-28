# CloudBridge Platform 마케팅 자동화 파이프라인 구축 스크립트

Write-Host "===== CloudBridge Platform 마케팅 자동화 파이프라인 구축 시작 =====" -ForegroundColor Cyan

# 1. 마케팅 코어 서비스 설정
Write-Host "`n[1/8] 마케팅 코어 서비스 설정" -ForegroundColor Yellow
Write-Host "마케팅 서비스를 초기화합니다..."
# 실제 실행시 아래 주석 해제
# run platform:init marketing-core `
#   --template=fastapi `
#   --dir=apps/marketing-core `
#   --port=4400

# 2. 캠페인 DB 스키마 설정
Write-Host "`n[2/8] 캠페인 DB 스키마 설정" -ForegroundColor Yellow
Write-Host "세그먼트, 캠페인, 이벤트 테이블을 생성합니다..."
# 실제 실행시 아래 주석 해제
# run marketing-core:add schema `
#   --db_url="postgresql://cloudbridge:pass@localhost:5432/cloudbridge"

# 3. 세그먼트 동기화 설정
Write-Host "`n[3/8] 세그먼트 동기화 설정" -ForegroundColor Yellow
Write-Host "피드백 코어에서 마케팅 코어로 세그먼트 데이터를 동기화합니다..."
# 실제 실행시 아래 주석 해제
# run feedback-core:add sink `
#   --target=marketing-core `
#   --url=http://localhost:4400/segment/upsert

# 4. 알림 코어 서비스 설정
Write-Host "`n[4/8] 알림 코어 서비스 설정" -ForegroundColor Yellow
Write-Host "알림 서비스를 초기화합니다..."
# 실제 실행시 아래 주석 해제
# run platform:init notif-core `
#   --template=fastapi `
#   --dir=apps/notif-core `
#   --port=4500

# 5. FCM 및 SendGrid 키 설정
Write-Host "`n[5/8] FCM 및 SendGrid 키 설정" -ForegroundColor Yellow
Write-Host "알림 서비스에 필요한 API 키를 설정합니다..."
# 실제 실행시 아래 주석 해제
# run security:add key FCM_SERVER_KEY=<YOUR_FCM_KEY_HERE> --service=notif-core
# run security:add key SENDGRID_API_KEY=<YOUR_SENDGRID_KEY_HERE> --service=notif-core

# 6. 마케팅-알림 웹훅 연결
Write-Host "`n[6/8] 마케팅-알림 웹훅 연결" -ForegroundColor Yellow
Write-Host "마케팅 코어에서 알림 코어로 웹훅을 연결합니다..."
# 실제 실행시 아래 주석 해제
# run marketing-core:add dispatcher `
#   --notif_url=http://localhost:4500/send

# 7. 캠페인 스케줄러 설정
Write-Host "`n[7/8] 캠페인 스케줄러 설정" -ForegroundColor Yellow
Write-Host "일일 프로모션 캠페인 스케줄러를 설정합니다..."
# 실제 실행시 아래 주석 해제
# run marketing-core:add cron `
#   --name=daily-personal-promo `
#   --schedule="0 9 * * *" `
#   --segment=positive_feedback `
#   --template=email_promo.html

# 8. 이벤트 트래킹 설정
Write-Host "`n[8/8] 이벤트 트래킹 설정" -ForegroundColor Yellow
Write-Host "알림 이벤트를 분석 코어로 전송하는 웹훅을 설정합니다..."
# 실제 실행시 아래 주석 해제
# run notif-core:add webhook `
#   --event_url=http://localhost:4600/event/ingest

Write-Host "`n===== CloudBridge Platform 마케팅 자동화 파이프라인 구축 완료 =====" -ForegroundColor Cyan
Write-Host "`n주의사항:" -ForegroundColor Yellow
Write-Host "1. PostgreSQL 데이터베이스가 실행 중인지 확인하세요."
Write-Host "2. FCM 및 SendGrid API 키를 올바르게 설정했는지 확인하세요."
Write-Host "3. 각 서비스의 포트가 사용 가능한지 확인하세요."
Write-Host "4. 이메일 템플릿이 올바르게 설정되어 있는지 확인하세요."
Write-Host "`n접속 정보:" -ForegroundColor Green
Write-Host "마케팅 코어: http://localhost:4400"
Write-Host "알림 코어: http://localhost:4500"
Write-Host "분석 코어: http://localhost:4600" 