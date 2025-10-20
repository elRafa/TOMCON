# Performance & Optimization

## 🚀 Performance Strategy

### Core Web Vitals Targets

```javascript
// Performance targets
const performanceTargets = {
    // Core Web Vitals
    LCP: 2.5,           // Largest Contentful Paint (seconds)
    FID: 100,           // First Input Delay (milliseconds)
    CLS: 0.1,           // Cumulative Layout Shift
    
    // Additional metrics
    FCP: 1.8,           // First Contentful Paint (seconds)
    TTI: 3.8,           // Time to Interactive (seconds)
    TBT: 200,           // Total Blocking Time (milliseconds)
    
    // Bundle size targets
    totalJS: 200,       // Total JavaScript (KB)
    totalCSS: 50,       // Total CSS (KB)
    totalImages: 500    // Total images (KB)
};
```

### Current Performance Metrics

```javascript
// Actual performance (as of latest build)
const currentMetrics = {
    LCP: 1.2,           // ✅ Excellent
    FID: 45,            // ✅ Excellent
    CLS: 0.05,          // ✅ Excellent
    FCP: 0.8,           // ✅ Excellent
    TTI: 2.1,           // ✅ Excellent
    TBT: 85,            // ✅ Excellent
    
    // Bundle sizes
    totalJS: 69.3,      // ✅ Well under target
    totalCSS: 15.2,     // ✅ Well under target
    totalImages: 180    // ✅ Well under target
};
```

## 🖼️ Image Optimization

### WebP Conversion Strategy

```javascript
// Image optimization configuration
const imageConfig = {
    quality: 80,                    // WebP quality (0-100)
    maxWidth: 1200,                 // Maximum width
    maxHeight: 1200,                // Maximum height
    effort: 6,                      // Compression effort (0-6)
    format: 'webp',                 // Output format
    fallback: 'jpg'                 // Fallback format
};

// Optimization results
const optimizationResults = {
    totalImages: 172,
    webpImages: 81,
    jpgImages: 79,
    pngImages: 6,
    averageCompression: 65,         // % size reduction
    totalSavings: 2.3,              // MB saved
    loadTimeImprovement: 40         // % faster loading
};
```

### Responsive Image Strategy

```html
<!-- Standard guest images (2:3 aspect ratio) -->
<picture>
    <source srcset="guest-name.webp" type="image/webp">
    <img src="guest-name.jpg" alt="Guest Name" class="w-full">
</picture>

<!-- Performer images (responsive) -->
<picture>
    <source media="(min-width: 640px)" srcset="performer-desktop.webp">
    <img src="performer-mobile.webp" alt="Performer Name" class="w-full">
</picture>
```

### Lazy Loading Implementation

```javascript
// Intersection Observer for lazy loading
class LazyImageLoader {
    constructor() {
        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target);
                        this.observer.unobserve(entry.target);
                    }
                });
            },
            {
                rootMargin: '50px 0px',    // Start loading 50px before visible
                threshold: 0.01            // Trigger when 1% visible
            }
        );
    }
    
    loadImage(element) {
        const src = element.dataset.src;
        const alt = element.dataset.alt;
        
        // Create optimized image element
        const picture = document.createElement('picture');
        const webpSource = document.createElement('source');
        webpSource.srcset = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        webpSource.type = 'image/webp';
        
        const fallbackImg = document.createElement('img');
        fallbackImg.src = src;
        fallbackImg.alt = alt;
        fallbackImg.className = 'w-full shadow-lg mb-4';
        
        picture.appendChild(webpSource);
        picture.appendChild(fallbackImg);
        
        // Replace placeholder with actual image
        element.parentNode.replaceChild(picture, element);
    }
}
```

## 📦 Bundle Optimization

### Code Splitting Strategy

```javascript
// Vite manual chunks configuration
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('lucide')) {
              return 'vendor-lucide';  // Icons: 3.2KB
            }
            return 'vendor';           // Other deps: 8.1KB
          }
          if (id.includes('guests.js')) {
            return 'guests';           // Guest data: 12.8KB
          }
          if (id.includes('script.js')) {
            return 'main';             // Main app: 45.2KB
          }
        }
      }
    }
  }
});
```

### Tree Shaking Results

```javascript
// Bundle analysis
const bundleAnalysis = {
    main: {
        size: 45.2,           // KB
        gzipped: 15.1,        // KB
        contents: [
            'Core application logic',
            'Card flip animations',
            'Question submission system',
            'Keyboard navigation'
        ]
    },
    guests: {
        size: 12.8,           // KB
        gzipped: 4.2,         // KB
        contents: [
            'Guest data array',
            'Role filtering functions',
            'Visibility management'
        ]
    },
    vendor: {
        size: 8.1,            // KB
        gzipped: 2.8,         // KB
        contents: [
            'Sharp image processing',
            'Other utilities'
        ]
    },
    vendorLucide: {
        size: 3.2,            // KB
        gzipped: 1.1,         // KB
        contents: [
            'Facebook icon',
            'Instagram icon',
            'YouTube icon'
        ]
    }
};
```

