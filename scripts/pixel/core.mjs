// Small pixel-art toolkit shared by the art generators.
// Everything is deterministic: the same seed always yields the same bytes.

import sharp from "sharp";

export const hex = (h) => {
  const s = h.replace("#", "");
  return [parseInt(s.slice(0, 2), 16), parseInt(s.slice(2, 4), 16), parseInt(s.slice(4, 6), 16)];
};

export const mulberry32 = (seed) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export const hash2 = (x, y, s = 0) => {
  let h = (x * 374761393 + y * 668265263 + s * 2147483647) >>> 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};

// RGBA image, 0..255 channels.
export class Img {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.d = new Uint8ClampedArray(w * h * 4);
  }
  get(x, y) {
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return null;
    const i = (y * this.w + x) * 4;
    return [this.d[i], this.d[i + 1], this.d[i + 2], this.d[i + 3]];
  }
  set(x, y, rgb, a = 255) {
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
    const i = (y * this.w + x) * 4;
    this.d[i] = rgb[0];
    this.d[i + 1] = rgb[1];
    this.d[i + 2] = rgb[2];
    this.d[i + 3] = a;
  }
  // Alpha-over a colour with coverage a (0..1).
  blend(x, y, rgb, a) {
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
    const i = (y * this.w + x) * 4;
    const da = this.d[i + 3] / 255;
    const oa = a + da * (1 - a);
    if (oa <= 0) return;
    for (let c = 0; c < 3; c++) {
      this.d[i + c] = (rgb[c] * a + this.d[i + c] * da * (1 - a)) / oa;
    }
    this.d[i + 3] = oa * 255;
  }
  blit(src, ox, oy) {
    for (let y = 0; y < src.h; y++) {
      for (let x = 0; x < src.w; x++) {
        const p = src.get(x, y);
        if (p && p[3] > 0) this.blend(ox + x, oy + y, p, p[3] / 255);
      }
    }
  }
  async png(path, scale = 1) {
    let img = sharp(Buffer.from(this.d.buffer), { raw: { width: this.w, height: this.h, channels: 4 } });
    if (scale !== 1) img = img.resize(this.w * scale, this.h * scale, { kernel: "nearest" });
    await img.png({ compressionLevel: 9, palette: false }).toFile(path);
  }
}

// A tile is a 2-D array of colour strings (or null for transparent).
export const tileToImg = (tile) => {
  const h = tile.length;
  const w = tile[0].length;
  const img = new Img(w, h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const c = tile[y][x];
      if (c) img.set(x, y, hex(c));
    }
  }
  return img;
};

// Parse a character-grid sprite. `key` maps characters to colours;
// "." (or any unmapped character) is transparent.
export const sprite = (rows, key) => {
  const lines = rows
    .trim()
    .split("\n")
    .map((l) => l.trim());
  return lines.map((line) => [...line].map((ch) => key[ch] ?? null));
};

// 4x4 Bayer matrix, normalised to [0, 1).
export const BAYER4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
].map((r) => r.map((v) => v / 16));

export const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
