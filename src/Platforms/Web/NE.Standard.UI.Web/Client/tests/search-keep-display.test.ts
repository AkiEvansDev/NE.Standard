// A Keep search shows the chosen option while its field holds no term and is not in use, and the term whenever there is one: the
// stylesheet tells "no term" by `:placeholder-shown`, so the engine keeps a hint on every search field, an empty one where none was.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";
import { FakeElement, FakeInput, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

installFakeDom({
    window: { addEventListener: () => undefined, setTimeout, innerWidth: 1280, innerHeight: 900 },
    getComputedStyle: () => ({ transform: "none", filter: "none", perspective: "none", direction: "ltr" }),
    MutationObserver: class {
        public observe(): void {
        }

        public disconnect(): void {
        }
    },
    ResizeObserver: class {
        public observe(): void {
        }

        public unobserve(): void {
        }
    }
});

const { SelectInteractionEngine } = await import("../src/interactions/select-interaction-engine.ts");

function search(placeholder?: string): FakeInput {
    const field = Object.assign(new FakeInput("search"), { className: "ui-search__input" });
    const trigger = FakeElement.of("ui-select__trigger", { "data-ui-select-trigger-mode": "input" }, "div").append(field);
    const popup = FakeElement.of("ui-select__popup", { role: "listbox" });
    const select = FakeElement.of("ui-search ui-select", { "data-ui-id": "3" }).append(trigger, popup);

    if (placeholder !== undefined)
        field.setAttribute("placeholder", placeholder);

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(select);

    return field;
}

test("a search field with no hint is given an empty one, and an author's hint is left as it is", () => {
    const bare = search();

    new SelectInteractionEngine({ root: real<ParentNode>(fakeDocument.body) });
    assert.equal(bare.getAttribute("placeholder"), "");

    const hinted = search("Search regions");

    new SelectInteractionEngine({ root: real<ParentNode>(fakeDocument.body) });
    assert.equal(hinted.getAttribute("placeholder"), "Search regions");
});

test("a Keep field shows the chosen option only with no term and not in use, its field stepping aside only where the option is drawn", async () => {
    const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
    const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;

    assert.match(css, /\.ui-search:not\(\.ui-search-mode--replace\):is\(\.ui-select--open, :focus-within, :has\(\.ui-search__input:not\(:placeholder-shown\)\)\) \.ui-select__trigger-content \{\s*display: none !important;/);
    assert.match(css, /\.ui-search:not\(\.ui-search-mode--replace\)\[data-ui-select-value\]:not\(\.ui-select--open, :focus-within\):has\(\.ui-select__trigger-content\):has\(\.ui-search__input:placeholder-shown\) \.ui-search__input \{[^}]*clip: rect\(0, 0, 0, 0\);/);
});
