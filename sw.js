// ============================================
// TADAA! - SERVICE WORKER
// ============================================

const CACHE_NAME = 'tadaa-v1';

// Files to cache for offline use
const FILES_TO_CACHE = [
    './',
    './index.html',
    './admin.html',
    './checkout.html',
    './dashboard.html',
    './tracking.html',
    './payment-success.html',
    './assets/css/main.css',
    './assets/css/admin.css',
    './assets/js/customer/app.js',
    './assets/js/config/firebase.js',
    './manifest.json',
    './logo/tadaa-icon-192.png',
    './logo/tadaa-icon-512.png'
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
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }
    
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    fetch(event.request)
                        .then((networkResponse) => {
                            caches.open(CACHE_NAME)
                                .then((cache) => {
                                    cache.put(event.request, networkResponse);
                                });
                        })
                        .catch(() => {});
                    return cachedResponse;
                }
                
                return fetch(event.request)
                    .then((networkResponse) => {
                        const responseClone = networkResponse.clone();
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseClone);
                            });
                        return networkResponse;
                    })
                    .catch(() => {
                        return caches.match('./index.html');
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
