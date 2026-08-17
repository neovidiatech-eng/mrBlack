#!/usr/bin/env bash

# Exit immediately if a command exits with a non-zero status
set -e

APP_NAME="mr_black"

echo "=================================================="
echo "🚀 Starting Deployment Process for ${APP_NAME}..."
echo "=================================================="

# 1. Next Build
echo "🔹 Step 1: Running 'npm run build'..."
npm run build
echo "✅ Step 1 Completed: Next.js build finished successfully."

# 2. Clean old static & copy new static
echo "🔹 Step 2: Cleaning old static assets in .next/standalone/.next/static..."
rm -rf .next/standalone/.next/static
mkdir -p .next/standalone/.next/static
echo "🔹 Step 2: Copying new static assets to .next/standalone/.next/static..."
cp -r .next/static/* .next/standalone/.next/static/
echo "✅ Step 2 Completed: Static assets copied successfully."

# 3. Clean old public & copy new public
echo "🔹 Step 3: Cleaning old public directory in .next/standalone/public..."
rm -rf .next/standalone/public
echo "🔹 Step 3: Copying new public directory to .next/standalone/public..."
cp -r public .next/standalone/public
echo "✅ Step 3 Completed: Public assets copied successfully."

# 4. Restart PM2 Process with updated environment
echo "🔹 Step 4: Restarting PM2 process '${APP_NAME}' with --update-env..."
if pm2 restart "${APP_NAME}" --update-env; then
    echo "✅ Step 4 Completed: PM2 process '${APP_NAME}' restarted successfully."
else
    echo "⚠️ PM2 restart failed or process '${APP_NAME}' is not active. Starting via ecosystem.config.js..."
    pm2 start ecosystem.config.js
    echo "✅ Step 4 Completed: PM2 started successfully with ecosystem.config.js."
fi

echo "=================================================="
echo "🎉 Deployment for ${APP_NAME} completed successfully!"
echo "=================================================="
