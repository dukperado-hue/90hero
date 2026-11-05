const { chromium } = require('playwright'); const http = require('http'), fs = require('fs'), path = require('path');
const BOT = fs.readFileSync(__dirname + '/bot.js', 'utf8'); const [F, OUT, STG] = [path.resolve(process.argv[2]), process.argv[3], +(process.argv[4] || 1)];
fs.mkdirSync(OUT, { recursive: true });
const srv = http.createServer((q, r) => { r.writeHead(200, { 'content-type': 'text/html' }); r.end(fs.readFileSync(F)); }).listen(0);
(async () => {
  const b = await chromium.launch(); const c = await b.newContext({ viewport: { width: 960, height: 540 } }); const pg = await c.newPage();
  await pg.goto('http://127.0.0.1:' + srv.address().port + '/'); await pg.addScriptTag({ content: BOT }); await pg.waitForTimeout(300);
  await pg.evaluate(async stg => { if (!ONE.PROG.unlocked.includes('sura')) ONE.PROG.unlocked.push('sura'); ONE.enterSelect(); await __T.S(300); while (ONE.STAGE !== stg) await __T.tap('Tab');
    const t = CHAR_KEYS.indexOf('sura'); for (let i = 0; i < 40 && ONE.G.sel !== t; i++) await __T.tap('ArrowRight'); await __T.tap('Enter'); await __T.S(1200);
    await __T.bot(2500, {}); for (const e of ONE.G.enemies) { e.dead = true; e.hp = 0; } ONE.G.ebullets.length = 0; ONE.G.player.hp = 99; }, STG);
  const poses = {
    idle: 'p.vx=0', run1: 'p.vx=150;p.runPhase=0.3', run2: 'p.vx=150;p.runPhase=1.9', run3: 'p.vx=150;p.runPhase=3.4', run4: 'p.vx=150;p.runPhase=5',
    jump: 'p.onGround=false;p.vy=-100', punch: 'p.swingT=9;p.swingK="punch"', kick: 'p.swingT=9;p.swingK="kick"', elbow: 'p.onGround=false;p.swingT=9;p.swingK="elbow"',
    crouch: 'p.crouch=true', drink: 'p.drinkT=9', dodge: 'p.dodgeT=9', flash: 'p.flash=9', left: 'p.face=-1;p.vx=0', dead: 'p.dead=true;p.deadT=1'
  };
  for (const k in poses) {
    const box = await pg.evaluate(src => { const G = ONE.G, p = G.player; G.paused = true;
      Object.assign(p, { vx: 0, vy: 0, swingT: 0, dodgeT: 0, drinkT: -1, crouch: false, flash: 0, inv: 0, landT: 0, jumpT: 0, onGround: true, face: 1, dead: false, superT: 0 });
      new Function('p', src)(p); ONE.render();
      const cv = document.querySelector('canvas'), R = cv.getBoundingClientRect(), s = R.width / 480, cam = G.cam; return { x: R.left + (p.x + p.w / 2 - cam.x) * s, y: R.top + (p.y + p.h - cam.y) * s }; }, poses[k]);
    await pg.screenshot({ path: `${OUT}/${k}.png`, clip: { x: Math.max(0, box.x - 45), y: Math.max(0, box.y - 75), width: 90, height: 90 } });
  }
  await b.close(); srv.close();
})();
