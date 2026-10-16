/* Kent Bostanları — Güz 2026 Rehberi
   Service worker.

   SÜRÜM YÜKSELTME: içerik veya tasarım her değiştiğinde aşağıdaki
   CACHE_VERSION satırındaki sayıyı bir artırın. Eski cache otomatik
   silinir ve kullanıcıya "Yeni sürüm hazır" bildirimi gösterilir.      */

const CACHE_VERSION = 'v16';
const CACHE_NAME = `kb-guz2026-${CACHE_VERSION}`;

const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './maskable-192.png',
  './maskable-512.png',
  './apple-touch-icon.png',
  './favicon-32.png',
  './img-derinlik.jpg',
  './img-sasirtma.jpg',
  './img-seyreltme.jpg',
  './img-saklama.jpg',
  './img-kislik-hasat.jpg',
  './img-tunel.jpg',
  './img-fidelik.jpg',
  './img-brokoli-hasat.jpg',
  './img-kapak.jpg',
  './img-malc.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .catch(() => { /* tek bir dosya düşse de kurulum sürsün */ })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k.startsWith('kb-guz2026-') && k !== CACHE_NAME)
            .map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // HTML: önce ağ (güncel içerik), olmazsa cache
  if (req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((r) => r || caches.match('./index.html')))
    );
    return;
  }

  // Diğer dosyalar: önce cache, arkada tazele
  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req).then((res) => {
        if (res && res.status === 200) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, copy));
        }
        return res;
      }).catch(() => cached);
      return cached || network;
    })
  );
});
