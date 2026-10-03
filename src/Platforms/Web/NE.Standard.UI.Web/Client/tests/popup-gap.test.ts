// Every popup that opens from something stands the one popup gap off it (`PopupGap`, anchored-popup.ts): no engine keeps a number
// of its own, save the popups with an arrow and the bar over its host, which are not opened from a control.

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const sourceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../src");

// A tooltip's and a slider's bubble's gap holds their arrow; an action bar stands over its host, as a host may set it.
const OwnGap = new Set(["interactions/tooltip-engine.ts", "interactions/range-value-engine.ts", "interactions/action-bar-engine.ts"]);

function sources(directory: string): string[] {
    return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
        const path = join(directory, entry.name);

        return entry.isDirectory() ? sources(path) : entry.name.endsWith(".ts") ? [path] : [];
    });
}

const files = sources(sourceRoot).map(path => ({ name: relative(sourceRoot, path).replaceAll("\\", "/"), text: readFileSync(path, "utf8") }));

test("no engine places a popup at a gap of its own: the framework's is left unset", () => {
    const placing = files.filter(file => /placement: \{|placeAnchoredPopup\(/.test(file.text) && !OwnGap.has(file.name) && file.name !== "interactions/anchored-popup.ts");

    assert.notEqual(placing.length, 0);

    for (const file of placing)
        assert.doesNotMatch(file.text, /\bgap: /, `${file.name} sets a popup gap of its own`);
});

test("the popup gap is one number, kept in one place", () => {
    const anchored = files.find(file => file.name === "interactions/anchored-popup.ts");

    assert.match(anchored?.text ?? "", /export const PopupGap = 4;/);

    for (const file of files.filter(each => each.name !== "interactions/anchored-popup.ts"))
        assert.doesNotMatch(file.text, /const (Popup|Menu|Content)Gap = /, `${file.name} keeps its own copy of the popup gap`);
});
