const STATIC_CACHE_NAME = 'static-cache-v1.2';
const INMUTABLE_CACHE_NAME = 'inmutable-cache-v1.1';
const DYNAMIC_CACHE_NAME = 'dynamic-cache-v1.1';


const cleanCache = (cacheName, limitItems) => {
  caches.open(cacheName).then((cache) => {
    return cache.keys().then((keys) => {
      if (keys.length > limitItems) {
        cache.delete(keys[0]).then(cleanCache(cacheName, limitItems));
      }
    });
  });
};


self.addEventListener('install', (event) => {
  const respCache = caches.open(STATIC_CACHE_NAME).then((cache) => {
    return cache.addAll([
     '/foto/',
      '/foto/index.html',
      '/foto/images/icons/android-launchericon-72-72.png',
      '/foto/images/icons/android-launchericon-96-96.png',
      '/foto/images/icons/android-launchericon-144-144.png',
      '/foto/images/icons/android-launchericon-192-192.png',
      '/foto/images/icons/android-launchericon-512-512.png',
      '/foto/manifest.json',
    ]);
  });
  const respCacheInmutable = caches.open(INMUTABLE_CACHE_NAME).then((cache) => {
    return cache.addAll([
      'https://fonts.googleapis.com/icon?family=Material+Icons',
      'https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css',
      'https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js'

    ]);
  });

  event.waitUntil(Promise.all([respCache, respCacheInmutable]));
});


self.addEventListener('activate', (event) =>{
    const proDelete = caches.keys().then(cachesItems =>{

      cachesItems.forEach(element =>{
        if(element !== STATIC_CACHE_NAME && element.includes('static')){
          return caches.delete(element)
        }
      })

    })

    event.waitUntil(Promise.all([proDelete]));
})

self.addEventListener('fetch', (event) => {
  const resp = caches.match(event.request).then((respCache) => {
    if (respCache) {
      return respCache;
    }
    return fetch(event.request).then((respWeb) => {
      caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
        cache.put(event.request, respWeb);
        cleanCache(DYNAMIC_CACHE_NAME, 10);
      });
      return respWeb.clone();
    }).catch((err) => {
    
    });
  });
  event.respondWith(resp);
});
