// Translation System
(function() {
    'use strict';

    const LANGUAGE_KEY = 'preferredLanguage';
    const DEFAULT_LANGUAGE = 'de';
    const SUPPORTED_LANGUAGES = ['de', 'en', 'ua', 'ru'];
    const loadedLanguages = new Set(); // Track which languages have been loaded

    // Dynamically load translation file for a specific language
    function loadTranslation(lang) {
        return new Promise((resolve, reject) => {
            try {
                // Check if already loaded
                if (window.translations && window.translations[lang]) {
                    loadedLanguages.add(lang);
                    resolve();
                    return;
                }

                // Check if script is already being loaded
                const existingScript = document.querySelector(`script[data-lang="${lang}"]`);
                if (existingScript) {
                    // Wait for it to load
                    let timeoutId;
                    const checkInterval = setInterval(() => {
                        try {
                            if (window.translations && window.translations[lang]) {
                                clearInterval(checkInterval);
                                if (timeoutId) clearTimeout(timeoutId);
                                loadedLanguages.add(lang);
                                resolve();
                            }
                        } catch (e) {
                            clearInterval(checkInterval);
                            if (timeoutId) clearTimeout(timeoutId);
                            console.error('Error checking translation load:', e);
                            reject(e);
                        }
                    }, 50);
                    
                    const errorHandler = () => {
                        clearInterval(checkInterval);
                        if (timeoutId) clearTimeout(timeoutId);
                        reject(new Error(`Failed to load translations for ${lang}`));
                    };
                    
                    existingScript.addEventListener('error', errorHandler);
                    
                    // Timeout after 5 seconds
                    timeoutId = setTimeout(() => {
                        clearInterval(checkInterval);
                        if (!window.translations || !window.translations[lang]) {
                            reject(new Error(`Timeout loading translations for ${lang}`));
                        }
                    }, 5000);
                    return;
                }

                // Create and load script
                const script = document.createElement('script');
                script.src = `translations-${lang}.js`;
                script.async = true;
                script.setAttribute('data-lang', lang);
                
                script.onload = () => {
                    try {
                        // Verify it's actually loaded
                        if (window.translations && window.translations[lang]) {
                            loadedLanguages.add(lang);
                            resolve();
                        } else {
                            reject(new Error(`Translations for ${lang} not found after script load`));
                        }
                    } catch (e) {
                        console.error('Error in translation load handler:', e);
                        reject(e);
                    }
                };
                
                script.onerror = () => {
                    console.error(`Failed to load translations for ${lang}`);
                    reject(new Error(`Failed to load translations for ${lang}`));
                };
                
                document.head.appendChild(script);
            } catch (e) {
                console.error('Error in loadTranslation:', e);
                reject(e);
            }
        });
    }

    // Get current language from localStorage or browser preference
    function getCurrentLanguage() {
        // Check localStorage first
        const saved = localStorage.getItem(LANGUAGE_KEY);
        if (saved && SUPPORTED_LANGUAGES.includes(saved)) {
            return saved;
        }

        // Try to detect from browser
        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang) {
            const langCode = browserLang.split('-')[0].toLowerCase();
            if (SUPPORTED_LANGUAGES.includes(langCode)) {
                return langCode;
            }
            // Special handling for German variants (de-AT, de-CH, etc.)
            if (langCode === 'de' || browserLang.toLowerCase().startsWith('de')) {
                return 'de';
            }
        }

        return DEFAULT_LANGUAGE;
    }

    // Show loading indicator
    function showLoadingIndicator() {
        let loader = document.getElementById('language-loading-indicator');
        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'language-loading-indicator';
            loader.className = 'language-loading-indicator';
            loader.setAttribute('aria-live', 'polite');
            loader.setAttribute('aria-label', 'Loading language');
            document.body.appendChild(loader);
        }
        loader.classList.add('show');
    }

    // Hide loading indicator
    function hideLoadingIndicator() {
        const loader = document.getElementById('language-loading-indicator');
        if (loader) {
            loader.classList.remove('show');
        }
    }

    // Set language and save to localStorage
    function setLanguage(lang) {
        if (!SUPPORTED_LANGUAGES.includes(lang)) {
            lang = DEFAULT_LANGUAGE;
        }
        localStorage.setItem(LANGUAGE_KEY, lang);
        
        // Show loading indicator
        showLoadingIndicator();
        
        // Load translation if not already loaded
        loadTranslation(lang).then(() => {
            translatePage(lang);
            updateHTMLAttributes(lang);
            hideLoadingIndicator();
        }).catch(() => {
            // Fallback to default language if loading fails
            if (lang !== DEFAULT_LANGUAGE) {
                loadTranslation(DEFAULT_LANGUAGE).then(() => {
                    translatePage(DEFAULT_LANGUAGE);
                    updateHTMLAttributes(DEFAULT_LANGUAGE);
                    hideLoadingIndicator();
                }).catch(() => {
                    hideLoadingIndicator();
                });
            } else {
                hideLoadingIndicator();
            }
        });
    }

    // Get translation text
    function getTranslation(key, lang) {
        if (!window.translations || !window.translations[lang]) {
            console.warn('Translations not loaded or language not found:', lang, key);
            return key;
        }

        const keys = key.split('.');
        let value = window.translations[lang];

        for (let i = 0; i < keys.length; i++) {
            if (value && typeof value === 'object' && keys[i] in value) {
                value = value[keys[i]];
            } else {
                // Fallback to default language (German) if translation not found
                if (lang !== DEFAULT_LANGUAGE) {
                    return getTranslation(key, DEFAULT_LANGUAGE);
                }
                // If default language also doesn't have it, try English as last resort
                if (lang !== 'en') {
                    return getTranslation(key, 'en');
                }
                return key;
            }
        }

        return typeof value === 'string' ? value : key;
    }

    // Translate a single element
    function translateElement(element, lang) {
        const key = element.getAttribute('data-translate');
        if (!key) return;

        const translation = getTranslation(key, lang);
        
        // Handle HTML content - check if translation contains any HTML tags
        // Use regex to detect HTML tags (anything between < and >)
        const hasHtmlTags = /<[^>]+>/.test(translation);
        
        if (hasHtmlTags) {
            element.innerHTML = translation;
            
            // Add lazy loading to images that are not in hero/above-the-fold
            const images = element.querySelectorAll('img');
            images.forEach(img => {
                // Check if image is in hero section or header
                const isAboveFold = img.closest('.hero, header, .logo-container');
                if (!isAboveFold && !img.hasAttribute('loading')) {
                    img.setAttribute('loading', 'lazy');
                }
            });
        } else {
            element.textContent = translation;
        }

        // Special handling for attributes
        if (element.tagName === 'META' && element.hasAttribute('name') && element.getAttribute('name') === 'description') {
            element.setAttribute('content', translation);
        }
        if (element.tagName === 'TITLE') {
            document.title = translation;
        }
        if (element.tagName === 'IMG' && element.hasAttribute('data-translate')) {
            element.setAttribute('alt', translation);
        }
    }

    // Translate entire page
    function translatePage(lang) {
        try {
            if (!window.translations) {
                console.warn('Translations not loaded, cannot translate page');
                return;
            }
            
            const elements = document.querySelectorAll('[data-translate]');
            elements.forEach(element => {
                try {
                    translateElement(element, lang);
                } catch (e) {
                    console.error('Error translating element:', e, element);
                }
            });
        } catch (e) {
            console.error('Error in translatePage:', e);
        }
    }

    // Update HTML lang attribute and meta tags
    function updateHTMLAttributes(lang) {
        document.documentElement.setAttribute('lang', lang);
        
        // Update meta description if it exists
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc && metaDesc.hasAttribute('data-translate')) {
            const key = metaDesc.getAttribute('data-translate');
            const translation = getTranslation(key, lang);
            metaDesc.setAttribute('content', translation);
        }
        
        // Update canonical URL
        const canonicalLink = document.getElementById('canonical-link');
        if (canonicalLink) {
            const currentPath = window.location.pathname;
            const fileName = currentPath.split('/').pop() || 'index.html';
            const baseDomain = 'https://praxis-saewska.de';
            canonicalLink.href = baseDomain + '/' + fileName + (lang !== 'de' ? `?lang=${lang}` : '');
        }
        
        // Update OG URL
        const ogUrl = document.getElementById('og-url');
        if (ogUrl) {
            const currentPath = window.location.pathname;
            const fileName = currentPath.split('/').pop() || 'index.html';
            const baseDomain = 'https://praxis-saewska.de';
            ogUrl.content = baseDomain + '/' + fileName + (lang !== 'de' ? `?lang=${lang}` : '');
        }
        
        // Update OG locale
        const ogLocale = document.getElementById('og-locale');
        if (ogLocale) {
            const localeMap = { de: 'de_DE', en: 'en_US', ru: 'ru_RU', ua: 'uk_UA' };
            ogLocale.content = localeMap[lang] || 'de_DE';
        }
        
        // Update OG title if it has data-translate
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle && ogTitle.hasAttribute('data-translate')) {
            const key = ogTitle.getAttribute('data-translate');
            const translation = getTranslation(key, lang);
            ogTitle.setAttribute('content', translation);
        }
        
        // Update OG description if it has data-translate
        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc && ogDesc.hasAttribute('data-translate')) {
            const key = ogDesc.getAttribute('data-translate');
            const translation = getTranslation(key, lang);
            ogDesc.setAttribute('content', translation);
        }
        
        // Update Twitter title if it has data-translate
        const twitterTitle = document.querySelector('meta[name="twitter:title"]');
        if (twitterTitle && twitterTitle.hasAttribute('data-translate')) {
            const key = twitterTitle.getAttribute('data-translate');
            const translation = getTranslation(key, lang);
            twitterTitle.setAttribute('content', translation);
        }
        
        // Update Twitter description if it has data-translate
        const twitterDesc = document.querySelector('meta[name="twitter:description"]');
        if (twitterDesc && twitterDesc.hasAttribute('data-translate')) {
            const key = twitterDesc.getAttribute('data-translate');
            const translation = getTranslation(key, lang);
            twitterDesc.setAttribute('content', translation);
        }
        
        // Update language selector value
        const langSelect = document.getElementById('language-select');
        if (langSelect) {
            langSelect.value = lang;
        }
    }

    // Initialize language switcher
    let langSelectHandler = null;
    function initLanguageSwitcher() {
        const langSelect = document.getElementById('language-select');
        if (langSelect) {
            const currentLang = getCurrentLanguage();
            langSelect.value = currentLang;

            // Remove existing listener if any
            if (langSelectHandler) {
                langSelect.removeEventListener('change', langSelectHandler);
            }

            // Add event listener
            langSelectHandler = function(e) {
                const selectedLang = e.target.value;
                setLanguage(selectedLang);
            };
            langSelect.addEventListener('change', langSelectHandler);
        }
    }

    // Initialize translation system
    function initTranslation() {
        try {
            const currentLang = getCurrentLanguage();
            
            // Load the current language translation
            loadTranslation(currentLang).then(() => {
                try {
                    translatePage(currentLang);
                    updateHTMLAttributes(currentLang);
                    initLanguageSwitcher();
                } catch (e) {
                    console.error('Error initializing translation:', e);
                    initLanguageSwitcher();
                }
            }).catch((error) => {
                console.error('Failed to load translation for', currentLang, error);
                // Fallback to default language if current language fails
                if (currentLang !== DEFAULT_LANGUAGE) {
                    loadTranslation(DEFAULT_LANGUAGE).then(() => {
                        try {
                            translatePage(DEFAULT_LANGUAGE);
                            updateHTMLAttributes(DEFAULT_LANGUAGE);
                            initLanguageSwitcher();
                        } catch (e) {
                            console.error('Error initializing default translation:', e);
                            initLanguageSwitcher();
                        }
                    }).catch((fallbackError) => {
                        console.error('Failed to load default language translations:', fallbackError);
                        initLanguageSwitcher();
                    });
                } else {
                    console.error('Failed to load default language translations');
                    initLanguageSwitcher();
                }
            });
        } catch (e) {
            console.error('Error in initTranslation:', e);
        }
    }

    // Make functions available globally
    window.translation = {
        setLanguage: setLanguage,
        getCurrentLanguage: getCurrentLanguage,
        translatePage: translatePage
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTranslation);
    } else {
        initTranslation();
    }
})();

