// Builds the core's own glyph face: the marks the framework's chrome draws for itself (a chevron, a cross, a pencil, ...)
// and the few standard ones a package's chrome asks for (a sort arrow, a filter, a search), cut out of Material Symbols
// Rounded into `../fonts/NEGlyphs.woff2`. Run by hand (`npm run build` in this folder) when the table below changes; the
// file is committed, so a mirror builds without this folder.
//
// Subset by codepoint, never by ligature name: keeping the letters of a name keeps every ligature made of those
// letters, and ten names pulled in the whole 220 KB face. The codepoints are Google's own
// (google/material-design-icons, variablefont/MaterialSymbolsRounded[FILL,GRAD,opsz,wght].codepoints) and
// `mixins/glyphs.less` names the same set, as do the `ne-` rules in `ui-icon.less` and `UIGlyphs` on the server; a new mark is
// added in all four places.
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
    ["done_all", 0xe877],
    ["numbers", 0xeac7],
    ["text_fields", 0xe262],
    ["toggle_on", 0xe9f6],
    ["abc", 0xeb94],
    ["visibility", 0xe8f4],
    ["sticky_note_2", 0xf1fc],
    ["hourglass", 0xebff],
    ["folder_open", 0xe2c8],
    ["description", 0xe873],
    ["save", 0xe161],
    ["restart_alt", 0xf053],
    ["exposure_plus_1", 0xe800],
    ["play_arrow", 0xe037],
    ["fast_forward", 0xe01f],
    ["stop", 0xe047],
    ["casino", 0xeb40],
    ["alt_route", 0xf184],
    ["join_inner", 0xeaf4],
    ["join_full", 0xf84f],
    ["block", 0xf08c],
    ["equal", 0xf77b],
    ["format_list_numbered", 0xe242],
    ["repeat", 0xe040],
    ["sort", 0xe164],
    ["fingerprint", 0xe90d],
    ["compress", 0xe94d],
    ["content_cut", 0xe14e],
    ["pin", 0xf045],
    ["regular_expression", 0xf750],
    ["calendar_add_on", 0xef85],
    ["date_range", 0xe916],
    ["event_note", 0xe616],
    ["call_merge", 0xe0b3],
    ["call_split", 0xe0b6],
    ["functions", 0xe24a],
    ["calculate", 0xea5f],
    ["compare_arrows", 0xe915],
    ["unfold_more", 0xe5d7],
    ["flag", 0xf0c6],
    ["swap_horiz", 0xe8d4],
    ["straighten", 0xe41c],
    ["rounded_corner", 0xe920],
    ["rotate_right", 0xe41a],
    ["flip", 0xe3e8],
    ["filter_b_and_w", 0xe3db],
    ["file_open", 0xeaf3],
    ["crop", 0xe3be],
    ["blur_on", 0xe3a5],
    ["aspect_ratio", 0xe85b],
    ["info", 0xe88e],
    ["check_circle", 0xf0be],
    ["warning", 0xf083],
    ["error", 0xf8b6],
    ["help", 0xe8fd],
    ["content_copy", 0xe14d],
    ["undo", 0xe166],
    ["redo", 0xe15a],
    ["refresh", 0xe5d5],
    ["settings", 0xe8b8],
    ["open_in_new", 0xe89e],
    ["link", 0xe250],
    ["upload", 0xf09b],
    ["download", 0xf090],
    ["attach_file", 0xe226],
    ["visibility_off", 0xe8f5],
    ["zoom_in", 0xe8ff],
    ["zoom_out", 0xe900],
    ["fullscreen", 0xe5d0],
    ["fullscreen_exit", 0xe5d1],
    ["drag_indicator", 0xe945],
    ["unfold_less", 0xe5d6],
    ["history", 0xe8b3],
    ["folder", 0xe2c7],
    ["create_new_folder", 0xe2cc],
    ["note_add", 0xe89c],
    ["code", 0xe86f],
    ["data_object", 0xead3],
    ["terminal", 0xeb8e],
    ["cloud", 0xf15c],
    ["storage", 0xe1db],
    ["lock", 0xe899],
    ["lock_open", 0xe898],
    ["star", 0xf09a],
    ["home", 0xe9b2],
    ["logout", 0xe9ba],
    ["draft", 0xe66d],
    ["picture_as_pdf", 0xe415],
    ["text_snippet", 0xf1c6],
    ["table_chart", 0xe265],
    ["slideshow", 0xe41b],
    ["folder_zip", 0xeb2c],
    ["audio_file", 0xeb82],
    ["video_file", 0xeb87]
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
