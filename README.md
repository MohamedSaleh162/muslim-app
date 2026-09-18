# 🌙 Muslim App - Progressive Web App (PWA)

A fully responsive, high-performance Progressive Web Application (PWA) designed to provide a comprehensive, ad-free Islamic environment. It serves as a daily companion offering Azkar, Quran reading, Hadith, and accurate Prayer Times.

## 🚀 Live Demo
[Visit Muslim App](https://muslim-app.vercel.app/)

## ✨ Key Features

* **PWA & Offline Support:** Fully installable on Desktop, iOS, and Android. Utilizes advanced Service Workers and Cache Storage APIs for seamless offline access and instant loading.
* **Smart Installation UX:** Features a custom, animated installation button that dynamically responds to the browser's `beforeinstallprompt` event.
* **Single Page Application (SPA) Architecture:** Smooth, reload-free navigation across different sections using vanilla JavaScript History API and DOM manipulation.
* **Soft Dark Mode:** Expertly designed dark theme optimized for AMOLED screens (using soft `#121212` backgrounds) to reduce eye strain and provide a premium reading experience, with dynamic theme toggling.
* **Real-time APIs Integration:** 
  * Fetches accurate, location-based prayer times (`AlAdhan API`).
  * Retrieves full Quran Surahs and Juzs (`AlQuran Cloud API`).
  * Loads authenticated Hadiths (`Hadith API`).
* **Interactive Progress Tracking:** Dynamic circular progress indicators for daily Azkar, with progress automatically saved locally using `localStorage`.

## 🛠️ Tech Stack & Technologies

* **Core:** HTML5, CSS3, JavaScript (ES6+)
* **Styling Framework:** Bootstrap 5 (RTL) for perfect Arabic typography and responsive grid layouts.
* **Icons:** FontAwesome
* **Performance:** Network-First Service Worker Strategy, Lazy Loading, Optimized DOM manipulation.

## 📊 Lighthouse Scores
The application is heavily optimized for maximum performance across all devices, achieving near-perfect Lighthouse scores:
* **Performance:** 93 Desktop / 96 Mobile
* **Accessibility:** 95
* **Best Practices:** 100
* **SEO:** 100

## 👨‍💻 Author

**Mohamed Saleh**
* Undergrad Computer Science Student