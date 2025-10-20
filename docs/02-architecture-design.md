# Architecture & Design

## 🏗️ System Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Browser  │    │   Static Site   │    │  External APIs  │
│                 │    │                 │    │                 │
│ • HTML/CSS/JS   │◄──►│ • Vite Build    │◄──►│ • Pretix Widget │
│ • Local Storage │    │ • Optimized     │    │ • Google Sheets │
│ • Intersection  │    │ • WebP Images   │    │ • Email Service │
│   Observer      │    │ • Code Splitting│    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Core Principles

1. **Static-First**: Pre-built, optimized assets for maximum performance
2. **Progressive Enhancement**: Works without JavaScript, enhanced with it
3. **Mobile-First**: Responsive design starting from mobile viewport
4. **Performance-Focused**: Optimized for Core Web Vitals and user experience

## 🎨 Design System

### Color Palette

```css
/* Primary Brand Colors */
--color-background: #482124;    /* Deep burgundy - main background */
--color-text: #E3D6B8;          /* Warm cream - primary text color */
--color-accent: #2C804F;        /* Forest green - primary accent, buttons */

/* Secondary Brand Colors */
--color-card-background: #E3D6B8;  /* Warm cream - card backgrounds */
--color-card-text: #482124;        /* Deep burgundy - text on light backgrounds */
--color-muted-text: #74453C;       /* Muted brown - secondary text, borders */

/* Interactive Colors */
--color-success: #22c55e;       /* Green - question indicators */
--color-warning: #f59e0b;       /* Amber - warning states */
--color-error: #dc2626;         /* Red - error states, delete buttons */
--color-error-hover: #b91c1c;   /* Darker red - error button hover */

/* Neutral Colors */
--color-dark: #111;             /* Very dark gray - image backgrounds */
--color-border: #5a2a2d;        /* Dark burgundy - borders, gradients */
--color-light-accent: #236B42;  /* Darker green - button hover states */
--color-fade: #F1EADB;          /* Light cream - subtle text */
```

### Typography Scale

```css
/* Font Families */
--font-display: 'Pacifico', cursive;           /* Headers, buttons */
--font-serif: 'Hahmlet', serif;                /* Accent text */
--font-sans: 'Instrument Sans', sans-serif;    /* Body text */
--font-mono: 'SF Mono', monospace;             /* Code, countdown */

/* Font Sizes (Tailwind scale) */
--text-xs: 0.75rem;      /* 12px */
--text-sm: 0.875rem;     /* 14px */
--text-base: 1rem;       /* 16px */
--text-lg: 1.125rem;     /* 18px */
--text-xl: 1.25rem;      /* 20px */
--text-2xl: 1.5rem;      /* 24px */
--text-4xl: 2.25rem;     /* 36px */
--text-6xl: 3.75rem;     /* 60px */
--text-8xl: 6rem;        /* 96px */
--text-10xl: 8rem;       /* 128px */
```

### Spacing System

```css
/* Tailwind spacing scale (rem units) */
--space-1: 0.25rem;      /* 4px */
--space-2: 0.5rem;       /* 8px */
--space-3: 0.75rem;      /* 12px */
--space-4: 1rem;         /* 16px */
--space-6: 1.5rem;       /* 24px */
--space-8: 2rem;         /* 32px */
--space-12: 3rem;        /* 48px */
--space-16: 4rem;        /* 64px */
--space-20: 5rem;        /* 80px */
```

## 🧩 Component Architecture

### Card System

The interactive guest card system is the core component of the website:

```javascript
// Card Structure
CardContainer
├── CardFlipper (3D transform container)
│   ├── CardFront (visible by default)
│   │   ├── ImageSection
│   │   │   ├── GuestImage (WebP with fallback)
│   │   │   ├── QuestionIndicator (green circle)
│   │   │   └── HoverOverlay (desktop only)
│   │   └── TextContent
│   │       ├── GuestName (h3)
│   │       └── Projects (p)
│   └── CardBack (hidden, rotated 180deg)
│       ├── CloseButton
│       ├── QuestionForm (dynamic states)
│       └── QuestionList (submitted questions)
```

