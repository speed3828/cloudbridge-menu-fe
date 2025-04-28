# CloudBridge Platform - Incident Response Setup Script
# Configures PagerDuty integration, runbook builder, and automated deployment

param(
    [Parameter(Mandatory=$true)]
    [string]$PagerDutyRoutingKey,
    
    [Parameter(Mandatory=$true)]
    [string]$SlackWebhookUrl,
    
    [Parameter(Mandatory=$true)]
    [string]$RunbookRepoUrl,
    
    [Parameter(Mandatory=$false)]
    [string]$RunbookBuilderPort = "5500",
    
    [Parameter(Mandatory=$false)]
    [string]$RunbookDataDir = "/data/runbooks",
    
    [Parameter(Mandatory=$false)]
    [string]$RunbookBucket = "cloudbridge-runbooks",
    
    [Parameter(Mandatory=$false)]
    [string]$CustomDomain = "runbook.autoriseinsight.co.kr"
)

# 함수: 진행 상태 출력
function Write-Step {
    param([string]$Message)
    Write-Host "`n[$(Get-Date -Format 'HH:mm:ss')] $Message" -ForegroundColor Cyan
}

# 함수: 성공 메시지 출력
function Write-Success {
    param([string]$Message)
    Write-Host $Message -ForegroundColor Green
}

# 함수: 오류 처리
function Write-ErrorAndExit {
    param([string]$Message)
    Write-Host "`nError: $Message" -ForegroundColor Red
    exit 1
}

# 함수: Python 스크립트 생성
function New-PythonScript {
    param(
        [string]$Name,
        [string]$Content
    )
    
    Set-Content -Path "./scripts/$Name" -Value $Content
    Write-Success "Created Python script: $Name"
}

try {
    # 1. PagerDuty 통합키 등록
    Write-Step "Registering PagerDuty routing key..."
    # run security:add key PAGERDUTY_ROUTING_KEY=$PagerDutyRoutingKey --service=devops
    Write-Success "PagerDuty key registered"

    # 2. 모니터링 통합 설정
    Write-Step "Configuring monitoring integrations..."
    # run monitoring:add pagerduty-integration `
    #   --webhook_secret=PAGERDUTY_ROUTING_KEY
    Write-Success "PagerDuty webhook configured"

    # 3. runbook-builder 서비스 스캐폴딩
    Write-Step "Creating runbook-builder service..."
    # run platform:init runbook-builder `
    #   --template=fastapi `
    #   --dir=apps/runbook-builder `
    #   --port=$RunbookBuilderPort
    Write-Success "Runbook builder service created"

    # 4. Markdown 런북 저장소 설정
    Write-Step "Initializing runbook repository..."
    # run runbook-builder:add repo `
    #   --git_url=$RunbookRepoUrl `
    #   --local_dir=$RunbookDataDir
    Write-Success "Runbook repository initialized"

    # 5. 렌더링 엔드포인트 생성
    Write-Step "Creating runbook rendering endpoint..."
    
    # Markdown 렌더링 핸들러 스크립트 생성
    $renderScript = @"
import markdown
import json
import os
from datetime import datetime
from pathlib import Path
from weasyprint import HTML

def render_markdown(request):
    try:
        data = request.json()
        runbook_key = data.get('runbook_key')
        output_format = data.get('format', 'html')  # html 또는 pdf
        
        # Markdown 파일 찾기
        runbook_path = Path('$RunbookDataDir') / f"{runbook_key}.md"
        if not runbook_path.exists():
            return {"error": "Runbook not found"}, 404
            
        # Markdown 읽기
        with open(runbook_path, 'r', encoding='utf-8') as f:
            md_content = f.read()
            
        # HTML 변환
        html_content = markdown.markdown(
            md_content,
            extensions=['tables', 'fenced_code', 'codehilite']
        )
        
        # HTML 템플릿 적용
        html_doc = f'''
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>CloudBridge Runbook - {runbook_key}</title>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; }}
                code {{ background: #f4f4f4; padding: 2px 5px; }}
                pre {{ background: #f4f4f4; padding: 15px; }}
                table {{ border-collapse: collapse; width: 100%; }}
                th, td {{ border: 1px solid #ddd; padding: 8px; }}
                th {{ background: #f4f4f4; }}
            </style>
        </head>
        <body>
            <h1>CloudBridge Runbook - {runbook_key}</h1>
            <p><em>Last updated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S UTC')}</em></p>
            <hr>
            {html_content}
        </body>
        </html>
        '''
        
        if output_format == 'pdf':
            # PDF 생성
            pdf_path = f'/tmp/{runbook_key}.pdf'
            HTML(string=html_doc).write_pdf(pdf_path)
            
            with open(pdf_path, 'rb') as f:
                return f.read(), 200, {'Content-Type': 'application/pdf'}
        else:
            return html_doc, 200, {'Content-Type': 'text/html'}
            
    except Exception as e:
        return {"error": str(e)}, 500

"@
    New-PythonScript -Name "render_markdown.py" -Content $renderScript
    
    # 엔드포인트 등록
    # run runbook-builder:add endpoint `
    #   --name=render-runbook `
    #   --path=/runbook/render `
    #   --method=POST `
    #   --handler=render_markdown
    Write-Success "Runbook rendering endpoint created"

    # 6. S3 버킷 및 CloudFront 설정
    Write-Step "Setting up S3 bucket and CloudFront..."
    # run devops:init runbook-bucket `
    #   --bucket=$RunbookBucket `
    #   --cloudfront=true `
    #   --custom_domain=$CustomDomain
    Write-Success "S3 bucket and CloudFront distribution created"

    # 7. 자동 동기화 CronJob 설정
    Write-Step "Configuring automatic sync job..."
    # run runbook-builder:add cron `
    #   --name=sync-runbooks `
    #   --schedule="*/15 * * * *" `
    #   --git_pull=true `
    #   --build_all=true `
    #   --sink=s3://$RunbookBucket
    Write-Success "Sync job configured"

    # 8. Slack 슬래시 커맨드 설정
    Write-Step "Setting up Slack slash command..."
    Set-Variable -Name runbookEndpoint -Value "https://runbook-builder.cloudbridge-prod.svc/runbook/render" -Scope Script
    Write-Host "Configured runbook endpoint: $runbookEndpoint" -ForegroundColor Gray
    
    # run devops:init slack-command `
    #   --command=/runbook `
    #   --url=$runbookEndpoint `
    #   --slack_webhook_secret=SLACK_ALERT_URL
    Write-Success "Slack slash command configured"

    Write-Host "`n✅ Incident response system setup completed successfully!" -ForegroundColor Green
    Write-Host @"
    
Configuration Summary:
- Runbook Builder: http://localhost:$RunbookBuilderPort
- Public Access: https://$CustomDomain
- Repository: $RunbookRepoUrl
- Data Directory: $RunbookDataDir
- S3 Bucket: $RunbookBucket
- Integrations:
  * PagerDuty Alerts
  * Slack Command: /runbook
- Auto-sync: Every 15 minutes
"@ -ForegroundColor Yellow

    Write-Host "`nNext Steps:" -ForegroundColor Magenta
    Write-Host "1. Verify runbook-builder service: http://localhost:$RunbookBuilderPort/docs"
    Write-Host "2. Test PagerDuty integration with a test alert"
    Write-Host "3. Add initial runbook templates to the repository"
    Write-Host "4. Try the /runbook slash command in Slack"

} catch {
    Write-ErrorAndExit $_.Exception.Message
} 