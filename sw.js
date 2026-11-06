// ZettoPay (GitHub র‍্যাপার) service worker — ইনস্টল যোগ্যতা + দ্রুত খোলা।
var CACHE = 'zp-shell-v3';
var PRE = ['icons/icon-192.png', 'icons/icon-512.png'];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(PRE); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin) return;   // Apps Script-এর কলে হাত দেয় না
  if (u.pathname.indexOf('/icons/') !== -1) { e.respondWith(caches.match(r).then(function (h) { return h || fetch(r); })); return; }
  e.respondWith(fetch(r).then(function (res) { var c = res.clone(); caches.open(CACHE).then(function (x) { x.put(r, c); }); return res; })
    .catch(function () { return caches.match(r); }));
});
