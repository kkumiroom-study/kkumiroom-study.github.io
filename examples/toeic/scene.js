window.__startPromo=()=>{(function vlog(){
  document.body.classList.add('promo');
  const css=document.createElement('style');css.textContent=`body.promo .hud>.top,body.promo #joy,body.promo #lookL,body.promo #lookR,body.promo #guide3d,body.promo #install,body.promo #sndHint,body.promo .view-ctl,body.promo #chatBtn,body.promo #seatBtn,body.promo #hint,body.promo #goingBar,body.promo #moodBtn,body.promo #lunchBtn,body.promo #feed{display:none!important}
  body.promo #toast{top:186px!important}
  #pv{position:fixed;inset:0;pointer-events:none;z-index:40}
  #pv .date{position:absolute;left:18px;top:22px;color:#fff6e6;font:700 23px "Gaegu",cursive;text-shadow:0 2px 10px rgba(0,0,0,.7);transform:rotate(-3deg);letter-spacing:.5px}
  #pv .date small{display:block;font-size:17px;opacity:.85;margin-top:2px}
  #pv .cap{position:absolute;left:22px;right:22px;bottom:178px;text-align:center;color:#fff;font:700 27px/1.35 "Gaegu",cursive;text-shadow:0 2px 12px rgba(0,0,0,.9),0 0 3px rgba(0,0,0,.9);opacity:0;word-break:keep-all}
  #pv .stk{position:absolute;padding:9px 14px 8px;border-radius:14px;background:#fff7e3;color:#3a2a14;font:700 21px "Gaegu",cursive;box-shadow:0 6px 18px rgba(0,0,0,.35);opacity:0;white-space:nowrap}
  #pv .stk:after{content:"";position:absolute;left:50%;top:-9px;width:46px;height:16px;margin-left:-23px;background:rgba(255,214,140,.75);transform:rotate(-4deg)}
  #pv .url{position:absolute;left:0;right:0;bottom:46px;text-align:center;color:rgba(255,246,230,.75);font:600 14px "IBM Plex Sans KR",sans-serif;letter-spacing:.5px;opacity:0}`;
  document.head.append(css);
  const pv=document.createElement('div');pv.id='pv';pv.innerHTML=`<div class="date">11.01 일요일<small>토익 다시 시작 Day 1 ✏️</small></div>
   <div class="stk" id="stG" style="right:20px;top:120px;transform:rotate(3deg)">🎯 목표 : 토익 900 → 승진!</div>
   <div class="stk" id="stT" style="left:22px;top:122px;transform:rotate(-3deg)">⏱ 1시간 뒤…</div>
   <div class="stk" id="stF" style="right:20px;top:122px;transform:rotate(2deg)">🔥 모닥불 소리 ON</div>
   <div class="stk" id="stE" style="left:50%;top:40%;transform:translateX(-50%) rotate(-2deg);font-size:25px">오늘 공부 2시간 ✔︎</div>
   <div class="cap" id="cap"></div><div class="url" id="url">kumiroom.com</div>`;
  document.body.append(pv);
  const V=(x,y,z)=>new T3.THREE.Vector3(x,y,z),pol=(a,r,y)=>V(Math.sin(a)*r,y,Math.cos(a)*r);
  const sm=x=>x<0?0:x>1?1:x*x*(3-2*x);
  const D=id=>SEAT3D.get(id);
  // ---- my seat: ring-3 desk near angle .78 ----
  let meSeat=null,best=9;for(const [id,s3] of SEAT3D){if(s3.kind!=='desk')continue;const r=Math.hypot(s3.x,s3.z);if(Math.abs(r-15)>1.2)continue;const d=Math.abs(s3.a-.78);if(d<best){best=d;meSeat=id;}}
  const MS=D(meSeat);
  // ---- fill the room ----
  const TOEIC=['토익 RC 파트5','토익 LC 파트3','토익 RC 파트7','토익 단어 Day 12','토익 모의고사 1회','토익 LC 받아쓰기','토익 문법 정리','토익 850 목표','토익 파트2 오답'];
  const OTHER=['수능 수학 기출','행정법 기출','한국사 3단원','코딩테스트 2문제','간호사 국시','일본어 N2 단어','회계원리 4장','책 50쪽 읽기','자격증 필기','논문 한 편 읽기','기말고사 정리','공무원 국어'];
  const ANI=['owl','cat','rabbit','panda','fox','bear','squirrel','penguin'];
  NPCS.length=0;NPC_SEATS.clear();let i=0;
  for(const [id,s3] of SEAT3D){if(id===meSeat)continue;const n=i++;const h=(n*2654435761)>>>0;const dMe=Math.hypot(s3.x-MS.x,s3.z-MS.z);
    const keep=s3.kind==='desk'?(dMe<2.2?false:dMe<9?h%100<78:h%100<55):h%100<45;if(!keep)continue;
    const toeic=dMe<9.5?h%10<8:h%10<3;
    NPCS.push({seatId:id,seat:seatById.get(id),hue:(h>>3)%360,phaseOff:(h%100)/30,studying:true,kind:ANI[(h>>7)%ANI.length],npc:true,goal:toeic?TOEIC[(h>>4)%TOEIC.length]:OTHER[(h>>4)%OTHER.length]});NPC_SEATS.add(id);}
  WANDER.length=1;
  nick='직장인 토끼';tasks.splice(0,tasks.length);goal='';
  drawNpcGoals=function(){if(!T3)return;ctx.setTransform(dpr,0,0,dpr,0,0);const cp=T3.cam.position,placed=[];
    const list=NPCS.map(n=>{const s3=SEAT3D.get(n.seatId);return {n,d:Math.hypot(s3.x-cp.x,s3.z-cp.z)};}).filter(o=>o.d<window.__goalR).sort((a,b)=>a.d-b.d);
    for(const {n} of list){if(!n.goal)continue;const [sx,sy]=tagPos(n);if(sx<50||sx>vw-50||sy<150||sy>vh-200)continue;
      if(placed.length>=window.__goalMax||placed.some(([x,y])=>Math.abs(x-sx)<120&&Math.abs(y-sy)<28))continue;
      placed.push([sx,sy]);const top=bubble(sx,sy+8,n.goal);const b=n.burst;const now=Date.now();if(b&&now-b.t<4500&&now>=b.t)celebrate(sx,top,b,(now-b.t)/4500);}};
  window.__goalR=8.5;window.__goalMax=7;
  // start at the door
  me3.x=0;me3.z=27.6;me3.ry=0;
  const near=k=>NPCS.map(n=>({n,d:Math.hypot(D(n.seatId).x-MS.x,D(n.seatId).z-MS.z)})).filter(o=>o.d<4.5).sort((a,b)=>a.d-b.d).slice(0,k).map(o=>o.n);
  const mate=near(1)[0];
  const appr=()=>[MS.x+Math.sin(MS.face)*.65,MS.z+Math.cos(MS.face)*.65];
  window.__speedAt=T=>(crun&&(crun.stage==='go'||crun.stage==='back')&&!me.seat)?2.2:1;
  window.__promoEvents=(T)=>{peers.clear();const fire=(s,fn)=>{if(T>=s&&!fire.done[s]){fire.done[s]=1;fn();}};fire.done=window.__fd||(window.__fd={});
    fire(.3,()=>goSeat3(meSeat));
    fire(19.4,()=>{tasks.splice(0,tasks.length,{t:'RC 파트5 2세트',done:false},{t:'단어 Day 12',done:false});goal='RC 파트5 2세트';try{renderTicket();}catch(e){}});
    fire(23.2,()=>{if(sess){sess.start=Date.now()-68*60000;sess.sec=68*60;sess.last=Date.now();}try{renderTicket();}catch(e){}});
    fire(24.3,()=>{startRun();});
    if(crun&&crun.stage==='menu'){if(!window.__mT)window.__mT=T;if(T-window.__mT>1.1){const b=document.querySelector('#mnPick [data-d="latte"]');if(b)b.click();}}
    if(crun&&crun.stage==='order'&&!window.__oT){window.__oT=1;crun.t-=1200;}
    fire(35.6,()=>{if(sess){sess.start=Date.now()-84*60000;sess.sec=84*60;}if(tasks[0])tasks[0].done=true;goal='단어 Day 12';try{renderTicket();}catch(e){}});
    fire(41.0,()=>{if(mate){me.burst={t:Date.now(),text:'👏',kind:'cheer'};me.cheerT=Date.now();cheersToday=1;}});
    fire(42.6,()=>{if(mate){mate.burst={t:Date.now(),text:'👏',kind:'cheer'};}});
    fire(44.4,()=>{if(sess){sess.start=Date.now()-120*60000-12000;sess.sec=7212;}if(tasks[1])tasks[1].done=true;goal='';try{renderTicket();}catch(e){}});
  };
  const rel=(a,r,y)=>V(MS.x+Math.sin(MS.a+a)*r,y,MS.z+Math.cos(MS.a+a)*r);
  const SHOTS=[
    {s:-1,e:3.8,bi:0,bo:1.6,f:T=>{const k=sm(T/3.6);return [V(-1.6+k*.8,7.2-k*3.4,33.5-k*4.2),V(0,2.0-k*.6,18-k*3)];}},
    {s:12.0,e:18.9,bi:1.4,bo:1.4,f:T=>{const k=(T-12.0)/6.9;const a=.42+k*.6;return [pol(a,12.3,3.0),pol(a+.14,16.2,.8)];}},
    {s:35.1,e:40.8,bi:1.3,bo:1.3,f:T=>{const k=sm((T-35.1)/5.7);return [rel(.2-k*.14,-(3.0-k*.7),1.75-k*.2),V(MS.x,1.0,MS.z)];}},
    {s:44.5,e:99,bi:2.2,bo:0,f:T=>{const k=sm((T-44.5)/5.5);return [rel(.05,3.6+k*8,3.2+k*6.5),V(MS.x*(1-k*.5),1+k*1.4,MS.z*(1-k*.5))];}}];
  const gp=new T3.THREE.Vector3(),gq=new T3.THREE.Quaternion(),oq=new T3.THREE.Quaternion();
  window.__promoCam=(cam,t)=>{peers.clear();const T=window.__pt||0;let best=null,w=0;
    for(const sh of SHOTS){if(T<sh.s||T>sh.e)continue;const wi=sh.bi?sm((T-sh.s)/sh.bi):1,wo=sh.bo?sm((sh.e-T)/sh.bo):1,ww=Math.min(wi,wo);if(ww>w){w=ww;best=sh;}}
    if(best&&w>0){gp.copy(cam.position);gq.copy(cam.quaternion);const [p,q]=best.f(T);cam.position.copy(p);cam.lookAt(q);oq.copy(cam.quaternion);
      cam.position.lerpVectors(gp,p,w);cam.quaternion.slerpQuaternions(gq,oq,w);
      const cp=cam.position;for(const [k2,a2] of T3.actors){const d=Math.hypot(a2.g.position.x-cp.x,a2.g.position.z-cp.z);a2.g.visible=k2==='me'||d>2.6;}}
    else for(const [k2,a2] of T3.actors)a2.g.visible=true;};
  const CAPS=[[1.0,5.3,'새로운 목표가 생겨서… 온라인 도서실에 와봤어요'],[5.4,8.4,'승진하려면 토익 점수가 필요하거든요'],[8.5,12.2,'이번엔 진짜, 토익에만 집중해 보기로 했어요'],[12.3,16.2,'들어와 보니까… 토익 공부하시는 분들이 꽤 있더라구요'],[16.2,18.4,'괜히 든든했어요 ㅎㅎ'],[18.6,23.7,'자리 잡고. 오늘 목표는 RC 파트5 두 세트'],[24.0,27.7,'한참 열심히 하다가… 잠깐 카페도 다녀왔어요'],[28.6,30.6,'오늘은 라떼로 ☕'],[35.3,40.5,'다시 자리로 돌아오니까, 모닥불 소리가 은근히 집중하게 해주네요'],[40.6,44.6,'옆자리 분이 응원도 보내주셨어요. 저도 하나 보냈어요 👏'],[44.8,48.2,'오늘 두 시간 채웠다. 내일도 와야지']];
  const STK=[['stG',6.0,12.0],['stT',22.8,26.4],['stF',36.2,40.4],['stE',45.4,50]];
  window.__promoUI=(T)=>{const c=CAPS.find(c=>T>=c[0]&&T<c[1]);const cap=document.getElementById('cap');if(c){cap.textContent=c[2];cap.style.opacity=Math.min(1,(T-c[0])/.25,(c[1]-T)/.25);}else cap.style.opacity=0;
    for(const [id,a,b] of STK){const e=document.getElementById(id),f=Math.max(0,Math.min(1,(T-a)/.3,(b-T)/.3));e.style.opacity=f;e.style.scale=String(.85+.15*Math.min(1,(T-a)/.3));}
    const dt=document.querySelector('#pv .date');dt.style.opacity=Math.max(0,Math.min(1,(9.6-T)/.5));
    document.getElementById('url').style.opacity=Math.max(0,Math.min(1,(T-48.4)/.6));};
  window.__dbg=()=>({me:meSeat,seat:me.seat&&me.seat.id,stage:crun&&crun.stage,x:+me3.x.toFixed(1),z:+me3.z.toFixed(1),pt:window.__pt,mate:mate&&mate.seatId});
})();};
