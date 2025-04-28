# CloudBridge Platform 모바일 앱 배포 자동화 스크립트

Write-Host "===== CloudBridge Platform 모바일 앱 배포 자동화 설정 시작 =====" -ForegroundColor Cyan

# 1. Fastlane 초기화
Write-Host "`n[1/6] Fastlane 초기화" -ForegroundColor Yellow
Write-Host "Android와 iOS 플랫폼용 Fastlane 환경을 초기화합니다..."
# 실제 실행시 아래 주석 해제
# run mobile:init fastlane --platform=both

# 2. Android 배포 레인 설정
Write-Host "`n[2/6] Android 배포 레인 설정" -ForegroundColor Yellow
Write-Host "Play Console 배포를 위한 Fastlane 레인을 설정합니다..."
# 실제 실행시 아래 주석 해제
# run mobile:add fastlane `
#   --platform=android `
#   --lane_name=deploy_play `
#   --script="gradlew bundleRelease && supply --aab ./app/build/outputs/bundle/release/app-release.aab --track internal --json_key $ANDROID_SERVICE_ACCOUNT_JSON"

# 3. iOS 배포 레인 설정
Write-Host "`n[3/6] iOS 배포 레인 설정" -ForegroundColor Yellow
Write-Host "TestFlight 배포를 위한 Fastlane 레인을 설정합니다..."
# 실제 실행시 아래 주석 해제
# run mobile:add fastlane `
#   --platform=ios `
#   --lane_name=deploy_tf `
#   --script="gym -scheme App -exportOptionsPlist ExportOptions.plist && pilot upload --ipa ./App.ipa"

# 4. GitHub Actions 워크플로우 설정
Write-Host "`n[4/6] GitHub Actions 워크플로우 설정" -ForegroundColor Yellow
Write-Host "릴리스 자동화 워크플로우를 설정합니다..."
# 실제 실행시 아래 주석 해제
# run devops:init ci `
#   --workflow=mobile-release `
#   --trigger_tag=v* `
#   --steps="npm run build && npx cap sync android ios" `
#   --steps="fastlane android deploy_play" `
#   --steps="fastlane ios deploy_tf" `
#   --slack_webhook_secret=SLACK_ALERT_URL

# 5. Repository Secrets 등록 안내
Write-Host "`n[5/6] Repository Secrets 등록 안내" -ForegroundColor Yellow
Write-Host @"
다음 시크릿을 GitHub Repository Settings → Secrets에 등록하세요:

1. ANDROID_SERVICE_ACCOUNT_JSON
   - Play Console 서비스 계정 JSON을 Base64로 인코딩하여 등록
   - Base64 인코딩 명령: cat service-account.json | base64

2. FASTLANE_APPLE_ID
   - Apple Developer 계정 이메일

3. FASTLANE_APPLE_PASSWORD
   - App-Specific Password (2단계 인증용)

4. FASTLANE_SESSION
   - 2FA 세션 토큰 (필요시)

5. SLACK_ALERT_URL
   - 배포 알림용 Slack 웹훅 URL
"@

# 6. 버전 태그 생성 예시
Write-Host "`n[6/6] 버전 태그 생성 예시" -ForegroundColor Yellow
Write-Host @"
버전 태그 생성 및 푸시 방법:

git tag -a v1.0.0 -m "Cloudbridge 모바일 1.0.0"
git push origin v1.0.0
"@

Write-Host "`n===== CloudBridge Platform 모바일 앱 배포 자동화 설정 완료 =====" -ForegroundColor Cyan

Write-Host "`n주의사항:" -ForegroundColor Yellow
Write-Host "1. Play Console에서 서비스 계정이 올바른 권한을 가지고 있는지 확인하세요."
Write-Host "2. Apple Developer 계정에 올바른 프로비저닝 프로파일이 설정되어 있는지 확인하세요."
Write-Host "3. GitHub Actions 실행 환경에 필요한 모든 시크릿이 등록되어 있는지 확인하세요."
Write-Host "4. 앱 버전 번호가 스토어 정책에 맞게 증가하는지 확인하세요."
Write-Host "5. 배포 전 테스트가 모두 통과되었는지 확인하세요."

Write-Host "`n배포 정보:" -ForegroundColor Green
Write-Host "Android 트랙: Internal Testing"
Write-Host "iOS 배포: TestFlight"
Write-Host "트리거: v* 태그" 