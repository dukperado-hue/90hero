const { chromium } = require('playwright'); const http = require('http'), fs = require('fs'), path = require('path');
const F = path.resolve(process.argv[2]), ST = +process.argv[3], HEROES = process.argv[4].split(','); const BOT = fs.readFileSync(__dirname + '/bot.js', 'utf8');
(async () => {
  const browser = await chromium.launch();
  const srv = http.createServer((q, r) => { r.writeHead(200, { 'content-type': 'text/html' }); r.end(fs.readFileSync(F)); }).listen(0);
  const U = 'http://127.0.0.1:' + srv.address().port + '/';
  const out = await Promise.all(HEROES.map(async h => {
    const c = await browser.newContext({ viewport: { width: 960, height: 540 } }); const pg = await c.newPage(); const errs = []; pg.on('pageerror', e => errs.push(String(e).slice(0, 200)));
    await pg.goto(U); await pg.addScriptTag({ content: BOT }); await pg.waitForTimeout(300);
    const r = await pg.evaluate(async ({ h, ST }) => {
      ONE.enterSelect(); await __T.S(300); while (ONE.STAGE !== ST) await __T.tap('Tab'); ONE.G.sel = CHAR_KEYS.indexOf(h); await __T.tap('Enter'); await __T.S(1300);
      const t0 = performance.now(); while (ONE.G.mode === 'play' && performance.now() - t0 < 420000) await __T.bot(10000, { stop: true, noCheat: true });
      const G = ONE.G; return { mode: G.mode, time: Math.round(G.time), deaths: G.stats.deaths, kills: G.stats.kills, glass: G.stats.glass || 0, x: Math.round(G.player.x / 16) };
    }, { h, ST });
    await c.close(); r.h = h; r.err = errs.slice(0, 2); return r;
  }));
  for (const o of out) console.log(JSON.stringify(o));
  await browser.close(); srv.close();
})();
