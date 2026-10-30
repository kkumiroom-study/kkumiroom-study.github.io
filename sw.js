// 홈 화면 추가용. 페이지 요청은 건드리지 않고 그대로 인터넷에서 받아와요.
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',()=>{});
