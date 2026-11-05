# one-time: subset Noto Sans (bold) Devanagari/Tamil/Telugu down to the glyphs in native_names.py -> src/assets/noc-<script>.woff
# needs: npm i @fontsource/noto-sans-{devanagari,tamil,telugu}  (path passed as argv[1]) and fonttools
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from native_names import NATIVE
from fontTools import subset
src = sys.argv[1]; out = os.path.join(os.path.dirname(__file__), '..', 'assets')
NAME = {'deva': 'devanagari', 'taml': 'tamil', 'telu': 'telugu'}
for sc, nm in NAME.items():
    chars = ' '.join(s[1] + s[2] for s in NATIVE.values() if s[0] == sc)
    f = f'{src}/node_modules/@fontsource/noto-sans-{nm}/files/noto-sans-{nm}-{nm}-700-normal.woff'
    o = subset.Options(); o.flavor = 'woff'; o.layout_features = ['*']; o.notdef_outline = True
    font = subset.load_font(f, o); sb = subset.Subsetter(o); sb.populate(text=chars); sb.subset(font)
    subset.save_font(font, os.path.join(out, f'noc-{sc}.woff'), o); print(sc, os.path.getsize(os.path.join(out, f'noc-{sc}.woff')), 'bytes')
