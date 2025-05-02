import os
import re
import sys
import json
from pathlib import Path

def check_security_patterns(file_path, patterns):
    """파일에서 보안 취약점 패턴을 검사합니다."""
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        try:
            content = f.read()
            for pattern_name, pattern in patterns.items():
                if re.search(pattern, content):
                    print(f"[취약점 발견] {pattern_name} in {file_path}")
                    return True
        except Exception as e:
            print(f"Error reading {file_path}: {e}")
    return False

def scan_directory(directory, patterns, excluded_dirs=None, excluded_files=None):
    """디렉토리를 재귀적으로 스캔하여 보안 취약점을 검사합니다."""
    if excluded_dirs is None:
        excluded_dirs = ['node_modules', '.git', 'dist', 'build', '.next']
    
    if excluded_files is None:
        excluded_files = ['test-', 'mock-', '.test.', '.spec.']
    
    vulnerabilities_found = False
    
    for root, dirs, files in os.walk(directory):
        # 제외 디렉토리 필터링
        dirs[:] = [d for d in dirs if d not in excluded_dirs and not any(ex in d for ex in ['test', 'mock'])]
        
        for file in files:
            # 테스트 파일이나 제외된 파일 패턴 건너뛰기
            if any(ex in file for ex in excluded_files):
                continue
                
            if file.endswith(('.js', '.jsx', '.ts', '.tsx', '.py')):
                file_path = os.path.join(root, file)
                if check_security_patterns(file_path, patterns):
                    vulnerabilities_found = True
    
    return vulnerabilities_found

def main():
    # 검사할 보안 취약점 패턴 정의
    security_patterns = {
        'Hardcoded Credentials': r'(password|secret|token|api_key|apikey)\s*=\s*["\'][^"\']+["\']',
        'SQL Injection': r'SELECT\s+.*\s+FROM\s+.*\s+WHERE\s+.*=\s*[\'"].*\$.*[\'"]',
        'Command Injection': r'(eval|exec|execSync|spawn|system)\s*\(',
        'XSS': r'(innerHTML|outerHTML|document\.write)\s*=',
        'Insecure Storage': r'localStorage\.setItem\(["\']token["\']',
        'Insecure Redirect': r'window\.location\s*=',
        'Insecure Cookies': r'document\.cookie\s*='
    }
    
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    print(f"보안 점검 실행 중: {project_root}")
    
    # 테스트 파일 제외 및 실제 소스 코드만 검사
    excluded_files = ['test-api.py', 'test-api.js', 'test-claude-api.py']
    vulnerabilities_found = scan_directory(project_root, security_patterns, excluded_files=excluded_files)
    
    if not vulnerabilities_found:
        print("✅ 보안 점검 완료! 취약점이 발견되지 않았습니다.")
        return 0
    else:
        print("❌ 보안 점검 완료! 취약점이 발견되었습니다. 코드를 검토해주세요.")
        return 1

if __name__ == "__main__":
    sys.exit(main()) 