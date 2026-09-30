// A windowed host's group headers go between neighbours: over a row whose group differs from the row before it, the window's first
// row against the group of the item before the window, which the host carries — and a header stands in the row it is drawn from, so a
// command in it is addressed by that row's key, as the server renders it.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { FakeElement, real } from "./fake-dom.ts";
import { collectDynamicParameters } from "../src/addressing/dynamic-parameters.ts";
import { firstShownRow, regroupWindow } from "../src/items/items-group-runs.ts";

type CorpusCase = {
    readonly name: string;
    readonly groupBefore: string | null;
    readonly rows: readonly (readonly [string, string | null])[];
    readonly headers: readonly string[];
};

// The same cases WindowGroupsRenderTests holds the server's first paint to.
const corpusPath = resolve(dirname(fileURLToPath(import.meta.url)), "../../../../../../eng/Tests/Shared/group-runs-corpus.json");
const corpus = JSON.parse(readFileSync(corpusPath, "utf8")) as { readonly cases: readonly CorpusCase[] };

function row(key: string, group: string | null): FakeElement {
    return FakeElement.of("ui-items-view__item", group === null ? { "data-ui-key": key } : { "data-ui-key": key, "data-ui-group": group });
}

function windowOf(groupBefore: string | null, ...rows: FakeElement[]): FakeElement {
    const host = FakeElement.of("ui-items-view__host", groupBefore === null ? { "data-ui-items-host": "" } : { "data-ui-items-host": "", "data-ui-window-group-before": groupBefore });

    return host.append(FakeElement.of("", { "data-ui-window-spacer": "top" }), ...rows, FakeElement.of("", { "data-ui-window-spacer": "bottom" }));
}

// A header as the template draws it: a component root of its own.
const draw = (): Element => real<Element>(FakeElement.of("ui-surface", { "data-ui-id": "9", "data-ui-pc": "1" }));

function regroup(host: FakeElement): void {
    regroupWindow(real<Element>(host), draw);
}

/** What the host holds, top to bottom: a row by its key, a header as `#` and the row it is drawn from. */
function layout(host: FakeElement): string[] {
    return host.children.map(child => child.hasAttribute("data-ui-group-header")
        ? `#${child.getAttribute("data-ui-group-anchor")}`
        : child.getAttribute("data-ui-key") ?? child.getAttribute("data-ui-window-spacer") ?? "?");
}

assert.ok(corpus.cases.length > 0, "The group-runs corpus is empty.");

for (const corpusCase of corpus.cases) {
    test(`corpus: ${corpusCase.name}`, () => {
        const host = windowOf(corpusCase.groupBefore, ...corpusCase.rows.map(([key, group]) => row(key, group)));

        regroup(host);

        const drawn = layout(host);

        assert.deepEqual(drawn.filter(entry => entry.startsWith("#")).map(entry => entry.slice(1)), corpusCase.headers);

        for (const header of corpusCase.headers)
            assert.equal(drawn.indexOf(header), drawn.indexOf(`#${header}`) + 1);
    });
}

test("a bucket's header is drawn from its first shown row, never from one a filter hid", () => {
    const hidden = FakeElement.of("ui-items-view__item ui-hidden", { "data-ui-key": "m1" });
    const shown = row("m2", "day-1");

    assert.equal(firstShownRow([real<Element>(hidden), real<Element>(shown)]), real<Element>(shown));
    assert.equal(firstShownRow([real<Element>(hidden)]), undefined);
});

test("a window heads the rows that start a run of their group, the first against the group before the window", () => {
    const host = windowOf("day-1", row("m1", "day-1"), row("m2", "day-1"), row("m3", "day-2"), row("m4", "day-2"), row("m5", "day-1"), row("m6", null));

    regroup(host);

    assert.deepEqual(layout(host), ["top", "m1", "m2", "#m3", "m3", "m4", "#m5", "m5", "m6", "bottom"]);
});

test("with nothing known before the window its first grouped row is headed", () => {
    const host = windowOf(null, row("m1", "day-1"), row("m2", "day-1"));

    regroup(host);

    assert.deepEqual(layout(host), ["top", "#m1", "m1", "m2", "bottom"]);
});

test("a header standing right is kept, and one whose row left is dropped for the row that starts the run now", () => {
    const m3 = row("m3", "day-2");
    const host = windowOf("day-1", row("m1", "day-1"), m3, row("m4", "day-2"));

    regroup(host);

    const header = host.children[2];

    regroup(host);
    assert.equal(host.children[2], header);

    m3.remove();
    regroup(host);

    assert.deepEqual(layout(host), ["top", "m1", "#m4", "m4", "bottom"]);
    assert.equal(header.parentElement, null);
});

test("rows read in above the window's first row move its header up to the new first row of its run", () => {
    const m3 = row("m3", "day-2");
    const host = windowOf("day-1", m3, row("m4", "day-2"));

    regroup(host);
    assert.deepEqual(layout(host), ["top", "#m3", "m3", "m4", "bottom"]);

    // As a read upwards lands: the rows go in before the old first row, and the host now carries what lies before them.
    host.insertBefore(row("m2", "day-2"), m3);
    host.insertBefore(row("m1", "day-1"), host.children[2]);
    host.setAttribute("data-ui-window-group-before", "day-0");
    regroup(host);

    assert.deepEqual(layout(host), ["top", "#m1", "m1", "#m2", "m2", "m3", "m4", "bottom"]);
});

test("a header's components stand in the row it is drawn from, inside whatever rows the host stands in", () => {
    const text = FakeElement.of("ui-text", { "data-ui-id": "10", "data-ui-pc": "2" });
    const header = FakeElement.of("ui-surface", { "data-ui-id": "9", "data-ui-pc": "2", "data-ui-group-header": "", "data-ui-group-anchor": "m3" }).append(text);

    FakeElement.of("ui-row", { "data-ui-key": "outer" }).append(FakeElement.of("ui-items-view__host").append(header));

    assert.deepEqual(collectDynamicParameters(real<Element>(text), 2), ["outer", "m3"]);
});
