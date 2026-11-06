const { chromium } = require('playwright'); const http=require('http'),fs=require('fs'),path=require('path');
const BOT=fs.readFileSync(__dirname+'/bot.js','utf8'); const F=path.resolve(process.argv[2]),OUT=process.argv[3]; fs.mkdirSync(OUT,{recursive:true});
const srv=http.createServer((q,r)=>{r.writeHead(200,{'content-type':'text/html'});r.end(fs.readFileSync(F));}).listen(0);
(async()=>{
 const b=await chromium.launch(); const c=await b.newContext({viewport:{width:960,height:540}}); const pg=await c.newPage(); const errs=[]; pg.on('pageerror',e=>errs.push(String(e)));
 await pg.goto('http://127.0.0.1:'+srv.address().port+'/'); await pg.addScriptTag({content:BOT}); await pg.waitForTimeout(300);
 await pg.evaluate(()=>{SWAPMODE=false;});
 await pg.evaluate(async()=>{ONE.enterSelect(); await __T.S(300); ONE.G.sel=CHAR_KEYS.indexOf('pob'); await __T.S(900);}); await pg.screenshot({path:OUT+'/select_pob.png'});
 const r=await pg.evaluate(async()=>{
  ONE.enterSelect(); await __T.S(300); while(ONE.STAGE!==1) await __T.tap('Tab'); ONE.G.sel=CHAR_KEYS.indexOf('pob'); await __T.tap('Enter'); await __T.S(1300);
  for(let i=0;i<40&&ONE.G.cine;i++) await __T.S(100);
  const G=ONE.G,p=G.player,out={ch:p.ch,mode:G.mode}; 
  const e=G.enemies.find(e=>!e.dead&&e.type==='soldier'); e.hp=60; e.stun=99; p.inv=99; p.x=e.x-60; p.y=e.y+e.h-p.h; p.face=1;
  const seen=[]; const hp0=e.hp;
  for(let n=0;n<4;n++){  window.dispatchEvent(new KeyboardEvent('keydown',{code:'KeyK'})); for(let i=0;i<30;i++){ONE.step(1/120,i===0?{bomb:true}:{}); } window.dispatchEvent(new KeyboardEvent('keyup',{code:'KeyK'})); seen.push((p.n5||{}).c); if(n==1) window.__snap=1; for(let i=0;i<120;i++)ONE.step(1/120,{}); }
  await __T.S(1); out.rot=seen; out.dmg=hp0-e.hp; out.hearts=((p.n5||{}).hearts||[]).length;
  return out;});
 await pg.screenshot({path:OUT+'/game_pob.png'}); console.log(JSON.stringify(r)); console.log('errors',errs);
 await b.close(); srv.close();
})();
