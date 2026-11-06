const { chromium } = require('playwright'); const http=require('http'),fs=require('fs');
const F=process.argv[2];const srv=http.createServer((q,r)=>{r.writeHead(200,{'content-type':'text/html'});r.end(fs.readFileSync(F));}).listen(0);
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:960,height:540}});const er=[];p.on('pageerror',e=>er.push(String(e)));
await p.goto('http://127.0.0.1:'+srv.address().port+'/');await p.waitForTimeout(1500);
const r=await p.evaluate(()=>{const ks=CHAR_KEYS.filter(k=>SPR[k]);const miss=CHAR_KEYS.filter(k=>!SPR[k]);
const names=['idle','walkA','walkB','jump','kickW','kick','hurt','win'];
const cv=document.createElement('canvas');cv.width=8*110;cv.height=ks.length*70;const c=cv.getContext('2d');c.fillStyle='#5a3c78';c.fillRect(0,0,cv.width,cv.height);c.imageSmoothingEnabled=false;
ks.forEach((k,i)=>{const S=SPR[k];names.forEach((n,j)=>{const f=S.f[n];c.drawImage(S.im,f.x,f.y,f.w,f.h,j*110+55-f.ax,i*70+66-f.h,f.w,f.h)});c.fillStyle='#fff';c.font='9px monospace';c.fillText(k,2,i*70+10)});
return {miss,url:cv.toDataURL('image/png')}});
console.log('missing',r.miss,'errors',er);fs.writeFileSync('/tmp/allspr.png',Buffer.from(r.url.split(',')[1],'base64'));await b.close();srv.close()})()
