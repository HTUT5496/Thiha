const CACHE_NAME = "finance-app-v6"; // Updated to v6 to register the history page
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./dashboard.html",
  "./history.html", // Added this so the History page works offline
  "./style.css",
  "./dashboard.css",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./apple-touch-icon.png",
];

// 1. Install Phase: Cache all files
self.addEventListener("install", (event) => {
  // Forces the new Service Worker to become active immediately
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("PWA: Caching all assets for offline use");
      return cache.addAll(ASSETS_TO_CACHE);
    }),
  );
});

// 2. Activate Phase: Clean up old versions of the app
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
      .then(() => self.clients.claim()), // Takes control of the page immediately
  );
});

// 3. Fetch Phase: Serve files from cache when offline
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return the file from cache, or try the network
      return (
        response ||
        fetch(event.request).catch(() => {
          // If offline and file not in cache, show the index page
          if (event.request.mode === "navigate") {
            return caches.match("./index.html");
          }
        })
      );
    }),
  );
});
