// Items taken out of one list onto another component that takes their kind, by a drag or by Ctrl+X/Ctrl+C and Ctrl+V: what the drop
// carries, where it lands, what the drag allows and marks, and the refusals — a disabled source or target, the source's own rows, a
// drag that is not the page's items.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, FakeKeyboardEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

class FakeDataTransfer {
    public effectAllowed = "";
    public dropEffect = "";
    public readonly types: string[] = [];

    public setData(type: string): void {
        if (!this.types.includes(type))
            this.types.push(type);
    }
}

class FakeDragEvent extends FakeEvent {
    public readonly dataTransfer: FakeDataTransfer;
    public relatedTarget: FakeElement | null = null;
    public clientX = 0;
    public clientY = 0;

    public constructor(type: string, dataTransfer = new FakeDataTransfer()) {
        super(type);
        this.dataTransfer = dataTransfer;
    }
}

class FakePointerEvent extends FakeEvent {
    public readonly button = 0;
}

class FakeCustomEvent extends FakeEvent {
    public readonly detail: unknown;

    public constructor(type: string, init: { readonly detail?: unknown } = {}) {
        super(type);
        this.detail = init.detail ?? null;
    }
}

installFakeDom({ DragEvent: FakeDragEvent, PointerEvent: FakePointerEvent, CustomEvent: FakeCustomEvent });

const { ItemDragEngine } = await import("../src/interactions/item-drag-engine.ts");
const { ItemsReorderEngine } = await import("../src/interactions/items-reorder-engine.ts");
const { allowedEffect, carriedRows, offeredItems } = await import("../src/interactions/item-drags.ts");

type List = { readonly root: FakeElement; readonly host: FakeElement; readonly rows: FakeElement[] };

/** A list keyed `id` of rows 10 pixels tall; a wrapping one's rows are `display: contents`, drawn by their tiles alone. */
function list(id: string, keys: readonly string[], attributes: Readonly<Record<string, string>> = {}, wrap = false): List {
    const host = FakeElement.of("ui-items-view__host", { "data-ui-items-host": "" });
    const root = FakeElement.of(wrap ? "ui-items-view ui-items-view--wrap" : "ui-items-view", { "data-ui-id": id, ...attributes }).append(host);
    const rows = keys.map((key, index) => {
        const row = FakeElement.of("ui-items-view__item", { "data-ui-key": key }).append(FakeElement.of("ui-text", { "data-ui-id": `${id}-${key}` }));

        row.laidOut = !wrap;
        row.rect = { left: 0, top: index * 10, width: 100, height: 10 };

        return row;
    });

    host.append(...rows);

    return { root, host, rows };
}

/** A list offering its rows as cards and taking cards. */
const Cards = { "data-ui-drag-kind": "card", "data-ui-drag-effects": "move copy", "data-takes": "card" };

type Page = { readonly page: FakeElement; readonly drops: { readonly target: FakeElement; readonly detail: { readonly drop: Record<string, unknown>; readonly transfer: unknown } }[] };

/** The components on a page under both engines; every `drop:card` raised on it recorded with the component it was raised on. */
function page(...components: FakeElement[]): Page {
    const root = FakeElement.of("page").append(...components);
    const drops: Page["drops"][number][] = [];

    fakeDocument.body.replaceChildren(root);
    root.addEventListener("drop:card", domEvent => drops.push({ target: domEvent.target!, detail: (domEvent as unknown as FakeCustomEvent).detail as Page["drops"][number]["detail"] }));
    new ItemsReorderEngine({ root: real(root) });
    new ItemDragEngine({ root: real(root), targetOf: (element, kind) => element.closest<HTMLElement>(`[data-takes="${kind}"]`) });

    return { page: root, drops };
}

function chord(target: FakeElement, code: string): FakeKeyboardEvent {
    const domEvent = Object.assign(new FakeKeyboardEvent("", target), { code, ctrlKey: true, metaKey: false, altKey: false, shiftKey: false });

    target.dispatchEvent(domEvent);

    return domEvent;
}

