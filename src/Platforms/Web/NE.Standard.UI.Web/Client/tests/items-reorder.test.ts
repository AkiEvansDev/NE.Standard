// A row of an items view or a table put in another place by the reader: the index it takes, what a drop between two rows and
// Alt+Up/Alt+Down raise, the offset a windowed host adds, and the refusals — a row that may not move, a host whose rows do not, a
// sort that would put the row back, a place in another group — and the row standing in its new place until the command's answer.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, FakeKeyboardEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

class FakeDragEvent extends FakeEvent {
    public readonly dataTransfer = { effectAllowed: "", dropEffect: "", setData: (): void => undefined };
    public relatedTarget: FakeElement | null = null;
    public clientX = 0;
    public clientY = 0;
}

class FakePointerEvent extends FakeEvent {
    public readonly button = 0;
}

/** A row's `move`, which the fake DOM aims at the row it is raised on, as it does its own events. */
class FakeCustomEvent extends FakeEvent {
    public readonly detail: unknown;

    public constructor(type: string, init: { readonly detail?: unknown } = {}) {
        super(type);
        this.detail = init.detail ?? null;
    }
}

installFakeDom({ DragEvent: FakeDragEvent, PointerEvent: FakePointerEvent, CustomEvent: FakeCustomEvent });

const { ItemsReorderEngine, itemMoveEvent, movedIndex } = await import("../src/interactions/items-reorder-engine.ts");
const { PendingMoves } = await import("../src/items/pending-moves.ts");
const { RowGripDecorator } = await import("../src/items/row-grip.ts");

test("a row put beside another takes the index the collection's Move puts it at, and none where it would not move", () => {
    const order = ["a", "b", "c", "d"];

    assert.equal(movedIndex(order, "a", "c", "after"), 2);
    assert.equal(movedIndex(order, "d", "b", "before"), 1);
    assert.equal(movedIndex(order, "a", "d", "after"), 3);
    assert.equal(movedIndex(order, "c", "a", "before"), 0);
    assert.equal(movedIndex(order, "b", "c", "before"), null);
    assert.equal(movedIndex(order, "b", "a", "after"), null);
    assert.equal(movedIndex(order, "b", "b", "after"), null);
    assert.equal(movedIndex(order, "x", "a", "before"), null);
});

type List = { readonly root: FakeElement; readonly host: FakeElement; readonly rows: FakeElement[]; readonly moves: number[] };

/**
 * An items view whose rows a, b and c stand 10 pixels tall each, its rows draggable, the keyboard's cursor on b; each row in the group
 * `groups` names at its place, where it names one.
 */
function list(hostAttributes: Readonly<Record<string, string>> = {}, groups: readonly (string | null)[] = []): List {
    const host = FakeElement.of("", { "data-ui-items-host": "", ...hostAttributes });
    const root = FakeElement.of("ui-items-view", { "data-ui-id": "5", "data-ui-rows-draggable": "" }).append(host);
    const rows = ["a", "b", "c"].map((key, index) => {
        const group = groups[index] ?? null;
        const row = FakeElement.of("ui-items-view__item", { "data-ui-key": key, ...(group === null ? {} : { "data-ui-group": group }) })
            .append(FakeElement.of("ui-text", { "data-ui-id": "6" }));

        row.rect = { left: 0, top: index * 10, width: 100, height: 10 };

        return row;
    });
    const moves: number[] = [];

    host.append(...rows);
    rows[1].setAttribute("data-ui-row-focus", "");
    fakeDocument.body.replaceChildren(root);
    root.addEventListener("move", domEvent => moves.push((domEvent as unknown as CustomEvent<{ index: number }>).detail.index));

    return { root, host, rows, moves };
}

function altKey(target: FakeElement, key: string): FakeKeyboardEvent {
    const domEvent = Object.assign(new FakeKeyboardEvent(key, target), { altKey: true, ctrlKey: false, metaKey: false, shiftKey: false });

    target.dispatchEvent(domEvent);

    return domEvent;
}

test("Alt+Down and Alt+Up move the keyboard's row one place past its neighbour, and take the keys at an end", () => {
    const view = list();

    new ItemsReorderEngine({ root: real(view.root) });

    assert.equal(altKey(view.root, "ArrowDown").defaultPrevented, true);
    assert.equal(altKey(view.root, "ArrowUp").defaultPrevented, true);
    assert.deepEqual(view.moves, [2, 0]);

    view.rows[1].removeAttribute("data-ui-row-focus");
    view.rows[0].setAttribute("data-ui-row-focus", "");

    assert.equal(altKey(view.root, "ArrowUp").defaultPrevented, true);
    assert.deepEqual(view.moves, [2, 0]);
});

