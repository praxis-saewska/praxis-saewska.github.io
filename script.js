// Translation System
(function() {
    'use strict';

    const LANGUAGE_KEY = 'preferredLanguage';
    const DEFAULT_LANGUAGE = 'de';
    const SUPPORTED_LANGUAGES = ['de', 'en', 'ru', 'uk'];

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

    // Set language and save to localStorage
    function setLanguage(lang) {
        if (!SUPPORTED_LANGUAGES.includes(lang)) {
            lang = DEFAULT_LANGUAGE;
        }
        localStorage.setItem(LANGUAGE_KEY, lang);
        translatePage(lang);
        updateHTMLAttributes(lang);
    }

    // Get translation text
    function getTranslation(key, lang) {
        if (!translations || !translations[lang]) {
            return key;
        }

        const keys = key.split('.');
        let value = translations[lang];

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
        
        // Handle HTML content (for elements with <br> tags, etc.)
        if (translation.includes('<br>') || translation.includes('<strong>') || translation.includes('<em>')) {
            element.innerHTML = translation;
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
    }

    // Translate entire page
    function translatePage(lang) {
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(element => {
            translateElement(element, lang);
        });

        // Update language selector
        const langSelect = document.getElementById('language-select');
        if (langSelect) {
            langSelect.value = lang;
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
    }

    // Initialize language switcher
    function initLanguageSwitcher() {
        const langSelect = document.getElementById('language-select');
        if (langSelect) {
            const currentLang = getCurrentLanguage();
            langSelect.value = currentLang;

            langSelect.addEventListener('change', function() {
                setLanguage(this.value);
            });
        }
    }

    // Initialize translation system
    function initTranslation() {
        const currentLang = getCurrentLanguage();
        translatePage(currentLang);
        updateHTMLAttributes(currentLang);
        initLanguageSwitcher();
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
            banner.classList.add('show');
        }
    }

    // Hide cookie banner
    function hideCookieBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.classList.remove('show');
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
        
        if (acceptBtn) {
            acceptBtn.addEventListener('click', handleAccept);
        }
        
        if (declineBtn) {
            declineBtn.addEventListener('click', handleDecline);
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
            if (question) {
                question.addEventListener('click', () => {
                    const isActive = item.classList.contains('active');
                    
                    // Close all items
                    faqItems.forEach(faqItem => {
                        faqItem.classList.remove('active');
                    });
                    
                    // Open clicked item if it wasn't active
                    if (!isActive) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }

    // Mobile Menu Toggle
    function initMobileMenu() {
        const menuToggle = document.getElementById('menu-toggle');
        const nav = document.querySelector('nav');
        
        if (menuToggle && nav) {
            menuToggle.addEventListener('click', () => {
                nav.classList.toggle('active');
            });
            
            // Close menu when clicking on a link
            const navLinks = nav.querySelectorAll('a');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    nav.classList.remove('active');
                });
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

    // Initialize everything when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initCookieBanner();
            initFAQ();
            initMobileMenu();
            initSmoothScroll();
        });
    } else {
        initCookieBanner();
        initFAQ();
        initMobileMenu();
        initSmoothScroll();
    }

    // Export functions for potential external use
    window.cookieConsent = {
        hasConsent: hasConsent,
        saveConsent: saveConsent,
        loadGoogleMaps: loadGoogleMaps
    };
})();

