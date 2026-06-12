const CACHE_NAME = "nutrio-shell-v2";
const SHELL_ASSETS = [
  "/",
  "/manifest.json",
  "/favicon/android-chrome-192x192.png",
  "/favicon/android-chrome-512x512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.pathname.startsWith("/api/")) return;

  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request).then((response) => response || caches.match("/"))),
  );
});

self.addEventListener("push", (event) => {
  const data = event.data?.json() ?? { title: "Nutrio reminder", body: "Time to log your meals!" };
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/favicon/android-chrome-192x192.png",
      badge: "/favicon/android-chrome-192x192.png",
      vibrate: [200, 100, 200],
    }),
  );
});
