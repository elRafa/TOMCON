import { guests } from './guests.js';
import { createIcons, Facebook, Instagram, Youtube } from 'lucide';

// DEBUG MODE: Set to true to disable lazy loading and see placeholders
const DEBUG_MODE = false;

// Global variables for card state management
let currentFlippedCard = null;
let lazyLoadingEnabled = false;
let imagesLoaded = new Set();
let loadingStartTimes = new Map();

// Keyboard navigation variables
let currentFocusedCard = null;
let isKeyboardNavigationEnabled = false;

// B-key feature variables
let isProjectOverlayActive = false;
let projectOverlays = new Map(); // Store overlay elements per card

// Function to check if any card is currently flipped
function isAnyCardFlipped() {
    return document.querySelector('.card-flipper.flipped') !== null;
}

// Function to show/hide project name overlays
function toggleProjectOverlays() {
    if (isAnyCardFlipped()) {
        // If any card is flipped, deactivate the feature
        isProjectOverlayActive = false;
        hideAllProjectOverlays();
        return;
    }

    isProjectOverlayActive = !isProjectOverlayActive;

    if (isProjectOverlayActive) {
        showAllProjectOverlays();
    } else {
        hideAllProjectOverlays();
    }
}

// Function to show project overlays on all cards
function showAllProjectOverlays() {
    // Only show overlays on moderator and guest panelist cards
    const moderatorCards = document.querySelectorAll('#moderators .card-container');
    const guestCards = document.querySelectorAll('#featured-guests .card-container');

    // Combine both sections
    const targetCards = [...moderatorCards, ...guestCards];

    // Special case: Also include Mikee from staff section
    const mikeeCard = document.querySelector('#staff .card-container h3');
    if (mikeeCard && mikeeCard.textContent === 'Mikee Bridges') {
        const mikeeContainer = mikeeCard.closest('.card-container');
        if (mikeeContainer) {
            targetCards.push(mikeeContainer);
        }
    }

    targetCards.forEach(card => {
        const guestName = card.querySelector('h3')?.textContent;
        if (guestName && guests.some(g => g.name === guestName && g.visibility === 1)) {
            showProjectOverlay(card, guestName);
        }
    });
}

// Function to hide all project overlays
function hideAllProjectOverlays() {
    projectOverlays.forEach(overlay => {
        if (overlay && overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
        }
    });
    projectOverlays.clear();
}

// Function to show project overlay for a specific card
function showProjectOverlay(card, guestName) {
    // Skip if overlay already exists
    if (projectOverlays.has(card)) {
        return;
    }

    const guest = guests.find(g => g.name === guestName);
    if (!guest || !guest.projects) return;

    // Get the first project name
    const firstProject = guest.projects.split(',')[0].trim();

    // Create overlay element
    const overlay = document.createElement('div');
    overlay.className = 'project-overlay';
    overlay.textContent = firstProject;

    // Position overlay over the image
    const imageContainer = card.querySelector('.card-front');
    if (imageContainer) {
        imageContainer.style.position = 'relative';
        imageContainer.appendChild(overlay);
        projectOverlays.set(card, overlay);
    }
}

// Performance optimization: Cache DOM elements
const domCache = new Map();

function getCachedElement(id) {
    if (!domCache.has(id)) {
        domCache.set(id, document.getElementById(id));
    }
    return domCache.get(id);
}

// Optimized lazy loading with Intersection Observer
class LazyImageLoader {
    constructor() {
        this.observer = null;
        this.imagesLoaded = new Set();
        this.loadingStartTimes = new Map();
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
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

    observe(element) {
        if (this.observer) {
            this.observer.observe(element);
        } else {
            // Fallback for older browsers
            this.loadImage(element);
        }
    }

    loadImage(element) {
        const src = element.dataset.src;
        const alt = element.dataset.alt;
        
        if (!src || this.imagesLoaded.has(src)) return;
        
        this.imagesLoaded.add(src);
        this.loadingStartTimes.set(src, performance.now());

        const img = new Image();
        img.onload = () => {
            const loadTime = performance.now() - this.loadingStartTimes.get(src);
            if (DEBUG_MODE) {
                console.log(`Image loaded: ${src} in ${loadTime.toFixed(2)}ms`);
            }
            
            // Replace placeholder with actual image
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
            
            // Only replace if the element still exists and hasn't been moved
            if (element.parentNode && element.parentNode.contains(element)) {
                element.parentNode.replaceChild(picture, element);
            }
        };
        
        img.onerror = () => {
            console.warn(`Failed to load image: ${src}`);
            this.imagesLoaded.delete(src);
        };
        
        img.src = src;
    }
}

// Initialize lazy loader
const lazyLoader = new LazyImageLoader();

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons (must be outside any conditional blocks)
    createIcons({
        icons: {
            Facebook,
            Instagram,
            Youtube
        }
    });

    // Ticket toggle functionality
    const ticketToggle = document.getElementById('ticket-toggle');
    const ticketWidget = document.getElementById('ticket-widget');
    
    if (ticketToggle && ticketWidget) {
        ticketToggle.addEventListener('click', () => {
            const isHidden = ticketWidget.classList.contains('hidden');
            if (isHidden) {
                ticketWidget.classList.remove('hidden');
                ticketToggle.textContent = 'Hide ticket info';
            } else {
                ticketWidget.classList.add('hidden');
                ticketToggle.textContent = 'Display ticket info';
            }
        });
    }

    const guestGrid = document.getElementById('guest-grid');
    const moderatorGrid = document.getElementById('moderator-grid');
    const performerGrid = document.getElementById('performer-grid');

    // Split guests by role robustly, supporting multiple roles
    function hasRole(guest, role) {
        if (!guest.role) return false;
        return guest.role.split(',').map(r => r.trim().toLowerCase()).includes(role);
    }

    // Filter guests by visibility first, then by role
    const visibleGuests = guests.filter(g => g.visibility !== 0);
    const moderators = visibleGuests.filter(g => hasRole(g, 'moderator'));
    const featured = visibleGuests.filter(g => hasRole(g, 'panelist'));
    const performers = visibleGuests.filter(g => hasRole(g, 'performer'));
    const staff = visibleGuests.filter(g => hasRole(g, 'staff'));

