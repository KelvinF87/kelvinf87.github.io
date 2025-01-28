const CACHE_NAME = 'gamer-pwa-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/styles/styles.css',
  '/js/app.js',
  '/js/juego.js',
  '/js/preguntas.js',
  '/js/vidas.js',
  '/img/icon-192x192.png',
  '/img/icon-512x512.png',
  '/sound/disparo.mp3',
  '/sound/final.mp3',
  '/sound/inicio.mp3',
  '/sound/suspensionp3',
  '/img/chicak.png',
  '/img/chicok.png',
  '/img/chicok1.png',
  '/img/disparo.png',
  '/img/disparo1.png',
  '/img/fondo2.jpeg',
  '/img/k45n.png',
  '/img/kf.png',
  '/img/kl.png',
  '/img/kr.png',
  '/img/mira.png',
  '/img/mundo.png',
  '/img/pirata.gif',
  '/img/pirata.jpg',
  '/img/pirata.png',
  '/img/sol.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});