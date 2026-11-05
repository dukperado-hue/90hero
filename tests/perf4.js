const { chromium } = require('playwright'); const http = require('http'), fs = require('fs');
const BOT = fs.readFileSync('tests/bot.js', 'utf8');
const srv = http.createServer((q, r) => { r.writeHead(200, { 'content-type': 'text/html' }); r.end(fs.readFileSync(process.argv[2])); }).listen(0);
(async () => { const b = await chromium.launch(); const pg = await (await b.newContext({ viewport: { width: 960, height: 540 } })).newPage();
  await pg.goto('http://127.0.0.1:' + srv.address().port + '/'); await pg.addScriptTag({ content: BOT }); await pg.waitForTimeout(300);
  const r = await pg.evaluate(async (st) => { ONE.enterSelect(); await __T.S(300); while (ONE.STAGE !== st) await __T.tap('Tab'); await __T.tap('Enter'); await __T.S(2500);
    const t = []; let last = performance.now(); return await new Promise(res => { const f = () => { const n = performance.now(); t.push(n - last); last = n; if (t.length < 300) requestAnimationFrame(f); else { t.sort((a, b) => a - b); res({ fps: +(1000 / (t.reduce((a, b) => a + b) / t.length)).toFixed(1), p95: +t[285].toFixed(1) }); } }; requestAnimationFrame(f); }); }, +process.argv[3]);
  console.log('stage', process.argv[3], JSON.stringify(r)); await b.close(); srv.close(); })();
