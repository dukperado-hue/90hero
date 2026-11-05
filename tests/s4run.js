// Run stage 04 with given heroes using the climbing bot. Usage: node tests/s4run.js <index.html> <outdir> hero1,hero2,...
const { chromium } = require('playwright'); const http = require('http'), fs = require('fs'), path = require('path');
const BOT = fs.readFileSync(__dirname + '/bot.js', 'utf8'), CL = fs.readFileSync(__dirname + '/s4bot.js', 'utf8');
const F = path.resolve(process.argv[2]), OUT = process.argv[3], HEROES = (process.argv[4] || 'sura').split(','); fs.mkdirSync(OUT, { recursive: true });
const srv = http.createServer((q, r) => { r.writeHead(200, { 'content-type': 'text/html' }); r.end(fs.readFileSync(F)); }).listen(0);
const U = 'http://127.0.0.1:' + srv.address().port + '/';
(async () => {
  const b = await chromium.launch();
  const res = await Promise.all(HEROES.map(async h => {
    const c = await b.newContext({ viewport: { width: 960, height: 540 } }); const pg = await c.newPage(); const errs = []; pg.on('pageerror', e => errs.push(String(e).slice(0, 200)));
    await pg.goto(U); await pg.addScriptTag({ content: BOT }); await pg.addScriptTag({ content: CL }); await pg.waitForTimeout(300);
    await pg.evaluate(async h => { ONE.enterSelect(); await __T.S(200); while (ONE.STAGE !== 4) await __T.tap('Tab'); const t = CHAR_KEYS.indexOf(h); for (let i = 0; i < 40 && ONE.G.sel !== t; i++) await __T.tap('ArrowRight'); await __T.tap('Enter'); await __T.S(1200);
      for (let i = 0; i < 80 && ONE.G.cine; i++) ONE.step(1 / 120, {}); }, h);
    const log = []; let r;
    for (let k = 0; k < 70; k++) {
      r = await pg.evaluate(() => __T.climb(10000)); log.push(r.row + '/' + r.i + (r.boss !== '-' ? ':' + r.boss : ''));
      if (k === 2 || (r.arena === 'fight' && !log.shot)) { log.shot = 1; await pg.evaluate(() => { ONE.G.paused = false; }); await pg.waitForTimeout(150); await pg.screenshot({ path: OUT + '/' + h + '_' + k + '.png' }); }
      if (r.mode !== 'play') break;
    }
    await pg.waitForTimeout(500); await pg.screenshot({ path: OUT + '/' + h + '_end.png' });
    const fin = await pg.evaluate(() => ({ mode: ONE.G.mode, rank: ONE.G.rank, time: +ONE.G.time.toFixed(1), deaths: ONE.G.stats.deaths, kills: ONE.G.stats.kills }));
    await c.close(); return { h, fin, log: log.join(' '), errs };
  }));
  for (const x of res) console.log(JSON.stringify(x));
  await b.close(); srv.close();
})();
