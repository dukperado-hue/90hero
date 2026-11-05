// v29: control-hint bar re-appears after a stunt-double swap.  node v29.js <html> <outdir>   (bot/scripted test, not a human playtest)
const { chromium } = require('playwright'); const http = require('http'), fs = require('fs'), path = require('path');
const BOT = fs.readFileSync(__dirname + '/bot.js', 'utf8'); const F = path.resolve(process.argv[2]), OUT = process.argv[3] || '/tmp/v29'; fs.mkdirSync(OUT, { recursive: true });
const srv = http.createServer((q, r) => { r.writeHead(200, { 'content-type': 'text/html' }); r.end(fs.readFileSync(F)); }).listen(0);
const R = []; const check = (n, ok, info) => { R.push(ok); console.log((ok ? 'PASS ' : 'FAIL ') + n + ' ' + JSON.stringify(info)); };
(async () => {
  const b = await chromium.launch(); const pg = await (await b.newContext({ viewport: { width: 960, height: 540 } })).newPage(); const errs = []; pg.on('pageerror', e => errs.push(String(e).slice(0, 200)));
  await pg.goto('http://127.0.0.1:' + srv.address().port + '/'); await pg.addScriptTag({ content: BOT }); await pg.waitForTimeout(300);
  await pg.evaluate(async () => { ONE.enterSelect(); await __T.S(300); while (ONE.STAGE !== 1) await __T.tap('Tab'); ONE.G.sel = CHAR_KEYS.indexOf('shaolin'); await __T.tap('Enter'); await __T.S(1200); for (let i = 0; i < 40 && ONE.G.cine; i++) await __T.S(100); });
  let r = await pg.evaluate(() => ({ age: helpAge(), mode: ONE.G.mode }));
  check('hint bar is up at the start of a run', r.age < 14 && r.mode === 'play', r);
  r = await pg.evaluate(() => { ONE.G.time = 40; return { age: helpAge() }; });
  check('hint bar has timed out by 40 s', r.age >= 14, r);
  r = await pg.evaluate(async () => { const G = ONE.G; SWAPMODE = true; swapHero('furie', null); G.paused = false; await __T.S(120); G.paused = true; return { ch: G.player.ch, age: helpAge(), t: +G.time.toFixed(1), helpT0: +G.helpT0.toFixed(1) }; });
  check('a stunt-double swap restarts the hint bar for the new hero', r.ch === 'furie' && r.age < 1 && r.helpT0 >= 40, r);
  // and it really paints: screenshot the bottom strip with a fresh vs an expired timer (the frame loop keeps rendering while paused)
  await pg.evaluate(() => { ONE.G.paused = false; ONE.G.player.inv = 99; });
  const clip = { x: 0, y: 540 - 40, width: 960, height: 24 };
  await pg.evaluate(() => { ONE.G.helpT0 = ONE.G.time - 30; }); await pg.waitForTimeout(250); const stale = await pg.screenshot({ clip });
  await pg.evaluate(() => { ONE.G.helpT0 = ONE.G.time; }); await pg.waitForTimeout(250); const fresh = await pg.screenshot({ clip }); fs.writeFileSync(OUT + '/helpbar_fresh.png', fresh);
  check('hint strip looks different when fresh than when expired', !fresh.equals(stale), { freshBytes: fresh.length, staleBytes: stale.length });
  // input during hit-stop must not be lost (the real-game path: keydown -> pressed -> frame() -> G.pin -> step())
  await pg.evaluate(async () => { ONE.enterSelect(); await __T.S(300); while (ONE.STAGE !== 1) await __T.tap('Tab'); ONE.G.sel = CHAR_KEYS.indexOf('hongbao'); await __T.tap('Enter'); await __T.S(1200); for (let i = 0; i < 40 && ONE.G.cine; i++) await __T.S(100); ONE.G.paused = false; });
  r = await pg.evaluate(async () => { const G = ONE.G, p = G.player; p.inv = 99; const s = n5(p); s.a = 0; G.hitstop = 0.12; await __T.S(20); window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK' })); await __T.S(30); window.dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyK' })); await __T.S(500); return { a: +s.a.toFixed(2), thrown: s.a > -0.3 }; });
  check('K pressed inside a hit-stop freeze still throws the bun', r.thrown, r);
  check('no page errors', errs.length === 0, errs);
  console.log(R.filter(Boolean).length + '/' + R.length); await b.close(); srv.close();
})();
