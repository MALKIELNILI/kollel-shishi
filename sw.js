const CACHE='kollel-shishi-v4';

self.addEventListener('install',e=>{
  self.skipWaiting(); // מפעיל SW חדש מיד ללא המתנה
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['./icon.svg','./manifest.json'])));
});

self.addEventListener('activate',e=>{
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
  );
  self.clients.claim(); // לוקח שליטה על כל הטאבים הפתוחים מיד
});

self.addEventListener('fetch',e=>{
  // HTML — תמיד מהרשת (כדי לקבל עדכונים)
  if(e.request.mode==='navigate'){
    e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));
  } else {
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
  }
});
