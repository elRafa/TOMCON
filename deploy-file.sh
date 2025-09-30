#!/bin/bash

# Single File Deployment Script
# Usage: ./deploy-file.sh filename

# Configuration - matches standard deploy.sh
SERVER_HOST="82.29.86.169"
SERVER_USER="u780736690"
REMOTE_PORT="65002"
REMOTE_DIR="/home/u780736690/domains/tomconvention.com/public_html"
LOCAL_DIR="./dist"

# Check if filename is provided
if [ $# -eq 0 ]; then
    echo "Usage: $0 <filename>"
    echo "Example: $0 index.html"
    exit 1
fi

FILENAME=$1
LOCAL_FILE="$LOCAL_DIR/$FILENAME"

# Check if local file exists
if [ ! -f "$LOCAL_FILE" ]; then
    echo "Error: File $LOCAL_FILE not found!"
    echo "Make sure to run 'npm run build' first and check the file exists in ./dist/"
    exit 1
fi

echo "🚀 Deploying $FILENAME to production..."
echo "Local: $LOCAL_FILE"
echo "Remote: $SERVER_USER@$SERVER_HOST:$REMOTE_DIR/$FILENAME"
echo "Port: $REMOTE_PORT"
echo ""

# Deploy the file
rsync -avz --progress \
    -e "ssh -p $REMOTE_PORT" \
    "$LOCAL_FILE" \
    "$SERVER_USER@$SERVER_HOST:$REMOTE_DIR/"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully deployed $FILENAME to production!"
    echo "🌐 Check: https://tomconvention.com/$FILENAME"
else
    echo ""
    echo "❌ Deployment failed for $FILENAME"
    exit 1
fi
