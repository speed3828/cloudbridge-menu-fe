#!/usr/bin/env node
/**
 * 브랜치 동기화 유틸리티 스크립트
 * 사용법: node sync-branches.js [소스_브랜치] [대상_브랜치] [--force]
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 인자 파싱
let sourceBranch = process.argv[2] || 'main';
let targetBranch = process.argv[3] || 'staging';
const forceFlag = process.argv.includes('--force');

// 현재 깃 저장소에 있는지 확인
function isGitRepo() {
  try {
    execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

// 브랜치가 존재하는지 확인
function branchExists(branch) {
  try {
    execSync(`git show-ref --verify --quiet refs/heads/${branch} || git show-ref --verify --quiet refs/remotes/origin/${branch}`);
    return true;
  } catch (e) {
    return false;
  }
}

// 변경 사항 저장
function stashChanges() {
  try {
    const status = execSync('git status --porcelain').toString();
    if (status.trim() !== '') {
      console.log('작업 디렉토리의 변경 사항을 임시 저장합니다...');
      execSync('git stash');
      return true;
    }
    return false;
  } catch (e) {
    console.log('변경 사항 저장 중 오류가 발생했습니다:', e.message);
    return false;
  }
}

// 브랜치 동기화
function syncBranches() {
  if (!isGitRepo()) {
    console.error('오류: 이 디렉토리는 git 저장소가 아닙니다.');
    process.exit(1);
  }

  console.log(`🔄 브랜치 동기화: ${sourceBranch} → ${targetBranch}${forceFlag ? ' (강제)' : ''}`);

  // 변경 사항이 있는지 확인하고 저장
  const hasStashed = stashChanges();

  try {
    // 브랜치 존재 여부 확인
    if (!branchExists(sourceBranch)) {
      console.error(`오류: '${sourceBranch}' 브랜치를 찾을 수 없습니다.`);
      process.exit(1);
    }

    // 현재 브랜치 저장
    const currentBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
    
    // 소스 브랜치 체크아웃
    console.log(`소스 브랜치(${sourceBranch})를 체크아웃합니다...`);
    execSync(`git checkout ${sourceBranch}`);
    execSync('git pull origin ' + sourceBranch);
    
    // 대상 브랜치가 존재하는지 확인
    const targetExists = branchExists(targetBranch);
    
    if (targetExists) {
      console.log(`대상 브랜치(${targetBranch})를 체크아웃합니다...`);
      execSync(`git checkout ${targetBranch}`);
      
      if (!forceFlag) {
        // 일반 병합
        console.log(`${sourceBranch}의 변경 사항을 ${targetBranch}에 병합합니다...`);
        execSync(`git merge ${sourceBranch} --no-edit`);
      } else {
        // 강제 동기화
        console.log(`경고: 강제 동기화를 수행합니다. ${targetBranch}의 독립적인 변경 사항이 손실됩니다!`);
        execSync(`git reset --hard origin/${sourceBranch}`);
      }
    } else {
      // 대상 브랜치 생성
      console.log(`대상 브랜치(${targetBranch})가 존재하지 않습니다. 새로 생성합니다...`);
      execSync(`git checkout -b ${targetBranch}`);
    }
    
    // 원격 저장소에 푸시
    console.log(`변경 사항을 원격 저장소에 푸시합니다...`);
    if (forceFlag) {
      execSync(`git push origin ${targetBranch} --force`);
    } else {
      execSync(`git push origin ${targetBranch}`);
    }
    
    // 원래 브랜치로 돌아가기
    console.log(`원래 브랜치(${currentBranch})로 돌아갑니다...`);
    execSync(`git checkout ${currentBranch}`);
    
    // 변경 사항 복원
    if (hasStashed) {
      console.log('임시 저장한 변경 사항을 복원합니다...');
      execSync('git stash pop');
    }
    
    console.log(`✅ 브랜치 동기화 완료: ${sourceBranch} → ${targetBranch}`);
    
  } catch (error) {
    console.error('오류가 발생했습니다:', error.message);
    
    // 변경 사항 복원 시도
    if (hasStashed) {
      try {
        console.log('임시 저장한 변경 사항을 복원합니다...');
        execSync('git stash pop');
      } catch (e) {
        console.error('변경 사항 복원 중 오류가 발생했습니다:', e.message);
      }
    }
    
    process.exit(1);
  }
}

// 도움말 표시
function showHelp() {
  console.log(`
브랜치 동기화 유틸리티 스크립트
사용법: node sync-branches.js [소스_브랜치] [대상_브랜치] [--force]

옵션:
  소스_브랜치     동기화할 소스 브랜치 (기본값: main)
  대상_브랜치     소스 브랜치와 동기화할 대상 브랜치 (기본값: staging)
  --force        강제 동기화 (대상 브랜치의 독립적 변경사항 손실됨)
  --help, -h     이 도움말 메시지 표시

예시:
  node sync-branches.js                  # main → staging 동기화
  node sync-branches.js main develop     # main → develop 동기화
  node sync-branches.js develop main     # develop → main 동기화
  node sync-branches.js main staging --force  # staging 브랜치를 main과 강제로 동일하게 설정
  `);
  process.exit(0);
}

// 도움말 옵션 확인
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  showHelp();
}

// 메인 실행
syncBranches(); 