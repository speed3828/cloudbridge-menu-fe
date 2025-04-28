#!/bin/bash

# Checkpoint script for CloudBridge Platform
# Usage: ./run_checkpoint.sh [checkpoint_name]

if [ -z "$1" ]; then
  echo "Error: Checkpoint name is required"
  echo "Usage: ./run_checkpoint.sh [init|auth|ingress|helm]"
  exit 1
fi

CHECKPOINT_NAME=$1
VALID_CHECKPOINTS=("init" "auth" "ingress" "helm")

# Check if the checkpoint is valid
valid=false
for cp in "${VALID_CHECKPOINTS[@]}"; do
  if [[ "$cp" == "$CHECKPOINT_NAME" ]]; then
    valid=true
    break
  fi
done

if [ "$valid" != true ]; then
  echo "Error: Invalid checkpoint name: $CHECKPOINT_NAME"
  echo "Valid checkpoints: ${VALID_CHECKPOINTS[*]}"
  exit 1
fi

echo "[CHECK] 변경 diff 검토 → 문제 없으면 y 입력"
read -p "Proceed (y/n)? " choice
case "$choice" in 
  y|Y ) echo "Checkpoint $CHECKPOINT_NAME passed!";;
  * ) echo "Checkpoint $CHECKPOINT_NAME failed. Exiting..."; exit 1;;
esac 