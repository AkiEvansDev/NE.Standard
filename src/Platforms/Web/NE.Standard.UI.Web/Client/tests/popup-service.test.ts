// A package's popup through `popups.open`: owned as the framework's own — its owner the anchor where none is named, refused to an
// owner that cannot keep it (told `owner`, a microtask later, as a dismissal is), told why the framework closed it, and never told
// of a close the package asked for itself.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

installFakeDom({
    window: { addEventListener: () => undefined, setTimeout, innerWidth: 1280, innerHeight: 900 },
    getComputedStyle: () => ({ transform: "none", filter: "none", perspective: "none", direction: "ltr" }),
    ResizeObserver: class {
        public observe(): void {
        }

        public unobserve(): void {
        }
    }
});

const { popups } = await import("../src/interactions/popup-service.ts");

function scene(ownerClasses = ""): { anchor: FakeElement; popup: FakeElement; outside: FakeElement } {
    const anchor = FakeElement.of(ownerClasses, {}, "button");
    const popup = new FakeElement();
    const outside = new FakeElement("button");

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(FakeElement.of("", { "data-ui-id": "1" }).append(anchor, popup), outside);

    return { anchor, popup, outside };
}

function press(target: FakeElement): void {
    const path: FakeElement[] = [];

    for (let current: FakeElement | null = target; current !== null; current = current.parent)
        path.push(current);

    fakeDocument.documentElement.dispatchEvent(Object.assign(new FakeEvent("pointerdown"), { target, button: 0, composedPath: () => path }));
}

const options = (reasons: string[], owner?: FakeElement) => ({
    placement: "bottom-start" as const,
    gap: 4,
    owner: owner === undefined ? undefined : real(owner),
    onDismiss: (reason: string) => reasons.push(reason)
});

test("an owner that cannot keep the popup gets none, and hears so as a dismissal, after the call returns", async () => {
    const { anchor, popup } = scene("ui-disabled");
    const reasons: string[] = [];

    popups.open(real(anchor), real(popup), options(reasons));

    // The anchor stood in for the owner none was named for.
    assert.deepEqual(reasons, []);
    await Promise.resolve();
    assert.deepEqual(reasons, ["owner"]);
});

test("a press outside closes it and says so; the anchor's own press is inside", () => {
    const { anchor, popup, outside } = scene();
    const reasons: string[] = [];

    popups.open(real(anchor), real(popup), options(reasons));
    press(anchor);

    assert.deepEqual(reasons, []);

    press(outside);

    assert.deepEqual(reasons, ["outside"]);
});

test("a close the package asks for itself raises no dismissal", async () => {
    const { anchor, popup, outside } = scene();
    const reasons: string[] = [];
    const handle = popups.open(real(anchor), real(popup), options(reasons));

    handle.close();
    press(outside);
    await Promise.resolve();

    assert.deepEqual(reasons, []);
});
