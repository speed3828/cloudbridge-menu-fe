# CloudBridge Platform 로컬 테스트 스크립트

Write-Host "===== CloudBridge Platform 로컬 테스트 시작 =====" -ForegroundColor Cyan

# 1. 모든 서비스 시작
Write-Host "`n[1/2] 모든 서비스 시작" -ForegroundColor Yellow
Write-Host "모든 컨테이너와 서비스를 시작합니다..."
# 실제 실행시 아래 주석 해제
# run dev:start all

# 2. Smoke Test 실행
Write-Host "`n[2/2] Smoke Test 실행" -ForegroundColor Yellow
Write-Host "헬스체크와 로그인 시나리오를 테스트합니다..."
# 실제 실행시 아래 주석 해제
# run test:smoke --urls="http://localhost:4000/healthz,http://localhost:4100/healthz" --login="google" --expect_status=200

Write-Host "`n===== CloudBridge Platform 로컬 테스트 완료 =====" -ForegroundColor Cyan
Write-Host "`n도움말: 이 스크립트를 실행하려면 각 명령 앞의 주석을 제거하세요." -ForegroundColor Yellow 