    function renderGuests(list, grid, enableLazyLoading = false) {
        if (!grid) return;
        
        // Clear the grid first to prevent duplicates
        grid.innerHTML = '';
        
        // Use DocumentFragment for better performance
        const fragment = document.createDocumentFragment();
        
        list.forEach(guest => {
            // Create card container for flip effect
            const cardContainer = document.createElement('div');
            cardContainer.className = 'card-container';
            
            const cardFlipper = document.createElement('div');
            cardFlipper.className = 'card-flipper';
            
            // Create front face
            const cardFront = document.createElement('div');
            cardFront.className = 'guest-card text-center card-front';

            let imageHtml = '';
            if (guest.imageUrl) {
                if (enableLazyLoading) {
                    // Get first name for loading text, with special case for Us Kids All-Stars
                    const displayName = guest.name === 'Us Kids All-Stars' ? 'Us Kids All-Stars' : guest.name.split(' ')[0];
                    // Create placeholder with container-based rounded corners
                    imageHtml = `<div class="w-full" style="border-radius: 1em 1em 0 0; overflow: hidden;">
                        <div class="w-full bg-gray-900 flex items-center justify-center lazy-image-placeholder" style="aspect-ratio: 2 / 3; ${DEBUG_MODE ? 'border: 3px solid red;' : ''}" data-src="${guest.imageUrl}" data-alt="${guest.name}">
                            <span class="text-gray-500">Loading ${displayName}...${DEBUG_MODE ? ' (DEBUG MODE)' : ''}</span>
                        </div>
                    </div>`;
                } else {
                    // Load image immediately for moderators
                imageHtml = `<picture>
            <source srcset="${guest.imageUrl.replace(/\.(jpg|jpeg|png)$/i, '.webp')}" type="image/webp">
            <img src="${guest.imageUrl}" alt="${guest.name}" class="w-full shadow-lg mb-4">
        </picture>`;
                }
            } else {
                 imageHtml = `<div class="w-full shadow-lg mb-4 bg-gray-900 flex items-center justify-center" style="aspect-ratio: 2 / 3;">
                    <span class="text-gray-500">Image Coming Soon</span>
                 </div>`;
            }

            // Check if guest has questions
            const guestQuestions = getGuestQuestions(guest.name);
            const questionCount = guestQuestions.length;
            const displayName = guest.name.split(' ')[0];
            const hoverText = questionCount >= 2 ? 
                `Edit or delete your questions for ${displayName}` : 
                `Ask ${displayName} a question to be considered during the Audience Q&A`;
            
            cardFront.innerHTML = `
                <div class="image-section">
                    ${imageHtml}
                    ${questionCount > 0 ? `<div class="question-indicator">${questionCount}</div>` : ''}
                    <div class="hover-overlay">${hoverText}</div>
                </div>
                <div class="text-content">
                    <h3 class="text-xl font-bold">${guest.name}</h3>
                    <p class="text-sm text-gray-400 italic mt-1">${guest.projects}</p>
                </div>
            `;
            
            // Create back face with dynamic question form/list
            const cardBack = document.createElement('div');
            cardBack.className = 'card-back';
            cardBack.innerHTML = renderCardBack(guest.name);
            
            // Assemble the card
            cardFlipper.appendChild(cardFront);
            cardFlipper.appendChild(cardBack);
            cardContainer.appendChild(cardFlipper);
            fragment.appendChild(cardContainer);
        });
        
        // Append all cards at once for better performance
        grid.appendChild(fragment);
        
        // Observe lazy loading images after DOM insertion
        if (enableLazyLoading) {
            const lazyImages = grid.querySelectorAll('.lazy-image-placeholder');
            lazyImages.forEach(img => lazyLoader.observe(img));
        }
    }

    // Function to render performers with responsive images, grouped by day
    function renderPerformers(list, grid) {
        if (!grid) return;
        
        // Clear the grid first to prevent duplicates
        grid.innerHTML = '';
        
        // Group performers by day and sort by order
        const performersByDay = list.reduce((acc, performer) => {
            const day = performer.day || 'Unknown';
            if (!acc[day]) {
                acc[day] = [];
            }
            acc[day].push(performer);
            return acc;
        }, {});
        
        // Sort each day's performers by order
        Object.keys(performersByDay).forEach(day => {
            performersByDay[day].sort((a, b) => (a.order || 0) - (b.order || 0));
        });
        
        // Define day order and display names
        const dayOrder = ['Friday', 'Saturday'];
        const dayDisplayNames = {
            'Friday': 'FRIDAY OCT 24',
            'Saturday': 'SATURDAY OCT 25'
        };
        
        // Render each day's section
        dayOrder.forEach(day => {
            if (performersByDay[day] && performersByDay[day].length > 0) {
                // Create day heading
                const dayHeading = document.createElement('h3');
                dayHeading.className = 'text-2xl font-bold text-center mb-6 mt-8 first:mt-0';
                dayHeading.textContent = dayDisplayNames[day];
                grid.appendChild(dayHeading);
                
                // Create container for this day's performers
                const dayContainer = document.createElement('div');
                dayContainer.className = 'space-y-6';
                
                // Render performers for this day
                performersByDay[day].forEach(performer => {
                    // Create card container for flip effect
                    const cardContainer = document.createElement('div');
                    cardContainer.className = 'card-container';
                    
                    const cardFlipper = document.createElement('div');
                    cardFlipper.className = 'card-flipper';
                    
                    // Create front face
                    const cardFront = document.createElement('div');
                    cardFront.className = 'performer-card text-center card-front';

                    let imageHtml = '';
                    const hasDesktopImage = performer.desktopImageUrl;
                    const hasMobileImage = performer.mobileImageUrl;
                    
                    if (hasDesktopImage || hasMobileImage) {
                        // Use picture element for responsive images
                        imageHtml = `<picture>`;
                        if (hasDesktopImage) {
                            imageHtml += `<source media="(min-width: 640px)" srcset="${performer.desktopImageUrl}">`;
                        }
                        if (hasMobileImage) {
                            imageHtml += `<img src="${performer.mobileImageUrl}" alt="${performer.name}" class="w-full mb-4">`;
                        } else if (hasDesktopImage) {
                            // Fallback to desktop image if no mobile image
                            imageHtml += `<img src="${performer.desktopImageUrl}" alt="${performer.name}" class="w-full mb-4">`;
                        }
                        imageHtml += `</picture>`;
                    } else {
                        // Create placeholder with responsive aspect ratios
                        const displayName = performer.name === 'Us Kids All-Stars' ? 'Us Kids All-Stars' : performer.name.split(' ')[0];
                        imageHtml = `<div class="performer-placeholder w-full mb-4">
                            <span class="text-gray-500">Loading ${displayName}...</span>
                        </div>`;
                    }

                    // Check if performer has song requests
                    const performerQuestions = getGuestQuestions(performer.name);
                    const requestCount = performerQuestions.length;
                    const performerHoverText = requestCount >= 2 ? 
                        `Edit or delete your questions for ${performer.name}` : 
                        `Request a song from ${performer.name}`;
                    
                    cardFront.innerHTML = `
                        <div class="image-section">
                            ${imageHtml}
                            ${requestCount > 0 ? `<div class="question-indicator">${requestCount}</div>` : ''}
                            <div class="hover-overlay">${performerHoverText}</div>
                        </div>
                        <div class="text-content">
                            <h3 class="text-xl font-bold">${performer.name}</h3>
                            <p class="text-sm text-gray-400 italic mt-1">${performer.projects}</p>
                        </div>
                    `;
                    
                    // Create back face with dynamic question form/list
                    const cardBack = document.createElement('div');
                    cardBack.className = 'card-back';
                    cardBack.innerHTML = renderCardBack(performer.name, true);
                    
                    // Assemble the card
                    cardFlipper.appendChild(cardFront);
                    cardFlipper.appendChild(cardBack);
                    cardContainer.appendChild(cardFlipper);
                    dayContainer.appendChild(cardContainer);
                });
                
                grid.appendChild(dayContainer);
            }
        });
    }

