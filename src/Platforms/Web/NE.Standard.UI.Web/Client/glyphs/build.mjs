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

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import subsetFont from "subset-font";

const SOURCE = "node_modules/material-symbols/material-symbols-rounded.woff2";
const OUTPUT = "../fonts/NEGlyphs.woff2";
const WPF_FONTS_DIR = "../../../../Wpf/NE.Standard.UI.Wpf.Abstractions/Fonts";

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
    ["arrow_back", 0xe5c4],
    ["swap_vert", 0xe8d5],
    ["first_page", 0xe5dc],
    ["last_page", 0xe5dd],
    ["filter_list", 0xe152],
    ["checklist", 0xe6b1],
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
    ["share", 0xe80d],
    ["send", 0xe163],
    ["drive_file_rename_outline", 0xe9a2],
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
    ["video_file", 0xeb87],
    ["format_bold", 0xe238],
    ["format_italic", 0xe23f],
    ["format_strikethrough", 0xe246],
    ["format_h1", 0xf85d],
    ["format_list_bulleted", 0xe241]
];

const WPF_EXTRA_GLYPHS = [
    ["expand_less", 0xe5ce],
    ["chevron_left", 0xe5cb],
    ["chevron_right", 0xe5cc]
];

const sourceBytes = readFileSync(SOURCE);
const font = await subsetFont(sourceBytes, String.fromCodePoint(...GLYPHS.map(([, codepoint]) => codepoint)), {
    targetFormat: "woff2",
    variationAxes: { wght: 600, GRAD: 0, opsz: 20 }
});

mkdirSync(resolve("../fonts"), { recursive: true });
writeFileSync(resolve(OUTPUT), font);

console.log(`${OUTPUT}: ${GLYPHS.length} glyphs, ${(font.length / 1024).toFixed(1)} KB`);

if (existsSync(resolve(WPF_FONTS_DIR))) {
    const wpfCodepoints = [...GLYPHS, ...WPF_EXTRA_GLYPHS].map(([, codepoint]) => codepoint);
    const wpfRaw = await subsetFont(sourceBytes, String.fromCodePoint(...wpfCodepoints), {
        targetFormat: "sfnt",
        variationAxes: { FILL: 0, wght: 600, GRAD: 0, opsz: 20 }
    });
    const wpfNamed = renameSfnt(Buffer.from(wpfRaw), "NE Glyphs", "NE-Glyphs");
    const wpfPath = resolve(WPF_FONTS_DIR, "NEGlyphs.ttf");

    writeFileSync(wpfPath, wpfNamed);
    console.log(`${wpfPath}: ${wpfCodepoints.length} glyphs, ${(wpfNamed.length / 1024).toFixed(1)} KB`);
}

for (const [name, codepoint] of GLYPHS)
    console.log(`  ${name.padEnd(16)} \\${codepoint.toString(16)}`);

function renameSfnt(sfnt, familyName, postScriptName) {
    const numTables = sfnt.readUInt16BE(4);
    const entries = [];

    for (let index = 0; index < numTables; index++) {
        const dirOffset = 12 + index * 16;
        const tag = sfnt.toString("ascii", dirOffset, dirOffset + 4);
        const offset = sfnt.readUInt32BE(dirOffset + 8);
        const length = sfnt.readUInt32BE(dirOffset + 12);

        entries.push({ tag, data: Buffer.from(sfnt.subarray(offset, offset + length)) });
    }

    const nameEntry = entries.find(entry => entry.tag === "name");
    const headEntry = entries.find(entry => entry.tag === "head");

    nameEntry.data = buildNameTable([
        [1, familyName],
        [2, "Regular"],
        [3, familyName],
        [4, familyName],
        [5, "Version 1.0"],
        [6, postScriptName]
    ]);
    headEntry.data.writeUInt32BE(0, 8);
    entries.sort((left, right) => left.tag.localeCompare(right.tag, "en"));

    const headerLength = 12 + entries.length * 16;
    let bodyLength = 0;

    for (const entry of entries)
        bodyLength += (entry.data.length + 3) & ~3;

    const output = Buffer.alloc(headerLength + bodyLength);

    sfnt.copy(output, 0, 0, 12);

    let cursor = headerLength;
    let headOffset = 0;

    for (let index = 0; index < entries.length; index++) {
        const entry = entries[index];
        const dirOffset = 12 + index * 16;

        if (entry.tag === "head")
            headOffset = cursor;

        entry.data.copy(output, cursor);
        output.write(entry.tag, dirOffset, 4, "ascii");
        output.writeUInt32BE(checksum(entry.data), dirOffset + 4);
        output.writeUInt32BE(cursor, dirOffset + 8);
        output.writeUInt32BE(entry.data.length, dirOffset + 12);
        cursor += (entry.data.length + 3) & ~3;
    }

    output.writeUInt32BE((0xb1b0afba - checksum(output)) >>> 0, headOffset + 8);

    return output;
}

function buildNameTable(records) {
    const encoded = records.map(([nameId, text]) => ({
        nameId,
        bytes: Buffer.from(text, "utf16le").swap16()
    }));
    const stringOffset = 6 + encoded.length * 12;
    const totalBytes = encoded.reduce((sum, item) => sum + item.bytes.length, 0);
    const table = Buffer.alloc(stringOffset + totalBytes);

    table.writeUInt16BE(0, 0);
    table.writeUInt16BE(encoded.length, 2);
    table.writeUInt16BE(stringOffset, 4);

    let storageCursor = 0;

    for (let index = 0; index < encoded.length; index++) {
        const recordOffset = 6 + index * 12;
        const { nameId, bytes } = encoded[index];

        table.writeUInt16BE(3, recordOffset);
        table.writeUInt16BE(1, recordOffset + 2);
        table.writeUInt16BE(0x0409, recordOffset + 4);
        table.writeUInt16BE(nameId, recordOffset + 6);
        table.writeUInt16BE(bytes.length, recordOffset + 8);
        table.writeUInt16BE(storageCursor, recordOffset + 10);
        bytes.copy(table, stringOffset + storageCursor);
        storageCursor += bytes.length;
    }

    return table;
}

function checksum(buffer) {
    const paddedLength = (buffer.length + 3) & ~3;
    let sum = 0;

    for (let offset = 0; offset < paddedLength; offset += 4) {
        const b0 = buffer[offset] ?? 0;
        const b1 = buffer[offset + 1] ?? 0;
        const b2 = buffer[offset + 2] ?? 0;
        const b3 = buffer[offset + 3] ?? 0;

        sum = (sum + (((b0 << 24) | (b1 << 16) | (b2 << 8) | b3) >>> 0)) >>> 0;
    }

    return sum;
}
