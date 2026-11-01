const {chromium}=require('playwright');const fs=require('fs');
const [,,out,mode]=process.argv;const FPS=24,DUR=+(process.env.DUR||44);const TEST=(process.env.TEST_TIMES||'2,8,14,20,26,32,38').split(',').map(Number);
(async()=>{const b=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});const errs=[];
const c=await b.newContext({viewport:{width:432,height:768},deviceScaleFactor:2.5});const p=await c.newPage();p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://127.0.0.1:8767/vlog/?room=3d-'+(90000+Math.floor(Math.random()*9999)),{waitUntil:'domcontentloaded',timeout:60000});
await p.waitForTimeout(6000);
for(let i=0;i<30;i++){await p.evaluate(()=>window.__step(16));if(await p.evaluate(()=>!!window.__startPromo&&document.querySelector('#world3d canvas')))break;await p.waitForTimeout(500);}
await p.waitForTimeout(1500);await p.evaluate(()=>document.fonts.ready);
await p.evaluate(()=>{window.__vt+=0;window.__startPromo();window.__pt=0;});
for(let i=0;i<5;i++)await p.evaluate(()=>{window.__step(1);window.__pt=0;});
fs.mkdirSync(out,{recursive:true});
const total=FPS*DUR,pick=mode==='test'?TEST.map(s=>Math.round(s*FPS)):null;
let t0=Date.now();
for(let f=0;f<total;f++){await p.evaluate(ms=>window.__step(ms),1000/FPS);
  if(pick&&f%96===0)console.log(f/24,JSON.stringify(await p.evaluate(()=>window.__dbg&&window.__dbg())));if(pick&&!pick.includes(f))continue;
  await p.screenshot({path:`${out}/f${String(f).padStart(4,'0')}.jpg`,type:'jpeg',quality:90});
  if(f%48===0)console.log('frame',f,Math.round((Date.now()-t0)/1000)+'s');}
console.log("done",JSON.stringify(errs.slice(0,5)),JSON.stringify(await p.evaluate(()=>window.__dbg&&window.__dbg())));await b.close();})();
