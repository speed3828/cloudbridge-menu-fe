# CloudBridge Platform 프로덕션 환경 설정 스크립트

Write-Host "===== CloudBridge Platform 프로덕션 환경 설정 시작 =====" -ForegroundColor Cyan

# 1. 프로덕션 네임스페이스 생성
Write-Host "`n[1/7] 프로덕션 네임스페이스 생성" -ForegroundColor Yellow
Write-Host "Kubernetes 프로덕션 네임스페이스를 생성합니다..."
# 실제 실행시 아래 주석 해제
# kubectl create ns cloudbridge-prod

# 2. 시크릿 복사
Write-Host "`n[2/7] 시크릿 복사" -ForegroundColor Yellow
Write-Host "스테이징에서 프로덕션으로 시크릿을 복사합니다..."
# 실제 실행시 아래 주석 해제
# kubectl get secret api-keys -n cloudbridge-staging -o yaml | `
#   sed 's/cloudbridge-staging/cloudbridge-prod/' | `
#   kubectl apply -n cloudbridge-prod -f -

# 3. Helm 값 파일 생성
Write-Host "`n[3/7] Helm 값 파일 생성" -ForegroundColor Yellow
Write-Host "프로덕션용 Helm 값 파일을 생성합니다..."
# 실제 실행시 아래 주석 해제
# $timestamp = Get-Date -Format "yyyyMMddHHmm"
# run devops:init helm-values `
#   --apps=platform-main,platform-menu `
#   --namespace=cloudbridge-prod `
#   --image.tag="prod-$timestamp" `
#   --replica.main=4 --replica.menu=4 `
#   --hpa.cpu=70 `
#   --env.OPENAI_API_KEY=secret:api-keys.OPENAI_API_KEY `
#   --env.ANTHROPIC_API_KEY=secret:api-keys.ANTHROPIC_API_KEY

# 4. CI/CD 워크플로우 설정
Write-Host "`n[4/7] CI/CD 워크플로우 설정" -ForegroundColor Yellow
Write-Host "GitHub Actions 프로덕션 워크플로우를 추가합니다..."
# 실제 실행시 아래 주석 해제
# run devops:init ci `
#   --workflow=cloudbridge-prod-ci `
#   --apps=platform-main,platform-menu `
#   --registry=docker.io/<YOUR_DOCKER_ID> `
#   --namespace=cloudbridge-prod `
#   --helm_chart_path=helm `
#   --trigger_branch=main `
#   --slack_webhook_secret=SLACK_WEBHOOK_URL

# 5. 백업 CronJob 설정
Write-Host "`n[5/7] 백업 CronJob 설정" -ForegroundColor Yellow
Write-Host "주간 백업 CronJob을 설정합니다..."
# 실제 실행시 아래 주석 해제
# run devops:init backup `
#   --namespace=cloudbridge-prod `
#   --rds_instance=cloudbridge-postgres `
#   --mongo_uri=mongodb://mongo-svc:27017 `
#   --s3_bucket=cloudbridge-backup `
#   --schedule="0 3 * * 0"

# 6. Helm 배포
Write-Host "`n[6/7] Helm 배포" -ForegroundColor Yellow
Write-Host "Helm을 사용하여 프로덕션 환경에 배포합니다..."
# 실제 실행시 아래 주석 해제
# helm upgrade --install platform-main ./helm/platform-main -n cloudbridge-prod -f helm/platform-main/values-prod.yaml
# helm upgrade --install platform-menu ./helm/platform-menu -n cloudbridge-prod -f helm/platform-menu/values-prod.yaml

# 7. Smoke Test
Write-Host "`n[7/7] Smoke Test" -ForegroundColor Yellow
Write-Host "프로덕션 환경의 상태를 테스트합니다..."
# 실제 실행시 아래 주석 해제
# run test:smoke `
#   --urls="https://platform.autoriseinsight.co.kr/api/main/healthz,https://platform.autoriseinsight.co.kr/api/menu/healthz" `
#   --expect_status=200

Write-Host "`n===== CloudBridge Platform 프로덕션 환경 설정 완료 =====" -ForegroundColor Cyan
Write-Host "`n주의사항:" -ForegroundColor Yellow
Write-Host "1. 프로덕션 네임스페이스가 올바르게 생성되었는지 확인하세요."
Write-Host "2. 시크릿이 정상적으로 복사되었는지 확인하세요."
Write-Host "3. Helm 값 파일의 설정이 적절한지 검토하세요."
Write-Host "4. CI/CD 워크플로우가 올바르게 구성되었는지 확인하세요."
Write-Host "5. 백업 CronJob이 정상적으로 실행되는지 모니터링하세요."
Write-Host "6. 프로덕션 배포 후 모든 서비스가 정상 작동하는지 확인하세요."
Write-Host "`n접속 정보:" -ForegroundColor Green
Write-Host "프로덕션 URL: https://platform.autoriseinsight.co.kr"
Write-Host "Kubernetes 네임스페이스: cloudbridge-prod"
Write-Host "백업 S3 버킷: cloudbridge-backup" 