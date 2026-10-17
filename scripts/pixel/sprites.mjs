// Sprites. Rounded forms (the duck) are shaded from simple primitives
// against one key light so every sprite agrees with the scene lighting;
// hard-surface props are drawn by hand as character grids.

import { sprite } from "./core.mjs";

// Key light: up-left and slightly toward the viewer.
const L = (() => {
  const v = [-0.55, -0.7, 0.45];
  const m = Math.hypot(...v);
  return v.map((c) => c / m);
})();

const DUCK_RAMP = ["#c47a12", "#e3a523", "#f6c936", "#ffe06b", "#fff3b8"];
const BEAK_RAMP = ["#a83c0c", "#dd5f17", "#ff8a30", "#ffb267"];

// Ellipse primitive helpers: depth > 0 inside.
const ell = (cx, cy, rx, ry, ramp, tag) => ({ cx, cy, rx, ry, ramp, tag });
const inside = (p, x, y) => {
  const dx = (x - p.cx) / p.rx, dy = (y - p.cy) / p.ry;
  return 1 - (dx * dx + dy * dy);
};
const shade = (p, x, y, bands) => {
  const nx = (x - p.cx) / p.rx, ny = (y - p.cy) / p.ry;
  const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
  const lum = nx * L[0] + ny * L[1] + nz * L[2];
  const r = p.ramp;
  for (let i = 0; i < bands.length; i++) if (lum > bands[i]) return r[r.length - 1 - i];
  return r[0];
};

const shadeSprite = ({ w, h, prims, bands, outline, extras = {} }) => {
  const grid = Array.from({ length: h }, () => Array(w).fill(null));
  const owner = Array.from({ length: h }, () => Array(w).fill(null));
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    // later primitives win where they overlap (beak over head)
    let best = null;
    for (const p of prims) if (inside(p, x + 0.5, y + 0.5) > 0) best = p;
    if (best) {
      owner[y][x] = best;
      grid[y][x] = shade(best, x + 0.5, y + 0.5, bands);
    }
  }
  // chin shadow: body pixels directly under a head pixel get one step darker
  for (let y = 1; y < h; y++) for (let x = 0; x < w; x++) {
    const above = owner[y - 1][x], here = owner[y][x];
    if (here && above && here.tag === "body" && above.tag === "head") {
      const r = here.ramp;
      const i = Math.max(0, r.indexOf(grid[y][x]) - 1);
      grid[y][x] = r[i];
    }
  }
  for (const [k, c] of Object.entries(extras)) {
    const [x, y] = k.split(",").map(Number);
    grid[y][x] = c;
  }
  // outline: transparent pixels touching the shape (4-neighbourhood)
  const out = grid.map((r) => r.slice());
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (grid[y][x]) continue;
    const n = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => grid[y + dy]?.[x + dx]);
    if (n) out[y][x] = outline;
  }
  return out;
};

// The duck: sitting, facing right. 16 x 16.
export const duck = () =>
  shadeSprite({
    w: 16,
    h: 16,
    bands: [0.82, 0.55, 0.22, -0.1],
    outline: "#2a1a05",
    prims: [
      ell(7.6, 11.1, 6.4, 3.5, DUCK_RAMP, "body"),
      ell(2.4, 8.4, 1.6, 2.1, DUCK_RAMP, "body"),
      ell(10.3, 5.2, 3.5, 3.5, DUCK_RAMP, "head"),
      ell(14.0, 6.6, 1.9, 1.05, BEAK_RAMP, "beak"),
    ],
    extras: { "11,4": "#1a1420", "11,5": "#1a1420", "12,4": "#fffbe8" },
  });

// Larger duck for the logo and favicon. 24 x 22.
export const duckLarge = () =>
  shadeSprite({
    w: 24,
    h: 22,
    bands: [0.84, 0.58, 0.26, -0.06],
    outline: "#2a1a05",
    prims: [
      ell(11.2, 15.4, 9.6, 5.2, DUCK_RAMP, "body"),
      ell(3.2, 11.6, 2.3, 3.0, DUCK_RAMP, "body"),
      ell(15.2, 7.4, 5.2, 5.1, DUCK_RAMP, "head"),
      ell(20.8, 9.4, 2.9, 1.5, BEAK_RAMP, "beak"),
    ],
    extras: {
      "16,5": "#1a1420", "16,6": "#1a1420", "17,5": "#1a1420", "17,6": "#1a1420",
      "17,5": "#fffbe8",
      "19,10": "#a83c0c", "20,10": "#a83c0c", "21,10": "#a83c0c",
    },
  });

