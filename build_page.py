#!/usr/bin/env python3
"""Make www/vlog/index.html = the live site page (main branch index.html) + virtual-time hooks + a scene script.
usage: python3 build_page.py <site index.html> <scene.js> <www dir>"""
import sys,os
site,scene,www=sys.argv[1:4]
s=open(site,encoding='utf-8').read()
head='''<title>꿈이룸</title><script>window.KKUM_BROKERS=["ws://127.0.0.1:8888"];
window.__vt=0;const __n0=Date.now();Date.now=()=>__n0+window.__vt;performance.now=()=>window.__vt;
let __raf=null;window.requestAnimationFrame=cb=>{__raf=cb;return 1;};
window.__step=ms=>{const k=window.__speedAt?window.__speedAt(window.__pt||0):1,n=Math.max(1,Math.ceil(k));window.__pt=(window.__pt||0)+ms/1000;if(window.__promoEvents)window.__promoEvents(window.__pt);if(window.__promoUI)window.__promoUI(window.__pt);for(let i=0;i<n;i++){window.__vt+=ms*k/n;const cb=__raf;__raf=null;if(cb)cb(window.__vt);}};
try{localStorage.setItem('dalbit.guide3d','true');localStorage.setItem('dalbit.ticketDown3d','true');localStorage.setItem('kkum.installNo',String(Date.now()));sessionStorage.setItem('kkum.stayInApp','1');}catch(e){}</script>
<link rel="stylesheet" href="/fs/gowun-batang/700.css"><link rel="stylesheet" href="/fs/ibm-plex-sans-kr/600.css"><link rel="stylesheet" href="/fs/gaegu/700.css">'''
for a,b in [('<title>꿈이룸</title>',head),('  T3.r.render(T3.scene,cam);','  if(window.__promoCam)window.__promoCam(cam,t);\n  T3.r.render(T3.scene,cam);'),('window.__kkStarted=true;','window.__kkStarted=true;\n'+open(scene,encoding='utf-8').read())]:
    assert s.count(a)==1,('anchor not found exactly once',a[:40]); s=s.replace(a,b)
os.makedirs(www+'/vlog',exist_ok=True); open(www+'/vlog/index.html','w',encoding='utf-8').write(s); print('built',www+'/vlog/index.html')
