/* Viewfinder Map service worker: offline app shell, libraries and map imagery.
   Scene data (buildings, terrain) is cached separately by the app in IndexedDB. */
const VERSION = 'vfm-3.0.0';
const APP_CACHE = 'app-' + VERSION, LIB_CACHE = 'libs-v1', TILE_CACHE = 'tiles-v1';
const APP = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];
const LIB_HOSTS = /(^|\.)(cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net|unpkg\.com)$/;
const TILE_HOSTS = /basemaps\.cartocdn\.com|arcgisonline\.com|maptiles\.arcgis\.com|tile\.openstreetmap\.org|tile\.openstreetmap\.fr|tile-cyclosm\.openstreetmap\.fr|opentopomap\.org|tiles\.maps\.eox\.at|nationalmap\.gov|tile\.googleapis\.com|api\.mapbox\.com|api\.maptiler\.com|tiles\.stadiamaps\.com/;

self.addEventListener('install', e => { e.waitUntil(caches.open(APP_CACHE).then(c => c.addAll(APP)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('app-') && k !== APP_CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // the app itself: network first (so updates show up), cache when offline
  if (url.origin === self.location.origin) {
    e.respondWith(fetch(req).then(r => { if (r.ok) { const c = r.clone(); caches.open(APP_CACHE).then(ca => ca.put(req, c)); } return r; })
      .catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match('./index.html'))));
    return;
  }
  // versioned libraries: cache first
  if (LIB_HOSTS.test(url.hostname)) {
    e.respondWith(caches.open(LIB_CACHE).then(c => c.match(req).then(hit => hit || fetch(req).then(r => { if (r.ok || r.type === 'opaque') c.put(req, r.clone()); return r; }))));
    return;
  }
  // map imagery: cache first, fill on the way (opaque responses can't serve CORS requests such as 3D draping)
  if (TILE_HOSTS.test(url.hostname)) {
    e.respondWith(caches.open(TILE_CACHE).then(c => c.match(req).then(hit => {
      if (hit && !(hit.type === 'opaque' && req.mode === 'cors')) return hit;
      return fetch(req).then(r => { if (r.ok || r.type === 'opaque') c.put(req, r.clone()); return r; }).catch(() => hit || Response.error());
    })));
  }
});
