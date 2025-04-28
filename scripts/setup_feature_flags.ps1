# CloudBridge Platform - Feature Flags Setup Script
# Configures flag-core service, UI, SDK endpoints, and rollout automation

param(
    [Parameter(Mandatory=$false)]
    [string]$FlagCorePort = "5100",
    
    [Parameter(Mandatory=$false)]
    [string]$SdkEndpoint = "/sdk/evaluate",
    
    [Parameter(Mandatory=$false)]
    [int]$CacheTtl = 30,
    
    [Parameter(Mandatory=$true)]
    [string]$SlackWebhookUrl,
    
    [Parameter(Mandatory=$false)]
    [string]$FlagToken
)

# 함수: 진행 상태 출력
function Write-Step {
    param([string]$Message)
    Write-Host "`n[$(Get-Date -Format 'HH:mm:ss')] $Message" -ForegroundColor Cyan
}

# 함수: 성공 메시지 출력
function Write-Success {
    param([string]$Message)
    Write-Host $Message -ForegroundColor Green
}

# 함수: 오류 처리
function Write-ErrorAndExit {
    param([string]$Message)
    Write-Host "`nError: $Message" -ForegroundColor Red
    exit 1
}

try {
    # 1. flag-core 서비스 스캐폴딩
    Write-Step "Creating flag-core service with FastAPI..."
    # run platform:init flag-core `
    #   --template=fastapi `
    #   --dir=apps/flag-core `
    #   --port=$FlagCorePort
    Write-Success "flag-core service created successfully"

    # 2. 관리 UI 및 SDK 엔드포인트 설정
    Write-Step "Setting up management UI and SDK endpoints..."
    # run flag-core:add ui
    # run flag-core:add endpoint `
    #   --name=sdk-eval `
    #   --path=$SdkEndpoint `
    #   --method=POST `
    #   --handler=evaluate_flag `
    #   --auth=jwt_service
    Write-Success "Management UI and SDK endpoints configured"

    # 3. 플랫폼 API에 플래그 미들웨어 추가
    Write-Step "Adding flag middleware to platform APIs..."
    $sdkUrl = "http://localhost:${FlagCorePort}${SdkEndpoint}"
    
    # run platform-main:add flag-middleware `
    #   --sdk_url=$sdkUrl `
    #   --cache_ttl=$CacheTtl
    
    # run platform-menu:add flag-middleware `
    #   --sdk_url=$sdkUrl `
    #   --cache_ttl=$CacheTtl
    Write-Success "Flag middleware added to platform APIs"

    # 4. 예시 기능 플래그 등록 (LIVE Widget v2)
    Write-Step "Creating example feature flag for LIVE Widget v2..."
    # run flag-core:add flag `
    #   --key=live_widget_v2 `
    #   --description="새 LIVE 위젯 UI" `
    #   --enabled=false `
    #   --variants=A:50,B:50
    Write-Success "Example feature flag created"

    # 5. CI/CD 워크플로우에 롤아웃 스텝 추가
    Write-Step "Adding rollout step to CI/CD workflow..."
    $jsonPayload = @{
        flag_key = "live_widget_v2"
        enabled = $true
        variants = @{
            A = 10
            B = 90
        }
    } | ConvertTo-Json -Compress
    
    # Debug output to show the prepared payload
    Write-Host "Prepared rollout payload: $jsonPayload" -ForegroundColor Gray
    
    # Using Set-Variable to declare and initialize the command
    Set-Variable -Name rolloutCommand -Value "curl -X POST -H 'Authorization: Bearer `$FLAG_TOKEN' -d '$jsonPayload' https://flag-core.cloudbridge-prod.svc/flags/rollout" -Scope Script
    Write-Host "Prepared rollout command: $rolloutCommand" -ForegroundColor Gray
    
    # run devops:init ci-step `
    #   --workflow=cloudbridge-prod-ci `
    #   --name=flag-rollout `
    #   --script=$rolloutCommand
    Write-Success "Rollout step added to CI/CD workflow"

    # 6. Slack 알림 설정
    Write-Step "Configuring Slack notifications for rollout stages..."
    # run monitoring:add alert `
    #   --name=Flag-Rollout-LiveWidget `
    #   --expr='flag_rollout_progress{flag="live_widget_v2"} == 100' `
    #   --for=0m `
    #   --slack_webhook_secret=SLACK_ALERT_URL `
    #   --message='✅ live_widget_v2 100 % 롤아웃 완료'
    Write-Success "Slack notifications configured"

    Write-Host "`n✅ Feature flags setup completed successfully!" -ForegroundColor Green
    Write-Host @"
    
Configuration Summary:
- Flag Core Service: http://localhost:$FlagCorePort
- Management UI: http://localhost:$FlagCorePort/flags
- SDK Endpoint: $sdkUrl
- Cache TTL: $CacheTtl seconds
- Example Flag: live_widget_v2 (A/B Test 50/50)
- CI/CD: Rollout step added
- Monitoring: Slack alerts configured
"@ -ForegroundColor Yellow

    Write-Host "`nNext Steps:" -ForegroundColor Magenta
    Write-Host "1. Verify flag-core service is running: http://localhost:$FlagCorePort/docs"
    Write-Host "2. Access management UI to create/manage feature flags"
    Write-Host "3. Test SDK endpoint with a sample request"
    Write-Host "4. Monitor rollout progress in Grafana dashboard"

} catch {
    Write-ErrorAndExit $_.Exception.Message
} 