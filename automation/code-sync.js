/**
 * 코드베이스 동기화 자동화 스크립트
 * 
 * 이 스크립트는 백업 파일을 원본으로 복원하여 코드베이스를 동기화합니다.
 */

const fs = require('fs');
const path = require('path');

// 처리할 백업 파일 확장자
const BACKUP_EXTENSIONS = ['.bak'];

// 로그 설정
const LOG_DIR = path.join(__dirname, 'logs');
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}
const logFile = path.join(LOG_DIR, `code-sync-${new Date().toISOString().split('T')[0]}.log`);

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
 * 디렉토리 내 파일 재귀적 탐색
 * @param {string} dir 탐색할 디렉토리 경로
 * @param {string[]} result 찾은 파일 경로 배열
 * @returns {string[]} 파일 경로 배열
 */
function findFiles(dir, result = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !filePath.includes('node_modules') && !filePath.includes('.git')) {
      findFiles(filePath, result);
    } else if (stat.isFile()) {
      result.push(filePath);
    }
  });
  
  return result;
}

/**
 * 백업 파일 복원 함수
 * @param {string} backupPath 백업 파일 경로
 */
function restoreFromBackup(backupPath) {
  try {
    const originalPath = backupPath.substring(0, backupPath.lastIndexOf('.'));
    
    // 백업 파일 내용 읽기
    const content = fs.readFileSync(backupPath, 'utf8');
    
    // 원본 파일에 쓰기
    fs.writeFileSync(originalPath, content, 'utf8');
    
    log(`복원 완료: ${backupPath} → ${originalPath}`);
  } catch (error) {
    log(`복원 실패: ${backupPath} - ${error.message}`);
  }
}

/**
 * 메인 함수
 */
function main() {
  log('코드베이스 동기화 시작');
  
  const rootDirs = ['app', 'src'];
  let backupFiles = [];
  
  // 프로젝트 내 백업 파일 찾기
  rootDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      const files = findFiles(dir);
      const backups = files.filter(file => {
        const ext = path.extname(file);
        return BACKUP_EXTENSIONS.includes(ext);
      });
      backupFiles = [...backupFiles, ...backups];
    }
  });
  
  log(`발견된 백업 파일: ${backupFiles.length}개`);
  
  // 백업 파일 복원
  backupFiles.forEach(file => {
    restoreFromBackup(file);
  });
  
  log('코드베이스 동기화 완료');
}

// 스크립트 실행
main(); 