function drag(type: string, target: FakeElement, dataTransfer: FakeDataTransfer, clientY = 0): FakeDragEvent {
    const domEvent = Object.assign(new FakeDragEvent(type, dataTransfer), { clientY });

    target.dispatchEvent(domEvent);

    return domEvent;
}

test("Ctrl+C in a wrapping list takes the cursor's tile, and Ctrl+V lands it at the end of a list with no cursor, after a chosen row", () => {
    const source = list("1", ["a", "b"], Cards, true);
    const target = list("2", ["x", "y"], Cards);
    const { drops } = page(source.root, target.root);

    source.rows[1].setAttribute("data-ui-row-focus", "");

    assert.equal(chord(source.root, "KeyC").defaultPrevented, true);
    assert.equal(chord(target.root, "KeyV").defaultPrevented, true);
    assert.deepEqual(drops[0].detail.drop, { kind: "card", source: null, keys: ["b"], index: 2, folder: null, effect: "copy" });
    assert.equal(drops[0].detail.transfer, null);

    // A copy may be pasted again.
    target.rows[0].setAttribute("data-ui-selected", "");
    chord(target.root, "KeyV");

    assert.equal(drops[1].detail.drop.index, 1);
});

test("Ctrl+X is the plain drag: a move into a list of its kind, its rows moved ahead, and a copy into a component of another kind", () => {
    const source = list("1", ["a", "b"], Cards);
    const target = list("2", ["x"], Cards);
    const field = FakeElement.of("ui-input", { "data-ui-id": "3", "data-takes": "card" });
    const { drops } = page(source.root, target.root, field);

    source.rows[0].setAttribute("data-ui-row-focus", "");

    chord(source.root, "KeyX");
    assert.equal(source.rows[0].classList.contains("ui-row--cut"), true);

    chord(target.root, "KeyV");
    assert.equal(drops[0].detail.drop.effect, "move");
    assert.notEqual(drops[0].detail.transfer, null);
    assert.equal(source.rows[0].classList.contains("ui-row--cut"), false);

    chord(source.root, "KeyX");
    chord(field, "KeyV");
    assert.equal(drops[1].target, field);
    assert.equal(drops[1].detail.drop.effect, "copy");
    assert.equal(drops[1].detail.transfer, null);
});

test("a disabled source gives nothing to Ctrl+C, and a disabled target takes no paste", () => {
    const source = list("1", ["a"], Cards);
    const target = list("2", ["x"], Cards);
    const { drops } = page(source.root, target.root);

    source.rows[0].setAttribute("data-ui-row-focus", "");
    source.root.classes.add("ui-disabled");

    assert.equal(chord(source.root, "KeyC").defaultPrevented, false);
    chord(target.root, "KeyV");

    source.root.classes.delete("ui-disabled");
    target.root.classes.add("ui-loading");
    chord(source.root, "KeyC");

    assert.equal(chord(target.root, "KeyV").defaultPrevented, false);
    assert.deepEqual(drops, []);
});

test("a paste in the source itself drops nothing on a component around it that takes the kind", () => {
    const source = list("1", ["a"], { "data-ui-drag-kind": "card", "data-ui-drag-effects": "copy" });
    const around = FakeElement.of("ui-container", { "data-ui-id": "9", "data-takes": "card" }).append(source.root);
    const { drops } = page(around);

    source.rows[0].setAttribute("data-ui-row-focus", "");
    chord(source.root, "KeyC");

    assert.equal(chord(source.root, "KeyV").defaultPrevented, false);
    assert.deepEqual(drops, []);
});

test("a chosen row the host refuses to lift stays behind when the chosen rows are taken", () => {
    const source = list("1", ["a", "b", "c"], Cards);

    for (const row of source.rows)
        row.setAttribute("data-ui-selected", "");

    source.rows[1].setAttribute("data-ui-undraggable", "");
    source.rows[2].classes.add("ui-disabled");

    assert.deepEqual(carriedRows(real(source.rows[0]), real(source.rows)), [source.rows[0]]);

    const items = offeredItems(real(source.root), real(source.host), carriedRows(real(source.rows[0]), real(source.rows)));

    assert.deepEqual(items?.keys, ["a"]);
});

