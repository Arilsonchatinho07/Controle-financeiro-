// AC Midia Pro — Service Worker v4 (offline-first)
const V='acm-v4';
const LOCAL=['./','index.html','config.js','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','icons/icon-maskable-512.png'];
const CDN=[
  'https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js',
  'https://cdn.jsdelivr.net/npm/htm@3.1.1/dist/htm.umd.js',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.58.0/dist/umd/supabase.js',
  'https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&display=swap'
];
// Instalação: guarda TUDO (ficheiros da app + bibliotecas externas) para funcionar sem internet.
// Cada ficheiro é guardado em separado: se um falhar, os outros continuam.
self.addEventListener('install',e=>{e.waitUntil((async()=>{
  const c=await caches.open(V);
  await Promise.all([
    ...LOCAL.map(u=>c.add(new Request(u,{cache:'reload'})).catch(()=>{})),
    ...CDN.map(u=>fetch(u,{mode:'no-cors',cache:'reload'}).then(r=>c.put(u,r)).catch(()=>{}))
  ]);
  await self.skipWaiting();
})())});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET'||u.hostname.endsWith('supabase.co'))return;   // dados vão sempre à rede (a app trata o offline)
  const own=u.origin===location.origin;
  const store=res=>{if(res&&(res.ok||res.type==='opaque')){const c=res.clone();caches.open(V).then(ch=>ch.put(r,c))}return res};
  if(own){
    // ficheiros da app: rede primeiro (3s no máximo) para receber atualizações; sem rede abre a cópia guardada
    const net=fetch(r).then(store);
    const fallback=()=>caches.match(r,{ignoreSearch:true}).then(h=>h||(r.mode==='navigate'?caches.match('index.html'):undefined)||caches.match('./'));
    e.respondWith(Promise.race([net,new Promise((_,rej)=>setTimeout(rej,3000))]).catch(fallback));
  }else{
    // bibliotecas e fontes: cópia guardada primeiro
    e.respondWith(caches.match(r).then(h=>h||fetch(r).then(store)));
  }
});
