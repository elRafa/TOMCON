# TomCon Website Deployment Guide

This guide explains how to deploy the TomCon website to your web server using SSH.

## Setup (One-time configuration)

### 1. Configure Server Details

Edit the `deploy.sh` file and update these variables with your server information:

```bash
SERVER_HOST="your-server.com"           # Your server hostname or IP address
SERVER_USER="username"                  # Your SSH username
SERVER_PORT="22"                        # SSH port (usually 22)
REMOTE_PATH="/var/www/html"             # Remote directory path for website files
```

### 2. Add SSH Key to Server

If you haven't already, add your SSH public key to the server:

```bash
# Copy your public key
cat ~/.ssh/id_ed25519.pub

# Then add it to your server's authorized_keys file
# (This is usually done through your hosting control panel or by SSH'ing once with password)
```

### 3. Test SSH Connection

Before deploying, test your SSH connection:

```bash
ssh -p 22 username@your-server.com
```

## Deployment Methods

### Method 1: Using Cursor/VS Code Tasks (Recommended)

1. Open Command Palette: `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
2. Type "Tasks: Run Task"
3. Select "Deploy to Server"
4. Watch the deployment progress in the terminal

### Method 2: Command Line

Run the deployment script directly:

```bash
./deploy.sh
```

### Method 3: Tell AI Assistant

Simply tell me: **"Deploy the website"** and I'll run the deployment for you!

## What Gets Deployed

The deployment script will:

- ✅ Upload all website files (HTML, CSS, JS, images)
- ✅ Create a backup of the current deployment
- ✅ Set proper file permissions
- ✅ Exclude unnecessary files (.git, .DS_Store, deploy.sh, etc.)
- ✅ Show progress and status

## Files Excluded from Deployment

The following files/patterns are automatically excluded:

- `deploy.sh` (this script)
- `.git/` (Git repository)
- `.gitignore`
- `README.md`, `*.md` (documentation)
- `.DS_Store`, `Thumbs.db` (system files)
- `node_modules/` (if using Node.js)
- `.env*` (environment files)

## Troubleshooting

### SSH Connection Issues

If you get SSH connection errors:

1. **Check server details** in `deploy.sh`
2. **Verify SSH key** is added to server
3. **Test manual SSH**: `ssh username@your-server.com`
4. **Check firewall** settings on server
5. **Verify SSH port** (default is 22)

### Permission Issues

If you get permission denied errors:

1. Make sure your SSH user has write access to the remote directory
2. You might need to use `sudo` or a different user
3. Contact your hosting provider for proper permissions

### File Not Found Errors

If specific files aren't deploying:

1. Check they're not in the exclude list
2. Verify file names don't have special characters
3. Ensure files exist locally before deployment

## Security Notes

- ✅ Uses SSH key authentication (more secure than passwords)
- ✅ Creates backups before deployment
- ✅ Excludes sensitive files automatically
- ✅ Uses rsync for efficient transfers

## Post-Deployment

After successful deployment:

1. **Test the website** in your browser
2. **Check all pages** work correctly
3. **Verify images** and assets load properly
4. **Test interactive features** (if any)

If something breaks, you can restore from the automatic backup created during deployment.
