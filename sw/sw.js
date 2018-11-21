var CACHE_NAME = 'cache';
var CACHE_PATHS = [
  '',
  'images/icon2-16.png',
  'images/icon2-48.png',
  'images/icon2-128.png',
];

function log(msg) {
  console.log('[sw] ' + msg);
}

self.addEventListener('install', evt => {
  log('install');
  evt.waitUntil(caches.open(CACHE_NAME).then(cache => {
    cache.addAll(CACHE_PATHS).then(() => {
      log('cache.addAll');
      self.skipWaiting();
      self.clients.claim();
    });
  }));
});

self.addEventListener('activate', evt => {
  log('activate');
});

self.addEventListener('fetch', evt => {
  log('fetch ' + evt.request.url);
  evt.respondWith(caches.match(evt.request).then(response => {
    if (response) {
      log('cache hit');
      return response;
    }
    log ('cache miss');
    let req = evt.request.clone();
    return fetch(req).then(fetchResponse => {
      return fetchResponse;
    }).catch(err => {
      log('fetch error: ' + err);
      throw err;
    });
  }));
});