### State Management

```javascript
// Global State
const globalState = {
    currentFlippedCard: null,        // Currently active card
    lazyLoadingEnabled: false,       // Lazy loading trigger
    imagesLoaded: new Set(),         // Tracked loaded images
    isProjectOverlayActive: false,   // B-key overlay state
    isKeyboardNavigationEnabled: false, // Keyboard mode
    currentFocusedCard: null         // Keyboard navigation focus
};
```

### Event System

```javascript
// Event Flow
User Interaction → Event Handler → State Update → DOM Update → Animation

// Example: Card Flip
1. User clicks card image
2. Click handler determines flip direction
3. Portal pattern moves card to body
4. CSS classes trigger 3D transform
5. Background blur effect applied
6. Form state rendered on card back
```

## 🎭 Animation System

### CSS Transforms

```css
/* 3D Card Flip */
.card-flipper {
    transform-style: preserve-3d;
    transition: transform 0.6s;
}

.card-container.flipped .card-flipper {
    transform: rotateX(180deg);
}

.card-container.flipped-reverse .card-flipper {
    transform: rotateX(-180deg);
}

/* Portal Pattern for Fixed Positioning */
.card-container[style*="position: fixed"] {
    z-index: 9999;
}
```

### Performance Optimizations

```css
/* Hardware Acceleration */
.card-flipper {
    will-change: transform;
    backface-visibility: hidden;
}

/* Smooth Animations */
.guest-card {
    transition: transform 0.3s ease-in-out;
}

/* Loading States */
.lazy-image-placeholder {
    background: linear-gradient(90deg, #482124 25%, #5a2a2d 50%, #482124 75%);
    animation: loading-shimmer 2s infinite;
}
```

## 📱 Responsive Design Strategy

### Breakpoint System

```css
/* Tailwind Breakpoints */
xs: 375px      /* Small phones */
sm: 640px      /* Large phones */
md: 768px      /* Tablets */
lg: 1024px     /* Small laptops */
xl: 1280px     /* Large laptops */
2xl: 1536px    /* Desktops */
```

### Mobile-First Approach

```css
/* Base styles (mobile) */
.guest-card {
    width: 100%;
    margin-bottom: 1rem;
}

/* Tablet and up */
@media (min-width: 640px) {
    .guest-card {
        width: calc(50% - 0.5rem);
    }
}

/* Desktop and up */
@media (min-width: 1024px) {
    .guest-card {
        width: calc(33.333% - 0.75rem);
    }
}
```

### Image Responsiveness

```html
<!-- Responsive Images with WebP -->
<picture>
    <source media="(min-width: 640px)" srcset="desktop-image.webp">
    <img src="mobile-image.webp" alt="Guest Name" class="w-full">
</picture>
```

## 🚀 Performance Architecture

### Build Optimization

```javascript
// Vite Configuration
export default defineConfig({
    build: {
        rollupOptions: {
            output: {
                manualChunks: (id) => {
                    if (id.includes('lucide')) return 'vendor-lucide';
                    if (id.includes('guests.js')) return 'guests';
                    if (id.includes('script.js')) return 'main';
                }
            }
        },
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true
            }
        }
    }
});
```

### Lazy Loading Strategy

```javascript
// Intersection Observer Implementation
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
                rootMargin: '50px 0px',
                threshold: 0.01
            }
        );
    }
}
```

### Image Optimization Pipeline

```javascript
// Sharp Image Processing
async function optimizeImage(inputPath, outputPath) {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    // Resize if too large
    if (metadata.width > 1200 || metadata.height > 1200) {
        image.resize(1200, 1200, {
            fit: 'inside',
            withoutEnlargement: true
        });
    }
    
    // Convert to WebP
    await image
        .webp({ quality: 80, effort: 6 })
        .toFile(outputPath);
}
```

