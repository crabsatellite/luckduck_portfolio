"""Subset the Fusion Pixel font for this site.

Development tool, not part of `npm run build`. Run it again whenever text
set in the pixel face changes (headings, labels, navigation, numbers):

    python -I scripts/fonts/build-pixel-fonts.py <release-dir>

<release-dir> holds the unzipped Fusion Pixel `otf.woff2` releases
(https://github.com/TakWolf/fusion-pixel-font, OFL-1.1), i.e.
fusion-pixel-12px-proportional-zh_hans.otf.woff2 and the 10px variant.
Characters are collected from src/ and the data files, so a missing glyph
simply falls back to the system font until the script is re-run.

Outputs
  src/fonts/ld-pixel-12.woff2, src/fonts/ld-pixel-10.woff2  web subsets
  public/fonts/OFL.txt, public/fonts/LICENSES/               licences (Fusion Pixel and its sources)
  scripts/pixel/glyphs-12.json                               bitmaps for the OG image
"""

import json
import pathlib
import shutil
import sys

from fontTools import subset
from fontTools.pens.pointInsidePen import PointInsidePen
from fontTools.ttLib import TTFont

ROOT = pathlib.Path(__file__).resolve().parents[2]
SRC = pathlib.Path(sys.argv[1]).resolve()

FONTS = {
    "12": SRC / "fusion-pixel-12px-proportional-zh_hans.otf.woff2",
    "10": SRC / "fusion-pixel-10px-proportional-zh_hans.otf.woff2",
}


def collect_chars() -> set[str]:
    chars = {chr(c) for c in range(0x20, 0x7F)}
    chars |= set("，。、：；！？（）《》“”‘’—…·×→←↑↓↗°／｜")
    files = [p for p in (ROOT / "src").rglob("*") if p.suffix in {".astro", ".ts", ".css", ".mjs"}]
    files += [ROOT / "data" / "methodology.json", ROOT / "data" / "mods.json"]
    for f in files:
        text = f.read_text(encoding="utf-8")
        chars |= {ch for ch in text if ord(ch) > 0x7F and not ch.isspace()}
    return chars


def build_subset(src: pathlib.Path, out: pathlib.Path, chars: set[str]) -> None:
    opts = subset.Options()
    opts.flavor = "woff2"
    opts.layout_features = ["*"]
    opts.name_IDs = ["*"]
    opts.notdef_outline = True
    font = TTFont(src)
    sub = subset.Subsetter(options=opts)
    sub.populate(text="".join(sorted(chars)))
    sub.subset(font)
    out.parent.mkdir(parents=True, exist_ok=True)
    font.flavor = "woff2"
    font.save(out)


def bitmaps(src: pathlib.Path, text: str) -> dict:
    """Sample each glyph at pixel centres; a design pixel is 100 units."""
    font = TTFont(src)
    upm = font["head"].unitsPerEm
    px = upm // 12
    asc = font["hhea"].ascent // px
    desc = -font["hhea"].descent // px
    cmap = font.getBestCmap()
    gs = font.getGlyphSet()
    out = {"size": 12, "ascent": asc, "descent": desc, "glyphs": {}}
    for ch in sorted(set(text)):
        name = cmap.get(ord(ch))
        if name is None:
            continue
        adv = font["hmtx"][name][0] // px
        rows = []
        for row in range(asc + desc):
            y = (asc - row - 0.5) * px
            line = ""
            for col in range(adv):
                pen = PointInsidePen(gs, ((col + 0.5) * px, y))
                gs[name].draw(pen)
                line += "#" if pen.getResult() else "."
            rows.append(line)
        out["glyphs"][ch] = {"adv": adv, "rows": rows}
    return out


def main() -> None:
    chars = collect_chars()
    build_subset(FONTS["12"], ROOT / "src" / "fonts" / "ld-pixel-12.woff2", chars)
    build_subset(FONTS["10"], ROOT / "src" / "fonts" / "ld-pixel-10.woff2", chars)
    (ROOT / "public" / "fonts").mkdir(parents=True, exist_ok=True)
    shutil.copy(SRC / "OFL.txt", ROOT / "public" / "fonts" / "OFL.txt")
    if (SRC / "LICENSES").is_dir():
        shutil.copytree(SRC / "LICENSES", ROOT / "public" / "fonts" / "LICENSES", dirs_exist_ok=True)
    og_text = "".join(chr(c) for c in range(0x20, 0x7F)) + "×·—，。" + "把模组玩坏再写清楚怎么坏的测试记录已测条目轮次公开署名"
    glyphs = bitmaps(FONTS["12"], og_text)
    (ROOT / "scripts" / "pixel" / "glyphs-12.json").write_text(json.dumps(glyphs, ensure_ascii=False), encoding="utf-8")
    print(f"{len(chars)} characters; glyph bitmaps: {len(glyphs['glyphs'])}")


if __name__ == "__main__":
    main()
