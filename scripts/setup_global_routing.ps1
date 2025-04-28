# CloudBridge Platform - Global Smart Routing Setup Script
###############################################################################
# 35) 글로벌 스마트 라우팅(GSLB) + Edge KV 캐싱
###############################################################################

param(
    [Parameter(Mandatory=$true)]
    [string]$CloudflareApiToken,
    
    [Parameter(Mandatory=$true)]
    [string]$SlackWebhookUrl,
    
    [Parameter(Mandatory=$false)]
    [string]$PrimaryAlb = "alb-prod.ap-northeast-2.elb.amazonaws.com",
    
    [Parameter(Mandatory=$false)]
    [string]$SecondaryAlb = "alb-prod-sg.ap-southeast-1.elb.amazonaws.com",
    
    [Parameter(Mandatory=$false)]
    [string]$DomainName = "platform.autoriseinsight.co.kr",
    
    [Parameter(Mandatory=$false)]
    [string]$HealthCheckPath = "/api/main/healthz"
)

# 함수: 의존성 확인
function Test-Dependencies {
    Write-Step "Checking dependencies..."
    
    # Cloudflare CLI 확인
    if (-not (Get-Command "cloudflared" -ErrorAction SilentlyContinue)) {
        Write-ErrorAndExit "Cloudflare CLI (cloudflared) is not installed. Please install it first."
    }
    
    # AWS CLI 확인
    if (-not (Get-Command "aws" -ErrorAction SilentlyContinue)) {
        Write-ErrorAndExit "AWS CLI is not installed. Please install it first."
    }
    
    # PowerShell 모듈 확인
    $requiredModules = @("AWS.Tools.Common", "AWS.Tools.CloudFront")
    foreach ($module in $requiredModules) {
        if (-not (Get-Module -ListAvailable -Name $module)) {
            Write-ErrorAndExit "Required PowerShell module '$module' is not installed."
        }
    }
    
    Write-Success "All dependencies are satisfied"
}

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

# 함수: 명령어 실행 및 결과 확인
function Invoke-CommandWithCheck {
    param(
        [string]$Command,
        [string]$ErrorMessage
    )
    
    try {
        $result = Invoke-Expression $Command
        if ($LASTEXITCODE -ne 0) {
            throw $ErrorMessage
        }
        return $result
    }
    catch {
        Write-ErrorAndExit "$ErrorMessage`: $_"
    }
}

try {
    # 의존성 확인
    Test-Dependencies
    
    # 35-1. Cloudflare Load Balancer 풀 정의
    Write-Step "Configuring Cloudflare Load Balancer pools..."
    $lbCmd = @"
run devops:init cf-loadbalancer `
  --lb_name=cloudbridge-gslb `
  --primary_pool=$PrimaryAlb `
  --secondary_pool=$SecondaryAlb `
  --steering=dynamic_latency `
  --probe_path=$HealthCheckPath `
  --failover_threshold=3 `
  --api_token_secret=$CloudflareApiToken
"@
    Invoke-CommandWithCheck -Command $lbCmd -ErrorMessage "Cloudflare Load Balancer configuration failed"
    Write-Success "Cloudflare Load Balancer configured"

    # 35-2. Edge KV 네임스페이스 생성
    Write-Step "Creating Edge KV namespace..."
    $kvCmd = @"
run devops:init cloudflare-workers-kv `
  --namespace=CB_EDGE_CACHE `
  --api_token_secret=$CloudflareApiToken
"@
    Invoke-CommandWithCheck -Command $kvCmd -ErrorMessage "Edge KV namespace creation failed"
    Write-Success "Edge KV namespace created"

    # 35-3. Edge Worker 스크립트 업로드
    Write-Step "Deploying Edge Worker script..."
    $workerCmd = @"
run devops:init cloudflare-worker `
  --name=edge-api-cache `
  --route="$DomainName/api/*" `
  --script="workers/edge-api-cache.js" `
  --kv_namespace=CB_EDGE_CACHE `
  --api_token_secret=$CloudflareApiToken
"@
    Invoke-CommandWithCheck -Command $workerCmd -ErrorMessage "Edge Worker deployment failed"
    Write-Success "Edge Worker deployed"

    # 35-4. Slack 알림 설정
    Write-Step "Setting up latency monitoring alerts..."
    $alertCmd = @"
run monitoring:add alert `
  --name=GSLB_Latency_Alert `
  --expr='histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket{le=1,job="platform-main"}[5m])) by (le,region)) > 0.4' `
  --for=5m `
  --slack_webhook_secret=$SlackWebhookUrl `
  --message="🚨 글로벌 P95 레이턴시 400 ms 초과 – {{ `$labels.region }}"
"@
    Invoke-CommandWithCheck -Command $alertCmd -ErrorMessage "Alert configuration failed"
    Write-Success "Latency alerts configured"

    Write-Host "`n✅ 글로벌 스마트 라우팅 설정이 성공적으로 완료되었습니다!" -ForegroundColor Green
    Write-Host @"
    
설정 요약:
- Cloudflare Load Balancer:
  * 이름: cloudbridge-gslb
  * 라우팅: 동적 레이턴시 기반
  * 서울: $PrimaryAlb
  * 싱가포르: $SecondaryAlb
  * 헬스체크: $HealthCheckPath

- Edge 캐싱:
  * KV 네임스페이스: CB_EDGE_CACHE
  * 캐시 TTL: 30초
  * 대상: GET /api/* 요청
  * 도메인: $DomainName

- 모니터링:
  * P95 레이턴시 임계값: 400ms
  * 측정 간격: 5분
  * 알림: Slack

"@ -ForegroundColor Yellow

    Write-Host "`n다음 단계:" -ForegroundColor Magenta
    Write-Host "1. Cloudflare 대시보드에서 로드밸런서 상태 확인"
    Write-Host "2. Edge Worker 로그 모니터링"
    Write-Host "3. KV 캐시 적중률 확인"
    Write-Host "4. 지역별 레이턴시 대시보드 확인"
    Write-Host "5. 테스트 요청으로 캐시 동작 검증"

} catch {
    Write-ErrorAndExit $_.Exception.Message
} 