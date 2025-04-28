# Capacitor 의존성 설치 스크립트

Write-Host "===== Capacitor 의존성 설치 시작 =====" -ForegroundColor Cyan

# 1. Capacitor 코어 패키지 설치
Write-Host "`n[1/4] Capacitor 코어 패키지 설치" -ForegroundColor Yellow
Write-Host "Capacitor 코어 및 CLI 패키지를 설치합니다..."
npm install @capacitor/core @capacitor/cli

# 2. 타입 정의 설치
Write-Host "`n[2/4] 타입 정의 설치" -ForegroundColor Yellow
Write-Host "Node.js 타입 정의를 설치합니다..."
npm install --save-dev @types/node

# 3. tsconfig.json 생성
Write-Host "`n[3/4] TypeScript 설정 생성" -ForegroundColor Yellow
Write-Host "TypeScript 설정 파일을 생성합니다..."
$tsconfig = @"
{
  "compilerOptions": {
    "allowJs": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "isolatedModules": true,
    "jsx": "react",
    "lib": ["dom", "es2017"],
    "moduleResolution": "node",
    "noEmit": true,
    "strict": true,
    "target": "esnext",
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "types": ["node"]
  },
  "include": ["capacitor.config.ts"],
  "exclude": ["node_modules"]
}
"@
$tsconfig | Out-File -FilePath "tsconfig.json" -Encoding UTF8

# 4. 패키지 버전 확인
Write-Host "`n[4/4] 패키지 버전 확인" -ForegroundColor Yellow
Write-Host "설치된 패키지 버전을 확인합니다..."
npm list @capacitor/core @capacitor/cli @types/node

Write-Host "`n===== Capacitor 의존성 설치 완료 =====" -ForegroundColor Cyan

Write-Host "`n주의사항:" -ForegroundColor Yellow
Write-Host "1. package.json에 새로운 의존성이 추가되었는지 확인하세요."
Write-Host "2. tsconfig.json이 올바르게 생성되었는지 확인하세요."
Write-Host "3. node_modules가 정상적으로 설치되었는지 확인하세요."

Write-Host "`n다음 단계:" -ForegroundColor Green
Write-Host "1. TypeScript 설정이 적용되었는지 확인"
Write-Host "2. Capacitor 설정 파일 오류 해결 여부 확인"
Write-Host "3. 필요한 경우 IDE 재시작" 