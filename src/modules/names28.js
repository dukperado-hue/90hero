// ===== v28: every hero is an Uncle / Auntie; Thai labels hidden; native-script lines for the Indian heroes ====
// Names are parody-only English that people of that country recognise (local kin words / local things: -JI, MAAMA, MAMA, AJEOSSI, OJISAN, DAYI, OM, CO-BA ...).
const NATIVE = /*NATIVE_JSON*/;                       // key -> [script, full line, big ghost word]   (hi = deva · ta = taml · te = telu)
const NEW_NAMES = {                                   // key -> [in-game name, short card name]
  sombat: ['UNCLE LUCKY-SHOT', 'U.LUCKY'], sorapong: ['UNCLE WAI-KHRU', 'U.WAIKHRU'],
  chiru: ['UNCLE MAMA-GARU', 'U.MAMA'], zhang: ['UNCLE TAI-CHI', 'U.TAICHI'], vijay: ['UNCLE SOFA-MAAMA', 'U.SOFA'], ram: ['UNCLE PULI-MAMA', 'U.PULI'],
  singham: ['UNCLE THAPPAD-JI', 'U.THAPPAD'], srk: ['UNCLE NACH-JI', 'U.NACH'], rajini: ['UNCLE STYLE-MAAMA', 'U.STYLE'], aamir: ['UNCLE AKHADA-JI', 'U.AKHADA'],
  madong: ['UNCLE AJEOSSI FIST', 'U.FIST'], oldboy: ['UNCLE AJEOSSI HAMMER', 'U.HAMMER'], lady: ['AUNTIE HAN', 'A.HAN'],
  ichi: ['UNCLE BLIND OJISAN', 'U.BLIND'], ogami: ['UNCLE BABY-CART OJISAN', 'U.CART'],
  furie: ['AUNTIE CO-BA', 'A.CO-BA'], bey: ['UNCLE THUNDER-DAYI', 'U.DAYI'], gada: ['UNCLE GADA-JI', 'U.GADA'], silat: ['UNCLE OM SILAT', 'U.SILAT'], pob: ['AUNTIE POB', 'A.POB'], ajumma: ['AUNTIE AJUMMA', 'A.AJUMMA']
};
for (const k in NEW_NAMES) { CHARS[k].name = NEW_NAMES[k][0]; CHARS[k].card = NEW_NAMES[k][1]; }
for (const k of CHAR_KEYS) { CHARS[k].thHidden = CHARS[k].th; CHARS[k].th = ''; }          // Thai labels are kept as data only, never drawn
const SHOW_TH = false;
function nativeTxt(sc, s, x, y, col, size, align, alpha) {
  ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha; ctx.font = 'bold ' + size + 'px "NOC-' + sc + '", sans-serif'; ctx.textAlign = align || 'center'; ctx.textBaseline = 'top';
  if (alpha == null) { ctx.fillStyle = '#000'; ctx.fillText(s, x + 1, y + 1); }
  ctx.fillStyle = col; ctx.fillText(s, x, y); ctx.restore();
}
try { for (const k in NATIVE) document.fonts.load('bold 12px "NOC-' + NATIVE[k][0] + '"', NATIVE[k][1]); } catch (e) { }

// Gemini-painted key art (original characters, no text in the images); drawn full-bleed on the select poster, the game adds name/stats on top.
const ART_SRC = /*ART_JSON*/;
const ART = {}; for (const k in ART_SRC) { const im = new Image(); im.src = 'data:image/jpeg;base64,' + ART_SRC[k]; ART[k] = im; }
function artReady(k) { const a = ART[k]; return !!a && a.complete && a.naturalWidth > 0; }
function drawArtPoster(k, x, y, w) {
  const a = ART[k], h = a.naturalHeight * w / a.naturalWidth, off = -(h - PN.h) * 0.16, sm = ctx.imageSmoothingEnabled;
  ctx.imageSmoothingEnabled = true; ctx.drawImage(a, x, y + off, w, h); ctx.imageSmoothingEnabled = sm;
}
