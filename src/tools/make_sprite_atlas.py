#!/usr/bin/env python3
"""Gemini 4x2 green-screen sheet -> pixel atlas.  usage: make_sprite_atlas.py <sheet.png> <key> [target_height_px=38]
Order of cells (row-major, 2 columns): idle walkA walkB jump kickW kick hurt win.  Writes assets/<key>_sprites.png/json."""
import sys, json, numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage
sheet, key = sys.argv[1], sys.argv[2]; TH = int(sys.argv[3]) if len(sys.argv) > 3 else 38; CROP = float(sys.argv[4]) if len(sys.argv) > 4 else 1.0
a = np.array(Image.open(sheet).convert('RGB')).astype(int)
g = (a[:, :, 1] > 140) & (a[:, :, 1] - a[:, :, 0] > 45) & (a[:, :, 1] - a[:, :, 2] > 45)
al = np.array(Image.fromarray((~g * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(5)))
r, gc, b = a[:, :, 0], a[:, :, 1], a[:, :, 2]
rgba = np.dstack([np.dstack([r, np.minimum(gc, np.maximum(r, b) + 10), b]).astype(np.uint8), al])
H, W = a.shape[:2]; cw, ch = W // 2, H // 4; BOXES = json.load(open(sys.argv[5])) if len(sys.argv) > 5 else None   # optional {name:[x0,y0,x1,y1]} when Gemini ignores the grid
names = ['idle', 'walkA', 'walkB', 'jump', 'kickW', 'kick', 'hurt', 'win']; cells = {}
for i, n in enumerate(names):
    rr, c = divmod(i, 2)
    if BOXES: x0, y0, x1, y1 = BOXES[n]; cell = rgba[y0:y1, x0:x1].copy()
    else: cell = rgba[rr * ch + 6:(rr + 1) * ch - 6, c * cw + 6:(c + 1) * cw - 6].copy()
    if n == 'kick' and CROP < 1: cell[:, int(cw * CROP):, 3] = 0           # drop the projectile (the game draws its own)
    m = cell[:, :, 3] > 0; rows = np.where(m.sum(1) > 3)[0]; cols = np.where(m.sum(0) > 3)[0]
    cells[n] = Image.fromarray(cell[rows[0]:rows[-1] + 1, cols[0]:cols[-1] + 1])
S = TH / cells['idle'].size[1]; frames = {}; atlas = []; x = 0
for n in names:
    c = cells[n]; w = max(1, round(c.size[0] * S)); h = max(1, round(c.size[1] * S))
    arr = np.array(c).astype(float); pa = arr[:, :, 3:4] / 255
    pm = Image.fromarray(np.dstack([arr[:, :, :3] * pa, arr[:, :, 3:4]]).astype(np.uint8), 'RGBA')
    s = np.array(pm.resize((w, h), Image.BOX)).astype(float); A = s[:, :, 3:4] / 255
    rgb = np.where(A > 0, s[:, :, :3] / np.maximum(A, 1e-3), 0).clip(0, 255); alp = np.where(A[:, :, 0] > 0.5, 255, 0)
    lab, k = ndimage.label(alp > 0)
    if k > 1: keep = np.argmax(ndimage.sum(alp > 0, lab, range(1, k + 1))) + 1; alp = np.where(lab == keep, 255, 0)
    m = alp > 0; rows = np.where(m.any(1))[0]; lo = rows[-1]; sel = m[max(0, lo - max(2, int(h * .12))):lo + 1]
    frames[n] = {'x': x, 'w': w, 'h': h, 'ax': int(round(np.where(sel.any(0))[0].mean()))}
    atlas.append((x, Image.fromarray(np.dstack([rgb, alp]).astype(np.uint8)))); x += w + 1
AH = max(f['h'] for f in frames.values()); at = Image.new('RGBA', (x, AH), (0, 0, 0, 0))
for xx, s in atlas: at.paste(s, (xx, AH - s.size[1]))
for f in frames.values(): f['y'] = AH - f['h']
at.save('assets/%s_sprites.png' % key, optimize=True); json.dump(frames, open('assets/%s_sprites.json' % key, 'w'))
bg = Image.new('RGBA', (x * 5, AH * 5), (70, 60, 90, 255)); bg.alpha_composite(at.resize((x * 5, AH * 5), Image.NEAREST)); bg.save('/tmp/gp/atlas_prev.png'); print(key, x, AH)
