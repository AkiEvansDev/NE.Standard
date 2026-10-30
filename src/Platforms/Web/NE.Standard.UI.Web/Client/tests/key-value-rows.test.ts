// A key-value list is a row host as a table is: one Tab stop, its rows walked by the arrows, Enter clicking and opening the keyboard's
// row (or pressing the row's one control), a double click opening it, Delete raising a removal the application wired, F2 opening the
// keyboard's row where the list edits in place. The rows are the shape KeyValueActionComponentRenderer writes.

import assert from "node:assert/strict";
import test from "node:test";

import { FakeElement, FakeEvent, FakeKeyboardEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

installFakeDom({
    Event: FakeEvent,
    MutationObserver: class {
        public observe(): void {
        }

        public disconnect(): void {
        }
    },
    window: { innerHeight: 1000, addEventListener: () => undefined }
});

const { ItemsSelectionEngine } = await import("../src/interactions/items-selection-engine.ts");
const { KeyValueActionEngine } = await import("../src/interactions/key-value-action-engine.ts");
const { RowPressEventName } = await import("../src/addressing/dom-attributes.ts");
const { keepRowCursorShown } = await import("../src/interactions/row-cursor.ts");

const RowHeight = 40;

function text(className: string, words: string): FakeElement {
    const title = FakeElement.of("ui-text__title", {}, "span");

    title.textContent = words;

    return FakeElement.of(className).append(FakeElement.of("ui-text").append(title));
}

/**
 * A row as the renderer writes it, every row with its action's button; an editable list's row adds its input and its Save and Cancel
 * pair, which a closed row hides (`display: none`), as ShowActions off hides the action.
 */
function row(key: string, index: number, editable: boolean, showActions: boolean): FakeElement {
    const element = FakeElement.of("ui-key-value-action__row", { role: "listitem", "data-ui-key": key });
    const action = FakeElement.of("ui-key-value-action__action", { "data-ui-key": key }).append(FakeElement.of("ui-button", { type: "button" }, "button"));

    action.hidden = !showActions;
    element.rect = { left: 0, top: index * RowHeight, width: 400, height: RowHeight };
    element.append(text("ui-key-value-action__key", key.toUpperCase()), text("ui-key-value-action__value", `${key} value`));

    if (editable) {
        const input = FakeElement.of("ui-key-value-action__value-input").append(FakeElement.of("", { type: "text" }, "input"));

        input.hidden = true;
        element.append(input);
    }

    element.append(action);

    if (editable) {
        const pair = FakeElement.of("ui-key-value-action__edit-action").append(
            FakeElement.of("ui-button", { type: "button" }, "button"),
            FakeElement.of("ui-button", { type: "button" }, "button")
        );

        pair.hidden = true;
        element.append(pair);
    }

    return element;
}

type List = {
    readonly root: FakeElement;
    readonly rows: FakeElement[];
    /** What each row raised, in order: `key:event`; a press on a row's action as `key:action`. */
    readonly raised: string[];
};

function list(options: { readonly removes?: boolean; readonly editable?: boolean; readonly showActions?: boolean } = {}): List {
    const editable = options.editable === true;
    const showActions = options.showActions !== false;
    const rows = ["a", "b", "c"].map((key, index) => row(key, index, editable, showActions));
    const host = FakeElement.of("ui-key-value-action__host", { "data-ui-items-host": "" }).append(...rows);
    const root = FakeElement.of(`ui-key-value-action${editable ? " ui-key-value-action--editable" : ""}${showActions ? "" : " ui-key-value-action--no-actions"}`, { role: "list", tabindex: "0", ...(options.removes === true ? { "data-ui-rows-remove": "" } : {}) }).append(host);
    const raised: string[] = [];

    host.rect = { left: 0, top: 0, width: 400, height: 3 * RowHeight };

    for (const element of rows) {
        const key = element.getAttribute("data-ui-key") ?? "";

        for (const name of [RowPressEventName, "open", "remove"])
            element.addEventListener(name, () => raised.push(`${key}:${name}`));

        element.querySelector(".ui-key-value-action__action button")?.addEventListener("click", () => raised.push(`${key}:action`));
    }

    // A page of its own per list, so no earlier test's engines hear its events.
    const page = FakeElement.of("ui-page").append(root);

    fakeDocument.body.replaceChildren(page);
    new ItemsSelectionEngine({ root: real<ParentNode>(page) });
    new KeyValueActionEngine({ root: real<ParentNode>(page), dom: real({}), propertyPatchEngine: real({}), validation: { judgeShown: () => undefined } });
    // Focused from the keyboard: the cursor arrives on the first row.
    root.focus();

    return { root, rows, raised };
}

function press(target: FakeElement, key: string): FakeKeyboardEvent {
    const domEvent = new FakeKeyboardEvent(key, target);

    target.dispatchEvent(domEvent);

    return domEvent;
}

function cursorOf(root: FakeElement): string | null {
    return root.querySelector("[data-ui-row-focus]")?.getAttribute("data-ui-key") ?? null;
}

test("the list is the one stop: its rows' actions leave the Tab order, and the arrows carry the focus to each row in turn", () => {
    const { root } = list();
    const focused = (): FakeElement => real<FakeElement>(fakeDocument.activeElement);

    assert.deepEqual(root.querySelectorAll(".ui-key-value-action__action button").map(button => button.getAttribute("tabindex")), ["-1", "-1", "-1"]);
    // A list's role names no active descendant: the keyboard's arrival hands the focus to the cursor's row.
    assert.equal(cursorOf(root), "a");
    assert.equal(focused().getAttribute("data-ui-key"), "a");
    assert.equal(press(focused(), "ArrowDown").defaultPrevented, true);
    assert.equal(focused().getAttribute("data-ui-key"), "b");
    assert.equal(press(focused(), "End").defaultPrevented, true);
    assert.equal(focused().getAttribute("data-ui-key"), "c");
    assert.equal(cursorOf(root), "c");
    assert.equal(root.getAttribute("aria-activedescendant"), null);
    // Tab leaves the list from its row: the list and the rows the cursor left are out of the Tab order.
    assert.equal(root.getAttribute("tabindex"), "-1");
    assert.deepEqual(root.querySelectorAll("[tabindex='0']"), [focused()]);
});

test("Enter and Delete on the focused row act on that row", () => {
    const { raised } = list({ removes: true });
    const focused = (): FakeElement => real<FakeElement>(fakeDocument.activeElement);

    press(focused(), "ArrowDown");

    assert.equal(press(focused(), "Enter").defaultPrevented, true);
    assert.equal(press(focused(), "Delete").defaultPrevented, true);
    assert.deepEqual(raised, ["b:action", "b:remove"]);
});

test("a filter hiding the focused cursor's row takes the focus on with the cursor, and back to the list once no row shows", () => {
    const { root, rows } = list();
    const shown = (): HTMLElement[] => rows.map(row => real<HTMLElement>(row));

    rows[0].hidden = true;
    keepRowCursorShown(real<HTMLElement>(root), shown());

    assert.equal(fakeDocument.activeElement, rows[1]);
    assert.deepEqual(rows.map(row => row.getAttribute("tabindex")), ["-1", "0", null]);

    rows[1].hidden = true;
    rows[2].hidden = true;
    keepRowCursorShown(real<HTMLElement>(root), shown());

    assert.equal(fakeDocument.activeElement, root);
    assert.equal(root.getAttribute("tabindex"), "0");
});

test("Enter on the keyboard's row presses the row's one control, its action, as on a table's row", () => {
    const { root, raised } = list();

    press(root, "ArrowDown");

    assert.equal(press(root, "Enter").defaultPrevented, true);
    assert.deepEqual(raised, ["b:action"]);
});

test("Enter on a row whose one control is hidden clicks the row, then opens it, and never presses the hidden action", () => {
    const { root, raised } = list({ showActions: false });

    press(root, "ArrowDown");

    assert.equal(press(root, "Enter").defaultPrevented, true);
    assert.deepEqual(raised, [`b:${RowPressEventName}`, "b:open"]);
});

test("Enter on a closed row of a list that edits in place presses its Edit, the one control it shows, as F2 does", () => {
    const { root, raised } = list({ editable: true });

    press(root, "ArrowDown");
    press(root, "Enter");

    assert.deepEqual(raised, ["b:action"]);
});

test("Enter on a row of several controls clicks the row, then opens it", () => {
    const { root, rows, raised } = list();

    // A value template of its own control: a link, a toggle.
    for (const element of rows)
        element.querySelector(".ui-key-value-action__value")?.append(FakeElement.of("ui-button", { type: "button" }, "button"));

    press(root, "ArrowDown");
    press(root, "Enter");

    assert.deepEqual(raised, [`b:${RowPressEventName}`, "b:open"]);
});

test("a double click on a row opens it, and one on its action does not", () => {
    const { rows, raised } = list();

    rows[1]?.querySelector(".ui-key-value-action__key .ui-text__title")?.dispatchEvent(new FakeEvent("dblclick"));
    rows[2]?.querySelector(".ui-key-value-action__action button")?.dispatchEvent(new FakeEvent("dblclick"));

    assert.deepEqual(raised, ["b:open"]);
});

test("Delete raises the keyboard's row's removal where one is wired, and is the page's where none is", () => {
    const removing = list({ removes: true });

    press(removing.root, "ArrowDown");

    assert.equal(press(removing.root, "Delete").defaultPrevented, true);
    assert.deepEqual(removing.raised, ["b:remove"]);

    const plain = list();

    assert.equal(press(plain.root, "Delete").defaultPrevented, false);
    assert.deepEqual(plain.raised, []);
});

test("F2 on the list opens the keyboard's row where the list edits in place", () => {
    const { root, raised } = list({ editable: true });

    press(root, "ArrowDown");

    const f2 = press(root, "F2");

    assert.equal(f2.defaultPrevented, true);
    assert.deepEqual(raised, ["b:action"]);
});
