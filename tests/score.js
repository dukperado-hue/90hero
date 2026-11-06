// bot run (not a human playtest): score goes up on kills/chains, PACE card at checkpoint, win screen tally
const { chromium } = require('playwright'); const http=require('http'),fs=require('fs');
const srv=http.createServer((q,r)=>{r.writeHead(200,{'content-type':'text/html'});r.end(fs.readFileSync(process.argv[2]));}).listen(0);
(async()=>{const b=await chromium.launch();const pg=await b.newPage({viewport:{width:960,height:540}});const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.goto('http://127.0.0.1:'+srv.address().port+'/');await pg.waitForTimeout(500);
const r=await pg.evaluate(()=>{ONE.setChar('juk');(0,eval)('STAGE=1');ONE.startGame();const G=ONE.G;(0,eval)('G.cine=null');for(let i=0;i<10;i++)ONE.step(1/60,{});
 const out={};out.s0=G.score;
 const p=G.player;const e=G.enemies.find(e=>!e.dead);ONE.teleport(Math.floor(e.x/16)-4,Math.floor((e.y+e.h)/16));
 (0,eval)('damageEnemy')(e,99,p.x,false);out.afterKill=G.score;
 // barrel chain
 const br=G.barrels[0];ONE.teleport(Math.floor(br.x/16)-6,Math.floor((br.y+16)/16));(0,eval)('explode')(br.x,br.y,46,20,{barrel:true});for(let i=0;i<40;i++)ONE.step(1/60,{});out.afterBarrel=G.score;
 // checkpoint -> pace
 const cp=G.checkpoints[0];ONE.teleport(Math.floor(cp.x/16)+1,Math.floor(cp.y/16));G.time=30;for(let i=0;i<5;i++)ONE.step(1/60,{});out.pace=G.pace&&{rank:G.pace.rank,pct:G.pace.pct};ONE.render();
 return out;});
await pg.screenshot({path:'/tmp/xo/pace.png'});
const w=await pg.evaluate(()=>{const G=ONE.G;(0,eval)('win')();G.winT=3;ONE.render();return {final:G.scoreFinal,bonus:G.scoreBonus,isNew:G.scoreNew,rank:G.rank};});
await pg.screenshot({path:'/tmp/xo/winscore.png'});
console.log(JSON.stringify(r),JSON.stringify(w),errs);await b.close();srv.close();})();
