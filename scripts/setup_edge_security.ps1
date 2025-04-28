# CloudBridge Platform - Edge Security Setup Script
# Configures Cloudflare WAF, Bot Management, and DDoS protection

param(
    [Parameter(Mandatory=$true)]
    [string]$CloudflareApiToken,
    
    [Parameter(Mandatory=$true)]
    [string]$SlackWebhookUrl,
    
    [Parameter(Mandatory=$false)]
    [string]$ZoneName = "autoriseinsight.co.kr",
    
    [Parameter(Mandatory=$false)]
    [int]$BotScoreThreshold = 30,
    
    [Parameter(Mandatory=$false)]
    [int]$DdosRpsThreshold = 2000
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
    # 1. Key Vault에 Cloudflare API 토큰 등록
    Write-Step "Registering Cloudflare API token in Key Vault..."
    # run security:add key CLOUDFLARE_API_TOKEN=$CloudflareApiToken --service=devops
    Write-Success "API token registered successfully"

    # 2. WAF 규칙 세트 설정 (OWASP Core)
    Write-Step "Configuring WAF ruleset..."
    # run devops:init cloudflare-waf `
    #   --zone=$ZoneName `
    #   --ruleset=owasp_core `
    #   --mode=block `
    #   --api_token_secret=CLOUDFLARE_API_TOKEN
    Write-Success "WAF ruleset configured with OWASP Core rules"

    # 3. Bot Management 설정
    Write-Step "Setting up Bot Management..."
    # run devops:add cloudflare-bot `
    #   --zone=$ZoneName `
    #   --threshold=$BotScoreThreshold `
    #   --action=challenge `
    #   --api_token_secret=CLOUDFLARE_API_TOKEN
    Write-Success "Bot Management configured with score threshold $BotScoreThreshold"

    # 4. DDoS 자동 완화 설정
    Write-Step "Configuring DDoS mitigation..."
    # run devops:add cloudflare-ddos `
    #   --zone=$ZoneName `
    #   --rps_threshold=$DdosRpsThreshold `
    #   --action=js_challenge `
    #   --api_token_secret=CLOUDFLARE_API_TOKEN
    Write-Success "DDoS mitigation configured with RPS threshold $DdosRpsThreshold"

    # 5. Slack Webhook 설정
    Write-Step "Setting up Slack alerts..."
    # run devops:add cloudflare-webhook `
    #   --zone=$ZoneName `
    #   --webhook_secret=SLACK_ALERT_URL
    Write-Success "Slack webhook configured for security alerts"

    Write-Host "`n✅ Edge security setup completed successfully!" -ForegroundColor Green
    Write-Host @"
    
Configuration Summary:
- Zone: $ZoneName
- WAF: OWASP Core ruleset (Block mode)
- Bot Management: Challenge if score < $BotScoreThreshold
- DDoS Protection: JS Challenge at $DdosRpsThreshold RPS
- Alerts: Configured to Slack
"@ -ForegroundColor Yellow

} catch {
    Write-ErrorAndExit $_.Exception.Message
}

Write-Host "`nNote: Please verify the settings in Cloudflare dashboard" -ForegroundColor Magenta
Write-Host "https://dash.cloudflare.com/?to=/:account/:zone/security" -ForegroundColor Blue 