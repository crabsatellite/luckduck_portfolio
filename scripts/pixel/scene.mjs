// The hero ground: a cross-section of a night-time world with the
// tester's underground workshop. Lighting follows the light-level model
// of blocky survival games: every source has a level 0-15 that drops by
// one per block it travels, and solid rock swallows it quickly. Levels
// are interpolated per pixel and then snapped back to whole levels,
// which produces the stepped falloff rings instead of a smooth blur.
//
// Above-ground cells are left transparent so the page's CSS sky shows
// through. The result is an illustration, not a game capture.

import { Img, hex, hash2, mulberry32, clamp, BAYER4, tileToImg } from "./core.mjs";
import * as T from "./textures.mjs";
import * as S from "./sprites.mjs";

export const COLS = 100;
export const ROWS = 17;
const B = 16;

// ---- block registry ---------------------------------------------------

const VARIANTS = 4;
const tex = new Map();
const variantsOf = (name, make) => {
  if (!tex.has(name)) tex.set(name, Array.from({ length: VARIANTS }, (_, i) => make(i)));
  return tex.get(name);
};

const stoneV = (i) => T.stone(101 + i * 7);
const deepV = (i) => T.deepslate(201 + i * 7);
const BLOCKS = {
  stone: { solid: true, make: stoneV },
  deepslate: { solid: true, make: deepV },
  dirt: { solid: true, make: (i) => T.dirt(301 + i * 7) },
  grass: { solid: true, make: (i) => T.grassSide(401 + i * 7) },
  planks: { solid: true, make: (i) => T.planks(501 + i * 7) },
  cobble: { solid: true, make: (i) => T.cobble(601 + i * 7) },
  bedrock: { solid: true, make: (i) => T.bedrock(701 + i * 7) },
  log: { solid: true, make: (i) => T.bark(801 + i * 7) },
  leaves: { solid: false, leafy: true, make: (i) => T.leaves(901 + i * 7) },
  lava: { solid: true, emissive: true, make: (i) => T.lava(1001 + i * 7) },
  coal: { solid: true, make: (i) => T.ore(1101 + i, stoneV(i), "coal") },
  iron: { solid: true, make: (i) => T.ore(1201 + i, stoneV(i), "iron") },
  copper: { solid: true, make: (i) => T.ore(1301 + i, stoneV(i), "copper") },
  gold: { solid: true, make: (i) => T.ore(1401 + i, stoneV(i), "gold") },
  redstone: { solid: true, make: (i) => T.ore(1501 + i, stoneV(i), "redstone") },
  diamond: { solid: true, make: (i) => T.ore(1601 + i, deepV(i), "diamond") },
  deepGold: { solid: true, make: (i) => T.ore(1701 + i, deepV(i), "gold") },
  deepRedstone: { solid: true, make: (i) => T.ore(1801 + i, deepV(i), "redstone") },
  bookshelf: { solid: true, make: () => S.bookshelf() },
};

const WALLS = {
  stone: (i) => T.darken(stoneV(i), 0.5),
  deepslate: (i) => T.darken(deepV(i), 0.55),
  dirt: (i) => T.darken(T.dirt(301 + i * 7), 0.5),
  boards: (i) => T.darken(T.transpose(T.planks(541 + i * 7)), 0.5),
};

const PROPS = {
  ladder: S.ladder(),
  lantern: S.lantern(),
  chain: S.chain(),
  torch: S.torch(),
  desk: S.desk(),
  chest: S.chest(),
  bath: S.bathBarrel(),
  duck: S.duck(),
  poppy: S.poppy(),
  dandelion: S.dandelion(),
  grass: S.tallGrass(),
  board: S.bugBoard(),
};
const EMISSIVE = new Set([...S.LANTERN_EMISSIVE, ...S.TORCH_EMISSIVE, ...S.BATH_EMISSIVE]);

// ---- world layout -----------------------------------------------------
// Rows are counted from the top of the image. The ground line sits at
// row GL; the two hills rise one block above it.

const GL = 5;

