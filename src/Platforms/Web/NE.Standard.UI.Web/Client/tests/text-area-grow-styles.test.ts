// Read back from the compiled stylesheet: a growing text area sizes its height to its text and nothing else, so a root that would
// shrink to its content (an alignment other than Stretch) fills its room instead of narrowing to the placeholder and widening per key.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;

test("a growing area's root, marked by the render, fills its room, an authored width still winning", () => {
    const rule = /\n\.ui-text-area\.ui-text-area--grow \{([^}]*)\}/.exec(css)?.[1] ?? "";

    assert.match(rule, /width: var\(--ui-width-xxl, [^;]*var\(--ui-width, var\(--ui-fill-width\)\)/);
});

test("a growing area's field still sizes its height to its text, between its rows and its most rows", () => {
    const field = /\.ui-text-area__field\[data-ui-text-area-grow\] \{([^}]*)\}/.exec(css)?.[1] ?? "";

    assert.match(field, /field-sizing: content;/);
    assert.match(field, /max-height: calc\(var\(--ui-text-area-max-rows\)/);
});
