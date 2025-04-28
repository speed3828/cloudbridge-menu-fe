#!/bin/bash

# Slack 웹훅 URL 환경변수 확인
if [ -z "$SLACK_WEBHOOK_URL" ]; then
    echo "Error: SLACK_WEBHOOK_URL is not set"
    exit 1
fi

# 현재 시간
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# 결과 파일 경로
SEMGREP_RESULTS="semgrep_results.json"
TRIVY_MAIN_RESULTS="trivy_main_results.json"
TRIVY_MENU_RESULTS="trivy_menu_results.json"
ZAP_RESULTS="zap_results.json"

# Semgrep 결과 분석
SEMGREP_FINDINGS=$(jq '.results | length' $SEMGREP_RESULTS)
SEMGREP_HIGH=$(jq '.results[] | select(.extra.severity == "HIGH") | .extra.severity' $SEMGREP_RESULTS | wc -l)
SEMGREP_MEDIUM=$(jq '.results[] | select(.extra.severity == "MEDIUM") | .extra.severity' $SEMGREP_RESULTS | wc -l)

# Trivy 결과 분석
TRIVY_MAIN_CRITICAL=$(jq '.Results[] | select(.Vulnerabilities != null) | .Vulnerabilities[] | select(.Severity == "CRITICAL") | .VulnerabilityID' $TRIVY_MAIN_RESULTS | wc -l)
TRIVY_MENU_CRITICAL=$(jq '.Results[] | select(.Vulnerabilities != null) | .Vulnerabilities[] | select(.Severity == "CRITICAL") | .VulnerabilityID' $TRIVY_MENU_RESULTS | wc -l)

# ZAP 결과 분석
ZAP_HIGH=$(jq '.site[].alerts[] | select(.riskcode == "3") | .riskcode' $ZAP_RESULTS | wc -l)
ZAP_MEDIUM=$(jq '.site[].alerts[] | select(.riskcode == "2") | .riskcode' $ZAP_RESULTS | wc -l)

# Slack 메시지 생성
read -r -d '' MESSAGE << EOM
{
    "blocks": [
        {
            "type": "header",
            "text": {
                "type": "plain_text",
                "text": "🔒 보안 스캔 결과 리포트",
                "emoji": true
            }
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "*스캔 시간:* ${TIMESTAMP}"
            }
        },
        {
            "type": "divider"
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "*1. Semgrep 정적 분석 결과*\n• 총 발견: ${SEMGREP_FINDINGS}개\n• High: ${SEMGREP_HIGH}개\n• Medium: ${SEMGREP_MEDIUM}개"
            }
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "*2. Trivy 컨테이너 스캔 결과*\n• Main API Critical: ${TRIVY_MAIN_CRITICAL}개\n• Menu API Critical: ${TRIVY_MENU_CRITICAL}개"
            }
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "*3. OWASP ZAP 동적 스캔 결과*\n• High: ${ZAP_HIGH}개\n• Medium: ${ZAP_MEDIUM}개"
            }
        },
        {
            "type": "divider"
        },
        {
            "type": "context",
            "elements": [
                {
                    "type": "mrkdwn",
                    "text": "자세한 결과는 CI 아티팩트를 확인하세요"
                }
            ]
        }
    ]
}
EOM

# Slack으로 결과 전송
curl -X POST -H 'Content-type: application/json' --data "${MESSAGE}" "${SLACK_WEBHOOK_URL}" 