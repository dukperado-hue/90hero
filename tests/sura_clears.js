const { chromium } = require('playwright'); const http = require('http'), fs = require('fs'), path = require('path');
const FILES = process.argv.slice(2).map(f => path.resolve(f)); const BOT = fs.readFileSync(__dirname + '/bot.js', 'utf8');
const N = 4;
(async () => {
  const browser = await chromium.launch(); const out = {};
  await Promise.all(FILES.map(async (F, fi) => {
    const srv = http.createServer((q, r) => { r.writeHead(200, { 'content-type': 'text/html' }); r.end(fs.readFileSync(F)); }).listen(0);
    const U = 'http://127.0.0.1:' + srv.address().port + '/';
    out[F] = await Promise.all([...Array(N)].map(async () => {
      const c = await browser.newContext({ viewport: { width: 960, height: 540 } }); const pg = await c.newPage(); const errs = []; pg.on('pageerror', e => errs.push(String(e)));
      await pg.goto(U); await pg.addScriptTag({ content: BOT }); await pg.waitForTimeout(300);
      const r = await pg.evaluate(async () => {
        if (!ONE.PROG.unlocked.includes('sura')) ONE.PROG.unlocked.push('sura'); ONE.enterSelect(); await __T.S(300);
        const t = CHAR_KEYS.indexOf('sura'); for (let i = 0; i < 40 && ONE.G.sel !== t; i++) await __T.tap('ArrowRight');
        await __T.tap('Enter'); await __T.S(1200);
        const t0 = performance.now(); while (ONE.G.mode === 'play' && performance.now() - t0 < 200000) await __T.bot(10000, { stop: true, noCheat: true });
        const G = ONE.G; return { mode: G.mode, time: Math.round(G.time), deaths: G.stats.deaths };
      });
      await c.close(); r.err = errs.length; return r;
    }));
    srv.close();
  }));
  for (const f in out) console.log(path.basename(path.dirname(f)), JSON.stringify(out[f]));
  await browser.close();
})();
