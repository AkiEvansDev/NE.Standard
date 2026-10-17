// A search whose list `OnSearch` answers says it is waiting: its listbox is busy to a screen reader from the query's command taken to
// its answer, and past 300 ms the glyph in its field turns into the loading ring, so a quick answer never blinks it. A query asked
// while one is unanswered keeps the wait; it ends with the last answer, whatever came of it. The ring is the loading ring every
// waiting control wears, and keeps turning under reduced motion.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test, { mock } from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";
import { FakeElement, installFakeDom, real } from "./fake-dom.ts";

mock.timers.enable({ apis: ["setTimeout"] });

installFakeDom({ window: { addEventListener: () => undefined, setTimeout, clearTimeout } });

const { SearchEvent } = await import("../src/interactions/search-input-engine.ts");

type Search = { readonly field: FakeElement; readonly input: FakeElement; readonly list: FakeElement };

/** A search as the renderer draws it: the field over the list in its popup. */
function search(): Search {
    const input = FakeElement.of("ui-search__input ui-field", { type: "search" }, "input");
    const field = FakeElement.of("ui-search__field ui-field-box").append(FakeElement.of("ui-search__glyph ui-icon", { "data-ui-icon": "" }), input);
    const list = FakeElement.of("ui-select__list", { role: "listbox" });

    FakeElement.of("ui-search ui-select", { "data-ui-id": "4" }).append(
        FakeElement.of("ui-select__popup").append(FakeElement.of("ui-search__head").append(field), list)
    );

    return { field, input, list };
}

function context(input: FakeElement): Parameters<NonNullable<typeof SearchEvent.registration.started>>[0] {
    return real({ domEvent: { target: input }, component: input, componentId: 4, dynamicParameters: [] });
}

function ask(input: FakeElement): void {
    SearchEvent.registration.started!(context(input));
}

function answer(input: FakeElement): void {
    SearchEvent.registration.completed!({ ...context(input), dispatched: true, success: true });
}

function waiting(field: FakeElement): boolean {
    return field.hasAttribute("data-ui-search-waiting");
}

test("a query answered within the moment shows no ring; its list is busy until the answer", () => {
    const { field, input, list } = search();

    ask(input);
    assert.equal(list.getAttribute("aria-busy"), "true");

    mock.timers.tick(299);
    answer(input);
    mock.timers.tick(1000);

    assert.equal(waiting(field), false);
    assert.equal(list.hasAttribute("aria-busy"), false);
});

test("a query unanswered past the moment turns the glyph into the ring until its answer", () => {
    const { field, input } = search();

    ask(input);
    mock.timers.tick(300);
    assert.equal(waiting(field), true);

    answer(input);
    assert.equal(waiting(field), false);
});

test("a query asked while one is unanswered keeps the ring until the last answer", () => {
    const { field, input, list } = search();

    ask(input);
    mock.timers.tick(400);
    ask(input);
    answer(input);
    assert.equal(waiting(field), true);
    assert.equal(list.getAttribute("aria-busy"), "true");

    answer(input);
    assert.equal(waiting(field), false);
    assert.equal(list.hasAttribute("aria-busy"), false);

    // An answer with nothing asked ends nothing it should not.
    answer(input);
    assert.equal(waiting(field), false);
});

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;

test("the waiting field's glyph is the loading ring in its place, and keeps turning under reduced motion", () => {
    const selector = ".ui-search__field[data-ui-search-waiting] > .ui-search__glyph::before";
    const start = css.indexOf(`\n${selector} {`);

    assert.ok(start >= 0, "no rule turns the glyph into the ring");

    const body = css.slice(css.indexOf("{", start) + 1, css.indexOf("}", start));

    assert.match(body, /content: "";/);
    assert.match(body, /mask: none;/);
    assert.match(body, /animation: ui-spin 800ms linear infinite;/);

    const reduced = css.slice(css.indexOf("@media (prefers-reduced-motion: reduce)"));

    assert.ok(reduced.slice(0, reduced.indexOf("animation-iteration-count: infinite !important")).includes(selector));
});
