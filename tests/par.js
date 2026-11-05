// Progression tests for ONE MORE RUN. Usage: node tests/progression.test.js <path/to/index.html>
// Real stage clears are played by the bot in tests/bot.js through synthetic keyboard input.
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const FILE = path.resolve(process.argv[2]);
const BOT = fs.readFileSync(__dirname + '/bot.js', 'utf8');
const SHOTS = path.resolve(__dirname, '../shots'); fs.mkdirSync(SHOTS, { recursive: true });
const KEYS = ["wah", "ma", "fei", "nine", "siang", "sura", "li", "ximen", "chiru", "dong", "zhang", "vijay", "ram", "singham", "michelle", "phiphop", "srk", "rajini", "madong", "oldboy", "kham", "paimei", "lady", "ichi", "ogami"];
const results = []; const errors = [];
function check(name, ok, info) { results.push({ name, ok: !!ok, info }); console.log((ok ? 'PASS ' : 'FAIL ') + name + (info !== undefined ? '  ' + JSON.stringify(info) : '')); }

const server = http.createServer((q, r) => { r.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); r.end(fs.readFileSync(FILE)); }).listen(0);
const URL = 'http://127.0.0.1:' + server.address().port + '/';

async function open(ctx) {
  const page = await ctx.newPage();
  page.on('pageerror', e => errors.push(String(e)));
  await page.setViewportSize({ width: 960, height: 540 });
  await page.goto(URL); await page.addScriptTag({ content: BOT }); await page.waitForTimeout(300);
  return page;
}
const reload = async page => { await page.reload(); await page.addScriptTag({ content: BOT }); await page.waitForTimeout(300); };
// Go to select screen, pick stage with Tab, hero via the normal select input (arrow keys), press Enter.
async function startRun(page, stage, hero) {
  return page.evaluate(async ({ stage, hero, KEYS }) => {
    if (ONE.G.mode !== 'select') { if (ONE.G.mode === 'win' || ONE.G.paused) await __T.tap('c'); else ONE.enterSelect(); }
    await __T.S(400);
    while (ONE.STAGE !== stage) await __T.tap('Tab');
    const target = CHAR_KEYS.indexOf(hero);
    for (let i = 0; i < 30 && ONE.G.sel !== target; i++) await __T.tap('ArrowRight');
    await __T.tap('Enter'); await __T.S(1200);
    return { mode: ONE.G.mode, ch: ONE.G.player.ch, stage: ONE.STAGE };
  }, { stage, hero, KEYS });
}
// Play to the stage-clear screen. forceDeaths: overwrite the death counter just before the end (to force a low rank).
async function clearStage(page, hero, opt = {}) {
  return page.evaluate(async ({ hero, opt }) => {
    let r; const t0 = performance.now();
    while (ONE.G.mode === 'play' && performance.now() - t0 < 420000) {
      if (opt.forceDeaths != null) ONE.G.stats.deaths = opt.forceDeaths;
      r = await __T.bot(10000, { stop: true, range: hero === 'vijay' ? 140 : hero === 'fei' ? 30 : 60, special: 15, noCheat: opt.noCheat });
    }
    await __T.S(2600);   // let the clear screen animate in
    const G = ONE.G;
    return { boss: G.boss ? Math.round(G.boss.hp) + G.boss.state + '@' + (G.boss.x / 16).toFixed(1) + ',' + (G.boss.y / 16).toFixed(1) : '-', arena: G.arena, exit: G.exitOpen, py: +(G.player.y / 16).toFixed(1), mode: G.mode, kills: G.stats.kills, dmg: Math.round(G.stats.damage || 0), time: +G.time.toFixed(2), deaths: G.stats.deaths, x: Math.round(G.player.x / 16), rank: G.rank, expected: G.mode === 'win' ? ONE.rankFor(ONE.STAGE, G.time, G.stats.deaths) : null, prog: G.prog };
  }, { hero, opt });
}
const prog = page => page.evaluate(() => JSON.parse(JSON.stringify(ONE.PROG)));
const disk = page => page.evaluate(() => { try { return JSON.parse(localStorage.getItem('omr_progress_v1')); } catch (e) { return 'PARSE_ERROR'; } });

(async () => {
  const browser = await chromium.launch();
  const which = JSON.parse(process.argv[3]);
  const runs = await Promise.all(which.map(async ([stage, hero]) => {
    const c = await browser.newContext(); const pg = await open(c);
    try { const st = await startRun(pg, stage, hero); const r = await clearStage(pg, hero, { noCheat: !!process.env.NOCHEAT }); await c.close(); return { stage, hero, r }; }
    catch (e) { return { stage, hero, err: String(e).slice(0, 120) }; }
  }));
  console.log(JSON.stringify(runs, null, 0)); console.log('errors', errors.slice(0, 3));
  await browser.close(); server.close();
})();
