# Development Setup

## 🚀 Quick Start

### Prerequisites

- **Node.js**: Version 18+ (recommended: 20.x LTS)
- **npm**: Version 9+ (comes with Node.js)
- **Git**: For version control
- **Modern Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### Installation

```bash
# Clone the repository
git clone https://github.com/elRafa/TOMCON.git
cd tomcon-round2

# Install dependencies
npm install

# Start development server
npm run dev
```

The development server will start at `http://localhost:8000`

## 🛠️ Development Environment

### Local Development Server

```bash
# Start Vite development server
npm run dev

# Server runs on http://localhost:8000
# Features:
# - Hot Module Replacement (HMR)
# - Source maps for debugging
# - Live reload on file changes
# - Optimized dependencies
```

### Development Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build locally
npm run verify           # Verify build integrity

# Image optimization
npm run optimize-images  # Convert images to WebP format
npm run update-webp      # Update HTML and guest data for WebP

# Testing
npm test                 # Run tests (placeholder)
```

## 📁 Project Structure

```
tomcon-round2/
├── docs/                    # Documentation
├── dist/                    # Built files (generated)
├── images/                  # Image assets
│   ├── *.webp              # Optimized WebP images
│   ├── *.jpg               # Original JPEG images
│   └── *.png               # Original PNG images
├── index.html              # Main page
├── privacy.html            # Privacy policy page
├── terms.html              # Terms of service page
├── refunds.html            # Refund policy page
├── script.js               # Main application logic
├── guests.js               # Guest data and management
├── style.css               # Custom styles and animations
├── input.css               # Tailwind CSS input
├── output.css              # Compiled Tailwind CSS (generated)
├── vite.config.js          # Vite build configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── package.json            # Dependencies and scripts
├── package-lock.json       # Dependency lock file
├── deploy.sh               # Deployment script
├── verify-build.js         # Build verification script
├── optimize-images.js      # Image optimization script
├── robots.txt              # SEO robots file
├── sitemap.xml             # SEO sitemap
└── .gitignore              # Git ignore rules
```

## 🔧 Configuration Files

### Vite Configuration (`vite.config.js`)

```javascript
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html',
        privacy: './privacy.html',
        terms: './terms.html',
        refunds: './refunds.html'
      },
      output: {
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('lucide')) return 'vendor-lucide';
            return 'vendor';
          }
          if (id.includes('guests.js')) return 'guests';
          if (id.includes('script.js')) return 'main';
        }
      }
    },
    cssCodeSplit: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  server: {
    port: 8000
  },
  publicDir: 'images',
  optimizeDeps: {
    include: ['lucide']
  }
})
```

### Tailwind Configuration (`tailwind.config.js`)

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./privacy.html",
    "./terms.html", 
    "./refunds.html",
    "./script.js",
    "./guests.js",
    "./style.css",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '375px',
      },
    },
  },
  plugins: [],
}
```

### Package Configuration (`package.json`)

```json
{
  "name": "tomcon-round2",
  "version": "1.0.0",
  "description": "TOM Convention 2025 Website",
  "main": "script.js",
  "scripts": {
    "dev": "vite",
    "build": "rm -rf dist .vite && npm run optimize-images && vite build && tailwindcss -i ./input.css -o ./dist/output.css && cp style.css dist/",
    "verify": "node verify-build.js",
    "preview": "vite preview",
    "optimize-images": "node optimize-images.js",
    "update-webp": "node update-html-for-webp.js && node update-guests-for-webp.js"
  },
  "dependencies": {
    "lucide": "^0.539.0",
    "sharp": "^0.33.0"
  },
  "devDependencies": {
    "autoprefixer": "^10.4.17",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.10",
    "terser": "^5.43.1",
    "vite": "^7.1.2"
  }
}
```

## 🎨 Development Workflow

### 1. Making Changes

```bash
# 1. Start development server
npm run dev

# 2. Make changes to files
# - Edit HTML in index.html
# - Edit JavaScript in script.js
# - Edit guest data in guests.js
# - Edit styles in style.css or input.css

# 3. Changes appear automatically in browser
# - Hot reload for CSS changes
# - Full page reload for HTML/JS changes
```

### 2. Adding New Guests

```javascript
// 1. Add guest data to guests.js
{
    name: "New Guest Name",
    projects: "Band Name, Other Projects",
    imageUrl: "new-guest.webp",
    role: "panelist",
    visibility: 1
}

// 2. Add image files to images/ directory
// - new-guest.jpg (original)
// - new-guest.webp (optimized)

// 3. Optimize images
npm run optimize-images

// 4. Test in development
npm run dev
```

### 3. Styling Changes

```css
/* Custom styles in style.css */
.new-feature {
    background-color: #482124;
    color: #E3D6B8;
}

/* Tailwind utilities in input.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
    .custom-button {
        @apply bg-[#2C804F] text-white px-4 py-2 rounded;
    }
}
```

### 4. JavaScript Development

```javascript
// Debug mode for development
const DEBUG_MODE = true; // Set to true in script.js

// Console logging
if (DEBUG_MODE) {
    console.log('Debug information:', data);
}

// Performance monitoring
const startTime = performance.now();
// ... code execution ...
const endTime = performance.now();
console.log(`Execution time: ${endTime - startTime}ms`);
```

## 🖼️ Image Management

### Image Optimization Workflow

