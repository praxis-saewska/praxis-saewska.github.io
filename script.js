// Translation System
(function() {
    'use strict';

    const LANGUAGE_KEY = 'preferredLanguage';
    const DEFAULT_LANGUAGE = 'de';
    const SUPPORTED_LANGUAGES = ['de', 'en', 'ua', 'ru'];

    // Dynamically load translation file for a specific language
    function loadTranslation(lang) {
        return new Promise((resolve, reject) => {
            // Check if already loaded
            if (window.translations && window.translations[lang]) {
                resolve();
                return;
            }

            // Check if script is already being loaded
            const existingScript = document.querySelector(`script[data-lang="${lang}"]`);
            if (existingScript) {
                // Wait for it to load
                const checkInterval = setInterval(() => {
                    if (window.translations && window.translations[lang]) {
                        clearInterval(checkInterval);
                        resolve();
                    }
                }, 50);
                
                existingScript.addEventListener('error', () => {
                    clearInterval(checkInterval);
                    reject(new Error(`Error loading script for ${lang}`));
                }, { once: true });
                
                // Timeout after 3 seconds
                setTimeout(() => {
                    clearInterval(checkInterval);
                    if (!window.translations || !window.translations[lang]) {
                        reject(new Error(`Timeout loading translations for ${lang}`));
                    }
                }, 3000);
                
                return;
            }

            // Create and load script
            const script = document.createElement('script');
            script.src = `translations-${lang}.js`;
            script.async = true;
            script.setAttribute('data-lang', lang);
            
            script.onload = () => {
                if (window.translations && window.translations[lang]) {
                    resolve();
                } else {
                    reject(new Error(`Translations for ${lang} not found after script load`));
                }
            };
            
            script.onerror = () => reject(new Error(`Failed to load translations for ${lang}`));
            
            document.head.appendChild(script);
        });
    }

    // Get current language from localStorage or browser preference
    function getCurrentLanguage() {
        // Check URL parameter first (?lang=en, ?lang=ru, etc.)
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        if (urlLang && SUPPORTED_LANGUAGES.includes(urlLang)) {
            // Save to localStorage for future visits
            localStorage.setItem(LANGUAGE_KEY, urlLang);
            return urlLang;
        }

        // Check localStorage second
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

    // Show/hide loading indicator
    function toggleLoading(show) {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.classList.toggle('active', show);
        }
    }

    // Set language and save to localStorage
    function setLanguage(lang) {
        if (!SUPPORTED_LANGUAGES.includes(lang)) lang = DEFAULT_LANGUAGE;
        
        localStorage.setItem(LANGUAGE_KEY, lang);
        toggleLoading(true);
        
        // Load translation if not already loaded
        loadTranslation(lang)
            .then(() => {
                translatePage(lang);
                updateHTMLAttributes(lang);
                // Dispatch custom event for other modules
                window.dispatchEvent(new Event('languageChanged'));
            })
            .catch(() => {
                // Fallback to default language if loading fails
                if (lang !== DEFAULT_LANGUAGE) {
                    return loadTranslation(DEFAULT_LANGUAGE).then(() => {
                        translatePage(DEFAULT_LANGUAGE);
                        updateHTMLAttributes(DEFAULT_LANGUAGE);
                        window.dispatchEvent(new Event('languageChanged'));
                    });
                }
            })
            .finally(() => toggleLoading(false));
    }

    // Get translation text
    function getTranslation(key, lang) {
        if (!window.translations || !window.translations[lang]) {
            return key;
        }

        const keys = key.split('.');
        let value = window.translations[lang];

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                // Fallback to default language if translation not found
                return lang !== DEFAULT_LANGUAGE ? getTranslation(key, DEFAULT_LANGUAGE) : key;
            }
        }

        return typeof value === 'string' ? value : key;
    }

    // Translate a single element
    function translateElement(element, lang) {
        const key = element.getAttribute('data-translate');
        if (!key) return;

        const translation = getTranslation(key, lang);
        const tagName = element.tagName;
        
        // Special handling for different elements
        if (tagName === 'META') {
            element.setAttribute('content', translation);
        } else if (tagName === 'TITLE') {
            document.title = translation;
        } else if (tagName === 'IMG') {
            element.setAttribute('alt', translation);
        } else {
            // Check if translation contains HTML tags
            element[/<[^>]+>/.test(translation) ? 'innerHTML' : 'textContent'] = translation;
        }
    }

    // Translate entire page
    function translatePage(lang) {
        if (!window.translations) return;
        
        document.querySelectorAll('[data-translate]').forEach(el => translateElement(el, lang));
    }

    // Update HTML lang attribute and meta tags
    function updateHTMLAttributes(lang) {
        document.documentElement.setAttribute('lang', lang);
        
        // Update meta tags with data-translate attribute
        document.querySelectorAll('meta[data-translate]').forEach(meta => {
            const key = meta.getAttribute('data-translate');
            meta.setAttribute('content', getTranslation(key, lang));
        });
        
        // Update canonical and OG URLs
        const fileName = window.location.pathname.split('/').pop() || 'index.html';
        const baseDomain = 'https://praxis-saewska.de';
        const fullUrl = `${baseDomain}/${fileName}${lang !== 'de' ? `?lang=${lang}` : ''}`;
        
        const canonicalLink = document.getElementById('canonical-link');
        if (canonicalLink) canonicalLink.href = fullUrl;
        
        const ogUrl = document.getElementById('og-url');
        if (ogUrl) ogUrl.content = fullUrl;
        
        // Update OG locale
        const ogLocale = document.getElementById('og-locale');
        if (ogLocale) {
            const localeMap = { de: 'de_DE', en: 'en_US', ru: 'ru_RU', ua: 'uk_UA' };
            ogLocale.content = localeMap[lang] || 'de_DE';
        }
        
        // Update structured data and language selector
        updateStructuredData(lang);
        
        const langSelect = document.getElementById('language-select');
        if (langSelect) langSelect.value = lang;
    }

    // Update structured data (JSON-LD) for FAQ pages
    function updateStructuredData(lang) {
        document.querySelectorAll('script[type="application/ld+json"]').forEach(script => {
            try {
                const data = JSON.parse(script.textContent);
                
                // Update FAQ structured data
                if (data['@type'] === 'FAQPage' && data.mainEntity) {
                    data.mainEntity.forEach((item, index) => {
                        const question = getTranslation(`faq.q${index + 1}`, lang);
                        const answer = getTranslation(`faq.a${index + 1}`, lang);
                        
                        // Update question
                        if (question && !question.startsWith('faq.')) {
                            item.name = question;
                        }
                        
                        // Update answer (strip HTML tags)
                        if (answer && !answer.startsWith('faq.')) {
                            const tempDiv = document.createElement('div');
                            tempDiv.innerHTML = answer;
                            item.acceptedAnswer.text = tempDiv.textContent || '';
                        }
                    });
                    
                    script.textContent = JSON.stringify(data, null, 2);
                }
            } catch (e) {
                // Skip if JSON parsing fails
            }
        });
    }

    // Initialize language switcher
    function initLanguageSwitcher() {
        const langSelect = document.getElementById('language-select');
        if (langSelect) {
            langSelect.value = getCurrentLanguage();
            langSelect.addEventListener('change', (e) => setLanguage(e.target.value));
        }
    }

    // Initialize translation system
    function initTranslation() {
        const currentLang = getCurrentLanguage();
        
        loadTranslation(currentLang)
            .then(() => {
                translatePage(currentLang);
                updateHTMLAttributes(currentLang);
            })
            .catch(() => {
                // Fallback to default language if current language fails
                if (currentLang !== DEFAULT_LANGUAGE) {
                    return loadTranslation(DEFAULT_LANGUAGE).then(() => {
                        translatePage(DEFAULT_LANGUAGE);
                        updateHTMLAttributes(DEFAULT_LANGUAGE);
                    });
                }
            })
            .finally(() => initLanguageSwitcher());
    }

    // Make functions available globally
    window.translation = { setLanguage, getCurrentLanguage, translatePage };

    // Initialize when DOM is ready
    document.readyState === 'loading' 
        ? document.addEventListener('DOMContentLoaded', initTranslation)
        : initTranslation();
})();

