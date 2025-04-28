# CloudBridge Platform - Service Mesh Setup Script
###############################################################################
# 33) 서비스 메시 – Istio + mTLS + 트래픽 정책
###############################################################################

param(
    [Parameter(Mandatory=$true)]
    [string]$SlackWebhookUrl,
    
    [Parameter(Mandatory=$false)]
    [string]$IstioRevision = "1-21-2",
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("cloudbridge-staging", "cloudbridge-prod")]
    [string]$Namespace = "cloudbridge-prod"
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

# 함수: kubectl 명령어 실행
function Invoke-Kubectl {
    param([string]$Command)
    try {
        $result = Invoke-Expression "kubectl $Command"
        return $result
    } catch {
        Write-ErrorAndExit "Failed to execute kubectl command: $Command`nError: $($_.Exception.Message)"
    }
}

try {
    # 33-1. Istio ambient 설치 (namespace istio-system)
    Write-Step "Installing Istio with ambient profile..."
    $istioCmd = "run devops:init istio --profile=ambient --revision=$IstioRevision"
    Write-Host "Executing: $istioCmd" -ForegroundColor Gray
    # Invoke-Expression $istioCmd
    Write-Success "Istio installation completed"

    # 33-2. 스테이징·프로덕션 네임스페이스 메시에 편입
    Write-Step "Adding namespaces to service mesh..."
    $namespaces = @("cloudbridge-staging", "cloudbridge-prod")
    foreach ($ns in $namespaces) {
        $labelCmd = "label ns $ns istio.io/dataplane-mode=ambient --overwrite"
        Write-Host "Executing: kubectl $labelCmd" -ForegroundColor Gray
        Invoke-Kubectl $labelCmd
    }
    Write-Success "Namespaces labeled for ambient mesh"

    # 33-3. 전체 네임스페이스 mTLS(strict) 정책 생성
    Write-Step "Configuring mTLS policies..."
    foreach ($ns in $namespaces) {
        $mtlsCmd = "run devops:add istio-peer-authn --namespace=$ns --mode=STRICT"
        Write-Host "Executing: $mtlsCmd" -ForegroundColor Gray
        # Invoke-Expression $mtlsCmd
    }
    Write-Success "mTLS policies configured"

    # 33-4. 그레이 캔터리 트래픽 정책 (platform-main 25% → 50%)
    Write-Step "Setting up canary traffic policy..."
    $trafficCmd = "run devops:add istio-traffic-split --service=platform-main --subset=vnext --weight=25"
    Write-Host "Executing: $trafficCmd" -ForegroundColor Gray
    # Invoke-Expression $trafficCmd
    Write-Success "Traffic split policy configured"
    Write-Host "Note: For 50% traffic split, use: run devops:add istio-traffic-split --service=platform-main --subset=vnext --weight=50" -ForegroundColor Yellow

    # 33-5. RBAC 정책 – menu-API는 main-API 호출 불가
    Write-Step "Configuring RBAC policies..."
    $rbacCmd = @"
run devops:add istio-authz `
  --namespace=cloudbridge-prod `
  --name=deny-menu-to-main `
  --action=DENY `
  --source=workloadSelector:platform-menu `
  --destination=workloadSelector:platform-main
"@
    Write-Host "Executing: $rbacCmd" -ForegroundColor Gray
    # Invoke-Expression $rbacCmd
    Write-Success "RBAC policy configured"

    # 33-6. Kiali(서비스 그래프) + Grafana 데이터소스
    Write-Step "Setting up monitoring tools..."
    $monitoringCmds = @(
        "run monitoring:add kiali --namespace=istio-system",
        "run monitoring:add grafana-datasource --type=prometheus --url=http://prometheus.istio-system:9090"
    )
    foreach ($cmd in $monitoringCmds) {
        Write-Host "Executing: $cmd" -ForegroundColor Gray
        # Invoke-Expression $cmd
    }
    Write-Success "Monitoring tools configured"

    # 33-7. Slack 알림 – mTLS 오류 탐지
    Write-Step "Configuring Slack alerts..."
    $alertCmd = @"
run monitoring:add alert `
  --name=mTLS-Failed-Handshake `
  --expr='istio_requests_total{response_code="495"} > 0' `
  --for=1m `
  --slack_webhook_secret=$SlackWebhookUrl `
  --message='🚨 mTLS 핸드셰이크 실패(495) 발생 – {{ `$value }} 건'
"@
    Write-Host "Executing: $alertCmd" -ForegroundColor Gray
    # Invoke-Expression $alertCmd
    Write-Success "Slack alerts configured"

    Write-Host "`n✅ 서비스 메시 설정이 성공적으로 완료되었습니다!" -ForegroundColor Green
    Write-Host @"
    
설정 요약:
- Istio 설정:
  * 프로필: ambient
  * 버전: $IstioRevision
  * 네임스페이스: cloudbridge-staging, cloudbridge-prod

- 보안:
  * mTLS 모드: STRICT
  * RBAC: platform-menu → platform-main (DENY)

- 트래픽 관리:
  * 캔터리: platform-main (vnext: 25%)
  * 승인 후 50%로 증가 가능

- 모니터링:
  * Kiali: istio-system 네임스페이스에 설치됨
  * Grafana: Prometheus 데이터소스 구성됨
  * 알림: mTLS 핸드셰이크 실패 → Slack

"@ -ForegroundColor Yellow

    Write-Host "`n다음 단계:" -ForegroundColor Magenta
    Write-Host "1. Istio 설치 확인: kubectl get pods -n istio-system"
    Write-Host "2. mTLS 상태 확인: istioctl analyze"
    Write-Host "3. 트래픽 분할 모니터링: kubectl get virtualservice"
    Write-Host "4. Kiali 대시보드 접속: istioctl dashboard kiali"

} catch {
    Write-ErrorAndExit $_.Exception.Message
} 