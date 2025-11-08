const BASE = "/sapporo-inbound-map";
const CACHE_NAME = "sapporo-map-v4";
const urlsToCache = [ `${BASE}/`, `${BASE}/en/`, `${BASE}/ja/` ];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)));
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (!url.pathname.startsWith(BASE)) return; // 他ドメイン/他パスは素通り
  event.respondWith(
    caches.match(event.request).then((res) => res || fetch(event.request))
  );
});
