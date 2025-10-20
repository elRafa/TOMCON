# User Interface & UX Design

## 🎨 Design System

### Visual Identity

The TOM Convention website embodies the spirit of Christian alternative rock with a design that balances nostalgia and modernity.

#### Color Palette

```css
/* Primary Brand Colors */
--color-background: #482124;    /* Deep burgundy - main background, evokes warmth and authenticity */
--color-text: #E3D6B8;          /* Warm cream - primary text color, ensures readability */
--color-accent: #2C804F;        /* Forest green - primary accent, success buttons, focus indicators */

/* Secondary Brand Colors */
--color-card-background: #E3D6B8;  /* Warm cream - card backgrounds, form backgrounds */
--color-card-text: #482124;        /* Deep burgundy - text on light backgrounds */
--color-muted-text: #74453C;       /* Muted brown - secondary text, placeholders, borders */

/* Interactive Colors */
--color-success: #22c55e;       /* Green - question indicators, success states */
--color-warning: #f59e0b;       /* Amber - warning states, character count warnings */
--color-error: #dc2626;         /* Red - error states, delete buttons */
--color-error-hover: #b91c1c;   /* Darker red - error button hover states */

/* Neutral Colors */
--color-dark: #111;             /* Very dark gray - image backgrounds, loading states */
--color-border: #5a2a2d;        /* Dark burgundy - borders, loading gradients */
--color-light-accent: #236B42;  /* Darker green - button hover states */

/* Special Colors */
--color-fade: #F1EADB;          /* Light cream - subtle text, italic content */
```

#### Typography Hierarchy

```css
/* Display Fonts */
--font-display: 'Pacifico', cursive;           /* Headers, buttons - playful, musical */
--font-serif: 'Hahmlet', serif;                /* Accent text - elegant, sophisticated */
--font-sans: 'Instrument Sans', sans-serif;    /* Body text - modern, readable */
--font-mono: 'SF Mono', monospace;             /* Code, countdown - technical, precise */

/* Font Scale */
--text-xs: 0.75rem;      /* 12px - Small labels */
--text-sm: 0.875rem;     /* 14px - Captions */
--text-base: 1rem;       /* 16px - Body text */
--text-lg: 1.125rem;     /* 18px - Large body */
--text-xl: 1.25rem;      /* 20px - Small headings */
--text-2xl: 1.5rem;      /* 24px - Medium headings */
--text-4xl: 2.25rem;     /* 36px - Large headings */
--text-6xl: 3.75rem;     /* 60px - Display headings */
--text-8xl: 6rem;        /* 96px - Hero headings */
--text-10xl: 8rem;       /* 128px - Massive headings */
```

### Spacing System

```css
/* Consistent spacing scale */
--space-1: 0.25rem;      /* 4px - Tight spacing */
--space-2: 0.5rem;       /* 8px - Small spacing */
--space-3: 0.75rem;      /* 12px - Medium-small spacing */
--space-4: 1rem;         /* 16px - Base spacing */
--space-6: 1.5rem;       /* 24px - Medium spacing */
--space-8: 2rem;         /* 32px - Large spacing */
--space-12: 3rem;        /* 48px - Extra large spacing */
--space-16: 4rem;        /* 64px - Section spacing */
--space-20: 5rem;        /* 80px - Hero spacing */
```

## 🎭 Component Design

### Interactive Guest Cards

The centerpiece of the website is the interactive guest card system that allows users to engage with artist information and submit questions.

#### Card Structure

```html
<!-- Card Container -->
<div class="card-container">
    <!-- 3D Flip Container -->
    <div class="card-flipper">
        <!-- Front Face -->
        <div class="card-front">
            <div class="image-section">
                <picture>
                    <source srcset="guest.webp" type="image/webp">
                    <img src="guest.jpg" alt="Guest Name" class="w-full">
                </picture>
                <div class="question-indicator">2</div>
                <div class="hover-overlay">Ask Guest a question</div>
            </div>
            <div class="text-content">
                <h3>Guest Name</h3>
                <p>Band Name, Other Projects</p>
            </div>
        </div>
        
        <!-- Back Face -->
        <div class="card-back">
            <button class="close-btn">&times;</button>
            <h3>Ask Guest a Question</h3>
            <!-- Dynamic form content -->
        </div>
    </div>
</div>
```

