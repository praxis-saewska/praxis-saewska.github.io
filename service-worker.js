// Service Worker for Praxis Saewska PWA
// Version 1.0.2 - Improved caching strategy and error handling

const CACHE_NAME = 'praxis-saewska-v1.0.2';
const RUNTIME_CACHE = 'praxis-saewska-runtime-v1.0.2';
const OFFLINE_PAGE = '/index.html';

// Assets to cache immediately on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/about.html',
  '/faq.html',
  '/privacy.html',
  '/styles.css',
  '/script.js',
  '/common-data.js',
  '/translations-de.js',
  '/translations-en.js',
  '/translations-ru.js',
  '/translations-ua.js',
  '/images/file.svg',
  '/manifest.json',
  '/images/elena-saewska.jpg'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching static assets');
        return cache.addAll(STATIC_ASSETS.map(url => new Request(url, { cache: 'reload' })))
          .catch((error) => {
            console.warn('[Service Worker] Some assets failed to cache:', error);
            // Continue even if some assets fail
            return Promise.resolve();
          });
      })
      .then(() => {
        console.log('[Service Worker] Static assets cached');
        return self.skipWaiting(); // Activate immediately
      })
      .catch((error) => {
        console.error('[Service Worker] Error caching static assets:', error);
        // Still skip waiting to activate the service worker
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName).catch((error) => {
                console.warn('[Service Worker] Error deleting cache:', cacheName, error);
              });
            }
          })
        );
      })
      .then(() => {
        console.log('[Service Worker] Activated');
        return self.clients.claim(); // Take control of all pages immediately
      })
      .catch((error) => {
        console.error('[Service Worker] Error during activation:', error);
        // Still try to claim clients
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    // For Google Maps and other external resources, use network only
    if (url.hostname.includes('google.com') || url.hostname.includes('doctolib.de')) {
      return; // Let browser handle it normally
    }
    return;
  }

  // Strategy: Stale-While-Revalidate for better performance
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        // Start fetching from network in parallel
        const fetchPromise = fetch(request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            // Cache the response for future use
            caches.open(RUNTIME_CACHE)
              .then((cache) => {
                cache.put(request, responseToCache).catch((error) => {
                  console.warn('[Service Worker] Error caching response:', error);
                });
              })
              .catch((error) => {
                console.warn('[Service Worker] Error opening cache:', error);
              });

            return response;
          })
          .catch((error) => {
            console.warn('[Service Worker] Network fetch failed:', error);
            // Return null if network fails, we'll use cache
            return null;
          });

        // Return cached version immediately if available, otherwise wait for network
        if (cachedResponse) {
          // Update cache in background (stale-while-revalidate)
          fetchPromise.catch(() => {
            // Ignore errors in background update
          });
          return cachedResponse;
        }

        // No cache, wait for network
        return fetchPromise.then((networkResponse) => {
          if (networkResponse) {
            return networkResponse;
          }

          // Network failed, try to return offline page for navigation requests
          if (request.mode === 'navigate') {
            return caches.match(OFFLINE_PAGE).then((offlinePage) => {
              if (offlinePage) {
                return offlinePage;
              }
              // Last resort: return a basic offline response
              return new Response('Offline - Please check your internet connection', {
                status: 503,
                statusText: 'Service Unavailable',
                headers: new Headers({
                  'Content-Type': 'text/plain'
                })
              });
            });
          }

          // For non-navigation requests, return error
          return new Response('Network error', {
            status: 408,
            statusText: 'Request Timeout'
          });
        });
      })
      .catch((error) => {
        console.error('[Service Worker] Fetch handler error:', error);
        // Last resort fallback
        if (request.mode === 'navigate') {
          return caches.match(OFFLINE_PAGE).catch(() => {
            return new Response('Service unavailable', {
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
        }
        return new Response('Error', {
          status: 500,
          statusText: 'Internal Server Error'
        });
      })
  );
});

// Handle messages from the page
self.addEventListener('message', (event) => {
  try {
    if (event.data && event.data.type === 'SKIP_WAITING') {
      self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CACHE_URLS') {
      event.waitUntil(
        caches.open(CACHE_NAME)
          .then((cache) => {
            return cache.addAll(event.data.urls).catch((error) => {
              console.warn('[Service Worker] Error caching URLs:', error);
            });
          })
          .catch((error) => {
            console.error('[Service Worker] Error opening cache for URLs:', error);
          })
      );
    }
  } catch (error) {
    console.error('[Service Worker] Error handling message:', error);
  }
});

