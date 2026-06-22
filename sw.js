const CACHE_NAME = 'wordquest-mobile-v2';

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
  './assets/passlevel.mp3'
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
      .then(keys =>
        Promise.all(
          keys
            .filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;

  // ไม่ยุ่งกับ POST หรือ method อื่น
  if (req.method !== 'GET') {
    return;
  }

  // ไม่ cache Apps Script / Google Drive / Googleusercontent
  if (
    req.url.includes('script.google.com') ||
    req.url.includes('googleusercontent.com') ||
    req.url.includes('googleapis.com')
  ) {
    return;
  }

  // สำคัญมาก:
  // ไฟล์เสียง/วิดีโอบางครั้ง browser โหลดแบบ Range แล้วได้ status 206
  // Cache API ไม่รองรับ 206 จึงต้องปล่อยผ่าน network ไปเลย
  if (req.headers.has('range')) {
    event.respondWith(fetch(req));
    return;
  }

  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) {
        return cached;
      }

      return fetch(req)
        .then(response => {
          // สำคัญ:
          // cache เฉพาะ response ปกติ status 200 เท่านั้น
          // ห้ามใช้ response.ok เพราะ 206 ก็ ok เหมือนกัน
          if (
            response &&
            response.status === 200 &&
            (response.type === 'basic' || response.type === 'cors')
          ) {
            const copy = response.clone();

            caches.open(CACHE_NAME).then(cache => {
              cache.put(req, copy).catch(err => {
                console.warn('Cache put skipped:', err);
              });
            });
          }

          return response;
        })
        .catch(() => {
          // ถ้าเปิดหน้าเว็บตอน offline ให้ fallback ไป index.html
          if (req.mode === 'navigate') {
            return caches.match('./index.html');
          }

          return caches.match(req);
        });
    })
  );
});
