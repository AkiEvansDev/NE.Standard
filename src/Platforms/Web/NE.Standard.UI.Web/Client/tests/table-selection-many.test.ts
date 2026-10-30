import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, FakeInput, fakeDocument, fakeWindowGlobals, installFakeDom, real } from "./fake-dom.ts";

type MutationRecordShape = {
    readonly type: string;
    readonly attributeName?: string;
    readonly target: FakeElement;
    readonly addedNodes: FakeElement[];
    readonly removedNodes: FakeElement[];
};

const mutationWatchers: ((records: readonly MutationRecordShape[]) => void)[] = [];

installFakeDom({
    ...fakeWindowGlobals,
    Event: class extends FakeEvent {
        public constructor(type: string) {
            super(type);
        }
    },
    matchMedia: () => ({ matches: true, addEventListener: () => undefined }),
    MutationObserver: class {
        public constructor(callback: (records: readonly MutationRecordShape[]) => void) {
            mutationWatchers.push(callback);
        }

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

        public disconnect(): void {
        }
    }
});

const { ItemsSelectionEngine } = await import("../src/interactions/items-selection-engine.ts");
const { TableColumnsEngine } = await import("../src/interactions/table-columns-engine.ts");
const { registerChoosableKeysReader } = await import("../src/interactions/row-selection.ts");

function notifyAttribute(target: FakeElement, attributeName: string): void {
    const record: MutationRecordShape = { type: "attributes", attributeName, target, addedNodes: [], removedNodes: [] };

    for (const watcher of mutationWatchers)
        watcher([record]);
}

function buildTable(options: {
    readonly selection: "none" | "one" | "many";
    readonly rowKeys: readonly string[];
    readonly selectedKeys?: readonly string[];
}): {
    readonly table: FakeElement;
    readonly host: FakeElement;
    readonly selectAllBox: FakeInput;
    readonly rowBoxes: ReadonlyMap<string, FakeInput>;
    readonly rows: ReadonlyMap<string, FakeElement>;
} {
    const selectAllBox = new FakeInput("checkbox");
    selectAllBox.className = "ui-checkbox__input ui-table__select-box";
    const selectAllCell = FakeElement.of("ui-table__header-cell ui-table__select-cell", {
        "data-ui-table-select-all": "",
        "data-ui-table-column": "0"
    }).append(selectAllBox);
    const nameHeader = FakeElement.of("ui-table__header-cell", {
        "data-ui-table-column-key": "name",
        "data-ui-table-column": "1"
    });
    const header = FakeElement.of("ui-table__header", { role: "row" }).append(selectAllCell, nameHeader);

    const rowBoxes = new Map<string, FakeInput>();
    const rows = new Map<string, FakeElement>();
    const rowElements = options.rowKeys.map(key => {
        const box = new FakeInput("checkbox");
        box.className = "ui-checkbox__input ui-table__select-box";
        rowBoxes.set(key, box);

        const row = FakeElement.of("ui-table__row", { "data-ui-key": key, role: "row" }).append(
            FakeElement.of("ui-table__cell ui-table__select-cell", { role: "gridcell", "data-ui-table-select": "" }).append(box),
            FakeElement.of("ui-table__cell", { role: "gridcell" })
        );
        rows.set(key, row);
        return row;
    });

    const hostAttributes: Record<string, string> = { "data-ui-items-host": "" };

    if (options.selectedKeys !== undefined)
        hostAttributes["data-ui-selected-keys"] = JSON.stringify(options.selectedKeys);

    const host = FakeElement.of("ui-table__host", hostAttributes).append(...rowElements);
    const scroll = FakeElement.of("ui-table__scroll").append(header, host);
    const attributes: Record<string, string> = {
        "data-ui-id": "12",
        "data-ui-selection": options.selection,
        role: "grid"
    };

    if (options.selection !== "many")
        attributes["data-ui-table-hidden"] = "0";
    else
        attributes["data-ui-no-row-select"] = "";

    const table = FakeElement.of("ui-table", attributes).append(scroll);
    real<HTMLElement>(table).style.setProperty("--ui-table-columns", "34px auto");

    if (options.selection !== "many")
        real<HTMLElement>(table).style.setProperty("--ui-table-sized-columns", "0px auto");

    return { table, host, selectAllBox, rowBoxes, rows };
}

