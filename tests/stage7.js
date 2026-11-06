const { chromium } = require('playwright'); const http=require('http'),fs=require('fs');
const srv=http.createServer((q,r)=>{r.writeHead(200,{'content-type':'text/html'});r.end(fs.readFileSync(process.argv[2]));}).listen(0);
(async()=>{const b=await chromium.launch();const pg=await b.newPage({viewport:{width:960,height:540}});const errs=[];pg.on('pageerror',e=>errs.push(String(e)));
await pg.goto('http://127.0.0.1:'+srv.address().port+'/');await pg.waitForTimeout(400);
const o=await pg.evaluate(async()=>{ONE.setChar('ma');(0,eval)('STAGE=7');ONE.startGame();const G=ONE.G;for(let i=0;i<1500&&G.cine;i++)ONE.step(1/120,{});
 (0,eval)('LOCKS=[]'); G.enemies.length=0; ONE.teleport(379,18);G.player.inv=99;const seen=new Set();
 for(let i=0;i<500;i++){ONE.step(1/120,{}); if(G.boss) seen.add(G.boss.state);} ONE.render();
 const b=G.boss;return {boss:b&&b.type,hp:b&&b.hp,states:[...seen],arena:(0,eval)('S7.arena'),lock:!!G.cam.lock};});
await pg.screenshot({path:'/tmp/s7_boss2.png'});
// kill boss path
const k=await pg.evaluate(async()=>{const G=ONE.G;const b=G.boss; if(!b) return 'noboss'; b.hp=1; G.player.inv=99; for(let i=0;i<120*6;i++){ONE.step(1/120,{shoot:true}); } return {dead:b.dead,exit:G.exitOpen,door:ONE.tile(408,10)};});
console.log(JSON.stringify(o),JSON.stringify(k),errs);await b.close();srv.close();})();
