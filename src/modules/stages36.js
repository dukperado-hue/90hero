// v36 glue for the new stages: zombies arrive by rising out of the ground (not by parachute); on the tall Taiwan map
// parachuters start just above the camera instead of at the top of the world.
const _dropIn36 = dropIn;
dropIn = function (type, tx, form) {
  if (ZTYPES.has(type)) { const e = spawnZomb(type, tx, true); if (e) e.alerted = true; return; }
  const n = G.enemies.length; _dropIn36(type, tx, form);
  if (STAGE === 9 || (STAGE === 7 && G.player && G.player.y > 19 * TS)) for (let i = n; i < G.enemies.length; i++) { const e = G.enemies[i]; e.y = Math.max(e.y, G.cam.y - 30 - rnd(0, 30)); }
};
// no cracked-brick stash rooms on the zombie stage (they read as random brick huts on the platform / in the school)
const _carveStashes36 = carveStashes;
carveStashes = function () { if (STAGE === 8) { STASH.tiles = new Set(); return; } return _carveStashes36.apply(this, arguments); };
