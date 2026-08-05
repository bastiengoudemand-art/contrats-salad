/* Service worker — Passeport Collaborateur Salad&Co
   Stratégie "réseau d'abord" : en ligne, comportement inchangé (toujours la dernière version) ;
   hors ligne, on ressert la dernière copie en cache. Les appels Supabase (données) ne sont jamais mis en cache. */
const CACHE = 'saladco-passeport-v1';

self.addEventListener('install', e => { self.skipWaiting(); });

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  let url;
  try { url = new URL(req.url); } catch (err) { return; }
  // On ne gère que la page elle-même et les librairies CDN — jamais l'API Supabase.
  const cacheable = url.origin === self.location.origin || url.hostname === 'cdn.jsdelivr.net';
  if (!cacheable) return;
  e.respondWith(
    fetch(req).then(res => {
      if (res && res.ok) {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
      }
      return res;
    }).catch(() => caches.match(req).then(m => m || Response.error()))
  );
});
