/* Service worker: inafanya programu ifanye kazi bila mtandao.
   Badilisha VERSION kila unapobadilisha faili ili wateja wapate toleo jipya. */
const VERSION = "v1";
const CACHE = "mistari-ya-roho-" + VERSION;

const PRECACHE = [
  "./",
  "index.html",
  "css/app.css",
  "js/app.js",
  "data/verses.js",
  "manifest.webmanifest",
  "icons/favicon.svg",
  "icons/favicon-32.png",
  "icons/apple-touch-icon.png",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-maskable-512.png",
  "fonts/cormorant-garamond-latin-500-normal.woff2",
  "fonts/cormorant-garamond-latin-600-normal.woff2",
  "fonts/cormorant-garamond-latin-700-normal.woff2",
  "fonts/cormorant-garamond-latin-500-italic.woff2",
  "fonts/cormorant-garamond-latin-600-italic.woff2",
  "fonts/inter-latin-wght-normal.woff2"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Stale-while-revalidate: jibu mara moja kutoka kwenye hifadhi, sasisha nyuma ya pazia.
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(req, { ignoreSearch: true });
      const network = fetch(req)
        .then((res) => {
          if (res && res.status === 200) cache.put(req, res.clone());
          return res;
        })
        .catch(() => null);
      if (cached) {
        event.waitUntil(network);
        return cached;
      }
      const res = await network;
      if (res) return res;
      if (req.mode === "navigate") return cache.match("index.html");
      return new Response("", { status: 504, statusText: "Offline" });
    })
  );
});