test("switching a table's data-ui-selection to many and back toggles column 0, aria-multiselectable, and data-ui-no-row-select", () => {
    mutationWatchers.length = 0;
    const { table } = buildTable({ selection: "one", rowKeys: ["a", "b"] });
    const scope = FakeElement.of("scope").append(table);

    fakeDocument.body.replaceChildren(scope);
    new TableColumnsEngine({ root: real<ParentNode>(scope) });
    new ItemsSelectionEngine({ root: real<ParentNode>(scope) });

    assert.equal(table.getAttribute("data-ui-table-hidden"), "0");
    assert.equal(table.hasAttribute("data-ui-no-row-select"), false);
    assert.equal(table.getAttribute("aria-multiselectable"), null);

    table.setAttribute("data-ui-selection", "many");
    notifyAttribute(table, "data-ui-selection");

    assert.equal(table.getAttribute("data-ui-table-hidden"), null);
    assert.equal(real<HTMLElement>(table).style.getPropertyValue("--ui-table-sized-columns"), "");
    assert.equal(table.hasAttribute("data-ui-no-row-select"), true);
    assert.equal(table.getAttribute("aria-multiselectable"), "true");

    table.setAttribute("data-ui-selection", "one");
    notifyAttribute(table, "data-ui-selection");

    assert.equal(table.getAttribute("data-ui-table-hidden"), "0");
    assert.equal(real<HTMLElement>(table).style.getPropertyValue("--ui-table-sized-columns"), "0px auto");
    assert.equal(table.hasAttribute("data-ui-no-row-select"), false);
    assert.equal(table.getAttribute("aria-multiselectable"), null);
});

test("virtualized table Select all and indeterminate count off-screen held choosable keys, and Shift+Click selects a checkbox range", () => {
    mutationWatchers.length = 0;
    // Only rows r1..r3 are currently mounted in the DOM, while r1..r5 exist in the virtualized projection.
    const { table, host, selectAllBox, rowBoxes } = buildTable({
        selection: "many",
        rowKeys: ["r1", "r2", "r3"],
        selectedKeys: ["r1", "r2", "r3"]
    });
    const scope = FakeElement.of("scope").append(table);
    fakeDocument.body.replaceChildren(scope);

    const allHeldKeys = ["r1", "r2", "r3", "r4", "r5"];
    new ItemsSelectionEngine({
        root: real<ParentNode>(scope),
        rows: {
            shownKeysOf: target => target === real<Element>(host) ? allHeldKeys : null,
            choosableKeysOf: target => target === real<Element>(host) ? allHeldKeys : null,
            rangeKeysOf: (target, fromKey, toKey) => {
                if (target !== real<Element>(host))
                    return null;

                const from = allHeldKeys.indexOf(fromKey);
                const to = allHeldKeys.indexOf(toKey);
                return from < 0 || to < 0 ? null : allHeldKeys.slice(Math.min(from, to), Math.max(from, to) + 1);
            },
            reveal: () => null
        }
    });

    // Even though all 3 mounted rows are selected, off-screen r4 and r5 are not — header box must be indeterminate, not checked!
    assert.equal(selectAllBox.checked, false);
    assert.equal(real<HTMLInputElement>(selectAllBox).indeterminate, true);

    // Clicking Select all selects all 5 held choosable keys (including off-screen r4 and r5).
    selectAllBox.checked = true;
    selectAllBox.dispatchEvent(new FakeEvent("change"));
    assert.deepEqual(JSON.parse(host.getAttribute("data-ui-selected-keys") ?? "[]"), ["r1", "r2", "r3", "r4", "r5"]);
    assert.equal(selectAllBox.checked, true);
    assert.equal(real<HTMLInputElement>(selectAllBox).indeterminate, false);

    // Unchecking Select all clears all keys.
    selectAllBox.checked = false;
    selectAllBox.dispatchEvent(new FakeEvent("change"));
    assert.equal(host.getAttribute("data-ui-selected-keys"), "[]");

    // Plain checkbox click on r1 sets the anchor; Shift+Click on r3 selects the range r1..r3.
    const box1 = rowBoxes.get("r1")!;
    const box3 = rowBoxes.get("r3")!;

    box1.checked = true;
    box1.dispatchEvent(new FakeEvent("click"));
    box1.dispatchEvent(new FakeEvent("change"));
    assert.deepEqual(JSON.parse(host.getAttribute("data-ui-selected-keys") ?? "[]"), ["r1"]);

    box3.checked = true;
    const shiftClick = Object.assign(new FakeEvent("click"), { shiftKey: true });
    box3.dispatchEvent(shiftClick);
    box3.dispatchEvent(new FakeEvent("change"));
    assert.deepEqual(JSON.parse(host.getAttribute("data-ui-selected-keys") ?? "[]"), ["r1", "r2", "r3"]);

    registerChoosableKeysReader(real<ParentNode>(scope), undefined);
});
