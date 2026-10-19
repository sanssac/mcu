/**
 * MCU Nexus — Progressive Web App Service Worker
 * Version: v1.5.2
 * Provides offline caching, network-resilient fallbacks, and instant PWA loading.
 */

const CACHE_NAME = "mcu-nexus-v1.5.2";
const FONT_CACHE_NAME = "mcu-nexus-fonts-v1";
const IMAGE_CACHE_NAME = "mcu-nexus-images-v1";

const CORE_ASSETS = [
  "./",
  "./index.html",
  "./shows.html",
  "./upcoming.html",
  "./faq.html",
  "./changelog.html",
  "./mcu-viewing-order.html",
  "./style.css?v=1.5.2",
  "./style.css",
  "./script.js?v=1.5.2",
  "./script.js",
  "./data.js?v=1.5.2",
  "./data.js",
  "./manifest.json",
  "./favicon/icon.svg",
  "./favicon/favicon-96x96.png",
  "./favicon/apple-touch-icon.png",
  "./favicon/icon-192.png",
  "./favicon/icon-512.png",
  "./mcu-embed.png",
  "./assets/menubar/home.svg",
  "./assets/menubar/articles.svg",
  "./assets/menubar/products.svg",
  "./assets/menubar/faq.svg",
  "./assets/menubar/changelog.svg",
  "./assets/menubar/import.svg",
  "./assets/menubar/toggletheme.svg",
  "./assets/journeys/stark.webp",
  "./assets/journeys/cap.webp",
  "./assets/journeys/thor.webp",
  "./assets/journeys/wanda.webp",
  "./assets/journeys/spiderman.webp",
  "./assets/journeys/guardians.webp",
  "./assets/journeys/strange.webp",
  "./assets/journeys/tesseract.webp",
  "./assets/silhouettes/mjolnir.webp",
  "./assets/silhouettes/panther.webp",
  "./assets/silhouettes/portal.webp",
  "./assets/silhouettes/reactor.webp",
  "./assets/silhouettes/shield.webp",
  "./assets/silhouettes/web.webp",
  "./assets/hero-silhouette.webp"
];

// ─── Install Event: Pre-cache Core Shell ───
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Use Promise.allSettled so a single missing optional asset doesn't abort caching
      return Promise.allSettled(
        CORE_ASSETS.map((url) =>
          cache.add(url).catch((err) => {
            console.warn(`[SW] Pre-cache skipped for: ${url}`, err);
          })
        )
      );
    }).then(() => self.skipWaiting())
  );
});

// ─── Activate Event: Purge Stale Caches ───
self.addEventListener("activate", (event) => {
  const currentCaches = [CACHE_NAME, FONT_CACHE_NAME, IMAGE_CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!currentCaches.includes(cacheName)) {
            console.log(`[SW] Deleting stale cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// ─── Fetch Event: Adaptive Caching Strategies ───
self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Ignore non-GET requests or unsupported schemes (chrome-extension, etc.)
  if (request.method !== "GET" || !url.protocol.startsWith("http")) {
    return;
  }

  // 1. Navigation Requests (HTML Pages): Network-First with Cache Fallback
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return networkResponse;
        })
        .catch(async () => {
          // Offline fallback
          const cachedResponse = await caches.match(request);
          if (cachedResponse) return cachedResponse;

          // If specific page not found, return index.html
          const indexFallback = await caches.match("./index.html");
          if (indexFallback) return indexFallback;

          return new Response("Offline - MCU Nexus content unavailable", {
            status: 503,
            statusText: "Service Unavailable",
            headers: { "Content-Type": "text/plain" }
          });
        })
    );
    return;
  }

  // 2. Google Fonts & Fonts CDN: Stale-While-Revalidate
  if (url.origin === "https://fonts.googleapis.com" || url.origin === "https://fonts.gstatic.com") {
    event.respondWith(
      caches.open(FONT_CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(request);
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // 3. TMDB Movie Posters: Cache-First with Network Fallback
  if (url.origin === "https://image.tmdb.org") {
    event.respondWith(
      caches.open(IMAGE_CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(request);
        if (cachedResponse) return cachedResponse;

        return fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => {
            // Return empty response so onerror triggers local SVG fallback gracefully
            return new Response(null, { status: 404, statusText: "Offline Image" });
          });
      })
    );
    return;
  }

  // 4. Local Core Assets (CSS, JS, local icons): Stale-While-Revalidate
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
