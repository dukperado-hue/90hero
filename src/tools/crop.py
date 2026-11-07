import sys, numpy as np
from PIL import Image
src, out = sys.argv[1], sys.argv[2]
a = np.array(Image.open(src).convert('RGB')).astype(int)
g = (a[:,:,1] > 200) & (a[:,:,0] < 60) & (a[:,:,2] < 60)
m = ~g; rows = np.where(m.mean(1) > 0.5)[0]; cols = np.where(m.mean(0) > 0.5)[0]
y0, y1, x0, x1 = rows[0]+2, rows[-1]-2, cols[0]+2, cols[-1]-2
im = Image.fromarray(a[y0:y1+1, x0:x1+1].astype('uint8'))
im.save(out, quality=90); print(out, im.size)
