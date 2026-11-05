// =====================================================================
// v27 HERO SELECT 3.0 — the three-poster triptych (replaces select2.js).
//   * three equal poster panels: previous · SELECTED · next (←/→ browse, wraps, respects the F country filter)
//   * every panel has its own COUNTRY look: palette + a hand-drawn motif (Thai prang, HK neon tenements, Chinese mist mountains,
//     Indian holi dust + dome, Korean skyline/hanok, Japanese sun + torii, Vietnamese lanterns, Turkish domes + balloons, Indonesian stepped stupa)
//   * under each poster: a 4-slot HUD strip (J / K / S+J / L) — the SLOTS come from the hero's own move text (CHARS[k].lines),
//     so changing a hero's moves in CHARS changes the strip. Sprites are the real in-game sprites.
//   * top: mini roster (click / hover to jump) and country filter chips.
// =====================================================================
const SEL_SWING = new Set(['aamir', 'fei', 'siang', 'nine', 'sura', 'li', 'ximen', 'chiru', 'dong', 'zhang', 'ram', 'singham', 'michelle', 'srk', 'madong', 'oldboy', 'kham', 'paimei', 'lady', 'ichi', 'ogami', 'bey', 'gada', 'silat', 'hongbao', 'furie']);
const SEL_NEW = new Set(['furie', 'bey', 'gada', 'silat', 'hongbao']);
const GUN_HEROES = new Set(['ma', 'vijay', 'furie', 'silat', 'sombat', 'lady', 'rajini']);
function selAnim(k, q, t, on) {                      // idle / action loop for one preview figure
  q.animT = t; q.onGround = true; q.face = 1; q.inv = 0; q.flash = 0;
  q.vx = on ? 160 : 0; q.runPhase = on ? t * (k === 'wah' ? 14 : 8) : 0;
  q.boostT = (k === 'wah' && on && (t % 3) > 2.4) ? 0.1 : 0;
  q.shootT = on && ((k === 'ma' && (t * 10 | 0) % 3 === 0) || (k === 'vijay' && (t * 10 | 0) % 2 === 0) || ((k === 'furie' || k === 'silat') && (t * 3 % 1) < 0.5 && (t * 3 | 0) % 2 === 0)) ? 0.06 : 0;
  q.hand = (t * 10 | 0) % 2;
  const cyc = (t * 3 | 0) % 4, act = on && (t * 3 % 1) < 0.4;
  q.swingT = act && SEL_SWING.has(k) ? 0.1 : 0;
  q.absorbing = k === 'zhang' && on && (t % 3) > 1.6; q.stored = q.absorbing ? Math.floor(((t % 3) - 1.6) * 6) : 0;
  q.swingK = k === 'zhang' ? 'palm' : k === 'ram' ? (cyc === 3 ? 'call' : 'butt') : (k === 'ximen' || k === 'gada') ? 'slash' : k === 'bey' ? (cyc === 3 ? 'slash' : 'punch') : k === 'chiru' ? (cyc === 3 ? 'pose' : 'slap') : ['punch', 'kick', 'punch', 'bigkick'][cyc];
  if (q.swingT > 0 || q.shootT > 0) q.vx = 0;
  q.dodgeT = (k === 'sura' && on && (t % 2) > 1.6) ? 0.2 : 0; q.drinkT = (k === 'sura' && on && (t % 4) > 3.3) ? 0.3 : -1;
  q.charge = (k === 'li' && on && (t % 3) > 1.8) ? Math.min(1, ((t % 3) - 1.8)) : 0; q.coughing = (k === 'li' && on && (t % 6) > 5.4) ? 0.3 : 0;
  q.blowing = (k === 'ximen' && on && (t % 4) > 3.2);
}
// ---------- layout
const PN = { x0: 4, w: 154, gap: 5, y: 32, h: 170, heroH: 118, sy: 206, sh: 46 };
let selSlideX = 0;                                  // posters glide when the selection changes (px, eases to 0)
const panelX = s => PN.x0 + s * (PN.w + PN.gap) + Math.round(selSlideX);
function selList() { const a = []; for (let i = 0; i < CHAR_KEYS.length; i++) if (selMatch(CHAR_KEYS[i]) || i === G.sel) a.push(i); return a; }
function selNb() { const a = selList(), p = a.indexOf(G.sel), n = a.length; return { prev: n >= 3 ? a[(p - 1 + n) % n] : -1, next: n >= 2 ? a[(p + 1) % n] : -1, n }; }
const MINI = { y: 15, h: 17 };
const miniW = () => Math.min(13, Math.floor(472 / CHAR_KEYS.length));
function miniAt(mx, my) { if (my < MINI.y || my > MINI.y + MINI.h) return -1; const i = Math.floor((mx - 4) / miniW()); return i >= 0 && i < CHAR_KEYS.length ? i : -1; }
function cardRect(i) { return { x: 4 + i * miniW(), y: MINI.y }; }
function cardAt(mx, my) {                            // clicks: mini roster, or one of the three posters
  const m = miniAt(mx, my); if (m >= 0) return m;
  if (my >= PN.y && my <= PN.y + PN.h + PN.sh + 6) for (let s = 0; s < 3; s++) if (mx >= panelX(s) && mx <= panelX(s) + PN.w) { const nb = selNb(); const i = s === 1 ? G.sel : s === 0 ? nb.prev : nb.next; return i; }
  return -1;
}
// ---------- country looks
const ORI_PAL = { TH: ['#14206a', '#e8b030', '#c02040'], HK: ['#08102e', '#ff2a5a', '#18d8f0'], CN: ['#0e2238', '#d8f0ff', '#6a9ac0'], IN: ['#58104a', '#ff8a1a', '#ffd23f'], KR: ['#0a2634', '#7ae8ff', '#ffb8d0'], JP: ['#2a0a1a', '#e8203a', '#ffb8d0'], VN: ['#3a0c0c', '#ffcc2a', '#1a7a4a'], TR: ['#5a2812', '#e8903a', '#1ab0c0'], ID: ['#0a3a2c', '#e8c040', '#2ab870'] };
const rn = (i, s) => { const v = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return v - Math.floor(v); };
const MOTIF = {
  TH(x, y, w, h, hz, t, P) {                         // gold prang temple spires, floating lanterns
    ctx.fillStyle = P[1] + '55'; ctx.beginPath(); ctx.arc(x + w * 0.5, hz - 40, 30, 0, 6.283); ctx.fill();
    const prang = (cx, s) => { ctx.fillStyle = '#080a22'; ctx.beginPath(); ctx.moveTo(cx - 12 * s, hz); ctx.lineTo(cx - 10 * s, hz - 16 * s); ctx.lineTo(cx - 7 * s, hz - 16 * s); ctx.lineTo(cx - 6 * s, hz - 32 * s); ctx.lineTo(cx - 3 * s, hz - 32 * s); ctx.lineTo(cx, hz - 58 * s); ctx.lineTo(cx + 3 * s, hz - 32 * s); ctx.lineTo(cx + 6 * s, hz - 32 * s); ctx.lineTo(cx + 7 * s, hz - 16 * s); ctx.lineTo(cx + 10 * s, hz - 16 * s); ctx.lineTo(cx + 12 * s, hz); ctx.fill(); ctx.fillStyle = P[1]; ctx.fillRect(cx - 0.5 * s, hz - 66 * s, 1.2 * s, 9 * s); ctx.fillRect(cx - 9 * s, hz - 16 * s, 18 * s, 1); ctx.fillRect(cx - 5 * s, hz - 32 * s, 10 * s, 1); };
    prang(x + w * 0.22, 1.1); prang(x + w * 0.8, 0.8);
    for (let i = 0; i < 9; i++) { const ly = hz - ((t * 9 + i * 41) % 110), lx = x + rn(i, 1) * w + Math.sin(t + i) * 4; ctx.fillStyle = 'rgba(255,208,106,' + (0.35 + 0.3 * rn(i, 2)) + ')'; ctx.fillRect(lx, ly, 3, 4); }
  },
  HK(x, y, w, h, hz, t, P) {                         // neon tenements in the rain
    for (let i = 0; i < 6; i++) {
      const bx = x + i * (w / 5.2) - 4, bh = 52 + rn(i, 3) * 38, bw = w / 5.2 + 2; ctx.fillStyle = i % 2 ? '#060a1c' : '#0a1030'; ctx.fillRect(bx, hz - bh, bw, bh);
      for (let r = 0; r < 6; r++) for (let c = 0; c < 3; c++) if (rn(i * 9 + r, c) > 0.55) { ctx.fillStyle = rn(i + r, c + 4) > 0.5 ? '#ffd88a' : '#7ad8ff'; ctx.fillRect(bx + 4 + c * 9, hz - bh + 6 + r * 11, 4, 5); }
      const sg = rn(i, 7) > 0.4 ? P[1] : P[2]; ctx.fillStyle = sg + '44'; ctx.fillRect(bx + bw - 10, hz - bh * 0.8 - 2, 9, 26); ctx.fillStyle = sg; ctx.fillRect(bx + bw - 8, hz - bh * 0.8, 5, 22);   // vertical neon sign
    }
    ctx.strokeStyle = 'rgba(180,220,255,0.35)'; ctx.lineWidth = 1; for (let i = 0; i < 16; i++) { const rx = x + rn(i, 5) * w, ry = y + ((t * 150 + i * 53) % h); ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx - 3, ry + 9); ctx.stroke(); }
  },
  CN(x, y, w, h, hz, t, P) {                         // moon, misty mountains, a pagoda
    ctx.fillStyle = 'rgba(216,240,255,0.85)'; ctx.beginPath(); ctx.arc(x + w * 0.72, y + 28, 17, 0, 6.283); ctx.fill();
    [['#1c3c5c', 0.5, 78], ['#143048', 0.3, 62], ['#0e2438', 0.75, 48]].forEach(([c, ox, mh], k) => { ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(x - 10, hz); for (let i = 0; i <= 6; i++) ctx.lineTo(x + i * w / 6 + (k - 1) * 8, hz - mh * (0.35 + 0.65 * rn(i + k * 7, 9))); ctx.lineTo(x + w + 10, hz); ctx.fill(); });
    const px0 = x + w * 0.3; ctx.fillStyle = '#081420'; for (let i = 0; i < 4; i++) { const ww = 22 - i * 4, yy = hz - 14 - i * 11; ctx.fillRect(px0 - ww / 2, yy, ww, 8); ctx.beginPath(); ctx.moveTo(px0 - ww / 2 - 5, yy + 1); ctx.lineTo(px0, yy - 5); ctx.lineTo(px0 + ww / 2 + 5, yy + 1); ctx.fill(); }
    for (let i = 0; i < 4; i++) { ctx.fillStyle = 'rgba(220,236,255,' + (0.12 + 0.05 * i) + ')'; ctx.beginPath(); ctx.ellipse(x + ((t * 6 + i * 70) % (w + 80)) - 40, hz - 12 - i * 14, 46, 6, 0, 0, 6.283); ctx.fill(); }
  },
  IN(x, y, w, h, hz, t, P) {                         // holi powder clouds, a Mughal dome, bunting
    const cols = ['#ff2a8a', '#ff8a1a', '#ffd23f', '#2a8aff', '#b04ad0'];
    for (let i = 0; i < 7; i++) { const cx = x + rn(i, 1) * w + Math.sin(t * 0.7 + i) * 8, cy = y + 14 + rn(i, 2) * (h - 50), r = 22 + rn(i, 3) * 20, g = ctx.createRadialGradient(cx, cy, 2, cx, cy, r); g.addColorStop(0, cols[i % 5] + 'aa'); g.addColorStop(1, cols[i % 5] + '00'); ctx.fillStyle = g; ctx.fillRect(cx - r, cy - r, r * 2, r * 2); }
    const cx = x + w * 0.5; ctx.fillStyle = '#2a0a28'; ctx.fillRect(cx - 24, hz - 30, 48, 30); ctx.beginPath(); ctx.arc(cx, hz - 30, 18, Math.PI, 0); ctx.fill(); ctx.fillRect(cx - 1, hz - 56, 2, 8); ctx.fillStyle = P[2]; ctx.fillRect(cx - 1, hz - 58, 2, 3);
    [-34, 34].forEach(o => { ctx.fillStyle = '#2a0a28'; ctx.fillRect(cx + o - 3, hz - 52, 6, 52); ctx.beginPath(); ctx.arc(cx + o, hz - 52, 4, Math.PI, 0); ctx.fill(); });
    ctx.strokeStyle = '#ffffff55'; ctx.beginPath(); ctx.moveTo(x, y + 6); ctx.quadraticCurveTo(x + w / 2, y + 28, x + w, y + 6); ctx.stroke();
    for (let i = 0; i < 9; i++) { const u = (i + 0.5) / 9, bx = x + u * w, by = y + 6 + Math.sin(u * 3.1416) * 17; ctx.fillStyle = cols[i % 5]; ctx.beginPath(); ctx.moveTo(bx - 4, by); ctx.lineTo(bx + 4, by); ctx.lineTo(bx, by + 8); ctx.fill(); }
  },
  KR(x, y, w, h, hz, t, P) {                         // night skyline, hanok roof, cherry petals
    for (let i = 0; i < 9; i++) { const bw = w / 9 + 1, bh = 30 + rn(i, 4) * 60; ctx.fillStyle = i % 2 ? '#082030' : '#0c2c40'; ctx.fillRect(x + i * w / 9, hz - bh, bw, bh); for (let r = 0; r < 7; r++) if (rn(i * 7 + r, 8) > 0.5) { ctx.fillStyle = '#b8f0ff'; ctx.fillRect(x + i * w / 9 + 3 + (r % 2) * 6, hz - bh + 4 + r * 8, 3, 3); } }
    const hx = x + w * 0.5; ctx.fillStyle = '#06161e'; ctx.fillRect(hx - 30, hz - 14, 60, 14); ctx.beginPath(); ctx.moveTo(hx - 42, hz - 12); ctx.quadraticCurveTo(hx - 24, hz - 18, hx - 30, hz - 26); ctx.lineTo(hx + 30, hz - 26); ctx.quadraticCurveTo(hx + 24, hz - 18, hx + 42, hz - 12); ctx.fill();
    for (let i = 0; i < 14; i++) { const px = x + ((rn(i, 6) * w + t * 10) % w), py = y + ((t * 16 + i * 29) % h); ctx.fillStyle = 'rgba(255,184,208,0.8)'; ctx.fillRect(px, py, 2, 2); }
  },
  JP(x, y, w, h, hz, t, P) {                         // the red sun, a torii gate, sakura
    ctx.fillStyle = P[1]; ctx.beginPath(); ctx.arc(x + w * 0.5, hz - 44, 28, 0, 6.283); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.beginPath(); ctx.arc(x + w * 0.5, hz - 44, 36, 0, 6.283); ctx.fill();
    const tx = x + w * 0.22; ctx.fillStyle = '#7a0a1a'; ctx.fillRect(tx - 18, hz - 48, 5, 48); ctx.fillRect(tx + 13, hz - 48, 5, 48); ctx.fillRect(tx - 24, hz - 54, 48, 5); ctx.fillStyle = '#120408'; ctx.fillRect(tx - 26, hz - 58, 52, 4); ctx.fillStyle = '#7a0a1a'; ctx.fillRect(tx - 18, hz - 40, 36, 3);
    for (let i = 0; i < 16; i++) { const px = x + ((rn(i, 6) * w + t * 14) % w), py = y + ((t * 18 + i * 31) % h); ctx.fillStyle = 'rgba(255,184,208,0.85)'; ctx.fillRect(px, py, 2, 2); }
  },
  VN(x, y, w, h, hz, t, P) {                         // paper lanterns, rice terraces, palm fronds
    for (let i = 0; i < 4; i++) { ctx.fillStyle = '#26661e'; ctx.beginPath(); ctx.moveTo(x - 10, hz); ctx.quadraticCurveTo(x + w * (0.2 + i * 0.25), hz - 30 - i * 5, x + w + 10, hz); ctx.lineTo(x + w + 10, hz + 4); ctx.lineTo(x - 10, hz + 4); ctx.fill(); ctx.globalAlpha = 0.5; ctx.fillStyle = i % 2 ? '#1a4a14' : '#3a8a2a'; ctx.fillRect(x, hz - 6 - i * 6, w, 2); ctx.globalAlpha = 1; }
    for (let i = 0; i < 6; i++) { const lx = x + (i + 0.5) * w / 6, sw = Math.sin(t * 1.5 + i) * 2, ly = y + 12 + (i % 2) * 14; ctx.strokeStyle = '#ffd88a66'; ctx.beginPath(); ctx.moveTo(lx, y); ctx.lineTo(lx + sw, ly); ctx.stroke(); ctx.fillStyle = '#ffcc2a66'; ctx.beginPath(); ctx.arc(lx + sw, ly + 7, 12, 0, 6.283); ctx.fill(); ctx.fillStyle = '#d82020'; ctx.beginPath(); ctx.ellipse(lx + sw, ly + 7, 6, 8, 0, 0, 6.283); ctx.fill(); ctx.fillStyle = '#ffd23f'; ctx.fillRect(lx + sw - 1, ly + 15, 2, 5); }
    ctx.strokeStyle = '#0c3a1a'; ctx.lineWidth = 2; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(x + w + 4, y + 40); ctx.quadraticCurveTo(x + w - 20 - i * 6, y + 40 + i * 6, x + w - 40 - i * 8, y + 78 + i * 6); ctx.stroke(); }
  },
  TR(x, y, w, h, hz, t, P) {                         // domes, minarets, hot-air balloons
    ['#e8403a', '#ffd23f', '#1ab0c0'].forEach((c, i) => { const bx = x + w * (0.2 + i * 0.3), by = y + 26 + Math.sin(t * 0.8 + i * 2) * 5 + i * 8; ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(bx, by, 9, 11, 0, 0, 6.283); ctx.fill(); ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.fillRect(bx - 1, by - 11, 2, 22); ctx.fillStyle = '#2a1408'; ctx.fillRect(bx - 3, by + 14, 6, 4); });
    const cx = x + w * 0.5; ctx.fillStyle = '#2a1008'; ctx.fillRect(cx - 28, hz - 22, 56, 22); ctx.beginPath(); ctx.arc(cx, hz - 22, 20, Math.PI, 0); ctx.fill(); ctx.fillRect(cx - 1, hz - 52, 2, 10);
    [-40, 40].forEach(o => { ctx.fillRect(cx + o - 3, hz - 56, 6, 56); ctx.beginPath(); ctx.moveTo(cx + o - 4, hz - 56); ctx.lineTo(cx + o, hz - 70); ctx.lineTo(cx + o + 4, hz - 56); ctx.fill(); });
    ctx.fillStyle = P[2] + '88'; ctx.fillRect(cx - 12, hz - 12, 5, 12); ctx.fillRect(cx + 7, hz - 12, 5, 12);
  },
  ID(x, y, w, h, hz, t, P) {                         // stepped stupa temple in the mist, jungle leaves
    ctx.fillStyle = P[1] + '44'; ctx.beginPath(); ctx.arc(x + w * 0.5, hz - 52, 26, 0, 6.283); ctx.fill();
    const cx = x + w * 0.5; for (let i = 0; i < 5; i++) { const ww = 70 - i * 12; ctx.fillStyle = i % 2 ? '#06281e' : '#0a3426'; ctx.fillRect(cx - ww / 2, hz - 12 - i * 11, ww, 11); for (let k = 0; k < 3 - Math.min(2, i); k++) { ctx.fillStyle = '#04201a'; ctx.beginPath(); ctx.arc(cx - ww / 2 + 8 + k * (ww - 16) / Math.max(1, 2 - Math.min(1, i)), hz - 13 - i * 11, 4, Math.PI, 0); ctx.fill(); } }
    ctx.fillStyle = '#04201a'; ctx.beginPath(); ctx.arc(cx, hz - 70, 6, Math.PI, 0); ctx.fill(); ctx.fillRect(cx - 0.5, hz - 82, 1.2, 8);
    for (let i = 0; i < 3; i++) { ctx.fillStyle = 'rgba(200,255,230,0.12)'; ctx.beginPath(); ctx.ellipse(x + ((t * 5 + i * 80) % (w + 90)) - 45, hz - 18 - i * 12, 50, 7, 0, 0, 6.283); ctx.fill(); }
    ctx.strokeStyle = '#0c4a2a'; ctx.lineWidth = 3; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(x - 2, y + 20 + i * 12); ctx.quadraticCurveTo(x + 22, y + 12 + i * 12, x + 38 + i * 3, y + 42 + i * 14); ctx.stroke(); }
  }
};
function selBg(o, x, y, w, h, t) {
  const P = ORI_PAL[o] || ORI_PAL.TH, hz = y + h - 14;
  const g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, P[0]); g.addColorStop(0.8, P[0]); g.addColorStop(1, '#0a0510'); ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  const gg = ctx.createLinearGradient(0, hz - 60, 0, hz + 4); gg.addColorStop(0, 'rgba(0,0,0,0)'); gg.addColorStop(1, P[1] + '70'); ctx.fillStyle = gg; ctx.fillRect(x, hz - 60, w, 64);
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); (MOTIF[o] || MOTIF.TH)(x, y, w, h, hz, t, P); ctx.restore();
  ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(x, hz, w, y + h - hz);
  ctx.fillStyle = P[1] + '88'; ctx.fillRect(x, hz, w, 1);
  return hz;
}
// ---------- the 4-slot move strip
const SLOT_DEFAULT = ['ATTACK', 'SPECIAL', 'SKILL', 'ULTIMATE'];
function selSlots(C) {                               // 4 x {key,label,real}: from the hero's own move text, else a generic label
  const want = ['J', 'K', 'S+J', 'L'], out = [null, null, null, null];
  (C.lines || []).slice(1).forEach(l => l.split('·').forEach(seg => {
    const m = /^\s*(HOLD J|AIR J|S\+J|S\+K|↑\+K|J|K|L)\b[^A-Z0-9"]*?\s*(?:\([^)]*\)\s*)?[=:]?\s*(.+?)\s*$/.exec(seg); if (!m) return;
    const k = m[1] === 'HOLD J' ? 'J' : m[1], i = want.indexOf(k); if (i < 0 || out[i]) return;
    const words = m[2].replace(/["()]/g, '').replace(/[:,]$/, '').split(/\s+/).filter(w => w && w !== '=');
    let lab = ''; for (const w of words) { if ((lab + ' ' + w).trim().length > 10) break; lab = (lab + ' ' + w).trim(); }
    lab = lab.replace(/\s+(&|AND|THE|A|OF|TO|IN|ON|AT)$/i, '').replace(/[:,&]$/, ''); out[i] = { key: k, label: lab || words[0].slice(0, 10), real: true };
  }));
  return out.map((o, i) => o || { key: want[i], label: SLOT_DEFAULT[i], real: false });
}
function slotFx(i, x, y, col, t) {
  const ph = (t * 1.6 + i * 0.25) % 1; ctx.save();
  if (i === 0) { ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(x + 7, y - 16, 10, -1.3 + ph * 0.6, 0.9 + ph * 0.6); ctx.stroke(); }
  else if (i === 1) { ctx.fillStyle = col; for (let k = 0; k < 4; k++) ctx.fillRect(x + 8 + ph * 5 + k * 2, y - 22 + k * 5, 8 - k, 1.5); }
  else if (i === 2) { ctx.strokeStyle = col; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.ellipse(x, y, 4 + ph * 16, 1.5 + ph * 4, 0, 0, 6.283); ctx.stroke(); }
  else { ctx.translate(x, y - 14); ctx.rotate(t * 2); ctx.fillStyle = col + '88'; for (let k = 0; k < 8; k++) { ctx.rotate(0.785); ctx.fillRect(7, -1, 7 + ph * 3, 2); } ctx.fillStyle = '#ffffff55'; ctx.beginPath(); ctx.arc(0, 0, 8, 0, 6.283); ctx.fill(); }
  ctx.restore();
}
// ---------- one poster
function drawPoster(slot, idx, t, selected) {
  const x = panelX(slot), y = PN.y, w = PN.w, k = CHAR_KEYS[idx], C = CHARS[k], locked = !isUnlocked(k), o = ORIGIN[k] || 'TH', q = G.previews[idx];
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, PN.h); ctx.clip();
  const useArt = artReady(k) && !locked, bh = PN.heroH, gy = useArt ? y + bh - 12 : selBg(o, x, y, w, bh, t);
  ctx.fillStyle = '#0a0510'; ctx.fillRect(x, y + bh, w, PN.h - bh);
  if (useArt) drawArtPoster(k, x, y, w);
  if (NATIVE[k] && !locked && !useArt) nativeTxt(NATIVE[k][0], NATIVE[k][2], x + w / 2, y + 24, ORI_PAL.IN[1], 44, 'center', 0.2 + 0.05 * Math.sin(t * 1.5));   // big ghost word in the hero's own script
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, bh); ctx.clip();
  selAnim(k, q, t, selected && !locked); if (!selected) { q.vx = 0; q.runPhase = 0; }
  const sc = k === 'wah' ? 1.9 : k === 'zhang' ? 2.2 : k === 'hongbao' ? 2.6 : 2.8;
  if (locked) ctx.globalAlpha = 0.28;
  if (!useArt) drawPreview(k, q, sc, x + w / 2 + (k === 'wah' ? 6 : 0), gy + 6);
  ctx.globalAlpha = 1; if (locked) txt('?', x + w / 2, y + 36, '#ffd23f', 28, 'center');
  ctx.restore();
  const vg = ctx.createLinearGradient(0, y + bh - 30, 0, y + bh); vg.addColorStop(0, 'rgba(10,5,16,0)'); vg.addColorStop(1, 'rgba(10,5,16,0.9)'); ctx.fillStyle = vg; ctx.fillRect(x, y + bh - 30, w, 30);
  if (useArt) { const g2 = ctx.createLinearGradient(0, y + bh - 34, 0, y + bh + 10); g2.addColorStop(0, 'rgba(10,5,16,0)'); g2.addColorStop(1, 'rgba(10,5,16,0.94)'); ctx.fillStyle = g2; ctx.fillRect(x, y + bh - 34, w, 44); ctx.fillStyle = 'rgba(10,5,16,0.96)'; ctx.fillRect(x, y + bh + 10, w, PN.h - bh - 10); if (!selected) { ctx.fillStyle = 'rgba(8,2,12,0.45)'; ctx.fillRect(x, y, w, PN.h); } }
  { const qs = (QUIPS[k] || []).find(z => /^[\x20-\x7e]+$/.test(z)); if (qs && !locked) txt('“' + qs.slice(0, 30) + '”', x + w / 2, y + bh - 10, selected ? '#ffe9b8' : '#a89888', 6, 'center'); }
  drawOriginTag(k, x + 4, y + 4); txt(ORIGIN_NAME[o] || '', x + 19, y + 5, ORIGIN_COL[o] || '#fff', 6, 'left', false);
  if ((SEL_NEW.has(k) || PROG.fresh.includes(k)) && !locked && Math.floor(t * 3) % 2 === 0) { ctx.fillStyle = '#ff2a4a'; ctx.fillRect(x + w - 24, y + 4, 21, 9); txt('NEW', x + w - 13, y + 5, '#fff', 7, 'center', false); }
  // name block
  const nm = C.name, ns = nm.length > 14 ? 9 : 11;
  txt(nm, x + w / 2, y + bh + 2, locked ? '#8a7a80' : C.col, ns, 'center'); if (NATIVE[k] && !locked) nativeTxt(NATIVE[k][0], NATIVE[k][1], x + w / 2, y + bh + 13, '#ffe9b8', 8, 'center');
  txt(locked ? 'LOCKED · ' + unlockText(k).slice(0, 26) : C.tag, x + w / 2, y + bh + 24, locked ? '#ff7a5a' : '#ffe9b8', 6, 'center', false);
  C.stats.forEach(([n, v], j) => { const sx = x + 3 + j * 37, lb = { SPEED: 'SPD', POWER: 'POW', RANGE: 'RNG', SAFETY: 'SAF' }[n] || n.slice(0, 3); txt(lb, sx, y + bh + 35, '#ffb070', 5, 'left', false); for (let b = 0; b < 5; b++) { ctx.fillStyle = b < v ? C.col : '#3a2a34'; ctx.fillRect(sx + 13 + b * 4.5, y + bh + 36, 3.5, 5); } });
  ctx.restore();
  // frame
  if (selected) { ctx.strokeStyle = Math.floor(t * 3) % 2 ? C.col : '#ffffff'; ctx.lineWidth = 2; ctx.strokeRect(x + 1, y + 1, w - 2, PN.h - 2); }
  else { ctx.strokeStyle = '#4a3a56'; ctx.lineWidth = 1; ctx.strokeRect(x + 0.5, y + 0.5, w - 1, PN.h - 1); ctx.fillStyle = 'rgba(6,2,12,0.45)'; ctx.fillRect(x, y, w, PN.h); }
  // HUD strip: 4 ability slots
  const slots = selSlots(C), cw = Math.floor((w - 5) / 4), act = Math.floor(t / 1.2) % 4, keys = ['J', 'K', 'S+J', 'L'], poses = ['punch', 'kick', 'bigkick', 'fly'];
  for (let i = 0; i < 4; i++) {
    const cx = x + i * (cw + 1.6), cy = PN.sy, on = selected && act === i;
    ctx.fillStyle = on ? C.col + '2e' : 'rgba(0,0,0,0.62)'; ctx.fillRect(cx, cy, cw, PN.sh); ctx.strokeStyle = on ? C.col : '#34283c'; ctx.lineWidth = 1; ctx.strokeRect(cx + 0.5, cy + 0.5, cw - 1, PN.sh - 1);
    ctx.save(); ctx.beginPath(); ctx.rect(cx + 1, cy + 1, cw - 2, 33); ctx.clip();
    if (!locked) {
      selAnim(k, q, t, false); q.swingT = 0.1; q.swingK = poses[i]; q.vx = 0;
      if (GUN_HEROES.has(k) && (i === 0 || (k === 'silat' && i === 1))) { q.swingT = 0; q.shootT = 0.06; }
      if (k === 'gada' || k === 'ximen') q.swingK = 'slash';
      slotFx(i, cx + cw / 2 - 6, cy + 31, C.col, t);
      drawPreview(k, q, 0.95, cx + cw / 2 - 2, cy + 31);
    } else txt('?', cx + cw / 2, cy + 8, '#5a4a60', 12, 'center', false);
    ctx.restore();
    txt(keys[i], cx + 2, cy + 2, on ? '#ffffff' : C.col, 6, 'left', false);
    txt(locked ? '' : slots[i].label, cx + cw / 2, cy + 36, on ? '#ffffff' : (slots[i].real ? '#cdbdae' : '#7a6a80'), 5, 'center', false);
  }
}
function drawSelect() {
  const t = G.clock, k = CHAR_KEYS[G.sel], C = CHARS[k], n = CHAR_KEYS.length, nb = selNb();
  if (G._selSeen !== G.sel) { if (G._selSeen != null && G.sel !== G._selSeen) { const L = CHAR_KEYS.length, d = (G.sel - G._selSeen + L) % L; selSlideX = (d > L / 2 ? -1 : 1) * (PN.w + PN.gap) * 0.55; } G._selSeen = G.sel; }
  selSlideX *= 0.8; if (Math.abs(selSlideX) < 0.5) selSlideX = 0;
  const bg = ctx.createLinearGradient(0, 0, 0, VH); bg.addColorStop(0, '#0b0412'); bg.addColorStop(1, '#1e0818'); ctx.fillStyle = bg; ctx.fillRect(0, 0, VW, VH);
  // header: title, count, country chips
  txt('CHOOSE YOUR HERO', 6, 1, '#ffd23f', 10, 'left'); txt('เลือกตัวละคร', 108, 3, '#ffe9b8', 7, 'left', false); txt(CHAR_KEYS.filter(isUnlocked).length + '/' + n, 172, 3, '#7dff8a', 7, 'left', false);
  const fl = SEL_FILTERS, cw = 24; let cx0 = VW - 4 - fl.length * (cw + 1);
  fl.forEach((f, i) => { const on = (G.selF || 'ALL') === f, col = f === 'ALL' ? '#ffffff' : ORIGIN_COL[f]; ctx.fillStyle = on ? col : 'rgba(0,0,0,0.55)'; ctx.fillRect(cx0 + i * (cw + 1), 2, cw, 10); ctx.strokeStyle = on ? '#ffffff' : '#4a3a50'; ctx.strokeRect(cx0 + i * (cw + 1) + 0.5, 2.5, cw - 1, 9); txt(f, cx0 + i * (cw + 1) + cw / 2, 3, on ? '#10060c' : col, 6, 'center', false); });
  // mini roster
  const mw = miniW();
  CHAR_KEYS.forEach((kk, i) => {
    const R = cardRect(i), on = i === G.sel, lk = !isUnlocked(kk), q = G.previews[i], dim = !selMatch(kk);
    ctx.fillStyle = on ? 'rgba(80,20,36,0.95)' : 'rgba(0,0,0,0.55)'; ctx.fillRect(R.x, R.y, mw - 1, MINI.h);
    selAnim(kk, q, t, false); ctx.save(); ctx.beginPath(); ctx.rect(R.x, R.y, mw - 1, MINI.h - 2); ctx.clip(); if (lk) ctx.globalAlpha = 0.3;
    drawPreview(kk, q, kk === 'wah' ? 0.32 : 0.5, R.x + (mw - 1) / 2 + (kk === 'wah' ? 1 : 0), R.y + MINI.h - 1); ctx.globalAlpha = 1; ctx.restore();
    ctx.fillStyle = ORIGIN_COL[ORIGIN[kk]] || '#fff'; ctx.fillRect(R.x, R.y + MINI.h - 2, mw - 1, 2);
    if (on) { ctx.strokeStyle = Math.floor(t * 4) % 2 ? CHARS[kk].col : '#fff'; ctx.lineWidth = 1.5; ctx.strokeRect(R.x + 0.5, R.y + 0.5, mw - 2, MINI.h - 1); }
    if (dim) { ctx.fillStyle = 'rgba(4,0,8,0.78)'; ctx.fillRect(R.x, R.y, mw - 1, MINI.h); }
    if (on && G.randPick > 0) { ctx.strokeStyle = '#ffd23f'; ctx.lineWidth = 2; ctx.strokeRect(R.x - 1, R.y - 1, mw + 1, MINI.h + 2); }
  });
  // the three posters
  if (nb.prev >= 0) drawPoster(0, nb.prev, t, false);
  if (nb.next >= 0) drawPoster(2, nb.next, t, false);
  drawPoster(1, G.sel, t, true);
  if (nb.prev >= 0) { const pu = Math.sin(t * 6) * 1.5; txt('◀', panelX(1) - 9 - pu, PN.y + 52, '#ffffff', 9, 'left'); txt('▶', panelX(2) - 5 + pu, PN.y + 52, '#ffffff', 9, 'left'); }
  if (G.uiDoves) for (const d of G.uiDoves) { ctx.fillStyle = '#fff'; const up = Math.sin(d.ph) > 0; ctx.fillRect(d.x - 2, d.y, 5, 2); ctx.fillRect(d.x - 3, d.y + (up ? -3 : 2), 3, 2); ctx.fillRect(d.x, d.y + (up ? -4 : 2), 3, 2); }
  if (k === 'ma' && (t % 2.5) < 0.04 && Math.random() < 0.6) spawnDovesUI(panelX(1) + PN.w / 2 + 14, PN.y + 50);
  // footer
  const hr = PROG.ranks[STAGE][k] || null, nr = nextRank(hr), bt = bestFor(k);
  txt('STAGE 0' + STAGE + ': ' + STAGE_NAMES[STAGE], 6, VH - 17, '#ffd23f', 6, 'left', false);
  txt('RANK ' + (hr || '-') + (nr ? ' → ' + nr : ' MAX') + '   BEST ' + (bt != null ? fmtTime(bt) : '--:--'), VW - 6, VH - 17, '#7dff8a', 6, 'right', false);
  txt('◀ ▶ BROWSE   ·   F COUNTRY   ·   R RANDOM   ·   V LOOK   ·   TAB STAGE   ·   ENTER = ACTION!', VW / 2, VH - 8, '#ffe9b8', 6, 'center', false);
  drawSlate();
}
