# TODO - Future Tasks

## Image Optimization Integration

### Current State
- `optimize-images.js` exists as a standalone Node.js script
- Uses CommonJS (`require('sharp')`)
- Outputs to `./images/webp/` but Vite serves from `./webp/` (root)
- Runs manually with `npm run optimize-images`

### Integration Options to Consider
1. **Pre-build Hook**: Add to `package.json` scripts to run before Vite build
2. **Vite Plugin**: Create custom plugin for automatic optimization during build
3. **ES Module Conversion**: Convert script to ES modules for better Vite compatibility
4. **Path Alignment**: Update script to output directly to `./webp/` instead of `./images/webp/`

### Benefits of Integration
- Automatic optimization when new images are added
- Consistent workflow with Vite build process
- Better performance through WebP optimization
- Reduced manual steps

### Priority: Low
- Current manual workflow works fine
- Can be addressed when adding new images or during next major update
