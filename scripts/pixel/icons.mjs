// 16x16 icons for the issue categories. Geometric shapes are filled
// procedurally and given a one-pixel bevel (lit top-left, shaded
// bottom-right) so they share the scene's key light; the rest are drawn
// by hand.

import { sprite } from "./core.mjs";

const K = "#17171c";

const bevelIcon = (inside, [dark, mid, light, hi], extra = () => null) => {
  const g = Array.from({ length: 16 }, (_, y) => Array.from({ length: 16 }, (_, x) => inside(x + 0.5, y + 0.5)));
  const has = (x, y) => g[y]?.[x] === true;
  return g.map((row, y) =>
    row.map((on, x) => {
      if (!on) {
        const touch = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => has(x + dx, y + dy));
        return touch ? K : null;
      }
      const e = extra(x, y);
      if (e) return e;
      if (!has(x - 1, y) || !has(x, y - 1)) return !has(x - 1, y - 1) && !has(x - 1, y) ? hi : light;
      if (!has(x + 1, y) || !has(x, y + 1)) return dark;
      return mid;
    })
  );
};

const polar = (x, y, cx = 8, cy = 8) => [Math.hypot(x - cx, y - cy), Math.atan2(y - cy, x - cx)];

const gear = () =>
  bevelIcon(
    (x, y) => {
      const [r, a] = polar(x, y);
      const tooth = Math.cos(a * 8) > 0.15;
      return r >= 1.9 && (r <= 4.9 || (tooth && r <= 6.9));
    },
    ["#4b4f58", "#80858f", "#b4b9c2", "#dfe3ea"]
  );

const star = () =>
  bevelIcon(
    (x, y) => {
      // five-point star by angular radius modulation
      const [r, a] = polar(x, y, 8, 8.6);
      const k = (Math.cos(5 * (a + Math.PI / 2)) + 1) / 2;
      return r <= 3.1 + 3.9 * Math.pow(k, 1.6);
    },
    ["#a86b12", "#e8b130", "#ffd965", "#fff4bf"]
  );

const sun = () =>
  bevelIcon(
    (x, y) => {
      const [r, a] = polar(x, y);
      const ray = Math.cos(a * 8) > 0.72 && r >= 5 && r <= 7.4;
      return r <= 3.9 || ray;
    },
    ["#c26f12", "#f2a72e", "#ffd666", "#fff3c4"]
  );

const egg = () =>
  bevelIcon(
    (x, y) => {
      const dx = (x - 8) / 4.9, dy = (y - 8.6) / 6.4;
      const squash = dy < 0 ? 1 + dy * 0.18 : 1;
      return dx * dx / (squash * squash) + dy * dy <= 1;
    },
    ["#8a7a5c", "#d9cba8", "#efe5cb", "#fffaf0"],
    (x, y) => {
      const spots = [[6, 6], [10, 9], [7, 11], [10, 5], [5, 9]];
      return spots.some(([sx, sy]) => (x === sx && y === sy) || (x === sx + 1 && y === sy)) ? "#5e8d3a" : null;
    }
  );

