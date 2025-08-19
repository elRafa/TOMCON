# TODO - Future Tasks

## Image Optimization Integration

### Current State ✅ COMPLETED
- `optimize-images.js` integrated as a standalone Node.js script
- Uses CommonJS (`require('sharp')`)
- Outputs directly to `./images/` directory (served at root by Vite)
- Runs manually with `npm run optimize-images`
- All WebP images moved to unified `images/` directory structure

### Integration Options to Consider
1. **Pre-build Hook**: Add to `package.json` scripts to run before Vite build
2. **Vite Plugin**: Create custom plugin for automatic optimization during build
3. **ES Module Conversion**: Convert script to ES modules for better Vite compatibility
4. **Path Alignment**: ✅ COMPLETED - Script outputs directly to `./images/`

### Benefits of Integration
- Automatic optimization when new images are added
- Consistent workflow with Vite build process
- Better performance through WebP optimization
- Reduced manual steps

### Priority: Low
- Current manual workflow works fine
- Can be addressed when adding new images or during next major update
