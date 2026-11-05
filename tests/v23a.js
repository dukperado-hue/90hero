const { chromium } = require('playwright'); const http = require('http'), fs = require('fs'), path = require('path');
const BOT = fs.readFileSync(__dirname + '/bot.js', 'utf8'); const F = path.resolve(process.argv[2]), OUT = process.argv[3]; fs.mkdirSync(OUT, { recursive: true });
const srv = http.createServer((q, r) => { r.writeHead(200, { 'content-type': 'text/html' }); r.end(fs.readFileSync(F)); }).listen(0);
const R = []; const check = (n, ok, info) => { R.push(ok); console.log((ok ? 'PASS ' : 'FAIL ') + n + ' ' + JSON.stringify(info)); };
(async () => {
  const b = await chromium.launch(); const c = await b.newContext({ viewport: { width: 960, height: 540 }, deviceScaleFactor: 2 }); const pg = await c.newPage(); const errs = []; pg.on('pageerror', e => errs.push(String(e).slice(0, 200)));
  await pg.goto('http://127.0.0.1:' + srv.address().port + '/'); await pg.addScriptTag({ content: BOT }); await pg.waitForTimeout(300);
  await pg.evaluate(async () => { ONE.enterSelect(); await __T.S(400); ONE.G.sel = CHAR_KEYS.indexOf('aamir'); await __T.S(600); });
  await pg.screenshot({ path: OUT + '/select31.png' });
  const start = (h, st) => pg.evaluate(async ({ h, st }) => { ONE.enterSelect(); await __T.S(300); while (ONE.STAGE !== st) await __T.tap('Tab'); ONE.G.sel = CHAR_KEYS.indexOf(h); await __T.tap('Enter'); await __T.S(1200); const G = ONE.G; G.paused = true; let n = 0; for (; n < 600 && G.cine; n++) ONE.step(1 / 120, {}); return { ch: G.player.ch, cine: n }; }, { h, st });
  let r = await start('aamir', 1); check('aamir starts, intro ends', r.ch === 'aamir' && r.cine < 600, r);
  r = await pg.evaluate(() => { const G = ONE.G, p = G.player; const e = G.enemies.find(e => !e.dead && e.type === 'soldier'); e.hp = 30; p.x = e.x - 16; p.y = e.y + e.h - p.h; p.face = 1; const hp0 = e.hp; let fl = false; for (let i = 0; i < 3; i++) { p.atkCd = 0; ONE.step(1 / 120, { shoot: true }); for (let k = 0; k < 10; k++) { ONE.step(1 / 120, {}); if (e.fling > 0) fl = true; } } return { dmg: +(hp0 - e.hp).toFixed(1), flung: fl, combo: p.combo }; });
  check('jab-jab-hook damages and the hook flings', r.dmg > 3 && r.flung, r);
  r = await pg.evaluate(() => { const G = ONE.G, p = G.player; for (let i = 0; i < 200; i++) ONE.step(1 / 120, {}); p.x = G.cp.x; p.y = G.cp.y; p.face = 1; for (let i = 0; i < 30; i++) ONE.step(1 / 120, {}); const x0 = p.x; p.bikeCd = 0; ONE.step(1 / 120, { bomb: true }); let mx = 0; for (let i = 0; i < 60; i++) { ONE.step(1 / 120, {}); mx = Math.max(mx, Math.abs(p.vx)); } return { moved: Math.round(Math.abs(p.x - x0)), mx: Math.round(mx), cd: +p.bikeCd.toFixed(2) }; });
  check('K = bicycle dash', r.moved > 100 && r.mx >= 380, r);
  await pg.evaluate(() => { ONE.G.player.bikeT = 0.5; ONE.G.paused = false; }); await pg.waitForTimeout(120); await pg.screenshot({ path: OUT + '/aamir_bike.png' }); await pg.evaluate(() => { ONE.G.paused = true; });
  r = await pg.evaluate(() => { const G = ONE.G, p = G.player; for (let i = 0; i < 100; i++) ONE.step(1 / 120, {}); const alive0 = G.enemies.filter(e => !e.dead && Math.abs(e.x - p.x) < 260).length; p.ult = 100; ONE.step(1 / 120, { ult: true }); let seen = false; for (let i = 0; i < 300; i++) { ONE.step(1 / 120, {}); if (G.train) seen = true; if (i === 90) { G.paused = false; } } G.paused = true; const alive1 = G.enemies.filter(e => !e.dead && Math.abs(e.x - p.x) < 260).length; return { seen, alive0, alive1, dead: p.dead }; });
  check('L = train dare runs a train through them', r.seen && !r.dead, r);
  // Bollywood physics with Chacha Mega: a launch sends a body through a brick wall
  await start('chiru', 1);
  r = await pg.evaluate(() => { const G = ONE.G, p = G.player; const e = G.enemies.find(e => !e.dead && e.type === 'soldier'); e.hp = 0.5; p.x = e.x - 14; p.y = e.y + e.h - p.h; p.face = 1;
    const tx = Math.floor((e.x + e.w) / 16) + 2, ty = Math.floor((e.y + e.h - 1) / 16); ONE.setTile ? 0 : 0; setTile(tx, ty, T.B); setTile(tx, ty - 1, T.B);
    let hits = 0; for (let k = 0; k < 6 && !e.dead; k++) { p.atkCd = 0; p.combo = 1; ONE.step(1 / 120, { shoot: true }); for (let i = 0; i < 10; i++) ONE.step(1 / 120, {}); }
    for (let i = 0; i < 40; i++) ONE.step(1 / 120, {}); return { dead: e.dead, thru: !!e.thruWall, wall: tileAt(tx, ty) }; });
  check('Bollywood: one punch, through the brick wall', r.dead && r.thru, r);
  check('no page errors', errs.length === 0, errs);
  console.log(R.filter(Boolean).length + '/' + R.length); await b.close(); srv.close();
})();
