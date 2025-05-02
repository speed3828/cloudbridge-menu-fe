#!/usr/bin/env bash
set -e

echo "① Lint / Format / Type-check"
npm run lint && npm run format:check && npx tsc --noEmit

echo "② Unit Test (Jest)"
npm run test

echo "③ E2E Test (Playwright)"
npm run e2e:web

echo "④ Security Scan (Semgrep + Trivy)"
semgrep ci --config=p/owasp-top-ten
trivy fs --severity CRITICAL --exit-code 1 .

echo "⑤ Docker build + Helm dry-run"
docker build -t autorise/platform-all:ci .
helm template platform-all ./helm | kubeval --strict

echo "⑥ Smoke Health-Check"
curl -sSf https://autoriseinsight.co.kr/healthz
curl -sSf https://platform.autoriseinsight.co.kr/api/healthz
python scripts/ws_healthcheck.py wss://autoriseinsight.co.kr/ws/main-feed

echo "⑦ Slack Summary"
curl -X POST -H "Content-Type: application/json" \
     -d "{\"text\":\"✅ Full quality pipeline passed on $(date +%F_%T)\"}" \
     $SLACK_WEBHOOK_URL

echo "⑧ Git tag & Sheet backup"
TAG=stable-$(date +%Y%m%d%H%M)
git tag -a $TAG -m "auto stable tag"
git push origin $TAG
python scripts/backup_sheets.py 