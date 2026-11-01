// Campfire bed for videos = exactly the site's campfire (the "morning" sound the owner likes: short crackles + small pops), rendered offline.
// usage: node fire.js out.wav [seconds]. Do NOT redesign this sound; the owner only ever asked to keep wind/hiss low.
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await b.newPage();
const b64=await p.evaluate(async(dur)=>{const sr=44100,ac=new OfflineAudioContext(2,sr*dur,sr),R=Math.random;
  const ev=ac.createBuffer(1,Math.round(sr*.6),sr);{const e=ev.getChannelData(0);for(let i=0;i<e.length;i++)e[i]=R()*2-1;}
  const out=ac.createGain();out.gain.value=.35*1.6;out.connect(ac.destination);
  const filt=(type,f,q)=>{const x=ac.createBiquadFilter();x.type=type;x.frequency.value=f;if(q)x.Q.value=q;return x;};
  const burst=(dest,t0,d,freq,q,peak,attack,type)=>{const s=ac.createBufferSource(),f=filt(type||'bandpass',freq,q),g=ac.createGain();s.buffer=ev;
    g.gain.setValueAtTime(.0001,t0);g.gain.exponentialRampToValueAtTime(peak,t0+(attack||.005));g.gain.exponentialRampToValueAtTime(.0001,t0+d);s.connect(f).connect(g).connect(dest);s.start(t0,Math.random()*.3);s.stop(t0+d+.05);};
  for(let t=.05;t<dur-.6;t+=.08){for(let n=R()<.55?1+Math.floor(R()*3):0;n>0;n--)burst(out,t+R()*.09,.004+R()*.008,1800+R()*5500,2.2,.08+R()*.26,.001);
    if(R()<.12)burst(out,t+R()*.05,.03,600+R()*500,2,.12+R()*.1,.002);}
  for(let t0=.3;t0<dur-.8;t0+=.65){const t=t0+R()*.5;if(R()<.18){burst(out,t,.06,900+R()*1400,1.5,.3+R()*.15,.002);for(let n=2+Math.floor(R()*5);n>0;n--)burst(out,t+.03+R()*.35,.006+R()*.01,3000+R()*4500,2,.05+R()*.12,.001);}}
  const buf=await ac.startRendering();const L=buf.getChannelData(0),Rr=buf.getChannelData(1),n=L.length;let pk=0;for(let i=0;i<n;i++)pk=Math.max(pk,Math.abs(L[i]));const g=.85/(pk||1);
  const ab=new ArrayBuffer(44+n*4),v=new DataView(ab);const ws=(o,s)=>{for(let i=0;i<s.length;i++)v.setUint8(o+i,s.charCodeAt(i));};
  ws(0,'RIFF');v.setUint32(4,36+n*4,true);ws(8,'WAVE');ws(12,'fmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,2,true);v.setUint32(24,sr,true);v.setUint32(28,sr*4,true);v.setUint16(32,4,true);v.setUint16(34,16,true);ws(36,'data');v.setUint32(40,n*4,true);
  for(let i=0,o=44;i<n;i++,o+=4){v.setInt16(o,Math.max(-1,Math.min(1,L[i]*g))*32767,true);v.setInt16(o+2,Math.max(-1,Math.min(1,Rr[i]*g))*32767,true);}
  let s='';const u=new Uint8Array(ab);for(let i=0;i<u.length;i+=32768)s+=String.fromCharCode.apply(null,u.subarray(i,i+32768));return btoa(s);},+(process.argv[3]||60));
fs.writeFileSync(process.argv[2],Buffer.from(b64,'base64'));await b.close();console.log('ok');})();
