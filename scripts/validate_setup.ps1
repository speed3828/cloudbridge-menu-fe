# CloudBridge Platform 설정 검증 스크립트 (PowerShell)
# 모든 설정과 스캐폴딩이 올바르게 되어 있는지 검증

Write-Host "===== CloudBridge Platform 설정 검증 시작 =====" -ForegroundColor Cyan

$success = $true

# 디렉토리 구조 검증
function Test-Directory {
    param (
        [string]$Path,
        [string]$Description
    )
    
    Write-Host "  - $Description 확인 중..." -NoNewline
    if (Test-Path $Path) {
        Write-Host " [성공]" -ForegroundColor Green
        return $true
    } else {
        Write-Host " [실패]" -ForegroundColor Red
        return $false
    }
}

# 파일 존재 여부 검증
function Test-File {
    param (
        [string]$Path,
        [string]$Description
    )
    
    Write-Host "  - $Description 확인 중..." -NoNewline
    if (Test-Path $Path -PathType Leaf) {
        Write-Host " [성공]" -ForegroundColor Green
        return $true
    } else {
        Write-Host " [실패]" -ForegroundColor Red
        return $false
    }
}

# 1. 폴더 구조 검증
Write-Host "`n[1/4] 폴더 구조 검증" -ForegroundColor Yellow
$success = $success -and (Test-Directory "apps" "주요 애플리케이션 폴더")
$success = $success -and (Test-Directory "apps/platform-main" "메인 API 폴더")
$success = $success -and (Test-Directory "apps/platform-menu" "메뉴 API 폴더")
$success = $success -and (Test-Directory "shared/models" "공유 모델 폴더")
$success = $success -and (Test-Directory "devops/ingress" "Ingress 설정 폴더")
$success = $success -and (Test-Directory "devops/helm" "Helm 차트 폴더")
$success = $success -and (Test-Directory "scripts" "스크립트 폴더")
$success = $success -and (Test-Directory "config" "설정 폴더")

# 2. 핵심 파일 검증
Write-Host "`n[2/4] 핵심 파일 검증" -ForegroundColor Yellow
$success = $success -and (Test-File "apps/platform-main/main.py" "Main API 진입점")
$success = $success -and (Test-File "apps/platform-main/requirements.txt" "Main API 의존성")
$success = $success -and (Test-File "apps/platform-menu/main.py" "Menu API 진입점")
$success = $success -and (Test-File "apps/platform-menu/requirements.txt" "Menu API 의존성")
$success = $success -and (Test-File "shared/models/user.py" "User 모델")
$success = $success -and (Test-File "shared/models/store.py" "Store 모델")
$success = $success -and (Test-File "shared/models/feed.py" "Feed 모델")
$success = $success -and (Test-File "devops/ingress/ingress.yaml" "Ingress 설정")
$success = $success -and (Test-File "devops/helm/Chart.yaml" "Helm 차트 설정")
$success = $success -and (Test-File "config/settings.yaml" "설정 파일")

# 3. API 포트 검증
Write-Host "`n[3/4] API 포트 설정 검증" -ForegroundColor Yellow
$mainApiFile = Get-Content -Path "apps/platform-main/main.py" -ErrorAction SilentlyContinue
$menuApiFile = Get-Content -Path "apps/platform-menu/main.py" -ErrorAction SilentlyContinue

Write-Host "  - Main API 포트(4000) 확인 중..." -NoNewline
if ($mainApiFile -match "port=4000") {
    Write-Host " [성공]" -ForegroundColor Green
} else {
    Write-Host " [실패]" -ForegroundColor Red
    $success = $false
}

Write-Host "  - Menu API 포트(4100) 확인 중..." -NoNewline
if ($menuApiFile -match "port=4100") {
    Write-Host " [성공]" -ForegroundColor Green
} else {
    Write-Host " [실패]" -ForegroundColor Red
    $success = $false
}

# 4. Auth 및 Health Check 검증
Write-Host "`n[4/4] 인증 및 헬스 체크 검증" -ForegroundColor Yellow
$mainApiAuth = Test-File "apps/platform-main/auth.py" "Main API 인증 모듈"
$success = $success -and $mainApiAuth

Write-Host "  - Main API 헬스 체크 확인 중..." -NoNewline
if ($mainApiFile -match "/healthz") {
    Write-Host " [성공]" -ForegroundColor Green
} else {
    Write-Host " [실패]" -ForegroundColor Red
    $success = $false
}

Write-Host "  - Menu API 헬스 체크 확인 중..." -NoNewline
if ($menuApiFile -match "/healthz") {
    Write-Host " [성공]" -ForegroundColor Green
} else {
    Write-Host " [실패]" -ForegroundColor Red
    $success = $false
}

# 결과 출력
Write-Host "`n===== CloudBridge Platform 설정 검증 결과 =====" -ForegroundColor Cyan
if ($success) {
    Write-Host "모든 검증이 성공적으로 완료되었습니다! 시스템이 올바르게 설정되었습니다." -ForegroundColor Green
} else {
    Write-Host "일부 검증이 실패했습니다. 위의 메시지를 확인하고 필요한 부분을 수정해주세요." -ForegroundColor Red
}

exit [int](!$success) 