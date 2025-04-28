# CloudBridge Platform A/B 테스트 설정 스크립트

Write-Host "===== CloudBridge Platform A/B 테스트 설정 시작 =====" -ForegroundColor Cyan

# 1. ClickHouse KPI 머티리얼라이즈드 뷰 생성
Write-Host "`n[1/7] ClickHouse KPI 머티리얼라이즈드 뷰 설정" -ForegroundColor Yellow
Write-Host "일별 KPI 집계를 위한 머티리얼라이즈드 뷰를 생성합니다..."
# 실제 실행시 아래 주석 해제
# run analytics-core:add materialized-view `
#   --name=kpi_daily `
#   --source_table=http_requests `
#   --target_table=kpi_daily `
#   --query="SELECT toDate(time) AS d, service, count() AS hits, quantile(0.95)(duration_ms) AS p95 FROM http_requests GROUP BY d, service"

# 2. AB Test Core 서비스 생성
Write-Host "`n[2/7] AB Test Core 서비스 생성" -ForegroundColor Yellow
Write-Host "FastAPI 기반 AB 테스트 서비스를 생성합니다..."
# 실제 실행시 아래 주석 해제
# run platform:init ab-test-core `
#   --template=fastapi `
#   --dir=apps/ab-test-core `
#   --port=4900

# 3. 실험 정의 API 엔드포인트 생성
Write-Host "`n[3/7] 실험 정의 API 설정" -ForegroundColor Yellow
Write-Host "실험 생성 엔드포인트를 추가합니다..."
# 실제 실행시 아래 주석 해제
# run ab-test-core:add endpoint `
#   --name=create-experiment `
#   --path=/experiment `
#   --method=POST `
#   --handler=create_experiment `
#   --auth=jwt_admin

# 4. 트래픽 분할 미들웨어 설정
Write-Host "`n[4/7] 트래픽 분할 미들웨어 설정" -ForegroundColor Yellow
Write-Host "메인 API와 메뉴 API에 AB 테스트 미들웨어를 추가합니다..."
# 실제 실행시 아래 주석 해제
# run platform-main:add ab-middleware `
#   --service_url=http://localhost:4900/assign `
#   --cookie_name=ab_tag `
#   --percentage_a=50 --percentage_b=50

# run platform-menu:add ab-middleware `
#   --service_url=http://localhost:4900/assign `
#   --cookie_name=ab_tag `
#   --percentage_a=50 --percentage_b=50

# 5. 결과 집계 CRON 작업 설정
Write-Host "`n[5/7] 결과 집계 CRON 설정" -ForegroundColor Yellow
Write-Host "시간별 결과 집계 CRON 작업을 설정합니다..."
# 실제 실행시 아래 주석 해제
# run ab-test-core:add cron `
#   --name=agg-hourly `
#   --schedule="0 * * * *" `
#   --query="INSERT INTO ab_results SELECT experiment_id, variant, count() AS hits, avg(conv) AS cr FROM raw_events WHERE ts >= now() - 3600 GROUP BY experiment_id, variant"

# 6. Grafana 대시보드 설정
Write-Host "`n[6/7] Grafana 대시보드 설정" -ForegroundColor Yellow
Write-Host "AB 테스트 대시보드를 생성합니다..."
# 실제 실행시 아래 주석 해제
# run monitoring:add grafana-dashboard `
#   --name=AB-Test-Overview `
#   --template=ab_test_overview.json

# 7. Slack 웹훅 설정
Write-Host "`n[7/7] Slack 웹훅 설정" -ForegroundColor Yellow
Write-Host "실험 완료 알림을 위한 Slack 웹훅을 설정합니다..."
# 실제 실행시 아래 주석 해제
# run ab-test-core:add webhook `
#   --path=/experiment/complete `
#   --sink=https://hooks.slack.com/services/${SLACK_ALERT_URL}

Write-Host "`n===== CloudBridge Platform A/B 테스트 설정 완료 =====" -ForegroundColor Cyan

Write-Host "`n주의사항:" -ForegroundColor Yellow
Write-Host "1. ClickHouse 연결 정보가 올바른지 확인하세요."
Write-Host "2. AB Test Core 서비스가 정상적으로 시작되었는지 확인하세요."
Write-Host "3. JWT 인증이 올바르게 설정되었는지 확인하세요."
Write-Host "4. CRON 작업이 정상적으로 등록되었는지 확인하세요."
Write-Host "5. Grafana 대시보드 템플릿이 존재하는지 확인하세요."
Write-Host "6. Slack 웹훅 URL이 유효한지 확인하세요."

Write-Host "`n구성 정보:" -ForegroundColor Green
Write-Host "AB Test Core: http://localhost:4900"
Write-Host "KPI 뷰: kpi_daily"
Write-Host "CRON 스케줄: 매시 정각"
Write-Host "트래픽 분할: 50/50" 