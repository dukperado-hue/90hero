// bot run (not a human playtest): every enemy type x cause dies, lands, lies down; no errors; score + chunks still work
const { chromium } = require('playwright'); const http=require('http'),fs=require('fs');
const srv=http.createServer((q,r)=>{r.writeHead(200,{'content-type':'text/html'});r.end(fs.readFileSync(process.argv[2]));}).listen(0);
(async()=>{const b=await chromium.launch();const pg=await b.newPage({viewport:{width:960,height:540}});const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.goto('http://127.0.0.1:'+srv.address().port+'/');await pg.waitForTimeout(500);
const r=await pg.evaluate(()=>{ONE.setChar('shaolin');(0,eval)('STAGE=1');ONE.startGame();const G=ONE.G;(0,eval)('G.cine=null');for(let i=0;i<5;i++)ONE.step(1/60,{});
 const p=G.player;p.inv=999;const res=[];const mk=(0,eval)('mkEnemy'),dmg=(0,eval)('damageEnemy');
 for(const type of ['soldier','gunner','shield','knife','bomber','heavy','monk','crowd'])for(const cause of ['shot','melee','blade','boom']){
  try{const gy=(0,eval)('groundBelow')(p.x+80,0)/16;const e=mk(type,Math.floor(p.x/16)+5,gy);G.enemies.push(e);e.state='patrol';e.hp=1;
   (0,eval)('KILL_CAUSE='+(cause==='melee'||cause==='blade'?JSON.stringify(cause):'null'));const s0=G.score;dmg(e,99,p.x,cause==='boom',0);(0,eval)('KILL_CAUSE=null');
   for(let i=0;i<150;i++)ONE.step(1/60,{});ONE.render();
   res.push({t:type,c:cause,dead:e.dead,rot:Math.round(Math.abs(e.rot)*100)/100,landed:!!e.landed||e.landT!=null,dy:!!e.dy,sc:G.score>s0});}
  catch(x){res.push({t:type,c:cause,err:x.message});}}
 return res;});
const bad=r.filter(x=>x.err||!x.dead);const notLying=r.filter(x=>x.dy&&!(x.rot>1.3&&x.rot<1.9));
console.log('total',r.length,'errors/notdead',JSON.stringify(bad),'withDy',r.filter(x=>x.dy).length,'notLying',JSON.stringify(notLying),'scoreless',r.filter(x=>!x.sc).length,'pageerrors',errs);
await b.close();srv.close();})();
