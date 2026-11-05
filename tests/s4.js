// Stage 04 checks. Usage: node tests/s4.js <index.html> <outdir> [heroes,comma]
const { chromium } = require('playwright'); const http = require('http'), fs = require('fs'), path = require('path');
const BOT = fs.readFileSync(__dirname + '/bot.js', 'utf8'); const F = path.resolve(process.argv[2]), OUT = process.argv[3]; fs.mkdirSync(OUT, { recursive: true });
const srv = http.createServer((q, r) => { r.writeHead(200, { 'content-type': 'text/html' }); r.end(fs.readFileSync(F)); }).listen(0);
(async () => {
  const b = await chromium.launch(); const errs = [];
  const c = await b.newContext({ viewport: { width: 960, height: 540 } }); const pg = await c.newPage(); pg.on('pageerror', e => errs.push(String(e).slice(0, 300)));
  await pg.goto('http://127.0.0.1:' + srv.address().port + '/'); await pg.addScriptTag({ content: BOT }); await pg.waitForTimeout(400);
  const r = await pg.evaluate(async () => {
    ONE.enterSelect(); await __T.S(200); while (ONE.STAGE !== 4) await __T.tap('Tab');
    await __T.tap('Enter'); await __T.S(1200);
    const G = ONE.G; return { mode: G.mode, ch: G.player.ch, p: [G.player.x, G.player.y], cam: [G.cam.x, G.cam.y], LW: ONE.G && typeof LW !== 'undefined' ? LW : null };
  });
  await pg.waitForTimeout(1500); await pg.screenshot({ path: OUT + '/s4_start.png' });
  console.log(JSON.stringify(r), errs);
  await b.close(); srv.close();
})();
