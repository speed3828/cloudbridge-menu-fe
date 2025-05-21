/**
 * GitHub 저장소 동기화 자동화 스크립트
 * 
 * 이 스크립트는 GitHub 저장소와 동기화하고 4200 포트에서 서버를 실행합니다.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 저장소 URL (실제 URL로 대체 필요)
const REPO_URL = 'https://github.com/youruser/cloudbridge-menu-fe.git';
const PORT = 4200;

// 로그 디렉토리
const LOG_DIR = path.join(__dirname, 'logs');
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

// 로그 파일 경로
const logFile = path.join(LOG_DIR, `git-sync-${new Date().toISOString().split('T')[0]}.log`);

/**
 * 로그 기록 함수
 * @param {string} message 로그 메시지
 */
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} - ${message}\n`;
  
  console.log(message);
  fs.appendFileSync(logFile, logMessage);
}

/**
 * GitHub 저장소에서 최신 변경사항 가져오기
 */
function pullLatestChanges() {
  try {
    log('GitHub 저장소에서 최신 변경사항 가져오는 중...');
    execSync('git pull origin master', { stdio: 'inherit' });
    log('저장소 동기화 완료');
  } catch (error) {
    log(`오류: ${error.message}`);
  }
}

/**
 * 서버 실행 함수
 */
function startServer() {
  try {
    log(`Next.js 서버 시작 (포트: ${PORT})...`);
    execSync(`npx next dev -p ${PORT}`, { stdio: 'inherit' });
  } catch (error) {
    log(`서버 실행 중 오류: ${error.message}`);
  }
}

// 메인 함수
function main() {
  log('GitHub 동기화 및 서버 시작 자동화 스크립트 시작');
  pullLatestChanges();
  startServer();
}

// 스크립트 실행
main(); 