test("a drag of rows that also move among themselves allows a move whatever the kind is offered for", () => {
    const copyOnly = offeredItems(real(FakeElement.of("ui-items-view", { "data-ui-drag-kind": "card", "data-ui-drag-effects": "copy" })), real(FakeElement.of("")), [real(FakeElement.of(""))]);

    assert.equal(allowedEffect(copyOnly, true), "copyMove");
    assert.equal(allowedEffect(copyOnly, false), "copy");
    assert.equal(allowedEffect(null, true), "move");

    const source = list("1", ["a", "b"], { "data-ui-rows-draggable": "", "data-ui-drag-kind": "card", "data-ui-drag-effects": "copy" });
    const dataTransfer = new FakeDataTransfer();

    page(source.root);
    source.rows[0].dispatchEvent(new FakePointerEvent("pointerdown"));
    drag("dragstart", source.rows[0], dataTransfer);

    assert.equal(dataTransfer.effectAllowed, "copyMove");
    assert.equal(drag("dragover", source.rows[1], dataTransfer, 17).dataTransfer.dropEffect, "move");
});

test("a drag that only offers the rows keeps its lift until it ends, and takes its marks off as it does", () => {
    const source = list("1", ["a", "b"], Cards);
    const dataTransfer = new FakeDataTransfer();
    const [first] = source.rows;

    page(source.root);
    first.dispatchEvent(new FakePointerEvent("pointerdown"));
    drag("dragstart", first, dataTransfer);
    first.dispatchEvent(new FakePointerEvent("pointercancel"));

    assert.equal(real<{ draggable: boolean }>(first).draggable, true);
    assert.equal(first.classList.contains("ui-row--dragging"), true);

    drag("dragend", first, dataTransfer);

    assert.equal(real<{ draggable: boolean }>(first).draggable, false);
    assert.equal(first.classList.contains("ui-row--dragging"), false);
});

test("a drag over the source's own rows is no drop on the component around it; one over another list of the kind is", () => {
    const source = list("1", ["a", "b"], { "data-ui-rows-draggable": "", ...Cards });
    const around = FakeElement.of("ui-container", { "data-ui-id": "9", "data-takes": "card" }).append(source.root);
    const target = list("2", ["x"], Cards);
    const { drops } = page(around, target.root);
    const dataTransfer = new FakeDataTransfer();
    const moves: number[] = [];

    source.root.addEventListener("move", domEvent => moves.push((domEvent as unknown as FakeCustomEvent & { detail: { index: number } }).detail.index));
    source.rows[0].dispatchEvent(new FakePointerEvent("pointerdown"));
    drag("dragstart", source.rows[0], dataTransfer);
    drag("dragover", source.rows[1], dataTransfer, 17);

    assert.equal(around.hasAttribute("data-ui-item-drop-over"), false);

    drag("drop", source.rows[1], dataTransfer, 17);

    assert.deepEqual(moves, [1]);
    assert.deepEqual(drops, []);

    source.rows[0].dispatchEvent(new FakePointerEvent("pointerdown"));
    drag("dragstart", source.rows[0], dataTransfer);

    assert.equal(drag("dragover", target.rows[0], dataTransfer, 7).defaultPrevented, true);
    assert.equal(target.rows[0].getAttribute("data-ui-row-drop"), "after");
});

test("a drag that carries none of the page's items, a file from the desktop, is left alone though a drag of items never ended", () => {
    const source = list("1", ["a"], Cards);
    const target = list("2", ["x"], Cards);
    const dataTransfer = new FakeDataTransfer();

    page(source.root, target.root);
    source.rows[0].dispatchEvent(new FakePointerEvent("pointerdown"));
    drag("dragstart", source.rows[0], dataTransfer);

    const file = new FakeDataTransfer();

    file.types.push("Files");

    assert.equal(drag("dragover", target.rows[0], file).defaultPrevented, false);
    assert.equal(drag("dragover", target.rows[0], dataTransfer).defaultPrevented, true);
});
