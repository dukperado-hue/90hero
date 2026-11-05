// =====================================================================
// v27 HERO SELECT 2.0 — a movie-poster stage for the selected hero + a portrait roster.
//   left : spotlight stage, sunburst in the hero's colour, the hero at 4x doing a move loop, poster-style name
//   right: name, stats, the move list (the active move pulses), ranks, key hints
//   below: portrait roster (18 per row, scrolls by row when there are more), origin stripe, NEW / lock badges
// Overrides drawSelect / cardRect / cardAt from the base; selInput() (select.js) keeps handling F / R / mouse.
// =====================================================================
const SEL5 = { cols: 18, cw: 25, ch: 37, gap: 1, x0: 4, y0: 181, rows: 2 };
CARD.cols = SEL5.cols; CARD.w = SEL5.cw; CARD.h = SEL5.ch;
function cardRect(i) { const c = i % SEL5.cols, r = Math.floor(i / SEL5.cols) - (G && G.selOff || 0); return { x: SEL5.x0 + c * (SEL5.cw + SEL5.gap), y: SEL5.y0 + r * (SEL5.ch + SEL5.gap) }; }
function cardAt(mx, my) {
  for (let i = 0; i < CHAR_KEYS.length; i++) {
    const r = Math.floor(i / SEL5.cols) - (G.selOff || 0); if (r < 0 || r >= SEL5.rows) continue;
    const R = cardRect(i); if (mx >= R.x && mx <= R.x + SEL5.cw && my >= R.y && my <= R.y + SEL5.ch) return i;
  }
  return -1;
}
const SEL_SWING = new Set(['aamir', 'fei', 'siang', 'nine', 'sura', 'li', 'ximen', 'chiru', 'dong', 'zhang', 'ram', 'singham', 'michelle', 'srk', 'madong', 'oldboy', 'kham', 'paimei', 'lady', 'ichi', 'ogami', 'bey', 'gada', 'silat', 'hongbao', 'furie']);
function selAnim(k, q, t, on) {                      // the idle / action loop for one preview figure
  q.animT = t; q.onGround = true; q.face = 1; q.inv = 0; q.flash = 0;
  q.vx = on ? 160 : 0; q.runPhase = on ? t * (k === 'wah' ? 14 : 8) : 0;
  q.boostT = (k === 'wah' && on && (t % 3) > 2.4) ? 0.1 : 0;
  q.shootT = on && ((k === 'ma' && (t * 10 | 0) % 3 === 0) || (k === 'vijay' && (t * 10 | 0) % 2 === 0) || ((k === 'furie' || k === 'silat') && (t * 3 % 1) < 0.5 && (t * 3 | 0) % 2 === 0)) ? 0.06 : 0;
  q.hand = (t * 10 | 0) % 2;
  const cyc = (t * 3 | 0) % 4, act = on && (t * 3 % 1) < 0.4;
  q.swingT = act && SEL_SWING.has(k) ? 0.1 : 0;
  q.absorbing = k === 'zhang' && on && (t % 3) > 1.6; q.stored = q.absorbing ? Math.floor(((t % 3) - 1.6) * 6) : 0;
  q.swingK = k === 'zhang' ? 'palm' : k === 'ram' ? (cyc === 3 ? 'call' : 'butt') : (k === 'ximen' || k === 'gada') ? 'slash' : k === 'bey' ? (cyc === 3 ? 'slash' : 'punch') : k === 'chiru' ? (cyc === 3 ? 'pose' : 'slap') : ['punch', 'kick', 'punch', 'bigkick'][cyc];
  if (q.swingT > 0) q.vx = 0;
  if (q.shootT > 0) q.vx = 0;
  q.dodgeT = (k === 'sura' && on && (t % 2) > 1.6) ? 0.2 : 0; q.drinkT = (k === 'sura' && on && (t % 4) > 3.3) ? 0.3 : -1;
  q.charge = (k === 'li' && on && (t % 3) > 1.8) ? Math.min(1, ((t % 3) - 1.8)) : 0; q.coughing = (k === 'li' && on && (t % 6) > 5.4) ? 0.3 : 0;
  q.blowing = (k === 'ximen' && on && (t % 4) > 3.2);
}
function wrapTxt(s, n) { const out = []; let cur = ''; for (const w of s.split(' ')) { const nx = (cur + ' ' + w).trim(); if (nx.length > n && cur) { out.push(cur); cur = w; } else cur = nx; } if (cur) out.push(cur); return out; }
function selChip(x, y, w, label, col, on) {
  ctx.fillStyle = on ? col : 'rgba(0,0,0,0.55)'; ctx.fillRect(x, y, w, 11);
  ctx.strokeStyle = on ? '#ffffff' : '#4a3a50'; ctx.lineWidth = 1; ctx.strokeRect(x + 0.5, y + 0.5, w - 1, 10);
  txt(label, x + w / 2, y + 2, on ? '#10060c' : col, 7, 'center', false);
}
function selCorners(x, y, w, h, col, L) {
  ctx.strokeStyle = col; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x, y + L); ctx.lineTo(x, y); ctx.lineTo(x + L, y); ctx.moveTo(x + w - L, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w, y + L);
  ctx.moveTo(x + w, y + h - L); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w - L, y + h); ctx.moveTo(x + L, y + h); ctx.lineTo(x, y + h); ctx.lineTo(x, y + h - L); ctx.stroke();
}
const SEL_NEW = new Set(['furie', 'bey', 'gada', 'silat', 'hongbao']);
function drawSelect() {
  const t = G.clock, k = CHAR_KEYS[G.sel], C = CHARS[k], locked = !isUnlocked(k), n = CHAR_KEYS.length;
  const r0 = Math.floor(G.sel / SEL5.cols); G.selOff = G.selOff || 0;
  if (r0 < G.selOff) G.selOff = r0; if (r0 >= G.selOff + SEL5.rows) G.selOff = r0 - SEL5.rows + 1;
  // ---------- backdrop
  const bg = ctx.createLinearGradient(0, 0, 0, VH); bg.addColorStop(0, '#0b0412'); bg.addColorStop(0.7, '#1e0818'); bg.addColorStop(1, '#2a0c1c');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, VW, VH);
  for (let i = 0; i < 40; i++) { const x = (i * 97 + t * (8 + (i % 5) * 3)) % VW, y = (i * 53 + 20) % 170 + 20; ctx.fillStyle = 'rgba(255,230,180,' + (0.08 + (i % 4) * 0.03) + ')'; ctx.fillRect(x, y, 1, 1); }   // drifting dust
  // ---------- header
  txt('CHOOSE YOUR HERO', 6, 2, '#ffd23f', 14, 'left'); txt('เลือกตัวละคร', 150, 6, '#ffe9b8', 8, 'left');
  const fl = SEL_FILTERS, cw = 26; let cx0 = VW - 4 - fl.length * (cw + 2);
  fl.forEach((f, i) => selChip(cx0 + i * (cw + 2), 3, cw, f, f === 'ALL' ? '#ffffff' : ORIGIN_COL[f], (G.selF || 'ALL') === f));
  txt('HEROES ' + CHAR_KEYS.filter(isUnlocked).length + '/' + n, 6, 16, '#7dff8a', 7, 'left', false);
  // ---------- stage window (left)
  const SX = 4, SY = 24, SW = 172, SH = 153;
  ctx.save(); ctx.beginPath(); ctx.rect(SX, SY, SW, SH); ctx.clip();
  const sg = ctx.createRadialGradient(SX + SW / 2, SY + SH - 30, 5, SX + SW / 2, SY + SH - 30, SH * 1.0); sg.addColorStop(0, C.col + '55'); sg.addColorStop(0.55, C.col + '16'); sg.addColorStop(1, '#0a0410');
  ctx.fillStyle = '#0a0410'; ctx.fillRect(SX, SY, SW, SH); ctx.fillStyle = sg; ctx.fillRect(SX, SY, SW, SH);
  ctx.save(); ctx.translate(SX + SW / 2, SY + SH - 40);                               // sunburst
  for (let i = 0; i < 18; i++) { const a = i / 18 * 6.283 + t * 0.07, w = 0.09; ctx.fillStyle = C.col + (i % 2 ? '1c' : '0a'); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * 260, Math.sin(a) * 260); ctx.lineTo(Math.cos(a + w) * 260, Math.sin(a + w) * 260); ctx.fill(); }
  ctx.restore();
  const fy = SY + SH - 22;                                                           // floor
  ctx.fillStyle = 'rgba(0,0,0,0.55)'; ctx.fillRect(SX, fy, SW, SH);
  ctx.strokeStyle = C.col + '55'; ctx.lineWidth = 1; for (let i = -6; i <= 6; i++) { ctx.beginPath(); ctx.moveTo(SX + SW / 2 + i * 8, fy); ctx.lineTo(SX + SW / 2 + i * 34, SY + SH); ctx.stroke(); }
  ctx.fillStyle = 'rgba(0,0,0,0.55)'; ctx.beginPath(); ctx.ellipse(SX + SW / 2, fy + 1, 34, 5, 0, 0, 6.283); ctx.fill();
  const q = G.previews[G.sel]; selAnim(k, q, t, !locked);
  const sc = k === 'wah' ? 2.5 : k === 'zhang' ? 2.8 : k === 'hongbao' ? 3.7 : 3.9;
  if (locked) ctx.globalAlpha = 0.28;
  drawPreview(k, q, sc, SX + SW / 2 + (k === 'wah' ? 8 : 0), fy + 1);
  ctx.globalAlpha = 1;
  if (locked) { txt('?', SX + SW / 2, SY + SH / 2 - 30, '#ffd23f', 30, 'center'); }
  ctx.restore();
  selCorners(SX, SY, SW, SH, C.col, 10);
  ctx.fillStyle = 'rgba(0,0,0,0.62)'; ctx.fillRect(SX + 2, SY + SH - 19, SW - 4, 17);                       // poster title strip
  txt(C.name, SX + SW / 2, SY + SH - 18, locked ? '#8a7a80' : C.col, 10, 'center');
  txt(C.th, SX + SW / 2, SY + SH - 8, '#d8c8b8', 6, 'center', false);
  drawOriginTag(k, SX + 5, SY + 5); txt(ORIGIN_NAME[ORIGIN[k]] || '', SX + 20, SY + 6, ORIGIN_COL[ORIGIN[k]] || '#fff', 6, 'left', false);
  if ((SEL_NEW.has(k) || PROG.fresh.includes(k)) && !locked && Math.floor(t * 3) % 2 === 0) { ctx.fillStyle = '#ff2a4a'; ctx.fillRect(SX + SW - 26, SY + 4, 22, 9); txt('NEW', SX + SW - 15, SY + 5, '#fff', 7, 'center', false); }
  const pu = 2 + Math.sin(t * 6) * 1.5; txt('◀', SX + 3 - pu + 3, SY + SH / 2 - 10, '#ffffff', 10, 'left'); txt('▶', SX + SW - 12 + pu - 3, SY + SH / 2 - 10, '#ffffff', 10, 'left');
  // ---------- info panel (right)
  const IX = 182, IY = 24, IW = 294, IH = 153;
  ctx.fillStyle = 'rgba(10,4,16,0.82)'; ctx.fillRect(IX, IY, IW, IH); ctx.fillStyle = C.col; ctx.fillRect(IX, IY, 3, IH); ctx.fillRect(IX, IY, IW, 1);
  { const rw0 = C.tag.length * 5 + 10; txt(C.name, IX + 9, IY + 4, locked ? '#8a7a80' : C.col, C.name.length * 9.7 + rw0 > IW - 16 ? 12 : 16, 'left'); }
  txt(C.cn + '   ' + C.th, IX + 9, IY + 24, '#e8d8c0', 8, 'left');
  { const rw = C.tag.length * 5 + 10, rx0 = IX + IW - 5 - rw; ctx.fillStyle = C.col; ctx.fillRect(rx0, IY + 5, rw, 11); txt(C.tag, rx0 + rw / 2, IY + 7, '#10060c', 7, 'center', false); }
  { const dm = /DIFFICULTY\s*([★☆]{3})/.exec(C.lines[0] || ''), dv = C.diff || (dm ? (dm[1].match(/★/g) || []).length : 0); if (dv) txt('DIFFICULTY ' + '★'.repeat(dv) + '☆'.repeat(3 - dv), IX + IW - 6, IY + 20, '#ffe9b8', 7, 'right', false); }
  C.stats.forEach(([nm, v], j) => {
    const sx = IX + 9 + (j % 2) * 140, sy = IY + 34 + (j >> 1) * 10; txt(nm, sx, sy, '#ffb070', 8, 'left', false);
    for (let b = 0; b < 5; b++) { ctx.fillStyle = b < v ? C.col : '#3a2a34'; ctx.fillRect(sx + 52 + b * 15, sy + 1, 13, 6); if (b < v) { ctx.fillStyle = 'rgba(255,255,255,0.28)'; ctx.fillRect(sx + 52 + b * 15, sy + 1, 13, 2); } }
  });
  if (locked) {
    const u = UNLOCKS[k];
    txt('LOCKED  ·  ยังไม่ปลดล็อก', IX + 9, IY + 60, G.denyT > 0 && Math.floor(t * 12) % 2 ? '#ffffff' : '#ff5a5a', 8, 'left');
    wrapTxt('TO UNLOCK: ' + unlockText(k), 62).forEach((l, j) => txt(l, IX + 9, IY + 72 + j * 9, '#ffd23f', 7, 'left'));
    if (u && u.stage) txt('RANK ' + u.rank + ' ON STAGE 0' + u.stage + ' = ' + rankReq(u.stage, u.rank), IX + 9, IY + 96, '#a89888', 7, 'left');
  } else {
    ctx.save(); ctx.beginPath(); ctx.rect(IX + 4, IY + 50, IW - 6, IH - 76); ctx.clip();
    let yy = IY + 66; const act = Math.floor(t / 1.5) % Math.max(1, C.lines.length - 1) + 1;
    C.lines.forEach((l, j) => {
      if (j === 0) { txt(l.replace(/^ROLE:\s*/, '').replace(/\s*·\s*DIFFICULTY.*$/, ''), IX + 9, IY + 54, '#ffffff', 7, 'left', false); return; }
      const rows = wrapTxt(l, 64);
      if (j === act) { ctx.fillStyle = C.col + '33'; ctx.fillRect(IX + 5, yy - 1, IW - 9, rows.length * 8 + 1); ctx.fillStyle = C.col; ctx.fillRect(IX + 5, yy - 1, 2, rows.length * 8 + 1); }
      rows.forEach((r, i) => txt(r, IX + 11 + (i ? 8 : 0), yy + i * 8, j === act ? '#ffffff' : '#cdbdae', 7, 'left', false));
      yy += rows.length * 8 + 2;
    });
    ctx.restore();
  }
  // ranks + best time
  const hr = PROG.ranks[STAGE][k] || null, nr = nextRank(hr), bt = bestFor(k), sbt = stageBestTime(STAGE);
  ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.fillRect(IX + 5, IY + IH - 24, IW - 9, 1);
  let rx = IX + 9; txt('RANKS', rx, IY + IH - 20, '#ffb070', 7, 'left', false); rx += 32;
  [1, 2, 3, 4].forEach(s => { const r = (PROG.ranks[s] && PROG.ranks[s][k]) || '-'; txt('0' + s, rx, IY + IH - 20, s === STAGE ? '#ffffff' : '#8a7a70', 7, 'left', false); txt(r, rx + 12, IY + IH - 21, r === '-' ? '#5a4a4a' : rankCol(r), 8, 'left', false); rx += 28; });
  txt('BEST ' + (bt != null ? fmtTime(bt) : '--:--') + (sbt != null && sbt !== bt ? '   STAGE ' + fmtTime(sbt) : ''), IX + 9, IY + IH - 10, '#7dff8a', 7, 'left', false);
  if (!locked) txt(nr ? 'NEXT ' + nr + ': ' + rankReq(STAGE, nr) : 'TOP RANK ON 0' + STAGE + '!', IX + IW - 6, IY + IH - 10, '#7dff8a', 7, 'right', false);
  txt('F FILTER · R RANDOM · V LOOK · ENTER = ACTION!', 80, 16, '#ffe9b8', 7, 'left', false);
  // ---------- roster
  for (let i = 0; i < n; i++) {
    const r = Math.floor(i / SEL5.cols) - G.selOff; if (r < 0 || r >= SEL5.rows) continue;
    const kk = CHAR_KEYS[i], CC = CHARS[kk], R = cardRect(i), x = R.x, y = R.y, on = G.sel === i, lk = !isUnlocked(kk), dim = !selMatch(kk);
    ctx.fillStyle = on ? 'rgba(70,16,30,0.95)' : 'rgba(0,0,0,0.6)'; ctx.fillRect(x, y, SEL5.cw, SEL5.ch);
    if (on) { const g = ctx.createRadialGradient(x + SEL5.cw / 2, y + SEL5.ch - 6, 1, x + SEL5.cw / 2, y + SEL5.ch - 6, 22); g.addColorStop(0, CC.col + '66'); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(x, y, SEL5.cw, SEL5.ch); }
    const qq = G.previews[i]; selAnim(kk, qq, t, false);
    ctx.save(); ctx.beginPath(); ctx.rect(x + 1, y + 1, SEL5.cw - 2, SEL5.ch - 4); ctx.clip();
    if (lk) ctx.globalAlpha = 0.3;
    drawPreview(kk, qq, kk === 'wah' ? 0.62 : kk === 'zhang' ? 0.8 : 0.92, x + SEL5.cw / 2 + (kk === 'wah' ? 3 : 0), y + SEL5.ch - 5);
    ctx.globalAlpha = 1; ctx.restore();
    ctx.fillStyle = ORIGIN_COL[ORIGIN[kk]] || '#fff'; ctx.fillRect(x, y + SEL5.ch - 3, SEL5.cw, 3);
    if (lk) { const lx = x + SEL5.cw / 2 - 5, ly = y + 12; ctx.fillStyle = '#b8a8a0'; ctx.fillRect(lx + 2, ly, 6, 2); ctx.fillRect(lx + 2, ly, 2, 5); ctx.fillRect(lx + 6, ly, 2, 5); ctx.fillStyle = '#ffd23f'; ctx.fillRect(lx, ly + 5, 10, 8); ctx.fillStyle = '#5a3a10'; ctx.fillRect(lx + 4, ly + 7, 2, 4); }
    if (!lk && (SEL_NEW.has(kk) || PROG.fresh.includes(kk))) { ctx.fillStyle = '#ff2a4a'; ctx.fillRect(x + 1, y + 1, 10, 6); txt('NEW', x + 6, y + 1, '#fff', 5, 'center', false); }
    ctx.strokeStyle = on ? (Math.floor(t * 4) % 2 ? CC.col : '#ffffff') : '#3e2c46'; ctx.lineWidth = on ? 2 : 1; ctx.strokeRect(x + 0.5, y + 0.5, SEL5.cw - 1, SEL5.ch - 1);
    if (dim) { ctx.fillStyle = 'rgba(4,0,8,0.8)'; ctx.fillRect(x, y, SEL5.cw, SEL5.ch); }
    if (on && G.randPick > 0) { ctx.strokeStyle = '#ffd23f'; ctx.lineWidth = 2; ctx.strokeRect(x - 1.5, y - 1.5, SEL5.cw + 3, SEL5.ch + 3); }
  }
  if (rowsTotal() > SEL5.rows) { txt(G.selOff > 0 ? '▲' : '', VW - 8, SEL5.y0 - 1, '#ffd23f', 7, 'right', false); txt(G.selOff + SEL5.rows < rowsTotal() ? '▼' : '', VW - 8, SEL5.y0 + SEL5.rows * (SEL5.ch + 1) - 7, '#ffd23f', 7, 'right', false); }
  if (G.uiDoves) for (const d of G.uiDoves) { ctx.fillStyle = '#fff'; const up = Math.sin(d.ph) > 0; ctx.fillRect(d.x - 2, d.y, 5, 2); ctx.fillRect(d.x - 3, d.y + (up ? -3 : 2), 3, 2); ctx.fillRect(d.x, d.y + (up ? -4 : 2), 3, 2); }
  if (k === 'ma' && (t % 2.5) < 0.04 && Math.random() < 0.6) spawnDovesUI(SX + SW / 2 + 12, SY + SH - 60);
  // ---------- footer
  const nu = nextUnlock();
  txt('STAGE 0' + STAGE + ': ' + STAGE_NAMES[STAGE] + '  (TAB · ESC = MAP)' + (G.selF && G.selF !== 'ALL' ? '   ·   ' + ORIGIN_NAME[G.selF] : ''), 6, VH - 11, '#ffd23f', 7, 'left', false);
  txt(nu ? 'NEXT HERO: ' + CHARS[nu].name : 'ALL ' + n + ' HEROES UNLOCKED', VW - 6, VH - 11, nu ? '#ffb070' : '#7dff8a', 7, 'right', false);
  drawSlate();
}
function rowsTotal() { return Math.ceil(CHAR_KEYS.length / SEL5.cols); }