test("a windowed host's row takes its place in the whole query, the window's offset added", () => {
    const view = list({ "data-ui-host-mode": "windowed", "data-ui-window-offset": "40" });

    new ItemsReorderEngine({ root: real(view.root) });
    altKey(view.root, "ArrowUp");

    assert.deepEqual(view.moves, [40]);
});

test("a row that may not move, a host whose rows do not and a sorted host leave Alt and an arrow alone", () => {
    const refused = list();

    refused.rows[1].setAttribute("data-ui-undraggable", "");
    new ItemsReorderEngine({ root: real(refused.root) });

    assert.equal(altKey(refused.root, "ArrowDown").defaultPrevented, false);

    const still = list();

    still.root.removeAttribute("data-ui-rows-draggable");
    new ItemsReorderEngine({ root: real(still.root) });

    assert.equal(altKey(still.root, "ArrowDown").defaultPrevented, false);

    const sorted = list();
    const services = { metadata: { getItemsFilterSortMetadata: () => undefined }, state: {}, keysOf: () => null };

    sorted.root.append(FakeElement.of("", { "data-ui-items-query": JSON.stringify({ filters: [], sorts: [{ itemProperty: "Title", direction: "Ascending" }] }) }));
    new ItemsReorderEngine({ root: real(sorted.root), services: real(services) });

    assert.equal(altKey(sorted.root, "ArrowDown").defaultPrevented, false);
    assert.deepEqual([...refused.moves, ...still.moves, ...sorted.moves], []);
});

function drag(type: string, target: FakeElement, clientY = 0): FakeDragEvent {
    const domEvent = Object.assign(new FakeDragEvent(type), { clientY });

    target.dispatchEvent(domEvent);

    return domEvent;
}

test("a row dropped on the lower half of another lands after it, marked there while it is over it", () => {
    const view = list();

    new ItemsReorderEngine({ root: real(view.root) });

    const [first, , third] = view.rows;

    first.dispatchEvent(new FakePointerEvent("pointerdown"));
    assert.equal(real<{ draggable: boolean }>(first).draggable, true);

    drag("dragstart", first);
    assert.equal(drag("dragover", third, 27).defaultPrevented, true);
    assert.equal(third.getAttribute("data-ui-row-drop"), "after");

    drag("drop", third, 27);

    assert.deepEqual(view.moves, [2]);
    assert.equal(third.hasAttribute("data-ui-row-drop"), false);
    assert.equal(real<{ draggable: boolean }>(first).draggable, false);
});

test("a press that lifts a row takes away a selection the reader left across rows, which the browser would drag instead", () => {
    const view = list();

    new ItemsReorderEngine({ root: real(view.root) });
    fakeDocument.selection.isCollapsed = false;

    view.rows[0].dispatchEvent(new FakePointerEvent("pointerdown"));

    assert.equal(fakeDocument.selection.isCollapsed, true);
    assert.equal(real<{ draggable: boolean }>(view.rows[0]).draggable, true);
});

test("a press the browser cancels gives the row back its own state; one cancelled by the drag it started keeps it lifted", () => {
    const view = list();

    new ItemsReorderEngine({ root: real(view.root) });

    const [first, , third] = view.rows;

    first.dispatchEvent(new FakePointerEvent("pointerdown"));
    first.dispatchEvent(new FakePointerEvent("pointercancel"));
    assert.equal(real<{ draggable: boolean }>(first).draggable, false);

    first.dispatchEvent(new FakePointerEvent("pointerdown"));
    drag("dragstart", first);
    first.dispatchEvent(new FakePointerEvent("pointercancel"));
    assert.equal(real<{ draggable: boolean }>(first).draggable, true);

    drag("drop", third, 27);
    assert.equal(real<{ draggable: boolean }>(first).draggable, false);
});

