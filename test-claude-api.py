import requests
import json
import os

def test_claude_api():
    print("Testing Claude API...")
    
    # 환경 변수에서 API 키를 가져옵니다.
    api_key = os.environ.get("CLAUDE_API_KEY")
    
    if not api_key:
        print("Error: CLAUDE_API_KEY 환경 변수가 설정되지 않았습니다.")
        print("API 키를 설정하려면 다음 방법을 사용하세요:")
        print("1. 환경 변수 설정: export CLAUDE_API_KEY=your_api_key_here")
        print("2. .env 파일 생성: CLAUDE_API_KEY=your_api_key_here")
        return
    
    headers = {
        "Content-Type": "application/json",
        "x-api-key": api_key,
        "anthropic-version": "2023-06-01"
    }
    
    data = {
        "model": "claude-3-sonnet-20240229",  # 사용 가능한 최신 모델로 업데이트
        "messages": [{"role": "user", "content": "Hello, this is a test"}],
        "max_tokens": 100
    }
    
    try:
        response = requests.post(
            "https://api.anthropic.com/v1/messages",
            headers=headers,
            data=json.dumps(data)
        )
        
        if response.status_code == 200:
            print("API call successful!")
            print(json.dumps(response.json(), indent=2))
            print("\nResponse content:", response.json().get("content", [{}])[0].get("text", ""))
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
                models = models_response.json().get("models", [])
                for model in models:
                    print(f"- {model.get('name')}: {model.get('description')}")
            else:
                print(f"\nFailed to get models: {models_response.status_code}")
                print(models_response.text)
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    # Python-dotenv를 사용하여 .env 파일에서 환경 변수 로드 (설치된 경우)
    try:
        from dotenv import load_dotenv
        load_dotenv()
        print("환경 변수 로드됨 (.env)")
    except ImportError:
        print("dotenv 모듈이 설치되지 않았습니다. 환경 변수는 시스템 환경에서만 로드됩니다.")
    
    test_claude_api() 