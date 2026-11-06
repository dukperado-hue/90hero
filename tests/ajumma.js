const { chromium } = require('playwright'); const http=require('http'),fs=require('fs'),path=require('path');
const BOT=fs.readFileSync(__dirname+'/bot.js','utf8'); const F=path.resolve(process.argv[2]),OUT=process.argv[3]; fs.mkdirSync(OUT,{recursive:true});
const srv=http.createServer((q,r)=>{r.writeHead(200,{'content-type':'text/html'});r.end(fs.readFileSync(F));}).listen(0);
(async()=>{
 const b=await chromium.launch(); const c=await b.newContext({viewport:{width:960,height:540}}); const pg=await c.newPage(); const errs=[]; pg.on('pageerror',e=>errs.push(String(e)));
 await pg.goto('http://127.0.0.1:'+srv.address().port+'/'); await pg.addScriptTag({content:BOT}); await pg.waitForTimeout(300);
 await pg.evaluate(()=>{SWAPMODE=false;});
 await pg.evaluate(async()=>{ONE.enterSelect(); await __T.S(300); ONE.G.sel=CHAR_KEYS.indexOf('ajumma'); await __T.S(900);}); await pg.screenshot({path:OUT+'/select_ajumma.png'});
 const r=await pg.evaluate(async()=>{
  ONE.enterSelect(); await __T.S(300); while(ONE.STAGE!==1) await __T.tap('Tab'); ONE.G.sel=CHAR_KEYS.indexOf('ajumma'); await __T.tap('Enter'); await __T.S(1300);
  for(let i=0;i<40&&ONE.G.cine;i++) await __T.S(100);
  const G=ONE.G,p=G.player,out={ch:p.ch,mode:G.mode}; 
  const e=G.enemies.find(e=>!e.dead&&e.type==='soldier'); e.hp=60; e.stun=99; p.inv=99; p.x=e.x-22; p.y=e.y+e.h-p.h; p.face=1;
  const seen=[]; const hp0=e.hp;
  const o2={}; 
  for(let n=0;n<3;n++){ for(let i=0;i<40;i++) ONE.step(1/120,i===0?{shoot:true}:{}); }
  o2.umbrella=hp0-e.hp; const hp1=e.hp;
  e.hp=60; p.x=e.x-80; ONE.step(1/120,{bomb:true}); for(let i=0;i<120;i++) ONE.step(1/120,{}); o2.kimchi=hp1-e.hp; o2.cloud=((p.n5||{}).cloud||[]).length;
  p.n5.rush=0; ONE.step(1/120,{ult:true}); p.ult=999; ONE.step(1/120,{ult:true}); const x0=p.x; const tr=[]; for(let i=0;i<60;i++){ ONE.step(1/120,{}); if(i%10==0) tr.push([Math.round(p.x),+p.n5.rush.toFixed(2),p.hitWall?1:0,Math.round(p.vx)]); } o2.tr=tr; o2.rush=(p.n5||{}).rush; o2.ult=p.ult; o2.wall=p.hitWall; o2.moved=Math.round(p.x-x0);
  window.__s=o2; out.o2=o2;
  return out;});
 await pg.screenshot({path:OUT+'/game_ajumma.png'}); console.log(JSON.stringify(r)); console.log('errors',errs);
 await b.close(); srv.close();
})();
