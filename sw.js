// 항상 최신 버전을 먼저 받아오고, 인터넷이 끊겼을 때만 저장본을 보여줘요.
const CACHE='kkum-v1';
self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.origin!==location.origin)return;
  e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{
    if(r.ok){const c=r.clone();caches.open(CACHE).then(k=>k.put(e.request,c));}
    return r;
  }).catch(()=>caches.match(e.request).then(r=>r||caches.match('/'))));
});
