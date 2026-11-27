/* Service worker «Акулячого Зуба»: зберігає гру на телефоні, щоб вона відкривалась без інтернету.
   Нові файли, яких немає в списку CORE, теж кешуються, щойно гра їх один раз завантажить з інтернетом. */
const V='akzub-v1';
const CORE=["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "images/banner.webp", "images/bg_day.webp", "images/bg_heat.webp", "images/bg_night.webp", "images/bg_rain.webp", "images/bg_sea.webp", "images/bg_storm.webp", "images/c_amulet.webp", "images/c_antidote.webp", "images/c_axe.webp", "images/c_ballot.webp", "images/c_banana.webp", "images/c_barometer.webp", "images/c_berries.webp", "images/c_betray.webp", "images/c_bottle.webp", "images/c_bucket.webp", "images/c_can.webp", "images/c_catcher.webp", "images/c_cave.webp", "images/c_chest.webp", "images/c_coconut.webp", "images/c_compass.webp", "images/c_crabs.webp", "images/c_dance.webp", "images/c_dolphin.webp", "images/c_fever.webp", "images/c_fire.webp", "images/c_flare.webp", "images/c_flask.webp", "images/c_gift.webp", "images/c_gull.webp", "images/c_gun.webp", "images/c_map.webp", "images/c_medkit.webp", "images/c_megaphone.webp", "images/c_monkeys.webp", "images/c_native.webp", "images/c_net.webp", "images/c_oath.webp", "images/c_oldfisher.webp", "images/c_parrot.webp", "images/c_patron.webp", "images/c_pirates.webp", "images/c_planks.webp", "images/c_raid.webp", "images/c_rain.webp", "images/c_rod.webp", "images/c_rope.webp", "images/c_rumor.webp", "images/c_sail.webp", "images/c_sand.webp", "images/c_shark.webp", "images/c_shell.webp", "images/c_snake.webp", "images/c_spear.webp", "images/c_spring.webp", "images/c_spy.webp", "images/c_spyglass.webp", "images/c_stash.webp", "images/c_storm.webp", "images/c_swap.webp", "images/c_termites.webp", "images/c_thief.webp", "images/c_trap.webp", "images/c_treasure.webp", "images/c_turtle.webp", "images/c_volcano.webp", "images/c_wave.webp", "images/e_calm.webp", "images/e_drift.webp", "images/e_find.webp", "images/e_fire.webp", "images/e_fog.webp", "images/e_heat.webp", "images/e_moon.webp", "images/e_poison.webp", "images/e_rainbow.webp", "images/e_sharks.webp", "images/e_shoal.webp", "images/e_wind.webp", "images/h_capt.webp", "images/h_carp.webp", "images/h_cook.webp", "images/h_diplo.webp", "images/h_diver.webp", "images/h_doc.webp", "images/h_fisher.webp", "images/h_lucky.webp", "images/h_scout.webp", "images/h_shaman.webp", "images/h_sly.webp", "images/h_thief.webp", "images/map.webp", "images/r_cast.webp", "images/r_res.webp", "images/r_spy.webp", "images/r_team.webp", "images/sp_barrel.webp", "images/sp_basket.webp", "images/sp_crab.webp", "images/sp_crate.webp", "images/sp_fin.webp", "images/sp_fire.webp", "images/sp_logs.webp", "images/sp_raft.webp", "images/sp_sail.webp", "videos/dry.jpg", "videos/dry.mp4", "videos/exile.jpg", "videos/exile.mp4", "videos/feast.jpg", "videos/feast.mp4", "videos/fish.jpg", "videos/fish.mp4", "videos/fish0.jpg", "videos/lose.jpg", "videos/lose.mp4", "videos/rain.jpg", "videos/rain.mp4", "videos/search.jpg", "videos/search.mp4", "videos/shot.jpg", "videos/shot.mp4", "videos/sick.jpg", "videos/sick.mp4", "videos/snake.jpg", "videos/snake.mp4", "videos/storm.jpg", "videos/storm.mp4", "videos/win.jpg", "videos/win.mp4", "videos/wood.jpg", "videos/wood.mp4"];
const EXT=['https://unpkg.com/peerjs@1.5.4/dist/peerjs.min.js','https://fonts.googleapis.com/css2?family=Rubik:wght@400;600;800&family=Russo+One&display=swap'];
const EXT_HOSTS=/^(unpkg\.com|fonts\.googleapis\.com|fonts\.gstatic\.com)$/;
self.addEventListener('install',e=>e.waitUntil((async()=>{
  const c=await caches.open(V);
  await Promise.allSettled(CORE.map(u=>c.add(new Request(u,{cache:'reload'}))));
  await Promise.allSettled(EXT.map(u=>fetch(u).then(r=>r.ok&&c.put(u,r))));
  self.skipWaiting()})()));
self.addEventListener('activate',e=>e.waitUntil((async()=>{
  for(const k of await caches.keys())if(k.startsWith('akzub-')&&k!==V)await caches.delete(k);
  await self.clients.claim();(await self.clients.matchAll()).forEach(c=>c.postMessage('akzub-cached'))})()));
async function ranged(req){
  const c=await caches.open(V);let res=await c.match(req.url);
  if(!res){try{res=await fetch(req.url);if(res.ok)await c.put(req.url,res.clone());else return res}catch(e){return Response.error()}}
  const b=await res.blob(),m=/bytes=(\d*)-(\d*)/.exec(req.headers.get('range')||'');let s=0,en=b.size-1;
  if(m){if(m[1]){s=+m[1];if(m[2])en=Math.min(+m[2],b.size-1)}else if(m[2]){s=Math.max(0,b.size-+m[2])}}
  return new Response(b.slice(s,en+1),{status:206,headers:{'Content-Type':res.headers.get('Content-Type')||'video/mp4','Content-Range':`bytes ${s}-${en}/${b.size}`,'Content-Length':String(en-s+1),'Accept-Ranges':'bytes'}})}
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
  if(u.origin!==location.origin&&!EXT_HOSTS.test(u.hostname))return;
  if(r.headers.has('range'))return e.respondWith(ranged(r));
  e.respondWith((async()=>{
    const c=await caches.open(V),nav=r.mode==='navigate';
    const hit=await c.match(r,{ignoreSearch:nav});
    const net=fetch(r).then(res=>{if(res&&(res.ok||res.type==='opaque'))c.put(r,res.clone()).catch(()=>{});return res}).catch(()=>null);
    if(hit){e.waitUntil(net);return hit}
    const res=await net;if(res)return res;
    if(nav&&u.pathname.endsWith('/')){const f=await c.match(u.pathname+'index.html');if(f)return f}
    return new Response('Немає інтернету',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}})})())});