test("a grouped view's row moves within its group: Alt at the group's edge does nothing and another group's row is no place", () => {
    // Drawn as the group renderer draws them: a and b under the first header, c under the second.
    const view = list({}, ["first", "first", "second"]);

    view.host.replaceChildren(FakeElement.of("", { "data-ui-group-header": "" }), view.rows[0], view.rows[1], FakeElement.of("", { "data-ui-group-header": "" }), view.rows[2]);
    new ItemsReorderEngine({ root: real(view.root) });

    assert.equal(altKey(view.root, "ArrowDown").defaultPrevented, true);
    assert.deepEqual(view.moves, []);

    altKey(view.root, "ArrowUp");
    assert.deepEqual(view.moves, [0]);

    const [first, , third] = view.rows;

    first.dispatchEvent(new FakePointerEvent("pointerdown"));
    drag("dragstart", first);
    drag("dragover", third, 27);
    assert.equal(third.hasAttribute("data-ui-row-drop"), false);

    drag("drop", third, 27);
    assert.deepEqual(view.moves, [0]);
});

test("a group's header is no place to land, though the room past a list's last row is", () => {
    const view = list({}, ["first", "second", "second"]);
    const header = FakeElement.of("", { "data-ui-group-header": "" });

    view.host.replaceChildren(FakeElement.of("", { "data-ui-group-header": "" }), view.rows[0], header, view.rows[1], view.rows[2]);
    new ItemsReorderEngine({ root: real(view.root) });

    view.rows[1].dispatchEvent(new FakePointerEvent("pointerdown"));
    drag("dragstart", view.rows[1]);
    drag("dragover", header);
    assert.deepEqual(view.rows.map(row => row.hasAttribute("data-ui-row-drop")), [false, false, false]);

    drag("dragover", view.host, 35);
    assert.equal(view.rows[2].getAttribute("data-ui-row-drop"), "after");
});

test("the gap between two rows is the place between them, never the list's end", () => {
    const view = list();

    // A stack's spacing: four pixels between the rows, which the host itself stands under.
    view.rows.forEach((row, index) => {
        row.rect = { left: 0, top: index * 14, width: 100, height: 10 };
    });
    new ItemsReorderEngine({ root: real(view.root) });

    const [first, second, third] = view.rows;

    first.dispatchEvent(new FakePointerEvent("pointerdown"));
    drag("dragstart", first);

    // Beside the dragged row, a drop would leave it where it is: no line, and none at the end of the list.
    assert.equal(drag("dragover", view.host, 12).defaultPrevented, true);
    assert.deepEqual(view.rows.map(row => row.hasAttribute("data-ui-row-drop")), [false, false, false]);

    drag("dragover", view.host, 26);
    assert.equal(second.getAttribute("data-ui-row-drop"), "after");
    assert.equal(third.hasAttribute("data-ui-row-drop"), false);

    drag("drop", view.host, 26);
    assert.deepEqual(view.moves, [1]);
});

test("between two rows the line has one place, in the middle of the gap, whichever of them or the gap the pointer is over", () => {
    const view = list();

    view.rows.forEach((row, index) => {
        row.rect = { left: 0, top: index * 14, width: 100, height: 10 };
    });
    new ItemsReorderEngine({ root: real(view.root) });

    const [first, second, third] = view.rows;

    third.dispatchEvent(new FakePointerEvent("pointerdown"));
    drag("dragstart", third);

    // The lower half of the first row, the gap under it, the upper half of the second: one mark, on the first row's lower side.
    for (const [target, y] of [[first, 7], [view.host, 12], [second, 16]] as const) {
        drag("dragover", target, y);
        assert.equal(first.getAttribute("data-ui-row-drop"), "after");
        assert.equal(second.hasAttribute("data-ui-row-drop"), false);
        assert.equal(real<{ style: { getPropertyValue(name: string): string } }>(first).style.getPropertyValue("--ui-row-drop-offset"), "2px");
    }

    // Before the first row there is no row ahead of it: the line stays at its edge, inside it.
    drag("dragover", first, 2);
    assert.equal(first.getAttribute("data-ui-row-drop"), "before");
    assert.equal(real<{ style: { getPropertyValue(name: string): string } }>(first).style.getPropertyValue("--ui-row-drop-offset"), "-1px");

    drag("drop", second, 16);
    assert.deepEqual(view.moves, [1]);
});

test("an ungrouped view's row goes anywhere in the list, by the keys and by a drag", () => {
    const view = list();

    new ItemsReorderEngine({ root: real(view.root) });
    altKey(view.root, "ArrowDown");

    view.rows[0].dispatchEvent(new FakePointerEvent("pointerdown"));
    drag("dragstart", view.rows[0]);
    drag("drop", view.rows[2], 27);

    assert.deepEqual(view.moves, [2, 2]);
});

