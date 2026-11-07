# v35 build steps — exec'd at the end of build.py (shares its globals: s, rep, ROOT).
import re as _re35, io as _io35, base64 as _b6435
from PIL import Image as _Img35

# ===== v35-1: GUEST STARS (rescued doubles can be locked heroes) =====
guest35_js = open(ROOT + '/modules/guest35.js', encoding='utf-8').read()
rep("\nfunction spawnDovesUI(x, y) {", "\n" + guest35_js + "\nfunction spawnDovesUI(x, y) {")
rep("drawTakesHUD(); if (G.banner)", "drawTakesHUD(); drawGuestHUD(); if (G.banner)")
rep("  drawCages(cam);\n", "  drawCages(cam);\n  drawGuestFx(cam);\n")

# ===== v35-2: legal pass — no real people's names in the shipped hero fields =====
# `was` is never shown; `cn` is shown on the select poster; `th` is hidden in-game but ships in the file.
# Heroes built on a real actor get a role/archetype label instead (same convention the v27+ uncles already use).
# Fictional/folk character references (Fei-hung, Zhang San-feng, Pai Mei, Zatoichi...) are listed in docs/LEGAL_LIST_V35.md for the owner.
_LEGAL = {
    'aamir':   ('THE PERFECT TAKE',   'MR. ONE-MORE-TAKE', 'พี่เทคเดียวผ่าน'),
    'chiru':   ('THE MASS HERO',      'MASS HERO',         'พระเอกมาสซ์'),
    'madong':  ('THE ONE-PUNCH HYUNG','주먹 형',            'ฮยองหมัดเดียว'),
    'michelle':('THE ARSENAL',        '百兵姐',             'เจ๊สารพัดอาวุธ'),
    'oldboy':  ('THE CORRIDOR HAMMER','망치 형',            'ลุงค้อนทางเดิน'),
    'phiphop': ('THE UZI UNCLE',      'UZI + RPG',         'พี่อูซี่'),
    'rajini':  ('THE STYLE BOSS',     'THE STYLE BOSS',    'พี่สไตล์'),
    'ram':     ('THE ROARING ONE',    'BEAST COMMANDER',   'พี่คำราม'),
    'srk':     ('THE ROMANCE KING',   'KING OF ROMANCE',   'ราชาโรแมนซ์'),
    'vijay':   ('THE SOFA COMMANDER', 'SOFA COMMANDER',    'พี่โซฟา'),
}
for _k, (_was, _cn, _th) in _LEGAL.items():
    s, _n = _re35.subn(r"(\b%s: \{ name: '[^']*', was: )'[^']*'(, cn: )'[^']*'(, th: )'[^']*'" % _k, lambda m: m.group(1) + "'%s'" % _was + m.group(2) + "'%s'" % _cn + m.group(3) + "'%s'" % _th, s)
    assert _n == 1, (_k, _n)
for _bad in ("'SHAH RUKH'", "'AAMIR (YOUNG)'", "'KING KHAN'", "'THALAIVA'", "'THALAPATHY'", "'마동석'", "'ชเวมินชิก'", "'รชนีกานต์'", "'ชาห์รุข'", "'ชิรันจีวี'", "'ราม จรัญ'"):
    assert _bad not in s, _bad
print('v35 legal: hero fields cleaned', len(_LEGAL))

# ===== v35-3: size — re-encode embedded JPEG art as WebP; posters downscaled to 462 px wide (still >1.5x their on-screen size at 2x HD) =====
def _webp(raw, w=None, q=80):
    im = _Img35.open(_io35.BytesIO(raw)).convert('RGB')
    if w and im.width > w: im = im.resize((w, round(im.height * w / im.width)), _Img35.LANCZOS)
    b = _io35.BytesIO(); im.save(b, 'WEBP', quality=q, method=6); return b.getvalue()
_before = len(s)
# 1) the poster table (ART_SRC) holds bare base64 JPEGs; the loader adds the data: prefix
_m = _re35.search(r"const ART_SRC = (\{.*?\});\n", s, _re35.S); assert _m
_posters = _json.loads(_m.group(1))
_posters = {k: _b6435.b64encode(_webp(_b6435.b64decode(v), w=462, q=80)).decode() for k, v in _posters.items()}
s = s[:_m.start(1)] + _json.dumps(_posters) + s[_m.end(1):]
rep("im.src = 'data:image/jpeg;base64,' + ART_SRC[k];", "im.src = 'data:image/webp;base64,' + ART_SRC[k];")
# 2) every other embedded JPEG data URI (stage paintings): same resolution, WebP q80
def _sub(m):
    return 'data:image/webp;base64,' + _b6435.b64encode(_webp(_b6435.b64decode(m.group(1)), q=80)).decode()
s, _nj = _re35.subn(r"data:image/jpeg;base64,([A-Za-z0-9+/=]{2000,})", _sub, s)
print('v35 webp: %d stage images + %d posters, %d -> %d bytes' % (_nj, len(_posters), _before, len(s)))
