// Builds the site's pixel art and identity images. Runs before every
// build (`prebuild`) and is deterministic, so unchanged inputs produce
// unchanged files.
//
//   public/art/ground.png      hero cross-section (transparent sky)
//   public/art/edge.png        tiling ground strip for inner page headers
//   public/art/stars.png       tiling star field for the CSS sky
//   public/art/moon.png, duck.png, duck-large.png
//   public/art/icons.png       category icons, 16 px each, CATEGORY_ORDER
//   public/art/mods/<id>.png   96 px mod icon thumbnails
//   public/favicon-32.png, favicon.ico, apple-touch-icon.png, og.png
//
// The metric badges in public/badges are still produced by gen-badges.mjs,
// which the metrics workflow also runs on its own.

import { mkdir, writeFile, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import sharp from "sharp";

import { Img, tileToImg, hex, mulberry32 } from "./pixel/core.mjs";
import * as S from "./pixel/sprites.mjs";
import { icon, CATEGORY_ORDER } from "./pixel/icons.mjs";
import { buildWorld, buildEdge, computeLight, renderGround } from "./pixel/scene.mjs";
import { drawText, measure } from "./pixel/font.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PUBLIC = join(ROOT, "public");
const ART = join(PUBLIC, "art");

// Night sky bands, shared with --sky-* in src/styles/global.css.
const SKY = ["#0b0e1a", "#0e1221", "#111729", "#151c33", "#19213b"];

const stars = (size = 96) => {
  const img = new Img(size, size);
  const rng = mulberry32(7);
  for (let i = 0; i < 26; i++) {
    const x = Math.floor(rng() * size), y = Math.floor(rng() * size);
    const k = rng();
    const c = k < 0.15 ? [255, 236, 200] : k < 0.3 ? [200, 216, 255] : [232, 236, 245];
    const a = 0.35 + rng() * 0.55;
    img.blend(x, y, c, a);
    if (k > 0.9) {
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) img.blend(x + dx, y + dy, c, a * 0.35);
    }
  }
  return img;
};

const LOGO_PIXEL_ART = new Set(["alex_caves", "ping_system", "ok_orefinder"]);

