# CloudBridge Platform 모니터링 및 알림 설정 스크립트

Write-Host "===== CloudBridge Platform 모니터링 및 알림 설정 시작 =====" -ForegroundColor Cyan

# 1. 모니터링 스택 설치
Write-Host "`n[1/4] 모니터링 스택 설치" -ForegroundColor Yellow
Write-Host "Loki, Prometheus, Grafana 스택을 설치합니다..."
# 실제 실행시 아래 주석 해제
# run devops:init monitoring `
#   --stack=grafana,loki,prometheus `
#   --namespace=cloudbridge-staging `
#   --prom_scrape_apps=platform-main:4000,platform-menu:4100

# 2. Grafana 데이터소스 설정
Write-Host "`n[2/4] Grafana 데이터소스 설정" -ForegroundColor Yellow
Write-Host "Prometheus 데이터소스를 Grafana에 등록합니다..."
# 실제 실행시 아래 주석 해제
# run monitoring:add grafana-datasource `
#   --type=prometheus `
#   --url=http://prometheus:9090

# 3. Grafana 대시보드 설정
Write-Host "`n[3/4] Grafana 대시보드 설정" -ForegroundColor Yellow
Write-Host "API 모니터링 대시보드를 생성합니다..."
# 실제 실행시 아래 주석 해제
# run monitoring:add grafana-dashboard `
#   --name=Platform-API `
#   --template=latency_error_split.json

# 4. 알림 규칙 설정
Write-Host "`n[4/4] 알림 규칙 설정" -ForegroundColor Yellow
Write-Host "Slack 알림 규칙을 설정합니다..."

# Main API 지연 시간 알림
Write-Host "Main API 지연 시간 알림 규칙을 설정합니다..."
# 실제 실행시 아래 주석 해제
# run monitoring:add alert `
#   --name=High-Latency-Main `
#   --expr='histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket{job="platform-main"}[5m])) by (le)) > 0.4' `
#   --for=5m `
#   --slack_webhook_secret=SLACK_ALERT_URL `
#   --message='🚨 Main-API P95 latency > 400 ms (5 m)'

# Menu API 지연 시간 알림
Write-Host "Menu API 지연 시간 알림 규칙을 설정합니다..."
# 실제 실행시 아래 주석 해제
# run monitoring:add alert `
#   --name=High-Latency-Menu `
#   --expr='histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket{job="platform-menu"}[5m])) by (le)) > 0.4' `
#   --for=5m `
#   --slack_webhook_secret=SLACK_ALERT_URL `
#   --message='🚨 Menu-API P95 latency > 400 ms (5 m)'

Write-Host "`n===== CloudBridge Platform 모니터링 및 알림 설정 완료 =====" -ForegroundColor Cyan
Write-Host "`n주의사항:" -ForegroundColor Yellow
Write-Host "1. Grafana 관리자 비밀번호를 안전하게 보관하세요."
Write-Host "2. Slack 웹훅 URL이 올바르게 설정되었는지 확인하세요."
Write-Host "3. Prometheus 스크래핑 설정이 올바른지 확인하세요."
Write-Host "4. 알림 규칙의 임계값이 적절한지 확인하세요."
Write-Host "`n접속 정보:" -ForegroundColor Green
Write-Host "Grafana: https://grafana.autoriseinsight.co.kr"
Write-Host "Prometheus: https://prometheus.autoriseinsight.co.kr"
Write-Host "Loki: https://loki.autoriseinsight.co.kr" 