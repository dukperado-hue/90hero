const { chromium } = require('playwright'); const http = require('http'), fs = require('fs'), path = require('path');
const BOT = fs.readFileSync(__dirname + '/bot.js', 'utf8'); const F = path.resolve(process.argv[2]), OUT = process.argv[3]; fs.mkdirSync(OUT, { recursive: true });
const srv = http.createServer((q, r) => { r.writeHead(200, { 'content-type': 'text/html' }); r.end(fs.readFileSync(F)); }).listen(0);
(async () => {
  const b = await chromium.launch(); const c = await b.newContext({ viewport: { width: 960, height: 540 }, deviceScaleFactor: 2 }); const pg = await c.newPage(); const errs = []; pg.on('pageerror', e => errs.push(String(e)));
  await pg.goto('http://127.0.0.1:' + srv.address().port + '/'); await pg.addScriptTag({ content: BOT }); await pg.waitForTimeout(300);
  await pg.evaluate(async () => { ONE.enterSelect(); await __T.S(300); while (ONE.STAGE !== 4) await __T.tap('Tab'); ONE.G.sel = CHAR_KEYS.indexOf('sura'); await __T.tap('Enter'); await __T.S(1200); for (let i = 0; i < 400 && ONE.G.cine; i++) ONE.step(1 / 120, {}); });
  const shot = async (name, row, tx, steps) => {
    await pg.evaluate(({ row, tx, steps }) => { const G = ONE.G, p = G.player; G.paused = true; p.x = tx * 16; p.y = row * 16 - p.h; p.vx = p.vy = 0; p.inv = 3; for (let i = 0; i < (steps || 90); i++) ONE.step(1 / 120, {}); G.paused = false; }, { row, tx, steps });
    await pg.waitForTimeout(120); await pg.screenshot({ path: OUT + '/' + name + '.png' });
  };
  await pg.screenshot({ path: OUT + '/0_street.png' });
  await shot('1_noodle', 206, 6); await shot('2b_ambush', 185, 13, 260);
  await shot('5_mahjong', 113, 13, 40); await shot('6_sweat', 89, 13); await shot('7_shrine', 65, 13);
  await shot('6_roof', 26, 12, 500);
  await pg.evaluate(() => { ONE.G.jetT = 0; ONE.G.paused = true; for (let i = 0; i < 150; i++) ONE.step(1 / 120, {}); ONE.G.paused = false; }); await pg.waitForTimeout(100); await pg.screenshot({ path: OUT + '/7_jet.png' });
  // world map
  await pg.evaluate(async () => { ONE.G.paused = false; }); 
  console.log('errors', errs); await b.close(); srv.close();
})();
