const fetch = require('node-fetch');

async function testOpenAI() {
  console.log('Testing OpenAI API...');
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'Hello, this is a test' }],
      max_tokens: 10
    })
  });
  
  const data = await response.json();
  console.log('OpenAI API Response:', data);
}

testOpenAI().catch(error => console.error('Error:', error)); 