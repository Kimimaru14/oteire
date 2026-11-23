// オフラインでも開けるようにするためのキャッシュ（データはスマホ内に保存され、送信はしません）
const CACHE = 'otteire-v5';
const FILES = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/icon-180.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  if(e.request.method !== 'GET') return;
  // 新しい版を優先し、つながらないときだけキャッシュを使う
  e.respondWith(fetch(e.request).then(r => { if(new URL(e.request.url).origin === location.origin){ const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); } return r; }).catch(() => caches.match(e.request)));
});
