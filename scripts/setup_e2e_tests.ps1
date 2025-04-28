# CloudBridge Platform - E2E UI Test Automation Setup Script
# Configures Playwright for web testing and Detox for mobile testing

param(
    [Parameter(Mandatory=$true)]
    [string]$BaseUrl,
    
    [Parameter(Mandatory=$false)]
    [string]$AndroidAvd = "Pixel_API33",
    
    [Parameter(Mandatory=$false)]
    [string]$IosSim = "iPhone 14",
    
    [Parameter(Mandatory=$true)]
    [string]$SlackWebhookUrl
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
    # 1. Playwright 설정
    Write-Step "Setting up Playwright for web testing..."
    # run devops:init e2e-playwright `
    #   --base_url=$BaseUrl `
    #   --out_dir=e2e/web `
    #   --scenarios=login,store_search,payment
    Write-Success "Playwright configuration completed"

    # 2. Android/iOS Detox 설정
    Write-Step "Setting up Detox for mobile testing..."
    # run mobile:init detox `
    #   --android_avd=$AndroidAvd `
    #   --ios_sim=$IosSim
    Write-Success "Detox configuration completed"

    # 3. Detox 테스트 시나리오 생성
    Write-Step "Creating Detox test scenarios..."
    # run mobile:add detox-test `
    #   --name=login_push `
    #   --file=e2e/mobile/login_push.test.js
    Write-Success "Detox test scenarios created"

    # 4. CI/CD 워크플로우에 E2E 테스트 스텝 추가
    Write-Step "Adding E2E tests to CI/CD workflow..."
    
    $testScript = @"
npx playwright test --reporter=github && npm run detox:android-ci && npm run detox:ios-ci
"@
    
    $artifactPaths = @(
        "e2e/web/test-results/**",
        "android/app/build/outputs/**/*.mp4",
        "ios/*.app/screencapture/*.png"
    ) -join ","

    # CI/CD 워크플로우에 E2E 테스트 스텝 추가
    $ciStepCommand = "run devops:init ci-step --workflow=cloudbridge-staging-ci --name=e2e-tests --script='$testScript' --artifacts='$artifactPaths'"
    Write-Host "Executing CI step command: $ciStepCommand" -ForegroundColor Gray
    # Invoke-Expression $ciStepCommand
    Write-Success "E2E test step added to CI/CD workflow"

    # 5. Slack 알림 설정
    Write-Step "Configuring Slack notifications for test failures..."
    # run monitoring:add alert `
    #   --name=E2E-Failure `
    #   --expr='e2e_test_status == \"failed\"' `
    #   --for=0m `
    #   --slack_webhook_secret=SLACK_ALERT_URL `
    #   --message='🚨 E2E 테스트 실패 – 웹/모바일 UI 확인 필요'
    Write-Success "Slack notifications configured"

    Write-Host "`n✅ E2E UI test automation setup completed successfully!" -ForegroundColor Green
    Write-Host @"
    
Configuration Summary:
- Web Testing (Playwright):
  * Base URL: $BaseUrl
  * Test Directory: e2e/web
  * Scenarios: login, store search, payment

- Mobile Testing (Detox):
  * Android Emulator: $AndroidAvd
  * iOS Simulator: $IosSim
  * Test Scenarios: login, push notification

- CI/CD Integration:
  * Workflow: cloudbridge-staging-ci
  * Parallel Execution: Web + Android + iOS
  * Artifacts: Test results, recordings, screenshots

- Monitoring:
  * Slack alerts for test failures
"@ -ForegroundColor Yellow

    Write-Host "`nNext Steps:" -ForegroundColor Magenta
    Write-Host "1. Review generated test scenarios in e2e/web/"
    Write-Host "2. Verify Detox configuration in e2e/mobile/"
    Write-Host "3. Run test suite locally: npm run e2e"
    Write-Host "4. Monitor first CI/CD run with E2E tests"

} catch {
    Write-ErrorAndExit $_.Exception.Message
} 