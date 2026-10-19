// A change set lays out again only the windows it changed — a row's value in one, its rows, the component around it — since laying a
// window out measures it: a set that left a window alone leaves its spacers as they stand.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

installFakeDom({
    window: { addEventListener: () => undefined, setTimeout, clearTimeout },
    getComputedStyle: () => ({ getPropertyValue: () => "" })
});

const { ItemsWindowEngine } = await import("../src/items/items-window-engine.ts");

/** A window of two rows at offset 10 of 100, inside its component; laid out, a top spacer stands for the ten rows before it. */
function windowed(id: string): { readonly component: FakeElement; readonly host: FakeElement; readonly row: FakeElement } {
    const host = FakeElement.of("ui-items-view__host", {
        "data-ui-items-host": "",
        "data-ui-host-mode": "windowed",
        "data-ui-window-offset": "10",
        "data-ui-window-total": "100"
    });
    const rows = [0, 1].map(index => FakeElement.of("ui-items-view__item", { "data-ui-key": `${id}-${index}` }));

    for (const [index, row] of rows.entries())
        row.rect = { left: 0, top: index * 30, width: 400, height: 30 };

    host.append(...rows);
    host.rect = { left: 0, top: 0, width: 400, height: 600 };

    return { component: FakeElement.of("ui-items-view", { "data-ui-id": id }).append(host), host, row: rows[0] };
}

function spacerOf(host: FakeElement): FakeElement | undefined {
    return host.children.find(child => child.getAttribute("data-ui-window-spacer") === "top");
}

test("only the window a change set changed is laid out again, whether by a row of it or by the component around it", () => {
    const first = windowed("5");
    const second = windowed("6");

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(first.component, second.component);

    const engine = new ItemsWindowEngine({ root: real<ParentNode>(fakeDocument.body), requestWindow: async () => undefined });

    engine.sync([]);
    assert.equal(spacerOf(first.host), undefined);

    engine.sync([real<Element>(first.row)]);
    assert.equal(spacerOf(first.host)?.style.height, "300px");
    assert.equal(spacerOf(second.host), undefined);

    engine.sync([real<Element>(second.component)]);
    assert.equal(spacerOf(second.host)?.style.height, "300px");
});

test("a window a pushed change set emptied is asked for again, as after a command; not while a read is on its way, nor again over an empty source", async () => {
    const { component, host } = windowed("7");
    const asked: string[] = [];
    const answers: (() => void)[] = [];

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(component);

    const engine = new ItemsWindowEngine({
        root: real<ParentNode>(fakeDocument.body),
        requestWindow: request => {
            asked.push(request.anchor);

            return new Promise<void>(resolve => {
                answers.push(resolve);
            });
        }
    });

    // A set that changed a row of a window still holding rows asks for nothing.
    engine.sync([real<Element>(host.children[0])]);
    assert.deepEqual(asked, []);

    // The source dropped its window from a job's write: the set is no command's answer, so nothing else would ask again.
    host.children.length = 0;
    host.removeAttribute("data-ui-window-offset");
    engine.sync([real<Element>(host)]);
    assert.deepEqual(asked, ["Start"]);

    // The read's own answer lands while it is on its way: an empty one asks no second time.
    engine.sync([real<Element>(host)]);
    assert.deepEqual(asked, ["Start"]);

    // A command answered meanwhile decides again, after the read: over the empty window the read left, an empty source, it reads no
    // second time.
    engine.reconsider();
    answers[0]();
    await new Promise(resolve => setTimeout(resolve, 0));
    assert.deepEqual(asked, ["Start"]);
});

test("a feed anchored to its end that a change set emptied is read from its end, its newest rows", () => {
    const { component, host } = windowed("8");
    const asked: string[] = [];

    host.setAttribute("data-ui-scroll-anchor", "End");
    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(component);

    const engine = new ItemsWindowEngine({
        root: real<ParentNode>(fakeDocument.body),
        requestWindow: request => {
            asked.push(request.anchor);

            return new Promise<void>(() => undefined);
        }
    });

    host.children.length = 0;
    host.removeAttribute("data-ui-window-offset");
    engine.sync([real<Element>(host)]);

    assert.deepEqual(asked, ["End"]);
});
