# CloudBridge Platform 모바일 앱 설정 스크립트

Write-Host "===== CloudBridge Platform 모바일 앱 설정 시작 =====" -ForegroundColor Cyan

# 1. Capacitor 프로젝트 초기화
Write-Host "`n[1/8] Capacitor 프로젝트 초기화" -ForegroundColor Yellow
Write-Host "모바일 앱 프로젝트를 초기화합니다..."
# 실제 실행시 아래 주석 해제
# run mobile:init capacitor `
#   --appId=com.autorise.cloudbridge `
#   --appName="구름다리" `
#   --webDir=out `
#   --npmClient=npm

# 2. 플랫폼 추가
Write-Host "`n[2/8] Android/iOS 플랫폼 추가" -ForegroundColor Yellow
Write-Host "Android와 iOS 플랫폼을 추가합니다..."
# 실제 실행시 아래 주석 해제
# run mobile:add platform android
# run mobile:add platform ios

# 3. FCM 푸시 플러그인 설치
Write-Host "`n[3/8] FCM 푸시 플러그인 설치" -ForegroundColor Yellow
Write-Host "푸시 알림 기능을 위한 플러그인을 설치합니다..."
# 실제 실행시 아래 주석 해제
# run mobile:add plugin @capacitor/push-notifications

# 4. Google Services 설정 파일 다운로드
Write-Host "`n[4/8] Google Services 설정 파일 다운로드" -ForegroundColor Yellow
Write-Host "FCM 설정 파일을 Key Vault에서 다운로드합니다..."
# 실제 실행시 아래 주석 해제
# run security:add key GOOGLE_SERVICES_JSON_URL=<YOUR_PRESIGNED_JSON_URL> --service=mobile
# run security:add key GOOGLE_SERVICES_PLIST_URL=<YOUR_PRESIGNED_PLIST_URL> --service=mobile
# run mobile:init downloads --keys=GOOGLE_SERVICES_JSON_URL,GOOGLE_SERVICES_PLIST_URL

# 5. 환경 설정
Write-Host "`n[5/8] 환경 설정" -ForegroundColor Yellow
Write-Host "API URL과 Service Worker 경로를 설정합니다..."
# 실제 실행시 아래 주석 해제
# run mobile:add env `
#   --key=VITE_API_BASE `
#   --value=https://platform.autoriseinsight.co.kr

# 6. 빌드 및 동기화
Write-Host "`n[6/8] 빌드 및 네이티브 프로젝트 동기화" -ForegroundColor Yellow
Write-Host "웹 앱을 빌드하고 네이티브 프로젝트와 동기화합니다..."
# 실제 실행시 아래 주석 해제
# npm run build
# npx cap sync

# 7. 네이티브 IDE 실행
Write-Host "`n[7/8] 네이티브 IDE 실행" -ForegroundColor Yellow
Write-Host "Android Studio와 Xcode를 실행합니다..."
# 실제 실행시 아래 주석 해제
# npx cap open android
# npx cap open ios

# 8. CI 빌드 스크립트 추가
Write-Host "`n[8/8] CI 빌드 스크립트 추가" -ForegroundColor Yellow
Write-Host "CI/CD 파이프라인에 모바일 앱 빌드 단계를 추가합니다..."
# 실제 실행시 아래 주석 해제
# run devops:add build-step `
#   --workflow=cloudbridge-prod-ci `
#   --step=mobile-build `
#   --script="npm run build && npx cap sync android && ./gradlew assembleRelease"

Write-Host "`n===== CloudBridge Platform 모바일 앱 설정 완료 =====" -ForegroundColor Cyan

Write-Host "`n주의사항:" -ForegroundColor Yellow
Write-Host "1. Google Services 설정 파일이 유효한지 확인하세요."
Write-Host "2. FCM 프로젝트가 올바르게 설정되었는지 확인하세요."
Write-Host "3. API Base URL이 올바른지 확인하세요."
Write-Host "4. Android SDK와 Xcode가 설치되어 있어야 합니다."
Write-Host "5. iOS 빌드의 경우 개발자 인증서가 필요합니다."
Write-Host "6. Release 빌드시 키스토어 설정이 필요합니다."

Write-Host "`n앱 정보:" -ForegroundColor Green
Write-Host "앱 ID: com.autorise.cloudbridge"
Write-Host "앱 이름: 구름다리"
Write-Host "웹 디렉토리: out/"
Write-Host "API Base: https://platform.autoriseinsight.co.kr" 