# Troubleshooting

## 🚨 Common Issues

### Build and Deployment Issues

#### Build Verification Fails

**Problem**: Build verification fails with "Missing X visible guests in build"

**Symptoms**:
```bash
❌ Missing 1 visible guests in build:
  - New Guest Name

❌ BUILD VERIFICATION FAILED!
Please fix the errors above before deploying.
```

**Root Cause**: Vite's build cache didn't pick up changes to `guests.js`

**Solution**:
```bash
# Clear all caches and rebuild
rm -rf dist .vite
npm run build
npm run verify
./deploy.sh
```

**Prevention**: Always run `npm run build` after modifying `guests.js`

#### Stale Build Warning

**Problem**: "Build is X minutes old - consider rebuilding"

**Symptoms**:
```bash
⚠️  Build is 15 minutes old - consider rebuilding
```

**Solution**:
```bash
npm run build
```

**Prevention**: Rebuild before deployment if significant time has passed

#### Guest Visibility Issues

**Problem**: Changes to guest visibility not appearing on live site

**Symptoms**:
- Guest shows/hides incorrectly
- Changes don't appear after deployment

**Diagnosis Steps**:
1. Check `guests.js` source file
2. Verify `visibility` field is correct (0=hidden, 1=visible)
3. Run build verification
4. Check browser cache

**Solution**:
```bash
# 1. Verify source data
grep -A 5 -B 5 "Guest Name" guests.js

# 2. Rebuild and verify
npm run build
npm run verify

# 3. Deploy
./deploy.sh

# 4. Clear browser cache
# Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
```

### Development Issues

#### Development Server Won't Start

**Problem**: `npm run dev` fails to start

**Symptoms**:
```bash
Error: listen EADDRINUSE: address already in use :::8000
```

**Solution**:
```bash
# Kill process using port 8000
lsof -ti:8000 | xargs kill -9

# Or use different port
npm run dev -- --port 8001
```

#### Memory Issues with Vite

**Problem**: Vite crashes with "JavaScript heap out of memory"

**Symptoms**:
```bash
FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory
```

**Solution**:
```bash
# Increase Node.js memory allocation
NODE_OPTIONS="--max-old-space-size=4096" npx vite --port 8000
```

**Prevention**: This typically occurs with large image sets (80+ images). Consider the memory allocation when adding many new images.

**Alternative Solution**:
```bash
# Find and kill the process
netstat -tulpn | grep :8000
kill -9 <PID>
```

#### Images Not Loading

**Problem**: Guest images don't display

**Symptoms**:
- Broken image icons
- "Image Error" placeholders
- Images load slowly or not at all

**Diagnosis Steps**:
1. Check file paths in `guests.js`
2. Verify images exist in `images/` directory
3. Check image optimization
4. Verify lazy loading

**Solution**:
```bash
# 1. Check image files
ls -la images/ | grep "guest-name"

# 2. Optimize images
npm run optimize-images

# 3. Check file paths in guests.js
grep -n "imageUrl" guests.js

# 4. Test image loading
curl -I https://tomconvention.com/images/guest-name.webp
```

#### Tailwind Styles Not Applying

**Problem**: Tailwind CSS classes not working

**Symptoms**:
- Custom classes work but Tailwind classes don't
- Styles appear broken
- Build succeeds but styles missing

**Solution**:
```bash
# 1. Rebuild Tailwind CSS
npx tailwindcss -i ./input.css -o ./output.css --watch

# 2. Check Tailwind config
cat tailwind.config.js

# 3. Verify content paths in config
# Ensure all HTML/JS files are listed in content array

# 4. Full rebuild
rm -rf dist .vite output.css
npm run build
```

### Performance Issues

#### Slow Page Loading

**Problem**: Page loads slowly or images load slowly

**Symptoms**:
- Page takes > 5 seconds to load
- Images load one by one slowly
- Poor Lighthouse scores

**Diagnosis Steps**:
1. Check network tab in browser dev tools
2. Run Lighthouse audit
3. Check image optimization
4. Verify lazy loading

**Solution**:
```bash
# 1. Optimize images
npm run optimize-images

# 2. Check bundle size
npm run build
ls -la dist/assets/

# 3. Verify lazy loading
# Check browser console for lazy loading logs

# 4. Test on slow connection
# Use Chrome DevTools Network throttling
```

#### Card Flip Animations Stuttering

**Problem**: Card flip animations are choppy or slow

**Symptoms**:
- Animations not smooth
- Cards flip slowly
- Performance issues during animations

**Solution**:
```css
/* Ensure hardware acceleration */
.card-flipper {
    will-change: transform;
    backface-visibility: hidden;
    transform-style: preserve-3d;
}

/* Check for conflicting styles */
.card-container {
    perspective: 1000px;
}
```

**Debug Steps**:
1. Check browser performance tab
2. Verify CSS transforms are using GPU
3. Check for JavaScript errors
4. Test on different devices

