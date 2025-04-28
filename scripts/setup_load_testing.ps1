# CloudBridge Platform 부하 테스트 및 HPA 검증 스크립트

Write-Host "===== CloudBridge Platform 부하 테스트 및 HPA 검증 설정 시작 =====" -ForegroundColor Cyan

# 1. 메인 API 부하 테스트 스크립트 생성
Write-Host "`n[1/6] 메인 API 부하 테스트 스크립트 생성" -ForegroundColor Yellow
Write-Host "메인 API 부하 테스트 스크립트를 생성합니다..."
# 실제 실행시 아래 주석 해제
# run devops:init k6-script `
#   --name=main-stress `
#   --url=https://platform.autoriseinsight.co.kr/api/main/feed/list `
#   --vus=200 --duration=10m `
#   --rps=400

# 2. 메뉴 API 부하 테스트 스크립트 생성
Write-Host "`n[2/6] 메뉴 API 부하 테스트 스크립트 생성" -ForegroundColor Yellow
Write-Host "메뉴 API 부하 테스트 스크립트를 생성합니다..."
# 실제 실행시 아래 주석 해제
# run devops:init k6-script `
#   --name=menu-stress `
#   --url=https://platform.autoriseinsight.co.kr/api/menu/store/list `
#   --vus=100 --duration=10m `
#   --rps=200

# 3. CI 워크플로우 설정
Write-Host "`n[3/6] CI 워크플로우 설정" -ForegroundColor Yellow
Write-Host "GitHub Actions 워크플로우에 부하 테스트 잡을 추가합니다..."
# 실제 실행시 아래 주석 해제
# run devops:init ci-step `
#   --workflow=cloudbridge-staging-ci `
#   --name=load-test `
#   --script="k6 run k6/main-stress.js && k6 run k6/menu-stress.js"

# 4. HPA 설정
Write-Host "`n[4/6] HPA 설정" -ForegroundColor Yellow
Write-Host "HPA 규칙을 설정합니다..."
# 실제 실행시 아래 주석 해제
# run devops:add hpa `
#   --app=platform-main `
#   --cpu=70 `
#   --min=2 --max=10

# run devops:add hpa `
#   --app=platform-menu `
#   --cpu=70 `
#   --min=2 --max=10

# 5. Grafana 알림 설정
Write-Host "`n[5/6] Grafana 알림 설정" -ForegroundColor Yellow
Write-Host "HPA 스케일링 실패 알림을 설정합니다..."
# 실제 실행시 아래 주석 해제
# run monitoring:add alert `
#   --name=HPA_Failed_Main `
#   --expr='kube_hpa_status_desired_replicas{deployment="platform-main"} < 4' `
#   --for=3m `
#   --slack_webhook_secret=SLACK_ALERT_URL `
#   --message='🚨 HPA: platform-main 원하는 Replica < 4 (부하 대비 부족)'

# run monitoring:add alert `
#   --name=HPA_Failed_Menu `
#   --expr='kube_hpa_status_desired_replicas{deployment="platform-menu"} < 3' `
#   --for=3m `
#   --slack_webhook_secret=SLACK_ALERT_URL `
#   --message='🚨 HPA: platform-menu 원하는 Replica < 3 (부하 대비 부족)'

# 6. Slack 리포트 설정
Write-Host "`n[6/6] Slack 리포트 설정" -ForegroundColor Yellow
Write-Host "테스트 결과 Slack 리포트 자동화를 설정합니다..."
# 실제 실행시 아래 주석 해제
# run devops:add post-script `
#   --workflow=cloudbridge-staging-ci `
#   --step=slack-report `
#   --script="bash scripts/k6_summary_to_slack.sh"

Write-Host "`n===== CloudBridge Platform 부하 테스트 및 HPA 검증 설정 완료 =====" -ForegroundColor Cyan
Write-Host "`n주의사항:" -ForegroundColor Yellow
Write-Host "1. k6 스크립트의 부하 수준이 적절한지 확인하세요."
Write-Host "2. HPA 설정이 워크로드에 맞게 구성되었는지 검토하세요."
Write-Host "3. CI 파이프라인에서 부하 테스트가 정상 실행되는지 확인하세요."
Write-Host "4. Grafana 알림이 적절한 임계값으로 설정되었는지 검토하세요."
Write-Host "5. Slack 리포트 포맷이 가독성 있게 구성되었는지 확인하세요."
Write-Host "6. 테스트 환경의 리소스가 충분한지 확인하세요."

Write-Host "`n부하 테스트 정보:" -ForegroundColor Green
Write-Host "메인 API: 200 VUs, 400 RPS, 10분"
Write-Host "메뉴 API: 100 VUs, 200 RPS, 10분"

Write-Host "`nHPA 설정:" -ForegroundColor Green
Write-Host "CPU 목표 사용률: 70%"
Write-Host "최소-최대 레플리카: 2-10개"

Write-Host "`n알림 임계값:" -ForegroundColor Green
Write-Host "메인 API: 레플리카 4개 미만 3분 지속"
Write-Host "메뉴 API: 레플리카 3개 미만 3분 지속"

Write-Host "`n워크플로우:" -ForegroundColor Green
Write-Host "스테이징 CI: cloudbridge-staging-ci"
Write-Host "부하 테스트 단계: load-test"
Write-Host "결과 리포트: slack-report" 