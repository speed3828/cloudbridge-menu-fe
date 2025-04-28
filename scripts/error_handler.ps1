# CloudBridge Platform Error Handler (PowerShell)
# Usage: .\error_handler.ps1 [error_type] [error_message]

param(
    [Parameter(Mandatory=$true)]
    [string]$ErrorType,
    
    [Parameter(Mandatory=$false)]
    [string]$ErrorMessage = ""
)

# Error log directory
$ErrorLogDir = ".ci_error"
if (-not (Test-Path $ErrorLogDir)) {
    New-Item -ItemType Directory -Path $ErrorLogDir | Out-Null
}

# Current timestamp
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"

# Log the error
$ErrorLogPath = Join-Path $ErrorLogDir "$Timestamp`_$ErrorType.log"
"Error Type: $ErrorType`nTimestamp: $(Get-Date)`nMessage: $ErrorMessage" | Out-File -FilePath $ErrorLogPath

# Display appropriate error message
switch ($ErrorType) {
    "BUILD_FAIL" {
        Write-Host "[BUILD] 컴파일 실패 – 로그 확인" -ForegroundColor Red
    }
    "TEST_FAIL" {
        Write-Host "[TEST] 실패 – failed_tests.txt 확인" -ForegroundColor Red
    }
    "POLICY_VIOLATION" {
        Write-Host "[POLICY] 지침 위반 – 설정 수정" -ForegroundColor Yellow
    }
    "LINT_FAIL" {
        Write-Host "[LINT] 스타일 오류 – black/isort 실행" -ForegroundColor Yellow
    }
    default {
        Write-Host "[ERROR] 알 수 없는 오류가 발생했습니다: $ErrorMessage" -ForegroundColor Red
    }
}

# Notify if SLACK_WEBHOOK_URL is set
$SlackWebhookUrl = $env:SLACK_WEBHOOK_URL
if ($SlackWebhookUrl) {
    $WorkspaceName = Split-Path -Path (Get-Location) -Leaf
    $payload = @{
        text = "🚨 Cursor Error on $WorkspaceName : $ErrorType - $ErrorMessage"
    } | ConvertTo-Json

    try {
        Invoke-RestMethod -Uri $SlackWebhookUrl -Method Post -Body $payload -ContentType "application/json"
        Write-Host "Slack notification sent." -ForegroundColor Blue
    } catch {
        Write-Host "Failed to send Slack notification: $_" -ForegroundColor Red
    }
}

# Ask if rollback is needed
$rollback = Read-Host "이전 커밋으로 롤백하시겠습니까? (y/n)"
if ($rollback -eq "y" -or $rollback -eq "Y") {
    Write-Host "롤백을 수행합니다..." -ForegroundColor Yellow
    git reset --hard HEAD~1
    Write-Host "롤백 완료" -ForegroundColor Green
} 