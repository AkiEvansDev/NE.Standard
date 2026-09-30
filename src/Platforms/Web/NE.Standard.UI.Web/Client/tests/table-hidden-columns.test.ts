// A column the author hides: at every width when it starts hidden, below its tier otherwise — the word the viewer's own choice in a
// chooser outranks, and a choice that says the same is not kept.

import assert from "node:assert/strict";
import test from "node:test";
import { installFakeDom } from "./fake-dom.ts";

// A viewport of the widest tier: every `min-width` query matches, so no tier hides a column.
installFakeDom({ matchMedia: () => ({ matches: true, addEventListener: () => undefined }) });

const { hiddenByAuthor } = await import("../src/interactions/table-columns-engine.ts");

test("a column that starts hidden is the author's hidden one at every width, beside one hidden below a tier", () => {
    assert.equal(hiddenByAuthor({ startsHidden: true, hideBelow: null }), true);
    assert.equal(hiddenByAuthor({ startsHidden: true, hideBelow: "md" }), true);
    assert.equal(hiddenByAuthor({ startsHidden: false, hideBelow: "md" }), false);
    assert.equal(hiddenByAuthor({ startsHidden: false, hideBelow: null }), false);
});
