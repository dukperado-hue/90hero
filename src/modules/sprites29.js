// v29: Gemini-drawn chibi sprites (big head = cuter + readable emotions). Hooks into DRAW5; any hero with an entry here is drawn from the atlas.
const SPR_META = /*SPR_META*/;
const SPR_PNG = /*SPR_PNG*/;
const SPR = {};
for (const k in SPR_PNG) { const im = new Image(); im.src = 'data:image/png;base64,' + SPR_PNG[k]; SPR[k] = { im, f: SPR_META[k] }; }
function drawSpriteHero(p) {
  const S = SPR[p.ch]; if (!S || !S.im.complete || !S.im.naturalWidth) return false;
  if (p.inv > 0 && !p.dead && Math.floor(p.inv * 22) % 2 === 0) return true;
  const fx = Math.round(p.x + p.w / 2), fy = Math.round(p.y + p.h), F = S.f;
  const k = (p.swingT > 0 || p.superT > 0) ? (p.superT > 0 ? ['kick', 'bigkick', 'kick', 'fly'][p.kickFrame % 4] : p.swingK) : '';
  let n = 'idle', sy = 1, sx = 1;
  if (p.dead || p.flash > 0.04) n = 'hurt';
  else if (k) n = (p.swingT > 0 && p.swingT < 0.09 && k !== 'bigkick') ? 'kickW' : 'kick';
  else if (!p.onGround) n = 'jump';
  else if (p.crouch) { n = 'idle'; sy = 0.7; }
  else if (Math.abs(p.vx) > 40) n = Math.sin(p.runPhase) > 0 ? 'walkA' : 'walkB';
  if (p.landT > 0) { const q = p.landT / 0.11; sx = 1 + 0.2 * q; sy *= 1 - 0.18 * q; } else if (p.jumpT > 0) { sx = 0.9; sy *= 1.1; }
  const fr = F[n]; ctx.save(); ctx.translate(fx, fy);
  if (p.dead) { ctx.translate(0, -4); ctx.rotate(-p.face * Math.min(1.57, p.deadT * 7)); }
  if (p.wr && !p.dead) { ctx.translate(p.face * 4, -4); ctx.rotate(-p.face * 1.25); }
  ctx.scale(p.face * sx, sy);
  const bob = (n === 'walkA' || n === 'walkB') && Math.abs(Math.sin(p.runPhase)) > 0.7 ? -1 : 0;
  const sm = ctx.imageSmoothingEnabled; ctx.imageSmoothingEnabled = false;
  ctx.drawImage(S.im, fr.x, fr.y, fr.w, fr.h, -fr.ax, -fr.h + bob + (n === 'jump' ? -2 : 0), fr.w, fr.h);
  if (p.flash > 0) { ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 0.6; ctx.drawImage(S.im, fr.x, fr.y, fr.w, fr.h, -fr.ax, -fr.h, fr.w, fr.h); }
  ctx.imageSmoothingEnabled = sm; ctx.restore(); return true;
}
for (const k in SPR) DRAW5[k] = drawSpriteHero;

// Scale: the chibi hero is drawn ~1.5x the old pixel guy, so enemies/bosses grow with him and the ball (his heart) is a proper football.
const CHIBI = { enemy: 1.4, boss: 1.3, ball: 2.0 };
function scaledAbout(cx, cy, k, fn) { ctx.save(); ctx.translate(cx, cy); ctx.scale(k, k); ctx.translate(-cx, -cy); try { fn(); } finally { ctx.restore(); } }
{
  const _el = drawEnemyLook, _boss = drawBoss, _ball = drawShaolinBall;
  drawEnemyLook = function (e) { if (G.mode === 'title' || G.mode === 'select') return _el(e); scaledAbout(e.x + e.w / 2, e.y + e.h, CHIBI.enemy, () => _el(e)); };
  drawBoss = function (b, corpse) { scaledAbout(b.x + b.w / 2, b.y + b.h, CHIBI.boss, () => _boss(b, corpse)); };
  drawShaolinBall = function (p) { const B = p.ball; if (!B) return; scaledAbout(Math.round(B.x), Math.round(B.y), CHIBI.ball, () => _ball(p)); };
}
