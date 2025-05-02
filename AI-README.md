# GPT & Claude API 설정 가이드

이 가이드는 OpenAI GPT API와 Anthropic Claude API를 쉽게 설정하고 사용하는 방법을 설명합니다.

## 1. API 키 준비

### OpenAI API 키 얻기

1. [OpenAI 웹사이트](https://platform.openai.com/)에 로그인 또는 회원가입
2. 오른쪽 상단의 프로필 아이콘 클릭 > API Keys 메뉴 선택
3. "Create new secret key" 버튼 클릭
4. 키 이름 입력 후 생성된 API 키 복사

### Anthropic Claude API 키 얻기

1. [Anthropic 웹사이트](https://console.anthropic.com/)에 로그인 또는 회원가입
2. API 키 섹션 이동
3. "Create API Key" 버튼 클릭
4. 생성된 API 키 복사

## 2. 환경 설정

### 방법 1: 환경 변수 파일 사용

1. `env-config.example` 파일을 `.env`로 복사:

   ```bash
   cp env-config.example .env
   ```

2. `.env` 파일을 열고 API 키 입력:

   ```plaintext
   OPENAI_API_KEY=your_openai_api_key_here
   OPENAI_ORG_ID=your_organization_id_if_needed
   CLAUDE_API_KEY=your_claude_api_key_here
   ```

### 방법 2: 설정 파일 직접 수정

`api-config.js` 파일을 열고 API 키 입력:

```javascript
module.exports = {
  openai: {
    apiKey: "YOUR_OPENAI_API_KEY_HERE", // 여기에 OpenAI API 키 입력
    // ...
  },
  claude: {
    apiKey: "YOUR_CLAUDE_API_KEY_HERE", // 여기에 Claude API 키 입력
    // ...
  },
  // ...
};
```

## 3. 종속성 설치

JavaScript 사용 시:

```bash
npm install axios dotenv
```

Python 사용 시:

```bash
pip install requests python-dotenv
```

## 4. 사용 방법

### JavaScript 예제

```javascript
// 환경 변수 로드 (환경 변수 사용 시)
require('./setup-env').loadEnvConfig();

// API 클라이언트 사용
const { callGPT, callClaude } = require('./gpt-claude-client');

async function main() {
  // GPT 호출
  const gptResult = await callGPT("Hello, GPT!");
  console.log('GPT:', gptResult.text);
  
  // Claude 호출
  const claudeResult = await callClaude("Hello, Claude!");
  console.log('Claude:', claudeResult.text);
}

main();
```

### Python 예제

```python
from gpt_claude_client import AIClient

# 클라이언트 인스턴스 생성
client = AIClient()

# GPT 호출
gpt_result = client.call_gpt("Hello, GPT!")
print("GPT:", gpt_result["text"])

# Claude 호출
claude_result = client.call_claude("Hello, Claude!")
print("Claude:", claude_result["text"])
```

## 5. 참고 사항

### API 요금

- OpenAI API 사용 시 발생한 토큰 수에 따라 요금이 부과됩니다.
- Claude API 또한 토큰 사용량에 따라 요금이 부과됩니다.
- 각 공식 사이트에서 최신 요금 정보를 확인하세요.

### 모델 선택

설정 파일에서 모델을 변경할 수 있습니다:

- OpenAI: `gpt-4o`, `gpt-4-turbo`, `gpt-3.5-turbo` 등
- Claude: `claude-3-opus-20240229`, `claude-3-sonnet-20240229`, `claude-3-haiku-20240307` 등

### 보안

- API 키는 항상 안전하게 보관하세요.
- 공개 저장소에 API 키를 업로드하지 마세요.
- 가능하면 환경 변수를 사용하여 키를 관리하세요.

## 문제 해결

### 일반적인 오류

- **401 Unauthorized**: API 키가 잘못되었거나 만료됨
- **429 Too Many Requests**: 너무 많은 요청, 속도 제한에 걸림
- **500 Server Error**: API 서버 측 오류

### 로깅 활성화

디버깅을 위해 로깅을 활성화할 수 있습니다:

```javascript
// JavaScript
const gptResult = await callGPT("Hello", { debug: true });
```

```python
# Python
gpt_result = client.call_gpt("Hello", {"debug": true})
```
