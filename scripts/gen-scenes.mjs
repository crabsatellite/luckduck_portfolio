// Generates 5 in-game scene placeholders, 1280x400, programmatic block scenes.
// Each scene is a 32x10 grid of 40x40 px "blocks" rendered as colored squares
// with subtle texture. NO Mojang trademark assets — just colored block geometry
// reminiscent of MC vanilla biomes (water, deepslate, kelp, cobble, etc.)
//
// Output: public/scenes/{hot-bath,shower,caves,mobs,prehistoric}-scene.png

import { writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const OUT = join(__dirname, "..", "public", "scenes");

const COLS = 32, ROWS = 10, CELL = 40;
const W = COLS * CELL, H = ROWS * CELL;

// Pseudorandom from seed
function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Block palette: shades for each block type. Slight variance per cell.
const BLOCKS = {
  water: ["#3858d4", "#2f4dc4", "#456ce4"],
  hotwater: ["#d97e1c", "#c46d12", "#e89c4d"],
  steam: ["#d8e8f4", "#c8dee8", "#e8f0f8"],
  cobble: ["#7a7a7a", "#666", "#909090"],
  iron: ["#c8c8d0", "#b0b0bc", "#d8d8e0"],
  deepslate: ["#3a3a48", "#2c2c38", "#48485a"],
  glow: ["#a6e3a1", "#8dd28a", "#bff0bb"],
  amethyst: ["#cba6f7", "#b890e8", "#e0c8ff"],
  oak: ["#9c7440", "#825c30", "#b48c54"],
  leaves: ["#6a9c40", "#557d34", "#7eb04c"],
  grass: ["#5a9442", "#477030", "#6ea854"],
  dirt: ["#7a5a40", "#664830", "#8c6c50"],
  kelp: ["#3e7848", "#2c5c34", "#508c5a"],
  sand: ["#e8d090", "#d4ba78", "#f4dca8"],
  coral_pink: ["#f5bde6", "#e0a4cc", "#ffd0f0"],
  coral_orange: ["#f9c47a", "#e8a050", "#ffd29a"],
  air: ["#1c1d2a", "#15161e", "#252638"],
  air_warm: ["#3a2e30", "#2c2228", "#48383c"],
  air_cave: ["#0e0e18", "#080812", "#181828"],
  air_ocean: ["#1a3858", "#142844", "#244c70"],
  bubble: ["#f9c47a"],
};

const SCENES = {
  "hot-bath-scene": {
    sky: "air_warm",
    layout: (col, row) => {
      // Bottom row: cobble tile floor with hot-water inset; bath water columns
      if (row >= 8) return col % 4 === 0 || col % 4 === 3 ? "cobble" : "hotwater";
      if (row >= 7 && col >= 4 && col <= 27) return "hotwater";
      if (row === 6 && col >= 4 && col <= 27 && col % 3 !== 0) return "steam";
      // bath stalls — cobble walls every 8 cols
      if (col === 0 || col === COLS - 1) return "cobble";
      if (row === 0 && col % 8 === 0) return "cobble";
      if (col === 8 && row >= 6) return "cobble";
      if (col === 16 && row >= 5) return "cobble";
      if (col === 24 && row >= 6) return "cobble";
      if (row === 5 && col >= 4 && col <= 27 && col % 4 === 0) return "steam";
      if (row >= 3 && row <= 4 && col >= 4 && col <= 27 && col % 5 === 0) return "steam";
      return "air_warm";
    },
    bubbles: 14,
  },
  "shower-scene": {
    sky: "air_warm",
    layout: (col, row) => {
      if (row >= 8) return col % 5 === 0 ? "iron" : "cobble";
      if (col === 0 || col === COLS - 1) return "iron";
      if (col === 10 && row >= 4) return "iron";
      if (col === 20 && row >= 4) return "iron";
      if (row === 3 && (col === 5 || col === 15 || col === 25)) return "iron";
      // shower water streams from row 4 down
      if ((col === 5 || col === 15 || col === 25) && row >= 4 && row <= 7) return "water";
      // steam puffs
      if (row <= 2 && col % 3 === 0) return "steam";
      if (row === 5 && (col === 6 || col === 16 || col === 26)) return "steam";
      return "air_warm";
    },
    bubbles: 8,
  },
  "caves-scene": {
    sky: "air_cave",
    layout: (col, row) => {
      if (row >= 8) return col % 7 === 0 ? "amethyst" : "deepslate";
      if (row === 7) return col % 4 === 0 ? "amethyst" : "deepslate";
      // glowstone clumps
      if ((col === 4 && row === 5) || (col === 12 && row === 4) || (col === 20 && row === 6) || (col === 28 && row === 5)) return "glow";
      if ((col === 5 && row === 5) || (col === 13 && row === 4) || (col === 21 && row === 6)) return "glow";
      // ceiling
      if (row === 0) return "deepslate";
      if (row === 1 && col % 5 === 0) return "deepslate";
      // pillars
      if (col === 8 && row >= 3) return "deepslate";
      if (col === 24 && row >= 4) return "deepslate";
      return "air_cave";
    },
    bubbles: 0,
  },
  "mobs-scene": {
    sky: "air_warm",
    layout: (col, row) => {
      if (row >= 8) return col % 6 === 0 ? "dirt" : "grass";
      if (row === 7) return col % 4 === 0 ? "dirt" : "grass";
      // Trees scattered
      if ((col === 3 || col === 11 || col === 19 || col === 27) && row === 6) return "oak";
      if ((col === 3 || col === 11 || col === 19 || col === 27) && row >= 4 && row <= 5) return "oak";
      if ((col === 2 || col === 4) && (row === 3 || row === 4)) return "leaves";
      if ((col === 10 || col === 12) && (row === 3 || row === 4)) return "leaves";
      if ((col === 18 || col === 20) && (row === 3 || row === 4)) return "leaves";
      if ((col === 26 || col === 28) && (row === 3 || row === 4)) return "leaves";
      if ((col === 3 || col === 11 || col === 19 || col === 27) && row === 2) return "leaves";
      return "air_warm";
    },
    bubbles: 0,
  },
  "prehistoric-scene": {
    sky: "air_ocean",
    layout: (col, row) => {
      if (row >= 8) return col % 5 === 0 ? "coral_orange" : col % 7 === 0 ? "coral_pink" : "sand";
      if (row === 7) return (col + row) % 6 === 0 ? "coral_pink" : "sand";
      // Kelp columns rising
      if ((col === 4 || col === 9 || col === 14 || col === 19 || col === 24 || col === 29) && row >= 3 && row <= 6) return "kelp";
      // Water everywhere else (surface)
      if (row >= 1) return "water";
      return "air_ocean";
    },
    bubbles: 12,
  },
};

function shadePixel(rng, palette, x, y, cellX, cellY) {
  // Slight per-pixel variation for "blocky" feel. Edges darker.
  const local = rng();
  let idx = 0;
  if (local < 0.35) idx = 1;
  else if (local > 0.7) idx = 2;
  // edge darken
  const onEdge = cellX === 0 || cellY === 0 || cellX === CELL - 1 || cellY === CELL - 1;
  if (onEdge) idx = 1;
  return palette[idx % palette.length];
}

function hexToRgb(h) {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
}

function blockKey(blockName, col, row) {
  // Stable per-cell hash for slight shading variance.
  return col * 73 + row * 31 + blockName.length;
}

async function renderScene(name, def) {
  const buf = Buffer.alloc(W * H * 4);
  const skyPalette = BLOCKS[def.sky];

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const blockType = def.layout(col, row) || def.sky;
      const palette = BLOCKS[blockType] || skyPalette;
      const seed = blockKey(blockType, col, row);
      const rng = mulberry32(seed);
      for (let cy = 0; cy < CELL; cy++) {
        for (let cx = 0; cx < CELL; cx++) {
          const x = col * CELL + cx;
          const y = row * CELL + cy;
          const hex = shadePixel(rng, palette, x, y, cx, cy);
          const [r, g, b] = hexToRgb(hex);
          const i = (y * W + x) * 4;
          buf[i] = r; buf[i + 1] = g; buf[i + 2] = b; buf[i + 3] = 255;
        }
      }
    }
  }

  // Soft warm lighting overlay: amber-tinted vignette top to bottom
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      const dx = x - W / 2;
      const dy = y - H / 2;
      const dist = Math.sqrt(dx * dx + dy * dy) / Math.sqrt(W * W + H * H) * 2;
      const vignette = Math.max(0, dist - 0.6) * 0.3;
      buf[i] = Math.max(0, buf[i] * (1 - vignette));
      buf[i + 1] = Math.max(0, buf[i + 1] * (1 - vignette));
      buf[i + 2] = Math.max(0, buf[i + 2] * (1 - vignette));
    }
  }

  // Add bubble specks for water scenes
  if (def.bubbles) {
    const rng = mulberry32(name.length * 13 + 7);
    for (let b = 0; b < def.bubbles; b++) {
      const bx = Math.floor(rng() * W);
      const by = Math.floor(rng() * H);
      const radius = 3 + Math.floor(rng() * 3);
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          if (dx * dx + dy * dy <= radius * radius) {
            const x = bx + dx, y = by + dy;
            if (x >= 0 && x < W && y >= 0 && y < H) {
              const i = (y * W + x) * 4;
              buf[i] = Math.min(255, 0xff * 0.6 + buf[i] * 0.4);
              buf[i + 1] = Math.min(255, 0xd5 * 0.6 + buf[i + 1] * 0.4);
              buf[i + 2] = Math.min(255, 0x99 * 0.6 + buf[i + 2] * 0.4);
            }
          }
        }
      }
    }
  }

  await sharp(buf, { raw: { width: W, height: H, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(join(OUT, `${name}.png`));
  console.log(`[scenes] wrote ${name}.png`);
}

async function main() {
  if (!existsSync(OUT)) await mkdir(OUT, { recursive: true });
  for (const [name, def] of Object.entries(SCENES)) {
    await renderScene(name, def);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
