import os
import sys
import json
import yaml
from pathlib import Path
import importlib.util
from typing import List, Dict, Optional, Any
from fastapi import FastAPI

def load_app_module(app_path: str) -> Optional[FastAPI]:
    """FastAPI 앱 모듈을 동적으로 로드하고 FastAPI 인스턴스를 반환"""
    try:
        spec = importlib.util.spec_from_file_location("app_module", app_path)
        if not spec or not spec.loader:
            raise ImportError(f"Failed to load spec from {app_path}")
        
        module = importlib.util.module_from_spec(spec)
        sys.modules["app_module"] = module
        spec.loader.exec_module(module)
        
        # FastAPI 앱 인스턴스 검색
        if hasattr(module, 'app') and isinstance(module.app, FastAPI):
            return module.app
        else:
            print(f"Warning: No FastAPI instance found in {app_path}")
            return None
    except Exception as e:
        print(f"Error loading module {app_path}: {e}")
        return None

def extract_openapi_spec(app_paths: List[str], output_dir: str) -> bool:
    """여러 FastAPI 앱에서 OpenAPI 스펙을 추출하고 병합"""
    try:
        # 출력 디렉토리 생성
        os.makedirs(output_dir, exist_ok=True)
        
        merged_spec: Dict[str, Any] = {
            "openapi": "3.0.2",
            "info": {
                "title": "CloudBridge Platform API",
                "description": "CloudBridge Platform의 통합 API 문서",
                "version": "1.0.0",
                "contact": {
                    "name": "CloudBridge Team",
                    "email": "support@autoriseinsight.co.kr"
                }
            },
            "paths": {},
            "components": {
                "schemas": {},
                "securitySchemes": {
                    "OAuth2": {
                        "type": "oauth2",
                        "flows": {
                            "authorizationCode": {
                                "authorizationUrl": "https://auth.autoriseinsight.co.kr/oauth/authorize",
                                "tokenUrl": "https://auth.autoriseinsight.co.kr/oauth/token",
                                "scopes": {
                                    "read": "Read access",
                                    "write": "Write access"
                                }
                            }
                        }
                    }
                }
            }
        }
        
        # 각 앱의 OpenAPI 스펙 추출 및 병합
        for app_path in app_paths:
            app = load_app_module(app_path)
            if not app:
                continue
                
            app_spec = app.openapi()
            
            # 경로 병합
            for path, operations in app_spec.get("paths", {}).items():
                if path not in merged_spec["paths"]:
                    merged_spec["paths"][path] = operations
                else:
                    # 중복 경로 처리
                    for method, operation in operations.items():
                        if method not in merged_spec["paths"][path]:
                            merged_spec["paths"][path][method] = operation
                        else:
                            # 경로 충돌 해결
                            new_path = f"{path}_{app_path.split('/')[-2]}"
                            if new_path not in merged_spec["paths"]:
                                merged_spec["paths"][new_path] = {}
                            merged_spec["paths"][new_path][method] = operation
            
            # 스키마 병합
            for name, schema in app_spec.get("components", {}).get("schemas", {}).items():
                if name not in merged_spec["components"]["schemas"]:
                    merged_spec["components"]["schemas"][name] = schema
                else:
                    # 스키마 충돌 해결
                    new_name = f"{name}_{app_path.split('/')[-2]}"
                    merged_spec["components"]["schemas"][new_name] = schema
        
        # YAML 형식으로 저장
        yaml_path = os.path.join(output_dir, "openapi.yaml")
        with open(yaml_path, 'w', encoding='utf-8') as f:
            yaml.dump(merged_spec, f, allow_unicode=True, sort_keys=False)
        
        # JSON 형식으로도 저장
        json_path = os.path.join(output_dir, "openapi.json")
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(merged_spec, f, ensure_ascii=False, indent=2)
            
        print(f"OpenAPI 스펙 추출 완료:\n- YAML: {yaml_path}\n- JSON: {json_path}")
        return True
        
    except Exception as e:
        print(f"OpenAPI 스펙 추출 중 오류 발생: {e}")
        return False

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python openapi_export.py app1_path app2_path ... output_dir")
        sys.exit(1)
        
    app_paths = sys.argv[1:-1]
    output_dir = sys.argv[-1]
    
    success = extract_openapi_spec(app_paths, output_dir)
    sys.exit(0 if success else 1) 