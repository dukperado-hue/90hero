# frame color (blue) crop -> magenta->green -> boxes grid cols x rows with order mapping
import sys, json, numpy as np
from PIL import Image
src, out, cols, rows, order = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4]), sys.argv[5].split(',')
a = np.array(Image.open(src).convert('RGB')).astype(int)
bl = (a[:,:,2] > 200) & (a[:,:,0] < 60) & (a[:,:,1] < 60); m = ~bl
r = np.where(m.mean(1) > 0.3)[0]; c = np.where(m.mean(0) > 0.3)[0]
a = a[r[0]+2:r[-1]-1, c[0]+2:c[-1]-1]
mg = (a[:,:,0] > 150) & (a[:,:,2] > 150) & (a[:,:,1] < 120)
a[mg] = [0, 255, 0]
H, W = a.shape[:2]; cw, ch = W // cols, H // rows; boxes = {}
for i, n in enumerate(order):
    rr, cc = divmod(i, cols); boxes[n] = [cc*cw+4, rr*ch+4, (cc+1)*cw-4, (rr+1)*ch-4]
Image.fromarray(a.astype('uint8')).save(out); json.dump(boxes, open(out + '.json', 'w')); print(W, H, boxes)
