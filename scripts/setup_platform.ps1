# CloudBridge Platform 초기화 스크립트 (PowerShell)
# 모든 설정과 스캐폴딩을 자동화하는 스크립트

Write-Host "===== CloudBridge Platform 설정 시작 =====" -ForegroundColor Cyan

# 단계별 진행 함수
function Start-Step {
    param($StepName)
    Write-Host "`n>> $StepName 시작..." -ForegroundColor Green
}

function Complete-Step {
    param($StepName)
    Write-Host ">> $StepName 완료!" -ForegroundColor Green
}

# 1. 환경 설정
Start-Step "환경 설정"

# 워크스페이스 설정
Write-Host "워크스페이스 기본 설정..." -ForegroundColor Yellow
# 실제 실행시 아래 주석 해제
# setup:workspace NAME=cloudbridge-platform PORT=4000 AUTOSAVE=off DIFF_PREVIEW=on EXCLUDE=public,dist,generated

# 정책 설정
Write-Host "정책 설정..." -ForegroundColor Yellow
# 실제 실행시 아래 주석 해제
# setup:policy PORT_LOCK=4000,4100 NO_PACKAGE_UPDATE=true MAX_FILES_PER_RUN=20 RESTRICT_PATHS=apps/,helm/,scripts/

# 에러 처리 설정
Write-Host "에러 처리 설정..." -ForegroundColor Yellow
# 실제 실행시 아래 주석 해제
# setup:on_error COMMAND="mkdir -p .ci_error && cp $CURSOR_LAST_LOG .ci_error/$(date +%F_%T)_err.log" ROLLBACK_CMD="git reset --hard HEAD~1" NOTIFY_CMD="curl -H 'Content-Type: application/json' -d '{\"text\":\"🚨 $CURSOR_ERROR_MSG\"}' $SLACK_WEBHOOK_URL" PAUSE=true

# 재시도 설정
Write-Host "재시도 설정..." -ForegroundColor Yellow
# 실제 실행시 아래 주석 해제
# setup:retry MAX_RETRY=2 BACKOFF_SEC=30

Complete-Step "환경 설정"

# 2. 구조 스캐폴딩
Start-Step "구조 스캐폴딩"

# 메인 API 생성
Write-Host "메인 API 초기화..." -ForegroundColor Yellow
# 실제 실행시 아래 주석 해제
# platform:init main-api --template=fastapi --dir=apps/platform-main --port=4000

# 메뉴 API 생성
Write-Host "메뉴 API 초기화..." -ForegroundColor Yellow
# 실제 실행시 아래 주석 해제
# platform:init menu-api --template=fastapi --dir=apps/platform-menu --port=4100

# 공통 모델 생성
Write-Host "공통 모델 생성..." -ForegroundColor Yellow
# 실제 실행시 아래 주석 해제
# shared:model user,store,feed --orm=pydantic

Complete-Step "구조 스캐폴딩"

# 3. 인프라 라우팅 & 배포
Start-Step "인프라 라우팅 & 배포"

# Ingress 설정
Write-Host "Ingress 설정..." -ForegroundColor Yellow
# 실제 실행시 아래 주석 해제
# devops:init ingress --path=/api/main,/api/menu --svc=platform-main:4000,platform-menu:4100

# Helm 차트 생성
Write-Host "Helm 차트 생성..." -ForegroundColor Yellow
# 실제 실행시 아래 주석 해제
# devops:init helm --apps=platform-main,platform-menu

Complete-Step "인프라 라우팅 & 배포"

# 4. 로그인·헬스 체크
Start-Step "로그인·헬스 체크 추가"

# OAuth 로그인 추가
Write-Host "로그인 기능 추가..." -ForegroundColor Yellow
# 실제 실행시 아래 주석 해제
# platform-main:add auth --provider=google,naver

# 헬스 체크 추가
Write-Host "헬스 체크 추가..." -ForegroundColor Yellow
# 실제 실행시 아래 주석 해제
# platform:add healthz --apps=platform-main,platform-menu

Complete-Step "로그인·헬스 체크 추가"

Write-Host "`n===== CloudBridge Platform 설정 완료 =====" -ForegroundColor Cyan
Write-Host "`n도움말: 이 스크립트를 실행하려면 각 명령 앞의 주석을 제거하세요." -ForegroundColor Yellow 