### Functionality Issues

#### Question Submission Not Working

**Problem**: Users can't submit questions

**Symptoms**:
- Submit button doesn't work
- Form validation errors
- Questions not saving

**Diagnosis Steps**:
1. Check browser console for errors
2. Verify form validation
3. Check rate limiting
4. Test local storage

**Solution**:
```javascript
// Debug question submission
console.log('Form data:', formData);
console.log('Rate limit check:', checkRateLimit(panelist, submitter));
console.log('Local storage:', localStorage.getItem('tomcon_stored_questions_' + panelist));
```

**Common Causes**:
- Rate limit exceeded (2 questions per user per artist)
- Form validation failing
- JavaScript errors preventing submission
- Local storage quota exceeded

#### Keyboard Navigation Not Working

**Problem**: Keyboard navigation (WASD/Arrow keys) doesn't work

**Symptoms**:
- Arrow keys don't navigate
- Focus indicators not visible
- Navigation jumps around

**Solution**:
```javascript
// Debug keyboard navigation
console.log('Keyboard navigation enabled:', isKeyboardNavigationEnabled);
console.log('Current focused card:', currentFocusedCard);
console.log('Navigation sections:', sections);
```

**Common Causes**:
- Focus is in form input (navigation disabled)
- JavaScript errors preventing event handlers
- CSS focus indicators hidden
- Conflicting event handlers

#### B-Key Project Overlay Not Working

**Problem**: B-key doesn't toggle project overlays

**Symptoms**:
- Pressing B does nothing
- Overlays don't appear
- Feature not working

**Solution**:
```javascript
// Debug B-key feature
console.log('Project overlay active:', isProjectOverlayActive);
console.log('Any card flipped:', isAnyCardFlipped());
console.log('Target cards:', targetCards.length);
```

**Common Causes**:
- Card is currently flipped (feature disabled)
- JavaScript errors
- Event handler not attached
- No target cards found

### Browser-Specific Issues

#### Safari Issues

**Problem**: Features don't work in Safari

**Symptoms**:
- Animations not smooth
- CSS transforms not working
- JavaScript errors

**Solution**:
```css
/* Safari-specific fixes */
.card-flipper {
    -webkit-transform-style: preserve-3d;
    -webkit-backface-visibility: hidden;
}

/* Ensure proper vendor prefixes */
.guest-card {
    -webkit-transition: transform 0.3s ease-in-out;
    transition: transform 0.3s ease-in-out;
}
```

#### Internet Explorer Issues

**Problem**: Site doesn't work in Internet Explorer

**Symptoms**:
- JavaScript errors
- CSS not loading
- Features not working

**Solution**: Internet Explorer is not supported. The site requires modern browser features:
- ES2020+ JavaScript
- CSS Grid and Flexbox
- Intersection Observer API
- WebP image format

**Recommended**: Use Chrome, Firefox, Safari, or Edge

#### Mobile Browser Issues

**Problem**: Features don't work on mobile browsers

**Symptoms**:
- Touch interactions not working
- Layout broken
- Performance issues

**Solution**:
```css
/* Mobile-specific fixes */
@media (max-width: 640px) {
    .card-container {
        touch-action: manipulation;
    }
    
    .guest-card {
        -webkit-tap-highlight-color: transparent;
    }
}
```

### Deployment Issues

#### SSH Connection Failed

**Problem**: Deployment fails with SSH connection error

**Symptoms**:
```bash
ssh: connect to host 82.29.86.169 port 65002: Connection refused
```

**Solution**:
```bash
# 1. Test SSH connection manually
ssh -p 65002 u780736690@82.29.86.169

# 2. Check server status
ping 82.29.86.169

# 3. Verify SSH key
ssh-add -l

# 4. Add SSH key if needed
ssh-add ~/.ssh/id_ed25519
```

#### Permission Denied

**Problem**: Deployment fails with permission errors

**Symptoms**:
```bash
rsync: mkdir "/home/u780736690/domains/tomconvention.com/public_html": Permission denied
```

**Solution**:
```bash
# 1. Check server permissions
ssh -p 65002 u780736690@82.29.86.169 "ls -la /home/u780736690/domains/"

# 2. Contact hosting provider for permissions
# 3. Verify user has write access to directory
```

#### File Upload Errors

**Problem**: Specific files not uploading

**Symptoms**:
- Some files deploy, others don't
- Partial deployment success
- Missing files on server

**Solution**:
```bash
# 1. Check file permissions locally
ls -la dist/

# 2. Check file names for special characters
find dist/ -name "*[^a-zA-Z0-9._-]*"

# 3. Verify file sizes
du -sh dist/*

# 4. Check rsync exclude patterns
grep -n "exclude" deploy.sh
```

## 🔧 Debug Tools

### Browser Developer Tools

#### Console Debugging

