const { chromium } = require('playwright'); const http = require('http'), fs = require('fs'), path = require('path');
const BOT = fs.readFileSync(__dirname + '/bot.js', 'utf8'); const F = path.resolve(process.argv[2]);
const srv = http.createServer((q, r) => { r.writeHead(200, { 'content-type': 'text/html' }); r.end(fs.readFileSync(F)); }).listen(0);
(async () => {
  const b = await chromium.launch(); const c = await b.newContext({ viewport: { width: 960, height: 540 } }); const pg = await c.newPage(); const errs = []; pg.on('pageerror', e => errs.push(String(e).slice(0, 200)));
  await pg.goto('http://127.0.0.1:' + srv.address().port + '/'); await pg.addScriptTag({ content: BOT }); await pg.waitForTimeout(300);
  const out = await pg.evaluate(async () => {
    const res = [];
    for (const k of CHAR_KEYS) {
      ONE.enterSelect(); await __T.S(350); while (ONE.STAGE !== 4) await __T.tap('Tab');
      const t = CHAR_KEYS.indexOf(k); ONE.G.sel = t; await __T.tap('Enter'); await __T.S(1200);
      const G = ONE.G; G.paused = true; let n = 0; while (G.cine && n < 2400) { ONE.step(1 / 120, {}); n++; }
      for (let i = 0; i < 360; i++) ONE.step(1 / 120, {});
      const p = G.player; res.push([k, G.player.ch === k, n, Math.round(p.x), Math.round(p.y + p.h), p.dead ? 'DEAD' : 'ok', p.onGround ? 'G' : 'air', Math.round(G.cam.y)]);
      G.paused = false;
    }
    return res;
  });
  const bad = out.filter(r => !r[1] || r[5] !== 'ok' || r[4] !== 2336 || r[2] >= 2400);
  console.log(out.map(r => r.join(':')).join('  ')); console.log('BAD', JSON.stringify(bad), 'errors', errs.slice(0, 5));
  await b.close(); srv.close();
})();
