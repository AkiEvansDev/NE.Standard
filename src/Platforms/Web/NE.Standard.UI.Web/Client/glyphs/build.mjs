// Builds the core's own glyph face: the marks the framework's chrome draws for itself (a chevron, a cross, a pencil, ...)
// and the few standard ones a package's chrome asks for (a sort arrow, a filter, a search), cut out of Material Symbols
// Rounded into `../fonts/NEGlyphs.woff2`. Run by hand (`npm run build` in this folder) when the table below changes; the
// file is committed, so a mirror builds without this folder.
//
// Subset by codepoint, never by ligature name: keeping the letters of a name keeps every ligature made of those
// letters, and ten names pulled in the whole 220 KB face. The codepoints are Google's own
// (google/material-design-icons, variablefont/MaterialSymbolsRounded[FILL,GRAD,opsz,wght].codepoints) and
// `mixins/glyphs.less` names the same set, as does `UIGlyphs` on the server; a new mark is added in all three places.
//
// The axes: `wght` pinned at 600, so a mark keeps the weight the drawn ones had at row sizes (the pack's icons sit at
// 400 beside text); `GRAD` at 0; `opsz` at 20, the drawing made for small sizes, since nothing here is drawn above
// 32px; `FILL` kept, because a pencil is filled and a calendar is not.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import subsetFont from "subset-font";

const SOURCE = "node_modules/material-symbols/material-symbols-rounded.woff2";
const OUTPUT = "../fonts/NEGlyphs.woff2";

const GLYPHS = [
    ["expand_more", 0xe5cf],
    ["close", 0xe5cd],
    ["more_horiz", 0xe5d3],
    ["more_vert", 0xe5d4],
    ["edit", 0xf097],
    ["person", 0xf0d3],
    ["image", 0xe3f4],
    ["keep", 0xf027],
    ["check", 0xe668],
    ["calendar_today", 0xe935],
    ["keep_off", 0xe6f9],
    ["menu", 0xe5d2],
    ["light_mode", 0xe518],
    ["dark_mode", 0xe51c],
    ["colorize", 0xe3b8],
    ["arrow_upward", 0xe5d8],
    ["arrow_downward", 0xe5db],
    ["swap_vert", 0xe8d5],
    ["first_page", 0xe5dc],
    ["last_page", 0xe5dd],
    ["filter_list", 0xe152],
    ["view_column", 0xe8ec],
    ["add", 0xe145],
    ["search", 0xef7a],
    ["delete", 0xe92e],
    ["remove", 0xe15b],
    ["fit_screen", 0xea10],
    ["find_replace", 0xe881],
    ["done_all", 0xe877]
];

const font = await subsetFont(readFileSync(SOURCE), String.fromCodePoint(...GLYPHS.map(([, codepoint]) => codepoint)), {
    targetFormat: "woff2",
    variationAxes: { wght: 600, GRAD: 0, opsz: 20 }
});

mkdirSync(resolve("../fonts"), { recursive: true });
writeFileSync(resolve(OUTPUT), font);

console.log(`${OUTPUT}: ${GLYPHS.length} glyphs, ${(font.length / 1024).toFixed(1)} KB`);

for (const [name, codepoint] of GLYPHS)
    console.log(`  ${name.padEnd(16)} \\${codepoint.toString(16)}`);
