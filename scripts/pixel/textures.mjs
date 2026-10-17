// Original 16x16 block textures, generated from small colour ramps.
// They follow the conventions of blocky survival games (16 px faces,
// embossed clusters, top-left key light) without copying any game's art.

import { mulberry32, clamp } from "./core.mjs";

export const RAMPS = {
  stone: ["#3b3d42", "#53565c", "#686b71", "#7c7f85", "#8f9298", "#a6a9ae"],
  deepslate: ["#1c1e23", "#272a30", "#33363d", "#41444c", "#50535b", "#61646c"],
  dirt: ["#3e2819", "#523522", "#68452d", "#7d573a", "#936a49", "#a87e5a"],
  grass: ["#24461a", "#2f5c20", "#3c7428", "#4c8c31", "#61a33d", "#7bbb4f"],
  planks: ["#4a3119", "#634221", "#7b552c", "#916635", "#a77840", "#bb8b4f"],
  bark: ["#2c1f12", "#3d2c1a", "#4f3a22", "#624a2d", "#755a38"],
  leaves: ["#173512", "#204718", "#2b5c1f", "#377228", "#448632"],
  bedrock: ["#111113", "#232326", "#38383c", "#525257", "#707076"],
  lava: ["#9a2508", "#cf4510", "#f06e18", "#ff9d2a", "#ffcc4a", "#fff28c"],
  cobble: ["#323439", "#474a50", "#5d6066", "#73767c", "#898c92", "#a0a3a8"],
};

export const ORES = {
  coal: ["#141416", "#232326", "#38383c"],
  iron: ["#8f6c55", "#c49c7e", "#e6c7aa"],
  gold: ["#b98a16", "#f0c835", "#fff3a0"],
  diamond: ["#1f9e95", "#46dccf", "#b4fff6"],
  redstone: ["#7e110c", "#c8261b", "#ff5a43"],
  copper: ["#8c4a2a", "#c66f3d", "#79b897"],
};

const N = 16;
const wrap = (v) => ((v % N) + N) % N;
const grid = (fill) => Array.from({ length: N }, () => Array(N).fill(fill));

// Tileable value noise on a period-p lattice.
const tileNoise = (rng, period) => {
  const lat = Array.from({ length: period }, () => Array.from({ length: period }, () => rng()));
  const s = N / period;
  const smooth = (t) => t * t * (3 - 2 * t);
  return (x, y) => {
    const gx = x / s, gy = y / s;
    const x0 = Math.floor(gx), y0 = Math.floor(gy);
    const tx = smooth(gx - x0), ty = smooth(gy - y0);
    const L = (i, j) => lat[((j % period) + period) % period][((i % period) + period) % period];
    const a = L(x0, y0) + (L(x0 + 1, y0) - L(x0, y0)) * tx;
    const b = L(x0, y0 + 1) + (L(x0 + 1, y0 + 1) - L(x0, y0 + 1)) * tx;
    return a + (b - a) * ty;
  };
};

// Compact blob grown from a seed cell (Eden growth), wrapping at the edge.
const blob = (rng, size, cx, cy) => {
  const set = new Set([`${cx},${cy}`]);
  const cells = [[cx, cy]];
  let guard = 0;
  while (set.size < size && guard++ < 400) {
    const [x, y] = cells[Math.floor(rng() * cells.length)];
    const d = Math.floor(rng() * 4);
    const nx = wrap(x + [1, -1, 0, 0][d]), ny = wrap(y + [0, 0, 1, -1][d]);
    const key = `${nx},${ny}`;
    if (!set.has(key)) {
      set.add(key);
      cells.push([nx, ny]);
    }
  }
  return set;
};

// Embossed clusters: raised clusters get a light top-left rim and cast
// a dark rim to the bottom-right; recessed clusters do the opposite.
const emboss = (idx, rng, { count, min, max, raise = 0.5, levels }) => {
  const top = levels - 1;
  for (let k = 0; k < count; k++) {
    const size = min + Math.floor(rng() * (max - min + 1));
    const set = blob(rng, size, Math.floor(rng() * N), Math.floor(rng() * N));
    const has = (x, y) => set.has(`${wrap(x)},${wrap(y)}`);
    const up = rng() < raise;
    for (const key of set) {
      const [x, y] = key.split(",").map(Number);
      const base = idx[y][x];
      let v = up ? base + 1 : base - 1;
      if (up && (!has(x - 1, y) || !has(x, y - 1))) v = base + 2;
      if (!up && (!has(x - 1, y) || !has(x, y - 1))) v = base - 2;
      if (!up && (!has(x + 1, y) || !has(x, y + 1))) v = base;
      idx[y][x] = clamp(v, 0, top);
    }
    if (up) {
      for (const key of set) {
        const [x, y] = key.split(",").map(Number);
        for (const [dx, dy] of [[1, 0], [0, 1]]) {
          if (!has(x + dx, y + dy)) {
            const yy = wrap(y + dy), xx = wrap(x + dx);
            idx[yy][xx] = clamp(idx[yy][xx] - 1, 0, top);
          }
        }
      }
    }
  }
};

