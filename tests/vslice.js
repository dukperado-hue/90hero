// Vertical slice test: Drunken Uncle sprites. Usage: node tests/vslice.js <index.html> <outdir>
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const FILE = path.resolve(process.argv[2]), OUT = path.resolve(process.argv[3]); fs.mkdirSync(OUT, { recursive: true });
const BOT = fs.readFileSync(__dirname + '/bot.js', 'utf8');
const server = http.createServer((q, r) => { r.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); r.end(fs.readFileSync(FILE)); }).listen(0);
const URL = 'http://127.0.0.1:' + server.address().port + '/';
const SEED = `(()=>{let s=12345;Math.random=()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296;};})();`;
const errors = [];
async function open(browser, q, seed) {
  const ctx = await browser.newContext({ viewport: { width: 960, height: 540 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage(); page.on('pageerror', e => errors.push(String(e)));
  if (seed) await page.addInitScript(SEED);
  await page.goto(URL + (q || '')); await page.addScriptTag({ content: BOT }); await page.waitForTimeout(400);
  return page;
}
async function start(page, stage) {
  return page.evaluate(async stage => {
    if (!ONE.PROG.unlocked.includes('sura')) ONE.PROG.unlocked.push('sura');
    if (ONE.G.mode !== 'select') ONE.enterSelect(); await __T.S(300);
    while (ONE.STAGE !== stage) await __T.tap('Tab');
    const t = CHAR_KEYS.indexOf('sura'); for (let i = 0; i < 40 && ONE.G.sel !== t; i++) await __T.tap('ArrowRight');
    await __T.S(500);
    return { sel: CHAR_KEYS[ONE.G.sel] };
  }, stage);
}
(async () => {
  const browser = await chromium.launch(); const R = {};
  // 1. select screen screenshot
  let pg = await open(browser); R.select = await start(pg, 1);
  R.sprOk = await pg.evaluate(() => typeof SPR !== 'undefined' ? SPR.ok : 'no-sprite-build');
  await pg.screenshot({ path: OUT + '/01_select.png' });
  await pg.evaluate(async () => { await __T.tap('Enter'); await __T.S(1200); });
  // skip intro, then pose gallery on stage 1 (2x)
  await pg.evaluate(async () => { for (let i = 0; i < 60 && (ONE.G.cine || ONE.G.mode !== 'play'); i++) { await __T.tap('Enter'); await __T.S(1200); } await __T.bot(3000, {}); });
  const pose = async (name, fn) => {
    await pg.evaluate(fn); await pg.waitForTimeout(120); await pg.screenshot({ path: OUT + '/s1_' + name + '.png' });
  };
  const P = 'const G=ONE.G,p=G.player;G.paused=false;p.inv=0;p.flash=0;p.swingT=0;p.dodgeT=0;p.drinkT=-1;p.crouch=false;';
  await pose('idle', new Function(P + 'p.vx=0;'));
  await pose('punch', new Function(P + 'p.swingT=5;p.swingK="punch";'));
  await pose('kick', new Function(P + 'p.swingT=5;p.swingK="kick";'));
  await pose('crouch', new Function(P + 'p.crouch=true;'));
  await pose('drink', new Function(P + 'p.drinkT=5;'));
  await pose('dodge', new Function(P + 'p.dodgeT=5;'));
  await pose('hurt_flash', new Function(P + 'p.flash=5;'));
  // live run frames
  await pg.evaluate(async () => { await __T.bot(1500, {}); }); await pg.screenshot({ path: OUT + '/s1_run_live.png' });
  // perf: frame time over 3 s real-time
  R.fps = await pg.evaluate(() => new Promise(res => { let n = 0; const t0 = performance.now(); const f = () => { n++; if (performance.now() - t0 < 3000) requestAnimationFrame(f); else res(+(n / 3).toFixed(1)); }; requestAnimationFrame(f); }));
  // full stage 1 clear with the bot (no cheats)
  R.clear1 = await pg.evaluate(async () => { const t0 = performance.now(); let r; while (ONE.G.mode === 'play' && performance.now() - t0 < 300000) r = await __T.bot(10000, { stop: true, noCheat: true }); const G = ONE.G; return { mode: G.mode, time: +G.time.toFixed(1), deaths: G.stats.deaths, kills: G.stats.kills, drinks: G.stats.drinks, dodges: G.stats.dodges }; });
  await pg.screenshot({ path: OUT + '/s1_clear.png' });
  await pg.context().close();
  // stage 3 (1x render tier)
  pg = await open(browser); await start(pg, 3); await pg.evaluate(async () => { await __T.tap('Enter'); await __T.S(1200); for (let i = 0; i < 60 && (ONE.G.cine || ONE.G.mode !== 'play'); i++) { await __T.tap('Enter'); await __T.S(1200); } await __T.bot(4000, {}); });
  await pg.screenshot({ path: OUT + '/s3_live.png' }); await pg.context().close();
  // 2. determinism: same seed + same bot input, sprites on vs off -> identical simulation
  const trace = async q => {
    const p2 = await open(browser, q, true); await start(p2, 1);
    const t = await p2.evaluate(async () => { await __T.tap('Enter'); await __T.S(1200); for (let i = 0; i < 60 && (ONE.G.cine || ONE.G.mode !== 'play'); i++) { await __T.tap('Enter'); await __T.S(1200); } const out = []; for (let i = 0; i < 6; i++) { await __T.bot(5000, { noCheat: true }); const G = ONE.G, p = G.player; out.push([+p.x.toFixed(2), +p.y.toFixed(2), p.w, p.h, G.stats.kills, G.stats.deaths]); } return out; });
    await p2.context().close(); return t;
  };
  const on = await trace(''), off = await trace('?sprites=0');
  R.traceOn = on; R.traceOff = off; R.identical = JSON.stringify(on) === JSON.stringify(off);
  R.errors = errors.slice(0, 5);
  console.log(JSON.stringify(R, null, 1));
  await browser.close(); server.close();
})();
