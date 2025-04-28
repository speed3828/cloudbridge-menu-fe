# CloudBridge Platform 로컬 개발 환경 중지 스크립트 (PowerShell)

Write-Host "===== CloudBridge Platform 로컬 개발 환경 중지 =====" -ForegroundColor Cyan

# 프로젝트 루트 디렉토리로 이동
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location (Join-Path $scriptPath "..")

# Docker Compose 중지
Write-Host "Docker Compose 서비스 중지 중..." -ForegroundColor Red
docker compose -f devops/docker/docker-compose.yml -f devops/docker/docker-compose.override.yml down

Write-Host "===== 로컬 개발 환경이 중지되었습니다 =====" -ForegroundColor Cyan 