export const buildWorld = () => {
  const fg = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  const bg = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  const prop = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  const sources = []; // { c, r, level, channel }

  const surface = Array.from({ length: COLS }, (_, c) => {
    if (c >= 8 && c <= 18) return GL - 1;
    if (c >= 84 && c <= 94) return GL - 1;
    if (c >= 21 && c <= 26) return GL + 1;
    return GL;
  });
  const deepTop = Array.from({ length: COLS }, (_, c) => GL + 8 + (hash2(c, 3, 9) < 0.45 ? 1 : 0));

  for (let c = 0; c < COLS; c++) {
    const s = surface[c];
    for (let r = s; r < ROWS; r++) {
      let t;
      if (r === s) t = "grass";
      else if (r <= s + 2) t = "dirt";
      else if (r < deepTop[c]) t = "stone";
      else t = "deepslate";
      if (r === ROWS - 1) t = "bedrock";
      if (r === ROWS - 2 && hash2(c, r, 4) < 0.35) t = "bedrock";
      fg[r][c] = t;
      bg[r][c] = t === "grass" || t === "dirt" ? "dirt" : t === "deepslate" || t === "bedrock" ? "deepslate" : "stone";
    }
  }

  // scattered ores in rock
  for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) {
    const t = fg[r][c];
    const roll = hash2(c, r, 77);
    if (t === "stone" && roll < 0.07) {
      const k = hash2(c, r, 78);
      fg[r][c] = k < 0.38 ? "coal" : k < 0.66 ? "iron" : k < 0.78 ? "copper" : k < 0.9 ? "gold" : "redstone";
    }
    if (t === "deepslate" && roll < 0.08) {
      const k = hash2(c, r, 79);
      fg[r][c] = k < 0.35 ? "diamond" : k < 0.65 ? "deepRedstone" : "deepGold";
    }
  }

  const carve = (c, r, wall) => {
    fg[r][c] = null;
    if (wall) bg[r][c] = wall;
  };

  // --- the workshop -----------------------------------------------------
  const R0 = 44, R1 = 56; // side walls
  const CEIL = GL + 3, FLOOR = GL + 7; // air rows are CEIL+1 .. FLOOR-1
  for (let c = R0; c <= R1; c++) {
    fg[CEIL][c] = c === R0 || c === R1 ? "cobble" : "planks";
    fg[FLOOR][c] = c === R0 || c === R1 ? "cobble" : "planks";
    for (let r = CEIL + 1; r < FLOOR; r++) {
      if (c === R0 || c === R1) fg[r][c] = "cobble";
      else carve(c, r, "boards");
    }
  }
  const TOP = CEIL + 1, MID = CEIL + 2, LOW = FLOOR - 1;

  // ladder shaft from the surface into the room
  const SH = 46;
  for (let r = surface[SH]; r <= LOW; r++) {
    if (r <= CEIL) carve(SH, r, r <= surface[SH] + 2 ? "dirt" : "stone");
    prop[r][SH] = "ladder";
  }
  bg[surface[SH]][SH] = null; // open to the sky at the grass line
  prop[GL - 1][48] = "torch";
  sources.push({ c: 48, r: GL - 1, level: 13, channel: "warm" });

  prop[LOW][48] = "bath";
  prop[TOP][50] = "lantern";
  sources.push({ c: 50, r: TOP, level: 15, channel: "warm" });
  prop[LOW][51] = "duck";
  prop[LOW][52] = "desk";
  prop[MID][53] = "board";
  prop[LOW][54] = "chest";
  fg[MID][55] = "bookshelf";
  fg[LOW][55] = "bookshelf";
  // ore glints just outside the walls
  fg[MID][57] = "gold";
  fg[FLOOR + 1][49] = "iron";

  // --- trees --------------------------------------------------------------
  const tree = (c) => {
    const s = surface[c];
    const leaf = (cc, rr) => {
      if (rr >= 0 && cc >= 0 && cc < COLS && !fg[rr][cc]) fg[rr][cc] = "leaves";
    };
    for (let r = s - 4; r < s; r++) if (r >= 0) fg[r][c] = "log";
    for (let dc = -2; dc <= 2; dc++) { leaf(c + dc, s - 3); leaf(c + dc, s - 4); }
    for (let dc = -1; dc <= 1; dc++) leaf(c + dc, s - 5);
  };
  [5, 24, 39, 62, 89].forEach(tree);

  // --- surface plants -----------------------------------------------------
  for (let c = 0; c < COLS; c++) {
    const r = surface[c] - 1;
    if (r < 0 || fg[r][c] || prop[r][c] || c === SH) continue;
    const k = hash2(c, 1, 55);
    if (k < 0.24) prop[r][c] = "grass";
    else if (k < 0.29) prop[r][c] = "poppy";
    else if (k < 0.33) prop[r][c] = "dandelion";
  }

  // --- caves ----------------------------------------------------------------
  const cave = (cx, cy, rx, ry, seed) => {
    for (let r = 0; r < ROWS - 1; r++) for (let c = 0; c < COLS; c++) {
      const dx = (c - cx) / rx, dy = (r - cy) / ry;
      const wobble = (hash2(c, r, seed) - 0.5) * 0.5;
      if (dx * dx + dy * dy + wobble < 1 && r > surface[c] + 2) carve(c, r, bg[r][c] || "stone");
    }
  };
  cave(30, GL + 5.6, 4.6, 1.5, 31);
  prop[GL + 6][29] = "torch";
  sources.push({ c: 29, r: GL + 6, level: 13, channel: "warm" });
  cave(14, GL + 7.5, 3.2, 1.2, 32);
  prop[GL + 8][15] = "torch";
  sources.push({ c: 15, r: GL + 8, level: 12, channel: "warm" });

  // right cave with a lava pool
  cave(68, GL + 8, 7.5, 2.2, 33);
  for (let c = 62; c <= 74; c++) {
    const r = GL + 9;
    if (!fg[r][c]) {
      fg[r][c] = "lava";
      sources.push({ c, r, level: 15, channel: "lava" });
    }
  }
  fg[GL + 7][76] = "diamond";
  fg[GL + 10][60] = "diamond";
  fg[GL + 6][65] = "redstone";
  cave(86, GL + 6, 3.5, 1.3, 34);
  prop[GL + 6][86] = "torch";
  sources.push({ c: 86, r: GL + 6, level: 12, channel: "warm" });

  return { cols: COLS, rows: ROWS, fg, bg, prop, surface, sources };
};

