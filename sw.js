// Service Worker para PWA
const CACHE_NAME = 'landingproperties-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/css/slider.css',
    '/css/enhancements.css',
    '/js/main.js',
    '/js/slider.js',
    '/js/advanced-search.js',
    '/js/property-comparison.js',
    '/js/notifications.js',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
    'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap'
];

// Instalar Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache abierto');
                return cache.addAll(urlsToCache);
            })
    );
});

// Activar Service Worker
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Eliminando cache antiguo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Interceptar requests
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Devolver desde cache si existe
                if (response) {
                    return response;
                }

                // Clonar request
                const fetchRequest = event.request.clone();

                return fetch(fetchRequest).then(response => {
                    // Verificar si es una respuesta válida
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    // Clonar response
                    const responseToCache = response.clone();

                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });

                    return response;
                });
            })
    );
});

// Manejar notificaciones push
self.addEventListener('push', event => {
    const options = {
        body: event.data ? event.data.text() : 'Nueva propiedad disponible',
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Ver Propiedades',
                icon: '/images/checkmark.png'
            },
            {
                action: 'close',
                title: 'Cerrar',
                icon: '/images/xmark.png'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('LandingProperties', options)
    );
});

// Manejar clicks en notificaciones
self.addEventListener('notificationclick', event => {
    event.notification.close();

    if (event.action === 'explore') {
        // Abrir la aplicación
        event.waitUntil(
            clients.openWindow('/')
        );
    } else if (event.action === 'close') {
        // Solo cerrar la notificación
        event.notification.close();
    } else {
        // Click en el cuerpo de la notificación
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Sincronización en background
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

async function doBackgroundSync() {
    try {
        // Sincronizar datos offline
        const response = await fetch('/api/properties');
        const properties = await response.json();
        
        // Guardar en IndexedDB o localStorage
        const cache = await caches.open(CACHE_NAME);
        await cache.put('/api/properties', new Response(JSON.stringify(properties)));
        
        console.log('Sincronización completada');
    } catch (error) {
        console.error('Error en sincronización:', error);
    }
}