/** The list's rows each given the grip the renderer draws at a row's end, the host dragged by grips. */
function gripped(): List & { readonly grips: FakeElement[] } {
    const view = list();

    view.root.setAttribute("data-ui-rows-drag-handle", "");

    const grips = view.rows.map(row => {
        RowGripDecorator.decorate(real({ row, item: null, key: "", componentId: 5, ancestors: [], templates: null, renderer: null }));

        return row.children[row.children.length - 1];
    });

    return { ...view, grips };
}

test("a client-built row gets the grip the server writes: named, and focusable by nothing", () => {
    const [grip] = gripped().grips;

    assert.equal(grip.className, "ui-row__grip");
    assert.equal(grip.getAttribute("role"), "button");
    assert.equal(grip.hasAttribute("tabindex"), false);
    assert.ok((grip.getAttribute("aria-label") ?? "").length > 0);
});

test("a row that shows a grip is lifted by it alone, and the rest of the row keeps its press", () => {
    const view = gripped();
    const [first, , third] = view.rows;

    new ItemsReorderEngine({ root: real(view.root) });

    first.children[0].dispatchEvent(new FakePointerEvent("pointerdown"));
    assert.notEqual(real<{ draggable?: boolean }>(first).draggable, true);

    view.grips[0].dispatchEvent(new FakePointerEvent("pointerdown"));
    assert.equal(real<{ draggable: boolean }>(first).draggable, true);

    drag("dragstart", first);
    drag("drop", third, 27);
    assert.deepEqual(view.moves, [2]);
});

test("a grip the host draws but does not show leaves the whole row to lift, as a wrapped tile's", () => {
    const view = gripped();

    for (const grip of view.grips)
        grip.laidOut = false;

    new ItemsReorderEngine({ root: real(view.root) });
    view.rows[0].children[0].dispatchEvent(new FakePointerEvent("pointerdown"));

    assert.equal(real<{ draggable: boolean }>(view.rows[0]).draggable, true);
});

test("a press on a grip gives the host the keyboard on the grip's row, so Alt+Down moves that row at once", () => {
    const view = gripped();

    new ItemsReorderEngine({ root: real(view.root) });
    view.grips[0].dispatchEvent(new FakePointerEvent("pointerdown"));

    assert.equal(fakeDocument.activeElement, view.root);
    assert.equal(view.rows[0].hasAttribute("data-ui-row-focus"), true);
    assert.equal(view.rows[1].hasAttribute("data-ui-row-focus"), false);

    assert.equal(altKey(view.root, "ArrowDown").defaultPrevented, true);
    assert.deepEqual(view.moves, [1]);
});

test("a row's move carries its index after its keys, and a tree's move keeps its chain", () => {
    const dynamicParameters = itemMoveEvent().registration.dynamicParameters;

    assert.ok(dynamicParameters !== undefined);

    const context = { component: real<Element>(null), componentId: 6, dynamicParameters: ["outer", "b"] };

    assert.deepEqual(dynamicParameters({ ...context, domEvent: new CustomEvent("move", { detail: { index: 2 } }) }), ["outer", "b", 2]);
    assert.equal(dynamicParameters({ ...context, domEvent: new Event("move") }), null);
});

/** The pipeline as far as a move needs it: the event taken, then its command answered, with or without the server's Move. */
function pipeline(view: List): { readonly answer: (serverMove: { readonly key: string; readonly index: number } | null) => void } {
    const mover = {
        indexOf: (_: Element, key: string): number | null => {
            const at = shown(view).indexOf(key);

            return at < 0 ? null : at;
        },
        move: (_: Element, key: string, index: number): void => {
            const row = view.host.children.find(child => child.getAttribute("data-ui-key") === key)!;
            const rest = view.host.children.filter(child => child !== row);

            view.host.insertBefore(row, rest[index] ?? null);
        }
    };
    const host = real<Element>(view.host);
    const moves = new PendingMoves(mover);
    const registration = itemMoveEvent({ ahead: (target, key, index) => moves.ahead(target, key, index), settle: move => moves.settle(move), resort: () => undefined }).registration;
    const taken: Event[] = [];

    view.root.addEventListener("move", domEvent => {
        const context = { domEvent: real<Event>(domEvent), component: real<Element>(view.root), componentId: 6, dynamicParameters: [] };

        registration.started?.(context);
        taken.push(context.domEvent);
    });

    return {
        answer: serverMove => {
            const domEvent = taken.shift()!;

            if (serverMove !== null)
                moves.around(host, [serverMove.key], () => mover.move(host, serverMove.key, serverMove.index));

            registration.completed?.({ domEvent, component: real<Element>(view.root), componentId: 6, dynamicParameters: [], dispatched: true, success: serverMove !== null });
        }
    };
}

