import requests
import json

def test_claude_api():
    print("Testing Claude API...")
    
    # API 키를 직접 입력 (보안상 좋은 방법은 아닙니다)
    api_key = "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"
    
    headers = {
        "Content-Type": "application/json",
        "x-api-key": api_key,
        "anthropic-version": "2023-06-01"
    }
    
    data = {
        "model": "claude-3-7-sonnet-20250219",
        "messages": [{"role": "user", "content": "Hello, this is a test"}],
        "max_tokens": 10
    }
    
    try:
        response = requests.post(
            "https://api.anthropic.com/v1/messages",
            headers=headers,
            data=json.dumps(data)
        )
        
        if response.status_code == 200:
            print("API call successful!")
            print(response.json())
        else:
            print(f"API call failed with status code: {response.status_code}")
            print(response.text)
            
            # 사용 가능한 모델 목록 확인
            models_response = requests.get(
                "https://api.anthropic.com/v1/models",
                headers={"x-api-key": api_key, "anthropic-version": "2023-06-01"}
            )
            
            if models_response.status_code == 200:
                print("\nAvailable models:")
                print(models_response.json())
            else:
                print(f"\nFailed to get models: {models_response.status_code}")
                print(models_response.text)
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    test_claude_api() 