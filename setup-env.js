// 환경 변수 설정 파일
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv'); // dotenv 패키지 필요 (npm install dotenv)

/**
 * 환경 변수 파일(.env)을 로드하고 API 설정을 업데이트하는 함수
 * @param {string} envPath - .env 파일 경로 (기본값: '.env')
 * @returns {object} - 로드된 환경 변수
 */
function loadEnvConfig(envPath = '.env') {
  try {
    // .env 파일이 존재하는지 확인
    if (!fs.existsSync(envPath)) {
      console.warn(`경고: ${envPath} 파일이 존재하지 않습니다. env-config.example을 복사하여 .env 파일을 생성하세요.`);
      return {};
    }

    // .env 파일 로드
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    
    // 환경 변수로 설정
    Object.entries(envConfig).forEach(([key, value]) => {
      process.env[key] = value;
    });
    
    // api-config.js 파일이 존재하는지 확인하고 업데이트
    const apiConfigPath = path.join(__dirname, 'api-config.js');
    if (fs.existsSync(apiConfigPath)) {
      try {
        // api-config.js 파일 로드
        const apiConfig = require('./api-config.js');
        
        // OpenAI API 키 업데이트
        if (process.env.OPENAI_API_KEY) {
          apiConfig.openai.apiKey = process.env.OPENAI_API_KEY;
        }
        
        // OpenAI 조직 ID 업데이트
        if (process.env.OPENAI_ORG_ID) {
          apiConfig.openai.organization = process.env.OPENAI_ORG_ID;
        }
        
        // Claude API 키 업데이트
        if (process.env.CLAUDE_API_KEY) {
          apiConfig.claude.apiKey = process.env.CLAUDE_API_KEY;
        }
        
        // API 타임아웃 업데이트
        if (process.env.API_TIMEOUT) {
          apiConfig.common.timeout = parseInt(process.env.API_TIMEOUT, 10);
        }
        
        console.log('API 설정이 업데이트되었습니다.');
      } catch (error) {
        console.error('API 설정 업데이트 중 오류 발생:', error.message);
      }
    }
    
    return envConfig;
  } catch (error) {
    console.error('환경 변수 로드 중 오류 발생:', error.message);
    return {};
  }
}

// 직접 실행할 경우 환경 변수 로드
if (require.main === module) {
  const envConfig = loadEnvConfig();
  console.log('환경 변수가 로드되었습니다.');
  
  // 민감한 정보를 가리고 로드된 환경 변수 출력
  const maskedConfig = { ...envConfig };
  if (maskedConfig.OPENAI_API_KEY) {
    maskedConfig.OPENAI_API_KEY = maskedConfig.OPENAI_API_KEY.substring(0, 5) + '...' + maskedConfig.OPENAI_API_KEY.slice(-4);
  }
  if (maskedConfig.CLAUDE_API_KEY) {
    maskedConfig.CLAUDE_API_KEY = maskedConfig.CLAUDE_API_KEY.substring(0, 5) + '...' + maskedConfig.CLAUDE_API_KEY.slice(-4);
  }
  console.log('로드된 환경 변수:', maskedConfig);
}

module.exports = { loadEnvConfig }; 