// Cookie Consent Management
(function() {
    'use strict';

    const COOKIE_CONSENT_KEY = 'cookieConsent';
    const COOKIE_CONSENT_EXPIRY = 365; // days

    // Check if user has already given consent
    function hasConsent() {
        const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
        if (!consent) return null;
        
        try {
            const consentData = JSON.parse(consent);
            const expiryDate = new Date(consentData.expiry);
            if (expiryDate > new Date()) {
                return consentData.accepted;
            }
        } catch (e) {
            return null;
        }
        return null;
    }

    // Save consent preference
    function saveConsent(accepted) {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + COOKIE_CONSENT_EXPIRY);
        
        const consentData = {
            accepted: accepted,
            date: new Date().toISOString(),
            expiry: expiryDate.toISOString()
        };
        
        localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consentData));
    }

    // Show cookie banner
    function showCookieBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            // Add animation class
            setTimeout(() => {
                banner.classList.add('show');
            }, 100);
        }
    }

    // Hide cookie banner
    function hideCookieBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.classList.remove('show');
        }
    }

    // Show cookie settings modal
    function showCookieSettings() {
        const modal = document.getElementById('cookie-settings-modal');
        if (modal) {
            modal.classList.add('show');
            // Focus first interactive element
            const firstButton = modal.querySelector('button');
            if (firstButton) {
                setTimeout(() => firstButton.focus(), 100);
            }
        }
    }

    // Hide cookie settings modal
    function hideCookieSettings() {
        const modal = document.getElementById('cookie-settings-modal');
        if (modal) {
            modal.classList.remove('show');
        }
    }

    // Handle accept button
    function handleAccept() {
        saveConsent(true);
        hideCookieBanner();
        loadGoogleMaps(); // Load maps if on contact page
    }

    // Handle decline button
    function handleDecline() {
        saveConsent(false);
        hideCookieBanner();
    }

    // Handle settings button
    function handleSettings() {
        hideCookieBanner();
        showCookieSettings();
    }

    // Initialize cookie banner
    function initCookieBanner() {
        const consent = hasConsent();
        
        if (consent === null) {
            // No consent given yet, show banner
            showCookieBanner();
        } else if (consent === true) {
            // Consent given, load maps if on contact page
            loadGoogleMaps();
        }

        // Attach event listeners
        const acceptBtn = document.getElementById('cookie-accept');
        const declineBtn = document.getElementById('cookie-decline');
        const settingsBtn = document.getElementById('cookie-settings');
        const settingsModal = document.getElementById('cookie-settings-modal');
        
        if (acceptBtn) {
            acceptBtn.addEventListener('click', handleAccept);
        }
        
        if (declineBtn) {
            declineBtn.addEventListener('click', handleDecline);
        }
        
        if (settingsBtn) {
            settingsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                handleSettings();
            });
        }

        // Cookie settings modal handlers
        if (settingsModal) {
            const modalAccept = settingsModal.querySelector('#cookie-settings-accept');
            const modalDecline = settingsModal.querySelector('#cookie-settings-decline');
            const modalClose = settingsModal.querySelector('#cookie-settings-close');
            
            if (modalAccept) {
                modalAccept.addEventListener('click', () => {
                    handleAccept();
                    hideCookieSettings();
                });
            }
            
            if (modalDecline) {
                modalDecline.addEventListener('click', () => {
                    handleDecline();
                    hideCookieSettings();
                });
            }
            
            if (modalClose) {
                modalClose.addEventListener('click', hideCookieSettings);
            }
            
            // Close on Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && settingsModal.classList.contains('show')) {
                    hideCookieSettings();
                }
            });
            
            // Close on backdrop click
            settingsModal.addEventListener('click', (e) => {
                if (e.target === settingsModal) {
                    hideCookieSettings();
                }
            });
        }
    }

    // Load Google Maps (only after consent)
    function loadGoogleMaps() {
        const mapContainer = document.getElementById('google-map-container');
        const consentMessage = document.getElementById('map-consent-message');
        
        if (!mapContainer) return;
        
        const consent = hasConsent();
        if (consent === true) {
            // User has consented, load the map
            const mapIframe = mapContainer.querySelector('iframe');
            if (mapIframe && mapIframe.dataset.src) {
                mapIframe.src = mapIframe.dataset.src;
                mapIframe.removeAttribute('data-src');
            }
            
            if (consentMessage) {
                consentMessage.classList.add('hidden');
            }
        } else {
            // Show consent message
            if (consentMessage) {
                consentMessage.classList.remove('hidden');
            }
        }
    }

    // FAQ Accordion
    function initFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            
            if (question && answer) {
                const toggleFAQ = () => {
                    const isActive = item.classList.contains('active');
                    
                    // Close all items
                    faqItems.forEach(faqItem => {
                        faqItem.classList.remove('active');
                        const q = faqItem.querySelector('.faq-question');
                        const a = faqItem.querySelector('.faq-answer');
                        if (q) q.setAttribute('aria-expanded', 'false');
                        if (a) a.setAttribute('aria-hidden', 'true');
                    });
                    
                    // Open clicked item if it wasn't active
                    if (!isActive) {
                        item.classList.add('active');
                        question.setAttribute('aria-expanded', 'true');
                        answer.setAttribute('aria-hidden', 'false');
                    } else {
                        question.setAttribute('aria-expanded', 'false');
                        answer.setAttribute('aria-hidden', 'true');
                    }
                };
                
                // Click handler
                question.addEventListener('click', toggleFAQ);
                
                // Keyboard handler (Enter and Space)
                question.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleFAQ();
                    }
                });
                
                // Initialize aria attributes
                question.setAttribute('aria-expanded', 'false');
                answer.setAttribute('aria-hidden', 'true');
            }
        });
    }

    // Mobile Menu Toggle
    function initMobileMenu() {
        const menuToggle = document.getElementById('menu-toggle');
        const nav = document.querySelector('nav');
        
        if (menuToggle && nav) {
            // Create overlay if it doesn't exist
            let overlay = document.querySelector('.nav-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'nav-overlay';
                document.body.appendChild(overlay);
            }
            
            const toggleMenu = (open) => {
                const isOpen = nav.classList.contains('active');
                if (open === undefined) {
                    nav.classList.toggle('active');
                    overlay.classList.toggle('show');
                } else if (open) {
                    nav.classList.add('active');
                    overlay.classList.add('show');
                    // Prevent body scroll when menu is open
                    document.body.style.overflow = 'hidden';
                } else {
                    nav.classList.remove('active');
                    overlay.classList.remove('show');
                    // Restore body scroll
                    document.body.style.overflow = '';
                }
                
                const isNowOpen = nav.classList.contains('active');
                menuToggle.setAttribute('aria-expanded', isNowOpen.toString());
                
                // Focus management
                if (isNowOpen) {
                    // Focus first link when opening
                    const firstLink = nav.querySelector('a');
                    if (firstLink) {
                        setTimeout(() => firstLink.focus(), 100);
                    }
                } else {
                    // Return focus to toggle button when closing
                    menuToggle.focus();
                }
            };
            
            menuToggle.addEventListener('click', () => {
                toggleMenu();
            });
            
            // Close menu when clicking on overlay
            overlay.addEventListener('click', () => {
                toggleMenu(false);
            });
            
            // Close menu when clicking on a link
            const navLinks = nav.querySelectorAll('a');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    toggleMenu(false);
                });
            });
            
            // Close menu on Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && nav.classList.contains('active')) {
                    toggleMenu(false);
                }
            });
        }
    }

    // Smooth scrolling for anchor links
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Add lazy loading to images (except hero/above-the-fold)
    function initLazyLoading() {
        const images = document.querySelectorAll('img:not([loading])');
        images.forEach(img => {
            // Check if image is in hero section or header
            const isAboveFold = img.closest('.hero, header, .logo-container');
            if (!isAboveFold) {
                img.setAttribute('loading', 'lazy');
            }
        });
    }

    // Initialize everything when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initCookieBanner();
            initFAQ();
            initMobileMenu();
            initSmoothScroll();
            initLazyLoading();
        });
    } else {
        initCookieBanner();
        initFAQ();
        initMobileMenu();
        initSmoothScroll();
        initLazyLoading();
    }

    // Export functions for potential external use
    window.cookieConsent = {
        hasConsent: hasConsent,
        saveConsent: saveConsent,
        loadGoogleMaps: loadGoogleMaps
    };
})();