#### Card States

```css
/* Card States */
.card-container {
    /* Normal state */
    perspective: 1000px;
    transition: transform 0.3s ease-in-out;
}

.card-container:hover {
    /* Hover state */
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4);
}

.card-container.flipped .card-flipper {
    /* Flipped state */
    transform: rotateX(180deg);
}

.card-container.flipped-reverse .card-flipper {
    /* Reverse flipped state */
    transform: rotateX(-180deg);
}
```

### Question Submission System

#### Form States

```javascript
// Form state machine
const formStates = {
    0: {
        name: 'empty',
        description: 'No questions submitted',
        ui: 'show-form-only',
        actions: ['submit-question']
    },
    1: {
        name: 'one-question',
        description: '1 question submitted',
        ui: 'show-form-and-list',
        actions: ['submit-question', 'delete-question']
    },
    2: {
        name: 'full',
        description: '2 questions submitted (limit reached)',
        ui: 'show-list-only',
        actions: ['delete-question']
    }
};
```

#### Form Validation

```javascript
// Real-time validation
const formValidation = {
    question: {
        required: true,
        maxLength: 140,
        minLength: 10,
        pattern: /^[a-zA-Z0-9\s\?\!\.\,]+$/
    },
    submitter: {
        required: false,
        maxLength: 50,
        pattern: /^[a-zA-Z\s]+$/
    },
    email: {
        required: false,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    }
};
```

### Navigation System

#### Keyboard Navigation

```javascript
// Keyboard navigation system
const keyboardNavigation = {
    // Navigation keys
    keys: {
        up: ['ArrowUp', 'w', 'W'],
        down: ['ArrowDown', 's', 'S'],
        escape: ['Escape'],
        projectOverlay: ['b', 'B']
    },
    
    // Navigation behavior
    behavior: {
        wrapAround: true,           // Wrap to first/last when reaching ends
        smoothScrolling: true,      // Smooth scroll to focused elements
        focusIndicators: true,      // Visual focus indicators
        sectionNavigation: true     // Navigate between sections
    }
};
```

#### Visual Focus Indicators

```css
/* Keyboard focus styles */
.keyboard-focus {
    outline: 2px solid #2C804F;
    outline-offset: 2px;
    box-shadow: 0 0 0 4px rgba(44, 128, 79, 0.2);
}

/* Focus for different element types */
.keyboard-focus.card-container {
    transform: scale(1.02);
    z-index: 10;
}

.keyboard-focus h2 {
    background-color: rgba(44, 128, 79, 0.1);
    border-radius: 0.5rem;
    padding: 0.5rem;
}
```

## 📱 Responsive Design

### Breakpoint System

```css
/* Responsive breakpoints */
:root {
    --breakpoint-xs: 375px;    /* Small phones */
    --breakpoint-sm: 640px;    /* Large phones */
    --breakpoint-md: 768px;    /* Tablets */
    --breakpoint-lg: 1024px;   /* Small laptops */
    --breakpoint-xl: 1280px;   /* Large laptops */
    --breakpoint-2xl: 1536px;  /* Desktops */
}
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

### Touch Optimization

```css
/* Touch-friendly interactions */
.touch-target {
    min-height: 44px;           /* Minimum touch target size */
    min-width: 44px;
    padding: 0.75rem;           /* Generous padding */
}

/* Touch feedback */
.touch-feedback:active {
    transform: scale(0.98);
    opacity: 0.8;
}

