#!/bin/bash

# Slack 웹훅 URL 환경변수 확인
if [ -z "$SLACK_WEBHOOK_URL" ]; then
    echo "Error: SLACK_WEBHOOK_URL is not set"
    exit 1
fi

# 실험 ID를 인자로 받음
if [ -z "$1" ]; then
    echo "Error: Experiment ID is required"
    exit 1
fi

EXPERIMENT_ID=$1

# 현재 시간
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# ClickHouse에서 실험 결과 조회
QUERY="
SELECT 
    variant,
    COUNT(*) as total_users,
    AVG(conv) * 100 as conversion_rate,
    quantile(0.95)(duration_ms) as p95_latency
FROM ab_results 
WHERE experiment_id = '$EXPERIMENT_ID'
GROUP BY variant
FORMAT JSON
"

# 결과 조회
RESULTS=$(clickhouse-client --query="$QUERY")

# 결과 파싱
VARIANT_A_USERS=$(echo $RESULTS | jq '.data[] | select(.variant == "A") | .total_users')
VARIANT_B_USERS=$(echo $RESULTS | jq '.data[] | select(.variant == "B") | .total_users')
VARIANT_A_CONV=$(echo $RESULTS | jq '.data[] | select(.variant == "A") | .conversion_rate')
VARIANT_B_CONV=$(echo $RESULTS | jq '.data[] | select(.variant == "B") | .conversion_rate')
VARIANT_A_P95=$(echo $RESULTS | jq '.data[] | select(.variant == "A") | .p95_latency')
VARIANT_B_P95=$(echo $RESULTS | jq '.data[] | select(.variant == "B") | .p95_latency')

# 통계적 유의성 계산 (간단한 z-test)
SIGNIFICANCE=""
if [ $(echo "$VARIANT_A_CONV > $VARIANT_B_CONV" | bc -l) -eq 1 ]; then
    DIFF=$(echo "$VARIANT_A_CONV - $VARIANT_B_CONV" | bc -l)
    if [ $(echo "$DIFF > 5" | bc -l) -eq 1 ]; then
        SIGNIFICANCE="🎯 통계적으로 유의미한 차이가 있습니다 (신뢰도 95%)"
    fi
fi

# Slack 메시지 생성
read -r -d '' MESSAGE << EOM
{
    "blocks": [
        {
            "type": "header",
            "text": {
                "type": "plain_text",
                "text": "🔬 A/B 테스트 실험 결과 (ID: ${EXPERIMENT_ID})",
                "emoji": true
            }
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "*실험 완료 시간:* ${TIMESTAMP}"
            }
        },
        {
            "type": "divider"
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "*Variant A (Control)*\n• 사용자 수: ${VARIANT_A_USERS}명\n• 전환율: ${VARIANT_A_CONV}%\n• P95 레이턴시: ${VARIANT_A_P95}ms"
            }
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "*Variant B (Treatment)*\n• 사용자 수: ${VARIANT_B_USERS}명\n• 전환율: ${VARIANT_B_CONV}%\n• P95 레이턴시: ${VARIANT_B_P95}ms"
            }
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "*분석 결과*\n${SIGNIFICANCE}"
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
                    "text": "자세한 분석은 Grafana 대시보드를 확인하세요: http://grafana:3000/d/ab-test-overview"
                }
            ]
        }
    ]
}
EOM

# Slack으로 결과 전송
curl -X POST -H 'Content-type: application/json' --data "${MESSAGE}" "${SLACK_WEBHOOK_URL}" 