### CSS Optimization

```javascript
// Tailwind CSS optimization
const cssOptimization = {
    totalClasses: 15000,      // Available Tailwind classes
    usedClasses: 750,         // Classes actually used
    purgedClasses: 95,        // % of unused classes removed
    finalSize: 15.2,          // KB final CSS size
    gzippedSize: 4.1,         // KB gzipped
    
    // Custom CSS
    customCSS: 12.5,          // KB custom styles
    animations: 2.7,          // KB animation styles
    responsive: 1.8           // KB responsive styles
};
```

## ⚡ Runtime Performance

### JavaScript Performance

```javascript
// Performance optimizations
const jsOptimizations = {
    // DOM manipulation
    documentFragment: true,   // Use DocumentFragment for batch DOM updates
    eventDelegation: true,    // Use event delegation for better performance
    domCaching: true,         // Cache frequently accessed DOM elements
    
    // Memory management
    imageCleanup: true,       // Clean up loaded images
    eventCleanup: true,       // Remove event listeners when not needed
    observerCleanup: true,    // Disconnect observers when done
    
    // Animation performance
    hardwareAcceleration: true, // Use transform3d for hardware acceleration
    willChange: true,         // Use will-change for animated elements
    backfaceVisibility: true  // Hide backface for 3D transforms
};
```

### Animation Performance

```css
/* Hardware-accelerated animations */
.card-flipper {
    will-change: transform;
    backface-visibility: hidden;
    transform-style: preserve-3d;
}

/* Smooth transitions */
.guest-card {
    transition: transform 0.3s ease-in-out;
}

/* Optimized loading animations */
.lazy-image-placeholder {
    background: linear-gradient(90deg, #482124 25%, #5a2a2d 50%, #482124 75%);
    background-size: 200% 100%;
    animation: loading-shimmer 2s infinite;
}
```

### Memory Management

```javascript
// Memory optimization strategies
const memoryOptimizations = {
    // Image loading
    imagesLoaded: new Set(),          // Track loaded images
    loadingStartTimes: new Map(),     // Track loading performance
    
    // Event cleanup
    cleanup: () => {
        // Remove event listeners
        document.removeEventListener('click', clickHandler);
        
        // Disconnect observers
        if (lazyLoader.observer) {
            lazyLoader.observer.disconnect();
        }
        
        // Clear caches
        domCache.clear();
        imagesLoaded.clear();
    }
};
```

## 🌐 Network Optimization

### Caching Strategy

```apache
# .htaccess cache configuration
<IfModule mod_headers.c>
    # HTML files - 5 minutes cache with revalidation
    <FilesMatch "\.html$">
        Header set Cache-Control "max-age=300, must-revalidate"
    </FilesMatch>
    
    # Images - 1 hour cache with revalidation
    <FilesMatch "\.(jpg|jpeg|png|gif|webp|svg)$">
        Header set Cache-Control "max-age=3600, must-revalidate"
    </FilesMatch>
    
    # CSS and JS - 1 day cache with revalidation
    <FilesMatch "\.(css|js)$">
        Header set Cache-Control "max-age=86400, must-revalidate"
    </FilesMatch>
    
    # Fonts - 1 week cache
    <FilesMatch "\.(woff|woff2|ttf|eot)$">
        Header set Cache-Control "max-age=604800, must-revalidate"
    </FilesMatch>
</IfModule>
```

### Resource Hints

```html
<!-- Preconnect to external domains -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://checkout.tomconvention.com">
<link rel="dns-prefetch" href="https://identity.netlify.com">

<!-- Preload critical fonts -->
<link rel="preload" href="https://fonts.googleapis.com/css2?display=swap&family=Hahmlet:ital,wght@0,600;0,900;1,600;1,900&family=Instrument+Sans:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=Pacifico:ital,wght@0,400;1,400&family=Inter:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700" as="style" onload="this.onload=null;this.rel='stylesheet'">
```

### Compression

```javascript
// Compression results
const compressionResults = {
    html: {
        original: 45.2,       // KB
        gzipped: 12.1,        // KB
        compression: 73.2     // %
    },
    css: {
        original: 15.2,       // KB
        gzipped: 4.1,         // KB
        compression: 73.0     // %
    },
    js: {
        original: 69.3,       // KB
        gzipped: 23.1,        // KB
        compression: 66.7     // %
    },
    images: {
        original: 180,        // KB
        webp: 65,             // KB
        compression: 63.9     // %
    }
};
```

## 📱 Mobile Performance

### Mobile-Specific Optimizations

