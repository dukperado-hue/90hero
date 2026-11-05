const { chromium } = require('playwright'); const http = require('http'), fs = require('fs'), path = require('path');
const BOT = fs.readFileSync(__dirname + '/bot.js', 'utf8'); const F = path.resolve(process.argv[2]), OUT = process.argv[3]; fs.mkdirSync(OUT, { recursive: true });
const srv = http.createServer((q, r) => { r.writeHead(200, { 'content-type': 'text/html' }); r.end(fs.readFileSync(F)); }).listen(0);
const R = []; const check = (n, ok, info) => { R.push(ok); console.log((ok ? 'PASS ' : 'FAIL ') + n + ' ' + JSON.stringify(info)); };
(async () => {
  const b = await chromium.launch(); const c = await b.newContext({ viewport: { width: 960, height: 540 }, deviceScaleFactor: 2 }); const pg = await c.newPage(); const errs = []; pg.on('pageerror', e => errs.push(String(e).slice(0, 200)));
  await pg.goto('http://127.0.0.1:' + srv.address().port + '/'); await pg.addScriptTag({ content: BOT }); await pg.waitForTimeout(300);
  const start = (h, st) => pg.evaluate(async ({ h, st }) => { ONE.enterSelect(); await __T.S(300); while (ONE.STAGE !== st) await __T.tap('Tab'); ONE.G.sel = CHAR_KEYS.indexOf(h); await __T.tap('Enter'); await __T.S(1200); const G = ONE.G; G.paused = true; for (let i = 0; i < 600 && G.cine; i++) ONE.step(1 / 120, {}); return G.player.ch; }, { h, st });
  const step = (n, ip) => pg.evaluate(({ n, ip }) => { for (let i = 0; i < n; i++) ONE.step(1 / 120, ip || {}); }, { n, ip });
  // ---- gore mode default
  check('gore default is 18+', await pg.evaluate(() => GORE === '18' && BLOOD), {});
  // ---- explosion gibs
  await start('sombat', 1);
  let r = await pg.evaluate(() => { const G = ONE.G, p = G.player; const e = G.enemies.find(e => !e.dead && e.type === 'soldier'); const x = e.x + 5, y = e.y + 8; ONE.explode(x, y, 40, 30, {}); return { dead: e.dead, gibbed: !!e.gibbed, gibs: (G.gibs || []).length, kinds: [...new Set((G.gibs || []).map(g => g.kind))] }; });
  check('explosion kill in 18+ = body in pieces', r.dead && r.gibbed && r.gibs >= 8, r);
  await step(30); await pg.evaluate(() => { ONE.G.paused = false; }); await pg.waitForTimeout(120); await pg.screenshot({ path: OUT + '/gore_boom.png' }); await pg.evaluate(() => { ONE.G.paused = true; });
  // ---- acid -> skeleton
  r = await pg.evaluate(() => { const G = ONE.G; const e = G.enemies.find(e => !e.dead && e.type !== 'heavy'); e.hp = 1; (G.gas = G.gas || []).push({ x: e.x + 5, y: e.y + e.h / 2, r: 40, t: 3, tick: 0 }); for (let i = 0; i < 60; i++) ONE.step(1 / 120, {}); return { dead: e.dead, skel: !!e.skel }; });
  check('acid kill in 18+ = skeleton', r.dead && r.skel, r);
  // ---- blade kill (ximen)
  await start('ximen', 1);
  r = await pg.evaluate(() => { const G = ONE.G, p = G.player; const out = []; for (let k = 0; k < 6; k++) { const e = G.enemies.find(e => !e.dead && e.type === 'soldier' || !e.dead && e.type === 'gunner'); if (!e) break; e.hp = 0.1; p.x = e.x - 16; p.y = e.y + e.h - p.h; p.face = 1; e.x = p.x + 16; ONE.step(1 / 120, { shoot: true }); for (let i = 0; i < 20; i++) ONE.step(1 / 120, {}); out.push(e.dead ? (e.gibbed ? 'gib' : 'corpse') : 'alive'); } return { out, kinds: [...new Set((G.gibs || []).map(g => g.kind))] }; });
  check('blade kills dismember (half / head / limbs)', r.kinds.some(k => ['upper', 'head', 'arm', 'body'].includes(k)), r);
  await pg.evaluate(() => { ONE.G.paused = false; }); await pg.waitForTimeout(150); await pg.screenshot({ path: OUT + '/gore_blade.png' }); await pg.evaluate(() => { ONE.G.paused = true; });
  // ---- cycle
  r = await pg.evaluate(() => [cycleGore(), cycleGore(), cycleGore()]);
  check('B cycles 18+ -> blood -> off -> 18+', r[0].includes('BLOOD ONLY') && r[1].includes('OFF') && r[2].includes('18+'), r);
  // ---- Pai Mei rising crane + five-point
  await start('paimei', 1);
  r = await pg.evaluate(async () => { const G = ONE.G, p = G.player; window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyJ' })); let minVy = 0, y0 = p.y, rose = false; for (let i = 0; i < 80; i++) { ONE.step(1 / 120, {}); minVy = Math.min(minVy, G.player.vy); if (G.player.riseT > 0) rose = true; } window.dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyJ' })); return { rose, minVy: Math.round(minVy), climbed: Math.round(y0 - G.player.y) }; });
  check('U.BROW hold J = rising crane', r.rose && r.minVy < -350, r);
  r = await pg.evaluate(() => { const G = ONE.G, p = G.player; for (let i = 0; i < 200; i++) ONE.step(1 / 120, {}); const e = G.enemies.find(e => !e.dead && e.type === 'soldier'); e.hp = 50; e.maxHp = 50; p.x = e.x - 14; p.y = e.y + e.h - p.h; p.face = 1; p.combo = 2; p.atkCd = 0; ONE.step(1 / 120, { shoot: true }); const marked = e.fpT > 0; let t = 0; while (!e.dead && t < 4) { ONE.step(1 / 120, {}); t += 1 / 120; } return { marked, dead: e.dead, t: +t.toFixed(2) }; });
  check('4th palm marks: dead ~3 s later', r.marked && r.dead && r.t > 2.7 && r.t < 3.3, r);
  // boss under 25%
  await start('paimei', 1);
  r = await pg.evaluate(() => { const G = ONE.G, p = G.player; G.boss = { type: 'boss', x: p.x + 20, y: p.y + p.h - 34, w: 24, h: 34, vx: 0, vy: 0, hp: 30, maxHp: 170, face: -1, state: 'idle', t: 9, flash: 0, onGround: true, dead: false, phase: 2, atk: 0, fireT: 0, mgCd: 0, dying: 0, anim: 0, shown: 1 }; p.face = 1; p.combo = 2; p.atkCd = 0; ONE.step(1 / 120, { shoot: true }); const b = G.boss; const m = b.fpT > 0; let t = 0; while (b.dying <= 0 && !b.dead && t < 4) { b.t = 9; ONE.step(1 / 120, {}); t += 1 / 120; } return { marked: m, dying: b.dying > 0 || b.dead, t: +t.toFixed(2) }; });
  check('boss under 25%: five-point palm finishes him', r.marked && r.dying, r);
  r = await pg.evaluate(() => { const G = ONE.G, p = G.player; G.boss = { type: 'boss', x: p.x + 20, y: p.y + p.h - 34, w: 24, h: 34, vx: 0, vy: 0, hp: 150, maxHp: 170, face: -1, state: 'idle', t: 9, flash: 0, onGround: true, dead: false, phase: 1, atk: 0, fireT: 0, mgCd: 0, dying: 0, anim: 0, shown: 1 }; p.combo = 2; p.atkCd = 0; ONE.step(1 / 120, { shoot: true }); const m = G.boss.fpT > 0; G.boss = null; return { marked: m }; });
  check('boss above 25%: no instant mark', !r.marked, r);
  // ---- Siu Ma off-hand
  await start('ma', 1);
  r = await pg.evaluate(() => { const G = ONE.G, p = G.player; const e = G.enemies.find(e => !e.dead && e.type === 'soldier'); for (const o of G.enemies) if (o !== e) { o.dead = true; o.deadT = 99; } for (let i = 0; i < 120; i++) ONE.step(1 / 120, {}); e.x = p.x + 30; e.y = p.y - 70; e.vy = 0; let up = 0, fwd = 0; window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyJ' })); for (let i = 0; i < 40; i++) { e.y = p.y - 70; e.vy = 0; ONE.step(1 / 120, {}); for (const bl of G.bullets) { if (bl.vy < -200 && !bl.c) { bl.c = 1; up++; } else if (Math.abs(bl.vy) < 30 && !bl.c) { bl.c = 1; fwd++; } } } window.dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyJ' })); return { up, fwd }; });
  check('MAGNUM GOR: one hand forward, the other auto-aims up', r.up > 0 && r.fwd > 0, r);
  check('no page errors', errs.length === 0, errs);
  console.log(R.filter(Boolean).length + '/' + R.length);
  await b.close(); srv.close();
})();
