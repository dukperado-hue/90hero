// v36: stages 08 / 09 / 07-extension smoke run (bot + teleports, not a human playtest).  node stages36.js <html> <outdir>
const { chromium } = require('playwright'); const http = require('http'), fs = require('fs'), path = require('path');
const BOT = fs.readFileSync(__dirname + '/bot.js', 'utf8'); const F = path.resolve(process.argv[2]), OUT = process.argv[3]; fs.mkdirSync(OUT, { recursive: true });
const srv = http.createServer((q, r) => { r.writeHead(200, { 'content-type': 'text/html' }); r.end(fs.readFileSync(F)); }).listen(0);
const R = []; const check = (n, ok, info) => { R.push(ok); console.log((ok ? 'PASS ' : 'FAIL ') + n + ' ' + JSON.stringify(info)); };
(async () => {
  const b = await chromium.launch(); const c = await b.newContext({ viewport: { width: 960, height: 540 } }); const pg = await c.newPage(); const errs = []; pg.on('pageerror', e => errs.push(String(e).slice(0, 300)));
  await pg.goto('http://127.0.0.1:' + srv.address().port + '/'); await pg.addScriptTag({ content: BOT }); await pg.waitForTimeout(300);
  await pg.evaluate(() => { SWAPMODE = false; });
  const start = (h, st) => pg.evaluate(async ([h, st]) => { ONE.setChar(h); (0, eval)('STAGE=' + st); ONE.startGame(); await __T.S(1300); for (let i = 0; i < 80 && ONE.G.cine; i++) await __T.S(100); return { ch: ONE.G.player.ch, mode: ONE.G.mode, st: ONE.STAGE, LW, LH }; }, [h, st]);
  const tp = (tx, steps) => pg.evaluate(([tx, steps]) => { const G = ONE.G, p = G.player; G.lockDone = LOCKS.map(() => true); G.lock = null; G.cam.lock = null; p.x = tx * TS; p.y = groundBelow(p.x + 5, 0) - p.h - 1; p.vx = p.vy = 0; p.inv = 3; snapCamera(); for (let i = 0; i < (steps || 60); i++) ONE.step(1 / 120, {}); ONE.render(); return { x: Math.round(p.x / TS), y: Math.round(p.y / TS), dead: p.dead, foes: G.enemies.filter(e => !e.dead).length, boss: G.boss && G.boss.type }; }, [tx, steps]);
  const shot = n => pg.screenshot({ path: OUT + '/' + n + '.png' });
  // ---------------- STAGE 8
  let r = await start('ota', 8); check('stage 8 starts', r.st === 8 && r.mode === 'play' && r.LW === 660, r);
  await pg.evaluate(() => { for (let i = 0; i < 120 * 3.5; i++) ONE.step(1 / 120, {}); ONE.render(); }); await shot('s8_opening');
  for (const [tx, n] of [[40, 'chaos'], [86, 'school'], [200, 'gym'], [280, 'station'], [360, 'train'], [500, 'mall']]) { r = await tp(tx, 90); await shot('s8_' + n); }
  check('stage 8 zones visited without errors', errs.length === 0, errs.slice(0, 3));
  r = await pg.evaluate(() => { const G = ONE.G; G.enemies.forEach(e => e.dead = true); G.lockDone = LOCKS.map(() => true); G.lock = null; G.cam.lock = null; const p = G.player; const [a, b] = S8.crowds[1]; p.x = (a + 1) * TS; p.y = 12 * TS; p.vy = 100; p.inv = 0; p.hp = 4; for (let i = 0; i < 120; i++) ONE.step(1 / 120, {}); return { dead: p.dead, gaps: S8.crowds.length }; });
  check('library: falling between the shelves = dragged down', r.dead && r.gaps >= 6, r);
  await pg.evaluate(() => { for (let i = 0; i < 120 * 3; i++) ONE.step(1 / 120, {}); });
  r = await pg.evaluate(() => { const G = ONE.G, p = G.player; G.enemies.forEach(e => e.dead = true); p.x = 95 * TS - p.w / 2 + 8; p.y = 18 * TS - p.h; p.vx = 0; p.inv = 9; W36 = true; let top = 99; for (let i = 0; i < 120 * 2; i++) { ONE.step(1 / 120, {}); top = Math.min(top, (p.y + p.h) / TS); } W36 = false; for (let i = 0; i < 30; i++) ONE.step(1 / 120, {}); return { top: +top.toFixed(2), feet: +((p.y + p.h) / TS).toFixed(2), lad: !!p.lad }; });
  check('ladder: hold W climbs to the 2nd-floor landing', r.top <= 13.05 && r.feet <= 13.1, r);
  await pg.evaluate(() => { ONE.render(); }); await pg.screenshot({ path: OUT + '/s8_ladder.png' });
  r = await pg.evaluate(() => { const G = ONE.G, p = G.player; p.x = 112 * TS; p.y = 13 * TS - p.h; p.inv = 9; snapCamera(); for (let i = 0; i < 30; i++) ONE.step(1 / 120, {}); ONE.render(); return 1; }); await pg.screenshot({ path: OUT + '/s8_library.png' });
  await pg.evaluate(() => { for (let i = 0; i < 120 * 3; i++) ONE.step(1 / 120, {}); });
  r = await pg.evaluate(async () => { const G = ONE.G; G.lockDone = LOCKS.map(() => true); G.lock = null; G.cam.lock = null; const p = G.player; p.x = 612 * TS; p.y = 17 * TS - p.h; p.inv = 99; for (let i = 0; i < 120 * 3; i++) ONE.step(1 / 120, {}); return { boss: G.boss && G.boss.type, h: G.boss && G.boss.h, hp: G.boss && G.boss.hp }; });
  check('red mass spawns (half-screen tall)', r.boss === 'redmass' && r.h >= 120, r);
  await pg.evaluate(() => { for (let i = 0; i < 120 * 4; i++) ONE.step(1 / 120, {}); ONE.render(); }); await shot('s8_boss');
  r = await pg.evaluate(() => { const G = ONE.G; for (let k = 0; k < 60; k++) { damageBoss(8, G.boss.x); for (let i = 0; i < 12; i++) ONE.step(1 / 120, {}); } for (let i = 0; i < 120 * 4; i++) ONE.step(1 / 120, {}); return { dead: G.boss && G.boss.dead, exit: G.exitOpen }; });
  check('red mass can be killed, exit opens', r.dead && r.exit, r);
  // ---------------- STAGE 9
  r = await start('krabi', 9); check('stage 9 starts (tall map)', r.st === 9 && r.LH === 40, r);
  for (const [tx, n] of [[30, 'xmd'], [150, 'cats'], [250, 'cape'], [360, 'rail']]) { r = await tp(tx, 90); await shot('s9_' + n); }
  r = await pg.evaluate(() => { const G = ONE.G, p = G.player; p.x = 30 * TS; p.y = groundBelow(p.x, 0) - p.h; const ty = Math.floor((p.y + p.h) / TS) + 1, t0 = tileAt(32, ty); explode(32 * TS, (ty) * TS, 30, 8, { byPlayer: true, noSelf: true }); for (let i = 0; i < 30; i++) ONE.step(1 / 120, {}); return { t0, t1: tileAt(32, ty), ty }; });
  check('stage 9 ground breaks (Broforce)', r.t0 !== 0 && r.t1 === 0, r);
  r = await pg.evaluate(() => { const G = ONE.G; G.lockDone = LOCKS.map(() => true); G.lock = null; G.cam.lock = null; G.enemies.forEach(e => e.dead = true); const p = G.player; p.x = 406 * TS; p.y = 9 * TS - p.h; p.inv = 99; snapCamera(); for (let i = 0; i < 120 * 3; i++) ONE.step(1 / 120, {}); ONE.render(); return { boss: G.boss && G.boss.type }; });
  check('gas king spawns on the summit', r.boss === 'gasking', r); await shot('s9_boss');
  r = await pg.evaluate(() => { const G = ONE.G; for (let i = 0; i < 120 * 5; i++) ONE.step(1 / 120, {}); const n = 0; for (let k = 0; k < 40; k++) { damageBoss(8, G.boss.x); for (let i = 0; i < 12; i++) ONE.step(1 / 120, {}); } for (let i = 0; i < 120 * 4; i++) ONE.step(1 / 120, {}); return { dead: G.boss.dead, exit: G.exitOpen }; });
  check('gas king can be killed, exit opens', r.dead && r.exit, r);
  // ---------------- STAGE 7 EXTENDED
  r = await start('zhanzhao', 7); check('stage 7 starts (now 640 wide)', r.st === 7 && r.LW === 640, r);
  r = await pg.evaluate(() => { const G = ONE.G; return { wall: tileAt(410, 10), exit: G.exitOpen }; }); check('extension is closed until the Baron falls', r.wall !== 0 && !r.exit, r);
  r = await pg.evaluate(() => { const G = ONE.G; G.lockDone = LOCKS.map(() => true); G.cine = null; S7.boat = null; const p = G.player; p.x = 380 * TS; p.y = 17 * TS - p.h; p.inv = 99; snapCamera(); for (let i = 0; i < 120 * 3; i++) ONE.step(1 / 120, {}); for (let k = 0; k < 40 && G.boss && !G.boss.dead; k++) { damageBoss(10, G.boss.x); for (let i = 0; i < 20; i++) ONE.step(1 / 120, {}); } for (let i = 0; i < 120 * 3; i++) ONE.step(1 / 120, {}); return { baron: G.boss && G.boss.type, dead: G.boss && G.boss.dead, wall: tileAt(410, 10), exit: G.exitOpen }; });
  check('Baron falls -> the road continues (no exit yet)', r.dead && r.wall === 0 && !r.exit, r);
  for (const [tx, n] of [[440, 'village'], [500, 'tower'], [548, 'street']]) { r = await tp(tx, 90); await shot('s7x_' + n); }
  r = await pg.evaluate(() => { const G = ONE.G, p = G.player; G.lock = null; G.cam.lock = null; p.x = 557 * TS; p.y = 20 * TS; p.inv = 99; for (let i = 0; i < 120 * 2; i++) ONE.step(1 / 120, {}); p.x = 590 * TS; p.y = 27 * TS - p.h; for (let i = 0; i < 120 * 3; i++) ONE.step(1 / 120, {}); ONE.render(); return { y: p.y / TS, boss: G.boss && G.boss.type, n: G.boss && G.boss.n, camY: Math.round(G.cam.y) }; });
  check('cave gauntlet: boss 1 appears', r.boss === 'trio' && r.n === 1, r); await shot('s7x_cave');
  r = await pg.evaluate(async () => { const G = ONE.G, seen = []; for (let round = 0; round < 3; round++) { for (let k = 0; k < 60 && G.boss && !G.boss.dead; k++) { damageBoss(8, G.boss.x); for (let i = 0; i < 12; i++) ONE.step(1 / 120, {}); } seen.push(G.boss && G.boss.n); for (let i = 0; i < 120 * 5; i++) ONE.step(1 / 120, {}); } return { seen, exit: G.exitOpen }; });
  check('three bosses in a row, then the exit', r.seen.join() === '1,2,3' && r.exit, r);
  check('no page errors', errs.length === 0, errs.slice(0, 5));
  console.log(R.filter(x => x).length + '/' + R.length); await b.close(); srv.close();
})();