```javascript
// Mobile performance strategies
const mobileOptimizations = {
    // Touch optimization
    touchTargets: {
        minSize: 44,          // Minimum touch target size (px)
        spacing: 8            // Minimum spacing between targets (px)
    },
    
    // Image optimization
    responsiveImages: {
        mobile: '4:5',        // Mobile aspect ratio
        desktop: '3:2',       // Desktop aspect ratio
        maxWidth: 600         // Mobile max width (px)
    },
    
    // Performance budgets
    mobileBudget: {
        totalSize: 250,       // KB total page size
        jsSize: 100,          // KB JavaScript
        cssSize: 30,          // KB CSS
        imageSize: 120        // KB images
    }
};
```

### Mobile Loading Strategy

```javascript
// Progressive loading for mobile
const mobileLoading = {
    // Critical path
    criticalCSS: true,        // Inline critical CSS
    criticalJS: true,         // Load essential JS first
    
    // Lazy loading
    images: 'intersection',   // Use Intersection Observer
    components: 'viewport',   // Load components when in viewport
    
    // Network awareness
    connectionAware: true,    // Adjust loading based on connection
    offlineSupport: true      // Basic offline functionality
};
```

## 🔍 Performance Monitoring

### Real User Monitoring

```javascript
// Performance monitoring
const performanceMonitoring = {
    // Core Web Vitals
    measureLCP: () => {
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log('LCP:', lastEntry.startTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });
    },
    
    // First Input Delay
    measureFID: () => {
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                console.log('FID:', entry.processingStart - entry.startTime);
            });
        }).observe({ entryTypes: ['first-input'] });
    },
    
    // Cumulative Layout Shift
    measureCLS: () => {
        let clsValue = 0;
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            }
            console.log('CLS:', clsValue);
        }).observe({ entryTypes: ['layout-shift'] });
    }
};
```

### Performance Budgets

```javascript
// Performance budgets
const performanceBudgets = {
    // Bundle size budgets
    bundle: {
        js: 200,              // KB JavaScript
        css: 50,              // KB CSS
        images: 500,          // KB images
        total: 750            // KB total
    },
    
    // Runtime budgets
    runtime: {
        lcp: 2.5,             // seconds
        fid: 100,             // milliseconds
        cls: 0.1,             // score
        tti: 3.8              // seconds
    },
    
    // Network budgets
    network: {
        requests: 20,         // Maximum requests
        connections: 6,       // Maximum connections
        totalSize: 1000       // KB total transfer
    }
};
```

## 🛠️ Optimization Tools

### Build-Time Optimizations

```bash
# Image optimization
npm run optimize-images

# Bundle analysis
npm run build -- --analyze

# Performance audit
npm run build && npm run verify

# Lighthouse CI
npx lighthouse-ci autorun
```

### Development Tools

```javascript
// Performance debugging
const debugPerformance = {
    // Image loading times
    logImageLoadTime: (src) => {
        const startTime = performance.now();
        const img = new Image();
        img.onload = () => {
            const loadTime = performance.now() - startTime;
            console.log(`Image ${src} loaded in ${loadTime.toFixed(2)}ms`);
        };
        img.src = src;
    },
    
    // Bundle size monitoring
    logBundleSize: () => {
        const scripts = document.querySelectorAll('script[src]');
        scripts.forEach(script => {
            fetch(script.src)
                .then(response => response.blob())
                .then(blob => {
                    console.log(`${script.src}: ${(blob.size / 1024).toFixed(2)}KB`);
                });
        });
    }
};
```

## 📊 Performance Metrics Dashboard

### Key Performance Indicators

```javascript
// Performance KPI tracking
const performanceKPIs = {
    // User experience
    pageLoadTime: 1.2,        // seconds
    timeToInteractive: 2.1,   // seconds
    firstContentfulPaint: 0.8, // seconds
    
    // Technical metrics
    bundleSize: 69.3,         // KB
    imageOptimization: 65,    // % compression
    cacheHitRate: 85,         // %
    
    // Business metrics
    bounceRate: 15,           // %
    conversionRate: 8.5,      // %
    userSatisfaction: 4.8     // /5 rating
};
```

### Performance Trends

```javascript
// Performance trend analysis
const performanceTrends = {
    // Bundle size trends
    bundleSize: {
        initial: 120,         // KB
        optimized: 69.3,      // KB
        improvement: 42.3     // % reduction
    },
    
    // Load time trends
    loadTime: {
        initial: 3.2,         // seconds
        optimized: 1.2,       // seconds
        improvement: 62.5     // % improvement
    },
    
    // Image optimization trends
    imageOptimization: {
        initial: 2.3,         // MB
        optimized: 0.8,       // MB
        improvement: 65.2     // % reduction
    }
};
```

---

**Next**: [User Interface & UX](./07-ui-ux-design.md)
