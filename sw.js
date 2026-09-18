const CACHE_NAME = "muslim-app-v17";
const assets = [
  "./",
  "./index.html",
  "./CSS/style.css",
  "./CSS/bootstrap.rtl.min.css",
  "./CSS/all.min.css",
  "./JS/main.js",
  "./JS/bootstrap.bundle.min.js",
  "./azkar.json",
  "./Images/Logo-app.png",
  "./Images/Hero.png",
  "./Images/Logo-removebg-preview (Edited).png",
];

self.addEventListener("install", (installEvent) => {
  self.skipWaiting();
  installEvent.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(assets);
    }),
  );
});

self.addEventListener("activate", (activateEvent) => {
  activateEvent.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key)),
      );
    }),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (fetchEvent) => {
  if (!fetchEvent.request.url.startsWith("http")) {
    return;
  }
  fetchEvent.respondWith(
    fetch(fetchEvent.request)
      .then((res) => {
        const resClone = res.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(fetchEvent.request, resClone);
        });
        return res;
      })
      .catch(() => {
        return caches.match(fetchEvent.request);
      }),
  );
});
