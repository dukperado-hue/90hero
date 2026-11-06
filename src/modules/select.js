// =====================================================================
// v22 HERO SELECT: origin flags + filter (F), random pick (R), mouse hover,
// a big spotlight preview of the selected hero, and a clapperboard before the take.
// =====================================================================
const ORIGIN = { shaolin: 'HK', eagle: 'TH', sombat: 'TH', sorapong: 'TH', wah: 'HK', ma: 'HK', fei: 'CN', nine: 'HK', siang: 'TH', sura: 'CN', li: 'CN', ximen: 'CN',
  chiru: 'IN', dong: 'CN', zhang: 'CN', vijay: 'IN', ram: 'IN', singham: 'IN', michelle: 'HK', phiphop: 'TH', srk: 'IN', rajini: 'IN', madong: 'KR', oldboy: 'KR',
  kham: 'TH', paimei: 'CN', lady: 'KR', ichi: 'JP', ogami: 'JP', juk: 'TH', furie: 'VN', bey: 'TR', gada: 'IN', silat: 'ID', hongbao: 'HK', pob: 'TH', ajumma: 'KR' };
const ORIGIN_COL = { TH: '#4a8aff', HK: '#ff4a6a', CN: '#ffd23f', IN: '#ff9a3a', KR: '#7ae8ff', JP: '#ffffff', VN: '#ff6a6a', TR: '#ff9ac0', ID: '#5affa0' };
const ORIGIN_NAME = { ALL: 'ALL HEROES', TH: 'THAI · ไทย', HK: 'HONG KONG · 香港', CN: 'CHINA · 中國', IN: 'INDIA · भारत', KR: 'KOREA · 한국', JP: 'JAPAN · 日本', VN: 'VIETNAM · VIỆT NAM', TR: 'TURKEY · TÜRKİYE', ID: 'INDONESIA' };
const SEL_FILTERS = ['ALL', 'TH', 'HK', 'CN', 'IN', 'KR', 'JP', 'VN', 'TR', 'ID'];
const selMatch = k => !G.selF || G.selF === 'ALL' || ORIGIN[k] === G.selF;
function selStep(dir, stride) {                 // move, skipping heroes the filter hides
  const n = CHAR_KEYS.length; let i = G.sel;
  for (let k = 0; k < n; k++) {
    if (stride === 1) i = (i + dir + n) % n;
    else { const c = i % CARD.cols; i += dir * CARD.cols; if (i >= n) i = c; if (i < 0) { i = c; while (i + CARD.cols < n) i += CARD.cols; } }
    if (selMatch(CHAR_KEYS[i])) { G.sel = i; return; }
    if (stride !== 1 && k > 3) { stride = 1; }                                    // no match in this column: fall back to scanning
  }
}
function selInput(ip, dt) {                       // returns true when the hero is confirmed
  const n = CHAR_KEYS.length;
  if (G.slate) { G.slate.t += dt; if (G.slate.t > 0.85) { G.slate = null; return true; } return false; }
  if (ip.filter) {
    G.selF = SEL_FILTERS[(SEL_FILTERS.indexOf(G.selF || 'ALL') + 1) % SEL_FILTERS.length]; audio.play('check');
    if (!selMatch(CHAR_KEYS[G.sel])) selStep(1, 1);
  }
  if (ip.restart && !G.randT) { G.randT = 0.9; G.randTick = 0; audio.play('spin'); }
  if (G.randT > 0) {                              // slot-machine shuffle, then it lands
    G.randT -= dt; G.randTick -= dt;
    const pool = CHAR_KEYS.map((k, i) => i).filter(i => isUnlocked(CHAR_KEYS[i]) && selMatch(CHAR_KEYS[i]));
    if (G.randTick <= 0 && pool.length) { G.randTick = 0.05 + (0.9 - G.randT) * 0.12; G.sel = pool[(Math.random() * pool.length) | 0]; audio.play('bounce'); }
    if (G.randT <= 0) { G.randT = 0; audio.play('check'); G.randPick = 0.6; }
    return false;
  }
  if (G.randPick > 0) G.randPick -= dt;
  // mouse hover picks the card under the pointer
  if (G.lastMouse && (Math.abs(mouse.x - G.lastMouse.x) > 0.5 || Math.abs(mouse.y - G.lastMouse.y) > 0.5)) { const c = typeof miniAt === 'function' ? miniAt(mouse.x, mouse.y) : cardAt(mouse.x, mouse.y); if (c >= 0 && c !== G.sel) { G.sel = c; audio.play('bounce'); } }
  G.lastMouse = { x: mouse.x, y: mouse.y };
  return null;
}
function drawOriginTag(k, x, y) {
  const o = ORIGIN[k]; if (!o) return;
  ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(x, y, 11, 7); ctx.fillStyle = ORIGIN_COL[o]; ctx.fillRect(x, y, 1, 7);
  txt(o, x + 6, y + 0.5, ORIGIN_COL[o], 6, 'center', false);
}
function drawSpotlight(k, q, x, y, w, h) {        // the big preview: a stage light on the selected hero
  const C = CHARS[k], t = G.clock;
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  ctx.fillStyle = '#0a0610'; ctx.fillRect(x, y, w, h);
  const g = ctx.createRadialGradient(x + w / 2, y + h - 10, 2, x + w / 2, y + h - 10, h * 0.9);
  g.addColorStop(0, C.col + '66'); g.addColorStop(0.5, C.col + '22'); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  ctx.fillStyle = 'rgba(255,240,200,0.07)'; ctx.beginPath(); ctx.moveTo(x + w / 2 - 6, y); ctx.lineTo(x + w / 2 + 6, y); ctx.lineTo(x + w - 4, y + h - 8); ctx.lineTo(x + 4, y + h - 8); ctx.fill();   // light cone
  ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.beginPath(); ctx.ellipse(x + w / 2, y + h - 8, 20, 3, 0, 0, 6.283); ctx.fill();
  const locked = !isUnlocked(k), sc = k === 'wah' ? 1.6 : k === 'zhang' ? 1.7 : 2.3;
  if (locked) ctx.globalAlpha = 0.25;
  drawPreview(k, q, sc, x + w / 2 + (k === 'wah' ? 6 : 0), y + h - 8);
  ctx.globalAlpha = 1;
  if (locked) txt('?', x + w / 2, y + h / 2 - 10, '#ffd23f', 14, 'center');
  ctx.restore();
  ctx.strokeStyle = C.col; ctx.lineWidth = 1; ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
  drawOriginTag(k, x + 2, y + 2);
  // film-strip perforations down both sides: it's a movie
  ctx.fillStyle = 'rgba(255,255,255,0.12)'; for (let yy = y + 3; yy < y + h - 3; yy += 7) { ctx.fillRect(x + w - 5, yy, 3, 3); }
  void t;
}
function drawSelectPanel(k, y) {                   // replaces the old text-only panel
  const C = CHARS[k], t = G.clock, X = 84, q = G.previews[G.sel];
  ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fillRect(4, y, VW - 8, VH - y - 13);
  drawSpotlight(k, q, 8, y + 2, 70, VH - y - 17);
  txt(C.name + '  ' + C.cn + '  ' + C.th, X, y + 3, C.col, 10, 'left');
  txt(C.tag, VW - 10, y + 5, '#ffe9b8', 8, 'right');
  // stats as one compact row
  C.stats.forEach(([n, v], j) => {
    const sx = X + j * 96; txt(n, sx, y + 16, '#ffb070', 7, 'left', false);
    for (let b = 0; b < 5; b++) { ctx.fillStyle = b < v ? C.col : '#3a2a2a'; ctx.fillRect(sx + 42 + b * 9, y + 17, 7, 5); }
  });
  const lockedSel = !isUnlocked(k);
  if (lockedSel) {
    const u = UNLOCKS[k];
    txt('LOCKED  ·  ยังไม่ปลดล็อก', X, y + 28, G.denyT > 0 && Math.floor(t * 12) % 2 ? '#ffffff' : '#ff5a5a', 8, 'left');
    txt('TO UNLOCK: ' + unlockText(k), X, y + 39, '#ffd23f', 8, 'left');
    if (u && u.stage) txt('RANK ' + u.rank + ' ON STAGE 0' + u.stage + ' = ' + rankReq(u.stage, u.rank), X, y + 50, '#a89888', 8, 'left');
  } else {
    ctx.save(); ctx.beginPath(); ctx.rect(X, y + 25, VW - X - 8, 40); ctx.clip();
    C.lines.forEach((l, j) => txt(l, X, y + 26 + j * 9.5, j === 0 ? '#ffffff' : '#d8c8b8', 8, 'left'));
    ctx.restore();
  }
  // this hero's rank on every stage
  let rx = X; txt('RANKS', rx, y + 65, '#ffb070', 7, 'left', false); rx += 30;
  [1, 2, 3, 4].forEach(s => { const r = PROG.ranks[s][k] || '-'; txt('0' + s, rx, y + 65, s === STAGE ? '#ffffff' : '#8a7a70', 7, 'left', false); txt(r, rx + 13, y + 64, r === '-' ? '#5a4a4a' : rankCol(r), 8, 'left', false); rx += 30; });
  if (!lockedSel) { const hr = PROG.ranks[STAGE][k] || null, nr = nextRank(hr); txt(nr ? 'NEXT ' + nr + ' ON 0' + STAGE + ': ' + rankReq(STAGE, nr) : 'TOP RANK ON 0' + STAGE + '!', rx + 6, y + 65, '#7dff8a', 7, 'left', false); }
}
function drawSlate() {                             // clapperboard: SCENE / TAKE / the hero's name, then the clap
  const S = G.slate; if (!S) return;
  const k = CHAR_KEYS[G.sel], C = CHARS[k], u = Math.min(1, S.t / 0.18), clap = S.t > 0.45;
  ctx.fillStyle = 'rgba(0,0,0,' + (0.55 * u) + ')'; ctx.fillRect(0, 0, VW, VH);
  const w = 220, h = 110, x = VW / 2 - w / 2, y = VH / 2 - h / 2 + (1 - u) * 60;
  ctx.fillStyle = '#141414'; ctx.fillRect(x, y, w, h); ctx.strokeStyle = '#e8e8e8'; ctx.lineWidth = 1; ctx.strokeRect(x + 3.5, y + 22.5, w - 7, h - 26);
  ctx.save(); ctx.translate(x, y + 20); ctx.rotate(clap ? 0 : -0.35);       // the clapper stick
  ctx.fillStyle = '#141414'; ctx.fillRect(0, -18, w, 18);
  for (let i = 0; i < 9; i++) { ctx.fillStyle = '#f0f0f0'; ctx.beginPath(); ctx.moveTo(i * 26, -18); ctx.lineTo(i * 26 + 13, -18); ctx.lineTo(i * 26 + 4, 0); ctx.lineTo(i * 26 - 9, 0); ctx.fill(); }
  ctx.restore();
  txt('NEIGHBORHOOD OF CHAOS', x + w / 2, y + 26, '#e8e8e8', 8, 'center');
  txt('SCENE 0' + STAGE + '   ·   TAKE ' + ((PROG.clears[STAGE] || 0) + 1), x + w / 2, y + 40, '#ffd23f', 8, 'center');
  txt(C.name, x + w / 2, y + 56, C.col, 14, 'center');
  txt(C.cn + '  ' + C.th, x + w / 2, y + 76, '#d8c8b8', 8, 'center');
  txt('ROLL CAMERA... ACTION!', x + w / 2, y + 92, clap ? '#ff5a3a' : '#8a8a8a', 8, 'center');
  if (clap && !S.clapped) { S.clapped = true; audio.play('clang'); }
}
