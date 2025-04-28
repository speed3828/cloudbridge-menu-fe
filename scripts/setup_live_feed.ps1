# CloudBridge Platform LIVE 메뉴 구축 스크립트

Write-Host "===== CloudBridge Platform LIVE 메뉴 구축 시작 =====" -ForegroundColor Cyan

# 1. 미디어 스토리지 설정
Write-Host "`n[1/6] 미디어 스토리지 설정" -ForegroundColor Yellow
Write-Host "S3 버킷과 CloudFront CDN을 설정합니다..."
# 실제 실행시 아래 주석 해제
# run devops:init media-bucket `
#   --bucket=cloudbridge-live-media `
#   --cloudfront=true `
#   --cors="origin=https://platform.autoriseinsight.co.kr,methods=PUT,GET,HEAD"

# 2. LIVE 피드 서비스 설정
Write-Host "`n[2/6] LIVE 피드 서비스 설정" -ForegroundColor Yellow
Write-Host "LIVE 피드 서비스를 초기화합니다..."
# 실제 실행시 아래 주석 해제
# run platform:init live-feed `
#   --template=fastapi `
#   --dir=apps/live-feed `
#   --port=4700

# 3. 업로드 URL 엔드포인트 설정
Write-Host "`n[3/6] 업로드 URL 엔드포인트 설정" -ForegroundColor Yellow
Write-Host "프리사인 업로드 URL 엔드포인트를 생성합니다..."
# 실제 실행시 아래 주석 해제
# run live-feed:add presign `
#   --path=/live/upload-url `
#   --method=POST `
#   --s3_bucket=cloudbridge-live-media `
#   --expires=600

# 4. WebSocket 설정
Write-Host "`n[4/6] WebSocket 설정" -ForegroundColor Yellow
Write-Host "실시간 업데이트를 위한 WebSocket을 설정합니다..."
# 실제 실행시 아래 주석 해제
# run live-feed:add websocket `
#   --path=/live/ws `
#   --channel=live_updates

# 5. LIVE 피드 위젯 설정
Write-Host "`n[5/6] LIVE 피드 위젯 설정" -ForegroundColor Yellow
Write-Host "플랫폼 메인 페이지에 LIVE 피드 위젯을 추가합니다..."
# 실제 실행시 아래 주석 해제
# run platform-main:add live-widget `
#   --ws_url=ws://localhost:4700/live/ws `
#   --cdn_url=https://d111abcdef.cloudfront.net

# 6. 메뉴 항목 추가
Write-Host "`n[6/6] 메뉴 항목 추가" -ForegroundColor Yellow
Write-Host "메뉴 Drawer에 LIVE 링크를 추가합니다..."
# 실제 실행시 아래 주석 해제
# run platform:add menu-item `
#   --name="LIVE" `
#   --route="/live" `
#   --icon="📡"

Write-Host "`n===== CloudBridge Platform LIVE 메뉴 구축 완료 =====" -ForegroundColor Cyan
Write-Host "`n주의사항:" -ForegroundColor Yellow
Write-Host "1. S3 버킷이 올바르게 생성되었는지 확인하세요."
Write-Host "2. CloudFront CDN이 정상적으로 배포되었는지 확인하세요."
Write-Host "3. CORS 설정이 올바른지 확인하세요."
Write-Host "4. WebSocket 연결이 안정적인지 테스트하세요."
Write-Host "5. 업로드 URL이 정상적으로 생성되는지 확인하세요."
Write-Host "`n접속 정보:" -ForegroundColor Green
Write-Host "LIVE 피드 서비스: http://localhost:4700"
Write-Host "WebSocket 엔드포인트: ws://localhost:4700/live/ws"
Write-Host "업로드 URL 엔드포인트: http://localhost:4700/live/upload-url"
Write-Host "CDN URL: https://d111abcdef.cloudfront.net" 