// ---- light propagation -----------------------------------------------

const isSolid = (t) => t && BLOCKS[t]?.solid && t !== "lava";

const propagate = (world, seeds) => {
  const { fg, cols, rows } = world;
  const level = Array.from({ length: rows }, () => Array(cols).fill(0));
  const buckets = Array.from({ length: 16 }, () => []);
  for (const s of seeds) {
    if (s.level > level[s.r][s.c]) {
      level[s.r][s.c] = s.level;
      buckets[s.level].push([s.c, s.r]);
    }
  }
  for (let l = 15; l > 0; l--) {
    for (const [c, r] of buckets[l]) {
      if (level[r][c] !== l) continue;
      const fromSolid = isSolid(fg[r][c]);
      for (const [dc, dr] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nc = c + dc, nr = r + dr;
        if (nc < 0 || nr < 0 || nc >= cols || nr >= rows) continue;
        const t = fg[nr][nc];
        let cost = 1;
        if (isSolid(t)) cost = fromSolid ? 5 : 3;
        else if (t && BLOCKS[t]?.leafy) cost = 2;
        const nl = l - cost;
        if (nl > level[nr][nc]) {
          level[nr][nc] = nl;
          buckets[Math.max(nl, 0)].push([nc, nr]);
        }
      }
    }
  }
  return level;
};

export const computeLight = (world) => {
  const sky = [];
  for (let c = 0; c < world.cols; c++) for (let r = 0; r < world.surface[c]; r++) {
    if (!isSolid(world.fg[r][c])) sky.push({ c, r, level: 15 });
  }
  const by = (ch) => world.sources.filter((s) => s.channel === ch);
  return {
    sky: propagate(world, sky),
    warm: propagate(world, by("warm")),
    lava: propagate(world, by("lava")),
  };
};

// ---- rendering -----------------------------------------------------------

const CHANNELS = {
  sky: { color: [0.55, 0.66, 1.0], gain: 0.72 },
  warm: { color: [1.0, 0.76, 0.46], gain: 1.75 },
  lava: { color: [1.0, 0.45, 0.18], gain: 1.5 },
};
const AMBIENT = [0.085, 0.09, 0.115];

const sampleLevel = (field, x, y, wrapX) => {
  // field values live at cell centres
  const rows = field.length, cols = field[0].length;
  const gx = x / B - 0.5, gy = y / B - 0.5;
  const x0 = Math.floor(gx), y0 = Math.floor(gy);
  const tx = gx - x0, ty = gy - y0;
  const cx = (c) => (wrapX ? ((c % cols) + cols) % cols : clamp(c, 0, cols - 1));
  const at = (c, r) => field[clamp(r, 0, rows - 1)][cx(c)];
  const a = at(x0, y0) + (at(x0 + 1, y0) - at(x0, y0)) * tx;
  const b = at(x0, y0 + 1) + (at(x0 + 1, y0 + 1) - at(x0, y0 + 1)) * tx;
  return a + (b - a) * ty;
};

const brightness = (l) => Math.pow(clamp(l, 0, 15) / 15, 1.7);

