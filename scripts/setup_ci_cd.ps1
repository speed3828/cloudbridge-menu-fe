# CloudBridge Platform CI/CD 설정 스크립트

Write-Host "===== CloudBridge Platform CI/CD 설정 시작 =====" -ForegroundColor Cyan

# 1. GitHub Actions 워크플로우 생성
Write-Host "`n[1/3] GitHub Actions 워크플로우 생성" -ForegroundColor Yellow
Write-Host "CI/CD 파이프라인 워크플로우 파일을 생성합니다..."
# 실제 실행시 아래 주석 해제
# run devops:init ci `
#   --workflow=cloudbridge-ci `
#   --apps=platform-main,platform-menu `
#   --registry=docker.io/<YOUR_DOCKER_ID> `
#   --namespace=cloudbridge-staging `
#   --helm_chart_path=helm `
#   --slack_webhook_secret=SLACK_WEBHOOK_URL

# 2. GitHub Secrets 설정 안내
Write-Host "`n[2/3] GitHub Secrets 설정 안내" -ForegroundColor Yellow
Write-Host "다음 Secrets를 GitHub 레포지토리에 등록해주세요:"
Write-Host "1. DOCKERHUB_USERNAME - Docker Hub 사용자 이름"
Write-Host "2. DOCKERHUB_TOKEN - Docker Hub 액세스 토큰"
Write-Host "3. KUBE_CONFIG - 스테이징 클러스터의 base64 인코딩된 kubeconfig"
Write-Host "4. SLACK_WEBHOOK_URL - Slack 알림을 위한 웹훅 URL"
Write-Host "5. OPENAI_API_KEY - OpenAI API 키"
Write-Host "6. ANTHROPIC_API_KEY - Anthropic API 키"
Write-Host "`n설정 방법: GitHub 레포지토리 → Settings → Secrets and variables → Actions → New repository secret"

# 3. 변경사항 커밋 및 푸시
Write-Host "`n[3/3] 변경사항 커밋 및 푸시" -ForegroundColor Yellow
Write-Host "CI/CD 설정을 커밋하고 푸시합니다..."
# 실제 실행시 아래 주석 해제
# git add .github/workflows/cloudbridge-ci.yml
# git commit -m "chore: add GitHub Actions CI/CD"
# git push origin cloudbridge-platform

Write-Host "`n===== CloudBridge Platform CI/CD 설정 완료 =====" -ForegroundColor Cyan
Write-Host "`n주의사항:" -ForegroundColor Yellow
Write-Host "1. GitHub Secrets가 모두 올바르게 설정되었는지 확인하세요."
Write-Host "2. Docker Hub 레포지토리가 생성되어 있는지 확인하세요."
Write-Host "3. Kubernetes 클러스터에 대한 접근 권한이 있는지 확인하세요."
Write-Host "4. Slack 웹훅 URL이 유효한지 확인하세요." 