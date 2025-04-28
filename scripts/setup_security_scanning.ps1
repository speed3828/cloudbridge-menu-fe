# CloudBridge Platform 보안 스캔 자동화 스크립트

Write-Host "===== CloudBridge Platform 보안 스캔 자동화 설정 시작 =====" -ForegroundColor Cyan

# 1. Semgrep 정적 분석 설정
Write-Host "`n[1/4] Semgrep 정적 분석 설정" -ForegroundColor Yellow
Write-Host "OWASP Top 10 기반 정적 분석을 설정합니다..."
# 실제 실행시 아래 주석 해제
# run devops:init ci-step `
#   --workflow=cloudbridge-staging-ci `
#   --name=sast-semgrep `
#   --script="semgrep ci --config=p/owasp-top-ten"

# 2. Trivy 컨테이너 스캔 설정
Write-Host "`n[2/4] Trivy 컨테이너 스캔 설정" -ForegroundColor Yellow
Write-Host "Critical 취약점 스캔을 설정합니다..."
# 실제 실행시 아래 주석 해제
# run devops:init ci-step `
#   --workflow=cloudbridge-staging-ci `
#   --name=trivy-scan `
#   --script="trivy image --severity CRITICAL --exit-code 1 docker.io/<YOUR_DOCKER_ID>/platform-main:$IMAGE_TAG && trivy image --severity CRITICAL --exit-code 1 docker.io/<YOUR_DOCKER_ID>/platform-menu:$IMAGE_TAG"

# 3. OWASP ZAP 동적 스캔 설정
Write-Host "`n[3/4] OWASP ZAP 동적 스캔 설정" -ForegroundColor Yellow
Write-Host "스테이징 환경 동적 스캔을 설정합니다..."
# 실제 실행시 아래 주석 해제
# run devops:init ci-step `
#   --workflow=cloudbridge-staging-ci `
#   --name=zap-dast `
#   --script="zap-cli quick-scan --self-contained --spider --ajax-spider --scanners all https://platform.autoriseinsight.co.kr"

# 4. Slack 리포트 설정
Write-Host "`n[4/4] Slack 리포트 설정" -ForegroundColor Yellow
Write-Host "보안 스캔 결과 Slack 리포트를 설정합니다..."
# 실제 실행시 아래 주석 해제
# run devops:add post-script `
#   --workflow=cloudbridge-staging-ci `
#   --step=slack-security-report `
#   --script="bash scripts/security_summary_to_slack.sh"

Write-Host "`n===== CloudBridge Platform 보안 스캔 자동화 설정 완료 =====" -ForegroundColor Cyan
Write-Host "`n주의사항:" -ForegroundColor Yellow
Write-Host "1. Semgrep 규칙이 프로젝트에 적합한지 검토하세요."
Write-Host "2. Trivy 스캔 임계값이 보안 정책에 부합하는지 확인하세요."
Write-Host "3. ZAP 스캔 대상 URL이 올바른지 확인하세요."
Write-Host "4. Docker 이미지 태그가 올바르게 설정되었는지 확인하세요."
Write-Host "5. Slack 알림이 적절한 채널로 전송되는지 확인하세요."
Write-Host "6. 스캔 결과를 정기적으로 검토하고 조치하세요."

Write-Host "`n보안 스캔 정보:" -ForegroundColor Green
Write-Host "정적 분석: OWASP Top 10 규칙셋"
Write-Host "컨테이너 스캔: Critical 취약점"
Write-Host "동적 스캔: Full Spider + AJAX Spider"

Write-Host "`n스캔 대상:" -ForegroundColor Green
Write-Host "코드베이스: 전체 리포지토리"
Write-Host "컨테이너: platform-main, platform-menu"
Write-Host "URL: https://platform.autoriseinsight.co.kr"

Write-Host "`n워크플로우:" -ForegroundColor Green
Write-Host "스테이징 CI: cloudbridge-staging-ci"
Write-Host "스캔 단계: sast-semgrep, trivy-scan, zap-dast"
Write-Host "결과 리포트: slack-security-report"

Write-Host "`n실행 순서:" -ForegroundColor Green
Write-Host "1. Semgrep 정적 분석"
Write-Host "2. Trivy 컨테이너 스캔"
Write-Host "3. OWASP ZAP 동적 스캔"
Write-Host "4. Slack 결과 리포트" 