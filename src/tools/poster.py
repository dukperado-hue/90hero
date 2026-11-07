import sys, numpy as np
from PIL import Image
a = np.array(Image.open(sys.argv[1]).convert('RGB')).astype(int)
g = (a[:,:,1] > 200) & (a[:,:,0] < 60) & (a[:,:,2] < 60); m = ~g
rows = np.where(m.mean(1) > 0.3)[0]; cols = np.where(m.mean(0) > 0.3)[0]
im = Image.fromarray(a[rows[0]:rows[-1]+1, cols[0]:cols[-1]+1].astype('uint8'))
w, h = im.size; im = im.crop((int(w*.035), int(h*.03), int(w*.965), int(h*.97)))
w, h = im.size; th = int(w * 824 / 616)
if th < h: im = im.crop((0, (h-th)//2, w, (h-th)//2 + th))
im = im.resize((616, 824), Image.LANCZOS); im.save(sys.argv[2], quality=90); print(sys.argv[2], im.size)