    // Function to load lazy images with minimum display time
    function loadLazyImages() {
        if (!lazyLoadingEnabled || DEBUG_MODE) return;
        
        const placeholders = document.querySelectorAll('.lazy-image-placeholder');
        placeholders.forEach(placeholder => {
            const src = placeholder.getAttribute('data-src');
            const alt = placeholder.getAttribute('data-alt');
            
            if (src && !imagesLoaded.has(src)) {
                // Record start time for this image
                loadingStartTimes.set(src, Date.now());
                
                const img = new Image();
                img.onload = () => {
                    const startTime = loadingStartTimes.get(src);
                    const elapsed = Date.now() - startTime;
                    const minDisplayTime = 1500; // Minimum 1.5 seconds display time
                    
                    if (elapsed < minDisplayTime) {
                        // Wait for minimum display time
                        setTimeout(() => {
                            // Safety check: ensure placeholder still exists in DOM
                            if (placeholder && placeholder.parentNode) {
                                // Create new img element and replace the placeholder
                                const newImg = document.createElement('img');
                                newImg.src = src;
                                newImg.alt = alt;
                                newImg.className = 'w-full shadow-lg mb-4';
                                placeholder.parentNode.replaceChild(newImg, placeholder);
                                imagesLoaded.add(src);
                            }
                        }, minDisplayTime - elapsed);
                    } else {
                        // Display immediately if minimum time has passed
                        const newImg = document.createElement('img');
                        newImg.src = src;
                        newImg.alt = alt;
                        newImg.className = 'w-full shadow-lg mb-4';
                        placeholder.parentNode.replaceChild(newImg, placeholder);
                        imagesLoaded.add(src);
                    }
                };
                img.onerror = () => {
                    const startTime = loadingStartTimes.get(src);
                    const elapsed = Date.now() - startTime;
                    const minDisplayTime = 1500;
                    
                    if (elapsed < minDisplayTime) {
                        setTimeout(() => {
                            // Safety check: ensure placeholder still exists in DOM
                            if (placeholder && placeholder.parentNode) {
                                placeholder.innerHTML = `<div class="w-full shadow-lg mb-4 bg-gray-900 flex items-center justify-center" style="aspect-ratio: 2 / 3;">
                                    <span class="text-gray-500">Image Error</span>
                                </div>`;
                                placeholder.className = 'w-full shadow-lg mb-4 bg-gray-900 flex items-center justify-center';
                                imagesLoaded.add(src);
                            }
                        }, minDisplayTime - elapsed);
                    } else {
                        placeholder.innerHTML = `<div class="w-full shadow-lg mb-4 bg-gray-900 flex items-center justify-center" style="aspect-ratio: 2 / 3;">
                            <span class="text-gray-500">Image Error</span>
                        </div>`;
                        placeholder.className = 'w-full shadow-lg mb-4 bg-gray-900 flex items-center justify-center';
                        imagesLoaded.add(src);
                    }
                };
                img.src = src;
            }
        });
    }

    // Render moderators immediately (no lazy loading)
    // Sort moderators by order field
    const sortedModerators = moderators.sort((a, b) => (a.order || 999) - (b.order || 999));
    renderGuests(sortedModerators, moderatorGrid, false);
    
    // Render performers immediately (no lazy loading for now)
    renderPerformers(performers, performerGrid);
    
    // Render featured guests and staff with lazy loading
    renderGuests(featured, guestGrid, true);
    const staffGrid = document.getElementById('staff-grid');
    // Sort staff by order field
    const sortedStaff = staff.sort((a, b) => (a.order || 999) - (b.order || 999));
    renderGuests(sortedStaff, staffGrid, true);

