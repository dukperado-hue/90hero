const { chromium } = require('playwright'); const http = require('http'), fs = require('fs'), path = require('path');
const BOT = fs.readFileSync(__dirname + '/bot.js', 'utf8'); const F = path.resolve(process.argv[2]), OUT = process.argv[3]; fs.mkdirSync(OUT, { recursive: true });
const srv = http.createServer((q, r) => { r.writeHead(200, { 'content-type': 'text/html' }); r.end(fs.readFileSync(F)); }).listen(0);
(async () => {
  const b = await chromium.launch(); const c = await b.newContext({ viewport: { width: 960, height: 540 } }); const pg = await c.newPage(); const errs = []; pg.on('pageerror', e => errs.push(String(e)));
  await pg.goto('http://127.0.0.1:' + srv.address().port + '/'); await pg.addScriptTag({ content: BOT }); await pg.waitForTimeout(400);
  for (const st of [1, 2, 3, 4, 5, 6]) {
    const r = await pg.evaluate(async (st) => { ONE.enterSelect(); await __T.S(400); while (ONE.STAGE !== st) await __T.tap('Tab'); ONE.G.sel = CHAR_KEYS.indexOf('sombat'); await __T.tap('Enter'); await __T.S(1300); for (let i = 0; i < 2000 && ONE.G.cine; i++) ONE.step(1 / 120, {}); for (let i = 0; i < 10; i++) ONE.step(1/120, {});
      return { n: CG.list.length, at: CG.list.map(c => c.tx + ',' + c.ty), takes: ONE.G.takes }; }, st);
    console.log('stage', st, JSON.stringify(r));
    if (st === 1) {
      const t = await pg.evaluate(() => { const G = ONE.G, p = G.player, c = CG.list[0]; G.enemies.forEach(e => e.dead = true); p.x = c.x - 30; p.y = c.y + 26 - p.h; G.cam.x = p.x - 200; for (let i = 0; i < 60; i++) ONE.step(1/120, {}); const ch0 = p.ch;
        for (let k = 0; k < 3; k++) hitCage(c, 1, 1); for (let i = 0; i < 120; i++) ONE.step(1/120, {}); return { open: c.open, takes: G.takes, ch0, ch1: G.player.ch, actor: G.actor }; });
      console.log('rescue', JSON.stringify(t)); await pg.screenshot({ path: OUT + '/swap.png' });
      const d = await pg.evaluate(() => { const G = ONE.G; G.takes = 1; G.player.inv = 0; hurtPlayer(99, G.player.x + 20); for (let i = 0; i < 120 * 2; i++) ONE.step(1/120, {}); const w = { wrapping: G.wrapping, takes: G.takes }; for (let i = 0; i < 120 * 2.5; i++) ONE.step(1/120, {}); w.newTakes = ONE.G.takes; w.mode = ONE.G.mode; return w; });
      console.log('wrap', JSON.stringify(d));
      await pg.evaluate(async () => { const G = ONE.G, c = CG.list[1]; G.enemies.forEach(e => e.dead = true); const p = G.player; p.x = c.x - 40; p.y = c.y + 26 - p.h; G.cam.x = p.x - 200; for (let i = 0; i < 60; i++) ONE.step(1/120, {}); });
      await pg.waitForTimeout(100); await pg.screenshot({ path: OUT + '/cage.png' });
    }
  }
  console.log('errors', errs); await b.close(); srv.close();
})();
