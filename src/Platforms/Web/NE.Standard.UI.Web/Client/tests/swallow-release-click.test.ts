// The click a gesture's release raises is the gesture's: a column dropped on a caption sorts nothing, a sheet let go over an entry
// presses nothing — the next click goes nowhere, however late, unless a new press or a key comes first.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeEvent, installFakeDom } from "./fake-dom.ts";

type Listener = (domEvent: FakeEvent) => void;

// The window's capturing listeners, by type, as the helper adds and removes them.
const listeners = new Map<string, Listener[]>();

installFakeDom({
    window: {
        addEventListener: (type: string, listener: Listener) => void listeners.set(type, [...listeners.get(type) ?? [], listener]),
        removeEventListener: (type: string, listener: Listener) => void listeners.set(type, (listeners.get(type) ?? []).filter(each => each !== listener))
    }
});

const { swallowReleaseClick } = await import("../src/interactions/pointer-drag.ts");

function raise(type: string): FakeEvent {
    const domEvent = new FakeEvent(type);

    for (const listener of [...listeners.get(type) ?? []])
        listener(domEvent);

    return domEvent;
}

test("the click after a gesture goes nowhere, and only that one", () => {
    swallowReleaseClick();

    const release = raise("click");

    assert.equal(release.defaultPrevented, true);
    assert.equal(release.stopped, true);
    assert.equal(raise("click").stopped, false);
});

test("a new press or a key first ends the wait, a release outside the page having raised no click", () => {
    swallowReleaseClick();
    raise("pointerdown");

    assert.equal(raise("click").stopped, false);

    swallowReleaseClick();
    raise("keydown");

    assert.equal(raise("click").stopped, false);
});
