// Entries quoted on the home page. Each reference points at a real line
// of data/bugs.json; the Chinese text is always rendered from the
// dataset. The English lines are this site's translations of those
// originals and are labelled as such wherever they appear.

import type { EntryRef } from "~/lib/data";

export type Highlight = { ref: EntryRef; en: string; also?: EntryRef };

const AM21 = "Alex Mobs 1.21.1 测试问题记录.txt";
const AM20 = "Alex Mobs 测试问题记录 (旧).txt";
const AC21 = "Alex Caves 1.21.1 测试问题记录.txt";
const IWM20 = "InstantWorldMirror 1.20.1 测试问题记录.txt";
const HB20 = "hotbath 1.20.1 测试问题记录.txt";
const HB_R1 = "hotbath 1.20.1 未过关问题记录2026.4.1.txt";
const HB_R2 = "hotbath 1.20.1 未过关问题记录2026.4.5.txt";

export const HIGHLIGHTS: Highlight[] = [
  {
    ref: { mod: "alex_mobs", file: AM21, index: 43 },
    also: { mod: "alex_mobs", file: AM20, index: 43 },
    en: "Playing a music disc in a jukebox next to a rain frog disconnects the player immediately.",
  },
  {
    ref: { mod: "instant_world_mirror", file: IWM20, index: 14 },
    en: "Placing the mirror at Y=319 quits the whole game.",
  },
  {
    ref: { mod: "alex_caves", file: AC21, index: 32 },
    en: "Tested: eating a raw radgill gives 100 seconds of Irradiated, not 90.",
  },
  {
    ref: { mod: "alex_mobs", file: AM21, index: 2 },
    en: "With the photon-main shader on, the underminer turns invisible. With the shader off it appears normally.",
  },
  {
    ref: { mod: "instant_world_mirror", file: IWM20, index: 9 },
    en: "The submarine from Alex's Caves is not copied into the mirror world (not riding it into the mirror, just a submarine placed in water). Back in the overworld the submarine is still there.",
  },
  {
    ref: { mod: "hotbath", file: HB20, index: 22 },
    en: "With the game set to Japanese, the 7 custom bath barrels and 7 custom bath bottles have Japanese item names only; everything else is in English.",
  },
];

// One issue followed through three reports. `note` entries repeat the
// first-round text and end with a bracketed remark; only that remark is
// quoted, with the elision marked.
export type ThreadStep = {
  note?: { ref: EntryRef; en: string };
  ref: EntryRef;
  en: string;
};

export const THREAD: ThreadStep[] = [
  {
    ref: { mod: "hotbath", file: HB20, index: 24 },
    en: "With only Cold Sweat installed: in the ender bath barrel, body temperature stays at the surrounding temperature instead of dropping to 15°. In the 6 original bath barrels, body temperature always rises to 40°, not 37°.",
  },
  {
    note: {
      ref: { mod: "hotbath", file: HB_R1, index: 12 },
      en: "…(Not fixed, and the problem has changed. Current state below.)",
    },
    ref: { mod: "hotbath", file: HB_R1, index: 13 },
    en: "Current state: with only Cold Sweat installed, the ender bath barrel drops body temperature to 10°, not 15°. In the 6 original bath barrels, body temperature always rises to 32°, not 37°.",
  },
  {
    note: {
      ref: { mod: "hotbath", file: HB_R2, index: 10 },
      en: "…(Not fixed, and the problem has changed. Current state below.)",
    },
    ref: { mod: "hotbath", file: HB_R2, index: 11 },
    en: "OK Current state: with only Cold Sweat installed, the ender bath barrel drops body temperature to 10°, not 15°. In the 6 original bath barrels, body temperature always rises to 32°, not 37°.",
  },
];

/** The bracketed remark at the end of a repeated entry, with the elision marked. */
export const trailingRemark = (text: string): string => {
  const i = Math.max(text.lastIndexOf("("), text.lastIndexOf("（"));
  if (i < 0) throw new Error(`No bracketed remark in: ${text.slice(0, 40)}…`);
  return "…" + text.slice(i);
};
