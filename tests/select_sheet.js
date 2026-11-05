// screenshot of the select screen for every hero (info panel + stage) → contact sheet.  node select_sheet.js <html> <outdir>
const { chromium } = require('playwright'); const http = require('http'), fs = require('fs'), path = require('path');
const BOT = fs.readFileSync(__dirname + '/bot.js', 'utf8'); const F = path.resolve(process.argv[2]), OUT = process.argv[3]; fs.mkdirSync(OUT, { recursive: true });
const srv = http.createServer((q, r) => { r.writeHead(200, { 'content-type': 'text/html' }); r.end(fs.readFileSync(F)); }).listen(0);
(async () => {
  const b = await chromium.launch(); const c = await b.newContext({ viewport: { width: 960, height: 540 }, deviceScaleFactor: 1 }); const pg = await c.newPage(); const errs = []; pg.on('pageerror', e => errs.push(String(e).slice(0, 200)));
  await pg.goto('http://127.0.0.1:' + srv.address().port + '/'); await pg.addScriptTag({ content: BOT }); await pg.waitForTimeout(300);
  await pg.evaluate(async () => { ONE.enterSelect(); await __T.S(300); });
  const keys = await pg.evaluate(() => CHAR_KEYS);
  for (let i = 0; i < keys.length; i++) { await pg.evaluate(async i => { ONE.G.sel = i; await __T.S(250); }, i); await pg.screenshot({ path: OUT + '/sel_' + String(i).padStart(2, '0') + '_' + keys[i] + '.png', fullPage: false }); }
  console.log('errors', JSON.stringify(errs)); await b.close(); srv.close();
})();
