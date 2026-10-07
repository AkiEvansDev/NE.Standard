// The strip fitter watches each strip's room for a change of width and fits the strip again; a strip gone from the page — a dialog
// closed, a row redrawn — is let go of, not kept alive by the observer for the rest of the session nor fitted while detached.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

type ResizeEntry = { readonly target: FakeElement; readonly contentRect: { readonly width: number } };

/** The one observer the fitter makes, driven by the test: what it watches, and its callback to report sizes through. */
const resizes = {
    observed: new Set<FakeElement>(),
    report: (_entries: readonly ResizeEntry[]): void => undefined
};

installFakeDom({
    window: { addEventListener: () => undefined, setTimeout, innerWidth: 1280, innerHeight: 900 },
    getComputedStyle: () => ({ display: "flex", getPropertyValue: () => "" }),
    MutationObserver: class {
        public observe(): void {
        }
    },
    ResizeObserver: class {
        public constructor(callback: (entries: readonly ResizeEntry[], observer: unknown) => void) {
            resizes.report = entries => callback(entries, this);
        }

        public observe(target: FakeElement): void {
            resizes.observed.add(target);
        }

        public unobserve(target: FakeElement): void {
            resizes.observed.delete(target);
        }
    }
});

const { StripFitter } = await import("../src/interactions/strip-overflow.ts");

function strip(): { readonly root: FakeElement; readonly room: FakeElement; readonly button: FakeElement } {
    const button = FakeElement.of("ui-tab-overflow", {}, "button");
    const room = FakeElement.of("ui-tabs__strip").append(button);
    const root = FakeElement.of("ui-tabs").append(room);

    fakeDocument.body.append(root);

    return { root, room, button };
}

test("a strip gone from the page is let go of and not fitted, while one still on it is fitted as its room changes", () => {
    const refitted: FakeElement[] = [];
    const fitter = new StripFitter({
        rootClass: "ui-tabs",
        overflowingClass: "ui-tabs--overflowing",
        wraps: () => true,
        hiddenClass: "ui-tab-header--overflowed",
        refit: root => void refitted.push(real<FakeElement>(root)),
        pick: () => undefined
    });

    fakeDocument.body.children.length = 0;

    const kept = strip();
    const gone = strip();

    for (const { root, room, button } of [kept, gone])
        fitter.fit(real(root), { room: real(room), button: real(button), captions: [], selected: null });

    assert.equal(resizes.observed.has(gone.room), true);

    gone.root.remove();
    resizes.report([{ target: kept.room, contentRect: { width: 300 } }, { target: gone.room, contentRect: { width: 0 } }]);

    assert.equal(resizes.observed.has(gone.room), false);
    assert.equal(resizes.observed.has(kept.room), true);
    assert.deepEqual(refitted, [kept.root]);
});
