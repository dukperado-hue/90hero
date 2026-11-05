// Progression tests for ONE MORE RUN. Usage: node tests/progression.test.js <path/to/index.html>
// Real stage clears are played by the bot in tests/bot.js through synthetic keyboard input.
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const FILE = path.resolve(process.argv[2]);
const BOT = fs.readFileSync(__dirname + '/bot.js', 'utf8');
const SHOTS = path.resolve(__dirname, '../shots'); fs.mkdirSync(SHOTS, { recursive: true });
const KEYS = ['wah', 'ma', 'fei', 'nine', 'siang', 'sura', 'li', 'ximen', 'chiru', 'dong', 'zhang', 'vijay', 'ram'];
const results = []; const errors = [];
function check(name, ok, info) { results.push({ name, ok: !!ok, info }); console.log((ok ? 'PASS ' : 'FAIL ') + name + (info !== undefined ? '  ' + JSON.stringify(info) : '')); }

const server = http.createServer((q, r) => { r.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); r.end(fs.readFileSync(FILE)); }).listen(0);
const URL = 'http://127.0.0.1:' + server.address().port + '/?locks=1';   // tests exercise the unlock system

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
    if (typeof SWAPMODE !== 'undefined') SWAPMODE = false;   // v26: progression checks need a deterministic hero (rescues still give takes)
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
    while (ONE.G.mode === 'play' && performance.now() - t0 < 300000) {
      if (opt.forceDeaths != null) ONE.G.stats.deaths = opt.forceDeaths;
      r = await __T.bot(10000, { stop: true, range: hero === 'vijay' ? 140 : hero === 'fei' ? 30 : 60, special: 15 });
    }
    await __T.S(2600);   // let the clear screen animate in
    const G = ONE.G;
    return { mode: G.mode, time: +G.time.toFixed(2), deaths: G.stats.deaths, rank: G.rank, expected: G.mode === 'win' ? ONE.rankFor(ONE.STAGE, G.time, G.stats.deaths) : null, prog: G.prog };
  }, { hero, opt });
}
const prog = page => page.evaluate(() => JSON.parse(JSON.stringify(ONE.PROG)));
const disk = page => page.evaluate(() => { try { return JSON.parse(localStorage.getItem('omr_progress_v1')); } catch (e) { return 'PARSE_ERROR'; } });

