// v29 balance harness (BOT DATA, NOT HUMAN PLAYTESTS).  node balance.js <html> <runsPerHero> <hero,hero,...> [holdK=1]
// Plays stage 1 start to stage-clear with the bot (SWAPMODE=false so rescued stunt doubles never swap the hero) and prints deaths + clear time per run.
const { chromium } = require('playwright'); const http = require('http'), fs = require('fs'), path = require('path');
const F = path.resolve(process.argv[2]), N = +process.argv[3] || 20, HEROES = (process.argv[4] || 'furie,bey,gada,silat,hongbao,shaolin,aamir').split(','), HOLDK = process.argv[5] !== '0';
const BOT = fs.readFileSync(__dirname + '/bot.js', 'utf8');
const srv = http.createServer((q, r) => { r.writeHead(200, { 'content-type': 'text/html' }); r.end(fs.readFileSync(F)); }).listen(0);
(async () => {
  const b = await chromium.launch(); const out = {};
  for (const h of HEROES) {
    const c = await b.newContext({ viewport: { width: 960, height: 540 } }); const pg = await c.newPage(); const errs = []; pg.on('pageerror', e => errs.push(String(e).slice(0, 100)));
    out[h] = [];
    for (let n = 0; n < N; n++) {
      await pg.goto('http://127.0.0.1:' + srv.address().port + '/'); await pg.addScriptTag({ content: BOT }); await pg.waitForTimeout(150);
      const r = await pg.evaluate(async ({ h, HOLDK }) => {
        SWAPMODE = false;
        ONE.enterSelect(); await __T.S(250); while (ONE.STAGE !== 1) await __T.tap('Tab'); ONE.G.sel = CHAR_KEYS.indexOf(h); await __T.tap('Enter'); await __T.S(900);
        for (let i = 0; i < 40 && ONE.G.cine; i++) await __T.S(100);
        const t0 = performance.now();
        while (ONE.G.mode === 'play' && performance.now() - t0 < 150000) await __T.bot(10000, { stop: true, range: 60, special: 15, holdK: HOLDK });
        const G = ONE.G; return { ch: G.player.ch, win: G.mode === 'win', deaths: G.stats.deaths, time: +G.time.toFixed(1), kills: G.stats.kills };
      }, { h, HOLDK });
      out[h].push(r);
    }
    await c.close();
    const o = out[h], m = f => o.reduce((a, x) => a + f(x), 0) / o.length, sd = f => { const mu = m(f); return Math.sqrt(m(x => (f(x) - mu) ** 2)); };
    console.log(h.padEnd(8), 'n=' + o.length, 'win=' + o.filter(x => x.win).length, 'deaths ' + m(x => x.deaths).toFixed(2) + '±' + sd(x => x.deaths).toFixed(2), 'time ' + m(x => x.time).toFixed(1) + '±' + sd(x => x.time).toFixed(1), 'heroChanged=' + o.filter(x => x.ch !== h).length, errs.length ? errs : '');
  }
  fs.writeFileSync(process.env.BAL_OUT || '/tmp/bal.json', JSON.stringify(out)); await b.close(); srv.close();
})();
