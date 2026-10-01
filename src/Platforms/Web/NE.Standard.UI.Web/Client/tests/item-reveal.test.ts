// A row brought into view by its item's key — a ScrollToItem effect's — stands where it was asked to, its group header with it, and
// stays there as the window around it is laid out again, until the reader scrolls the list themselves.

import assert from "node:assert/strict";
import test from "node:test";

import { FakeElement, FakeEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

installFakeDom();

const { itemsHostOf, keepHeldRow, letGoOfRow, revealItem } = await import("../src/items/item-reveal.ts");

/** A windowed host 300 tall over 2000 of content, scrolled to `scrollTop`, its rows placed by the test in the viewport's coordinates. */
function host(scrollTop: number, ...children: FakeElement[]): FakeElement {
    const element = FakeElement.of("ui-items-view__host", { "data-ui-items-host": "", "data-ui-host-mode": "windowed" });

    element.rect = { left: 0, top: 0, width: 400, height: 300 };
    element.scrollTop = scrollTop;
    Object.assign(element, { scrollHeight: 2000 });
    fakeDocument.body.replaceChildren(element.append(FakeElement.of("", { "data-ui-window-spacer": "top" }), ...children));

    return element;
}

function rowAt(key: string, top: number, height = 60): FakeElement {
    const row = FakeElement.of("ui-items-view__item", { "data-ui-key": key });

    row.rect = { left: 0, top, width: 400, height };

    return row;
}

function headerOver(key: string, top: number): FakeElement {
    const header = FakeElement.of("", { "data-ui-group-header": "", "data-ui-group-anchor": key, "data-ui-id": "12" });

    header.rect = { left: 0, top, width: 400, height: 24 };

    return header;
}

test("a row comes to the top of the list, the group header standing over it first", () => {
    const list = host(500, rowAt("m4", 40), headerOver("m5", 120), rowAt("m5", 144));

    assert.equal(revealItem(real<Element>(list), "m5", "Start", "auto"), true);
    assert.equal(list.scrollTop, 620);
});

test("a row with no header of its own comes to the top by itself; a header over another row is not its", () => {
    const list = host(500, headerOver("m4", 20), rowAt("m4", 44), rowAt("m5", 104));

    revealItem(real<Element>(list), "m5", "Start", "auto");
    assert.equal(list.scrollTop, 604);
});

test("a key the host has drawn no row for scrolls nothing", () => {
    const list = host(500, rowAt("m4", 40));

    assert.equal(revealItem(real<Element>(list), "m9", "Start", "auto"), false);
    assert.equal(list.scrollTop, 500);
});

test("the end, the middle and the nearest edge stand the row where they say", () => {
    const end = host(500, rowAt("m5", 400));

    revealItem(real<Element>(end), "m5", "End", "auto");
    assert.equal(end.scrollTop, 660);

    const middle = host(500, rowAt("m5", 400));

    revealItem(real<Element>(middle), "m5", "Center", "auto");
    assert.equal(middle.scrollTop, 780);

    const shown = host(500, rowAt("m5", 100));

    revealItem(real<Element>(shown), "m5", "Nearest", "auto");
    assert.equal(shown.scrollTop, 500);
});

test("the row stays where it was shown as the window around it is laid out again, until the reader scrolls", () => {
    const row = rowAt("m5", 0);
    const list = host(500, rowAt("m4", -60), row);

    revealItem(real<Element>(list), "m5", "Start", "auto");
    assert.equal(list.scrollTop, 500);

    // The rows before the day were read: thirty rows above it, and the spacer re-sized by the window's new estimate of a row.
    row.rect = { ...row.rect, top: 180 };
    keepHeldRow(real<Element>(list));
    assert.equal(list.scrollTop, 680);

    // The reader's own wheel lets go: the next layout moves nothing.
    row.dispatchEvent(new FakeEvent("wheel"));
    row.rect = { ...row.rect, top: 90 };
    keepHeldRow(real<Element>(list));
    assert.equal(list.scrollTop, 680);
});

test("a scroll asked for elsewhere lets go of the row, and a row no longer drawn is let go of", () => {
    const row = rowAt("m5", 100);
    const list = host(500, row);

    revealItem(real<Element>(list), "m5", "Start", "auto");
    letGoOfRow(real<Element>(list));
    row.rect = { ...row.rect, top: 200 };
    keepHeldRow(real<Element>(list));
    assert.equal(list.scrollTop, 600);

    revealItem(real<Element>(list), "m5", "Start", "auto");
    row.remove();
    keepHeldRow(real<Element>(list));
    assert.equal(list.scrollTop, 800);
});

test("a list that does not scroll itself has the page bring the row's header into view", () => {
    const header = headerOver("m5", 120);
    const list = host(0, header, rowAt("m5", 144));
    const asked: unknown[] = [];

    Object.assign(list, { scrollHeight: 300 });
    Object.assign(header, { scrollIntoView: (options: unknown) => asked.push(options) });

    revealItem(real<Element>(list), "m5", "Start", "smooth");
    assert.deepEqual(asked, [{ behavior: "smooth", block: "start" }]);
});

test("the host is the component's own, not one of a list nested in its rows", () => {
    const own = FakeElement.of("ui-table__host", { "data-ui-items-host": "" });
    const nestedHost = FakeElement.of("", { "data-ui-items-host": "" });
    const nested = FakeElement.of("ui-items-view", { "data-ui-id": "9" }).append(nestedHost);
    const table = FakeElement.of("ui-table", { "data-ui-id": "7" }).append(FakeElement.of("ui-table__scroll").append(own.append(FakeElement.of("ui-table__row").append(nested))));

    assert.equal(itemsHostOf(real<Element>(table)), own);
    assert.equal(itemsHostOf(real<Element>(nested)), nestedHost);
    assert.equal(itemsHostOf(real<Element>(own)), own);
});