## 🔧 Code Organization

### File Structure

```
src/
├── script.js              # Main application logic
├── guests.js              # Guest data and management
├── style.css              # Custom styles and animations
├── input.css              # Tailwind CSS input
├── index.html             # Main page template
├── vite.config.js         # Build configuration
├── tailwind.config.js     # Tailwind configuration
└── package.json           # Dependencies and scripts
```

### Module Organization

```javascript
// script.js Structure
import { guests } from './guests.js';
import { createIcons, Facebook, Instagram, Youtube } from 'lucide';

// Global State Management
let currentFlippedCard = null;
let lazyLoadingEnabled = false;

// Core Classes
class LazyImageLoader { /* ... */ }
class KeyboardNavigation { /* ... */ }

// Event Handlers
document.addEventListener('DOMContentLoaded', () => {
    // Initialization
});

// Utility Functions
function renderCardBack(guestName) { /* ... */ }
function updateQuestionIndicator(cardContainer, guestName) { /* ... */ }
```

### Data Flow

```javascript
// Guest Data Flow
guests.js → script.js → DOM Rendering → User Interaction → State Update → Re-render

// Question Submission Flow
User Input → Form Validation → Local Storage → Google Sheets API → Success Feedback
```

## 🎯 Design Patterns

### Portal Pattern

Used for card flipping to isolate the flipped card from background blur:

```javascript
// Portal Implementation
const rect = cardContainer.getBoundingClientRect();
originalParent = cardContainer.parentNode;
originalNextSibling = cardContainer.nextSibling;

// Create placeholder
placeholder = document.createElement('div');
placeholder.style.width = rect.width + 'px';
placeholder.style.height = rect.height + 'px';

// Move to body
document.body.appendChild(cardContainer);
cardContainer.style.position = 'fixed';
cardContainer.style.zIndex = '9999';
```

### Observer Pattern

For lazy loading and intersection detection:

```javascript
// Intersection Observer
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            loadImage(entry.target);
            observer.unobserve(entry.target);
        }
    });
}, { rootMargin: '50px 0px' });
```

### State Machine Pattern

For question form states:

```javascript
// Form State Machine
const formStates = {
    0: 'show-form',           // No questions submitted
    1: 'show-form-and-list',  // 1 question submitted
    2: 'show-list-only'       // 2 questions submitted (limit reached)
};
```

## 🔒 Security Considerations

### Input Validation

```javascript
// Question Submission Validation
function validateQuestion(question, submitter, email) {
    if (!question || question.length > 140) {
        throw new Error('Invalid question length');
    }
    
    if (email && !isValidEmail(email)) {
        throw new Error('Invalid email format');
    }
    
    return true;
}
```

### Rate Limiting

```javascript
// Local Storage Rate Limiting
function checkRateLimit(panelist, submitter) {
    const userLimit = 2;
    const deviceLimit = 3;
    
    const userCount = getSubmissionCount(panelist, submitter);
    const deviceCount = getDeviceSubmissionCount(panelist);
    
    if (userCount >= userLimit || deviceCount >= deviceLimit) {
        return { allowed: false, message: 'Rate limit exceeded' };
    }
    
    return { allowed: true };
}
```

## 🧪 Testing Strategy

### Manual Testing Checklist

- [ ] Card flip animations work on all devices
- [ ] Keyboard navigation functions properly
- [ ] Question submission system works
- [ ] Images load correctly with lazy loading
- [ ] Mobile responsiveness across breakpoints
- [ ] Accessibility with screen readers
- [ ] Performance metrics meet targets

### Automated Testing

```javascript
// Build Verification
const verifyBuild = () => {
    // Check guest visibility
    // Verify image optimization
    // Test bundle integrity
    // Validate performance metrics
};
```

---

**Next**: [Data Models & APIs](./03-data-models-apis.md)