// Hand-drawn props -----------------------------------------------------

const METAL = { K: "#1e1f24", M: "#3d4048", F: "#636874", H: "#8b909b" };
const GLOW = { G: "#f59e2c", Y: "#ffcf6e", W: "#fff3cf" };

export const LANTERN_EMISSIVE = new Set(["#f59e2c", "#ffcf6e", "#fff3cf"]);

export const lantern = () =>
  sprite(
    `
.......KK.......
......K..K......
.......KK.......
......KHHK......
.....KFMMMK.....
....KFHHHHMK....
....KGYYYYGK....
....KYWWWWYK....
....KYWWWWYK....
....KGYYYYGK....
....KFMMMMMK....
.....KKKKKK.....
................
................
................
................`,
    { ...METAL, ...GLOW }
  );

export const chain = () =>
  sprite(
    `
.......KK.......
......KH.K......
......KM.K......
.......KK.......
.......FM.......
.......KK.......
......KH.K......
......KM.K......
.......KK.......
.......FM.......
.......KK.......
......KH.K......
......KM.K......
.......KK.......
.......FM.......
.......KK.......`,
    METAL
  );

const WOOD = { a: "#bb8b4f", b: "#a77840", c: "#916635", d: "#7b552c", e: "#634221", f: "#4a3119", k: "#2a1b0d" };

// Writing desk with an open report book and a quill.
export const desk = () =>
  sprite(
    `
...........qp...
..........qp....
...pppkppp.p....
..pllpklllp.....
aaaaaaaaaaaaaaaa
bbbbbbbbbbbbbbbb
ffffffffffffffff
.cd..........cd.
.cd..........cd.
.cd..........cd.
.cd..........cd.
.cd..........cd.
.cd..........cd.
.cd..........cd.
.cd..........cd.
.ee..........ee.`,
    { ...WOOD, p: "#efe6d2", l: "#b8ae99", q: "#f2f2f2" }
  );

export const chest = () =>
  sprite(
    `
................
................
.kkkkkkkkkkkkkk.
.kaaaaaaaaaaaak.
.kbbbbbbbbbbbbk.
.kcccccccccccck.
.kddddddddddddk.
.kkkkkkGGkkkkkk.
.kbbbbbgGbbbbbk.
.kcccccccccccck.
.kcdccccccccdck.
.kcccccccccccck.
.kddddddddddddk.
.kddddddddddddk.
.keeeeeeeeeeeek.
.kkkkkkkkkkkkkk.`,
    { ...WOOD, G: "#f2c84b", g: "#a8821f" }
  );

export const bookshelf = () =>
  sprite(
    `
aaaaaaaaaaaaaaaa
bccccccccccccccf
fRrBbf.GgYyf.Pp.
fRrBbfOGgYyfNPpf
fRrBbfOGgYyfNPpf
fRrBbfOGgYyfNPpf
ffffffffffffffff
bccccccccccccccf
fYy.Pp.RrfGgBbBf
fYyOPpNRrfGgBbBf
fYyOPpNRrfGgBbBf
fYyOPpNRrfGgBbBf
fYyOPpNRrfGgBbBf
ffffffffffffffff
aaaaaaaaaaaaaaaa
eeeeeeeeeeeeeeee`,
    {
      ...WOOD,
      R: "#b8402f", r: "#7e2a1f",
      B: "#3f62b0", b: "#2a427a",
      G: "#4f8d3c", g: "#33602a",
      Y: "#d9a53a", y: "#9c7424",
      P: "#8a4fa8", p: "#5c3373",
      O: "#d97a3a", N: "#c7bfa9",
    }
  );

export const ladder = () =>
  sprite(
    `
..cd........cd..
..cd........cd..
..cdaaaaaaaaad..
..cdeeeeeeeeed..
..cd........cd..
..cd........cd..
..cd........cd..
..cdaaaaaaaaad..
..cdeeeeeeeeed..
..cd........cd..
..cd........cd..
..cd........cd..
..cdaaaaaaaaad..
..cdeeeeeeeeed..
..cd........cd..
..cd........cd..`,
    WOOD
  );

