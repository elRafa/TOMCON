#!/bin/bash

# Server-side duplicate file cleanup script
# This script removes duplicate files with numbers in their names from the server

# Server connection details
REMOTE_USER="u780736690"
REMOTE_HOST="82.29.86.169"
REMOTE_PORT="65002"
REMOTE_PATH="/home/u780736690/domains/tomconvention.com/public_html"

echo "🧹 Starting server-side duplicate cleanup..."
echo "🔍 Finding duplicate files on server..."

# Connect to server and find duplicate files
ssh -p $REMOTE_PORT $REMOTE_USER@$REMOTE_HOST "find $REMOTE_PATH -name \"* [0-9]*\" -type f | head -20"

echo ""
read -p "⚠️  This will delete duplicate files on the server. Continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Cleanup cancelled."
    exit 1
fi

echo "🗑️  Removing duplicate files from server..."

# Remove duplicate files from server
DUPLICATE_COUNT=$(ssh -p $REMOTE_PORT $REMOTE_USER@$REMOTE_HOST "find $REMOTE_PATH -name \"* [0-9]*\" -type f | wc -l")

if [ "$DUPLICATE_COUNT" -gt 0 ]; then
    ssh -p $REMOTE_PORT $REMOTE_USER@$REMOTE_HOST "find $REMOTE_PATH -name \"* [0-9]*\" -type f -delete"
    echo "✅ Removed $DUPLICATE_COUNT duplicate files from server."
else
    echo "✅ No duplicate files found on server."
fi

echo "🎉 Server cleanup complete!"

