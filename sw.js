const CACHE_NAME = 'wordquest-mobile-v1';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './assets/logo.png',
  './assets/bg-desktop.png',
  './assets/bg-mobile.png',
  './assets/bgm.mp3',
  './assets/CLICK3.WAV',
  './assets/kengmakka.mp3',
  './assets/longeekkang.mp3'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL).catch(() => null))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;

  // Do not cache Apps Script/API calls; always go network-first.
  if (req.url.includes('script.google.com') || req.url.includes('googleusercontent.com')) {
    return;
  }

  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;

      return fetch(req).then(response => {
        const copy = response.clone();

        if (req.method === 'GET' && response.ok) {
          caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
        }

        return response;
      });
    })
  );
});
