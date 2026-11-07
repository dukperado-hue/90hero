import sys, numpy as np
from PIL import Image
a = np.array(Image.open(sys.argv[1]).convert('RGB')).astype(int)
mg = (a[:,:,0] > 190) & (a[:,:,1] < 80) & (a[:,:,2] > 190); m = ~mg
rows = np.where(m.mean(1) > 0.3)[0]; cols = np.where(m.mean(0) > 0.3)[0]
Image.fromarray(a[rows[0]+1:rows[-1], cols[0]+1:cols[-1]].astype('uint8')).save(sys.argv[2]); print(cols[0], cols[-1], rows[0], rows[-1])
