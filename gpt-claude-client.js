// GPT와 Claude API 클라이언트 예제
const axios = require('axios');
const config = require('./api-config.js');

// OpenAI GPT API 호출 함수
async function callGPT(prompt, options = {}) {
  try {
    const { apiKey, model, endpoint, defaultParams } = config.openai;
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    };
    
    if (config.openai.organization) {
      headers['OpenAI-Organization'] = config.openai.organization;
    }
    
    const params = {
      ...defaultParams,
      ...options,
      model: options.model || model,
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt }
      ]
    };
    
    const response = await axios.post(endpoint, params, { 
      headers,
      timeout: config.common.timeout
    });
    
    return {
      success: true,
      data: response.data,
      text: response.data.choices[0].message.content
    };
  } catch (error) {
    console.error('GPT API Error:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.error || error.message
    };
  }
}

// Anthropic Claude API 호출 함수
async function callClaude(prompt, options = {}) {
  try {
    const { apiKey, model, endpoint, defaultParams } = config.claude;
    
    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    };
    
    const params = {
      ...defaultParams,
      ...options,
      model: options.model || model,
      messages: [
        { role: "user", content: prompt }
      ]
    };
    
    const response = await axios.post(endpoint, params, { 
      headers,
      timeout: config.common.timeout
    });
    
    return {
      success: true,
      data: response.data,
      text: response.data.content[0].text
    };
  } catch (error) {
    console.error('Claude API Error:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.error || error.message
    };
  }
}

// 예제 사용법
async function example() {
  // GPT 호출 예제
  const gptResult = await callGPT("Hello, what is the weather today?");
  console.log('GPT Response:', gptResult.success ? gptResult.text : gptResult.error);
  
  // Claude 호출 예제
  const claudeResult = await callClaude("Hello, what is the weather today?");
  console.log('Claude Response:', claudeResult.success ? claudeResult.text : claudeResult.error);
}

// 모듈 내보내기
module.exports = {
  callGPT,
  callClaude,
  example
};

// 직접 실행할 경우 예제 실행
if (require.main === module) {
  example();
} 