```javascript
// Enable debug mode
const DEBUG_MODE = true;

// Debug logging
if (DEBUG_MODE) {
    console.log('Card flipped:', cardName);
    console.log('Question submitted:', questionData);
    console.log('Images loaded:', imagesLoaded.size);
    console.log('Current state:', {
        currentFlippedCard,
        lazyLoadingEnabled,
        isProjectOverlayActive
    });
}
```

#### Performance Debugging

```javascript
// Performance monitoring
console.time('Image Load');
// ... image loading code ...
console.timeEnd('Image Load');

// Memory usage
console.log('Memory usage:', performance.memory);

// Network timing
console.log('Navigation timing:', performance.timing);
```

#### Network Debugging

```javascript
// Monitor API calls
fetch(url)
    .then(response => {
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        return response;
    })
    .catch(error => {
        console.error('API error:', error);
    });
```

### Build Debugging

#### Bundle Analysis

```bash
# Analyze bundle size
npm run build
ls -la dist/assets/

# Check for large files
find dist/ -type f -size +100k

# Analyze JavaScript bundles
npx vite-bundle-analyzer dist/assets/*.js
```

#### Build Verification Debug

```bash
# Run verification with debug output
node verify-build.js

# Check specific guest data
grep -A 10 -B 5 "Guest Name" guests.js

# Verify built guest data
grep -A 10 -B 5 "Guest Name" dist/assets/guests-*.js
```

### Image Debugging

#### Image Optimization Debug

```bash
# Check image files
ls -la images/ | grep -E "\.(jpg|jpeg|png|webp)$"

# Check image sizes
identify images/*.webp | head -10

# Test image loading
curl -I https://tomconvention.com/images/guest-name.webp
```

#### Lazy Loading Debug

```javascript
// Debug lazy loading
console.log('Lazy loader observer:', lazyLoader.observer);
console.log('Images loaded:', lazyLoader.imagesLoaded);
console.log('Loading start times:', lazyLoader.loadingStartTimes);
```

## 🚨 Emergency Procedures

### Site Down

**Problem**: Website is completely down

**Emergency Steps**:
1. Check server status
2. Restore from backup
3. Deploy previous working version

**Solution**:
```bash
# 1. Check server status
ssh -p 65002 u780736690@82.29.86.169 "systemctl status apache2"

# 2. List available backups
ssh -p 65002 u780736690@82.29.86.169 "ls -la /home/u780736690/domains/tomconvention.com/ | grep backup"

# 3. Restore from backup
ssh -p 65002 u780736690@82.29.86.169 "
    rm -rf /home/u780736690/domains/tomconvention.com/public_html
    mv /home/u780736690/domains/tomconvention.com/public_html_backup_20250101_120000 /home/u780736690/domains/tomconvention.com/public_html
"
```

### Data Loss

**Problem**: Guest data or questions lost

**Emergency Steps**:
1. Check local backups
2. Restore from git history
3. Contact hosting provider

**Solution**:
```bash
# 1. Check git history
git log --oneline -10
git show <commit-hash>:guests.js

# 2. Restore from git
git checkout <commit-hash> -- guests.js

# 3. Rebuild and deploy
npm run build
./deploy.sh
```

### Performance Crisis

**Problem**: Site is extremely slow

**Emergency Steps**:
1. Check server resources
2. Disable non-essential features
3. Optimize critical path

**Solution**:
```bash
# 1. Check server resources
ssh -p 65002 u780736690@82.29.86.169 "top"
ssh -p 65002 u780736690@82.29.86.169 "df -h"

# 2. Disable lazy loading temporarily
# Set DEBUG_MODE = true in script.js

# 3. Optimize images
npm run optimize-images
```

## 📞 Support Contacts

### Technical Support

- **Development Team**: [Contact information]
- **Hosting Provider**: [Contact information]
- **Domain Registrar**: [Contact information]

### Emergency Contacts

- **Primary Developer**: [Contact information]
- **Backup Developer**: [Contact information]
- **Project Manager**: [Contact information]

### Useful Resources

- **GitHub Repository**: https://github.com/elRafa/TOMCON
- **Hosting Control Panel**: [URL]
- **Domain Management**: [URL]
- **SSL Certificate**: [URL]

## 📋 Troubleshooting Checklist

### Before Reporting Issues

```bash
# Basic checks
- [ ] Checked browser console for errors
- [ ] Cleared browser cache and cookies
- [ ] Tested in different browser
- [ ] Tested on different device
- [ ] Checked network connection
- [ ] Verified server status
- [ ] Checked git status
- [ ] Ran build verification
- [ ] Tested locally with npm run dev
```

### Information to Include

When reporting issues, include:
- Browser and version
- Operating system
- Steps to reproduce
- Expected behavior
- Actual behavior
- Console error messages
- Screenshots if applicable
- Network conditions (slow/fast connection)

---

**Next**: [Contributing](./10-contributing.md)
