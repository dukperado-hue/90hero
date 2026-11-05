// v27: the five new heroes + hero select 2.0.  node heroes5.js <html> <outdir>
const { chromium } = require('playwright'); const http = require('http'), fs = require('fs'), path = require('path');
const BOT = fs.readFileSync(__dirname + '/bot.js', 'utf8'); const F = path.resolve(process.argv[2]), OUT = process.argv[3]; fs.mkdirSync(OUT, { recursive: true });
const srv = http.createServer((q, r) => { r.writeHead(200, { 'content-type': 'text/html' }); r.end(fs.readFileSync(F)); }).listen(0);
const R = []; const check = (n, ok, info) => { R.push(ok); console.log((ok ? 'PASS ' : 'FAIL ') + n + ' ' + JSON.stringify(info)); };
(async () => {
  const b = await chromium.launch(); const c = await b.newContext({ viewport: { width: 960, height: 540 }, deviceScaleFactor: 2 }); const pg = await c.newPage(); const errs = []; pg.on('pageerror', e => errs.push(String(e).slice(0, 200)));
  await pg.goto('http://127.0.0.1:' + srv.address().port + '/'); await pg.addScriptTag({ content: BOT }); await pg.waitForTimeout(300);
  await pg.evaluate(() => { SWAPMODE = false; });   // no stunt-double swaps while we test one hero
  for (const h of ['furie', 'bey', 'gada', 'silat', 'hongbao']) {
    await pg.evaluate(async h => { ONE.enterSelect(); await __T.S(300); ONE.G.sel = CHAR_KEYS.indexOf(h); await __T.S(900); }, h);
    await pg.screenshot({ path: OUT + '/select_' + h + '.png' });
  }
  const R0 = await pg.evaluate(() => ({ n: CHAR_KEYS.length, has: ['furie', 'bey', 'gada', 'silat', 'hongbao'].every(k => CHARS[k] && CHAR_KEYS.includes(k)) }));
  check('five heroes registered', R0.has, R0);
  const start = h => pg.evaluate(async h => { ONE.enterSelect(); await __T.S(300); while (ONE.STAGE !== 1) await __T.tap('Tab'); ONE.G.sel = CHAR_KEYS.indexOf(h); await __T.tap('Enter'); await __T.S(1300); const G = ONE.G; return { ch: G.player.ch, mode: G.mode, cine: G.cine ? 1 : 0 }; }, h);
  // a helper: drop a tough soldier in front of the hero, run a scripted input, report
  const duel = (script) => pg.evaluate(script);
  for (const h of ['furie', 'bey', 'gada', 'silat', 'hongbao']) {
    let r = await start(h); check(h + ' starts', r.ch === h && r.mode === 'play', r);
    await pg.evaluate(async () => { for (let i = 0; i < 40 && ONE.G.cine; i++) await __T.S(100); });
    // J damages
    r = await pg.evaluate(async () => {
      const G = ONE.G, p = G.player; const e = G.enemies.find(e => !e.dead && e.type === 'soldier'); e.hp = 40; p.x = e.x - 14; p.y = e.y + e.h - p.h; p.face = 1; const hp0 = e.hp; e.stun = 99;
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyJ' }));
      for (let k = 0; k < 40; k++) { p.x = Math.min(p.x, e.x - 10); for (let i = 0; i < 15; i++) ONE.step(1 / 120, k % 2 ? { shoot: true } : {}); }
      window.dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyJ' }));
      return { dmg: hp0 - e.hp };
    });
    check(h + ' J deals damage', r.dmg > 3, r);
    // K does something
    r = await pg.evaluate(async h => {
      const G = ONE.G, p = G.player; const e = G.enemies.find(e => !e.dead && e.type === 'soldier' && e !== null); e.hp = 40; e.stun = 99; p.x = e.x - 50; p.y = e.y + e.h - p.h; p.face = 1; p.vx = 0;
      for (let i = 0; i < 60; i++) ONE.step(1 / 120, {}); const hs0 = G.hitstop, php0 = p.hp;   // diagnostic: a stray enemy bullet in the idle second hurts us and sets G.hitstop; step() then swallows the one-frame K press
      p.inv = 99; p.hp = Math.max(p.hp, 3); G.hitstop = 0; const hp0 = e.hp, x0 = p.x, nb0 = G.bullets.length, np0 = (G.projs || []).length;
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK' }));
      let a1 = 0, pr1 = 0; for (let i = 0; i < 120; i++) { ONE.step(1 / 120, i === 0 ? { bomb: true } : {}); if (i === 3) { a1 = (p.n5 || {}).a; pr1 = (G.projs || []).length; } }
      window.dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyK' }));
      const s = p.n5 || {};
      return { hs0: +hs0.toFixed(3), php0, a1: +a1.toFixed(2), pr1, moved: Math.round(p.x - x0), dmg: hp0 - e.hp, shots: G.stats.shots, projs: (G.projs || []).length - np0, a: s.a, mag: s.mag, swing: p.swingK };
    }, h);
    check(h + ' K reacts', (h === 'silat' ? (r.mag < 30 || r.shots > 3) : r.a1 > 0), r);
    // L ultimate
    r = await pg.evaluate(async h => {
      const G = ONE.G, p = G.player; for (let i = 0; i < 100; i++) ONE.step(1 / 120, {}); const kills0 = G.stats.kills, hp0 = p.hp; p.hp = 3;
      const foes = G.enemies.filter(e => !e.dead && Math.abs(e.x - p.x) < 200); foes.forEach(e => { e.stun = 5; });
      p.ult = 100; ONE.step(1 / 120, { ult: true });
      let banner = G.banner && G.banner.title; for (let i = 0; i < 480; i++) ONE.step(1 / 120, {});
      return { ch: p.ch, banner, ults: G.stats.ults, foes: foes.length, killed: G.stats.kills - kills0, hpAfter: p.hp, dead: p.dead };
    }, h);
    check(h + ' L ultimate fires', r.ch === h && r.ults >= 1 && r.banner, r);
    await pg.evaluate(() => { ONE.G.paused = false; }); await pg.waitForTimeout(250);
    await pg.screenshot({ path: OUT + '/play_' + h + '.png' }); await pg.evaluate(() => { ONE.G.paused = true; });
  }
  // bey shrugs every second hit
  await start('bey'); await pg.evaluate(async () => { for (let i = 0; i < 40 && ONE.G.cine; i++) await __T.S(100); });
  let r = await pg.evaluate(() => { const G = ONE.G, p = G.player; p.inv = 0; p.hp = 4; hurtPlayer(1, p.x - 10, false); const a = p.hp; p.inv = 0; hurtPlayer(1, p.x - 10, false); const b2 = p.hp; return { a, b2 }; });
  check('Bey: first hit bounces off, second hurts', r.a === 4 && r.b2 === 3, r);
  // select screen: look presets cycle
  r = await pg.evaluate(() => { const a = LOOK; const names = [cycleLook(), cycleLook(), cycleLook()]; return { a, names, back: LOOK }; });
  check('V cycles three look presets', r.names.length === 3 && r.back === r.a, r);
  check('no page errors', errs.length === 0, errs);
  console.log(R.filter(Boolean).length + '/' + R.length); await b.close(); srv.close();
})();
