const { chromium } = require('playwright'); const http = require('http'), fs = require('fs'), path = require('path');
const BOT = fs.readFileSync(__dirname + '/bot.js', 'utf8'); const [F, OUT] = [path.resolve(process.argv[2]), process.argv[3]]; fs.mkdirSync(OUT, { recursive: true });
const srv = http.createServer((q, r) => { r.writeHead(200, { 'content-type': 'text/html' }); r.end(fs.readFileSync(F)); }).listen(0);
(async () => {
  const b = await chromium.launch(); const errs = [];
  const c = await b.newContext({ viewport: { width: 960, height: 540 }, deviceScaleFactor: 2 }); const pg = await c.newPage(); pg.on('pageerror', e => errs.push(String(e)));
  await pg.goto('http://127.0.0.1:' + srv.address().port + '/'); await pg.addScriptTag({ content: BOT }); await pg.waitForTimeout(500);
  await pg.evaluate(async () => { if (!ONE.PROG.unlocked.includes('sura')) ONE.PROG.unlocked.push('sura'); ONE.enterSelect(); await __T.S(300);
    const t = CHAR_KEYS.indexOf('sura'); for (let i = 0; i < 40 && ONE.G.sel !== t; i++) await __T.tap('ArrowRight'); await __T.S(400); });
  await pg.screenshot({ path: OUT + '/select.png' });
  await pg.evaluate(async () => { await __T.tap('Enter'); await __T.S(1200); await __T.bot(1500, {}); });
  await pg.screenshot({ path: OUT + '/stage1_start.png' });
  // walk to the first knife thug and frame a fight
  const info = await pg.evaluate(async () => { const G = ONE.G; const k = G.enemies.find(e => e.type === 'knife' && !e.dead); if (!k) return 'no knife';
    G.player.x = k.x - 70; G.player.y = k.y + k.h - G.player.h - 2; await __T.S(50); G.paused = false;
    for (let i = 0; i < 40 && k.state !== 'wind' && k.state !== 'lunge'; i++) await __T.S(50);
    G.paused = false; return k.state; });
  await pg.screenshot({ path: OUT + '/stage1_thug_attack.png' });
  await pg.evaluate(async () => { ONE.G.paused = false; await __T.bot(4000, {}); ONE.G.paused = false; });
  await pg.screenshot({ path: OUT + '/stage1_fight.png' });
  await pg.evaluate(async () => { ONE.G.paused = false; await __T.bot(20000, {}); ONE.G.paused = false; });
  await pg.screenshot({ path: OUT + '/stage1_mid.png' });
  console.log(JSON.stringify({ info, errs })); await b.close(); srv.close();
})();
