#!/usr/bin/env node

/**
 * Node.js 모듈 의존성을 확인하는 스크립트
 * 실제 모듈을 import해보지 않고도 package.json에서 필요한 모듈들의 버전을 확인합니다.
 */

const fs = require('fs');
const path = require('path');

// 확인할 모듈 리스트
const criticalModules = [
  'next',
  'react',
  'react-dom',
  '@tanstack/react-query',
  'tailwindcss',
  'eslint'
];

// 색상 코드
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m'
};

function checkPackageJson(packagePath) {
  try {
    const packageContent = fs.readFileSync(packagePath, 'utf8');
    const packageJson = JSON.parse(packageContent);
    return packageJson;
  } catch (error) {
    console.error(`${colors.red}패키지 파일을 읽을 수 없습니다: ${packagePath}${colors.reset}`);
    return null;
  }
}

function main() {
  // 루트 package.json 확인
  const rootPackagePath = path.join(process.cwd(), 'package.json');
  const rootPackage = checkPackageJson(rootPackagePath);
  
  if (!rootPackage) {
    console.error(`${colors.red}루트 package.json 파일을 찾을 수 없습니다.${colors.reset}`);
    process.exit(1);
  }
  
  console.log(`${colors.green}프로젝트: ${rootPackage.name} (버전 ${rootPackage.version})${colors.reset}`);
  console.log('\n의존성 확인 중...\n');
  
  let missingModules = 0;
  
  // 핵심 모듈 확인
  criticalModules.forEach(moduleName => {
    let found = false;
    let version = null;
    
    if (rootPackage.dependencies && rootPackage.dependencies[moduleName]) {
      found = true;
      version = rootPackage.dependencies[moduleName];
    } else if (rootPackage.devDependencies && rootPackage.devDependencies[moduleName]) {
      found = true;
      version = rootPackage.devDependencies[moduleName];
    }
    
    if (found) {
      console.log(`${colors.green}✅ ${moduleName}: ${version}${colors.reset}`);
    } else {
      console.log(`${colors.red}❌ ${moduleName}: 찾을 수 없음${colors.reset}`);
      missingModules++;
    }
  });
  
  // 요약
  console.log('\n');
  if (missingModules === 0) {
    console.log(`${colors.green}✅ 모든 핵심 모듈이 package.json에 존재합니다.${colors.reset}`);
    return 0;
  } else {
    console.log(`${colors.yellow}⚠️ ${missingModules}개의 핵심 모듈이 package.json에 없습니다.${colors.reset}`);
    console.log(`${colors.yellow}필요한 모듈을 설치하려면 관리자 권한으로 다음 명령을 실행하세요:${colors.reset}`);
    console.log(`\nnpm install ${criticalModules.join(' ')} --save\n`);
    return 1;
  }
}

// 스크립트 실행
process.exit(main()); 