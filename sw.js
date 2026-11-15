const C='tailors-desk-v4',F=['./','index.html','manifest.json','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>Promise.all(F.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
// Open instantly from the saved copy, and refresh the saved copy quietly in the background.
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin)return;
  e.respondWith(caches.match(e.request).then(hit=>{
    const net=fetch(e.request,{cache:'no-cache'}).then(n=>{if(n&&n.ok){const k=n.clone();caches.open(C).then(c=>c.put(e.request,k))}return n}).catch(()=>null);
    e.waitUntil(net);
    return hit||net.then(r=>r||caches.match('index.html'));
  }));
});
