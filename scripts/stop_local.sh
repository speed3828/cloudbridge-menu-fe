#!/bin/bash

# CloudBridge Platform 로컬 개발 환경 중지 스크립트

# 색상 정의
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${CYAN}===== CloudBridge Platform 로컬 개발 환경 중지 =====${NC}"

# 프로젝트 루트 디렉토리로 이동
cd "$(dirname "$0")/.." || exit

# Docker Compose 중지
echo -e "${RED}Docker Compose 서비스 중지 중...${NC}"
docker compose -f devops/docker/docker-compose.yml -f devops/docker/docker-compose.override.yml down

echo -e "${CYAN}===== 로컬 개발 환경이 중지되었습니다 =====${NC}" 