# CloudBridge Platform 피드백 및 추천 파이프라인 구축 스크립트

Write-Host "===== CloudBridge Platform 피드백 및 추천 파이프라인 구축 시작 =====" -ForegroundColor Cyan

# 1. Kafka 설정
Write-Host "`n[1/5] Kafka 설정" -ForegroundColor Yellow
Write-Host "Kafka 토픽을 생성하고 Producer 훅을 설정합니다..."
# 실제 실행시 아래 주석 해제
# run devops:init kafka `
#   --broker=localhost:9092 `
#   --topics=feedback.raw

# 플랫폼 메인 API 피드백 엔드포인트 추가
Write-Host "플랫폼 메인 API에 피드백 엔드포인트를 추가합니다..."
# 실제 실행시 아래 주석 해제
# run platform-main:add feedback-hook `
#   --topic=feedback.raw `
#   --fields=user_id,content,service

# 2. 피드백 코어 서비스 설정
Write-Host "`n[2/5] 피드백 코어 서비스 설정" -ForegroundColor Yellow
Write-Host "피드백 처리 서비스를 초기화합니다..."
# 실제 실행시 아래 주석 해제
# run platform:init feedback-core `
#   --template=fastapi `
#   --dir=apps/feedback-core `
#   --port=4200

# NLP 워커 등록
Write-Host "감정 및 주제 태깅 워커를 등록합니다..."
# 실제 실행시 아래 주석 해제
# run feedback-core:add nlp-worker `
#   --model=ko-sentiment,ko-topic

# 3. 추천 코어 서비스 설정
Write-Host "`n[3/5] 추천 코어 서비스 설정" -ForegroundColor Yellow
Write-Host "추천 서비스를 초기화합니다..."
# 실제 실행시 아래 주석 해제
# run platform:init rec-core `
#   --template=fastapi `
#   --dir=apps/rec-core `
#   --port=4300

# Qdrant 설정
Write-Host "Qdrant를 설치하고 컬렉션을 생성합니다..."
# 실제 실행시 아래 주석 해제
# run devops:init qdrant `
#   --port=6333 `
#   --collection=user-embed

# 4. 파이프라인 연결
Write-Host "`n[4/5] 파이프라인 연결" -ForegroundColor Yellow
Write-Host "Kafka에서 피드백 코어로 데이터를 전달하는 커넥터를 설정합니다..."
# 실제 실행시 아래 주석 해제
# run logging:init connector `
#   --source=kafka `
#   --topic=feedback.raw `
#   --target=http://localhost:4200/process

Write-Host "피드백 코어에서 추천 코어로 데이터를 전달하는 싱크를 설정합니다..."
# 실제 실행시 아래 주석 해제
# run feedback-core:add sink `
#   --target=rec-core `
#   --url=http://localhost:4300/ingest

# 5. 추천 API 연결
Write-Host "`n[5/5] 추천 API 연결" -ForegroundColor Yellow
Write-Host "플랫폼 메뉴에 추천 API를 연결합니다..."
# 실제 실행시 아래 주석 해제
# run platform-menu:add recommend-endpoint `
#   --url=http://localhost:4300/recommend `
#   --path=/recommend/{user_id} `
#   --limit=10

Write-Host "`n===== CloudBridge Platform 피드백 및 추천 파이프라인 구축 완료 =====" -ForegroundColor Cyan
Write-Host "`n주의사항:" -ForegroundColor Yellow
Write-Host "1. Kafka 브로커가 실행 중인지 확인하세요."
Write-Host "2. 필요한 Python 패키지(spaCy, BERT)가 설치되어 있는지 확인하세요."
Write-Host "3. Qdrant 서비스가 정상적으로 실행되는지 확인하세요."
Write-Host "4. 각 서비스의 포트가 사용 가능한지 확인하세요."
Write-Host "`n접속 정보:" -ForegroundColor Green
Write-Host "피드백 코어: http://localhost:4200"
Write-Host "추천 코어: http://localhost:4300"
Write-Host "Qdrant: http://localhost:6333" 