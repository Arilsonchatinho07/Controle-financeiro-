const V='acm-v3',SHELL=['./','index.html','config.js','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request,u=new URL(r.url);
  if(r.method!=='GET'||u.hostname.endsWith('supabase.co'))return;
  const own=u.origin===location.origin&&!/\/icons\//.test(u.pathname);
  const net=fetch(r).then(res=>{if(res&&(res.ok||res.type==='opaque')){const c=res.clone();caches.open(V).then(ch=>ch.put(r,c))}return res});
  const cached=()=>caches.match(r).then(h=>h||caches.match('index.html'));
  // próprios ficheiros: rede primeiro, mas com limite de 3s; se falhar/demorar usa a cópia guardada (modo offline)
  if(own)e.respondWith(Promise.race([net,new Promise((_,rej)=>setTimeout(rej,3000))]).catch(cached));
  else e.respondWith(caches.match(r).then(h=>h||net));
});