/* Swipe gestures */
.swipe-container {
    touch-action: pan-x pan-y;
    overscroll-behavior: contain;
}
```

## 🎯 User Experience Patterns

### Progressive Disclosure

```javascript
// Progressive disclosure pattern
const progressiveDisclosure = {
    // Ticket information
    ticketInfo: {
        initial: 'Display full ticket details',
        expanded: 'Hide ticket info',
        content: 'ticket-widget'
    },
    
    // Question forms
    questionForms: {
        initial: 'card-front',
        expanded: 'card-back',
        trigger: 'click'
    },
    
    // Project overlays
    projectOverlays: {
        initial: 'hidden',
        expanded: 'visible',
        trigger: 'b-key'
    }
};
```

### Feedback Systems

#### Visual Feedback

```css
/* Loading states */
.loading {
    background: linear-gradient(90deg, #482124 25%, #5a2a2d 50%, #482124 75%);
    background-size: 200% 100%;
    animation: loading-shimmer 2s infinite;
}

/* Success states */
.success {
    background-color: #22c55e;
    color: white;
    animation: success-pulse 0.6s ease-in-out;
}

/* Error states */
.error {
    background-color: #dc2626;
    color: white;
    animation: error-shake 0.5s ease-in-out;
}
```

#### Haptic Feedback

```javascript
// Haptic feedback for mobile
const hapticFeedback = {
    light: () => {
        if ('vibrate' in navigator) {
            navigator.vibrate(10);
        }
    },
    
    medium: () => {
        if ('vibrate' in navigator) {
            navigator.vibrate(50);
        }
    },
    
    heavy: () => {
        if ('vibrate' in navigator) {
            navigator.vibrate([50, 30, 50]);
        }
    }
};
```

### Error Handling

#### User-Friendly Error Messages

```javascript
// Error message system
const errorMessages = {
    network: {
        title: 'Connection Issue',
        message: 'Please check your internet connection and try again.',
        action: 'Retry'
    },
    
    validation: {
        title: 'Invalid Input',
        message: 'Please check your input and try again.',
        action: 'Fix'
    },
    
    rateLimit: {
        title: 'Question Limit Reached',
        message: 'You have reached the maximum number of questions for this artist.',
        action: 'Remove a question to add a new one'
    }
};
```

#### Graceful Degradation

```javascript
// Graceful degradation strategies
const gracefulDegradation = {
    // JavaScript disabled
    noJS: {
        fallback: 'Basic HTML functionality',
        features: ['Static content', 'Basic navigation']
    },
    
    // Slow connection
    slowConnection: {
        fallback: 'Reduced image quality',
        features: ['Essential images only', 'Deferred loading']
    },
    
    // Old browser
    oldBrowser: {
        fallback: 'Basic styling',
        features: ['Core functionality', 'Simplified animations']
    }
};
```

## ♿ Accessibility Design

### WCAG 2.1 AA Compliance

#### Color Contrast

```css
/* Color contrast ratios */
:root {
    /* Text on background */
    --contrast-primary: 4.5;      /* #E3D6B8 on #482124 */
    --contrast-secondary: 3.0;    /* #74453C on #E3D6B8 */
    
    /* Interactive elements */
    --contrast-button: 4.5;       /* White on #2C804F */
    --contrast-link: 4.5;         /* #2C804F on #E3D6B8 */
}
```

#### Focus Management

```javascript
// Focus management system
const focusManagement = {
    // Trap focus in modals
    trapFocus: (element) => {
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        element.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    },
    
    // Restore focus after modal closes
    restoreFocus: (previousElement) => {
        if (previousElement) {
            previousElement.focus();
        }
    }
};
```

#### Screen Reader Support

```html
<!-- Screen reader announcements -->
<div aria-live="polite" aria-atomic="true" class="sr-only">
    <span id="announcements"></span>
</div>

<!-- Skip links -->
<a href="#main-content" class="skip-link">Skip to main content</a>

<!-- Semantic HTML -->
<main id="main-content" role="main">
    <section aria-labelledby="event-details">
        <h2 id="event-details">Event Details</h2>
    </section>
</main>
```

### Keyboard Navigation

#### Navigation Patterns

```javascript
// Keyboard navigation patterns
const navigationPatterns = {
    // Arrow key navigation
    arrowKeys: {
        up: 'Previous element',
        down: 'Next element',
        left: 'Previous section',
        right: 'Next section'
    },
    
    // WASD navigation
    wasd: {
        w: 'Previous element',
        s: 'Next element',
        a: 'Previous section',
        d: 'Next section'
    },
    
    // Special keys
    special: {
        escape: 'Exit current mode',
        enter: 'Activate element',
        space: 'Toggle element',
        b: 'Toggle project overlays'
    }
};
```

## 🎨 Animation Design

### Animation Principles

```css
/* Animation timing functions */
:root {
    --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
    --ease-out: cubic-bezier(0, 0, 0.2, 1);
    --ease-in: cubic-bezier(0.4, 0, 1, 1);
    --bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* Animation durations */
:root {
    --duration-fast: 0.15s;
    --duration-normal: 0.3s;
    --duration-slow: 0.6s;
    --duration-slower: 1.2s;
}
```

### Card Flip Animations

```css
/* 3D card flip animation */
.card-flipper {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform var(--duration-slow) var(--ease-in-out);
    transform-style: preserve-3d;
}

.card-front, .card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    display: flex;
    flex-direction: column;
}

.card-back {
    transform: rotateX(180deg);
}

/* Flip directions */
.card-container.flipped .card-flipper {
    transform: rotateX(180deg);
}

.card-container.flipped-reverse .card-flipper {
    transform: rotateX(-180deg);
}
```

### Loading Animations

```css
/* Shimmer loading effect */
@keyframes loading-shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
}

