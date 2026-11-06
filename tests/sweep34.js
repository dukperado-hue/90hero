// bot run (not a human playtest): chibi golden men, death anim, elites, dummies, Sweeping Monk boss state machine
const { chromium } = require('playwright'); const http=require('http'),fs=require('fs');
const srv=http.createServer((q,r)=>{r.writeHead(200,{'content-type':'text/html'});r.end(fs.readFileSync(process.argv[2]));}).listen(0);
(async()=>{const b=await chromium.launch();const pg=await b.newPage({viewport:{width:960,height:540}});const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.goto('http://127.0.0.1:'+srv.address().port+'/');await pg.waitForTimeout(800);
const E=(s)=>pg.evaluate(s);
const out={};
await E(()=>{ONE.setChar('shaolin');(0,eval)('STAGE=2');ONE.startGame();(0,eval)('G.cine=null');for(let i=0;i<5;i++)ONE.step(1/60,{});});
out.dummies=await E(()=>ONE.G.enemies.filter(e=>e.type==='dummy').length);
// hit a dummy
out.dummy=await E(()=>{const G=ONE.G,p=G.player;const d=G.enemies.find(e=>e.type==='dummy');ONE.teleport(d.x/16-2,18);for(let i=0;i<30;i++)ONE.step(1/60,{});const k0=G.stats.kills;const hp=d.hp;(0,eval)('damageEnemy')(d,2,p.x,false);const hp2=d.hp;for(let i=0;i<5;i++)(0,eval)('damageEnemy')(d,3,p.x,false);ONE.render();return {hp,hp2,dead:d.dead,kills:G.stats.kills-k0};});
await pg.screenshot({path:'/tmp/xo/dum.png'});
// golden death anim
out.death=await E(()=>{const G=ONE.G,p=G.player;p.inv=999;G.enemies=G.enemies.filter(e=>e.type==='dummy');const mk=(0,eval)('mkEnemy');const gy=(0,eval)('groundBelow')(p.x+60,0)/16;const m=mk('monk',Math.floor(p.x/16)+5,gy);m.alerted=true;m.state='engage';G.enemies.push(m);const frames=[];
 m.hp=1;(0,eval)('damageEnemy')(m,5,p.x,false);for(let i=0;i<90;i++){ONE.step(1/60,{});if(i%10==0)frames.push([m.dead,m.onGround,!!m.glanded]);}return {frames,hp:m.hp,rot:m.rot};});
// crowd + elite
out.elite=await E(()=>{const G=ONE.G,p=G.player;(0,eval)('dropIn')('monk',Math.floor(p.x/16)+8,'elite');const e=G.enemies[G.enemies.length-1];let st=new Set();let hurt=0;p.inv=0;for(let i=0;i<600;i++){p.hp=9;ONE.step(1/60,{});st.add(e.state);}return {states:[...st],hp:e.hp,max:e.maxHp,armor:e.armor,elite:e.elite};});
await E(()=>{const G=ONE.G;ONE.render();});await pg.screenshot({path:'/tmp/xo/elite.png'});
// boss
out.boss=await E(async()=>{const G=ONE.G,p=G.player;G.enemies=G.enemies.filter(e=>e.type==='dummy');ONE.teleport(150,18);for(let i=0;i<30;i++)ONE.step(1/60,{});(0,eval)('spawnSweeper')();p.inv=999;p.hp=9;const seen=new Set();const log=[];
 for(let i=0;i<60*40;i++){p.inv=999;ONE.step(1/60,{});const b=G.boss;if(!b)break;seen.add(b.state+(b.ceil?'^':''));b.hp=Math.max(b.hp,1);if(i==60*4)b.hp=b.maxHp*0.6;if(i==60*14)b.hp=b.maxHp*0.3;if(i%300==0)log.push([b.state,b.phase,Math.round(b.x/16),b.hp|0]);}
 return {seen:[...seen],log,sweeps:G.sweeps.length};});
await pg.screenshot({path:'/tmp/xo/boss.png'});
// kill boss -> gate
out.kill=await E(()=>{const G=ONE.G;const b=G.boss;b.state='sweep';(0,eval)('damageBoss')(9999,0);for(let i=0;i<240;i++)ONE.step(1/60,{});return {dead:b.dead,exit:G.exitOpen,done:G.sweepDone};});
console.log(JSON.stringify(out));console.log(errs);await b.close();srv.close();})();
