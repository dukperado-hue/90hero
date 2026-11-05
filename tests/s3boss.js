const { chromium } = require('playwright'); const http = require('http'), fs = require('fs'), path = require('path');
const BOT = fs.readFileSync(__dirname + '/bot.js', 'utf8'); const F = path.resolve(process.argv[2]), OUT = process.argv[3]; fs.mkdirSync(OUT, { recursive: true });
const srv = http.createServer((q, r) => { r.writeHead(200, { 'content-type': 'text/html' }); r.end(fs.readFileSync(F)); }).listen(0);
(async () => {
  const b = await chromium.launch(); const c = await b.newContext({ viewport: { width: 960, height: 540 } }); const pg = await c.newPage(); const errs = []; pg.on('pageerror', e => errs.push(String(e)));
  await pg.goto('http://127.0.0.1:' + srv.address().port + '/'); await pg.addScriptTag({ content: BOT }); await pg.waitForTimeout(400);
  await pg.evaluate(async () => { ONE.enterSelect(); await __T.S(300); while (ONE.STAGE !== 3) await __T.tap('Tab'); ONE.G.sel = CHAR_KEYS.indexOf('sombat'); await __T.tap('Enter'); await __T.S(1300); for (let i = 0; i < 1600 && ONE.G.cine; i++) ONE.step(1 / 120, {}); });
  // song break
  const d = await pg.evaluate(() => { const G = ONE.G, p = G.player; G.lockDone = [1,1,1,1,1].map(()=>true); p.x = 280 * 16; p.y = 18*16 - p.h; G.cam.x = p.x - 200; p.inv = 99; for (let i = 0; i < 120 * 1.5; i++) { p.x += 1; ONE.step(1/120, {}); } return { dance: G.danceT, danced: S3X.danced }; });
  console.log('dance', JSON.stringify(d)); await pg.screenshot({ path: OUT + '/dance.png' });
  const r = await pg.evaluate(() => { const G = ONE.G, p = G.player; p.x = 356 * 16; p.y = 18*16 - p.h; G.cam.x = p.x - 200; p.inv = 99; for (let i = 0; i < 120 * 6; i++) { p.inv = 99; ONE.step(1/120, {}); } const bb = G.boss; return { a3: G.arena3, boss: bb && { x: bb.x / 16, st: bb.state, hp: bb.hp } }; });
  console.log('boss', JSON.stringify(r)); await pg.screenshot({ path: OUT + '/boss.png' });
  const r2 = await pg.evaluate(() => { const G = ONE.G, bb = G.boss; bb.hp = bb.maxHp * 0.45; for (let i = 0; i < 120 * 12; i++) { G.player.inv = 99; ONE.step(1/120, {}); } return { phase: bb.phase, enemies: G.enemies.filter(e => !e.dead).length }; });
  console.log('phase2', JSON.stringify(r2)); await pg.screenshot({ path: OUT + '/boss2.png' });
  const r3 = await pg.evaluate(() => { const G = ONE.G, bb = G.boss; bb.hp = 1; damageBoss(10, G.player.x); for (let i = 0; i < 120 * 1.2; i++) ONE.step(1/120, {}); return { dying: bb.dying }; });
  await pg.screenshot({ path: OUT + '/sink.png' });
  const r4 = await pg.evaluate(() => { const G = ONE.G; for (let i = 0; i < 120 * 4; i++) ONE.step(1/120, {}); const p = G.player; p.x = G.flag.x - 4; for (let i = 0; i < 120 * 8; i++) ONE.step(1/120, {}); return { exit: G.exitOpen, mode: G.mode, dead: G.boss.dead }; });
  console.log('end', JSON.stringify(r3), JSON.stringify(r4), 'errors', errs); await b.close(); srv.close();
})();
