// Translation System
(function() {
    'use strict';

    const LANGUAGE_KEY = 'preferredLanguage';
    const DEFAULT_LANGUAGE = 'de';
    const SUPPORTED_LANGUAGES = ['de', 'en', 'uk', 'ru'];
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
                const checkInterval = setInterval(() => {
                    if (window.translations && window.translations[lang]) {
                        clearInterval(checkInterval);
                        loadedLanguages.add(lang);
                        resolve();
                    }
                }, 50);
                
                existingScript.addEventListener('error', () => {
                    clearInterval(checkInterval);
                    reject();
                });
                
                // Timeout after 5 seconds
                setTimeout(() => {
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
                // Verify it's actually loaded
                if (window.translations && window.translations[lang]) {
                    loadedLanguages.add(lang);
                    resolve();
                } else {
                    reject(new Error(`Translations for ${lang} not found after script load`));
                }
            };
            
            script.onerror = () => {
                console.error(`Failed to load translations for ${lang}`);
                reject(new Error(`Failed to load translations for ${lang}`));
            };
            
            document.head.appendChild(script);
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

    // Set language and save to localStorage
    function setLanguage(lang) {
        if (!SUPPORTED_LANGUAGES.includes(lang)) {
            lang = DEFAULT_LANGUAGE;
        }
        localStorage.setItem(LANGUAGE_KEY, lang);
        
        // Load translation if not already loaded
        loadTranslation(lang).then(() => {
            translatePage(lang);
            updateHTMLAttributes(lang);
        }).catch(() => {
            // Fallback to default language if loading fails
            if (lang !== DEFAULT_LANGUAGE) {
                loadTranslation(DEFAULT_LANGUAGE).then(() => {
                    translatePage(DEFAULT_LANGUAGE);
                    updateHTMLAttributes(DEFAULT_LANGUAGE);
                });
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
        const currentLang = getCurrentLanguage();
        
        // Load the current language translation
        loadTranslation(currentLang).then(() => {
            translatePage(currentLang);
            updateHTMLAttributes(currentLang);
            initLanguageSwitcher();
        }).catch(() => {
            // Fallback to default language if current language fails
            if (currentLang !== DEFAULT_LANGUAGE) {
                loadTranslation(DEFAULT_LANGUAGE).then(() => {
                    translatePage(DEFAULT_LANGUAGE);
                    updateHTMLAttributes(DEFAULT_LANGUAGE);
                    initLanguageSwitcher();
                });
            } else {
                console.error('Failed to load default language translations');
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

// Common Data Application
(function() {
    'use strict';

    // Apply common data to the page
    function applyCommonData() {
        if (!window.commonData) {
            console.warn('Common data not loaded');
            return;
        }

        const data = window.commonData;

        // Apply opening hours
        if (data.openingHours) {
            // Map for index page hours
            const hoursMap = {
                'index.hoursMonday': data.openingHours.monday,
                'index.hoursTuesday': data.openingHours.tuesday,
                'index.hoursWednesday': data.openingHours.wednesday,
                'index.hoursThursday': data.openingHours.thursday,
                'index.hoursFriday': data.openingHours.friday
            };

            // Apply hours to elements with data-translate attributes on index page
            Object.keys(hoursMap).forEach(key => {
                const elements = document.querySelectorAll(`[data-translate="${key}"]`);
                elements.forEach(el => {
                    el.textContent = hoursMap[key];
                });
            });

            // Apply hours to contact page table
            const contactHoursMap = {
                'contact.monday': data.openingHours.monday,
                'contact.tuesday': data.openingHours.tuesday,
                'contact.wednesday': data.openingHours.wednesday,
                'contact.thursday': data.openingHours.thursday,
                'contact.friday': data.openingHours.friday
            };

            // Find table rows and apply hours
            const tableRows = document.querySelectorAll('table tr');
            tableRows.forEach(row => {
                const dayCell = row.querySelector('td[data-translate^="contact."]');
                if (dayCell) {
                    const translateKey = dayCell.getAttribute('data-translate');
                    const timeCell = row.querySelector('td:last-child');
                    if (timeCell && contactHoursMap[translateKey]) {
                        // Apply hours to the time cell (right column)
                        timeCell.textContent = contactHoursMap[translateKey];
                    }
                }
            });
        }

        // Apply contact information
        if (data.contact) {
            // Apply address
            const addressElements = document.querySelectorAll('[data-translate="index.addressPlaceholder"], [data-translate="contact.addressValue"]');
            addressElements.forEach(el => {
                el.innerHTML = data.contact.address;
            });

            // Apply phone
            const phoneElements = document.querySelectorAll('[data-translate="index.phonePlaceholder"], [data-translate="contact.phoneValue"]');
            phoneElements.forEach(el => {
                el.textContent = data.contact.phone;
            });

            // Apply email
            const emailElements = document.querySelectorAll('[data-translate="index.emailPlaceholder"]');
            emailElements.forEach(el => {
                el.textContent = data.contact.email;
            });

            // Apply email in contact page (if it's a link or text)
            const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
            emailLinks.forEach(link => {
                link.href = `mailto:${data.contact.email}`;
                if (!link.querySelector('span[data-translate]')) {
                    link.textContent = data.contact.email;
                }
            });

            // Apply email to contact page email value
            const contactEmailElements = document.querySelectorAll('[data-translate="contact.emailValue"]');
            contactEmailElements.forEach(el => {
                el.textContent = data.contact.email;
            });
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            // Wait a bit for translations to load
            setTimeout(applyCommonData, 100);
        });
    } else {
        setTimeout(applyCommonData, 100);
    }

    // Re-apply after language change
    const originalSetLanguage = window.translation && window.translation.setLanguage;
    if (originalSetLanguage) {
        window.translation.setLanguage = function(lang) {
            originalSetLanguage.call(this, lang);
            setTimeout(applyCommonData, 200);
        };
    }
})();

