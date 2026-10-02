// Escape mid-drag: a gesture whose engine knows how to put back what the press found (a colour picked by the press point, a picture
// pinched) cancels that way and ends nothing; any other goes back to the distance it began at and ends as a release would.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, FakeKeyboardEvent, installFakeDom, real } from "./fake-dom.ts";

class FakePointerEvent extends FakeEvent {
    public readonly button = 0;
    public readonly pointerId = 1;
    public readonly clientX: number;
    public readonly clientY: number;

    public constructor(type: string, clientX: number, clientY = 0) {
        super(type);
        this.clientX = clientX;
        this.clientY = clientY;
    }
}

// The window's key listeners: a drag hears Escape there, ahead of everything on the page.
const windowKeys: ((domEvent: FakeEvent) => void)[] = [];

installFakeDom({
    window: { addEventListener: (type: string, listener: (domEvent: FakeEvent) => void) => void (type === "keydown" && windowKeys.push(listener)) },
    PointerEvent: FakePointerEvent
});

const { PointerDrag } = await import("../src/interactions/pointer-drag.ts");

function pressEscape(): FakeKeyboardEvent {
    const escape = new FakeKeyboardEvent("Escape");

    for (const listener of windowKeys)
        listener(escape);

    windowKeys.length = 0;

    return escape;
}

/** A handle in a root, and a drag over it that writes down what it was asked to do. */
function dragOver(cancels: boolean): { handle: FakeElement; log: string[] } {
    const handle = FakeElement.of("ui-handle");
    const root = new FakeElement().append(handle);
    const log: string[] = [];

    new PointerDrag<{ readonly at: number }>({
        root: real<ParentNode>(root),
        resolveHandle: target => real<FakeElement>(target) === handle ? real(handle) : null,
        begin: (_handle, point) => ({ at: point.x }),
        coordinate: () => "clientX",
        move: (_context, delta) => void log.push(`move ${delta}`),
        end: () => void log.push("end"),
        ...(cancels ? { cancel: (_handle: HTMLElement, context: { readonly at: number }) => void log.push(`cancel from ${context.at}`) } : {})
    });

    handle.dispatchEvent(new FakePointerEvent("pointerdown", 10));
    handle.dispatchEvent(new FakePointerEvent("pointermove", 40));

    return { handle, log };
}

test("a drag whose engine cancels puts back what the press found and ends nothing", () => {
    const { handle, log } = dragOver(true);
    const escape = pressEscape();

    assert.equal(escape.defaultPrevented, true);
    assert.deepEqual(log, ["move 30", "cancel from 10"]);
    assert.equal(handle.hasAttribute("data-ui-splitting"), false);

    // Over: a move after it is no drag's.
    handle.dispatchEvent(new FakePointerEvent("pointermove", 80));
    assert.deepEqual(log, ["move 30", "cancel from 10"]);
});

test("a drag with no cancel of its own goes back to where it began and ends as a release would", () => {
    const { log } = dragOver(false);

    pressEscape();

    assert.deepEqual(log, ["move 30", "move 0", "end"]);
});
