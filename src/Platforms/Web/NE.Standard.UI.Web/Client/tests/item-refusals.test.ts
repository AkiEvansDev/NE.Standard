// A row's refusals — no drag, no choice, no removal — read off its wrapper, where the item says so, or off the component it wraps,
// where the row's template says so: an items view draws the template inside the wrapper, and either refusing wins. A bound tab is
// such a row: its template's marks stand on the tab, inside the wrapper its tabs view draws around it.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, installFakeDom, real } from "./fake-dom.ts";

installFakeDom();

const { isItemRefused } = await import("../src/interactions/interactive-state.ts");
const { isLiftable } = await import("../src/interactions/item-drags.ts");
const { removableRows } = await import("../src/interactions/items-selection-engine.ts");
const { itemSelection } = await import("../src/interactions/row-selection.ts");
const { isTabRefused } = await import("../src/interactions/tab-rows.ts");

type List = { readonly root: FakeElement; readonly host: FakeElement; readonly rows: FakeElement[]; readonly templates: FakeElement[] };

/** An items view whose rows each wrap their template's root, a component of its own. */
function list(keys: readonly string[]): List {
    const host = FakeElement.of("ui-items-view__host", { "data-ui-items-host": "" });
    const root = FakeElement.of("ui-items-view", { "data-ui-id": "1", "data-ui-selection": "many" }).append(host);
    const templates = keys.map(key => FakeElement.of("ui-container", { "data-ui-id": `1-${key}` }));
    const rows = keys.map((key, index) => FakeElement.of("ui-items-view__item", { "data-ui-key": key }).append(templates[index]));

    host.append(...rows);

    return { root, host, rows, templates };
}

test("a template's refusal on the component its row wraps refuses as the item's on the wrapper does", () => {
    const { rows, templates } = list(["a", "b", "c"]);

    rows[1].setAttribute("data-ui-undraggable", "");
    templates[2].setAttribute("data-ui-undraggable", "");

    assert.equal(isItemRefused(real(rows[0]), "data-ui-undraggable"), false);
    assert.equal(isItemRefused(real(rows[1]), "data-ui-undraggable"), true);
    assert.equal(isItemRefused(real(rows[2]), "data-ui-undraggable"), true);
});

test("the template's root is read a level below a part the row draws around it, and a component inside the template is not", () => {
    const grip = FakeElement.of("ui-row-grip-frame").append(FakeElement.of("ui-container", { "data-ui-id": "t", "data-ui-unremovable": "" }));
    const framed = FakeElement.of("ui-items-view__item", { "data-ui-key": "a" }).append(grip);
    const inner = FakeElement.of("ui-button", { "data-ui-id": "b", "data-ui-unremovable": "" });
    const nested = FakeElement.of("ui-items-view__item", { "data-ui-key": "b" }).append(FakeElement.of("ui-container", { "data-ui-id": "t" }).append(inner));

    assert.equal(isItemRefused(real(framed), "data-ui-unremovable"), true);
    assert.equal(isItemRefused(real(nested), "data-ui-unremovable"), false);
});

test("a row whose template refuses the drag is not lifted", () => {
    const { rows, templates } = list(["a", "b"]);

    templates[1].setAttribute("data-ui-undraggable", "");

    assert.equal(isLiftable(real(rows[0])), true);
    assert.equal(isLiftable(real(rows[1])), false);
});

test("a select-all leaves a row whose template refuses the choice", () => {
    const { root, host, rows, templates } = list(["a", "b"]);

    templates[1].setAttribute("data-ui-unselectable", "");
    itemSelection.setSelected(real(root), rows.map(real), true);

    assert.deepEqual(JSON.parse(host.getAttribute("data-ui-selected-keys") ?? "[]"), ["a"]);
});

test("a Delete on the chosen rows leaves a row whose template refuses the removal", () => {
    const { rows, templates } = list(["a", "b", "c"]);

    for (const row of rows)
        row.setAttribute("data-ui-selected", "");

    templates[1].setAttribute("data-ui-unremovable", "");

    assert.deepEqual(removableRows(rows.map(real), real(rows[0])), [rows[0], rows[2]]);
});

test("a wrapped tab whose template refuses the drag or the rename is refused it, as a bare tab marked so is", () => {
    const tab = (key: string): FakeElement => FakeElement.of("ui-tab-item", { "data-ui-id": `2-${key}` });
    const wrapped = [tab("a"), tab("b"), tab("c")];
    const bare = tab("d");
    const host = FakeElement.of("ui-tabs-view__strip", { "data-ui-items-host": "" })
        .append(...wrapped.map((item, index) => FakeElement.of("ui-tabs-view__item", { "data-ui-key": String(index) }).append(item)), bare);

    FakeElement.of("ui-tabs-view", { "data-ui-id": "2" }).append(host);

    wrapped[1].setAttribute("data-ui-undraggable", "");
    wrapped[2].setAttribute("data-ui-unrenamable", "");
    bare.setAttribute("data-ui-unrenamable", "");

    assert.deepEqual(wrapped.map(item => isTabRefused(real(item), "data-ui-undraggable")), [false, true, false]);
    assert.deepEqual(wrapped.map(item => isTabRefused(real(item), "data-ui-unrenamable")), [false, false, true]);
    assert.equal(isTabRefused(real(bare), "data-ui-unrenamable"), true);
    assert.equal(isTabRefused(real(bare), "data-ui-undraggable"), false);
});
