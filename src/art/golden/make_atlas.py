# usage: python3 make_atlas.py  — slices sheet_chibi_raw.jpg (4x4 chibi sheet on green) into atlas_gold.png / atlas_flesh.png / meta.json
from PIL import Image
import numpy as np, json, colorsys
from scipy import ndimage
names=['idle0','idle1','walk0','walk1','walk2','walk3','wind','strike','jump','kick','guard','hit','fall','dead','low','taunt']
K=0.48
im=Image.open('sheet_chibi_raw.jpg').convert('RGB').crop((325,0,956,631))
W,H=im.size;cw=W/4;ch=H/4
a=np.array(im).astype(int);r,g,b=a[...,0],a[...,1],a[...,2]
green=(g>r+40)&(g>b+40)
out=a.copy();spill=(g>np.maximum(r,b))&(~green);out[...,1]=np.where(spill,np.maximum(r,b),g)
rgba=np.dstack([out.astype(np.uint8),np.where(green,0,255).astype(np.uint8)])
im2=Image.fromarray(rgba,'RGBA');frames=[]
for i,n in enumerate(names):
    cx=int(i%4*cw);cy=int(i//4*ch)
    cell=im2.crop((cx+3,cy+3,int(cx+cw)-3,int(cy+ch)-3));arr=np.array(cell);al=arr[...,3]>0
    lab,nl=ndimage.label(ndimage.binary_closing(al,iterations=2))
    sizes=ndimage.sum(al,lab,range(1,nl+1));keep=1+int(np.argmax(sizes))
    mask=(lab==keep)&al
    # drop thin remnants
    arr[...,3]=np.where(mask,255,0)
    ys,xs=np.where(mask);fr=Image.fromarray(arr).crop((xs.min(),ys.min(),xs.max()+1,ys.max()+1))
    a2=np.array(fr)[...,3];h=a2.shape[0];yy,xx=np.where(a2[int(h*0.4):]>0)
    sm=fr.resize((max(1,round(fr.width*K)),max(1,round(fr.height*K))),Image.LANCZOS)
    frames.append((n,sm,float(xx.mean())*K));print(n,fr.size)
PAD=2;WW=sum(f[1].width+PAD for f in frames)+PAD;HH=max(f[1].height for f in frames)+2*PAD
atlas=Image.new('RGBA',(WW,HH),(0,0,0,0));x=PAD;meta={}
for n,sm,ax in frames:
    atlas.paste(sm,(x,PAD));meta[n]={'x':x,'y':PAD,'w':sm.width,'h':sm.height,'ax':round(ax,1)};x+=sm.width+PAD
atlas.save('atlas_gold.png')
A=np.array(atlas).astype(float)/255;O=A.copy()
for yy in range(A.shape[0]):
    for xx in range(A.shape[1]):
        if A[yy,xx,3]==0: continue
        rr,gg,bb=A[yy,xx,:3];hh,s,v=colorsys.rgb_to_hsv(rr,gg,bb)
        if 0.05<hh<0.2 and s>0.35: hh=0.045;s*=0.62;v=min(1,v*0.92)
        O[yy,xx,:3]=colorsys.hsv_to_rgb(hh,s,v)
Image.fromarray((O*255).astype(np.uint8)).save('atlas_flesh.png')
json.dump(meta,open('meta.json','w'));print(WW,HH)
