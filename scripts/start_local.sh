#!/bin/bash

# CloudBridge Platform 로컬 개발 환경 시작 스크립트

# 색상 정의
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${CYAN}===== CloudBridge Platform 로컬 개발 환경 시작 =====${NC}"

# 프로젝트 루트 디렉토리로 이동
cd "$(dirname "$0")/.." || exit

# Docker Compose 실행
echo -e "${YELLOW}Docker Compose 서비스 시작 중...${NC}"
docker compose -f devops/docker/docker-compose.yml -f devops/docker/docker-compose.override.yml up -d

# 서비스 상태 확인
echo -e "${GREEN}서비스 상태 확인 중...${NC}"
docker compose -f devops/docker/docker-compose.yml -f devops/docker/docker-compose.override.yml ps

echo -e "${CYAN}===== 로컬 개발 환경이 실행되었습니다 =====${NC}"
echo -e "메인 API: http://localhost:4000"
echo -e "메뉴 API: http://localhost:4100"
echo -e "MongoDB: localhost:27017"
echo -e "PostgreSQL: localhost:5432 (사용자: cloudbridge, 비밀번호: pass)"
echo -e "Redis: localhost:6379"
echo -e "${YELLOW}환경을 중지하려면 scripts/stop_local.sh를 실행하세요${NC}" 