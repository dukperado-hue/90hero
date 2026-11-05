// =====================================================================
// v26 — THE NEW LOOK: big heads, long limbs, fake 2.5D volume.
// Every hero and grunt is drawn from px()/hp() rectangles in a feet-origin local space (head ≈ y -16..-26,
// torso -8..-16, legs 0..-8). Instead of redrawing 31 heroes by hand, the rectangles are remapped on the fly:
//   head ×1.4 (pivot at the neck) · legs ×1.28 taller · anything reaching out past the shoulders ×1.35 longer.
// The map is monotonic, so a sprite never tears; it just changes proportions. Press V to compare with the old look.
// =====================================================================
let LOOK = (() => { try { return localStorage.getItem('omr_look') || 'big'; } catch (e) { return 'big'; } })();
let WARP = 0;
const LK = { H: 1.4, L: 1.28, A: 1.35, neck: -16, hip: -8, sh: 4 };
function lkY(y) {
  if (y >= LK.hip) return y * LK.L;
  const yl = LK.hip * LK.L;
  if (y >= LK.neck) return yl + (y - LK.hip);
  return yl + (LK.neck - LK.hip) + (y - LK.neck) * LK.H;
}
function lkX(x, head) {
  if (head) return x * LK.H;
  const a = Math.abs(x); return a <= LK.sh ? x : Math.sign(x) * (LK.sh + (a - LK.sh) * LK.A);
}
function lkRect(x, y, w, h) {                       // → [x, y, w, h] in the new proportions
  const head = y + h / 2 < LK.neck - 0.5;
  const q = v => Math.round(v * 2) / 2;            // snap to device pixels so neighbouring rects share edges: no seams
  const x0 = q(lkX(x, head)), x1 = q(lkX(x + w, head)), y0 = q(lkY(y)), y1 = q(lkY(y + h));
  return [x0, y0, Math.max(0.5, x1 - x0), Math.max(0.5, y1 - y0)];
}
function cycleLook() {
  LOOK = LOOK === 'big' ? 'classic' : 'big'; try { localStorage.setItem('omr_look', LOOK); } catch (e) {}
  return LOOK === 'big' ? 'LOOK: BIG HEADS + 2.5D' : 'LOOK: CLASSIC';
}
const lookOn = () => LOOK === 'big';
const WARP_ENEMIES = new Set(['soldier', 'gunner', 'bomber', 'knife', 'shield', 'heavy', 'jiangshi', 'ghost', 'monk']);
// the volume pass: light from above-left, shade below-right, applied only where the sprite has pixels
function lkShade(g, W, H, top, bot) {
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-atop';
  const v = g.createLinearGradient(0, top, 0, bot);
  v.addColorStop(0, 'rgba(255,240,205,0.26)'); v.addColorStop(0.42, 'rgba(255,240,205,0.04)'); v.addColorStop(0.75, 'rgba(20,6,40,0.10)'); v.addColorStop(1, 'rgba(20,6,40,0.34)');
  g.fillStyle = v; g.fillRect(0, 0, W, H);
  const cx = W / 2, hz = g.createLinearGradient(cx - 14 * (bot - top) / 34, 0, cx + 14 * (bot - top) / 34, 0);
  hz.addColorStop(0, 'rgba(255,240,205,0.10)'); hz.addColorStop(0.5, 'rgba(0,0,0,0)'); hz.addColorStop(1, 'rgba(10,0,30,0.16)');
  g.fillStyle = hz; g.fillRect(0, 0, W, H);
  g.restore();
}
// enemies get the same outline + contact shadow + volume as heroes (they used to be flat cut-outs)
function drawEnemyLook(e) {
  const big = lookOn() && WARP_ENEMIES.has(e.type) && !e.gibbed && !e.skel;
  if (!big) return drawEnemy(e);
  const ground = e.onGround && !e.dead && e.type !== 'ghost';
  WARP = 1;
  try { drawOutlined(e.x - 16, e.y - 16, e.w + 32, e.h + 22, () => drawEnemy(e), ground ? { x: e.x + e.w / 2, y: e.y + e.h, r: e.type === 'heavy' ? 11 : 7 } : null, { top: e.y + e.h - 36, bot: e.y + e.h, noGlow: true }); }
  finally { WARP = 0; }
}
