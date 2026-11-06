// =====================================================================
// v34 DEATH ANIMATION — how an enemy dies now depends on what killed it and what kind of man he is.
// Layered on top of the old tumble: a short upright "stagger" (hit reaction), then a fall to the ground,
// a thud when he lands, a last twitch, and he ends up lying down. Explosions / acid / specials keep the old behaviour.
//   stg  seconds of stagger before the fall      lean  how far he rocks back (rad)      kb  push along the ground (px/s)
//   hop  tiny upward jolt (px/s)                  fall  how fast he topples after the stagger (rad/s)     sq  knees-buckle squash
//   mom  true = carries his own momentum forward (a charger), not the direction of the hit       thud  heavy landing (dust + shake)
// =====================================================================
const DEATH = {
  soldier: { shot: { stg: .30, lean: .45, kb: 70, hop: 70, fall: 9, sq: .06 }, melee: { stg: .10, lean: .25, kb: 150, hop: 150, fall: 11, sq: 0 }, blade: { stg: .20, lean: .30, kb: 50, hop: 60, fall: 8, sq: .10 } },
  gunner:  { shot: { stg: .36, lean: .40, kb: 55, hop: 50, fall: 8, sq: .10 }, melee: { stg: .12, lean: .25, kb: 140, hop: 140, fall: 10, sq: 0 }, blade: { stg: .24, lean: .30, kb: 45, hop: 50, fall: 7, sq: .12 } },
  shield:  { shot: { stg: .42, lean: .30, kb: 40, hop: 40, fall: 7, sq: .10 }, melee: { stg: .14, lean: .22, kb: 110, hop: 110, fall: 9, sq: 0 }, blade: { stg: .30, lean: .25, kb: 35, hop: 40, fall: 6, sq: .12 } },
  knife:   { shot: { stg: .22, lean: .65, kb: 120, hop: 40, fall: 10, sq: .04, mom: true }, melee: { stg: .08, lean: .40, kb: 170, hop: 120, fall: 12, sq: 0, mom: true }, blade: { stg: .16, lean: .50, kb: 110, hop: 50, fall: 10, sq: .06, mom: true } },
  bomber:  { shot: { stg: .14, lean: .30, kb: 40, hop: 50, fall: 9, sq: .04 }, melee: { stg: .10, lean: .25, kb: 100, hop: 100, fall: 10, sq: 0 }, blade: { stg: .12, lean: .25, kb: 40, hop: 40, fall: 9, sq: .05 } },
  heavy:   { shot: { stg: .26, lean: .14, kb: 22, hop: 25, fall: 3.2, sq: .16, thud: true }, melee: { stg: .26, lean: .12, kb: 30, hop: 25, fall: 3.2, sq: .16, thud: true }, blade: { stg: .26, lean: .12, kb: 25, hop: 25, fall: 3.2, sq: .16, thud: true } }
};
function deathStart(e, dir, cause) {
  if (e.gibbed || e.skel) return;
  const T = DEATH[e.type], P = T && T[cause];
  if (!P) return;                                           // boom / acid / the special enemy types keep the old tumble
  const j = () => 0.85 + Math.random() * 0.3;               // +-15%: no two men fall the same way
  const d = P.mom ? (e.face || 1) : dir;
  e.dy = { stg: P.stg * j(), lean: P.lean * j(), dir: d, fall: P.fall * j(), sq: P.sq, thud: !!P.thud, fell: false };
  e.rot = 0; e.vr = 0; e.vx = d * P.kb * j(); e.vy = -P.hop;
  if (cause === 'shot' && BLOOD) fountain(e.x + e.w / 2, e.y + 10, 0.28, dir);   // exit wound: a short spurt along the shot
}
function deathThud(e) {
  if (e.landed) return; e.landed = true; e.landT = e.deadT;
  const hv = e.type === 'heavy';
  dust(e.x + e.w / 2, e.y + e.h, hv ? 7 : 4, 6, '#8a7a6a');
  audio.play('land', hv ? 0.9 : 0.5);
  if (hv) shake(0.14);
  if (BLOOD) addDecal(e.x + e.w / 2, e.y + e.h, false);
}
function deathRot(e, dt, vy0) {
  const D = e.dy;
  if (!D) { e.rot += e.vr * dt; if (e.onGround && vy0 > 170 && e.deadT > 0.05) e.landT = e.landT != null ? e.landT : e.deadT; return; }
  if (e.deadT < D.stg) { const k = clamp(e.deadT / D.stg, 0, 1); e.rot = D.dir * D.lean * k * k * (3 - 2 * k); e.vr = 0; return; }
  if (!D.fell) { D.fell = true; if (Math.abs(e.vr) < 1) e.vr = D.dir * D.fall; }   // an explosion toss during the stagger wins over the fall
  e.rot += e.vr * dt;
  if (e.onGround && Math.abs(e.vr) < 0.6) e.rot = approach(e.rot, (e.rot < 0 ? -1 : 1) * 1.5708, 4 * dt);   // end up lying down, not at some random angle
  if (!e.landed && ((e.onGround && vy0 > 170) || (e.onGround && Math.abs(e.rot) > 1.2))) deathThud(e);
}
