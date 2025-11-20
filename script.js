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
                let attempts = 0;
                const maxAttempts = 100; // 5 seconds with 50ms intervals
                
                const checkInterval = setInterval(() => {
                    attempts++;
                    if (window.translations && window.translations[lang]) {
                        clearInterval(checkInterval);
                        loadedLanguages.add(lang);
                        resolve();
                    } else if (attempts >= maxAttempts) {
                        clearInterval(checkInterval);
                        reject(new Error(`Timeout loading translations for ${lang}`));
                    }
                }, 50);
                
                existingScript.addEventListener('error', () => {
                    clearInterval(checkInterval);
                    reject(new Error(`Error loading script for ${lang}`));
                });
                
                return;
            }

            // Create and load script
            const script = document.createElement('script');
            script.src = `translations-${lang}.js`;
            script.async = true;
            script.setAttribute('data-lang', lang);
            
            script.onload = () => {
                // Verify it's actually loaded with a small delay
                setTimeout(() => {
                    if (window.translations && window.translations[lang]) {
                        loadedLanguages.add(lang);
                        resolve();
                    } else {
                        reject(new Error(`Translations for ${lang} not found after script load`));
                    }
                }, 100);
            };
            
            script.onerror = (error) => {
                console.error(`Failed to load translations for ${lang}:`, error);
                reject(new Error(`Failed to load translations for ${lang}`));
            };
            
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
    function showLoading() {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.classList.add('active');
        }
    }

    function hideLoading() {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.classList.remove('active');
        }
    }

    // Set language and save to localStorage
    function setLanguage(lang) {
        if (!SUPPORTED_LANGUAGES.includes(lang)) {
            lang = DEFAULT_LANGUAGE;
        }
        localStorage.setItem(LANGUAGE_KEY, lang);
        
        // Show loading indicator
        showLoading();
        
        // Load translation if not already loaded
        loadTranslation(lang).then(() => {
            translatePage(lang);
            updateHTMLAttributes(lang);
            hideLoading();
        }).catch(() => {
            // Fallback to default language if loading fails
            if (lang !== DEFAULT_LANGUAGE) {
                loadTranslation(DEFAULT_LANGUAGE).then(() => {
                    translatePage(DEFAULT_LANGUAGE);
                    updateHTMLAttributes(DEFAULT_LANGUAGE);
                    hideLoading();
                }).catch(() => {
                    hideLoading();
                });
            } else {
                hideLoading();
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
        if (!window.translations) {
            console.warn('Translations not loaded, cannot translate page');
            return;
        }
        
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(element => {
            translateElement(element, lang);
        });
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
        
        // Update structured data (JSON-LD) if it exists
        updateStructuredData(lang);
        
        // Update language selector value
        const langSelect = document.getElementById('language-select');
        if (langSelect) {
            langSelect.value = lang;
        }
    }

    // Update structured data (JSON-LD) for FAQ and other pages
    function updateStructuredData(lang) {
        const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
        
        jsonLdScripts.forEach(script => {
            try {
                const data = JSON.parse(script.textContent);
                
                // Update FAQ structured data
                if (data['@type'] === 'FAQPage' && data.mainEntity) {
                    data.mainEntity.forEach((item, index) => {
                        const qKey = `faq.q${index + 1}`;
                        const aKey = `faq.a${index + 1}`;
                        
                        const question = getTranslation(qKey, lang);
                        const answer = getTranslation(aKey, lang);
                        
                        if (question && question !== qKey) {
                            item.name = question;
                        }
                        
                        if (answer && answer !== aKey) {
                            // Strip HTML tags for structured data
                            const tempDiv = document.createElement('div');
                            tempDiv.innerHTML = answer;
                            item.acceptedAnswer.text = tempDiv.textContent || tempDiv.innerText || '';
                        }
                    });
                    
                    script.textContent = JSON.stringify(data, null, 2);
                }
                
                // Update MedicalBusiness structured data
                if (data['@type'] === 'MedicalBusiness') {
                    // Keep structured data in original language for consistency
                    // As it's mainly for search engines and should be stable
                }
            } catch (e) {
                // Skip if JSON parsing fails
            }
        });
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
        const currentLang = getCurrentLanguage();
        
        // Load the current language translation
        loadTranslation(currentLang).then(() => {
            translatePage(currentLang);
            updateHTMLAttributes(currentLang);
            initLanguageSwitcher();
        }).catch((error) => {
            console.warn(`Failed to load translations for ${currentLang}:`, error);
            
            // Fallback to default language if current language fails
            if (currentLang !== DEFAULT_LANGUAGE) {
                console.log(`Falling back to ${DEFAULT_LANGUAGE}`);
                loadTranslation(DEFAULT_LANGUAGE).then(() => {
                    translatePage(DEFAULT_LANGUAGE);
                    updateHTMLAttributes(DEFAULT_LANGUAGE);
                    initLanguageSwitcher();
                }).catch((fallbackError) => {
                    console.error('Failed to load default language translations:', fallbackError);
                    // Initialize switcher even if translations fail
                    initLanguageSwitcher();
                });
            } else {
                console.error('Failed to load default language translations');
                // Initialize switcher even if translations fail
                initLanguageSwitcher();
            }
        });
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
            // Toggle menu
            menuToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                nav.classList.toggle('active');
            });
            
            // Close menu when clicking on a link
            const navLinks = nav.querySelectorAll('a');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    nav.classList.remove('active');
                });
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (nav.classList.contains('active') && 
                    !nav.contains(e.target) && 
                    !menuToggle.contains(e.target)) {
                    nav.classList.remove('active');
                }
            });
            
            // Close menu on Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    menuToggle.focus();
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

    // Scroll to Top Button
    function initScrollToTop() {
        const scrollBtn = document.getElementById('scroll-to-top');
        if (!scrollBtn) return;
        
        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollBtn.classList.add('visible');
            } else {
                scrollBtn.classList.remove('visible');
            }
        });
        
        // Scroll to top when clicked
        scrollBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
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
            initScrollToTop();
        });
    } else {
        initCookieBanner();
        initFAQ();
        initMobileMenu();
        initSmoothScroll();
        initScrollToTop();
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
        if (!window.commonData) return;

        const { openingHours, contact } = window.commonData;

        // Apply opening hours using data-hours-day attribute
        if (openingHours) {
            document.querySelectorAll('[data-hours-day]').forEach(el => {
                const day = el.getAttribute('data-hours-day');
                if (openingHours[day]) {
                    el.textContent = openingHours[day];
                }
            });
        }

        // Apply contact information
        if (contact) {
            // Address
            document.querySelectorAll('[data-translate="index.addressPlaceholder"], [data-translate="contact.addressValue"]').forEach(el => {
                el.innerHTML = contact.address;
            });

            // Phone
            document.querySelectorAll('[data-translate="index.phonePlaceholder"], [data-translate="contact.phoneValue"]').forEach(el => {
                el.textContent = contact.phone;
            });

            // Email
            document.querySelectorAll('[data-translate="index.emailPlaceholder"], [data-translate="contact.emailValue"]').forEach(el => {
                el.textContent = contact.email;
            });

            // Email links
            document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
                link.href = `mailto:${contact.email}`;
                if (!link.querySelector('[data-translate]')) {
                    link.textContent = contact.email;
                }
            });
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

