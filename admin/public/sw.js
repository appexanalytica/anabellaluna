/* eslint-disable no-restricted-globals */

const CACHE_NAME = 'anabella-admin-v2';
const APP_ORIGIN = self.location.origin;

// Install
self.addEventListener('install', () => {
  self.skipWaiting();
});

// Activate — clean old caches and claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n))
      )
    ).then(() => self.clients.claim())
  );
});

// Push notification — iOS 16.4+ compatible
self.addEventListener('push', (event) => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch {
      data = { title: 'Anabella Luna ERP', body: event.data.text() };
    }
  }

  const title = data.title || 'Anabella Luna ERP';
  const options = {
    body: data.body || '',
    icon: data.icon || '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    vibrate: [200, 100, 200],
    requireInteraction: false,
    data: {
      url: data.url || '/',
      type: data.type || 'general',
      entityId: data.entityId || null,
    },
    tag: data.tag || data.type || 'anabella-erp',
    renotify: true,
  };

  console.log('[SW ERP] Push received:', title, options.body);

  // Si el ERP ya está abierto y a la vista, no se muestra la notificación del
  // sistema: se avisa a la pestaña para que refresque los badges al instante.
  // Así el push no duplica lo que el usuario ya está mirando.
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      const visible = clientList.find((c) => c.visibilityState === 'visible');
      if (visible) {
        clientList.forEach((c) => c.postMessage({ type: 'erp-push', payload: data }));
        return undefined;
      }
      return self.registration.showNotification(title, options);
    })
  );
});

// Notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || '/';
  const fullUrl = targetUrl.startsWith('http') ? targetUrl : APP_ORIGIN + targetUrl;

  console.log('[SW ERP] Notification clicked, opening:', fullUrl);

  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.startsWith(APP_ORIGIN) && 'focus' in client) {
            client.navigate(fullUrl);
            return client.focus();
          }
        }
        return self.clients.openWindow(fullUrl);
      })
  );
});