const paint = (idx, ramp) => idx.map((row) => row.map((i) => (i === null ? null : ramp[clamp(i, 0, ramp.length - 1)])));

export const stone = (seed, ramp = RAMPS.stone) => {
  const rng = mulberry32(seed);
  const n = tileNoise(rng, 4);
  const idx = grid(2);
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const v = n(x, y);
    idx[y][x] = v > 0.7 ? 3 : 2;
  }
  emboss(idx, rng, { count: 7, min: 4, max: 10, raise: 0.5, levels: ramp.length - 1 });
  return paint(idx, ramp);
};

export const cobble = (seed) => {
  const rng = mulberry32(seed);
  const ramp = RAMPS.cobble;
  // Voronoi stones with dark mortar between them.
  const pts = Array.from({ length: 7 }, () => [rng() * N, rng() * N, 2 + Math.floor(rng() * 3)]);
  const idx = grid(0);
  const dist = (x, y, p) => {
    const dx = Math.min(Math.abs(x - p[0]), N - Math.abs(x - p[0]));
    const dy = Math.min(Math.abs(y - p[1]), N - Math.abs(y - p[1]));
    return Math.sqrt(dx * dx + dy * dy);
  };
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const ds = pts.map((p) => dist(x + 0.5, y + 0.5, p)).map((d, i) => [d, i]).sort((a, b) => a[0] - b[0]);
    const [d1, i1] = ds[0];
    const d2 = ds[1][0];
    if (d2 - d1 < 0.9) idx[y][x] = 0;
    else idx[y][x] = pts[i1][2];
  }
  // rim light: pixel whose upper-left neighbour is mortar gets brighter.
  const out = idx.map((r) => r.slice());
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    if (idx[y][x] === 0) continue;
    if (idx[wrap(y - 1)][x] === 0 || idx[y][wrap(x - 1)] === 0) out[y][x] = Math.min(idx[y][x] + 2, 5);
    else if (idx[wrap(y + 1)][x] === 0 || idx[y][wrap(x + 1)] === 0) out[y][x] = 1;
  }
  return paint(out, ramp);
};

export const deepslate = (seed) => {
  const rng = mulberry32(seed);
  const ramp = RAMPS.deepslate;
  const idx = grid(2);
  // horizontal strata with broken dashes
  for (let y = 0; y < N; y++) {
    const band = (y % 4 === 0) ? 1 : (y % 4 === 2 ? 3 : 2);
    for (let x = 0; x < N; x++) idx[y][x] = band;
  }
  for (let k = 0; k < 18; k++) {
    const y = Math.floor(rng() * N), x = Math.floor(rng() * N), len = 2 + Math.floor(rng() * 5);
    const v = rng() < 0.5 ? 0 : 4;
    for (let i = 0; i < len; i++) idx[y][wrap(x + i)] = v;
    if (v === 4) idx[wrap(y + 1)][wrap(x + 1)] = 1;
  }
  emboss(idx, rng, { count: 3, min: 2, max: 4, raise: 0.4, levels: ramp.length });
  return paint(idx, ramp);
};

export const dirt = (seed) => {
  const rng = mulberry32(seed);
  const ramp = RAMPS.dirt;
  const n = tileNoise(rng, 8);
  const idx = grid(2);
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const v = n(x, y) + (rng() - 0.5) * 0.35;
    idx[y][x] = v > 0.68 ? 3 : v < 0.32 ? 1 : 2;
  }
  // pebbles: lit top-left, shadowed bottom-right
  for (let k = 0; k < 6; k++) {
    const x = Math.floor(rng() * N), y = Math.floor(rng() * N);
    idx[y][x] = 4;
    if (rng() < 0.6) idx[y][wrap(x + 1)] = 3;
    idx[wrap(y + 1)][wrap(x + 1)] = 0;
  }
  return paint(idx, ramp);
};

// Grass-topped dirt: an uneven fringe of grass over the dirt face.
export const grassSide = (seed) => {
  const rng = mulberry32(seed);
  const base = dirt(seed + 1000);
  const g = RAMPS.grass;
  const depth = Array.from({ length: N }, () => 3 + Math.floor(rng() * 3));
  for (let x = 0; x < N; x++) if (rng() < 0.3) depth[x] += 2;
  return base.map((row, y) =>
    row.map((c, x) => {
      const d = depth[x];
      if (y === 0) return rng() < 0.5 ? g[5] : g[4];
      if (y < d - 1) return rng() < 0.3 ? g[4] : g[3];
      if (y === d - 1) return g[2];
      if (y === d) return g[0];
      return c;
    })
  );
};