(async () => {
  const browser = await chromium.launch();

  // ---------- Unit-ish: rank thresholds ----------
  {
    const ctx = await browser.newContext(); const page = await open(ctx);
    const r = await page.evaluate(() => {
      const f = ONE.rankFor; return [f(1, 89, 0), f(1, 91, 0), f(1, 135, 1), f(1, 136, 1), f(1, 200, 3), f(1, 200, 4), f(1, 300, 0),
        f(2, 119, 0), f(2, 164, 1), f(2, 239, 3), f(2, 245, 0), f(3, 74, 0), f(3, 109, 1), f(3, 179, 4), f(3, 179, 5)];
    });
    const want = ['S', 'A', 'A', 'B', 'B', 'C', 'C', 'S', 'A', 'B', 'C', 'S', 'A', 'B', 'C'];
    check('rank thresholds are per stage and match the table', JSON.stringify(r) === JSON.stringify(want), r);
    await ctx.close();
  }

  // ---------- Corrupt / odd / legacy save data ----------
  {
    const ctx = await browser.newContext(); const page = await open(ctx);
    await page.evaluate(() => localStorage.setItem('omr_progress_v1', '{not json'));
    await reload(page);
    let p = await prog(page);
    const bak = await page.evaluate(() => localStorage.getItem('omr_progress_v1_corrupt'));
    check('corrupt JSON: game loads, 9 starters, backup kept', JSON.stringify(p.unlocked) === '["shaolin","eagle","sombat","sorapong","juk","wah","fei","vijay","ximen"]' && bak === '{not json', { unlocked: p.unlocked, bak });
    await page.evaluate(() => localStorage.setItem('omr_progress_v1', JSON.stringify({ ranks: { 1: { wah: 'Z', ma: 'S', hacker: 'S' }, 2: 'x' }, unlocked: ['xx', 'ram', 5], clears: { 1: 'lots' } })));
    await reload(page); p = await prog(page);
    check('malformed fields are dropped, valid ones kept', p.ranks[1].ma === 'S' && !p.ranks[1].wah && !p.ranks[1].hacker && p.unlocked.includes('ram') && !p.unlocked.includes('xx') && p.clears[1] === 0, p);
    // ma S on stage 1 => stage 1 best is S => Siu Ma (B) and Sura (A) unlock by rule
    check('rule-based unlocks are derived from loaded ranks', p.unlocked.includes('ma') && p.unlocked.includes('sura'), p.unlocked);
    await page.evaluate(() => localStorage.setItem('omr_progress_v1', '[1,2,3]'));
    await reload(page); p = await prog(page);
    check('wrong JSON type (array) handled as corrupt', JSON.stringify(p.unlocked) === '["shaolin","eagle","sombat","sorapong","juk","wah","fei","vijay","ximen"]', p.unlocked);
    // legacy player: has best times from the old build, no progress record
    await page.evaluate(() => { localStorage.clear(); localStorage.setItem('omr_best_s01_li', '123.4'); localStorage.setItem('omr_best_s02_wah', '40'); });
    await reload(page); p = await prog(page);
    const bt = await page.evaluate(() => localStorage.getItem('omr_best_s01_li'));
    check('legacy save: heroes with an old best time stay unlocked, old times kept', p.unlocked.includes('li') && p.unlocked.length === 10 && bt === '123.4', p.unlocked);
    // localStorage unavailable
    await page.addInitScript(() => { Object.defineProperty(window, 'localStorage', { get() { throw new Error('denied'); } }); });
    await reload(page);
    const ok = await page.evaluate(() => ({ mode: ONE.G.mode, n: ONE.PROG.unlocked.length }));
    check('storage blocked (throws): game still boots with 9 starters', ok.mode === 'title' && ok.n === 9, ok);
    await ctx.close();
  }

  // ---------- Main flow: first-time player ----------
  const ctx = await browser.newContext(); const page = await open(ctx);
  {
    const p = await prog(page);
    const n = await page.evaluate(() => ['shaolin', 'eagle', 'sombat', 'sorapong', 'juk', 'wah', 'ma', 'fei', 'nine', 'siang', 'sura', 'li', 'ximen', 'chiru', 'dong', 'zhang', 'vijay', 'ram'].filter(ONE.isUnlocked));
    check('T1 first-time player has exactly 9 unlocked heroes', n.length === 9 && n.join() === 'shaolin,eagle,sombat,sorapong,juk,wah,fei,ximen,vijay', n);
    check('T1 progress record saved on first boot', (await disk(page)).unlocked.length === 9);
  }
  // T7: locked heroes cannot be selected
  {
    const r = await page.evaluate(async () => {
      const out = {}; ONE.enterSelect(); await __T.S(400);
      await __T.tap('Digit6'); await __T.S(150); out.digit = { mode: ONE.G.mode, sel: ONE.G.sel };          // number key = select + go
      await __T.tap('Enter'); await __T.S(200); out.enter = { mode: ONE.G.mode, deny: ONE.G.denyT > 0 };
      await __T.tap('w'); await __T.S(150); out.jump = ONE.G.mode;
      await __T.tap('j'); await __T.S(150); out.attack = ONE.G.mode;
      await __T.tap('ArrowRight'); await __T.tap('ArrowRight'); await __T.tap('Enter'); await __T.S(1200); out.arrows = { mode: ONE.G.mode, sel: ONE.G.sel };  // sel 7 = nine (locked)
      return out;
    });
    // mouse: click the locked RAM card twice (17th card, second row, col 7)
    const box = await page.locator('canvas').boundingBox();
    const sx = box.width / 480, sy = box.height / 270; const cr = await page.evaluate(() => cardRect(16)); const mw = await page.evaluate(() => (typeof miniW === 'function' ? miniW() : 40)); const cx = box.x + (cr.x + mw / 2) * sx, cy = box.y + (cr.y + (typeof MINI !== 'undefined' ? 8 : 14)) * sy;   // geometry from the game (grid width changes with the roster)
    await page.mouse.click(cx, cy); await page.waitForTimeout(150); await page.mouse.click(cx, cy); await page.waitForTimeout(200);
    const click = await page.evaluate(() => ({ mode: ONE.G.mode, sel: ONE.G.sel }));
    await page.screenshot({ path: SHOTS + '/select_locked.png' });
    check('T7 number key on a locked hero only selects it', r.digit.mode === 'select' && r.digit.sel === 5, r.digit);
    check('T7 Enter on a locked hero is refused (deny feedback)', r.enter.mode === 'select' && r.enter.deny, r.enter);
    check('T7 W / J on a locked hero are refused', r.jump === 'select' && r.attack === 'select');
    check('T7 arrow-select + Enter on locked hero refused', r.arrows.mode === 'select' && r.arrows.sel === 7, r.arrows);
    check('T7 double-click on locked card refused', click.mode === 'select' && click.sel === 16, click);
    const ok = await page.evaluate(async () => { await __T.tap('Digit1'); await __T.S(1200); return { mode: ONE.G.mode, ch: ONE.G.player.ch }; });
    check('T7 unlocked hero (number key) still starts the game', ok.mode === 'play' && ok.ch === 'shaolin', ok);
  }
  // Stage 2 with Ah Wah, deaths forced to 9 => rank C
  let s2a = await (async () => { await startRun(page, 2, 'wah'); return clearStage(page, 'wah', { forceDeaths: 9 }); })();
  check('T2 stage 02 clear recorded (forced C)', s2a.mode === 'win' && s2a.rank === 'C' && (await prog(page)).ranks[2].wah === 'C', { time: s2a.time, rank: s2a.rank });
  await page.screenshot({ path: SHOTS + '/win_stage2_C.png' });
  // Real run, no injection => should beat C
  let s2b = await (async () => { await startRun(page, 2, 'wah'); return clearStage(page, 'wah'); })();
  let p = await prog(page);
  check('T2 rank shown equals per-stage rule', s2b.rank === s2b.expected, s2b);
  check('T3 better rank replaces saved rank', s2b.rank !== 'C' ? p.ranks[2].wah === s2b.rank : null, { got: s2b.rank, saved: p.ranks[2].wah });
  check('T5 unlock: Rank B+ on stage 02 unlocks UNCLE NINE', ['B', 'A', 'S'].includes(s2b.rank) ? p.unlocked.includes('nine') && s2b.prog.unlocked.includes('nine') : null, { unlocked: p.unlocked, thisRun: s2b.prog.unlocked });
  if (['A', 'S'].includes(s2b.rank)) check('T5 unlock: Rank A+ on stage 02 unlocks DAGGER LI; Rank A with AH WAH unlocks DONGFANG', p.unlocked.includes('li') && p.unlocked.includes('dong'), p.unlocked);
  await page.screenshot({ path: SHOTS + '/win_stage2_real.png' });
  const bestRank = p.ranks[2].wah;
  // Worse run (forced deaths) must not overwrite
  let s2c = await (async () => { await startRun(page, 2, 'wah'); return clearStage(page, 'wah', { forceDeaths: 9 }); })();
  p = await prog(page);
  check('T4 worse rank does not overwrite best', s2c.rank === 'C' && p.ranks[2].wah === bestRank && (await disk(page)).ranks[2].wah === bestRank, { run: s2c.rank, saved: p.ranks[2].wah });
  check('T4 clear count increments', p.clears[2] === 3, p.clears);
  // T6 refresh
  const before = await prog(page);
  await reload(page);
  const after = await prog(page);
  const bestTime = await page.evaluate(() => localStorage.getItem('omr_best_s02_wah'));
  check('T6 refresh keeps ranks, unlocks, clears', JSON.stringify(before.ranks) === JSON.stringify(after.ranks) && JSON.stringify(before.unlocked.sort()) === JSON.stringify(after.unlocked.sort()) && after.clears[2] === 3, { ranks: after.ranks, unlocked: after.unlocked });
  check('T6 best time (original key) kept', bestTime != null && !isNaN(parseFloat(bestTime)), bestTime);
  // T5 newly unlocked hero is selectable and playable
  if (after.unlocked.includes('nine')) {
    await page.evaluate(async () => { ONE.enterSelect(); await __T.S(400); });
    await page.screenshot({ path: SHOTS + '/select_after_unlock.png' });
    const st = await startRun(page, 2, 'nine');
    const r = await page.evaluate(async () => { const x0 = ONE.G.player.x; const res = await __T.bot(6000, { range: 80 }); return { x0, ...res }; });
    check('T5 unlocked UNCLE NINE can be selected and plays', st.mode === 'play' && st.ch === 'nine' && r.x > r.x0, { st, r });
    check('T5 NEW tag cleared after picking the hero', !(await prog(page)).fresh.includes('nine'));
  }
  // second tab must not erase first tab's results
  {
    const pageB = await open(ctx);
    await page.evaluate(() => { localStorage.setItem('omr_progress_v1', JSON.stringify({ ...ONE.PROG, ranks: { ...ONE.PROG.ranks, 3: { vijay: 'A' } } })); }); // tab A wrote a stage-3 result
    await startRun(pageB, 2, 'wah'); const r = await clearStage(pageB, 'wah', { forceDeaths: 9 });                           // tab B (older state) clears a stage
    const d = await disk(pageB);
    check('two tabs: a save from tab B merges instead of erasing tab A\'s result', d.ranks[3].vijay === 'A' && d.ranks[2].wah === bestRank, d.ranks);
    await pageB.close();
  }
  await ctx.close();

  // ---------- T2/T8: real clears of stage 01 and 03 on a fresh save (gameplay regression) ----------
  const runs = await Promise.all([[1, 'wah'], [3, 'fei'], [3, 'vijay']].map(async ([stage, hero]) => {
    const c = await browser.newContext(); const pg = await open(c);
    const st = await startRun(pg, stage, hero); const r = await clearStage(pg, hero);
    const pr = await prog(pg); await pg.screenshot({ path: SHOTS + `/win_stage${stage}_${hero}.png` }); await c.close();
    return { stage, hero, st, r, saved: pr.ranks[stage][hero], unlocked: pr.unlocked };
  }));
  for (const x of runs) {
    check(`T8 stage 0${x.stage} completes with ${x.hero}`, x.r.mode === 'win', { time: x.r.time, deaths: x.r.deaths });
    if (x.r.mode === 'win') check(`T2 stage 0${x.stage} rank recorded (${x.hero})`, x.saved === x.r.rank && x.r.rank === x.r.expected, { rank: x.r.rank, saved: x.saved, unlocked: x.unlocked });
  }
  check('no uncaught page errors during all tests', errors.length === 0, errors.slice(0, 5));
  await browser.close(); server.close();
  const pass = results.filter(r => r.ok).length, skip = results.filter(r => r.ok === false && r.info === undefined).length;
  console.log(`\n${pass}/${results.length} checks passed`);
  fs.writeFileSync(path.resolve(__dirname, '../test_results.json'), JSON.stringify(results, null, 1));
})();
