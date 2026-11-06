const { chromium } = require('playwright'); const http=require('http'),fs=require('fs'),path=require('path');
const BOT=fs.readFileSync(__dirname+'/bot.js','utf8'); const F=path.resolve(process.argv[2]),OUT=process.argv[3]; fs.mkdirSync(OUT,{recursive:true});
const srv=http.createServer((q,r)=>{r.writeHead(200,{'content-type':'text/html'});r.end(fs.readFileSync(F));}).listen(0);
(async()=>{const b=await chromium.launch();const pg=await (await b.newContext({viewport:{width:960,height:540}})).newPage();const errs=[];pg.on('pageerror',e=>errs.push(String(e)));
await pg.goto('http://127.0.0.1:'+srv.address().port+'/');await pg.addScriptTag({content:BOT});await pg.waitForTimeout(300);await pg.evaluate(()=>{SWAPMODE=false;});
const start=async h=>{await pg.evaluate(async h=>{ONE.enterSelect();await __T.S(300);while(ONE.STAGE!==1)await __T.tap('Tab');ONE.G.sel=CHAR_KEYS.indexOf(h);await __T.tap('Enter');await __T.S(1300);for(let i=0;i<40&&ONE.G.cine;i++)await __T.S(100);},h)};
await start('zhang');
const r=await pg.evaluate(async()=>{const G=ONE.G,p=G.player;const e=G.enemies.find(e=>!e.dead&&e.type==='soldier');e.type='knife';e.state='lunge';e.hp=20;p.x=e.x-8;p.y=e.y+e.h-p.h;p.face=1;p.inv=0;p.hp=Math.max(p.hp,3);
const hp0=p.hp;p.parryT=0.2;hurtPlayer(1,e.x+e.w/2,true);const parried=p.hp===hp0;p.parryT=0;p.inv=0;hurtPlayer(1,e.x+e.w/2,true);const hurtNoParry=p.hp<hp0;
// J shockwave
p.inv=99;const e2=G.enemies.find(x=>!x.dead&&x!==e);if(e2){e2.x=p.x+34;e2.y=p.y;e2.hp=30;e2.stun=5;}const h2=e2?e2.hp:0;
window.dispatchEvent(new KeyboardEvent('keydown',{code:'KeyJ'}));for(let i=0;i<30;i++)ONE.step(1/120,{shoot:true});window.dispatchEvent(new KeyboardEvent('keyup',{code:'KeyJ'}));
return {parried,hurtNoParry,palmDmg:e2?h2-e2.hp:null}});
await pg.screenshot({path:OUT+'/zhang.png'});console.log(JSON.stringify(r));
await start('michelle');
const r2=await pg.evaluate(async()=>{const G=ONE.G,p=G.player;const out=[];for(const w of ['sword','spear','fan','hammer']){p.weapon=w;p.wIdx=MW_ORDER.indexOf(w);p.wDur=MW[w].dur;p.swingT=0.08;for(let i=0;i<3;i++)ONE.step(1/120,{});out.push(w)}return out});
await pg.screenshot({path:OUT+'/michelle.png'});console.log(JSON.stringify(r2),'errors',errs);await b.close();srv.close()})()
