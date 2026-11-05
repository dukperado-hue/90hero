// =====================================================================
// v26 — STAGE 01 playfield pass (to sit under the Gemini back-street painting):
// steel gratings become fire-escape walkways on scaffold legs with shop signs hung under them,
// the raised dirt steps become concrete loading docks, the street gets asphalt + a kerb,
// and a foreground layer adds overhead cables with laundry and dark junk along the bottom.
// =====================================================================
const S1X = { g: null, runs: [] };
function s1Runs() {
  if (S1X.g === G) return S1X.runs;
  S1X.g = G; S1X.runs = [];
  for (let ty = 0; ty < 18; ty++) { let a = -1; for (let tx = 0; tx <= LW; tx++) { const on = tx < LW && tiles[ty * LW + tx] === T.P; if (on && a < 0) a = tx; if (!on && a >= 0) { S1X.runs.push({ a, b: tx - 1, ty, k: S1X.runs.length }); a = -1; } } }
  return S1X.runs;
}
function skin1(g, t, tx, ty, x, y, i) {
  if (t === T.P) {                                    // fire-escape grating: dark steel, rivets, a lit edge
    g.fillStyle = '#2a2a34'; g.fillRect(x, y, TS, 4); g.fillStyle = '#5a5a6a'; g.fillRect(x, y, TS, 1);
    g.fillStyle = '#16161e'; for (let k = 1; k < TS; k += 3) g.fillRect(x + k, y + 1.5, 1.5, 2);
    g.fillStyle = '#ff9a4a'; g.globalAlpha = 0.35; g.fillRect(x, y, TS, 0.6); g.globalAlpha = 1;
    return true;
  }
  if ((t === T.G || t === T.H) && tileAt(tx, ty - 1) !== T.G && tileAt(tx, ty - 1) !== T.H) {
    const dmg = thp[i] < HPS[t];
    if (ty < 18) {                                     // a raised step = a concrete loading dock, hazard stripe on the lip
      g.fillStyle = '#5a5258'; g.fillRect(x, y, TS, TS); g.fillStyle = '#7a7076'; g.fillRect(x, y, TS, 2);
      for (let k = 0; k < TS; k += 6) { g.fillStyle = (Math.floor((tx * TS + k) / 6) % 2) ? '#e8b020' : '#1a1a1a'; g.fillRect(x + k, y + 2, 6, 2); }
      g.fillStyle = 'rgba(0,0,0,0.25)'; g.fillRect(x, y + 9, TS, 0.6); g.fillRect(x + ((tx * 5) % 13), y + 4, 0.6, 12);
    } else {                                           // the street: asphalt, kerb, the odd manhole and puddle
      g.fillStyle = '#3a3438'; g.fillRect(x, y, TS, TS); g.fillStyle = '#8a8288'; g.fillRect(x, y, TS, 2.5); g.fillStyle = '#5a545a'; g.fillRect(x, y + 2.5, TS, 1);
      g.fillStyle = 'rgba(0,0,0,0.28)'; for (let k = 0; k < 4; k++) g.fillRect(x + ((tx * 7 + k * 5) % 15), y + 5 + k * 2.5, 1, 0.8);
      if (tx % 23 === 7) { g.fillStyle = '#2a2428'; g.beginPath(); g.ellipse(x + 8, y + 9, 6, 2.2, 0, 0, 6.283); g.fill(); g.fillStyle = '#4a4248'; g.fillRect(x + 3, y + 8.5, 10, 0.8); }
      if (tx % 17 === 3) { g.fillStyle = 'rgba(255,150,90,0.25)'; g.beginPath(); g.ellipse(x + 8, y + 6, 7, 1.4, 0, 0, 6.283); g.fill(); }
    }
    if (dmg) { g.fillStyle = 'rgba(20,10,4,0.75)'; g.fillRect(x + 3, y + 4, 5, 1); g.fillRect(x + 7, y + 5, 1, 4); g.fillRect(x + 8, y + 9, 4, 1); }
    return true;
  }
  if ((t === T.G || t === T.H) && ty < 18) { g.fillStyle = '#4a4248'; g.fillRect(x, y, TS, TS); g.fillStyle = 'rgba(0,0,0,0.22)'; g.fillRect(x, y + ((tx * 3 + ty * 5) % 14), TS, 0.6); g.fillRect(x + ((tx * 7 + ty) % 15), y, 0.6, TS); return true; }
  return false;
}
function drawStage1Mid(cam) {
  const t = G.clock, L = cam.x - 40, R = cam.x + VW + 40;
  const signs = [['大旺工業', '#ff5ab0'], ['車房', '#3ad0ff'], ['五金', '#ffd23f'], ['茶記', '#7dff5a'], ['麻雀', '#ff7a3a'], ['押', '#ffd23f']];
  for (const r of s1Runs()) {
    const X0 = r.a * TS, X1 = (r.b + 1) * TS; if (X1 < L || X0 > R) continue;
    const y = r.ty * TS + 4, gy = groundBelow(X0 + 8, (r.ty + 1) * TS), W = X1 - X0;
    ctx.fillStyle = '#1e1e26';                                                  // scaffold legs + cross bracing
    for (let x = X0 + 2; x < X1 - 1; x += Math.max(24, W / Math.max(1, Math.round(W / 40)))) ctx.fillRect(x, y, 2, gy - y);
    ctx.fillRect(X1 - 4, y, 2, gy - y);
    ctx.strokeStyle = 'rgba(30,30,38,0.9)'; ctx.lineWidth = 1; ctx.beginPath();
    for (let x = X0 + 2; x + 24 <= X1; x += 32) { const h = Math.min(30, gy - y); ctx.moveTo(x, y); ctx.lineTo(x + 24, y + h); }
    ctx.stroke();
    ctx.fillStyle = '#3a3a46'; ctx.fillRect(X0, y - 9, W, 1); for (let x = X0; x <= X1; x += 6) ctx.fillRect(x, y - 9, 1, 9);   // railing behind the walkway
    if (gy - y > 34 && W >= 40) {                                               // a neon sign hangs under every other walkway
      const [cn, col] = signs[r.k % signs.length], sw = Math.min(W - 8, 54), sx = X0 + (W - sw) / 2, sy = y + 6, on = Math.sin(t * 13 + r.k * 3) > -0.85;
      ctx.fillStyle = '#2a2a2a'; ctx.fillRect(sx + 4, y, 1, 6); ctx.fillRect(sx + sw - 5, y, 1, 6);
      ctx.fillStyle = '#140a10'; ctx.fillRect(sx, sy, sw, 16);
      ctx.globalAlpha = on ? 1 : 0.3; ctx.fillStyle = col; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(cn, sx + sw / 2, sy + 8.5); ctx.globalAlpha = 1;
      if (on) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 0.13; ctx.fillStyle = col; ctx.fillRect(sx - 8, sy - 6, sw + 16, 28); ctx.restore(); }
    }
  }
}
function drawStage1Front() {
  const c = G.cam, t = G.clock;
  const off = (c.x * 1.3) % 260;                                                 // overhead cables with laundry, swaying
  for (let k = -1; k < VW / 260 + 2; k++) {
    const x0 = k * 260 - off, sag = 16 + (k & 1) * 6, y0 = 6 + (k & 1) * 10;
    ctx.strokeStyle = 'rgba(10,6,12,0.9)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo(x0 + 130, y0 + sag * 2, x0 + 260, y0); ctx.stroke();
    for (let f = 1; f < 9; f++) { const u = f / 9, fx = x0 + 260 * u, fy = y0 + 4 * sag * u * (1 - u) * 1, sw = Math.sin(t * 2 + f + k) * 1.5;
      ctx.fillStyle = ['#d8d0c0', '#c84a4a', '#4a7ab8', '#e8c040', '#7aa86a'][(f + k * 3 + 50) % 5]; ctx.fillRect(fx - 3 + sw, fy, 6, 7 + (f % 3) * 2); }
  }
  const hor = 18 * TS - c.y + 8; if (hor > VH - 4) return;
  const off2 = (c.x * 1.5) % 120;                                                 // dark junk along the bottom edge: bins, pipes, a scooter
  ctx.fillStyle = '#0c070e';
  for (let k = -1; k < VW / 120 + 2; k++) {
    const x = k * 120 - off2, v = ((k + Math.floor(c.x * 1.5 / 120)) % 3 + 3) % 3;
    if (v === 0) { ctx.fillRect(x + 10, VH - 22, 22, 22); ctx.fillRect(x + 8, VH - 25, 26, 4); ctx.fillRect(x + 40, VH - 16, 18, 16); }
    else if (v === 1) { ctx.fillRect(x, VH - 9, 120, 9); ctx.fillRect(x + 30, VH - 30, 6, 30); ctx.fillRect(x + 30, VH - 30, 40, 5); }
    else { ctx.beginPath(); ctx.arc(x + 30, VH - 6, 7, 0, 6.283); ctx.arc(x + 62, VH - 6, 7, 0, 6.283); ctx.fill(); ctx.fillRect(x + 28, VH - 18, 38, 8); ctx.fillRect(x + 58, VH - 28, 3, 12); }
  }
}
