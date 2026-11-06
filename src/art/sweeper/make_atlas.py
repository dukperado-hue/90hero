# usage: python3 make_atlas.py — slices sheet_raw.jpg (4x4 sweeper-monk sheet, black grid lines) into atlas.png + meta.json
from PIL import Image
import numpy as np, json
from scipy import ndimage
names=['idle','sw0','sw1','sw2','run0','run1','run2','run3','dash','spin','jump','slam','hit','fall','dead','bow']
K=0.55
im=Image.open('sheet_raw.jpg').convert('RGB')
cols=[63,351,640,929,1218]; rows=[0,155,315,474,631]
a=np.array(im).astype(int);r,g,b=a[...,0],a[...,1],a[...,2]
green=(g>r+40)&(g>b+40)
out=a.copy();spill=(g>np.maximum(r,b))&(~green);out[...,1]=np.where(spill,np.maximum(r,b),g)
rgba=np.dstack([out.astype(np.uint8),np.where(green,0,255).astype(np.uint8)])
im2=Image.fromarray(rgba,'RGBA');frames=[]
for i,n in enumerate(names):
    c=i%4;rw=i//4
    cell=im2.crop((cols[c]+5,rows[rw]+5,cols[c+1]-5,rows[rw+1]-4));arr=np.array(cell);al=arr[...,3]>0
    # drop near-black grid remnants touching the border
    lab,nl=ndimage.label(ndimage.binary_closing(al,iterations=2))
    sizes=ndimage.sum(al,lab,range(1,nl+1));keep=1+int(np.argmax(sizes))
    mask=(lab==keep)&al
    arr[...,3]=np.where(mask,255,0)
    ys,xs=np.where(mask);fr=Image.fromarray(arr).crop((xs.min(),ys.min(),xs.max()+1,ys.max()+1))
    arr2=np.array(fr).astype(int);al2=arr2[...,3]>0
    mx=arr2[...,:3].max(axis=2);mn=arr2[...,:3].min(axis=2);sat=(mx-mn)/np.maximum(mx,1)
    body=al2&(sat<0.22)&(mx>60)                          # grey robe / white hair+beard only: the broom is saturated, so it doesn't drag the anchor around
    yy,xx=np.where(body) if body.sum()>30 else np.where(al2)
    sm=fr.resize((max(1,round(fr.width*K)),max(1,round(fr.height*K))),Image.LANCZOS)
    frames.append((n,sm,float(xx.mean())*K));print(n,fr.size)
PAD=2;WW=sum(f[1].width+PAD for f in frames)+PAD;HH=max(f[1].height for f in frames)+2*PAD
atlas=Image.new('RGBA',(WW,HH),(0,0,0,0));x=PAD;meta={}
for n,sm,ax in frames:
    atlas.paste(sm,(x,PAD));meta[n]={'x':x,'y':PAD,'w':sm.width,'h':sm.height,'ax':round(ax,1)};x+=sm.width+PAD
atlas.save('atlas.png');json.dump(meta,open('meta.json','w'));print(WW,HH)
