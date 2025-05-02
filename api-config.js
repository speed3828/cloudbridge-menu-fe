// API 설정 파일
module.exports = {
  // OpenAI GPT 설정
  openai: {
    apiKey: "YOUR_OPENAI_API_KEY_HERE", // 여기에 OpenAI API 키를 입력하세요
    model: "gpt-4o", // 사용할 모델
    endpoint: "https://api.openai.com/v1/chat/completions",
    organization: "", // 필요한 경우 조직 ID를 입력하세요
    defaultParams: {
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    }
  },
  
  // Anthropic Claude 설정
  claude: {
    apiKey: "YOUR_CLAUDE_API_KEY_HERE", // 여기에, claude-3-opus-20240229
    model: "claude-3-sonnet-20240229", // 사용할 모델: claude-3-opus-20240229 또는 claude-3-sonnet-20240229
    endpoint: "https://api.anthropic.com/v1/messages",
    defaultParams: {
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 1,
      top_k: 5
    }
  },
  
  // 공통 설정
  common: {
    timeout: 60000, // 요청 타임아웃 (밀리초)
    retries: 3, // 실패 시 재시도 횟수
    backoffFactor: 2 // 재시도 간격 팩터
  }
}; 