# TomCon Website Deployment Guide

This guide explains how to build, verify, and deploy the TomCon website to your web server.

## Quick Start

**Standard Deployment Workflow:**

```bash
npm run build    # Build with fresh cache
./deploy.sh      # Verify & deploy automatically
```

That's it! The deployment script automatically verifies the build before deploying.

---

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

---

## Build Process

### Building the Site

The build process includes automatic cache clearing and image optimization:

```bash
npm run build
```

**What happens during build:**
1. ✅ Clears Vite cache (`.vite` directory)
2. ✅ Clears previous build (`dist` directory)
3. ✅ Optimizes images to WebP format
4. ✅ Bundles JavaScript and CSS
5. ✅ Compiles Tailwind CSS
6. ✅ Copies static assets

**Important:** Always run a fresh build before deploying to ensure all changes are included.

---

## Build Verification

### Automatic Verification

Every deployment automatically verifies the build to prevent issues. The verification checks:

1. **Visible Guests** - All guests with `visibility: 1` are in the build
2. **Hidden Guests** - Guests with `visibility: 0` are correctly marked
3. **Critical Changes** - Recent important updates are included
4. **Build Freshness** - Warns if build is stale

### Manual Verification

You can verify a build independently:

```bash
npm run verify
```

**Success Output:**
```
✅ All 66 visible guests found in build
✅ All 3 hidden guests correctly marked
✅ Deanna Moody correctly visible in build
✅ Josh Kemble correctly hidden in build
✅ Kevin Chen correctly visible in build
✅ Build is fresh (45s old)

✅ BUILD VERIFICATION PASSED!
Build is ready for deployment.
```

**Failure Output:**
```
❌ Missing 1 visible guests in build:
  - New Guest Name

❌ BUILD VERIFICATION FAILED!
Please fix the errors above before deploying.
```

### What Happens on Failure

If verification fails:
- ❌ Deployment **stops immediately**
- 📋 Error message shows what's wrong
- 🛡️ Prevents bad builds from going live

**Common Fix:**
```bash
rm -rf dist .vite    # Clear caches
npm run build        # Rebuild fresh
npm run verify       # Check again
```

---

## Deployment

### Method 1: Command Line (Recommended)

```bash
./deploy.sh
```

The script will:
1. Check that `dist/` directory exists
2. **Automatically verify the build**
3. Stop if verification fails
4. Deploy if everything passes

### Method 2: Using Cursor/VS Code Tasks

1. Open Command Palette: `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
2. Type "Tasks: Run Task"
3. Select "Deploy to Server"
4. Watch the deployment progress in the terminal

### Method 3: Tell AI Assistant

Simply tell the AI: **"Deploy the website"** and it will run the deployment for you!

### What Gets Deployed

The deployment script will:

- ✅ **Verify build** before deploying
- ✅ Upload all website files (HTML, CSS, JS, images)
- ✅ Create a backup of the current deployment
- ✅ Set proper file permissions
- ✅ Configure cache headers via `.htaccess`
- ✅ Exclude unnecessary files (.git, .DS_Store, deploy.sh, etc.)
- ✅ Show progress and status

---

## Troubleshooting

### Build Verification Fails

**Problem:** "Missing X visible guests in build" after updating `guests.js`

**Cause:** Vite's build cache didn't pick up the changes

**Solution:**
```bash
rm -rf dist .vite    # Clear both dist and Vite cache
npm run build        # Rebuild fresh
npm run verify       # Verify again
./deploy.sh          # Deploy
```

### Stale Build Warning

**Problem:** "Build is X minutes old - consider rebuilding"

**Solution:** 
```bash
npm run build        # Create fresh build
```

### Guest Visibility Issues

**Problem:** Changes to `guests.js` not appearing on live site

**Check:**
1. Is the guest's `visibility` set correctly in source?
2. Did you run `npm run build` after making changes?
3. Did verification pass?
4. Clear browser cache and hard refresh

**Solution:**
```bash
npm run build        # Always rebuild after data changes
./deploy.sh          # Verification will catch any issues
```

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

---

## Advanced Usage

### Updating Critical Verification Checks

When making important changes to guest data, update the critical checks in `verify-build.js`:

```javascript
const criticalGuests = [
    { name: 'Deanna Moody', shouldBeVisible: true },
    { name: 'Josh Kemble', shouldBeVisible: false },
    { name: 'Kevin Chen', shouldBeVisible: true },
    // Add new critical guests here
    { name: 'New Important Guest', shouldBeVisible: true }
];
```

### Files Excluded from Deployment

The following files/patterns are automatically excluded:

- `deploy.sh`, `verify-build.js` (build scripts)
- `.git/` (Git repository)
- `.gitignore`
- `README.md`, `*.md` (documentation)
- `.DS_Store`, `Thumbs.db` (system files)
- `node_modules/` (if using Node.js)
- `.env*` (environment files)
- `.vite/` (build cache)

---

## Security & Best Practices

**Security:**
- ✅ Uses SSH key authentication (more secure than passwords)
- ✅ Creates backups before deployment
- ✅ Excludes sensitive files automatically
- ✅ Uses rsync for efficient transfers

**Best Practices:**
- ✅ Always build before deploying
- ✅ Let verification run automatically
- ✅ Test on localhost first
- ✅ Check live site after deployment

---

## Post-Deployment

After successful deployment:

1. **Verify deployment succeeded** - Check the deployment output
2. **Test the live website** at https://tomconvention.com
3. **Check all pages** work correctly
4. **Verify images** and assets load properly
5. **Test interactive features** (keyboard navigation, card flipping, B-key overlay)
6. **Clear browser cache** if needed to see latest changes

If something breaks, you can restore from the automatic backup created during deployment.

---

## Related Files

- `deploy.sh` - Deployment script with integrated verification
- `verify-build.js` - Build verification script
- `package.json` - Contains `build` and `verify` npm scripts
- `guests.js` - Source guest data
- `dist/` - Built files ready for deployment
- `.vite/` - Vite build cache (auto-cleared during build)