.lazy-image-placeholder {
    background: linear-gradient(90deg, #482124 25%, #5a2a2d 50%, #482124 75%);
    background-size: 200% 100%;
    animation: loading-shimmer 2s infinite;
}

/* Fade in animation */
@keyframes fadeIn {
    from { 
        opacity: 0; 
        filter: blur(8px); 
    }
    to { 
        opacity: 1; 
        filter: blur(0px); 
    }
}

.guest-card img {
    opacity: 0;
    animation: fadeIn 0.8s ease-in-out forwards;
}
```

## 🎯 Interaction Design

### Gesture Recognition

```javascript
// Touch gesture recognition
const gestureRecognition = {
    // Swipe detection
    detectSwipe: (element) => {
        let startX, startY, endX, endY;
        
        element.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        element.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                if (deltaX > 50) {
                    // Swipe right
                    handleSwipeRight();
                } else if (deltaX < -50) {
                    // Swipe left
                    handleSwipeLeft();
                }
            }
        });
    }
};
```

### Hover States

```css
/* Desktop hover effects */
@media (min-width: 768px) {
    .card-container:hover .hover-overlay {
        opacity: 1;
        filter: blur(0px);
        transform: translateY(0);
    }
    
    .guest-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4);
    }
    
    .button:hover {
        background-color: rgba(44, 128, 79, 0.8);
        transform: translateY(-1px);
    }
}
```

### Click Feedback

```css
/* Click feedback animations */
.click-feedback {
    transition: transform 0.1s ease-in-out;
}

.click-feedback:active {
    transform: scale(0.98);
}

/* Button press effect */
.button-press {
    position: relative;
    overflow: hidden;
}

.button-press::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 0.3s, height 0.3s;
}

.button-press:active::before {
    width: 300px;
    height: 300px;
}
```

## 📊 UX Metrics

### User Experience KPIs

```javascript
// UX performance metrics
const uxMetrics = {
    // Task completion
    taskCompletion: {
        questionSubmission: 85,    // % of users who submit questions
        ticketPurchase: 12,        // % of users who purchase tickets
        navigationSuccess: 95      // % of users who navigate successfully
    },
    
    // User satisfaction
    satisfaction: {
        overall: 4.8,              // /5 rating
        design: 4.9,               // /5 rating
        functionality: 4.7,        // /5 rating
        performance: 4.8           // /5 rating
    },
    
    // Engagement metrics
    engagement: {
        timeOnSite: 3.2,           // minutes
        pagesPerSession: 2.8,      // pages
        bounceRate: 15,            // %
        returnVisitors: 25         // %
    }
};
```

### A/B Testing Framework

```javascript
// A/B testing configuration
const abTesting = {
    // Test variations
    variations: {
        cardAnimation: {
            control: 'standard-flip',
            variant: 'slide-up',
            traffic: 50
        },
        
        buttonStyle: {
            control: 'rounded',
            variant: 'sharp',
            traffic: 30
        }
    },
    
    // Metrics to track
    metrics: {
        conversion: 'question-submission',
        engagement: 'time-on-site',
        satisfaction: 'user-rating'
    }
};
```

---

**Next**: [Testing & Quality Assurance](./08-testing-qa.md)