```bash
# 1. Add original images to images/ directory
# - guest-name.jpg (JPEG format)
# - guest-name.png (PNG format)

# 2. Run image optimization
npm run optimize-images

# 3. Optimized WebP images are created
# - guest-name.webp (optimized WebP)

# 4. Update guest data to use WebP images
# Edit guests.js to reference .webp files
```

### Image Requirements

```javascript
// Standard guest images
const imageRequirements = {
    aspectRatio: '2:3',        // Portrait orientation
    maxWidth: 1200,            // Maximum width
    maxHeight: 1200,           // Maximum height
    format: 'WebP',            // Preferred format
    quality: 80,               // Compression quality
    fallback: 'JPEG'           // Fallback format
};

// Performer images (responsive)
const performerImageRequirements = {
    desktop: {
        aspectRatio: '3:2',    // Landscape for desktop
        maxWidth: 1200
    },
    mobile: {
        aspectRatio: '4:5',    // Portrait for mobile
        maxWidth: 600
    }
};
```

## 🔍 Debugging

### Browser Developer Tools

```javascript
// Enable debug mode
const DEBUG_MODE = true;

// Debug logging
if (DEBUG_MODE) {
    console.log('Card flipped:', cardName);
    console.log('Question submitted:', questionData);
    console.log('Images loaded:', imagesLoaded.size);
}

// Performance debugging
console.time('Image Load');
// ... image loading code ...
console.timeEnd('Image Load');
```

### Common Debug Scenarios

```javascript
// 1. Card flip not working
// Check: CSS transforms, z-index, positioning
console.log('Card state:', cardContainer.classList);

// 2. Images not loading
// Check: File paths, WebP support, lazy loading
console.log('Image src:', img.src);
console.log('Image loaded:', img.complete);

// 3. Question submission failing
// Check: Rate limits, validation, API calls
console.log('Rate limit check:', checkRateLimit(panelist, submitter));
console.log('Question validation:', validateQuestion(question));
```

### Network Debugging

```javascript
// Monitor API calls
fetch(url)
    .then(response => {
        console.log('Response status:', response.status);
        return response;
    })
    .catch(error => {
        console.error('API error:', error);
    });

// Monitor image loading
img.onload = () => console.log('Image loaded:', img.src);
img.onerror = () => console.error('Image failed:', img.src);
```

## 🧪 Testing

### Manual Testing Checklist

```bash
# Functionality Tests
- [ ] Card flip animations work
- [ ] Question submission system works
- [ ] Rate limiting functions correctly
- [ ] Keyboard navigation works
- [ ] Mobile responsiveness
- [ ] Image lazy loading
- [ ] Form validation

# Performance Tests
- [ ] Page load time < 3 seconds
- [ ] Images load progressively
- [ ] Smooth animations
- [ ] No console errors

# Accessibility Tests
- [ ] Keyboard navigation
- [ ] Screen reader compatibility
- [ ] Color contrast
- [ ] Focus indicators
```

### Build Verification

```bash
# Verify build integrity
npm run verify

# Expected output:
# ✅ All 66 visible guests found in build
# ✅ All 3 hidden guests correctly marked
# ✅ Build verification passed!
```

## 🚀 Production Build

### Build Process

```bash
# 1. Clean previous builds
rm -rf dist .vite

# 2. Optimize images
npm run optimize-images

# 3. Build application
npm run build

# 4. Verify build
npm run verify

# 5. Preview locally
npm run preview
```

### Build Output

```
dist/
├── index.html              # Main page
├── privacy.html            # Privacy policy
├── terms.html              # Terms of service
├── refunds.html            # Refund policy
├── output.css              # Compiled Tailwind CSS
├── style.css               # Custom styles
├── assets/
│   ├── main-[hash].js      # Main application bundle
│   ├── guests-[hash].js    # Guest data bundle
│   ├── vendor-[hash].js    # Third-party dependencies
│   └── vendor-lucide-[hash].js # Lucide icons
└── [image files]           # Optimized images
```

## 🔧 Development Tools

### VS Code Extensions

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-json",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

### VS Code Settings

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll": true
  },
  "tailwindCSS.includeLanguages": {
    "html": "html",
    "javascript": "javascript"
  },
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

### Git Hooks

```bash
# Pre-commit hook (optional)
#!/bin/sh
npm run verify
if [ $? -ne 0 ]; then
    echo "Build verification failed. Commit aborted."
    exit 1
fi
```

## 🐛 Troubleshooting

### Common Issues

```bash
# Issue: Development server won't start
# Solution: Check port availability
lsof -ti:8000 | xargs kill -9
npm run dev

# Issue: Images not loading
# Solution: Check file paths and permissions
ls -la images/
npm run optimize-images

# Issue: Build fails
# Solution: Clear cache and rebuild
rm -rf dist .vite node_modules
npm install
npm run build

# Issue: Tailwind styles not applying
# Solution: Rebuild CSS
npx tailwindcss -i ./input.css -o ./output.css --watch
```

### Performance Issues

```javascript
// Issue: Slow image loading
// Solution: Check lazy loading implementation
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            loadImage(entry.target);
        }
    });
}, { rootMargin: '50px' });

// Issue: Large bundle size
// Solution: Check code splitting
// Verify manualChunks in vite.config.js
```

---

**Next**: [Build & Deployment](./05-build-deployment.md)
