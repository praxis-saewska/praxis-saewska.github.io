// Language Switcher for Pelican i18n_subsites
(function() {
    'use strict';

    // Initialize language switcher
    function initLanguageSwitcher() {
        const langSelect = document.getElementById('language-select');
        if (!langSelect) return;
        
        // Detect current language from URL
        const currentPath = window.location.pathname;
        let currentLang = 'de';
        if (currentPath.startsWith('/en/') || currentPath === '/en') {
            currentLang = 'en';
        } else if (currentPath.startsWith('/ru/') || currentPath === '/ru') {
            currentLang = 'ru';
        } else if (currentPath.startsWith('/uk/') || currentPath === '/uk') {
            currentLang = 'uk';
        }
        
        langSelect.value = currentLang;
        
        // Update HTML lang attribute
        document.documentElement.setAttribute('lang', currentLang);
        
        // Handle language change
        langSelect.addEventListener('change', (e) => {
            const newLang = e.target.value;
            const currentPath = window.location.pathname;
            
            // Get the page slug (remove language prefix and trailing slash)
            let pagePath = currentPath.replace(/^\/(de|en|ru|uk)\//, '/').replace(/^\/(de|en|ru|uk)$/, '/');
            if (pagePath === '/') {
                pagePath = '';
            }
            
            // Build new URL
            const baseUrl = window.location.origin;
            let newUrl;
            if (newLang === 'de') {
                newUrl = baseUrl + pagePath;
            } else {
                newUrl = baseUrl + '/' + newLang + pagePath;
            }
            
            window.location.href = newUrl;
        });
    }

    // Initialize when DOM is ready
    document.readyState === 'loading' 
        ? document.addEventListener('DOMContentLoaded', initLanguageSwitcher)
        : initLanguageSwitcher();
})();

// Cookie Consent Management using vanilla-cookieconsent
(function() {
    'use strict';

    // Detect current language from URL
    const currentPath = window.location.pathname;
    let currentLang = 'de';
    if (currentPath.startsWith('/en/') || currentPath === '/en') {
        currentLang = 'en';
    } else if (currentPath.startsWith('/ru/') || currentPath === '/ru') {
        currentLang = 'ru';
    } else if (currentPath.startsWith('/uk/') || currentPath === '/uk') {
        currentLang = 'uk';
    }

    // Get SITEURL from the page (from canonical link or base tag)
    function getSiteUrl() {
        const canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) {
            const url = new URL(canonical.href);
            return url.origin;
        }
        return window.location.origin;
    }

    const siteUrl = getSiteUrl();

    // Translations for cookie consent
    const translations = {
        de: {
            consentModal: {
                title: 'Wir verwenden Cookies',
                description: `Wir verwenden Cookies, um Ihnen die beste Erfahrung auf unserer Website zu bieten. Durch die Nutzung unserer Website stimmen Sie der Verwendung von Cookies zu. Weitere Informationen finden Sie in unserer <a href="${siteUrl}/privacy/">Datenschutzerklärung</a>.`,
                acceptAllBtn: 'Alle akzeptieren',
                acceptNecessaryBtn: 'Nur notwendige',
                showPreferencesBtn: 'Einstellungen verwalten'
            },
            preferencesModal: {
                title: 'Cookie-Einstellungen',
                acceptAllBtn: 'Alle akzeptieren',
                acceptNecessaryBtn: 'Nur notwendige',
                savePreferencesBtn: 'Einstellungen speichern',
                closeIconLabel: 'Schließen',
                sections: [
                    {
                        title: 'Cookie-Verwendung',
                        description: 'Wir verwenden Cookies, um sicherzustellen, dass die Website ordnungsgemäß funktioniert.'
                    },
                    {
                        title: 'Notwendige Cookies',
                        description: 'Diese Cookies sind für das ordnungsgemäße Funktionieren der Website erforderlich.',
                        linkedCategory: 'necessary'
                    },
                    {
                        title: 'Funktionale Cookies',
                        description: 'Diese Cookies ermöglichen es der Website, erweiterte Funktionalität und Personalisierung bereitzustellen.',
                        linkedCategory: 'functional'
                    }
                ]
            }
        },
        en: {
            consentModal: {
                title: 'We use cookies',
                description: `We use cookies to provide you with the best experience on our website. By using our website, you agree to the use of cookies. For more information, please see our <a href="${siteUrl}/privacy/">Privacy Policy</a>.`,
                acceptAllBtn: 'Accept all',
                acceptNecessaryBtn: 'Necessary only',
                showPreferencesBtn: 'Manage preferences'
            },
            preferencesModal: {
                title: 'Cookie preferences',
                acceptAllBtn: 'Accept all',
                acceptNecessaryBtn: 'Necessary only',
                savePreferencesBtn: 'Save preferences',
                closeIconLabel: 'Close',
                sections: [
                    {
                        title: 'Cookie usage',
                        description: 'We use cookies to ensure the website functions properly.'
                    },
                    {
                        title: 'Necessary cookies',
                        description: 'These cookies are essential for the proper functioning of the website.',
                        linkedCategory: 'necessary'
                    },
                    {
                        title: 'Functional cookies',
                        description: 'These cookies enable the website to provide enhanced functionality and personalization.',
                        linkedCategory: 'functional'
                    }
                ]
            }
        },
        ru: {
            consentModal: {
                title: 'Мы используем cookies',
                description: `Мы используем cookies, чтобы предоставить вам лучший опыт на нашем сайте. Используя наш сайт, вы соглашаетесь на использование cookies. Для получения дополнительной информации см. нашу <a href="${siteUrl}/privacy/">Политику конфиденциальности</a>.`,
                acceptAllBtn: 'Принять все',
                acceptNecessaryBtn: 'Только необходимые',
                showPreferencesBtn: 'Управление настройками'
            },
            preferencesModal: {
                title: 'Настройки cookies',
                acceptAllBtn: 'Принять все',
                acceptNecessaryBtn: 'Только необходимые',
                savePreferencesBtn: 'Сохранить настройки',
                closeIconLabel: 'Закрыть',
                sections: [
                    {
                        title: 'Использование cookies',
                        description: 'Мы используем cookies для обеспечения правильной работы сайта.'
                    },
                    {
                        title: 'Необходимые cookies',
                        description: 'Эти cookies необходимы для правильной работы сайта.',
                        linkedCategory: 'necessary'
                    },
                    {
                        title: 'Функциональные cookies',
                        description: 'Эти cookies позволяют сайту предоставлять расширенную функциональность и персонализацию.',
                        linkedCategory: 'functional'
                    }
                ]
            }
        },
        uk: {
            consentModal: {
                title: 'Ми використовуємо cookies',
                description: `Ми використовуємо cookies, щоб забезпечити вам найкращий досвід на нашому веб-сайті. Використовуючи наш веб-сайт, ви погоджуєтеся на використання cookies. Для отримання додаткової інформації див. нашу <a href="${siteUrl}/privacy/">Політику конфіденційності</a>.`,
                acceptAllBtn: 'Прийняти все',
                acceptNecessaryBtn: 'Тільки необхідні',
                showPreferencesBtn: 'Керування налаштуваннями'
            },
            preferencesModal: {
                title: 'Налаштування cookies',
                acceptAllBtn: 'Прийняти все',
                acceptNecessaryBtn: 'Тільки необхідні',
                savePreferencesBtn: 'Зберегти налаштування',
                closeIconLabel: 'Закрити',
                sections: [
                    {
                        title: 'Використання cookies',
                        description: 'Ми використовуємо cookies для забезпечення правильної роботи веб-сайту.'
                    },
                    {
                        title: 'Необхідні cookies',
                        description: 'Ці cookies необхідні для правильної роботи веб-сайту.',
                        linkedCategory: 'necessary'
                    },
                    {
                        title: 'Функціональні cookies',
                        description: 'Ці cookies дозволяють веб-сайту надавати розширену функціональність та персоналізацію.',
                        linkedCategory: 'functional'
                    }
                ]
            }
        }
    };

    // Store the CookieConsent instance
    let cookieConsentInstance = null;

    // Initialize cookie consent
    function initCookieConsent() {
        // Check if initCookieConsent function is available (v2.9.1 API)
        if (typeof window.initCookieConsent === 'function') {
            const langTranslations = translations[currentLang];

            try {
                // Initialize and get the instance, then call run()
                cookieConsentInstance = window.initCookieConsent();
                if (cookieConsentInstance && typeof cookieConsentInstance.run === 'function') {
                    cookieConsentInstance.run({
                        categories: {
                            necessary: {
                                enabled: true,
                                readOnly: true
                            },
                            functional: {
                                enabled: false
                            }
                        },
                        language: {
                            default: currentLang,
                            translations: {
                                [currentLang]: langTranslations
                            }
                        },
                        guiOptions: {
                            consentModal: {
                                layout: 'box inline',
                                position: 'bottom right',
                                equalWeightButtons: true,
                                flipButtons: false
                            },
                            preferencesModal: {
                                layout: 'box',
                                position: 'right',
                                equalWeightButtons: true,
                                flipButtons: false
                            }
                        },
                        onAccept: function({ cookie }) {
                            // Load Google Maps only if functional cookies are accepted
                            loadGoogleMaps();
                        },
                        onChange: function({ changedCategories, changedServices }) {
                            // Reload Google Maps when consent changes
                            loadGoogleMaps();
                        }
                    });
                    return true;
                } else {
                    console.error('CookieConsent instance does not have run method');
                    return false;
                }
            } catch (error) {
                console.error('Error initializing cookie consent:', error);
                return false;
            }
        } 
        // Fallback for v3.x API (CookieConsent.run)
        else if (window.CookieConsent && typeof window.CookieConsent.run === 'function') {
            const langTranslations = translations[currentLang];

            try {
                window.CookieConsent.run({
                    categories: {
                        necessary: {
                            enabled: true,
                            readOnly: true
                        },
                        functional: {
                            enabled: false
                        }
                    },
                    language: {
                        default: currentLang,
                        translations: {
                            [currentLang]: langTranslations
                        }
                    },
                    guiOptions: {
                        consentModal: {
                            layout: 'box inline',
                            position: 'bottom right',
                            equalWeightButtons: true,
                            flipButtons: false
                        },
                        preferencesModal: {
                            layout: 'box',
                            position: 'right',
                            equalWeightButtons: true,
                            flipButtons: false
                        }
                    },
                    onFirstConsent: function({ cookie }) {
                        loadGoogleMaps();
                    },
                    onChange: function({ changedCategories, changedServices }) {
                        loadGoogleMaps();
                    }
                });
                cookieConsentInstance = window.CookieConsent;
                return true;
            } catch (error) {
                console.error('Error initializing cookie consent:', error);
                return false;
            }
        } else {
            console.error('vanilla-cookieconsent library not loaded or incorrect version');
            return false;
        }
    }

    // Load Google Maps (only after consent)
    function loadGoogleMaps() {
        const mapContainer = document.getElementById('google-map-container');
        if (!mapContainer) return;
        
        const consentMessage = document.getElementById('map-consent-message');
        
        // Check if consent is given using vanilla-cookieconsent API
        let hasConsent = false;
        if (cookieConsentInstance && typeof cookieConsentInstance.allowedCategory === 'function') {
            hasConsent = cookieConsentInstance.allowedCategory('functional');
        } else if (window.CookieConsent && typeof window.CookieConsent.acceptedCategory === 'function') {
            hasConsent = window.CookieConsent.acceptedCategory('functional');
        }
        
        if (hasConsent) {
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

    // Check if consent already exists and load maps
    function checkExistingConsent() {
        let hasConsent = false;
        if (cookieConsentInstance && typeof cookieConsentInstance.allowedCategory === 'function') {
            hasConsent = cookieConsentInstance.allowedCategory('functional');
        } else if (window.CookieConsent && typeof window.CookieConsent.acceptedCategory === 'function') {
            hasConsent = window.CookieConsent.acceptedCategory('functional');
        }
        
        if (hasConsent) {
            loadGoogleMaps();
        }
    }

    // Initialize when DOM and library are ready
    function init() {
        // Check for v2.9.1 API (initCookieConsent function)
        if (typeof window.initCookieConsent === 'function') {
            if (initCookieConsent()) {
                checkExistingConsent();
            }
        } 
        // Check for v3.x API (CookieConsent.run)
        else if (window.CookieConsent && typeof window.CookieConsent.run === 'function') {
            if (initCookieConsent()) {
                checkExistingConsent();
            }
        } else {
            // Wait for library to load (max 5 seconds)
            let attempts = 0;
            const maxAttempts = 50;
            const checkInterval = setInterval(() => {
                attempts++;
                if (typeof window.initCookieConsent === 'function' || 
                    (window.CookieConsent && typeof window.CookieConsent.run === 'function')) {
                    clearInterval(checkInterval);
                    if (initCookieConsent()) {
                        checkExistingConsent();
                    }
                } else if (attempts >= maxAttempts) {
                    clearInterval(checkInterval);
                    console.error('vanilla-cookieconsent library failed to load after 5 seconds');
                }
            }, 100);
        }
    }

    // Handle cookie settings link
    function initCookieSettingsLink() {
        const cookieSettingsLink = document.getElementById('cookie-settings');
        if (cookieSettingsLink) {
            cookieSettingsLink.addEventListener('click', function(e) {
                e.preventDefault();
                if (cookieConsentInstance && typeof cookieConsentInstance.showSettings === 'function') {
                    cookieConsentInstance.showSettings();
                } else if (window.CookieConsent && typeof window.CookieConsent.showPreferences === 'function') {
                    window.CookieConsent.showPreferences();
                }
            });
        }
    }

    // Initialize
    document.readyState === 'loading' 
        ? document.addEventListener('DOMContentLoaded', function() {
            init();
            initCookieSettingsLink();
        })
        : (init(), initCookieSettingsLink());

    // Export functions for potential external use
    window.cookieConsent = {
        loadGoogleMaps: loadGoogleMaps,
        showPreferences: function() {
            if (cookieConsentInstance && typeof cookieConsentInstance.showSettings === 'function') {
                cookieConsentInstance.showSettings();
            } else if (window.CookieConsent && typeof window.CookieConsent.showPreferences === 'function') {
                window.CookieConsent.showPreferences();
            }
        }
    };
})();

// FAQ Accordion
(function() {
    'use strict';

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

    document.readyState === 'loading' 
        ? document.addEventListener('DOMContentLoaded', initFAQ)
        : initFAQ();
})();

// Mobile Menu Toggle
(function() {
    'use strict';

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

    document.readyState === 'loading' 
        ? document.addEventListener('DOMContentLoaded', initMobileMenu)
        : initMobileMenu();
})();

// Smooth scrolling for anchor links
(function() {
    'use strict';

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

    document.readyState === 'loading' 
        ? document.addEventListener('DOMContentLoaded', initSmoothScroll)
        : initSmoothScroll();
})();

// Scroll to Top Button
(function() {
    'use strict';

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

    document.readyState === 'loading' 
        ? document.addEventListener('DOMContentLoaded', initScrollToTop)
        : initScrollToTop();
})();

// Wrap service h2 and p elements in a common container to make them appear as one card
(function() {
    'use strict';

    function wrapServiceCards() {
        const servicesGrid = document.querySelector('.services-grid');
        if (!servicesGrid) return;

        // Find all h2 elements that are direct children of services-grid
        const h2Elements = Array.from(servicesGrid.querySelectorAll(':scope > h2'));
        
        h2Elements.forEach(h2 => {
            // Check if this h2 is already wrapped
            if (h2.parentElement !== servicesGrid) return;
            
            // Find the next sibling p element
            const nextP = h2.nextElementSibling;
            if (nextP && nextP.tagName === 'P' && nextP.parentElement === servicesGrid) {
                // Create a wrapper div
                const wrapper = document.createElement('div');
                wrapper.className = 'service-card-wrapper';
                
                // Insert wrapper before h2
                servicesGrid.insertBefore(wrapper, h2);
                
                // Move h2 and p into wrapper
                wrapper.appendChild(h2);
                wrapper.appendChild(nextP);
            }
        });
    }

    document.readyState === 'loading' 
        ? document.addEventListener('DOMContentLoaded', wrapServiceCards)
        : wrapServiceCards();
})();
