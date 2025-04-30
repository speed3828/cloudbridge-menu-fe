import requests
import json

def test_openai_api():
    print("Testing OpenAI API...")
    
    # API 키를 직접 입력 (보안상 좋은 방법은 아닙니다)
    api_key = "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"
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }
    
    data = {
        "model": "gpt-3.5-turbo",
        "messages": [{"role": "user", "content": "Hello, this is a test"}],
        "max_tokens": 10
    }
    
    try:
        response = requests.post(
            "https://api.openai.com/v1/chat/completions",
            headers=headers,
            data=json.dumps(data)
        )
        
        if response.status_code == 200:
            print("API call successful!")
            print(response.json())
        else:
            print(f"API call failed with status code: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    test_openai_api() 