// Common Data Application
(function() {
    'use strict';

    function applyCommonData() {
        try {
            if (!window.commonData) {
                console.warn('commonData not available');
                return;
            }

            const { openingHours, contact } = window.commonData;

            // Apply opening hours using data-hours-day attribute
            if (openingHours) {
                document.querySelectorAll('[data-hours-day]').forEach(el => {
                    try {
                        const day = el.getAttribute('data-hours-day');
                        if (openingHours[day]) {
                            el.textContent = openingHours[day];
                        }
                    } catch (e) {
                        console.error('Error applying opening hours:', e, el);
                    }
                });
            }

            // Apply contact information
            if (contact) {
                try {
                    // Address
                    document.querySelectorAll('[data-translate="index.addressPlaceholder"], [data-translate="contact.addressValue"]').forEach(el => {
                        try {
                            el.innerHTML = contact.address;
                        } catch (e) {
                            console.error('Error applying address:', e, el);
                        }
                    });

                    // Phone
                    document.querySelectorAll('[data-translate="index.phonePlaceholder"], [data-translate="contact.phoneValue"]').forEach(el => {
                        try {
                            el.textContent = contact.phone;
                        } catch (e) {
                            console.error('Error applying phone:', e, el);
                        }
                    });

                    // Email
                    document.querySelectorAll('[data-translate="index.emailPlaceholder"], [data-translate="contact.emailValue"]').forEach(el => {
                        try {
                            el.textContent = contact.email;
                        } catch (e) {
                            console.error('Error applying email:', e, el);
                        }
                    });

                    // Email links
                    document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
                        try {
                            link.href = `mailto:${contact.email}`;
                            if (!link.querySelector('[data-translate]')) {
                                link.textContent = contact.email;
                            }
                        } catch (e) {
                            console.error('Error applying email link:', e, link);
                        }
                    });
                } catch (e) {
                    console.error('Error applying contact information:', e);
                }
            }
        } catch (e) {
            console.error('Error in applyCommonData:', e);
        }
    }

    function init() {
        const ready = () => setTimeout(applyCommonData, 100);
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', ready);
        } else {
            ready();
        }
    }

    // Re-apply after language change
    if (window.translation?.setLanguage) {
        const original = window.translation.setLanguage;
        window.translation.setLanguage = function(lang) {
            original.call(this, lang);
            setTimeout(applyCommonData, 200);
        };
    }

    init();
})();

// Service Worker Registration for PWA
(function() {
    'use strict';

    // Check if service workers are supported
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('service-worker.js')
                .then((registration) => {
                    console.log('[Service Worker] Registration successful:', registration.scope);

                    // Check for updates every hour
                    setInterval(() => {
                        registration.update();
                    }, 3600000); // 1 hour

                    // Handle updates
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                // New service worker available, notify user
                                console.log('[Service Worker] New version available');
                                // Optionally show a notification to the user
                                // You can add a UI notification here if needed
                            }
                        });
                    });
                })
                .catch((error) => {
                    console.error('[Service Worker] Registration failed:', error);
                });

            // Listen for messages from service worker
            navigator.serviceWorker.addEventListener('message', (event) => {
                console.log('[Service Worker] Message received:', event.data);
            });
        });

        // Handle service worker controller change (page refresh after update)
        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (!refreshing) {
                refreshing = true;
                console.log('[Service Worker] New service worker activated, reloading page...');
                window.location.reload();
            }
        });
    }
})();