export const TORCH_EMISSIVE = new Set(["#fff1b0", "#ffc04a", "#ff8a1f"]);
export const torch = () =>
  sprite(
    `
................
................
................
................
.......f........
......fyf.......
......yWy.......
......oyo.......
.......cd.......
.......cd.......
.......cd.......
.......cd.......
.......cd.......
.......cd.......
.......ed.......
.......ee.......`,
    { ...WOOD, W: "#fff1b0", y: "#ffc04a", o: "#ff8a1f", f: "#ff8a1f" }
  );

// Wooden bath barrel (a nod to Hot Bath), water surface emits a soft light.
export const BATH_EMISSIVE = new Set(["#7fd3e6", "#b9eef7"]);
export const bathBarrel = () =>
  sprite(
    `
................
................
................
..kkkkkkkkkkkk..
..kwWwwWwwwWwk..
.kaaaaaaaaaaaak.
.kcbdcbdcbdcbdk.
.kHHHHHHHHHHHHk.
.kcbdcbdcbdcbdk.
.kcbdcbdcbdcbdk.
.kcbdcbdcbdcbdk.
.kcbdcbdcbdcbdk.
.kHHHHHHHHHHHHk.
.kcbdcbdcbdcbdk.
.keeeeeeeeeeeek.
..kkkkkkkkkkkk..`,
    { ...WOOD, w: "#7fd3e6", W: "#b9eef7", H: "#5b5f68" }
  );

export const poppy = () =>
  sprite(
    `
................
................
................
................
................
................
......rR........
.....rRRr.......
......rr........
.......g........
.......g.l......
.......gl.......
......lg........
.......g........
.......g........
.......g........`,
    { r: "#a82a1f", R: "#e0432f", g: "#3c7428", l: "#4c8c31" }
  );

export const dandelion = () =>
  sprite(
    `
................
................
................
................
................
................
................
................
.........yY.....
........yYY.....
.........y......
.........g......
........lg......
.........g......
.........g......
.........g......`,
    { y: "#d9a53a", Y: "#ffd84a", g: "#3c7428", l: "#4c8c31" }
  );

export const tallGrass = () =>
  sprite(
    `
................
................
................
................
................
................
................
................
................
.....l.....l....
..l..g..l..g..l.
..g.lg..g.lg..g.
.lg.gg.lg.gg.lg.
.gglgg.ggggglgg.
lgggggggggggggg.
gggggggggggggggg`,
    { g: "#2f5c20", l: "#4c8c31" }
  );

// Cork board with pinned report slips, hung on the workshop wall.
export const bugBoard = () =>
  sprite(
    `
................
................
.kkkkkkkkkkkkkk.
.kaaaaaaaaaaaak.
.kcCCcCCCCcCCdk.
.kcWWwcCYYycCdk.
.kcWwwcCYyycCdk.
.kcWwwCcCCCCCdk.
.kcCCCCCWWwCCdk.
.kcPPpcCWwwCCdk.
.kcPppcCWwwcCdk.
.kcCCCCCCCCCCdk.
.keeeeeeeeeeeek.
.kkkkkkkkkkkkkk.
................
................`,
    { ...WOOD, C: "#b98a5b", W: "#efe8d8", w: "#cfc6b2", Y: "#f3d86b", y: "#cdb24c", P: "#e7a0b0", p: "#c27a8c" }
  );

// Sky decorations, used by CSS rather than baked into the ground image.
export const moon = () =>
  sprite(
    `
....aaaaaaaa....
...aabbbbbbaa...
..abbbbcbbbbba..
.abbccbbbbbbbba.
.abbccbbbbbbbba.
.abbbbbbbbccbba.
.abbbbbbbbccbba.
.abbbbcbbbbbbba.
.abbbbbbbbbbbba.
.abbccbbbbbbbba.
.abbccbbbbbcbba.
.abbbbbbbbbbbba.
..abbbbbbbbbba..
...aabbbbbbaa...
....aaaaaaaa....
................`,
    { a: "#b9c4d6", b: "#e8edf5", c: "#c7d0de" }
  );
