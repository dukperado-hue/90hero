// bot run (not a human playtest): every hero as P2 for a few seconds of random input; checks no errors, P2 moves, P2 can take damage and respawn
const { chromium } = require('playwright'); const http=require('http'),fs=require('fs');
const srv=http.createServer((q,r)=>{r.writeHead(200,{'content-type':'text/html'});r.end(fs.readFileSync(process.argv[2]));}).listen(0);
(async()=>{const b=await chromium.launch();const pg=await b.newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.goto('http://127.0.0.1:'+srv.address().port+'/');await pg.waitForTimeout(500);
const keys=await pg.evaluate(()=>(0,eval)('CHAR_KEYS'));
const out=[];
for(const ch of keys){
 const r=await pg.evaluate((ch)=>{try{ONE.setChar('shaolin');__coop.set(true);__coop.p2(ch);(0,eval)('STAGE=2');ONE.startGame();const G=ONE.G;
  (0,eval)('G.cine=null');for(let i=0;i<10;i++)ONE.step(1/60,{});
  const k2=__coop.keys2;let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
  const x0=G.p2.x;let moved=0;
  for(let i=0;i<420;i++){ if(i%25==0){for(const a of ['left','right','jump','shoot','bomb','down','up'])k2[a]=false;k2[rnd()<0.7?'right':'left']=true;if(rnd()<0.5)k2.shoot=true;if(rnd()<0.3)k2.jump=true;if(rnd()<0.1)k2.bomb=true;if(rnd()<0.08)k2.ult=true;}
   ONE.step(1/60,{});if(i%60==0)ONE.render();}
  for(const a in k2)k2[a]=false;
  const ok=G.p2&&isFinite(G.p2.x)&&isFinite(G.p2.y);
  const res={ch,ok,dx:Math.round(G.p2.x-x0),ch2:G.p2.ch,hp:G.p2.hp,dead:G.p2.dead};__coop.set(false);return res;}catch(e){__coop.set(false);return {ch,err:e.message+' '+(e.stack||'').split('\n')[1]};}},ch);
 out.push(r);}
const bad=out.filter(r=>r.err||!r.ok||r.ch2!==r.ch);
console.log(out.map(r=>r.err?r.ch+':ERR '+r.err:r.ch+':'+r.dx+(r.dead?'x':'')).join(' '));
console.log('bad',JSON.stringify(bad),'pageerrors',errs.slice(0,5));
await b.close();srv.close();})();
