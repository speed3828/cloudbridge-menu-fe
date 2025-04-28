# Checkpoint script for CloudBridge Platform (PowerShell version)
# Usage: .\run_checkpoint.ps1 [checkpoint_name]

param(
    [Parameter(Mandatory=$true)]
    [string]$CheckpointName
)

$ValidCheckpoints = @("init", "auth", "ingress", "helm")

# Check if the checkpoint is valid
$valid = $false
foreach ($cp in $ValidCheckpoints) {
    if ($cp -eq $CheckpointName) {
        $valid = $true
        break
    }
}

if (-not $valid) {
    Write-Error "Error: Invalid checkpoint name: $CheckpointName"
    Write-Host "Valid checkpoints: $($ValidCheckpoints -join ', ')"
    exit 1
}

Write-Host "[CHECK] 변경 diff 검토 → 문제 없으면 y 입력"
$choice = Read-Host "Proceed (y/n)?"
if ($choice -eq "y" -or $choice -eq "Y") {
    Write-Host "Checkpoint $CheckpointName passed!"
} else {
    Write-Host "Checkpoint $CheckpointName failed. Exiting..."
    exit 1
} 