// Cookie Consent Management
(function() {
    'use strict';

    const COOKIE_CONSENT_KEY = 'cookieConsent';
    const COOKIE_CONSENT_EXPIRY = 365; // days

    // Check if user has already given consent
    function hasConsent() {
        try {
            const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
            if (!consent) return null;
            
            const consentData = JSON.parse(consent);
            return new Date(consentData.expiry) > new Date() ? consentData.accepted : null;
        } catch (e) {
            return null;
        }
    }

    // Save consent preference
    function saveConsent(accepted) {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + COOKIE_CONSENT_EXPIRY);
        
        localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({
            accepted,
            date: new Date().toISOString(),
            expiry: expiryDate.toISOString()
        }));
    }

    // Toggle cookie banner
    function toggleCookieBanner(show) {
        const banner = document.getElementById('cookie-banner');
        if (banner) banner.classList.toggle('show', show);
    }

    // Handle consent decision
    function handleConsent(accepted) {
        saveConsent(accepted);
        toggleCookieBanner(false);
        if (accepted) loadGoogleMaps();
    }

    // Initialize cookie banner
    function initCookieBanner() {
        const consent = hasConsent();
        
        if (consent === null) {
            toggleCookieBanner(true);
        } else if (consent === true) {
            loadGoogleMaps();
        }

        // Attach event listeners
        const acceptBtn = document.getElementById('cookie-accept');
        const declineBtn = document.getElementById('cookie-decline');
        
        if (acceptBtn) acceptBtn.addEventListener('click', () => handleConsent(true));
        if (declineBtn) declineBtn.addEventListener('click', () => handleConsent(false));
    }

    // Load Google Maps (only after consent)
    function loadGoogleMaps() {
        const mapContainer = document.getElementById('google-map-container');
        if (!mapContainer) return;
        
        const consentMessage = document.getElementById('map-consent-message');
        const consent = hasConsent();
        
        if (consent === true) {
            const mapIframe = mapContainer.querySelector('iframe');
            if (mapIframe?.dataset.src) {
                mapIframe.src = mapIframe.dataset.src;
                mapIframe.removeAttribute('data-src');
            }
            consentMessage?.classList.add('hidden');
        } else {
            consentMessage?.classList.remove('hidden');
        }
    }

    // FAQ Accordion
    function initFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            item.querySelector('.faq-question')?.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                faqItems.forEach(el => el.classList.remove('active'));
                if (!isActive) item.classList.add('active');
            });
        });
    }

    // Mobile Menu Toggle
    function initMobileMenu() {
        const menuToggle = document.getElementById('menu-toggle');
        const nav = document.querySelector('nav');
        
        if (!menuToggle || !nav) return;
        
        const closeMenu = () => nav.classList.remove('active');
        
        // Toggle menu
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            nav.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (nav.classList.contains('active') && !nav.contains(e.target) && !menuToggle.contains(e.target)) {
                closeMenu();
            }
        });
        
        // Close menu on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && nav.classList.contains('active')) {
                closeMenu();
                menuToggle.focus();
            }
        });
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
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    // Scroll to Top Button
    function initScrollToTop() {
        const scrollBtn = document.getElementById('scroll-to-top');
        if (!scrollBtn) return;
        
        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            scrollBtn.classList.toggle('visible', window.pageYOffset > 300);
        });
        
        // Scroll to top when clicked
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Initialize everything when DOM is ready
    const initAll = () => {
        initCookieBanner();
        initFAQ();
        initMobileMenu();
        initSmoothScroll();
        initScrollToTop();
    };
    
    document.readyState === 'loading' 
        ? document.addEventListener('DOMContentLoaded', initAll)
        : initAll();

    // Export functions for potential external use
    window.cookieConsent = { hasConsent, saveConsent, loadGoogleMaps };
})();

