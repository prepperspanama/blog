const CACHE_NAME = 'preppers-panama-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/blog',
  '/about',
  '/globals.css',
  '/logo.png',
  '/hero.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((fetchResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          // Cache only same-origin requests and successful ones
          if (event.request.url.startsWith(self.location.origin) && fetchResponse.status === 200) {
            cache.put(event.request, fetchResponse.clone());
          }
          return fetchResponse;
        });
      });
    }).catch(() => {
      // If both fail (offline and not in cache), return a fallback if it's a page request
      if (event.request.mode === 'navigate') {
        return caches.match('/');
      }
    })
  );
});
