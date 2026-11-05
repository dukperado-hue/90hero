const { chromium } = require('playwright'); const http = require('http'), fs = require('fs'), path = require('path');
const BOT = fs.readFileSync(__dirname + '/bot.js', 'utf8'); const F = path.resolve(process.argv[2]), OUT = process.argv[3]; fs.mkdirSync(OUT, { recursive: true });
const HEROES = process.argv[4].split(','), ST = +(process.argv[5] || 1);
const srv = http.createServer((q, r) => { r.writeHead(200, { 'content-type': 'text/html' }); r.end(fs.readFileSync(F)); }).listen(0);
(async () => {
  const b = await chromium.launch(); const c = await b.newContext({ viewport: { width: 960, height: 540 } }); const pg = await c.newPage(); const errs = []; pg.on('pageerror', e => errs.push(String(e)));
  await pg.goto('http://127.0.0.1:' + srv.address().port + '/'); await pg.addScriptTag({ content: BOT }); await pg.waitForTimeout(400);
  for (const h of HEROES) {
    for (const look of ['classic', 'big']) {
      await pg.evaluate(async ({ h, ST, look }) => { LOOK = look; ONE.enterSelect(); await __T.S(500); while (ONE.STAGE !== ST) await __T.tap('Tab'); ONE.G.sel = CHAR_KEYS.indexOf(h); await __T.tap('Enter'); await __T.S(1300); for (let i = 0; i < 2000 && ONE.G.cine; i++) ONE.step(1 / 120, {}); const G = ONE.G, p = G.player; G.enemies.forEach(e => e.dead = true); G.ebullets.length = 0; p.x = 40 * 16; p.y = 18 * 16 - p.h; G.cam.x = p.x - 200; for (let i = 0; i < 90; i++) { p.inv = 0; ONE.step(1/120, {}); } }, { h, ST, look });
      await pg.waitForTimeout(80);
      const box = await pg.evaluate(() => { const G = ONE.G, p = G.player; return { x: (p.x - G.cam.x) * 2, y: (p.y - G.cam.y) * 2 }; });
      await pg.screenshot({ path: OUT + '/' + h + '_' + look + '.png', clip: { x: Math.max(0, box.x - 150), y: Math.max(0, box.y - 110), width: 320, height: 200 } });
      
    }
  }
  console.log('errors', errs); await b.close(); srv.close();
})();
