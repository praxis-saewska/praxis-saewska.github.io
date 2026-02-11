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
        if (currentPath.startsWith('/de/') || currentPath === '/de') {
            currentLang = 'de';
        } else if (currentPath.startsWith('/en/') || currentPath === '/en') {
            currentLang = 'en';
        } else if (currentPath.startsWith('/ru/') || currentPath === '/ru') {
            currentLang = 'ru';
        } else if (currentPath.startsWith('/uk/') || currentPath === '/uk') {
            currentLang = 'uk';
        } else if (currentPath === '/' || currentPath === '/index.html') {
            // На корневой странице показываем немецкий как выбранный
            currentLang = 'de';
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
            
            // Build new URL - все языки теперь имеют префиксы
            const baseUrl = window.location.origin;
            const newUrl = baseUrl + '/' + newLang + pagePath;
            
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
    if (currentPath.startsWith('/de/') || currentPath === '/de') {
        currentLang = 'de';
    } else if (currentPath.startsWith('/en/') || currentPath === '/en') {
        currentLang = 'en';
    } else if (currentPath.startsWith('/ru/') || currentPath === '/ru') {
        currentLang = 'ru';
    } else if (currentPath.startsWith('/uk/') || currentPath === '/uk') {
        currentLang = 'uk';
    } else if (currentPath === '/' || currentPath === '/index.html') {
        // На корневой странице используем немецкий
        currentLang = 'de';
    }

    // Get SITEURL from the page (from canonical link or base tag)
    function getSiteUrl() {
        const canonical = document.querySelector('link[rel="canonical"]');
        if (canonical && canonical.href) {
            try {
                const url = new URL(canonical.href);
                return url.origin;
            } catch (e) {
                console.warn('Invalid canonical URL:', canonical.href);
            }
        }
        return window.location.origin;
    }

    const siteUrl = getSiteUrl();

    // Translations for cookie consent
    // Note: vanilla-cookieconsent v2.9.1 expects snake_case keys
    const translations = {
        de: {
            consent_modal: {
                title: 'Wir verwenden Cookies',
                description: `Wir verwenden Cookies, um Ihnen die beste Erfahrung auf unserer Website zu bieten. Durch die Nutzung unserer Website stimmen Sie der Verwendung von Cookies zu. Weitere Informationen finden Sie in unserer <a href="${siteUrl}/privacy/">Datenschutzerklärung</a>.`,
                primary_btn: {
                    text: 'Alle akzeptieren',
                    role: 'accept_all'
                },
                secondary_btn: {
                    text: 'Einstellungen verwalten',
                    role: 'settings'
                }
            },
            settings_modal: {
                title: 'Cookie-Einstellungen',
                accept_all_btn: 'Alle akzeptieren',
                accept_necessary_btn: 'Nur notwendige',
                save_settings_btn: 'Einstellungen speichern',
                close_btn_label: 'Schließen',
                blocks: [
                    {
                        title: 'Cookie-Verwendung',
                        description: 'Wir verwenden Cookies, um sicherzustellen, dass die Website ordnungsgemäß funktioniert.'
                    },
                    {
                        title: 'Notwendige Cookies',
                        description: 'Diese Cookies sind für das ordnungsgemäße Funktionieren der Website erforderlich.',
                        toggle: {
                            value: 'necessary',
                            enabled: true,
                            readonly: true
                        }
                    },
                    {
                        title: 'Funktionale Cookies',
                        description: 'Diese Cookies ermöglichen es der Website, erweiterte Funktionalität und Personalisierung bereitzustellen.',
                        toggle: {
                            value: 'functional',
                            enabled: false,
                            readonly: false
                        }
                    }
                ]
            }
        },
        en: {
            consent_modal: {
                title: 'We use cookies',
                description: `We use cookies to provide you with the best experience on our website. By using our website, you agree to the use of cookies. For more information, please see our <a href="${siteUrl}/privacy/">Privacy Policy</a>.`,
                primary_btn: {
                    text: 'Accept all',
                    role: 'accept_all'
                },
                secondary_btn: {
                    text: 'Manage preferences',
                    role: 'settings'
                }
            },
            settings_modal: {
                title: 'Cookie preferences',
                accept_all_btn: 'Accept all',
                accept_necessary_btn: 'Necessary only',
                save_settings_btn: 'Save preferences',
                close_btn_label: 'Close',
                blocks: [
                    {
                        title: 'Cookie usage',
                        description: 'We use cookies to ensure the website functions properly.'
                    },
                    {
                        title: 'Necessary cookies',
                        description: 'These cookies are essential for the proper functioning of the website.',
                        toggle: {
                            value: 'necessary',
                            enabled: true,
                            readonly: true
                        }
                    },
                    {
                        title: 'Functional cookies',
                        description: 'These cookies enable the website to provide enhanced functionality and personalization.',
                        toggle: {
                            value: 'functional',
                            enabled: false,
                            readonly: false
                        }
                    }
                ]
            }
        },
        ru: {
            consent_modal: {
                title: 'Мы используем cookies',
                description: `Мы используем cookies, чтобы предоставить вам лучший опыт на нашем сайте. Используя наш сайт, вы соглашаетесь на использование cookies. Для получения дополнительной информации см. нашу <a href="${siteUrl}/privacy/">Политику конфиденциальности</a>.`,
                primary_btn: {
                    text: 'Принять все',
                    role: 'accept_all'
                },
                secondary_btn: {
                    text: 'Управление настройками',
                    role: 'settings'
                }
            },
            settings_modal: {
                title: 'Настройки cookies',
                accept_all_btn: 'Принять все',
                accept_necessary_btn: 'Только необходимые',
                save_settings_btn: 'Сохранить настройки',
                close_btn_label: 'Закрыть',
                blocks: [
                    {
                        title: 'Использование cookies',
                        description: 'Мы используем cookies для обеспечения правильной работы сайта.'
                    },
                    {
                        title: 'Необходимые cookies',
                        description: 'Эти cookies необходимы для правильной работы сайта.',
                        toggle: {
                            value: 'necessary',
                            enabled: true,
                            readonly: true
                        }
                    },
                    {
                        title: 'Функциональные cookies',
                        description: 'Эти cookies позволяют сайту предоставлять расширенную функциональность и персонализацию.',
                        toggle: {
                            value: 'functional',
                            enabled: false,
                            readonly: false
                        }
                    }
                ]
            }
        },
        uk: {
            consent_modal: {
                title: 'Ми використовуємо cookies',
                description: `Ми використовуємо cookies, щоб забезпечити вам найкращий досвід на нашому веб-сайті. Використовуючи наш веб-сайт, ви погоджуєтеся на використання cookies. Для отримання додаткової інформації див. нашу <a href="${siteUrl}/privacy/">Політику конфіденційності</a>.`,
                primary_btn: {
                    text: 'Прийняти все',
                    role: 'accept_all'
                },
                secondary_btn: {
                    text: 'Керування налаштуваннями',
                    role: 'settings'
                }
            },
            settings_modal: {
                title: 'Налаштування cookies',
                accept_all_btn: 'Прийняти все',
                accept_necessary_btn: 'Тільки необхідні',
                save_settings_btn: 'Зберегти налаштування',
                close_btn_label: 'Закрити',
                blocks: [
                    {
                        title: 'Використання cookies',
                        description: 'Ми використовуємо cookies для забезпечення правильної роботи веб-сайту.'
                    },
                    {
                        title: 'Необхідні cookies',
                        description: 'Ці cookies необхідні для правильної роботи веб-сайту.',
                        toggle: {
                            value: 'necessary',
                            enabled: true,
                            readonly: true
                        }
                    },
                    {
                        title: 'Функціональні cookies',
                        description: 'Ці cookies дозволяють веб-сайту надавати розширену функціональність та персоналізацію.',
                        toggle: {
                            value: 'functional',
                            enabled: false,
                            readonly: false
                        }
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
            // Ensure we have translations for the current language
            if (!translations[currentLang]) {
                console.warn(`Translations not found for language: ${currentLang}, falling back to 'de'`);
                currentLang = 'de';
            }

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
                        languages: translations,
                        current_lang: currentLang,
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
            // Ensure we have translations for the current language
            if (!translations[currentLang]) {
                console.warn(`Translations not found for language: ${currentLang}, falling back to 'de'`);
                currentLang = 'de';
            }

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
                    languages: translations,
                    current_lang: currentLang,
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

// Initialize services section: wrap cards and set title from markdown
(function() {
    'use strict';

    function initServicesSection() {
        const servicesSection = document.querySelector('#services');
        if (!servicesSection) return;

        const sectionTitle = servicesSection.querySelector('h2.section-title');
        const servicesGrid = servicesSection.querySelector('.services-grid');
        if (!sectionTitle || !servicesGrid) return;

        // Find the first heading inside services-grid (this corresponds to first "##" in markdown)
        const firstHeading = servicesGrid.querySelector('h1, h2, h3, h4, h5, h6');
        if (!firstHeading) return;

        // Set section title text from markdown heading
        sectionTitle.textContent = firstHeading.textContent.trim();

        // FIRST: Wrap all service cards (h2/h3 + p pairs)
        // Find all heading elements (h2/h3) that are direct children of services-grid
        const headingElements = Array.from(
            servicesGrid.querySelectorAll(':scope > h2, :scope > h3')
        );
        
        headingElements.forEach(heading => {
            // Skip the first heading (section title) - we'll remove it later
            if (heading === firstHeading) return;
            
            // Check if this heading is already wrapped
            if (heading.parentElement !== servicesGrid) return;
            
            // Find the next sibling p element
            const nextP = heading.nextElementSibling;
            if (nextP && nextP.tagName === 'P' && nextP.parentElement === servicesGrid) {
                // Create a wrapper div
                const wrapper = document.createElement('div');
                wrapper.className = 'service-card-wrapper';
                
                // Insert wrapper before heading
                servicesGrid.insertBefore(wrapper, heading);
                
                // Move heading and p into wrapper
                wrapper.appendChild(heading);
                wrapper.appendChild(nextP);
            }
        });

        // THEN: Remove the first heading from the grid to avoid duplicated titles
        if (firstHeading.parentElement === servicesGrid) {
            servicesGrid.removeChild(firstHeading);
        }
    }

    document.readyState === 'loading'
        ? document.addEventListener('DOMContentLoaded', initServicesSection)
        : initServicesSection();
})();
