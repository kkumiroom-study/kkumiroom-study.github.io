const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const dir=process.argv[2],names=(process.argv[3]||'jazz,bossa,piano,chill').split(','),dur=+(process.argv[4]||40);
const b=await chromium.launch();const p=await b.newPage();await p.goto('file://'+dir+'/gen.html');
for(const n of names){const b64=await p.evaluate(([n,d])=>render(n,d),[n,dur]);fs.writeFileSync(dir+'/'+n+'.wav',Buffer.from(b64,'base64'));console.log(n,'done');}
await b.close();})();
