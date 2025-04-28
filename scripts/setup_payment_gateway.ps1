# CloudBridge Platform 결제 게이트웨이 통합 스크립트

Write-Host "===== CloudBridge Platform 결제 게이트웨이 통합 시작 =====" -ForegroundColor Cyan

# 1. 결제 게이트웨이 서비스 설정
Write-Host "`n[1/6] 결제 게이트웨이 서비스 설정" -ForegroundColor Yellow
Write-Host "결제 게이트웨이 서비스를 초기화합니다..."
# 실제 실행시 아래 주석 해제
# run platform:init pay-gateway `
#   --template=fastapi `
#   --dir=apps/pay-gateway `
#   --port=4600

# 2. 결제 API 키 설정
Write-Host "`n[2/6] 결제 API 키 설정" -ForegroundColor Yellow
Write-Host "Stripe와 토스페이 API 키를 Key Vault에 등록합니다..."
# 실제 실행시 아래 주석 해제
# run security:add key STRIPE_SECRET=<YOUR_STRIPE_SECRET> --service=pay-gateway
# run security:add key TOSSPAY_SECRET=<YOUR_TOSSPAY_SECRET> --service=pay-gateway

# 3. Stripe 결제 API 설정
Write-Host "`n[3/6] Stripe 결제 API 설정" -ForegroundColor Yellow
Write-Host "Stripe 결제 체크아웃 엔드포인트를 생성합니다..."
# 실제 실행시 아래 주석 해제
# run pay-gateway:add endpoint `
#   --name=stripe-checkout `
#   --path=/pay/stripe/checkout `
#   --method=POST `
#   --handler=stripe_checkout

# 4. 토스페이 결제 API 설정
Write-Host "`n[4/6] 토스페이 결제 API 설정" -ForegroundColor Yellow
Write-Host "토스페이 결제 체크아웃 엔드포인트를 생성합니다..."
# 실제 실행시 아래 주석 해제
# run pay-gateway:add endpoint `
#   --name=toss-checkout `
#   --path=/pay/toss/checkout `
#   --method=POST `
#   --handler=toss_checkout

# 5. 메뉴 API 프록시 설정
Write-Host "`n[5/6] 메뉴 API 프록시 설정" -ForegroundColor Yellow
Write-Host "메뉴 API에 결제 엔드포인트 프록시를 추가합니다..."
# 실제 실행시 아래 주석 해제
# run platform-menu:add payment-proxy `
#   --url=http://localhost:4600/pay `
#   --routes=stripe/checkout,toss/checkout

# 6. 웹훅 설정
Write-Host "`n[6/6] 웹훅 설정" -ForegroundColor Yellow
Write-Host "결제 웹훅을 알림 서비스에 연결합니다..."
# 실제 실행시 아래 주석 해제
# run pay-gateway:add webhook `
#   --path=/pay/webhook `
#   --sink=http://localhost:4500/send

Write-Host "`n===== CloudBridge Platform 결제 게이트웨이 통합 완료 =====" -ForegroundColor Cyan
Write-Host "`n주의사항:" -ForegroundColor Yellow
Write-Host "1. Stripe와 토스페이 API 키가 올바르게 설정되어 있는지 확인하세요."
Write-Host "2. 결제 웹훅 URL이 외부에서 접근 가능한지 확인하세요."
Write-Host "3. 각 서비스의 포트가 사용 가능한지 확인하세요."
Write-Host "4. 결제 실패시 알림이 정상적으로 발송되는지 테스트하세요."
Write-Host "`n접속 정보:" -ForegroundColor Green
Write-Host "결제 게이트웨이: http://localhost:4600"
Write-Host "Stripe 웹훅: http://localhost:4600/pay/webhook"
Write-Host "알림 서비스: http://localhost:4500" 