const modThumbs = async () => {
  const mods = JSON.parse(await readFile(join(ROOT, "data", "mods.json"), "utf8"));
  await mkdir(join(ART, "mods"), { recursive: true });
  for (const m of mods) {
    if (!m.logo_local) continue;
    const src = join(PUBLIC, m.logo_local);
    const meta = await sharp(src).metadata();
    const pixel = LOGO_PIXEL_ART.has(m.id);
    // pixel-art logos scale by whole multiples so their pixels stay square
    const size = pixel && meta.width < 96 ? Math.floor(96 / meta.width) * meta.width : 96;
    const pad = Math.floor((96 - size) / 2);
    await sharp(src)
      .resize(size, size, { kernel: pixel ? "nearest" : "lanczos3", fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .extend({ top: pad, bottom: 96 - size - pad, left: pad, right: 96 - size - pad, background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ compressionLevel: 9 })
      .toFile(join(ART, "mods", `${m.id}.png`));
  }
};

const iconSheet = () => {
  const sheet = new Img(16 * CATEGORY_ORDER.length, 16);
  CATEGORY_ORDER.forEach((name, i) => sheet.blit(tileToImg(icon(name)), i * 16, 0));
  return sheet;
};

const favicons = async (duckLarge) => {
  // 32 px: the small duck on the lantern-gold square
  const fav = new Img(16, 16);
  for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) fav.set(x, y, hex("#14171d"));
  fav.blit(tileToImg(S.duck()), 0, 0);
  await fav.png(join(PUBLIC, "favicon-32.png"), 2);
  await writeFile(join(PUBLIC, "favicon.ico"), await readFile(join(PUBLIC, "favicon-32.png")));

  // 180 px apple touch icon: large duck at x6 on the night sky
  const touch = new Img(30, 30);
  for (let y = 0; y < 30; y++) for (let x = 0; x < 30; x++) touch.set(x, y, hex(SKY[Math.min(4, Math.floor(y / 6))]));
  touch.blit(duckLarge, 3, 5);
  await touch.png(join(PUBLIC, "apple-touch-icon.png"), 6);
};

const ogImage = async (ground, duckLarge, starTile, stats) => {
  const W = 600, H = 315; // rendered at x2 -> 1200 x 630
  const og = new Img(W, H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) og.set(x, y, hex(SKY[Math.min(4, Math.floor(y / 40))]));
  for (let y = 0; y < H; y += starTile.h) for (let x = 0; x < W; x += starTile.w) og.blit(starTile, x, y);
  og.blit(tileToImg(S.moon()), W - 40, 18);

  // ground: the workshop, centred
  const cropX = 800 - W / 2;
  const top = H - (ground.h - 40);
  const crop = new Img(W, ground.h - 40);
  for (let y = 0; y < crop.h; y++) for (let x = 0; x < W; x++) {
    const p = ground.get(cropX + x, y + 40);
    if (p) crop.set(x, y, p, p[3]);
  }
  og.blit(crop, 0, top);

  const shadow = [8, 9, 14];
  const text = (s, x, y, scale, color) => {
    drawText(og, s, x + scale, y + scale, scale, shadow);
    drawText(og, s, x, y, scale, color);
  };
  og.blit(duckLarge, 20, 18);
  text("LUCK666DUCK", 52, 18, 2, hex("#f3c35a"));
  text("I break Minecraft mods, then write down exactly how.", 20, 50, 1, hex("#ece8e1"));
  text("把模组玩坏，再写清楚怎么坏的。", 20, 68, 1, hex("#a9b3c7"));
  const lines = [
    `Minecraft ${stats.versions}`,
    `Mods tested: ${stats.mods}`,
    `Log entries: ${stats.entries}`,
    `Test rounds: ${stats.rounds}`,
  ];
  lines.forEach((l, i) => {
    const w = measure(l) + 4;
    const x = W - 20 - w, y = 56 + i * 15;
    for (let yy = y; yy < y + 14; yy++) for (let xx = x; xx < x + w; xx++) og.blend(xx, yy, [80, 80, 80], 0.56);
    drawText(og, l, x + 3, y + 1, 1, [63, 63, 63]);
    drawText(og, l, x + 2, y, 1, [224, 224, 224]);
  });
  await og.png(join(PUBLIC, "og.png"), 2);
};

const main = async () => {
  await mkdir(ART, { recursive: true });

  const world = buildWorld();
  const ground = renderGround(world, computeLight(world));
  await ground.png(join(ART, "ground.png"));

  const edgeWorld = buildEdge();
  await renderGround(edgeWorld, computeLight(edgeWorld), { fade: 20, wrapX: true }).png(join(ART, "edge.png"));

  const starTile = stars();
  await starTile.png(join(ART, "stars.png"));
  await tileToImg(S.moon()).png(join(ART, "moon.png"));
  await tileToImg(S.duck()).png(join(ART, "duck.png"));
  const duckLarge = tileToImg(S.duckLarge());
  await duckLarge.png(join(ART, "duck-large.png"));
  await iconSheet().png(join(ART, "icons.png"));
  await modThumbs();
  await favicons(duckLarge);

  const mods = JSON.parse(await readFile(join(ROOT, "data", "mods.json"), "utf8"));
  const versions = [...new Set(mods.flatMap((m) => m.versions))].sort().join(" / ");
  await ogImage(ground, duckLarge, starTile, {
    versions,
    mods: mods.length,
    entries: mods.reduce((s, m) => s + m.total_bugs, 0),
    rounds: mods.reduce((s, m) => s + m.rounds.length, 0),
  });

  execFileSync(process.execPath, [join(__dirname, "gen-badges.mjs")], { stdio: "inherit" });
  console.log("[build-assets] done");
};

main().catch((e) => {
  console.error("[build-assets] failed:", e);
  process.exit(1);
});
