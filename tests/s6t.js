const { chromium } = require('playwright'); const http = require('http'), fs = require('fs'), path = require('path');
const BOT = fs.readFileSync(__dirname + '/bot.js', 'utf8'); const F = path.resolve(process.argv[2]), OUT = process.argv[3]; fs.mkdirSync(OUT, { recursive: true });
const srv = http.createServer((q, r) => { r.writeHead(200, { 'content-type': 'text/html' }); r.end(fs.readFileSync(F)); }).listen(0);
(async () => {
  const b = await chromium.launch(); const c = await b.newContext({ viewport: { width: 960, height: 540 } }); const pg = await c.newPage(); const errs = []; pg.on('pageerror', e => errs.push(String(e)));
  await pg.goto('http://127.0.0.1:' + srv.address().port + '/'); await pg.addScriptTag({ content: BOT }); await pg.waitForTimeout(400);
  await pg.evaluate(async () => { ONE.enterSelect(); await __T.S(300); while (ONE.STAGE !== 6) await __T.tap('Tab'); ONE.G.sel = CHAR_KEYS.indexOf('sombat'); await __T.tap('Enter'); await __T.S(1300); for (let i = 0; i < 1600 && ONE.G.cine; i++) ONE.step(1 / 120, {}); });
  // 1) breath: jiangshi loses you when you hold breath
  const br = await pg.evaluate(() => { const G = ONE.G, p = G.player; G.enemies.forEach(e => e.dead = true); const e = mkEnemy('jiangshi', 30, 18); G.enemies.push(e); p.x = 22 * 16; p.y = 18*16 - p.h; G.cam.x = p.x - 200;
    for (let i = 0; i < 120; i++) { p.inv = 9; ONE.step(1/120, {}); } const s1 = e.state; keys.down = true; for (let i = 0; i < 120 * 1.5; i++) { p.inv = 9; ONE.step(1/120, {}); } const s2 = e.state, b2 = p.breath; for (let i = 0; i < 120 * 3.5; i++) { p.inv = 9; ONE.step(1/120, {}); } const s3 = e.state, gasp = p.gaspT > 0; keys.down = false; return { s1, s2, b2: +b2.toFixed(2), s3, gasp }; });
  console.log('breath', JSON.stringify(br));
  // 2) talisman after 3 hits
  const ta = await pg.evaluate(() => { const e = ONE.G.enemies[ONE.G.enemies.length - 1]; e.hp = 99; for (let k = 0; k < 3; k++) damageEnemy(e, 0.1, e.x - 10, false); return { tali: e.tali > 0 }; });
  console.log('talisman', JSON.stringify(ta));
  // 3) procession passes when you hold your breath
  const pr = await pg.evaluate(() => { const G = ONE.G, p = G.player; G.enemies.forEach(e => e.dead = true); G.lockDone = [1,1,1].map(()=>true); p.x = 106 * 16; p.y = 18*16 - p.h; G.cam.x = p.x - 200; keys.down = true;
    for (let i = 0; i < 120 * 2; i++) { p.inv = 9; p.breath = 1; ONE.step(1/120, {}); } const woke1 = S6.proc && S6.proc.woke; for (let i = 0; i < 120 * 14; i++) { p.inv = 9; p.breath = 1; ONE.step(1/120, {}); } keys.down = false; return { woke1, done: S6.procDone, proc: !!S6.proc }; });
  console.log('procession', JSON.stringify(pr));
  await pg.screenshot({ path: OUT + '/proc.png' });
  // 4) a coffin broken releases a jiangshi
  const cf = await pg.evaluate(() => { const G = ONE.G, p = G.player, c = S6.coffins[0]; p.x = (c.x - 4) * 16; G.cam.x = p.x - 200; const n0 = G.enemies.filter(e => !e.dead && e.type === 'jiangshi').length; damageTile(c.x + 1, c.y, 99); for (let i = 0; i < 30; i++) ONE.step(1/120, {}); return { before: n0, after: G.enemies.filter(e => !e.dead && e.type === 'jiangshi').length, open: c.open }; });
  console.log('coffin', JSON.stringify(cf));
  await pg.screenshot({ path: OUT + '/inn.png' });
  // 5) boss
  const bo = await pg.evaluate(() => { const G = ONE.G, p = G.player; G.enemies.forEach(e => e.dead = true); p.x = 259 * 16; p.y = 18*16 - p.h; G.cam.x = p.x - 200; for (let i = 0; i < 120 * 8; i++) { p.inv = 9; ONE.step(1/120, {}); } const b = G.boss; return b && { st: b.state, x: b.x / 16, y: +(b.y/16).toFixed(1), hp: b.hp, og: b.onGround }; });
  console.log('boss', JSON.stringify(bo)); await pg.screenshot({ path: OUT + '/boss.png' });
  const end = await pg.evaluate(() => { const G = ONE.G; damageBoss(999, G.player.x); for (let i = 0; i < 120 * 3; i++) ONE.step(1/120, {}); const r = { dead: G.boss.dead, exit: G.exitOpen }; G.player.x = G.flag.x - 2; for (let i = 0; i < 120 * 8; i++) ONE.step(1/120, {}); r.mode = G.mode; return r; });
  console.log('end', JSON.stringify(end), 'errors', errs); await b.close(); srv.close();
})();
