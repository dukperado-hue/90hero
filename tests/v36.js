// v36: new heroes (krabi, zhanzhao), Rockman charge (li/lady/oldboy/krabi only), combo counter.  node v36.js <html> <outdir>   (bot run, not a human playtest)
const { chromium } = require('playwright'); const http = require('http'), fs = require('fs'), path = require('path');
const BOT = fs.readFileSync(__dirname + '/bot.js', 'utf8'); const F = path.resolve(process.argv[2]), OUT = process.argv[3]; fs.mkdirSync(OUT, { recursive: true });
const srv = http.createServer((q, r) => { r.writeHead(200, { 'content-type': 'text/html' }); r.end(fs.readFileSync(F)); }).listen(0);
const R = []; const check = (n, ok, info) => { R.push(ok); console.log((ok ? 'PASS ' : 'FAIL ') + n + ' ' + JSON.stringify(info)); };
(async () => {
  const b = await chromium.launch(); const c = await b.newContext({ viewport: { width: 960, height: 540 } }); const pg = await c.newPage(); const errs = []; pg.on('pageerror', e => errs.push(String(e).slice(0, 300)));
  await pg.goto('http://127.0.0.1:' + srv.address().port + '/'); await pg.addScriptTag({ content: BOT }); await pg.waitForTimeout(300);
  await pg.evaluate(() => { SWAPMODE = false; });
  const start = (h, st) => pg.evaluate(async ([h, st]) => { ONE.enterSelect(); await __T.S(300); while (ONE.STAGE !== st) await __T.tap('Tab'); ONE.G.sel = CHAR_KEYS.indexOf(h); await __T.tap('Enter'); await __T.S(1300); for (let i = 0; i < 60 && ONE.G.cine; i++) await __T.S(100); return { ch: ONE.G.player.ch, mode: ONE.G.mode }; }, [h, st || 1]);
  for (const h of ['krabi', 'zhanzhao']) {
    await pg.evaluate(async h => { ONE.enterSelect(); await __T.S(300); ONE.G.sel = CHAR_KEYS.indexOf(h); await __T.S(700); }, h);
    await pg.screenshot({ path: OUT + '/select_' + h + '.png' });
    let r = await start(h); check(h + ' starts', r.ch === h && r.mode === 'play', r);
    r = await pg.evaluate(() => {
      const G = ONE.G, p = G.player; const e = G.enemies.find(e => !e.dead && e.type === 'soldier'); e.hp = 60; e.maxHp = 60; p.x = e.x - 16; p.y = e.y + e.h - p.h; p.face = 1; e.stun = 99; const hp0 = e.hp;
      for (let k = 0; k < 30; k++) { p.x = Math.min(p.x, e.x - 12); for (let i = 0; i < 15; i++) ONE.step(1 / 120, k % 2 ? { shoot: true } : {}); }
      return { dmg: hp0 - e.hp, combo: G.hc ? G.hc.best : 0 };
    });
    check(h + ' J deals damage + combo counts', r.dmg > 4 && r.combo >= 3, r);
    r = await pg.evaluate(() => {
      const G = ONE.G, p = G.player; G.enemies.forEach(e => { if (!e.dead && Math.abs(e.x - p.x) > 200) e.dead = true; }); const e = G.enemies.find(e => !e.dead && e.type === 'soldier') || G.enemies.find(e => !e.dead);
      e.hp = 10; e.stun = 99; p.x = e.x - 30; p.y = e.y + e.h - p.h; p.face = 1; p.atkCd = 0; if (p.h36) { p.h36.a = 0; p.h36.blade = null; }
      for (let i = 0; i < 4; i++) ONE.step(1 / 120, { bomb: true }); for (let i = 0; i < 160; i++) ONE.step(1 / 120, {});
      return { hp: e.hp, dead: e.dead, guil: (G.guil36 || []).length };
    });
    check(h + ' K special hurts', r.dead || r.hp < 10, r);
    r = await pg.evaluate(() => { const G = ONE.G, p = G.player; p.ult = 100; for (let i = 0; i < 3; i++) ONE.step(1 / 120, { ult: true }); for (let i = 0; i < 240; i++) ONE.step(1 / 120, {}); return { banner: G.banner && G.banner.title, ult: p.ult }; });
    check(h + ' L ultimate', r.ult < 100 && !!r.banner, r);
    await pg.screenshot({ path: OUT + '/play_' + h + '.png' });
  }
  // charge: only li / lady / oldboy / krabi
  for (const h of ['lady', 'oldboy', 'krabi', 'fei']) {
    await start(h);
    const r = await pg.evaluate(async () => {
      const G = ONE.G, p = G.player; G.enemies.forEach(e => e.dead = true); const n0 = (G.projs || []).length;
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyJ' }));
      let lv = 0; for (let i = 0; i < 120 * 1.8; i++) { ONE.step(1 / 120, {}); if (p.ch36) lv = Math.max(lv, p.ch36.lv); }
      ONE.render(); window.dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyJ' }));
      ONE.step(1 / 120, {}); const waves = (G.projs || []).filter(q => q.kind === 'cwave').length;
      return { lv, waves, charged: G.stats.charged || 0 };
    });
    if (h === 'fei') check('fei has NO charge (not on the list)', r.lv === 0 && r.waves === 0, r);
    else check(h + ' charges to level 2 and fires', r.lv === 2 && r.charged >= 1, r);
  }
  check('no page errors', errs.length === 0, errs);
  console.log(R.filter(x => x).length + '/' + R.length); await b.close(); srv.close();
})();
