#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import json
import requests
import time
from typing import Dict, Any, Optional, List, Union

# API 설정
CONFIG = {
    # OpenAI GPT 설정
    "openai": {
        "api_key": "YOUR_OPENAI_API_KEY_HERE",  # 여기에 OpenAI API 키를 입력하세요
        "model": "gpt-4o",  # 사용할 모델
        "endpoint": "https://api.openai.com/v1/chat/completions",
        "organization": "",  # 필요한 경우 조직 ID를 입력하세요
        "default_params": {
            "temperature": 0.7,
            "max_tokens": 1000,
            "top_p": 1,
            "frequency_penalty": 0,
            "presence_penalty": 0
        }
    },
    
    # Anthropic Claude 설정
    "claude": {
        "api_key": "YOUR_CLAUDE_API_KEY_HERE",  # 여기에 Claude API 키를 입력하세요
        "model": "claude-3-sonnet-20240229",  # 사용할 모델: claude-3-opus-20240229 또는 claude-3-sonnet-20240229
        "endpoint": "https://api.anthropic.com/v1/messages",
        "default_params": {
            "temperature": 0.7,
            "max_tokens": 1000,
            "top_p": 1,
            "top_k": 5
        }
    },
    
    # 공통 설정
    "common": {
        "timeout": 60,  # 요청 타임아웃 (초)
        "retries": 3,  # 실패 시 재시도 횟수
        "backoff_factor": 2  # 재시도 간격 팩터
    }
}

class AIClient:
    """
    GPT와 Claude API를 쉽게 호출할 수 있는 클라이언트 클래스
    """
    
    def __init__(self, config: Dict[str, Any] = None):
        """
        클라이언트 초기화
        
        Args:
            config: 설정 딕셔너리 (기본값: CONFIG)
        """
        self.config = config or CONFIG
        
        # 환경 변수에서 API 키를 가져오기 (환경 변수가 설정되어 있는 경우)
        if os.environ.get("OPENAI_API_KEY"):
            self.config["openai"]["api_key"] = os.environ.get("OPENAI_API_KEY")
        
        if os.environ.get("CLAUDE_API_KEY"):
            self.config["claude"]["api_key"] = os.environ.get("CLAUDE_API_KEY")

    def call_gpt(self, prompt: str, options: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        OpenAI GPT API 호출
        
        Args:
            prompt: 사용자 입력 텍스트
            options: API 호출 옵션
            
        Returns:
            응답 결과 딕셔너리
        """
        options = options or {}
        config = self.config["openai"]
        
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {config['api_key']}"
        }
        
        if config.get("organization"):
            headers["OpenAI-Organization"] = config["organization"]
        
        params = {
            **config["default_params"],
            **options,
            "model": options.get("model", config["model"]),
            "messages": [
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt}
            ]
        }
        
        try:
            response = requests.post(
                config["endpoint"],
                headers=headers,
                json=params,
                timeout=self.config["common"]["timeout"]
            )
            response.raise_for_status()
            data = response.json()
            
            return {
                "success": True,
                "data": data,
                "text": data["choices"][0]["message"]["content"]
            }
        except Exception as e:
            error_message = str(e)
            if hasattr(e, "response") and hasattr(e.response, "json"):
                try:
                    error_message = e.response.json().get("error", {}).get("message", str(e))
                except:
                    pass
            
            print(f"GPT API Error: {error_message}")
            return {
                "success": False,
                "error": error_message
            }

    def call_claude(self, prompt: str, options: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Anthropic Claude API 호출
        
        Args:
            prompt: 사용자 입력 텍스트
            options: API 호출 옵션
            
        Returns:
            응답 결과 딕셔너리
        """
        options = options or {}
        config = self.config["claude"]
        
        headers = {
            "Content-Type": "application/json",
            "x-api-key": config["api_key"],
            "anthropic-version": "2023-06-01"
        }
        
        params = {
            **config["default_params"],
            **options,
            "model": options.get("model", config["model"]),
            "messages": [
                {"role": "user", "content": prompt}
            ]
        }
        
        try:
            response = requests.post(
                config["endpoint"],
                headers=headers,
                json=params,
                timeout=self.config["common"]["timeout"]
            )
            response.raise_for_status()
            data = response.json()
            
            return {
                "success": True,
                "data": data,
                "text": data["content"][0]["text"]
            }
        except Exception as e:
            error_message = str(e)
            if hasattr(e, "response") and hasattr(e.response, "json"):
                try:
                    error_message = e.response.json().get("error", {}).get("message", str(e))
                except:
                    pass
            
            print(f"Claude API Error: {error_message}")
            return {
                "success": False,
                "error": error_message
            }

# 예제 사용법
def example():
    # 클라이언트 인스턴스 생성
    client = AIClient()
    
    # GPT 호출 예제
    gpt_result = client.call_gpt("Hello, what is the weather today?")
    print("GPT Response:", gpt_result["text"] if gpt_result["success"] else gpt_result["error"])
    
    # Claude 호출 예제
    claude_result = client.call_claude("Hello, what is the weather today?")
    print("Claude Response:", claude_result["text"] if claude_result["success"] else claude_result["error"])

if __name__ == "__main__":
    example() 