// =====================================================================
// v35 — GUEST STARS: rescuing a stunt double can hand you a hero you have NOT unlocked yet (backlog #1).
//   * The double is drawn from a shuffled deck so the same hero doesn't come out twice in a row and
//     heroes you haven't played this stage come first (Broforce's "who will I get?" surprise).
//   * About 1 in 3 doubles is a GUEST STAR: a still-locked hero, yours until the next "CUT!".
//     If no guest has appeared by the 3rd rescue of a stage, the next locked one is guaranteed.
//   * A guest never unlocks permanently (rank unlocks stay the progression); after a death you respawn
//     as the last hero you own, with a "GUEST STAR WRAPPED" note.
// Only active while SWAPMODE is on (H toggles it, as before).
// =====================================================================
const GUEST = { chance: 0.35, forceAfter: 3 };
function guestStageReset() { G.guest = null; G.guestPrev = null; G.guestSeen = 0; G.heroDeck = []; G.heroUsed = new Set(); }
function guestPool() { return CHAR_KEYS.filter(k => k !== 'zhang' && CHARS[k] && !isUnlocked(k)); }
pickDouble = function () {
  const p = G.player, cur = p ? p.ch : null;
  if (!G.heroUsed) guestStageReset();
  G.heroUsed.add(cur);
  const locked = guestPool().filter(k => k !== cur);
  const rescued = (G.stats && G.stats.rescued) || 0;
  const wantGuest = locked.length && (Math.random() < GUEST.chance || (!G.guestSeen && rescued >= GUEST.forceAfter));
  let pool = wantGuest ? locked : CHAR_KEYS.filter(k => isUnlocked(k) && k !== cur && k !== 'zhang');
  if (!pool.length) pool = locked.length ? locked : [cur];
  const fresh = pool.filter(k => !G.heroUsed.has(k));                 // heroes not played yet this stage come first
  const from = fresh.length ? fresh : pool;
  const k = from[(Math.random() * from.length) | 0];
  G.heroUsed.add(k);
  return k;
};
const _swapHero35 = swapHero;
swapHero = function (k, c) {
  const p = G.player; if (!p || p.dead || G.mode !== 'play' || G.cine) return;
  const guest = !isUnlocked(k);
  const prevOwned = G.guest ? G.guestPrev : (G.actor || CHOSEN);      // the hero you go back to after a guest's "CUT!"
  _swapHero35(k, c);
  if (G.player.ch !== k) return;
  if (guest) {
    G.guest = k; G.guestPrev = isUnlocked(prevOwned) ? prevOwned : CHOSEN; G.guestSeen = (G.guestSeen || 0) + 1;
    G.stats.guests = (G.stats.guests || 0) + 1;
    G.banner = { t: 0, title: 'GUEST STAR: ' + CHARS[k].name, sub: 'NOT UNLOCKED YET — YOURS UNTIL THE NEXT "CUT!"' };
    G.guestFx = { t: 0, x: G.player.x + G.player.w / 2, y: G.player.y };
    popup(G.player.x + G.player.w / 2, G.player.y - 30, '★ GUEST STAR ★', '#ffd23f', true);
  } else { G.guest = null; G.guestPrev = null; }
};
const _respawn35 = respawn;
respawn = function () {
  if (G.guest && G.guestPrev) { G.actor = G.guestPrev; }
  const wasGuest = G.guest;
  const r = _respawn35.apply(this, arguments);
  if (wasGuest && G.player && !G.player.dead && G.player.ch !== wasGuest) {
    G.guest = null; G.guestPrev = null;
    popup(G.player.x + G.player.w / 2, G.player.y - 28, 'GUEST STAR WRAPPED — ' + CHARS[wasGuest].name, '#ffd23f', true);
  }
  return r;
};
const _newGame35 = newGame;
newGame = function () { const r = _newGame35.apply(this, arguments); guestStageReset(); return r; };
function drawGuestHUD() {                                   // a gold star tag next to the takes counter while a guest is on set
  if (!G.guest || G.mode !== 'play' || !G.player || G.player.ch !== G.guest) return;
  const x = 78, y = 36, pulse = 0.75 + 0.25 * Math.sin(G.clock * 6);
  ctx.fillStyle = 'rgba(0,0,0,0.55)'; ctx.fillRect(x, y, 62, 11);
  ctx.globalAlpha = pulse; ctx.fillStyle = '#ffd23f'; ctx.font = 'bold 7px monospace'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.fillText('★ GUEST STAR', x + 4, y + 6); ctx.globalAlpha = 1;
}
function drawGuestFx(cam) {                                 // a spotlight cone + sparkle burst on the guest's entrance
  const f = G.guestFx; if (!f || !G.player) return;
  f.t += 1 / 60; if (f.t > 1.4) { G.guestFx = null; return; }
  const p = G.player, cx = p.x + p.w / 2, a = Math.max(0, 1 - f.t / 1.4);
  ctx.save(); ctx.globalAlpha = 0.28 * a; ctx.fillStyle = '#fff2b0';
  ctx.beginPath(); ctx.moveTo(cx - 6, p.y - 120); ctx.lineTo(cx + 6, p.y - 120); ctx.lineTo(cx + 26, p.y + p.h); ctx.lineTo(cx - 26, p.y + p.h); ctx.fill();
  ctx.globalAlpha = a; ctx.fillStyle = '#ffd23f';
  for (let i = 0; i < 10; i++) { const an = i / 10 * Math.PI * 2 + f.t * 3, rr = 10 + f.t * 40; ctx.fillRect(cx + Math.cos(an) * rr - 1, p.y + p.h / 2 + Math.sin(an) * rr - 1, 2, 2); }
  ctx.restore();
}
