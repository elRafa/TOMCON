#!/bin/bash

# TomCon Website Deployment Script
# Configure the variables below with your server details

# Server configuration
SERVER_HOST="82.29.86.169"           # Replace with your server hostname/IP
SERVER_USER="u780736690"                  # Replace with your SSH username
SERVER_PORT="65002"                        # Replace with your SSH port if different
REMOTE_PATH="/home/u780736690/domains/tomconvention.com/public_html"             # Replace with your remote directory path

# Local project path (current directory)
LOCAL_PATH="."

# Files and directories to exclude from deployment
EXCLUDE_PATTERNS=(
    "deploy.sh"
    ".git"
    ".gitignore"
    "README.md"
    "*.md"
    ".DS_Store"
    "Thumbs.db"
    "node_modules"
    ".env"
    ".env.local"
)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if server configuration is set
if [ "$SERVER_HOST" = "your-server.com" ] || [ "$SERVER_USER" = "username" ]; then
    print_error "Please configure your server details in this script first!"
    print_warning "Edit deploy.sh and set SERVER_HOST, SERVER_USER, and REMOTE_PATH"
    exit 1
fi

# Build exclude options for rsync
EXCLUDE_OPTS=""
for pattern in "${EXCLUDE_PATTERNS[@]}"; do
    EXCLUDE_OPTS="$EXCLUDE_OPTS --exclude=$pattern"
done

print_status "Starting deployment to $SERVER_USER@$SERVER_HOST:$REMOTE_PATH"

# Check if SSH key is loaded in agent
print_status "Checking SSH agent..."
if ! ssh-add -l &>/dev/null; then
    print_warning "SSH key not loaded in agent. You may be prompted for passphrase multiple times."
    print_status "To avoid this, run: ssh-add ~/.ssh/id_ed25519"
    echo ""
fi

# Test SSH connection
print_status "Testing SSH connection..."
if ! ssh -p "$SERVER_PORT" -o ConnectTimeout=10 "$SERVER_USER@$SERVER_HOST" exit 2>/dev/null; then
    print_error "Cannot connect to server. Please check:"
    echo "  1. Server hostname/IP: $SERVER_HOST"
    echo "  2. SSH port: $SERVER_PORT"
    echo "  3. Username: $SERVER_USER"
    echo "  4. SSH key is added to server"
    echo "  5. Run: ssh-add ~/.ssh/id_ed25519"
    exit 1
fi

print_status "SSH connection successful!"

# Create backup of current deployment (optional)
print_status "Creating backup of current deployment..."
ssh -p "$SERVER_PORT" "$SERVER_USER@$SERVER_HOST" "
    if [ -d '$REMOTE_PATH' ]; then
        cp -r '$REMOTE_PATH' '${REMOTE_PATH}_backup_$(date +%Y%m%d_%H%M%S)'
    fi
"

# Deploy files using rsync
print_status "Deploying files..."
rsync -avz --progress \
    -e "ssh -p $SERVER_PORT" \
    $EXCLUDE_OPTS \
    --delete \
    "$LOCAL_PATH/" \
    "$SERVER_USER@$SERVER_HOST:$REMOTE_PATH/"

if [ $? -eq 0 ]; then
    print_status "Deployment completed successfully!"
    print_status "Website should be updated at: http://$SERVER_HOST"
else
    print_error "Deployment failed!"
    exit 1
fi

# Optional: Run any post-deployment commands
print_status "Running post-deployment tasks..."
ssh -p "$SERVER_PORT" "$SERVER_USER@$SERVER_HOST" "
    # Set proper permissions (adjust as needed) - suppress permission errors
    chmod -R 644 '$REMOTE_PATH'/* 2>/dev/null || true
    find '$REMOTE_PATH' -type d -exec chmod 755 {} \; 2>/dev/null || true
    
    # Restart web server if needed (uncomment and adjust as needed)
    # sudo systemctl reload nginx
    # sudo systemctl reload apache2
"

print_status "All done! 🚀"