export const renderGround = (world, light, { fade = 28, wrapX = false } = {}) => {
  const { cols, rows } = world;
  const img = new Img(cols * B, rows * B);
  const solidAt = (x, y) => {
    const c = Math.floor(x / B), r = Math.floor(y / B);
    if (c < 0 || r < 0 || c >= cols || r >= rows) return false;
    return isSolid(world.fg[r][c]);
  };
  const lightAt = (x, y) => {
    const m = [...AMBIENT];
    for (const [k, ch] of Object.entries(CHANNELS)) {
      // snap the interpolated level back to a whole light level
      const q = Math.round(sampleLevel(light[k], x + 0.5, y + 0.5, wrapX));
      const b = brightness(q) * ch.gain;
      for (let i = 0; i < 3; i++) m[i] += ch.color[i] * b;
    }
    return m;
  };
  const lit = (rgb, m) => rgb.map((v, i) => clamp(Math.round(v * m[i]), 0, 255));

  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const t = world.fg[r][c];
    const v = Math.floor(hash2(c, r, 5) * VARIANTS);
    const def = t ? BLOCKS[t] : null;
    const fgTile = def ? variantsOf(t, def.make)[v] : null;
    const bgName = world.bg[r][c];
    const bgTile = bgName ? variantsOf("wall:" + bgName, WALLS[bgName])[v] : null;
    const pTile = world.prop[r][c] ? PROPS[world.prop[r][c]] : null;

    for (let py = 0; py < B; py++) for (let px = 0; px < B; px++) {
      const X = c * B + px, Y = r * B + py;
      const m = lightAt(X, Y);
      if (fgTile && fgTile[py][px] && !def.leafy) {
        const col = hex(fgTile[py][px]);
        img.set(X, Y, def.emissive ? col : lit(col, m));
        continue;
      }
      if (bgTile) {
        let shade = 1;
        if (solidAt(X - 3, Y - 3) && !solidAt(X, Y)) shade = 0.5;
        else if (solidAt(X - 1, Y - 1) && !solidAt(X, Y)) shade = 0.62;
        const col = hex(bgTile[py][px]).map((x) => x * shade);
        img.set(X, Y, lit(col, m));
      }
      if (fgTile && fgTile[py][px] && def.leafy) img.set(X, Y, lit(hex(fgTile[py][px]), m));
      if (pTile && pTile[py][px]) {
        const cstr = pTile[py][px];
        img.set(X, Y, EMISSIVE.has(cstr) ? hex(cstr) : lit(hex(cstr), m.map((x) => x * 1.08)));
      }
    }
  }

  // steam rising from the bath barrel (soft, translucent pixels)
  const steam = mulberry32(48);
  const bathRow = world.prop.findIndex((row) => row[48] === "bath");
  const sx = 48 * B + 8, sy = bathRow * B + 3;
  for (let i = 0; bathRow >= 0 && i < 46; i++) {
    const h = Math.floor(steam() * 30);
    const x = sx + Math.round(Math.sin(h / 4 + (i % 3) * 2.1) * 3 + (steam() - 0.5) * 4);
    img.blend(x, sy - h, [240, 246, 248], 0.22 + 0.4 * (1 - h / 30));
  }

  // Halos: hard-edged rings of warm light around the hanging lantern and
  // torches, so each source reads at a glance without any blur.
  for (const src of world.sources) {
    if (src.channel !== "warm") continue;
    const p = world.prop[src.r][src.c];
    const cx = src.c * B + 8, cy = src.r * B + (p === "lantern" ? 8 : 6);
    const rings = p === "lantern" ? [[7, 0.2], [12, 0.11], [18, 0.05]] : [[4, 0.16], [8, 0.07]];
    for (let y = cy - 20; y <= cy + 20; y++) for (let x = cx - 20; x <= cx + 20; x++) {
      const d = Math.hypot(x - cx, y - cy);
      let a = 0;
      for (const [rad, al] of rings) if (d <= rad) a += al;
      if (a > 0) {
        const px = img.get(x, y);
        if (px && px[3] > 0) img.set(x, y, [px[0] + 255 * a, px[1] + 190 * a, px[2] + 110 * a], px[3]);
      }
    }
  }

  // dithered fade into the page at the very bottom
  for (let y = img.h - fade; y < img.h; y++) {
    const t = (y - (img.h - fade)) / fade;
    for (let x = 0; x < img.w; x++) {
      if (BAYER4[y & 3][x & 3] < t) img.set(x, y, [0, 0, 0], 0);
    }
  }
  return img;
};

// A narrow strip of moonlit ground (plants, grass, dirt, stone) that
// tiles horizontally. Used along the bottom edge of inner page headers.
export const buildEdge = (cols = 12) => {
  const rows = 4;
  const fg = Array.from({ length: rows }, () => Array(cols).fill(null));
  const bg = Array.from({ length: rows }, () => Array(cols).fill(null));
  const prop = Array.from({ length: rows }, () => Array(cols).fill(null));
  for (let c = 0; c < cols; c++) {
    fg[1][c] = "grass";
    fg[2][c] = "dirt";
    fg[3][c] = hash2(c, 3, 61) < 0.5 ? "dirt" : "stone";
    const k = hash2(c, 0, 62);
    prop[0][c] = k < 0.4 ? "grass" : k < 0.5 ? "poppy" : k < 0.58 ? "dandelion" : null;
  }
  return { cols, rows, fg, bg, prop, surface: Array(cols).fill(1), sources: [] };
};

export const renderTile = (name) => tileToImg(PROPS[name] ?? variantsOf(name, BLOCKS[name].make)[0]);
