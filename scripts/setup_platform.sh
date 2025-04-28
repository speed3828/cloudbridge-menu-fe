#!/bin/bash

# CloudBridge Platform 초기화 스크립트 (Bash)
# 모든 설정과 스캐폴딩을 자동화하는 스크립트

# 색상 정의
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${CYAN}===== CloudBridge Platform 설정 시작 =====${NC}"

# 단계별 진행 함수
start_step() {
  echo -e "\n${GREEN}>> $1 시작...${NC}"
}

complete_step() {
  echo -e "${GREEN}>> $1 완료!${NC}"
}

# 1. 환경 설정
start_step "환경 설정"

# 워크스페이스 설정
echo -e "${YELLOW}워크스페이스 기본 설정...${NC}"
# 실제 실행시 아래 주석 해제
# run setup:workspace NAME=cloudbridge-platform PORT=4000 AUTOSAVE=off DIFF_PREVIEW=on EXCLUDE=public,dist,generated

# 정책 설정
echo -e "${YELLOW}정책 설정...${NC}"
# 실제 실행시 아래 주석 해제
# run setup:policy PORT_LOCK=4000,4100 NO_PACKAGE_UPDATE=true MAX_FILES_PER_RUN=20 RESTRICT_PATHS=apps/,helm/,scripts/

# 에러 처리 설정
echo -e "${YELLOW}에러 처리 설정...${NC}"
# 실제 실행시 아래 주석 해제
# run setup:on_error COMMAND="mkdir -p .ci_error && cp $CURSOR_LAST_LOG .ci_error/$(date +%F_%T)_err.log" ROLLBACK_CMD="git reset --hard HEAD~1" NOTIFY_CMD="curl -H 'Content-Type: application/json' -d '{\"text\":\"🚨 $CURSOR_ERROR_MSG\"}' $SLACK_WEBHOOK_URL" PAUSE=true

# 재시도 설정
echo -e "${YELLOW}재시도 설정...${NC}"
# 실제 실행시 아래 주석 해제
# run setup:retry MAX_RETRY=2 BACKOFF_SEC=30

complete_step "환경 설정"

# 2. 구조 스캐폴딩
start_step "구조 스캐폴딩"

# 메인 API 생성
echo -e "${YELLOW}메인 API 초기화...${NC}"
# 실제 실행시 아래 주석 해제
# run platform:init main-api --template=fastapi --dir=apps/platform-main --port=4000

# 메뉴 API 생성
echo -e "${YELLOW}메뉴 API 초기화...${NC}"
# 실제 실행시 아래 주석 해제
# run platform:init menu-api --template=fastapi --dir=apps/platform-menu --port=4100

# 공통 모델 생성
echo -e "${YELLOW}공통 모델 생성...${NC}"
# 실제 실행시 아래 주석 해제
# run shared:model user,store,feed --orm=pydantic

complete_step "구조 스캐폴딩"

# 3. 인프라 라우팅 & 배포
start_step "인프라 라우팅 & 배포"

# Ingress 설정
echo -e "${YELLOW}Ingress 설정...${NC}"
# 실제 실행시 아래 주석 해제
# run devops:init ingress --path=/api/main,/api/menu --svc=platform-main:4000,platform-menu:4100

# Helm 차트 생성
echo -e "${YELLOW}Helm 차트 생성...${NC}"
# 실제 실행시 아래 주석 해제
# run devops:init helm --apps=platform-main,platform-menu

complete_step "인프라 라우팅 & 배포"

# 4. 로그인·헬스 체크
start_step "로그인·헬스 체크 추가"

# OAuth 로그인 추가
echo -e "${YELLOW}로그인 기능 추가...${NC}"
# 실제 실행시 아래 주석 해제
# run platform-main:add auth --provider=google,naver

# 헬스 체크 추가
echo -e "${YELLOW}헬스 체크 추가...${NC}"
# 실제 실행시 아래 주석 해제
# run platform:add healthz --apps=platform-main,platform-menu

complete_step "로그인·헬스 체크 추가"

echo -e "\n${CYAN}===== CloudBridge Platform 설정 완료 =====${NC}"
echo -e "\n${YELLOW}도움말: 이 스크립트를 실행하려면 각 명령 앞의 주석을 제거하세요.${NC}" 