// v35: GUEST STARS — rescued doubles can be locked heroes; a guest lasts until the next death.  node guest35.js <html> <outdir>
// Bot run (scripted cage breaks), not a human playtest.
const { chromium } = require('playwright'); const http = require('http'), fs = require('fs'), path = require('path');
const BOT = fs.readFileSync(__dirname + '/bot.js', 'utf8'); const F = path.resolve(process.argv[2]), OUT = process.argv[3]; fs.mkdirSync(OUT, { recursive: true });
const srv = http.createServer((q, r) => { r.writeHead(200, { 'content-type': 'text/html' }); r.end(fs.readFileSync(F)); }).listen(0);
const R = []; const check = (n, ok, info) => { R.push(ok); console.log((ok ? 'PASS ' : 'FAIL ') + n + ' ' + JSON.stringify(info)); };
(async () => {
  const b = await chromium.launch(); const c = await b.newContext({ viewport: { width: 960, height: 540 } }); const pg = await c.newPage(); const errs = []; pg.on('pageerror', e => errs.push(String(e).slice(0, 200)));
  const base = 'http://127.0.0.1:' + srv.address().port + '/';
  await pg.goto(base); await pg.evaluate(() => localStorage.clear());
  await pg.goto(base + '?locks=1'); await pg.addScriptTag({ content: BOT }); await pg.waitForTimeout(400);
  const start = await pg.evaluate(async () => {
    SWAPMODE = true; ONE.enterSelect(); await __T.S(300); while (ONE.STAGE !== 1) await __T.tap('Tab');
    ONE.G.sel = CHAR_KEYS.indexOf(STARTERS[0]); await __T.tap('Enter'); await __T.S(1300);
    for (let i = 0; i < 60 && ONE.G.cine; i++) await __T.S(100);
    return { ch: ONE.G.player.ch, unlocked: CHAR_KEYS.filter(isUnlocked).length, total: CHAR_KEYS.length, cages: CG.list.length };
  });
  check('locks on: some heroes locked, cages placed', start.unlocked < start.total && start.cages > 0, start);
  // break every cage in turn; record who comes out
  const run = await pg.evaluate(async () => {
    const G = ONE.G, out = [];
    for (const c of CG.list) {
      G.enemies.forEach(e => e.dead = true); const p = G.player; p.x = c.x - 30; p.y = c.y + 26 - p.h; p.vx = p.vy = 0; G.cam.x = p.x - 200;
      for (let i = 0; i < 30; i++) ONE.step(1 / 120, {});
      for (let k = 0; k < 3; k++) hitCage(c, 1, 1);
      for (let i = 0; i < 120; i++) ONE.step(1 / 120, {});
      out.push({ ch: G.player.ch, locked: !isUnlocked(G.player.ch), guest: G.guest, prev: G.guestPrev });
    }
    return { out, guests: G.stats.guests || 0 };
  });
  check('every rescue swaps the hero', run.out.every((o, i) => i === 0 || o.ch !== run.out[i - 1].ch), run.out.map(o => o.ch));
  check('at least one guest star (forced by the 4th rescue)', run.guests >= 1, { guests: run.guests });
  check('guest flag matches locked hero', run.out.every(o => !!o.guest === o.locked), run.out);
  // make sure we are a guest now, then die: back to an owned hero
  const d = await pg.evaluate(async () => {
    const G = ONE.G; const lk = CHAR_KEYS.filter(k => k !== 'zhang' && !isUnlocked(k));
    if (!G.guest) swapHero(lk[0], null); for (let i = 0; i < 60; i++) ONE.step(1 / 120, {});
    const g = G.guest, prev = G.guestPrev; G.takes = 5; G.player.inv = 0; G.player.hp = 1; hurtPlayer(99, G.player.x + 20);
    for (let i = 0; i < 120 * 4; i++) ONE.step(1 / 120, {});
    return { g, prev, now: G.player.ch, dead: G.player.dead, ownedNow: isUnlocked(G.player.ch), guestAfter: G.guest };
  });
  check('after "CUT!" a guest returns you to an owned hero', d.g && !d.dead && d.ownedNow && d.now === d.prev && !d.guestAfter, d);
  await pg.screenshot({ path: OUT + '/after_wrap.png' });
  // screenshot of a guest entrance
  await pg.evaluate(async () => { const G = ONE.G; const lk = CHAR_KEYS.filter(k => k !== 'zhang' && !isUnlocked(k)); swapHero(lk[1] || lk[0], null); for (let i = 0; i < 30; i++) ONE.step(1 / 120, {}); ONE.render(); });
  await pg.screenshot({ path: OUT + '/guest_entrance.png' });
  // UNLOCK_ALL (default URL): no guests possible, swaps still rotate through fresh heroes
  await pg.goto(base); await pg.addScriptTag({ content: BOT }); await pg.waitForTimeout(400);
  const all = await pg.evaluate(async () => {
    SWAPMODE = true; ONE.enterSelect(); await __T.S(300); while (ONE.STAGE !== 1) await __T.tap('Tab'); ONE.G.sel = CHAR_KEYS.indexOf('wah'); await __T.tap('Enter'); await __T.S(1300);
    const seen = []; for (let k = 0; k < 8; k++) { pickDouble(); } return { used: ONE.G.heroUsed.size, guests: ONE.G.stats.guests || 0 };
  });
  check('default build (all unlocked): deck gives fresh heroes, no guests', all.used >= 8 && all.guests === 0, all);
  check('no page errors', errs.length === 0, errs);
  console.log(R.filter(x => x).length + '/' + R.length); await b.close(); srv.close();
})();
