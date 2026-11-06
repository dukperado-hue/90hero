// bot run (not a human playtest): blast launch, structural collapse, unanchored-structure census, corner correction
const { chromium } = require('playwright'); const http=require('http'),fs=require('fs');
const srv=http.createServer((q,r)=>{r.writeHead(200,{'content-type':'text/html'});r.end(fs.readFileSync(process.argv[2]));}).listen(0);
(async()=>{const b=await chromium.launch();const pg=await b.newPage({viewport:{width:960,height:540}});const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.goto('http://127.0.0.1:'+srv.address().port+'/');await pg.waitForTimeout(500);
const census=await pg.evaluate(()=>{const out={};for(const st of [1,2,3,4,5,6,7]){ONE.setChar('shaolin');(0,eval)('STAGE='+st);ONE.startGame();const LW=(0,eval)('LW'),LH=(0,eval)('LH');const S=(0,eval)('STRUCT33'),SOLID=(0,eval)('SOLID');
 const seen=new Set();let floating=0,total=0;
 for(let y=0;y<LH;y++)for(let x=0;x<LW;x++){const k=y*LW+x;if(seen.has(k)||!S.has(ONE.tile(x,y)))continue;total++;const q=[[x,y]];seen.add(k);let anch=false,n=0;
  while(q.length){const [cx,cy]=q.pop();n++;for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=cx+dx,ny=cy+dy;if(nx<0||nx>=LW||ny>=LH){anch=true;continue;}if(ny<0)continue;const t=ONE.tile(nx,ny);if(S.has(t)){const kk=ny*LW+nx;if(!seen.has(kk)){seen.add(kk);q.push([nx,ny]);}}else if(SOLID[t])anch=true;}}
  if(!anch&&n<=140)floating++;}
 out[st]={total,floating};}return out;});
const r=await pg.evaluate(()=>{ONE.setChar('shaolin');(0,eval)('STAGE=2');ONE.startGame();const G=ONE.G;(0,eval)('G.cine=null');for(let i=0;i<5;i++)ONE.step(1/60,{});
 const set=(0,eval)('setTile'),gb=(0,eval)('groundBelow');const tx=60;const gy=gb(tx*16,0)/16;
 for(let x=tx-3;x<tx+10;x++)for(let y=gy-9;y<gy;y++)set(x,y,0);
 // pillar of bricks 1 wide x4 on ground at tx+5, plus a 5-wide roof on top of it
 for(let y=gy-4;y<gy;y++)set(tx+5,y,3);for(let x=tx+3;x<=tx+7;x++)set(x,gy-5,3);
 G.enemies.length=0;const p=G.player;p.x=(tx-2)*16;p.y=gy*16-p.h;
 const e=(0,eval)('mkEnemy')('soldier',tx+2,gy);G.enemies.push(e);e.state='patrol';
 const n0=ONE.tile(tx+5,gy-1);
 (0,eval)('setTile')(tx+5,gy-1,0);(0,eval)('setTile')(tx+5,gy-2,0); // knock out the bottom
 const f=(0,eval)('collapseCheck33')([[tx+5,gy-3],[tx+5,gy-1]]);
 const ch=G.chunks.length;for(let i=0;i<90;i++)ONE.step(1/60,{});
 // launch test
 const e2=(0,eval)('mkEnemy')('soldier',tx+8,gy);G.enemies.push(e2);const y0=e2.y;let minY=e2.y;
 (0,eval)('explode')((tx+8)*16+8,gy*16-4,46,10,{byPlayer:true,noSelf:true});for(let i=0;i<30;i++){ONE.step(1/60,{});minY=Math.min(minY,e2.y);}
 return {freed:f,chunks:ch,left:G.chunks.length,roof:ONE.tile(tx+5,gy-5),launch:Math.round(y0-minY),e1dead:e.dead,e1hp:e.hp};});
console.log(JSON.stringify(census));console.log(JSON.stringify(r),errs);await b.close();srv.close();})();
