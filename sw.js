const CACHE_NAME = "finance-app-v7"; // Updated to v7 for the new .js files
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./index.js",        // New file added
  "./dashboard.html",
  "./dashboard.js",    // New file added
  "./history.html",
  "./style.css",
  "./dashboard.css",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./apple-touch-icon.png",
];

// 1. Install Phase
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("PWA: Caching new assets (separated JS files)");
      return cache.addAll(ASSETS_TO_CACHE);
    }),
  );
});

// 2. Activate Phase
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cache) => {
            if (cache !== CACHE_NAME) {
              console.log("PWA: Deleting old cache version:", cache);
              return caches.delete(cache);
            }
          }),
        );
      })
      .then(() => self.clients.claim()),
  );
});

// 3. Fetch Phase
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).catch(() => {
          if (event.request.mode === "navigate") {
            return caches.match("./index.html");
          }
        })
      );
    }),
  );
});