function shown(view: List): string[] {
    return view.host.children.map(row => row.getAttribute("data-ui-key") ?? "");
}

test("Alt+Down moves the row at once, and the server's Move to the same place leaves it there", () => {
    const view = list();
    const page = pipeline(view);

    new ItemsReorderEngine({ root: real(view.root) });
    altKey(view.root, "ArrowDown");

    assert.deepEqual(shown(view), ["a", "c", "b"]);

    page.answer({ key: "b", index: 2 });

    assert.deepEqual(shown(view), ["a", "c", "b"]);
});

test("a dropped row stands in its new place as it lands, before the server answers", () => {
    const view = list();
    const page = pipeline(view);
    const [first, , third] = view.rows;

    new ItemsReorderEngine({ root: real(view.root) });
    first.dispatchEvent(new FakePointerEvent("pointerdown"));
    drag("dragstart", first);
    drag("dragover", third, 27);
    drag("drop", third, 27);

    assert.deepEqual(shown(view), ["b", "c", "a"]);

    page.answer({ key: "a", index: 2 });

    assert.deepEqual(shown(view), ["b", "c", "a"]);
});

test("a move the server refuses or fails puts the row back, and one it puts elsewhere goes there", () => {
    const refused = list();
    const refusing = pipeline(refused);

    new ItemsReorderEngine({ root: real(refused.root) });
    altKey(refused.root, "ArrowUp");

    assert.deepEqual(shown(refused), ["b", "a", "c"]);

    refusing.answer(null);

    assert.deepEqual(shown(refused), ["a", "b", "c"]);

    const elsewhere = list();
    const moving = pipeline(elsewhere);

    new ItemsReorderEngine({ root: real(elsewhere.root) });
    altKey(elsewhere.root, "ArrowUp");
    moving.answer({ key: "b", index: 2 });

    assert.deepEqual(shown(elsewhere), ["a", "c", "b"]);
});

test("a second Alt+Down before the first is answered moves on from where the first left the row", () => {
    const view = list();
    const page = pipeline(view);

    view.rows[1].removeAttribute("data-ui-row-focus");
    view.rows[0].setAttribute("data-ui-row-focus", "");
    new ItemsReorderEngine({ root: real(view.root) });
    altKey(view.root, "ArrowDown");
    altKey(view.root, "ArrowDown");

    assert.deepEqual(view.moves, [1, 2]);
    assert.deepEqual(shown(view), ["b", "c", "a"]);

    page.answer({ key: "a", index: 1 });
    page.answer({ key: "a", index: 2 });

    assert.deepEqual(shown(view), ["b", "c", "a"]);
});

test("a tree's move, which carries no index, moves nothing ahead", () => {
    const view = list();
    const ahead: unknown[] = [];
    const registration = itemMoveEvent(real({ ahead: (...args: unknown[]) => ahead.push(args), settle: () => undefined, resort: () => undefined })).registration;
    const domEvent = new FakeEvent("move");

    domEvent.target = view.rows[0].children[0];
    registration.started?.({ domEvent: real<Event>(domEvent), component: real<Element>(view.root), componentId: 6, dynamicParameters: [] });

    assert.deepEqual(ahead, []);
});

test("a tab's move, which its strip already shows, takes the strip back to the order its data holds once answered, refused or not", () => {
    const strip = new FakeElement("div");
    const tab = new FakeElement("div");
    const resorted: unknown[] = [];
    const registration = itemMoveEvent(real({ ahead: () => assert.fail("a tab is no list's row to move ahead"), settle: () => undefined, resort: (host: unknown) => resorted.push(host) })).registration;
    const domEvent = new CustomEvent("move", { detail: { index: 0 } });

    tab.classList.add("ui-tab-item");
    strip.setAttribute("data-ui-items-host", "");
    strip.append(tab);
    Object.defineProperty(domEvent, "target", { value: tab });

    const context = { domEvent: real<Event>(domEvent), component: real<Element>(tab), componentId: 6, dynamicParameters: ["a"] };

    registration.started?.(context);
    assert.deepEqual(resorted, []);

    registration.completed?.({ ...context, dispatched: true, success: false });
    assert.deepEqual(resorted, [strip]);
});
