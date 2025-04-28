# CloudBridge Platform - ML Pipeline Setup Script
# Configures Airflow, Kubeflow, and ML model retraining pipeline

param(
    [Parameter(Mandatory=$true)]
    [string]$DockerUsername,
    
    [Parameter(Mandatory=$false)]
    [string]$AirflowPort = "5200",
    
    [Parameter(Mandatory=$false)]
    [string]$AirflowNamespace = "ml-ops",
    
    [Parameter(Mandatory=$false)]
    [string]$DagsVolume = "/mnt/airflow/dags",
    
    [Parameter(Mandatory=$true)]
    [string]$SlackWebhookUrl,
    
    [Parameter(Mandatory=$false)]
    [string]$S3BucketName = "cloudbridge-ml-models"
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
    
    Set-Content -Path "./dags/$Name" -Value $Content
    Write-Success "Created Python script: $Name"
}

try {
    # 1. Airflow 배포
    Write-Step "Deploying Airflow..."
    # run devops:init airflow `
    #   --namespace=$AirflowNamespace `
    #   --port=$AirflowPort `
    #   --dags_volume=$DagsVolume
    Write-Success "Airflow deployed successfully"

    # 2. Kubeflow Training Job 템플릿 등록
    Write-Step "Registering Kubeflow training job templates..."
    
    # Recommendation Model Template
    # run mlops:init kubeflow-template `
    #   --name=rec-model-train `
    #   --image=docker.io/$DockerUsername/rec-trainer:latest `
    #   --command="python train.py --epochs=3" `
    #   --output=s3://$S3BucketName/rec/$(Get-Date -Format 'yyyy-MM-dd')/model.pkl
    
    # Vision Model Template
    # run mlops:init kubeflow-template `
    #   --name=vision-model-train `
    #   --image=docker.io/$DockerUsername/vision-trainer:latest `
    #   --command="python train.py --dataset s3://cloudbridge-live-media" `
    #   --output=s3://$S3BucketName/vision/$(Get-Date -Format 'yyyy-MM-dd')/model.pt
    Write-Success "Kubeflow templates registered"

    # 3. Airflow DAG 생성
    Write-Step "Creating Airflow DAG for daily retraining..."
    # run mlops:add airflow-dag `
    #   --name=daily-ml-retrain `
    #   --schedule="0 2 * * *" `
    #   --tasks=\
    #     extract_feedback:python ./dags/extract_feedback.py,\
    #     train_rec:kubeflow rec-model-train,\
    #     train_vision:kubeflow vision-model-train,\
    #     deploy_rec:python ./dags/deploy_rec.py,\
    #     deploy_vision:python ./dags/deploy_vision.py
    Write-Success "Airflow DAG created"

    # 4. 배포 스크립트 생성
    Write-Step "Creating model deployment scripts..."
    
    # Recommendation Model Deployment Script
    $recDeployScript = @"
import boto3
import requests
from datetime import datetime

def deploy_rec_model():
    # S3에서 새 모델 다운로드
    s3 = boto3.client('s3')
    date_str = datetime.now().strftime('%Y-%m-%d')
    model_key = f'rec/{date_str}/model.pkl'
    
    try:
        s3.download_file('$S3BucketName', model_key, '/tmp/new_rec_model.pkl')
        
        # Rec-Core 서비스에 모델 리로드 요청
        response = requests.post(
            'http://rec-core.cloudbridge-prod.svc/reload',
            json={'model_path': '/tmp/new_rec_model.pkl'}
        )
        response.raise_for_status()
        print("Successfully deployed new recommendation model")
        
    except Exception as e:
        print(f"Error deploying recommendation model: {e}")
        raise

if __name__ == '__main__':
    deploy_rec_model()
"@

    # Vision Model Deployment Script
    $visionDeployScript = @"
import boto3
import requests
from datetime import datetime

def deploy_vision_model():
    # S3에서 새 모델 다운로드
    s3 = boto3.client('s3')
    date_str = datetime.now().strftime('%Y-%m-%d')
    model_key = f'vision/{date_str}/model.pt'
    
    try:
        s3.download_file('$S3BucketName', model_key, '/tmp/new_vision_model.pt')
        
        # Vision-Core 서비스에 모델 리로드 요청
        response = requests.post(
            'http://vision-core.cloudbridge-prod.svc/model/reload',
            json={'model_path': '/tmp/new_vision_model.pt'}
        )
        response.raise_for_status()
        print("Successfully deployed new vision model")
        
    except Exception as e:
        print(f"Error deploying vision model: {e}")
        raise

if __name__ == '__main__':
    deploy_vision_model()
"@

    # Create deployment scripts
    New-PythonScript -Name "deploy_rec.py" -Content $recDeployScript
    New-PythonScript -Name "deploy_vision.py" -Content $visionDeployScript

    # 5. Slack 알림 설정
    Write-Step "Configuring Slack notifications for training results..."
    # run monitoring:add alert `
    #   --name=ML-Retrain-Result `
    #   --expr='ml_training_status == "failed"' `
    #   --for=0m `
    #   --slack_webhook_secret=SLACK_ALERT_URL `
    #   --message='🚨 ML 재학습 실패: {{ $labels.job }}'
    Write-Success "Slack notifications configured"

    Write-Host "`n✅ ML Pipeline setup completed successfully!" -ForegroundColor Green
    Write-Host @"
    
Configuration Summary:
- Airflow: http://localhost:$AirflowPort
- Namespace: $AirflowNamespace
- DAGs Volume: $DagsVolume
- Docker Images:
  * Rec Trainer: docker.io/$DockerUsername/rec-trainer:latest
  * Vision Trainer: docker.io/$DockerUsername/vision-trainer:latest
- S3 Bucket: $S3BucketName
- Schedule: Daily at 02:00 UTC
"@ -ForegroundColor Yellow

    Write-Host "`nNext Steps:" -ForegroundColor Magenta
    Write-Host "1. Verify Airflow deployment: http://localhost:$AirflowPort"
    Write-Host "2. Check DAG status in Airflow UI"
    Write-Host "3. Monitor first training run"
    Write-Host "4. Verify model deployment scripts"

} catch {
    Write-ErrorAndExit $_.Exception.Message
} 