// Common Data Application
(function() {
    'use strict';

    function applyCommonData() {
        if (!window.commonData) return;

        const { openingHours, contact } = window.commonData;

        // Apply opening hours
        if (openingHours) {
            document.querySelectorAll('[data-hours-day]').forEach(el => {
                const day = el.getAttribute('data-hours-day');
                if (openingHours[day]) el.textContent = openingHours[day];
            });
        }

        // Apply contact information
        if (contact) {
            // Helper function to update elements
            const updateElements = (selector, content, isHTML = false) => {
                document.querySelectorAll(selector).forEach(el => {
                    el[isHTML ? 'innerHTML' : 'textContent'] = content;
                });
            };
            
            updateElements('[data-translate="index.addressPlaceholder"], [data-translate="contact.addressValue"]', contact.address, true);
            updateElements('[data-translate="index.phonePlaceholder"], [data-translate="contact.phoneValue"]', contact.phone);
            updateElements('[data-translate="index.emailPlaceholder"], [data-translate="contact.emailValue"]', contact.email);
            
            // Email links
            document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
                link.href = `mailto:${contact.email}`;
                if (!link.querySelector('[data-translate]')) {
                    link.textContent = contact.email;
                }
            });
        }
    }

    // Custom event for language changes
    window.addEventListener('languageChanged', applyCommonData);
    
    // Initialize
    const init = () => requestAnimationFrame(applyCommonData);
    
    document.readyState === 'loading'
        ? document.addEventListener('DOMContentLoaded', init)
        : init();
})();