export const planks = (seed) => {
  const rng = mulberry32(seed);
  const ramp = RAMPS.planks;
  const idx = grid(3);
  for (let board = 0; board < 4; board++) {
    const y0 = board * 4;
    const seam = Math.floor(rng() * 12) + 2;
    for (let x = 0; x < N; x++) {
      idx[y0][x] = 4; // lit top edge
      idx[y0 + 1][x] = 3;
      idx[y0 + 2][x] = 3;
      idx[y0 + 3][x] = 1; // gap shadow
    }
    // grain dashes
    for (let k = 0; k < 3; k++) {
      const gy = y0 + 1 + Math.floor(rng() * 2), gx = Math.floor(rng() * N), len = 2 + Math.floor(rng() * 4);
      for (let i = 0; i < len; i++) idx[gy][wrap(gx + i)] = 2;
    }
    // butt joint
    for (let yy = y0; yy < y0 + 3; yy++) idx[yy][seam] = 1;
    idx[y0][wrap(seam + 1)] = 5;
    idx[y0 + 1][wrap(seam + 1)] = 4;
    // nail heads
    if (rng() < 0.7) idx[y0 + 1][wrap(seam - 2)] = 0;
  }
  return paint(idx, ramp);
};

export const bark = (seed) => {
  const rng = mulberry32(seed);
  const ramp = RAMPS.bark;
  const idx = grid(2);
  for (let x = 0; x < N; x++) {
    const col = x % 4 === 0 ? 0 : x % 4 === 1 ? 3 : 2;
    for (let y = 0; y < N; y++) idx[y][x] = col;
  }
  for (let k = 0; k < 14; k++) {
    const x = Math.floor(rng() * N), y = Math.floor(rng() * N), len = 2 + Math.floor(rng() * 4);
    const v = rng() < 0.5 ? 1 : 4;
    for (let i = 0; i < len; i++) idx[wrap(y + i)][x] = v;
  }
  return paint(idx, ramp);
};

export const leaves = (seed) => {
  const rng = mulberry32(seed);
  const ramp = RAMPS.leaves;
  const idx = grid(2);
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const r = rng();
    idx[y][x] = r < 0.12 ? null : r < 0.35 ? 1 : r < 0.7 ? 2 : 3;
  }
  // leaf clumps with lit top-left
  for (let k = 0; k < 10; k++) {
    const x = Math.floor(rng() * N), y = Math.floor(rng() * N);
    idx[y][x] = 4;
    idx[y][wrap(x + 1)] = 3;
    idx[wrap(y + 1)][x] = 3;
    idx[wrap(y + 1)][wrap(x + 1)] = 0;
  }
  return paint(idx, ramp);
};

export const bedrock = (seed) => {
  const rng = mulberry32(seed);
  const ramp = RAMPS.bedrock;
  const idx = grid(1);
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) idx[y][x] = rng() < 0.5 ? 1 : 2;
  emboss(idx, rng, { count: 12, min: 2, max: 6, raise: 0.5, levels: ramp.length });
  return paint(idx, ramp);
};

export const lava = (seed) => {
  const rng = mulberry32(seed);
  const ramp = RAMPS.lava;
  const n1 = tileNoise(rng, 4);
  const n2 = tileNoise(rng, 8);
  const idx = grid(2);
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const v = n1(x, y) * 0.65 + n2(x, y) * 0.35;
    idx[y][x] = v > 0.72 ? 5 : v > 0.6 ? 4 : v > 0.47 ? 3 : v > 0.33 ? 2 : 1;
  }
  return paint(idx, ramp);
};

// Ore: a host texture with a few embossed mineral clusters.
export const ore = (seed, host, kind) => {
  const rng = mulberry32(seed);
  const tex = host.map((r) => r.slice());
  const [shadow, mid, light] = ORES[kind];
  const clusters = 3 + Math.floor(rng() * 2);
  for (let k = 0; k < clusters; k++) {
    const cx = 2 + Math.floor(rng() * 12), cy = 2 + Math.floor(rng() * 12);
    const set = blob(rng, 3 + Math.floor(rng() * 3), cx, cy);
    const has = (x, y) => set.has(`${wrap(x)},${wrap(y)}`);
    for (const key of set) {
      const [x, y] = key.split(",").map(Number);
      tex[y][x] = !has(x - 1, y) || !has(x, y - 1) ? light : mid;
    }
    for (const key of set) {
      const [x, y] = key.split(",").map(Number);
      if (!has(x + 1, y + 1)) tex[wrap(y + 1)][wrap(x + 1)] = shadow;
    }
  }
  return tex;
};

// Background walls are the same textures, darkened, so cavities read
// as recessed behind the cut face.
export const darken = (tile, f) =>
  tile.map((row) =>
    row.map((c) => {
      if (!c) return null;
      const n = parseInt(c.slice(1), 16);
      const r = Math.round(((n >> 16) & 255) * f), g = Math.round(((n >> 8) & 255) * f), b = Math.round((n & 255) * f);
      return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
    })
  );

export const transpose = (tile) => tile[0].map((_, x) => tile.map((row) => row[x]));
