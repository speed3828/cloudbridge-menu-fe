# CloudBridge Platform PWA 및 다국어 지원 설정 스크립트

Write-Host "===== CloudBridge Platform PWA 및 다국어 지원 설정 시작 =====" -ForegroundColor Cyan

# 1. PWA 설정
Write-Host "`n[1/6] PWA 설정" -ForegroundColor Yellow
Write-Host "PWA 플러그인을 설치하고 서비스 워커를 설정합니다..."
# 실제 실행시 아래 주석 해제
# run platform:add pwa `
#   --workbox_version=6 `
#   --offline_strategy=network-first `
#   --precached_routes=/,/**/*.css,/**/*.js,/**/*.png,/**/*.svg `
#   --manifest_name="양평 구름다리" `
#   --manifest_short="구름다리" `
#   --manifest_theme="#3B82F6" `
#   --manifest_icon="/icons/icon-512.png"

# 2. 다국어 설정
Write-Host "`n[2/6] 다국어 설정" -ForegroundColor Yellow
Write-Host "다국어 지원을 위한 기본 설정을 진행합니다..."
# 실제 실행시 아래 주석 해제
# run platform:add i18n `
#   --framework=next-i18next `
#   --locales=ko,en,zh `
#   --default_locale=ko `
#   --detection=browser,cookie

# 3. 번역 리소스 생성
Write-Host "`n[3/6] 번역 리소스 생성" -ForegroundColor Yellow
Write-Host "공통 번역 리소스 파일을 생성합니다..."
# 실제 실행시 아래 주석 해제
# run platform:add i18n-resource `
#   --namespace=common `
#   --keys="home, menu, login, logout, live, settings"

# 4. 언어 전환 컴포넌트 추가
Write-Host "`n[4/6] 언어 전환 컴포넌트 추가" -ForegroundColor Yellow
Write-Host "헤더에 언어 전환 드롭다운을 추가합니다..."
# 실제 실행시 아래 주석 해제
# run platform:add component `
#   --name=LanguageSwitcher `
#   --target=components/Header.tsx

# 5. 빌드 스크립트 설정
Write-Host "`n[5/6] 빌드 스크립트 설정" -ForegroundColor Yellow
Write-Host "서비스워커 빌드 스크립트를 CI에 연동합니다..."
# 실제 실행시 아래 주석 해제
# run devops:add build-step `
#   --workflow=cloudbridge-ci `
#   --step="npm run build && npm run workbox:generate"

# 6. PWA 테스트
Write-Host "`n[6/6] PWA 테스트" -ForegroundColor Yellow
Write-Host "Lighthouse를 사용하여 PWA 스코어를 테스트합니다..."
# 실제 실행시 아래 주석 해제
# run test:pwa `
#   --url=http://localhost:3000 `
#   --expect_score=90

Write-Host "`n===== CloudBridge Platform PWA 및 다국어 지원 설정 완료 =====" -ForegroundColor Cyan
Write-Host "`n주의사항:" -ForegroundColor Yellow
Write-Host "1. 서비스 워커가 올바르게 등록되었는지 확인하세요."
Write-Host "2. 오프라인 전략이 적절한지 테스트하세요."
Write-Host "3. 모든 언어에 대한 번역이 완료되었는지 확인하세요."
Write-Host "4. 언어 전환이 정상적으로 작동하는지 테스트하세요."
Write-Host "5. PWA 설치 및 업데이트가 원활한지 확인하세요."
Write-Host "6. Lighthouse 점수가 목표치에 도달했는지 확인하세요."

Write-Host "`n설정 정보:" -ForegroundColor Green
Write-Host "지원 언어: 한국어(ko), 영어(en), 중국어(zh)"
Write-Host "기본 언어: 한국어(ko)"
Write-Host "PWA 이름: 양평 구름다리"
Write-Host "테마 색상: #3B82F6"
Write-Host "오프라인 전략: Network First"

Write-Host "`n테스트 URL:" -ForegroundColor Green
Write-Host "로컬 개발: http://localhost:3000"
Write-Host "번역 리소스: /public/locales/{locale}/common.json"
Write-Host "매니페스트: /public/manifest.json"
Write-Host "서비스워커: /public/sw.js" 