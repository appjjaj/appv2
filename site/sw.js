const CACHE = 'ajhub-cloud-v224';
const ASSETS = ['./','./index.html','./app.js','./dash.js','./spine.js','./bg.jpg','./aj-logo.png','./config.js','https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js','./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS).catch(()=>{}))); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k!==CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  if (/\/(auth|rest|realtime|storage|functions)\/v[0-9]/.test(url.pathname)) return; // Supabase API -> network
  const sameOrigin = url.origin === self.location.origin;
  const isShell = e.request.mode === 'navigate' || (sameOrigin && /\.(html|js|css|webmanifest)$/.test(url.pathname)) || (sameOrigin && (url.pathname === '/' || url.pathname.endsWith('/')));
  if (isShell) {
    // network-first: always try the latest, fall back to cache offline
    e.respondWith(
      fetch(e.request).then(resp => {
        const copy = resp.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)).catch(()=>{}); return resp;
      }).catch(() => caches.match(e.request).then(r => r || (e.request.mode === 'navigate' ? caches.match('./index.html') : undefined)))
    );
    return;
  }
  // icons / CDN libs: cache-first
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(resp => {
      const copy = resp.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)).catch(()=>{}); return resp;
    }).catch(() => undefined))
  );
});
