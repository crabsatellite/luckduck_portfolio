// Bitmap text from the Fusion Pixel 12px glyphs exported by
// scripts/fonts/build-pixel-fonts.py, so generated images can carry
// crisp pixel lettering without depending on system fonts.

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const font = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), "glyphs-12.json"), "utf8"));

export const measure = (str, scale = 1) =>
  [...str].reduce((w, ch) => w + (font.glyphs[ch]?.adv ?? 6), 0) * scale;

export const drawText = (img, str, x, y, scale, rgb) => {
  let cx = x;
  for (const ch of str) {
    const g = font.glyphs[ch];
    if (!g) {
      cx += 6 * scale;
      continue;
    }
    g.rows.forEach((row, ry) => {
      for (let rx = 0; rx < row.length; rx++) {
        if (row[rx] !== "#") continue;
        for (let sy = 0; sy < scale; sy++) for (let sx = 0; sx < scale; sx++) img.set(cx + rx * scale + sx, y + ry * scale + sy, rgb);
      }
    });
    cx += g.adv * scale;
  }
  return cx;
};
