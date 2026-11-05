const { chromium } = require('playwright'); const http = require('http'), fs = require('fs'), path = require('path');
const BOT = fs.readFileSync(__dirname + '/bot.js', 'utf8'); const F = path.resolve(process.argv[2]), OUT = process.argv[3]; fs.mkdirSync(OUT, { recursive: true });
const srv = http.createServer((q, r) => { r.writeHead(200, { 'content-type': 'text/html' }); r.end(fs.readFileSync(F)); }).listen(0);
(async () => {
  const b = await chromium.launch(); const c = await b.newContext({ viewport: { width: 960, height: 540 } }); const pg = await c.newPage(); const errs = []; pg.on('pageerror', e => errs.push(String(e)));
  await pg.goto('http://127.0.0.1:' + srv.address().port + '/'); await pg.addScriptTag({ content: BOT }); await pg.waitForTimeout(400);
  await pg.evaluate(async (ST) => { ONE.enterSelect(); await __T.S(300); while (ONE.STAGE !== ST) await __T.tap('Tab'); ONE.G.sel = CHAR_KEYS.indexOf('sura'); await __T.tap('Enter'); await __T.S(1300); for (let i = 0; i < 1600 && ONE.G.cine; i++) ONE.step(1 / 120, {}); }, +process.argv[5]);
  for (const [name, tx] of JSON.parse(process.argv[4])) {
    const r = await pg.evaluate((tx) => { const G = ONE.G, p = G.player; G.lockDone = [1,1,1,1,1,1].map(() => true); G.lock = null; G.cam.lock = null; G.enemies.forEach(e => { if (Math.abs(e.x - tx * 16) < 400) e.dead = true; }); p.x = tx * 16; p.y = 18 * 16 - p.h; p.vx = p.vy = 0; G.cam.x = p.x - 200; for (let i = 0; i < 240; i++) { p.inv = 5; p.x = tx * 16; ONE.step(1 / 120, {}); } return { px: p.x / 16, cx: G.cam.x / 16, cp: G.cp.x / 16, dead: p.dead }; }, tx);
    console.log(name, JSON.stringify(r)); await pg.waitForTimeout(100); await pg.screenshot({ path: OUT + '/' + name + '.png' });
  }
  console.log('errors', errs); await b.close(); srv.close();
})();
