#!/bin/bash

# CloudBridge Platform Error Handler (Bash)
# Usage: ./error_handler.sh [error_type] [error_message]

if [ -z "$1" ]; then
  echo "Error: Error type is required"
  echo "Usage: ./error_handler.sh [BUILD_FAIL|TEST_FAIL|POLICY_VIOLATION|LINT_FAIL] [error_message]"
  exit 1
fi

ERROR_TYPE=$1
ERROR_MESSAGE=${2:-""}

# Error log directory
ERROR_LOG_DIR=".ci_error"
mkdir -p $ERROR_LOG_DIR

# Current timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Log the error
ERROR_LOG_PATH="$ERROR_LOG_DIR/${TIMESTAMP}_${ERROR_TYPE}.log"
echo "Error Type: $ERROR_TYPE" > $ERROR_LOG_PATH
echo "Timestamp: $(date)" >> $ERROR_LOG_PATH
echo "Message: $ERROR_MESSAGE" >> $ERROR_LOG_PATH

# Display appropriate error message
case $ERROR_TYPE in
  "BUILD_FAIL")
    echo -e "\033[31m[BUILD] 컴파일 실패 – 로그 확인\033[0m"
    ;;
  "TEST_FAIL")
    echo -e "\033[31m[TEST] 실패 – failed_tests.txt 확인\033[0m"
    ;;
  "POLICY_VIOLATION")
    echo -e "\033[33m[POLICY] 지침 위반 – 설정 수정\033[0m"
    ;;
  "LINT_FAIL")
    echo -e "\033[33m[LINT] 스타일 오류 – black/isort 실행\033[0m"
    ;;
  *)
    echo -e "\033[31m[ERROR] 알 수 없는 오류가 발생했습니다: $ERROR_MESSAGE\033[0m"
    ;;
esac

# Notify if SLACK_WEBHOOK_URL is set
if [ ! -z "$SLACK_WEBHOOK_URL" ]; then
  WORKSPACE_NAME=$(basename $(pwd))
  PAYLOAD="{\"text\":\"🚨 Cursor Error on $WORKSPACE_NAME : $ERROR_TYPE - $ERROR_MESSAGE\"}"
  
  curl -s -X POST -H "Content-Type: application/json" -d "$PAYLOAD" $SLACK_WEBHOOK_URL > /dev/null
  if [ $? -eq 0 ]; then
    echo -e "\033[34mSlack notification sent.\033[0m"
  else
    echo -e "\033[31mFailed to send Slack notification.\033[0m"
  fi
fi

# Ask if rollback is needed
read -p "이전 커밋으로 롤백하시겠습니까? (y/n) " rollback
if [[ $rollback == "y" || $rollback == "Y" ]]; then
  echo -e "\033[33m롤백을 수행합니다...\033[0m"
  git reset --hard HEAD~1
  echo -e "\033[32m롤백 완료\033[0m"
fi 