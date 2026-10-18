// A trail's first step stands its words on the trail's edge, read back from the compiled stylesheet: the host hangs out by the
// padding a step keeps by default, so every wrapped line's first step stands on the edge alike.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;

test("the trail hangs out by a step's default padding, so a line's first words stand on its edge", () => {
    const step = /\n\.ui-breadcrumb \{([^}]*)\}/.exec(css)?.[1] ?? "";
    const host = /\n\.ui-breadcrumbs__host \{([^}]*)\}/.exec(css)?.[1] ?? "";

    // The hang is the step's own default padding, so the two cannot drift apart.
    assert.match(step, /padding: var\(--ui-padding-xxl, [^;]*var\(--ui-padding, 0\.25rem\)+;/);
    assert.match(host, /margin-inline-start: -0\.25rem;/);
});
