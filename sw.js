const CACHE_NAME = "muslim-app-v12";
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
  "./Images/Logo-removebg-preview (Edited).png"
];

// 1. File storage and skip the wait
self.addEventListener("install", installEvent => {
  self.skipWaiting();
  
  installEvent.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("Files successfully cached.");
      return cache.addAll(assets);
    })
  );
});

// 2. Activate the update and clear any old cache (this is the step you were missing).
self.addEventListener("activate", activateEvent => {
  activateEvent.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

// 3. Retrieving files (with or without an internet connection)
self.addEventListener("fetch", fetchEvent => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(res => {
      return res || fetch(fetchEvent.request);
    })
  );
});