    // Set up intersection observer for lazy loading
    const moderatorsSection = document.getElementById('moderators');
    if (moderatorsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // User has scrolled past moderators section
                    lazyLoadingEnabled = true;
                    loadLazyImages();
                    observer.disconnect(); // Only need to trigger once
                }
            });
        }, {
            rootMargin: '100px' // Start loading 100px before reaching the section
        });
        
        observer.observe(moderatorsSection);
    }

    // Fallback: Enable lazy loading after 2 seconds if intersection observer doesn't trigger
    setTimeout(() => {
        if (!lazyLoadingEnabled) {
            lazyLoadingEnabled = true;
            loadLazyImages();
        }
    }, 2000);

    // Rate limiting functions
    function getSubmissionKey(panelist, submitter) {
        return `tomcon_questions_${panelist}_${submitter}`;
    }

    function getDeviceSubmissionKey(panelist) {
        return `tomcon_device_${panelist}`;
    }

    function getSubmissionCount(panelist, submitter) {
        const key = getSubmissionKey(panelist, submitter);
        return parseInt(localStorage.getItem(key) || '0');
    }

    function getDeviceSubmissionCount(panelist) {
        const key = getDeviceSubmissionKey(panelist);
        return parseInt(localStorage.getItem(key) || '0');
    }

    function incrementSubmissionCount(panelist, submitter) {
        const key = getSubmissionKey(panelist, submitter);
        const count = getSubmissionCount(panelist, submitter) + 1;
        localStorage.setItem(key, count.toString());
        return count;
    }

    function incrementDeviceSubmissionCount(panelist) {
        const key = getDeviceSubmissionKey(panelist);
        const count = getDeviceSubmissionCount(panelist) + 1;
        localStorage.setItem(key, count.toString());
        return count;
    }

    // Enhanced Question Storage Functions
    function getQuestionStorageKey(panelist) {
        return `tomcon_stored_questions_${panelist}`;
    }

    function generateQuestionId() {
        return `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    function getStoredQuestions(panelist) {
        const key = getQuestionStorageKey(panelist);
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : [];
    }

    function saveQuestionToStorage(panelist, questionData) {
        const questions = getStoredQuestions(panelist);
        const questionWithId = {
            id: generateQuestionId(),
            question: questionData.question,
            submitter: questionData.submitter || 'Anonymous',
            email: questionData.email || '',
            timestamp: new Date().toISOString()
        };
        
        questions.push(questionWithId);
        
        // Keep only the latest 2 questions
        if (questions.length > 2) {
            questions.splice(0, questions.length - 2);
        }
        
        const key = getQuestionStorageKey(panelist);
        localStorage.setItem(key, JSON.stringify(questions));
        return questionWithId;
    }

    function removeQuestionFromStorage(panelist, questionId) {
        const questions = getStoredQuestions(panelist);
        const filteredQuestions = questions.filter(q => q.id !== questionId);
        
        const key = getQuestionStorageKey(panelist);
        localStorage.setItem(key, JSON.stringify(filteredQuestions));
        return filteredQuestions;
    }

    function getGuestQuestions(guestName) {
        return getStoredQuestions(guestName);
    }

    function updateQuestionIndicator(cardContainer, guestName) {
        const questions = getGuestQuestions(guestName);
        const questionCount = questions.length;
        const cardFront = cardContainer.querySelector('.card-front');
        
        if (cardFront) {
            // Remove existing indicator
            const existingIndicator = cardFront.querySelector('.question-indicator');
            if (existingIndicator) {
                existingIndicator.remove();
            }
            
            // Add new indicator if there are questions
            if (questionCount > 0) {
                const indicator = document.createElement('div');
                indicator.className = 'question-indicator';
                indicator.textContent = questionCount;
                cardFront.appendChild(indicator);
            }
            
            // Update hover overlay text
            const hoverOverlay = cardFront.querySelector('.hover-overlay');
            if (hoverOverlay) {
                // Determine if this is a guest or performer card
                const isPerformerCard = cardFront.classList.contains('performer-card');
                
                if (isPerformerCard) {
                    // For performers, use full name
                    const performerHoverText = questionCount >= 2 ? 
                        `Edit or delete your questions for ${guestName}` : 
                        `Request a song from ${guestName}`;
                    hoverOverlay.textContent = performerHoverText;
                } else {
                    // For guests, use first name only
                    const displayName = guestName.split(' ')[0];
                    const guestHoverText = questionCount >= 2 ? 
                        `Edit or delete your questions for ${displayName}` : 
                        `Ask ${displayName} a question to be considered during the Audience Q&A`;
                    hoverOverlay.textContent = guestHoverText;
                }
            }
        }
    }

    function getDraftKey(panelist) {
        return `tomcon_draft_${panelist}`;
    }

    function saveDraft(panelist, formData) {
        const key = getDraftKey(panelist);
        localStorage.setItem(key, JSON.stringify(formData));
    }

    function getDraft(panelist) {
        const key = getDraftKey(panelist);
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : null;
    }

    function clearDraft(panelist) {
        const key = getDraftKey(panelist);
        localStorage.removeItem(key);
    }

    // Dynamic UI Rendering Functions
    function renderCardBack(guestName, useFullName = false) {
        // For performers, use full name; for others, use first name only
        const displayName = useFullName ? guestName : guestName.split(' ')[0];
        const storedQuestions = getStoredQuestions(guestName);
        const questionCount = storedQuestions.length;
        const draft = getDraft(guestName);

        let content = `
            <button class="close-btn" aria-label="Close">&times;</button>
            <h3>Ask ${displayName} a Question</h3>
        `;
        
        // State 0: Show form (0 questions)
        if (questionCount === 0) {
            content += `
                <form class="question-form" data-guest-name="${guestName}">
                    <div class="textarea-container">
                        <textarea name="question" placeholder="Your question..." maxlength="140" required>${draft?.question || ''}</textarea>
                        <div class="character-counter">
                            <span class="char-count">${(draft?.question || '').length}</span>/140
                        </div>
                    </div>
                    <input type="text" name="submitter" placeholder="Your name (optional)" value="${draft?.submitter || ''}" />
                    <input type="email" name="email" placeholder="Your email (optional)" value="${draft?.email || ''}" />
                    <p class="email-description">Adding your email above will allow ${displayName} to respond to you in case your question doesn't get addressed during the event.</p>
                    <div class="form-buttons">
                        <button type="submit" class="submit-btn">Submit Question</button>
                    </div>
                </form>
            `;
        }
        // State 1: Show form + 1 question (1 question)
        else if (questionCount === 1) {
            content += `
                <form class="question-form" data-guest-name="${guestName}">
                    <div class="textarea-container">
                        <textarea name="question" placeholder="Your question..." maxlength="140" required>${draft?.question || ''}</textarea>
                        <div class="character-counter">
                            <span class="char-count">${(draft?.question || '').length}</span>/140
                        </div>
                    </div>
                    <input type="text" name="submitter" placeholder="Your name (optional)" value="${draft?.submitter || ''}" />
                    <input type="email" name="email" placeholder="Your email (optional)" value="${draft?.email || ''}" />
                    <p class="email-description">Adding your email above will allow ${displayName} to respond to you in case your question doesn't get addressed during the event.</p>
                    <div class="form-buttons">
                        <button type="submit" class="submit-btn">Submit Question</button>
                    </div>
                </form>
                
                <div class="question-divider">
                    <p class="question-status-text">You have 1 question for ${displayName}:</p>
                </div>
                
                <div class="question-list">
                    ${renderQuestionItem(storedQuestions[0], guestName)}
                </div>
            `;
        }
        // State 2: Show 2 questions only (2 questions)
        else if (questionCount === 2) {
            content += `
                <div class="question-limit-message">
                    <p class="question-status-text">You've reached the limit (2/2 questions for ${displayName}):</p>
                    <p class="question-instruction">Remove a question to add a new one.</p>
                </div>
                
                <div class="question-list">
                    ${storedQuestions.map(q => renderQuestionItem(q, guestName)).join('')}
                </div>
            `;
        }
        
        return content;
    }

    function renderQuestionItem(question, guestName) {
        return `
            <div class="question-item" data-question-id="${question.id}">
                <div class="question-content">
                    <p class="question-text">${question.question}</p>
                    <p class="question-meta">From: ${question.submitter}</p>
                </div>
                <button class="question-delete-btn" data-question-id="${question.id}" data-panelist="${guestName}" aria-label="Delete question">
                    🗑️
                </button>
            </div>
        `;
    }

    // Question Form Setup
    function setupQuestionForm() {
        // Elements no longer needed as we use integrated card overlay system

        function checkRateLimit(panelist, submitter) {
            // Check user-specific limit (2 questions per person per artist)
            const userLimit = 2;
            const deviceLimit = 3;
            
            if (submitter && submitter.trim() !== '') {
                const userCount = getSubmissionCount(panelist, submitter);
                if (userCount >= userLimit) {
                    return {
                        allowed: false,
                        type: 'user',
                        count: userCount,
                        limit: userLimit,
                        message: `You have already submitted ${userLimit} questions for ${panelist}. Please wait for the event to ask more questions.`
                    };
                }
            }
            
            // Check device-specific limit (3 questions total per artist per device)
            const deviceCount = getDeviceSubmissionCount(panelist);
            if (deviceCount >= deviceLimit) {
                return {
                    allowed: false,
                    type: 'device',
                    count: deviceCount,
                    limit: deviceLimit,
                    message: `This device has already submitted ${deviceLimit} questions for ${panelist}. Please wait for the live event to ask additional questions.`
                };
            }
            
            return {
                allowed: true,
                userCount: submitter ? getSubmissionCount(panelist, submitter) : 0,
                deviceCount: deviceCount,
                userRemaining: submitter ? Math.max(0, userLimit - getSubmissionCount(panelist, submitter)) : userLimit,
                deviceRemaining: Math.max(0, deviceLimit - deviceCount)
            };
        }

        // Success modal functions
        function showSuccessModal(panelistName) {
            successPanelistSpan.textContent = panelistName;
            successModal.classList.remove('hidden');
        }

        function closeSuccessModal() {
            successModal.classList.add('hidden');
        }

        function showRateLimitModal(panelistName, limitInfo) {
            // Create rate limit modal if it doesn't exist
            let rateLimitModal = document.getElementById('rateLimitModal');
            if (!rateLimitModal) {
                rateLimitModal = document.createElement('div');
                rateLimitModal.id = 'rateLimitModal';
                rateLimitModal.className = 'fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center p-4';
                rateLimitModal.innerHTML = `
                    <div class="bg-[#E3D6B8] text-[#482124] p-8 rounded-lg max-w-sm w-full mx-4 shadow-xl text-center">
                        <div class="mb-6">
                            <div class="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z"></path>
                                </svg>
                            </div>
                            <h3 class="text-2xl font-bold mb-2">Question Limit Reached</h3>
                            <p class="text-gray-700 rate-limit-message"></p>
                        </div>
                        
                        <button class="rate-limit-ok-btn bg-[#482124] text-[#E3D6B8] px-6 py-3 rounded-lg hover:bg-opacity-80 transition-colors font-semibold">
                            Got it
                        </button>
                    </div>
                `;
                document.body.appendChild(rateLimitModal);

                // Add click handlers
                const okBtn = rateLimitModal.querySelector('.rate-limit-ok-btn');
                okBtn.addEventListener('click', () => {
                    rateLimitModal.classList.add('hidden');
                });
                
                rateLimitModal.addEventListener('click', (e) => {
                    if (e.target === rateLimitModal) {
                        rateLimitModal.classList.add('hidden');
                    }
                });
            }

            // Update the message based on limit type
            const messageElement = rateLimitModal.querySelector('.rate-limit-message');
            messageElement.textContent = limitInfo.message;
            
            rateLimitModal.classList.remove('hidden');
        }

        // Success is now handled via integrated overlay on card back

        // Portal pattern variables for proper blur isolation
        let originalParent, originalNextSibling, placeholder;

        // Use event delegation for card clicks and form handling
        document.addEventListener('click', function(e) {
            // If there's a flipped card, check if click is outside it
            if (currentFlippedCard) {
                // Check if click is on the flipped card itself or its contents
                const clickedOnCard = e.target.closest('.card-container') === currentFlippedCard;
                const clickedOnFormElement = e.target.matches('input, textarea, button, .awesome-btn') || e.target.closest('.success-overlay');
                
                // If clicked outside the card (and not on form elements), close the card
                if (!clickedOnCard && !clickedOnFormElement) {
                    closeCard(currentFlippedCard);
                    return; // Prevent any other card from flipping
                }
                
                // If clicked on close button, close the card
                if (e.target.matches('.close-btn')) {
                    closeCard(currentFlippedCard);
                    return;
                }
                
                // If clicked inside the card or on form elements, do nothing (let it bubble)
                return;
            }
            
            // Only flip cards if no card is currently flipped
            // Check if clicked element is a guest card image, performer card image, hover overlay, or question indicator
            if (e.target.matches('.guest-card img') || e.target.matches('.performer-card img') || e.target.matches('.hover-overlay') || e.target.matches('.question-indicator')) {
                const cardContainer = e.target.closest('.card-container');
                if (cardContainer && !currentFlippedCard) {
                    let isBottomHalf;
                    
                    if (e.target.matches('.hover-overlay')) {
                        // Hover overlay is at bottom of image, so always trigger "bottom half" behavior (forward flip)
                        isBottomHalf = true;
                    } else if (e.target.matches('.question-indicator')) {
                        // Question indicator is at top-right of image, so always trigger "top half" behavior (backward flip)
                        isBottomHalf = false;
                    } else {
                        // Original image click detection
                        const imageRect = e.target.getBoundingClientRect();
                        const clickY = e.clientY - imageRect.top;
                        const imageHeight = imageRect.height;
                        isBottomHalf = clickY > imageHeight / 2;
                    }
                    
                    // Apply portal pattern for proper blur isolation
                    const rect = cardContainer.getBoundingClientRect();
                    originalParent = cardContainer.parentNode;
                    originalNextSibling = cardContainer.nextSibling;
                    
                    // Create placeholder to maintain layout space
                    placeholder = document.createElement('div');
                    placeholder.style.width = rect.width + 'px';
                    placeholder.style.height = rect.height + 'px';
                    placeholder.style.visibility = 'hidden';
                    placeholder.className = 'card-placeholder';
                    
                    // Insert placeholder before moving card
                    originalParent.insertBefore(placeholder, cardContainer);
                    
                    // Set fixed positioning to maintain visual location
                    cardContainer.style.position = 'fixed';
                    cardContainer.style.top = rect.top + 'px';
                    cardContainer.style.left = rect.left + 'px';
                    cardContainer.style.width = rect.width + 'px';
                    cardContainer.style.height = rect.height + 'px';
                    cardContainer.style.zIndex = '9999';
                    
                    // Move to body for DOM isolation from blur
                    document.body.appendChild(cardContainer);
                    
                    // Prevent page scrolling while card is flipped
                    document.body.style.overflow = 'hidden';
                    
                    // Deactivate project overlay feature when flipping card
                    if (isProjectOverlayActive) {
                        isProjectOverlayActive = false;
                        hideAllProjectOverlays();
                    }

                    // Add slight delay to ensure positioning is set before flip animation
                    requestAnimationFrame(() => {
                        // Flip the card and blur background
                        if (isBottomHalf) {
                            cardContainer.classList.add('flipped-reverse');
                        } else {
                            cardContainer.classList.add('flipped');
                        }
                        currentFlippedCard = cardContainer;
                        document.body.classList.add('page-blurred');
                    });
                }
            }
        });

        // Function to properly close a card using portal pattern
        function closeCard(cardContainer) {
            // Add closing class to delay hover overlay
            cardContainer.classList.add('closing');

            // Deactivate project overlay feature when closing card
            if (isProjectOverlayActive) {
                isProjectOverlayActive = false;
                hideAllProjectOverlays();
            }

            // Remove flip and blur
            cardContainer.classList.remove('flipped', 'flipped-reverse');
            currentFlippedCard = null;
            document.body.classList.remove('page-blurred');
            
            // Restore page scrolling
            document.body.style.overflow = '';
            
            // Restore original positioning
            cardContainer.style.position = '';
            cardContainer.style.top = '';
            cardContainer.style.left = '';
            cardContainer.style.width = '';
            cardContainer.style.height = '';
            cardContainer.style.zIndex = '';
            
            // Remove placeholder and restore card to original position
            if (placeholder && placeholder.parentNode) {
                if (originalNextSibling) {
                    originalParent.insertBefore(cardContainer, originalNextSibling);
                } else {
                    originalParent.appendChild(cardContainer);
                }
                placeholder.remove();
                placeholder = null;
            } else {
                // Fallback: restore to original position
                if (originalNextSibling) {
                    originalParent.insertBefore(cardContainer, originalNextSibling);
                } else {
                    originalParent.appendChild(cardContainer);
                }
            }
            
            // Reset form and remove any overlay
            const form = cardContainer.querySelector('.question-form');
            if (form) form.reset();
            const overlay = cardContainer.querySelector('.success-overlay');
            if (overlay) overlay.remove();
            
            // Remove closing class after delay to allow hover overlay to work again
            setTimeout(() => {
                cardContainer.classList.remove('closing');
            }, 800);
        }

        // Listen for custom closeCard events from success overlay
        document.addEventListener('closeCard', function(e) {
            const cardContainer = e.detail.cardContainer;
            if (cardContainer) {
                closeCard(cardContainer);
            }
        });

        // Handle form submissions
        document.addEventListener('submit', async function(e) {
            if (e.target.matches('.question-form')) {
                e.preventDefault();
                
                const form = e.target;
                const submitBtn = form.querySelector('.submit-btn');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Submitting...';
                submitBtn.disabled = true;
                
                const formData = new FormData(form);
                const panelist = form.getAttribute('data-guest-name');
                const question = formData.get('question');
                const submitter = formData.get('submitter') || 'Anonymous';
                const email = formData.get('email') || '';
                
                // Check if already at limit using localStorage
                const storedQuestions = getStoredQuestions(panelist);
                if (storedQuestions.length >= 2) {
                    // This shouldn't happen with proper UI, but safety check
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    return;
                }
                
                // Save question to localStorage first
                const questionData = { question, submitter, email };
                const savedQuestion = saveQuestionToStorage(panelist, questionData);
                
                // Submit to Google Sheet
                try {
                    const baseUrl = 'https://script.google.com/macros/s/AKfycbyQ6ieJ4962J7_fm-WC-0hj-oqZtgJN0mBcrfzYVsTiIVF7uXiFNT5cIU9vwL2Zj0naCQ/exec';
                    const params = new URLSearchParams({
                        panelist: panelist,
                        question: question,
                        submitter: submitter,
                        email: email,
                        questionId: savedQuestion.id // Add for future deletion capability
                    });
                    const fullUrl = baseUrl + '?' + params.toString();
                    
                    await fetch(fullUrl, {
                        method: 'GET',
                        mode: 'no-cors'
                    });
                    
                    // Update legacy rate limiting counters for compatibility
                    incrementSubmissionCount(panelist, submitter);
                    incrementDeviceSubmissionCount(panelist);
                    
                    // Clear draft since submission was successful
                    clearDraft(panelist);
                    
                    // Re-render card back with updated state
                    const cardContainer = form.closest('.card-container');
                    if (cardContainer) {
                        const cardBack = cardContainer.querySelector('.card-back');
                        if (cardBack) {
                            cardBack.innerHTML = renderCardBack(panelist);
                            refreshLucideIcons();
                        }
                        // Update question indicator on front of card
                        updateQuestionIndicator(cardContainer, panelist);
                        showSuccessOverlay(cardContainer, panelist);
                    }
                    
                } catch (error) {
                    // Even if there's an error, the submission likely worked
                    incrementSubmissionCount(panelist, submitter);
                    incrementDeviceSubmissionCount(panelist);
                    
                    const cardContainer = form.closest('.card-container');
                    if (cardContainer) {
                        // Re-render card back to show updated state
                        const cardBack = cardContainer.querySelector('.card-back');
                        if (cardBack) {
                            cardBack.innerHTML = renderCardBack(panelist);
                            refreshLucideIcons();
                        }
                        // Update question indicator on front of card
                        updateQuestionIndicator(cardContainer, panelist);
                        showSuccessOverlay(cardContainer, panelist);
                        form.reset();
                    }
                } finally {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            }
        });

        // Auto-save draft functionality and character counter
        document.addEventListener('input', function(e) {
            if (e.target.matches('.question-form input, .question-form textarea')) {
                const form = e.target.closest('.question-form');
                if (form) {
                    const panelist = form.getAttribute('data-guest-name');
                    const formData = new FormData(form);
                    const draftData = {
                        question: formData.get('question') || '',
                        submitter: formData.get('submitter') || '',
                        email: formData.get('email') || ''
                    };
                    saveDraft(panelist, draftData);
                }
            }
            
            // Character counter functionality
            if (e.target.matches('textarea[name="question"]')) {
                updateCharacterCounter(e.target);
            }
        });

        function updateCharacterCounter(textarea) {
            const container = textarea.closest('.textarea-container');
            if (!container) return;
            
            const counter = container.querySelector('.character-counter');
            if (!counter) return;
            
            const count = textarea.value.length;
            const charCount = counter.querySelector('.char-count');
            
            if (charCount) {
                charCount.textContent = count;
                
                // Remove existing classes
                counter.classList.remove('warning', 'critical');
                
                // Add appropriate class based on count
                if (count >= 100 && count < 130) {
                    counter.classList.add('warning');
                } else if (count >= 130) {
                    counter.classList.add('critical');
                }
            }
        }

        // Delete question functionality
        document.addEventListener('click', function(e) {
            if (e.target.matches('.question-delete-btn')) {
                e.preventDefault();
                const questionId = e.target.getAttribute('data-question-id');
                const panelist = e.target.getAttribute('data-panelist');
                const questionItem = e.target.closest('.question-item');
                
                // Show delete confirmation overlay
                showDeleteConfirmation(questionItem, questionId, panelist);
            }
            
            // Handle delete confirmation buttons
            if (e.target.matches('.delete-confirm-btn')) {
                const overlay = e.target.closest('.delete-confirmation-overlay');
                const questionItem = overlay.parentElement;
                const questionId = overlay.getAttribute('data-question-id');
                const panelist = overlay.getAttribute('data-panelist');
                
                // Remove from localStorage
                removeQuestionFromStorage(panelist, questionId);
                
                // Re-render card back
                const cardContainer = questionItem.closest('.card-container');
                if (cardContainer) {
                    const cardBack = cardContainer.querySelector('.card-back');
                    if (cardBack) {
                        cardBack.innerHTML = renderCardBack(panelist);
                    }
                    // Update question indicator on front of card
                    updateQuestionIndicator(cardContainer, panelist);
                }
                
                // TODO: Call Google Apps Script to delete from sheet
                deleteQuestionFromSheet(questionId, panelist);
            }
            
            if (e.target.matches('.delete-cancel-btn')) {
                const overlay = e.target.closest('.delete-confirmation-overlay');
                overlay.remove();
            }
        });

        function showDeleteConfirmation(questionItem, questionId, panelist) {
            // Remove any existing overlay
            const existingOverlay = questionItem.querySelector('.delete-confirmation-overlay');
            if (existingOverlay) existingOverlay.remove();
            
            const overlay = document.createElement('div');
            overlay.className = 'delete-confirmation-overlay';
            overlay.setAttribute('data-question-id', questionId);
            overlay.setAttribute('data-panelist', panelist);
            overlay.innerHTML = `
                <p class="delete-confirmation-text">Delete this question?</p>
                <div class="delete-confirmation-buttons">
                    <button class="delete-confirm-btn">Delete</button>
                    <button class="delete-cancel-btn">Cancel</button>
                </div>
            `;
            
            questionItem.appendChild(overlay);
        }

        function deleteQuestionFromSheet(questionId, panelist) {
            // Call Google Apps Script delete endpoint
            try {
                const baseUrl = 'https://script.google.com/macros/s/AKfycbyQ6ieJ4962J7_fm-WC-0hj-oqZtgJN0mBcrfzYVsTiIVF7uXiFNT5cIU9vwL2Zj0naCQ/exec';
                const deleteUrl = `${baseUrl}?action=delete&questionId=${encodeURIComponent(questionId)}&panelist=${encodeURIComponent(panelist)}`;
                
                fetch(deleteUrl, {
                    method: 'GET',
                    mode: 'no-cors'
                }).then(() => {
                    if (DEBUG_MODE) console.log('Delete request sent to Google Sheet for:', questionId);
                                  }).catch(error => {
                      if (DEBUG_MODE) console.error('Error deleting from sheet:', error);
                });
                
            } catch (error) {
                if (DEBUG_MODE) console.error('Error calling delete endpoint:', error);
            }
        }
    }

    // Show success overlay on card back
    function showSuccessOverlay(cardContainer, panelist) {
        const cardBack = cardContainer.querySelector('.card-back');
        if (!cardBack) return;
        
        // Remove any existing overlay
        const existingOverlay = cardBack.querySelector('.success-overlay');
        if (existingOverlay) existingOverlay.remove();
        
        // Determine if this is a performer card for responsive button sizing
        const isPerformerCard = cardContainer.querySelector('.performer-card') !== null;
        
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'success-overlay';
        overlay.innerHTML = `
            <div class="success-content">
                <h3>Question Submitted!</h3>
                <p>Thanks for your question for ${panelist.split(' ')[0]}!</p>
                <button class="awesome-btn ${isPerformerCard ? 'performer-awesome-btn' : ''}" onclick="closeSuccessOverlay(this)">Awesome!</button>
            </div>
        `;
        
        cardBack.appendChild(overlay);
    }

    // Close success overlay and card using portal pattern
    window.closeSuccessOverlay = function(button) {
        const cardContainer = button.closest('.card-container');
        if (cardContainer && cardContainer === currentFlippedCard) {
            // Find the closeCard function through the event system
            const closeEvent = new CustomEvent('closeCard', { detail: { cardContainer } });
            document.dispatchEvent(closeEvent);
        }
    };

    // Setup question form
    setupQuestionForm();

    // Admin function for clearing localStorage (for testing)
    // Press Ctrl+Shift+C to clear all question limits
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'C') {
            const questionKeys = Object.keys(localStorage).filter(key => key.startsWith('tomcon_questions_'));
            const deviceKeys = Object.keys(localStorage).filter(key => key.startsWith('tomcon_device_'));
            const allKeys = [...questionKeys, ...deviceKeys];
            
            allKeys.forEach(key => localStorage.removeItem(key));
            
            if (allKeys.length > 0) {
                alert(`Cleared ${questionKeys.length} user limit(s) and ${deviceKeys.length} device limit(s) for testing!`);
            } else {
                alert('No question limits found to clear.');
            }
        }
    });

    // Keyboard Navigation System
    function initializeKeyboardNavigation() {
        // Define all card grids and their section headings
        const sections = [
            {
                heading: document.querySelector('#moderators h2'),
                grid: document.getElementById('moderator-grid')
            },
            {
                heading: document.querySelector('#performers h2'),
                grid: document.getElementById('performer-grid')
            },
            {
                heading: document.querySelector('#featured-guests h2'),
                grid: document.getElementById('guest-grid')
            },
            {
                heading: document.querySelector('#staff h2'),
                grid: document.getElementById('staff-grid')
            }
        ];

        // Debug: Log section detection
        // console.log('Sections initialized:', sections.map(s => ({
        //     heading: s.heading ? s.heading.textContent : 'null',
        //     gridId: s.grid ? s.grid.id : 'null'
        // })));

        // Get all navigable elements (cards, section headings, and day headings within performers)
        function getAllNavigableElements() {
            const elements = [];

            sections.forEach(section => {
                if (section.heading) elements.push(section.heading);
                if (section.grid) {
                    // Special handling for performers section with day containers
                    if (section.grid.id === 'performer-grid') {
                        // Get all day headings and cards within the performer section
                        const allChildren = section.grid.querySelectorAll('h3, .card-container');
                        allChildren.forEach(child => elements.push(child));
                    } else {
                        // Normal handling for other sections
                        const cards = section.grid.querySelectorAll('.card-container');
                        cards.forEach(card => elements.push(card));
                    }
                }
            });

            return elements;
        }

        // Find the currently visible element based on scroll position
        function findCurrentlyVisibleElement() {
            const elements = getAllNavigableElements();
            const viewportHeight = window.innerHeight;
            const viewportCenter = viewportHeight / 2;

            // Find elements that are visible in the viewport
            const visibleElements = elements.filter(element => {
                const rect = element.getBoundingClientRect();
                // Element is visible if any part of it is in the viewport
                return rect.bottom > 0 && rect.top < viewportHeight;
            });

            if (visibleElements.length === 0) return null;

            // Find the element closest to the center of the viewport
            let closestElement = visibleElements[0];
            let minDistance = Math.abs(viewportCenter - closestElement.getBoundingClientRect().top);

            visibleElements.forEach(element => {
                const rect = element.getBoundingClientRect();
                const distance = Math.abs(viewportCenter - rect.top);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestElement = element;
                }
            });

            return closestElement;
        }

        // Get current grid layout (columns)
        function getGridColumns(grid) {
            if (!grid) return 1;

            // Check if we're on mobile (sm breakpoint and below = 1 column)
            const isMobile = window.innerWidth < 640;
            const columns = isMobile ? 1 : 2;

            return columns;
        }

        // Find next card in vertical direction
        function findNextCard(currentCard, direction, columns) {
            // Find the grid container - it could be any of the specific grid IDs
            const grid = currentCard.closest('[id$="-grid"]');
            if (!grid) return null;


            // Special handling for performer grid with day containers
            if (grid.id === 'performer-grid') {
                return findNextPerformerCard(currentCard, direction);
            }

            // Normal handling for other grids
            const cards = Array.from(grid.querySelectorAll('.card-container'));
            const currentIndex = cards.indexOf(currentCard);


            if (currentIndex === -1) return null;

            const rows = Math.ceil(cards.length / columns);
            const currentRow = Math.floor(currentIndex / columns);
            const currentCol = currentIndex % columns;

            let nextRow, nextCol;

            if (direction === 'up') {
                nextRow = currentRow - 1;
                nextCol = currentCol;
            } else { // down
                nextRow = currentRow + 1;
                nextCol = currentCol;
            }

            // console.log('Calculated position:', {
            //     currentRow: currentRow,
            //     currentCol: currentCol,
            //     nextRow: nextRow,
            //     nextCol: nextCol,
            //     totalRows: rows,
            //     totalCards: cards.length,
            //     columns: columns
            // });

            // Check bounds
            if (nextRow < 0 || nextRow >= rows) {
                // console.log('Out of bounds, returning null');
                return null; // No card in this direction
            }

            const nextIndex = nextRow * columns + nextCol;
            // console.log('Calculated nextIndex:', nextIndex, 'cards.length:', cards.length);

            if (nextIndex >= cards.length) {
                // console.log('nextIndex exceeds cards length, returning null');
                return null;
            }

            const result = cards[nextIndex] || null;
            // console.log('Returning card at index:', nextIndex, result);
            return result;
        }

        // Special navigation for performer cards within day containers
        function findNextPerformerCard(currentCard, direction) {
            const grid = currentCard.closest('[id$="-grid"]');
            if (!grid || grid.id !== 'performer-grid') return null;

            // Find the day container that contains this card
            const dayContainer = currentCard.closest('.space-y-6');
            if (!dayContainer) return null;

            // Get all cards in the same day container
            const cardsInDay = Array.from(dayContainer.querySelectorAll('.card-container'));
            const currentIndex = cardsInDay.indexOf(currentCard);

            if (currentIndex === -1) return null;

            let nextIndex;
            if (direction === 'up') {
                nextIndex = currentIndex - 1;
            } else { // down
                nextIndex = currentIndex + 1;
            }

            // If there's a card in the same day container, return it
            if (nextIndex >= 0 && nextIndex < cardsInDay.length) {
                const result = cardsInDay[nextIndex];
                return result;
            }

            // No more cards in this day container, return null to trigger section navigation
            return null;
        }

        // Find section heading for navigation
        function findSectionHeading(card, direction) {
            // Find current section by grid ID instead of contains() method
            const grid = card.closest('[id$="-grid"]');
            if (!grid) return null;
            const currentSection = sections.find(section => section.grid && section.grid.id === grid.id);

            if (!currentSection) return null;

            // Special handling for performer section
            if (currentSection.grid.id === 'performer-grid') {
                const nextDayHeading = findNextDayHeading(card, direction);
                if (nextDayHeading) {
                    return nextDayHeading;
                }
                // No more day headings, fall through to section navigation
            }

            // Default section navigation
            const currentSectionIndex = sections.indexOf(currentSection);

            if (direction === 'up' && currentSectionIndex > 0) {
                const result = sections[currentSectionIndex - 1].heading;
                return result;
            } else if (direction === 'down' && currentSectionIndex < sections.length - 1) {
                const result = sections[currentSectionIndex + 1].heading;
                return result;
            } else if (direction === 'down' && currentSectionIndex === sections.length - 1) {
                // At the last section, wrap around to the first section
                const result = sections[0].heading;
                return result;
            } else if (direction === 'up' && currentSectionIndex === 0) {
                // At the first section, wrap around to the last section
                const result = sections[sections.length - 1].heading;
                return result;
            }

            return null;
        }

        // Find next day heading within performer section
        function findNextDayHeading(card, direction) {
            const grid = card.closest('[id$="-grid"]');
            if (!grid || grid.id !== 'performer-grid') return null;

            // Get all day headings in the performer grid (exclude performer names and question form headings)
            const dayHeadings = Array.from(grid.querySelectorAll('h3.text-2xl.font-bold.text-center.mb-6.mt-8'));

            const dayContainer = card.closest('.space-y-6');
            if (!dayContainer) return null;

            // Find the day heading that comes before this container
            const currentDayHeadingIndex = dayHeadings.findIndex(heading => {
                const nextElement = heading.nextElementSibling;
                return nextElement && nextElement.contains(card);
            });

            if (currentDayHeadingIndex === -1) return null;

            let nextDayHeadingIndex;
            if (direction === 'up') {
                nextDayHeadingIndex = currentDayHeadingIndex - 1;
            } else { // down
                nextDayHeadingIndex = currentDayHeadingIndex + 1;
            }

            // If there's another day heading in the performer section, return it
            if (nextDayHeadingIndex >= 0 && nextDayHeadingIndex < dayHeadings.length) {
                return dayHeadings[nextDayHeadingIndex];
            }

            // No more day headings in performer section
            return null;
        }

        // Fast scroll function - double speed compared to default smooth scroll
        function fastScrollToElement(element) {
            const elementRect = element.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const viewportWidth = window.innerWidth;

            // Calculate target scroll position (center the element)
            const targetY = window.scrollY + elementRect.top - (viewportHeight / 2) + (elementRect.height / 2);
            const targetX = window.scrollX + elementRect.left - (viewportWidth / 2) + (elementRect.width / 2);

            // Use requestAnimationFrame for smooth but fast scrolling
            const startY = window.scrollY;
            const startX = window.scrollX;
            const distanceY = targetY - startY;
            const distanceX = targetX - startX;

            // Fast duration (half of typical smooth scroll)
            const duration = 150; // milliseconds
            const startTime = performance.now();

            function scrollStep(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Easing function for smooth acceleration/deceleration
                const easeInOutCubic = progress < 0.5
                    ? 4 * progress * progress * progress
                    : 1 - Math.pow(-2 * progress + 2, 3) / 2;

                window.scrollTo(
                    startX + distanceX * easeInOutCubic,
                    startY + distanceY * easeInOutCubic
                );

                if (progress < 1) {
                    requestAnimationFrame(scrollStep);
                }
            }

            requestAnimationFrame(scrollStep);
        }

        // Navigate to next element
        function navigateToElement(element, direction) {
            // Remove focus from current element
            if (currentFocusedCard) {
                currentFocusedCard.classList.remove('keyboard-focus');
            }

            if (element) {
                // Add focus to new element
                currentFocusedCard = element;
                element.classList.add('keyboard-focus');

                // Fast scroll element into view (double speed)
                fastScrollToElement(element);

                // If it's a heading, focus it for screen readers
                if (element.tagName === 'H2') {
                    element.focus();
                }
            } else {
                // Clear focus if no element
                currentFocusedCard = null;
            }
        }

        // Handle keyboard navigation
        function handleKeyboardNavigation(event) {
            // Only handle if not typing in a form
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
                return;
            }

            const key = event.key.toLowerCase();

            // Enable navigation on first key press
            if (!isKeyboardNavigationEnabled && (key === 'arrowup' || key === 'arrowdown' || key === 'w' || key === 's')) {
                isKeyboardNavigationEnabled = true;

                // Check if current focused element is still visible
                let shouldUpdateFocus = false;
                if (currentFocusedCard) {
                    const rect = currentFocusedCard.getBoundingClientRect();
                    const isVisible = rect.bottom > 0 && rect.top < window.innerHeight;
                    if (!isVisible) {
                        shouldUpdateFocus = true;
                    }
                } else {
                    shouldUpdateFocus = true;
                }

                // Update focus to currently visible element if needed
                if (shouldUpdateFocus) {
                    const visibleElement = findCurrentlyVisibleElement();
                    if (visibleElement) {
                        navigateToElement(visibleElement, null);
                    } else {
                        // Fallback to first element if no visible element found
                        const allElements = getAllNavigableElements();
                        if (allElements.length > 0) {
                            navigateToElement(allElements[0], null);
                        }
                    }
                }
                event.preventDefault();
                return;
            }

            // Handle navigation keys
            if (isKeyboardNavigationEnabled && (key === 'arrowup' || key === 'arrowdown' || key === 'w' || key === 's')) {
                event.preventDefault();

                if (!currentFocusedCard) return;

                let nextElement = null;
                const direction = (key === 'arrowup' || key === 'w') ? 'up' : 'down';

                // Debug logging (remove in production)
                // console.log('Navigation:', {
                //     currentElement: currentFocusedCard,
                //     direction: direction,
                //     currentElementType: currentFocusedCard.tagName || currentFocusedCard.className
                // });

                // If current element is a heading, navigate to next section (not back to cards)
                if (currentFocusedCard.tagName === 'H2') {
                    // Always go to the next section when navigating from a section heading
                    nextElement = findSectionHeading(currentFocusedCard, direction);

                    // If no next section found, go to the first card in the current section
                    if (!nextElement) {
                        const section = sections.find(s => s.heading === currentFocusedCard);
                        if (section && section.grid) {
                            const cards = section.grid.querySelectorAll('.card-container');
                            if (cards.length > 0) {
                                nextElement = direction === 'down' ? cards[0] : cards[cards.length - 1];
                            }
                        }
                    }
                }
                // Handle H3 day headings in performer section
                else if (currentFocusedCard.tagName === 'H3') {
                    // For day headings, navigate to the first card in that day's section
                    const grid = currentFocusedCard.closest('[id$="-grid"]');
                    if (grid && grid.id === 'performer-grid') {
                        // Find the day container that follows this heading
                        const dayContainer = currentFocusedCard.nextElementSibling;
                        if (dayContainer && dayContainer.classList.contains('space-y-6')) {
                            const firstCard = dayContainer.querySelector('.card-container');
                            if (firstCard) {
                                nextElement = firstCard;
                            }
                        }
                    }

                    // If we can't find a card in the day section, fall back to section navigation
                    if (!nextElement) {
                        nextElement = findSectionHeading(currentFocusedCard, direction);
                    }
                }
                // If current element is a card, navigate to next card or section heading
                else if (currentFocusedCard.classList.contains('card-container')) {
                    const grid = currentFocusedCard.closest('[id$="-grid"]');
                    if (!grid) return;

                    const columns = getGridColumns(grid);
                    nextElement = findNextCard(currentFocusedCard, direction, columns);

                    // If no card in current direction, go directly to next section
                    if (!nextElement) {
                        nextElement = findSectionHeading(currentFocusedCard, direction);
                    }
                }


                if (nextElement) {
                    navigateToElement(nextElement, direction);
                }
            }

            // Handle Escape key to exit keyboard navigation
            if (key === 'escape' && isKeyboardNavigationEnabled) {
                if (currentFocusedCard) {
                    currentFocusedCard.classList.remove('keyboard-focus');
                }
                currentFocusedCard = null;
                isKeyboardNavigationEnabled = false;
            }

            // Handle B key to toggle project overlay feature
            if (key === 'b' && !isAnyCardFlipped()) {
                event.preventDefault();
                toggleProjectOverlays();
            }
        }

        // Add keyboard event listener
        document.addEventListener('keydown', handleKeyboardNavigation);

        // Handle clicks to disable keyboard navigation mode
        document.addEventListener('click', () => {
            if (isKeyboardNavigationEnabled) {
                if (currentFocusedCard) {
                    currentFocusedCard.classList.remove('keyboard-focus');
                }
                currentFocusedCard = null;
                isKeyboardNavigationEnabled = false;
            }
        });

        // Handle window resize to update grid layout awareness
        window.addEventListener('resize', () => {
            // Recalculate navigation if needed
            if (isKeyboardNavigationEnabled && currentFocusedCard) {
                // Keep current focus but ensure it's still valid
                const allElements = getAllNavigableElements();
                if (!allElements.includes(currentFocusedCard)) {
                    currentFocusedCard.classList.remove('keyboard-focus');
                    currentFocusedCard = null;
                }
            }
        });

        // Handle scroll events to update navigation context
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            // Debounce scroll events
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                if (isKeyboardNavigationEnabled) {
                    // Check if current focused element is still visible
                    let shouldUpdateFocus = false;
                    if (currentFocusedCard) {
                        const rect = currentFocusedCard.getBoundingClientRect();
                        const isVisible = rect.bottom > 0 && rect.top < window.innerHeight;
                        if (!isVisible) {
                            shouldUpdateFocus = true;
                        }
                    } else {
                        shouldUpdateFocus = true;
                    }

                    // Update focus to currently visible element if needed
                    if (shouldUpdateFocus) {
                        const visibleElement = findCurrentlyVisibleElement();
                        if (visibleElement && visibleElement !== currentFocusedCard) {
                            navigateToElement(visibleElement, null);
                        }
                    }
                }
            }, 150); // 150ms debounce
        });
    }

    // Initialize keyboard navigation
    initializeKeyboardNavigation();

    // Countdown timer for sticky header
    const countdownEl = document.getElementById('countdown');
    if (countdownEl) {
        const eventDate = new Date('2025-10-24T11:00:00-07:00'); // PDT
        function updateCountdown() {
            const now = new Date();
            const diff = eventDate - now;
            if (diff > 0) {
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((diff / (1000 * 60)) % 60);
                countdownEl.textContent = `${days}d ${hours}h ${minutes}m until TOM CON`;
            } else {
                countdownEl.textContent = 'TOM CON is happening now!';
            }
        }
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }
});

// Function to refresh Lucide icons after dynamic content changes
function refreshLucideIcons() {
    createIcons({
        icons: {
            Facebook,
            Instagram,
            Youtube
        }
    });
}
