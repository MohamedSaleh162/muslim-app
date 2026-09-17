const CACHE_NAME = "muslim-app-v11";
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

// 1.Storing files during application installation
self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("Files successfully cached.");
      return cache.addAll(assets);
    })
  );
});

// 2. Recovering files from a mobile phone when there is no internet
self.addEventListener("fetch", fetchEvent => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(res => {
      return res || fetch(fetchEvent.request);
    })
  );
});