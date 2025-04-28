# CloudBridge Platform 개인정보 보호 기능 구축 스크립트

Write-Host "===== CloudBridge Platform 개인정보 보호 기능 구축 시작 =====" -ForegroundColor Cyan

# 1. 데이터 내보내기 엔드포인트 설정
Write-Host "`n[1/6] 데이터 내보내기 엔드포인트 설정" -ForegroundColor Yellow
Write-Host "사용자 데이터 내보내기 엔드포인트를 생성합니다..."
# 실제 실행시 아래 주석 해제
# run user-core:add endpoint `
#   --name=data-export `
#   --path=/user/data/export `
#   --method=POST `
#   --handler=export_user_data `
#   --auth=jwt_user

# 2. 데이터 삭제 엔드포인트 설정
Write-Host "`n[2/6] 데이터 삭제 엔드포인트 설정" -ForegroundColor Yellow
Write-Host "사용자 데이터 완전 삭제 엔드포인트를 생성합니다..."
# 실제 실행시 아래 주석 해제
# run user-core:add endpoint `
#   --name=data-delete `
#   --path=/user/data/delete `
#   --method=POST `
#   --handler=erase_user_data `
#   --auth=jwt_user `
#   --confirm_double_optin=true

# 3. 내보내기 핸들러 구현
Write-Host "`n[3/6] 내보내기 핸들러 구현" -ForegroundColor Yellow
Write-Host "S3 Presigned ZIP 링크 생성 핸들러를 구현합니다..."
# 실제 실행시 아래 주석 해제
# run user-core:add export-handler `
#   --s3_bucket=cloudbridge-user-export `
#   --expires=3600

# 4. 삭제 핸들러 구현
Write-Host "`n[4/6] 삭제 핸들러 구현" -ForegroundColor Yellow
Write-Host "데이터베이스 및 S3 물리 삭제 핸들러를 구현합니다..."
# 실제 실행시 아래 주석 해제
# run user-core:add delete-handler `
#   --mongo_uri=mongodb://mongo-svc:27017 `
#   --postgres_uri=postgresql://cloudbridge:pass@localhost:5432/cloudbridge `
#   --s3_bucket=cloudbridge-user-export `
#   --kafka_topic=user.delete

# 5. 키 로테이션 설정
Write-Host "`n[5/6] 키 로테이션 설정" -ForegroundColor Yellow
Write-Host "AES-256 키 월간 로테이션 CronJob을 설정합니다..."
# 실제 실행시 아래 주석 해제
# run security:add key-rotation `
#   --kms_key_id=alias/cloudbridge-master `
#   --schedule="0 4 1 * *"

# 6. DLP 스캐너 설정
Write-Host "`n[6/6] DLP 스캐너 설정" -ForegroundColor Yellow
Write-Host "민감정보 스캐너를 설정합니다..."
# 실제 실행시 아래 주석 해제
# run security:init dlp-scanner `
#   --targets=s3://cloudbridge-live-media,mongo://mongo-svc:27017/cloudbridge `
#   --schedule="0 2 * * 0" `
#   --notify_slack_secret=SLACK_ALERT_URL

Write-Host "`n===== CloudBridge Platform 개인정보 보호 기능 구축 완료 =====" -ForegroundColor Cyan
Write-Host "`n주의사항:" -ForegroundColor Yellow
Write-Host "1. 데이터 내보내기가 정상적으로 작동하는지 테스트하세요."
Write-Host "2. 데이터 삭제가 완전히 이루어지는지 확인하세요."
Write-Host "3. S3 Presigned URL이 올바른 만료 시간으로 생성되는지 확인하세요."
Write-Host "4. 키 로테이션이 정상적으로 실행되는지 모니터링하세요."
Write-Host "5. DLP 스캐너 알림이 제대로 발송되는지 테스트하세요."
Write-Host "6. 모든 개인정보 처리 로그가 정상적으로 기록되는지 확인하세요."

Write-Host "`n스케줄 정보:" -ForegroundColor Green
Write-Host "키 로테이션: 매월 1일 04:00"
Write-Host "DLP 스캔: 매주 일요일 02:00"

Write-Host "`n엔드포인트 정보:" -ForegroundColor Green
Write-Host "데이터 내보내기: POST /user/data/export"
Write-Host "데이터 삭제: POST /user/data/delete"

Write-Host "`n저장소 정보:" -ForegroundColor Green
Write-Host "내보내기 S3 버킷: cloudbridge-user-export"
Write-Host "미디어 S3 버킷: cloudbridge-live-media"
Write-Host "MongoDB URI: mongodb://mongo-svc:27017"
Write-Host "PostgreSQL URI: postgresql://cloudbridge:pass@localhost:5432/cloudbridge" 