const ICONS = {
  crash: () =>
    sprite(
      `
................
.......k........
......kRk.......
.k...kRYRk...k..
.kRk.kRYRk.kRk..
..kRkRYOYRkRk...
...kRYOWOYRk....
.kkRYOWWWOYRkk..
kRRYOWWWWWOYRRk.
.kkRYOWWWOYRkk..
...kRYOWOYRk....
..kRkRYOYRkRk...
.kRk.kRYRk.kRk..
.k...kRYRk...k..
......kRk.......
.......k........`,
      { k: K, R: "#d4402a", Y: "#f5922e", O: "#ffcd4a", W: "#fff7d6" }
    ),

  multiplayer: () =>
    sprite(
      `
................
.......kkkkkkkk.
.......khhhhhhk.
.......khsssshk.
.......kssssssk.
.......ksessesk.
.kkkkkkkkssttsk.
.kHHHHHHktttttk.
.kHHHHHHkkkkkkk.
.kHSSSSHk.......
.kSSSSSSk.......
.kSESSESk.......
.kSSTTSSk.......
.kTTTTTTk.......
.kkkkkkkk.......
................`,
      { k: K, h: "#5a3b26", s: "#c9926c", t: "#a87452", e: "#2b2f6e", H: "#2e2e36", S: "#eab48c", T: "#c98e66", E: "#3c64d0" }
    ),

  "mod-compat": () =>
    sprite(
      `
................
................
................
.kkkkkkkkkkkkkk.
.kLLLLLLklllllk.
.kLGGGGGklbbbbk.
.kLGGkkkklbbbbk.
.kLGkllllbbbbdk.
.kLGkbbbbbbbbdk.
.kLGGkkkkbbbbdk.
.kLGGGGGkbbbbdk.
.kLGGGGGkbbbbdk.
.kDDDDDDkdddddk.
.kkkkkkkkkkkkkk.
................
................`,
      { k: K, L: "#9be07a", G: "#5cb144", D: "#2f7a2b", l: "#9cc4ff", b: "#4d86e0", d: "#2a4f9a" }
    ),

  mechanic: gear,
  achievement: star,

  "loot-drops": () =>
    sprite(
      `
................
......kkkk......
.....kTttTk.....
......kRRk......
.....kbBBbk.....
....kbBBBBbk....
...kbBBBBBBbk...
..kbBBBBBBBBbk..
..kbBBBBBBBBdk..
..kbBBBBBBBddk..
..kbBBBBBBdddk..
...kbBBBBddk....
....kkkkkkk.....
.........y......
........yYy.....
.........y......`,
      { k: K, T: "#8a6a3a", t: "#b9925a", R: "#d4402a", B: "#b98a52", b: "#d9ae74", d: "#7d5a30", y: "#e8b130", Y: "#fff4bf" }
    ),

  recipe: () =>
    sprite(
      `
................
.kkkkkkkkkkkkkk.
.kLLLLkLLLLkLLk.
.kLwwDkLwwDkLwk.
.kLwwDkLwwDkLwk.
.kDDDDkDDDDkDDk.
.kkkkkkkkkkkkkk.
.kLLLLkLLLLkLLk.
.kLwwDkLooDkLwk.
.kLwwDkLooDkLwk.
.kDDDDkDDDDkDDk.
.kkkkkkkkkkkkkk.
.kLLLLkLLLLkLLk.
.kLwwDkLwwDkLwk.
.kDDDDkDDDDkDDk.
.kkkkkkkkkkkkkk.`,
      { k: K, L: "#a7aab2", w: "#7d8089", D: "#575a62", o: "#e8b130" }
    ),

  "entity-behavior": egg,

  "spec-mismatch": () =>
    sprite(
      `
................
..kkkkkkkkkkk...
..kBBBBBBBBBbk..
..kBLLLLLLLBbk..
..kBLppppkLBbk..
..kBLLLLLLLBbk..
..kBLpppkLLBbk..
..kBLLLLLLLBbk..
..kBLppkkkkkkk..
..kBLLkRWkkRWk..
..kBBBkkRWRWkk..
..kwwwkkkRWkkk..
..kkkkkkRWkRWk..
......kRWkkkRWk.
......kkkk.kkkk.
................`,
      { k: K, B: "#3f62b0", b: "#2a427a", L: "#efe6d2", p: "#a9a091", w: "#d9d0bb", R: "#e0432f", W: "#ff8a6e" }
    ),

  animation: () =>
    sprite(
      `
................
................
.kkkkkkkkkkkk...
.kssssssssssk...
.kssssssssssk.k.
.kssdddddddsskRk
.kssdLLLLLdsskRk
.kssdLWLLLdsRRRk
.kssdLLLLLdsRRRk
.kssdLLLLLdsskRk
.kssdddddddsskRk
.kssssssssssk.k.
.kkkkkkkkkkkk...
...kk....kk.....
................
................`,
      { k: K, s: "#4a4e57", d: "#1f2126", L: "#5a8fd0", W: "#cfe3ff", R: "#d4402a" }
    ),

  shader: sun,

  visual: () =>
    sprite(
      `
................
...kkkkkkk......
..kPPPPPPPkk....
.kPrRPPbBPPPk...
.kPRRPPBBPPPPk..
.kPPPPPPPPPPPk..
.kPyYPPkkkPPPk..
.kPYYPk...kPk...
.kPPPPk....k....
.kPgGPPk.kk.....
..kGGPPPkPk.....
...kPPPPPPk.....
....kkkkkk......
................
................
................`,
      { k: K, P: "#c9a06a", r: "#a8321f", R: "#e0432f", b: "#2a5aa8", B: "#4d86e0", y: "#c99a1e", Y: "#f6cf45", g: "#2f7a2b", G: "#5cb144" }
    ),

  i18n: () =>
    sprite(
      `
................
..kkkkkkkkkkkk..
.kWWWWWWWWWWWWk.
.kWWWWWkWWWWWWk.
.kWWkkkkkkkWWWk.
.kWWWkWWWkWWWWk.
.kWWWWkWkWWWWWk.
.kWWWWWkWWWWWWk.
.kWWWWkWkWWWWWk.
.kWWWkWWWkkWWWk.
.kSWWWWWWWWWWSk.
..kkkSSkkkkkkk..
....kSk.........
....kk..........
................
................`,
      { k: K, W: "#eef2f7", S: "#b9c2cf" }
    ),
};

export const CATEGORY_ORDER = [
  "crash",
  "multiplayer",
  "mod-compat",
  "mechanic",
  "achievement",
  "loot-drops",
  "recipe",
  "entity-behavior",
  "spec-mismatch",
  "animation",
  "shader",
  "visual",
  "i18n",
];

export const icon = (name) => {
  const t = ICONS[name]();
  if (t.length !== 16 || t.some((r) => r.length !== 16)) throw new Error(`icon ${name} is not 16x16`);
  return t;
};
