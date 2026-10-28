'use strict';
// This worker owns only this independent application's exact path.
const BASE='/jinshou-material-management/',CACHE='jinshou-material-management-shell-v1';
const ASSETS=['offline.html','manifest.webmanifest','material-totals.css','material-totals.js','app.js','app-config.js','pwa.js','shared-inventory-client.js','shared-inventory-queue.js','icons/icon-192.png','icons/icon-512.png','icons/icon-maskable-512.png','icons/apple-touch-icon.png'];
const allowed=new Set(ASSETS.map(path=>BASE+path));
const inOwnScope=self.location.pathname===BASE+'sw.js';
self.addEventListener('install',event=>{if(!inOwnScope)return;event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS.map(path=>new Request(BASE+path,{cache:'reload'})))))});
self.addEventListener('activate',event=>{if(!inOwnScope)return;event.waitUntil((async()=>{for(const name of await caches.keys())if(name.startsWith('jinshou-material-management-shell-')&&name!==CACHE)await caches.delete(name);await self.clients.claim()})())});
self.addEventListener('fetch',event=>{
 if(!inOwnScope)return;
 const request=event.request,url=new URL(request.url);
 // Login, bridge, API, cross-origin, non-GET and query-bearing requests bypass Cache API entirely.
 if(request.method!=='GET'||url.origin!==self.location.origin)return;
 const isHome=request.mode==='navigate'&&(url.pathname===BASE||url.pathname===BASE+'index.html');
 if(isHome){event.respondWith((async()=>{try{return await fetch(request,{cache:'no-store'})}catch{const cached=await caches.match(BASE+'offline.html');return cached||new Response('<!doctype html><meta charset="utf-8"><title>資材総数管理</title><p>オフラインです。ネットワークに接続してから開き直してください。保存済みの数量は表示していません。</p>',{status:503,headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}})}})());return}
 if(url.search||!allowed.has(url.pathname))return;
 event.respondWith((async()=>{try{const response=await fetch(request,{cache:'no-cache'});if(response.ok&&response.type==='basic'&&!response.headers.has('set-cookie')){const cache=await caches.open(CACHE);await cache.put(request,response.clone())}return response}catch{const cached=await caches.match(request);return cached||Response.error()}})());
});
