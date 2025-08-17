import { guests } from './guests.js';

// DEBUG MODE: Set to true to disable lazy loading and see placeholders
const DEBUG_MODE = false;

// Global variables for card state management
let currentFlippedCard = null;

document.addEventListener('DOMContentLoaded', () => {
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

    // Lazy loading state
    let lazyLoadingEnabled = false;
    let imagesLoaded = new Set();
    let loadingStartTimes = new Map();

    function renderGuests(list, grid, enableLazyLoading = false) {
        if (!grid) return;
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
                    const firstName = guest.name === 'Us Kids All-Stars' ? 'Us Kids All-Stars' : guest.name.split(' ')[0];
                    // Create placeholder with container-based rounded corners
                    imageHtml = `<div class="w-full mb-4" style="border-radius: 1em 1em 0 0; overflow: hidden;">
                        <div class="w-full bg-gray-900 flex items-center justify-center lazy-image-placeholder" style="aspect-ratio: 2 / 3; ${DEBUG_MODE ? 'border: 3px solid red;' : ''}" data-src="${guest.imageUrl}" data-alt="${guest.name}">
                            <span class="text-gray-500">Loading ${firstName}...${DEBUG_MODE ? ' (DEBUG MODE)' : ''}</span>
                        </div>
                    </div>`;
                } else {
                    // Load image immediately for moderators
                imageHtml = `<img src="${guest.imageUrl}" alt="${guest.name}" class="w-full shadow-lg mb-4">`;
                }
            } else {
                 imageHtml = `<div class="w-full shadow-lg mb-4 bg-gray-900 flex items-center justify-center" style="aspect-ratio: 2 / 3;">
                    <span class="text-gray-500">Image Coming Soon</span>
                 </div>`;
            }

            // Check if guest has questions
            const guestQuestions = getGuestQuestions(guest.name);
            const questionCount = guestQuestions.length;
            const firstName = guest.name.split(' ')[0];
            const hoverText = questionCount >= 2 ? 
                `Edit or delete your questions for ${firstName}` : 
                `Ask ${firstName} a question to be considered during the Audience Q&A`;
            
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
            grid.appendChild(cardContainer);
        });
    }

    // Function to render performers with responsive images, grouped by day
    function renderPerformers(list, grid) {
        if (!grid) return;
        
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
                        const firstName = performer.name === 'Us Kids All-Stars' ? 'Us Kids All-Stars' : performer.name.split(' ')[0];
                        imageHtml = `<div class="performer-placeholder w-full mb-4">
                            <span class="text-gray-500">Loading ${firstName}...</span>
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
                    cardBack.innerHTML = renderCardBack(performer.name);
                    
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
                            // Create new img element and replace the placeholder
                            const newImg = document.createElement('img');
                            newImg.src = src;
                            newImg.alt = alt;
                            newImg.className = 'w-full shadow-lg mb-4';
                            placeholder.parentNode.replaceChild(newImg, placeholder);
                            imagesLoaded.add(src);
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
                            placeholder.innerHTML = `<div class="w-full shadow-lg mb-4 bg-gray-900 flex items-center justify-center" style="aspect-ratio: 2 / 3;">
                                <span class="text-gray-500">Image Error</span>
                            </div>`;
                            placeholder.className = 'w-full shadow-lg mb-4 bg-gray-900 flex items-center justify-center';
                            imagesLoaded.add(src);
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
    renderGuests(moderators, moderatorGrid, false);
    
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
                    const firstName = guestName.split(' ')[0];
                    const guestHoverText = questionCount >= 2 ? 
                        `Edit or delete your questions for ${firstName}` : 
                        `Ask ${firstName} a question to be considered during the Audience Q&A`;
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
    function renderCardBack(guestName) {
        const firstName = guestName.split(' ')[0];
        const storedQuestions = getStoredQuestions(guestName);
        const questionCount = storedQuestions.length;
        const draft = getDraft(guestName);
        
        let content = `
            <button class="close-btn" aria-label="Close">&times;</button>
            <h3>Ask ${firstName} a Question</h3>
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
                    <p class="email-description">Adding your email above will allow ${firstName} to respond to you in case your question doesn't get addressed during the event.</p>
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
                    <p class="email-description">Adding your email above will allow ${firstName} to respond to you in case your question doesn't get addressed during the event.</p>
                    <div class="form-buttons">
                        <button type="submit" class="submit-btn">Submit Question</button>
                    </div>
                </form>
                
                <div class="question-divider">
                    <p class="question-status-text">You have 1 question for ${firstName}:</p>
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
                    <p class="question-status-text">You've reached the limit (2/2 questions for ${firstName}):</p>
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

    lucide.createIcons();

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
                const seconds = Math.floor((diff / 1000) % 60);
                countdownEl.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s left until TOM CON`;
            } else {
                countdownEl.textContent = 'TOM CON is happening now!';
            }
        }
        updateCountdown();
        setInterval(updateCountdown, 1000);
    
        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
});

// Function to refresh Lucide icons after dynamic content changes
function refreshLucideIcons() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}
