// ============================================
// TADAA! - SERVICE WORKER
// Handles Offline & Updates
// ============================================

const CACHE_NAME = 'tadaa-v1';

// Files to cache for offline use
const FILES_TO_CACHE = [
    '/tadaa-marketplace/',
    '/tadaa-marketplace/index.html',
    '/tadaa-marketplace/admin.html',
    '/tadaa-marketplace/checkout.html',
    '/tadaa-marketplace/dashboard.html',
    '/tadaa-marketplace/order-status.html',
    '/tadaa-marketplace/payment-success.html',
    '/tadaa-marketplace/assets/css/main.css',
    '/tadaa-marketplace/assets/css/admin.css',
    '/tadaa-marketplace/assets/js/customer/app.js',
    '/tadaa-marketplace/assets/js/config/firebase.js',
    '/tadaa-marketplace/manifest.json',
    '/tadaa-marketplace/logo/tadaa-icon-192.png',
    '/tadaa-marketplace/logo/tadaa-icon-512.png'
];

// ============================================
// INSTALL - Cache files
// ============================================
self.addEventListener('install', (event) => {
    console.log('🔧 Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('📦 Caching files...');
                return cache.addAll(FILES_TO_CACHE);
            })
            .then(() => {
                console.log('✅ Service Worker installed!');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('❌ Cache failed:', error);
            })
    );
});

// ============================================
// ACTIVATE - Clean old caches
// ============================================
self.addEventListener('activate', (event) => {
    console.log('🚀 Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('🗑️ Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
        .then(() => {
            console.log('✅ Service Worker activated!');
            return self.clients.claim();
        })
    );
});

// ============================================
// FETCH - Serve from cache or network
// ============================================
self.addEventListener('fetch', (event) => {
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }
    
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                // Return cached version if available
                if (cachedResponse) {
                    // Check for updates in background
                    fetch(event.request)
                        .then((networkResponse) => {
                            // Update cache with new version
                            caches.open(CACHE_NAME)
                                .then((cache) => {
                                    cache.put(event.request, networkResponse);
                                });
                        })
                        .catch(() => {
                            // Network request failed, cache is fine
                        });
                    
                    return cachedResponse;
                }
                
                // Not in cache, fetch from network
                return fetch(event.request)
                    .then((networkResponse) => {
                        // Cache the response for next time
                        const responseClone = networkResponse.clone();
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseClone);
                            });
                        return networkResponse;
                    })
                    .catch(() => {
                        // Fallback if network fails
                        return caches.match('/tadaa-marketplace/index.html');
                    });
            })
    );
});

// ============================================
// MESSAGE - Handle skip waiting
// ============================================
self.addEventListener('message', (event) => {
    if (event.data === 'skipWaiting') {
        self.skipWaiting();
    }
});

console.log('✅ Tadaa! Service Worker ready!');
