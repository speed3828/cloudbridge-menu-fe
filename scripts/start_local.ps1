# CloudBridge Platform 로컬 개발 환경 시작 스크립트 (PowerShell)

Write-Host "===== CloudBridge Platform 로컬 개발 환경 시작 =====" -ForegroundColor Cyan

# 프로젝트 루트 디렉토리로 이동
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location (Join-Path $scriptPath "..")

# Docker Compose 실행
Write-Host "Docker Compose 서비스 시작 중..." -ForegroundColor Yellow
docker compose -f devops/docker/docker-compose.yml -f devops/docker/docker-compose.override.yml up -d

# 서비스 상태 확인
Write-Host "서비스 상태 확인 중..." -ForegroundColor Green
docker compose -f devops/docker/docker-compose.yml -f devops/docker/docker-compose.override.yml ps

Write-Host "===== 로컬 개발 환경이 실행되었습니다 =====" -ForegroundColor Cyan
Write-Host "메인 API: http://localhost:4000"
Write-Host "메뉴 API: http://localhost:4100"
Write-Host "MongoDB: localhost:27017"
Write-Host "PostgreSQL: localhost:5432 (사용자: cloudbridge, 비밀번호: pass)"
Write-Host "Redis: localhost:6379"
Write-Host "환경을 중지하려면 scripts/stop_local.ps1를 실행하세요" -ForegroundColor Yellow 