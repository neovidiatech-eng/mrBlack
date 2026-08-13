#!/usr/bin/env bash

# Exit immediately if a command exits with a non-zero status
set -e

CONTAINER_NAME="mr_black_app"

echo "=================================================="
echo "🚀 Starting Docker Deployment for ${CONTAINER_NAME}..."
echo "=================================================="

# 1. Rebuild and launch container via docker compose
echo "🔹 Step 1: Building image and launching container..."
docker compose up --build -d

echo "=================================================="
echo "🎉 Deployment completed for ${CONTAINER_NAME}!"
echo "=================================================="
