// bot run (not a human playtest): Golden Man armour/crack/draw states, Pob entrail pull
const { chromium } = require('playwright'); const http=require('http'),fs=require('fs');
const srv=http.createServer((q,r)=>{r.writeHead(200,{'content-type':'text/html'});r.end(fs.readFileSync(process.argv[2]));}).listen(0);
(async()=>{const b=await chromium.launch();const pg=await b.newPage({viewport:{width:960,height:540}});const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.goto('http://127.0.0.1:'+srv.address().port+'/');await pg.waitForTimeout(800);
const r=await pg.evaluate(async()=>{ONE.setChar('ma');(0,eval)('STAGE=2');ONE.startGame();const G=ONE.G;(0,eval)('G.cine=null');for(let i=0;i<5;i++)ONE.step(1/60,{});
 const p=G.player;p.inv=999;G.enemies.length=0;const mk=(0,eval)('mkEnemy'),gy=(0,eval)('groundBelow')(p.x+80,0)/16;
 const out={};
 const m=mk('monk',Math.floor(p.x/16)+6,gy);G.enemies.push(m);m.state='patrol';
 out.box=[m.w,m.h,m.hp];
 // bullets glance, then crack
 const mb=(0,eval)('monkBulletHit');let dm=[];for(let i=0;i<8;i++){const d=mb(m,{x:m.x,y:m.y+8,vx:300,vy:0,dmg:1});dm.push(Math.round(d*100)/100);}
 out.bulletDmg=dm;out.cracked=m.crackT>0;out.armor=m.armor;
 // melee on fresh monk
 const m2=mk('monk',Math.floor(p.x/16)+9,gy);G.enemies.push(m2);m2.hp=100;(0,eval)('damageEnemy')(m2,2,p.x,false);out.meleeLeft=[m2.hp,m2.armor];
 (0,eval)('damageEnemy')(m2,5,p.x,true);out.afterBoom=[m2.hp,m2.armor,m2.crackT>0];
 // render states
 const frames=[];for(const st of ['patrol','wind','strike']){m.state=st;m.hp=999;ONE.render();frames.push(st);}
 // Pob pull on a soldier, and on an uncracked monk
 ONE.setChar('pob');ONE.startGame();const G2=ONE.G;(0,eval)('G.cine=null');for(let i=0;i<5;i++)ONE.step(1/60,{});const q=G2.player;q.inv=999;G2.enemies.length=0;
 const gy2=(0,eval)('groundBelow')(q.x+60,0)/16;const s=(0,eval)('mkEnemy')('soldier',Math.floor(q.x/16)+4,gy2);G2.enemies.push(s);s.hp=30;s.state='patrol';q.face=1;
 const ok=(0,eval)('pobPull')(q,s);out.pullOk=ok;let ripped=false;for(let i=0;i<80;i++){ONE.step(1/60,{});if(s.gutted)ripped=true;}
 out.rip={ripped,hp:s.hp,tethers:G2.tethers.length,parts:G2.parts.length};
 const mm=(0,eval)('mkEnemy')('monk',Math.floor(q.x/16)+4,gy2);G2.enemies.push(mm);out.monkPull=(0,eval)('pobPull')(q,mm);
 return out;});
console.log(JSON.stringify(r),errs);await b.close();srv.close();})();
