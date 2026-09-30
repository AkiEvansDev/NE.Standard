// A press outside closes a popup: on the click that ends a primary press where the popup waits for it, at once for any other press,
// which no click follows — a right press elsewhere would otherwise open a context menu beside a list still open. Escape in a rename
// field is the field's. Over a stand-in document that only keeps the listeners, and events that carry their path.

import assert from "node:assert/strict";
import test from "node:test";

type Listener = (domEvent: Event) => void;

const listeners = new Map<string, Listener[]>();

class FakeMouseEvent {
    public readonly type: string;
    public readonly button: number;
    private readonly path: readonly object[];

    public constructor(type: string, button: number, path: readonly object[]) {
        this.type = type;
        this.button = button;
        this.path = path;
    }

    public composedPath(): readonly object[] {
        return this.path;
    }
}

class FakeKeyboardEvent {
    public readonly type = "keydown";
    public readonly key: string;
    public readonly target: object;
    public defaultPrevented = false;

    public constructor(key: string, target: object) {
        this.key = key;
        this.target = target;
    }

    public preventDefault(): void {
        this.defaultPrevented = true;
    }
}

/** A key's target: a rename field, or any other element. */
class FakeTarget {
    private readonly renameField: boolean;

    public constructor(renameField: boolean) {
        this.renameField = renameField;
    }

    public closest(): FakeTarget | null {
        return this.renameField ? this : null;
    }
}

// The open dialogs, as the document answers for them: none, unless a test puts a modal one up.
let openDialogs: readonly object[] = [];

const fakeDocument = {
    addEventListener: (type: string, listener: Listener) => listeners.set(type, [...listeners.get(type) ?? [], listener]),
    querySelectorAll: () => openDialogs
};

Object.assign(globalThis, {
    document: fakeDocument,
    window: { addEventListener: () => undefined },
    MouseEvent: FakeMouseEvent,
    KeyboardEvent: FakeKeyboardEvent,
    Element: FakeTarget
});

const { PopupDismissal } = await import("../src/interactions/popup-dismissal.ts");

function dispatch(type: string, button: number, path: readonly object[]): void {
    for (const listener of listeners.get(type) ?? [])
        listener(new FakeMouseEvent(type, button, path) as unknown as Event);
}

function watched(onPress = false): { popup: HTMLElement; closed: string[] } {
    const popup = { isConnected: true, contains: () => false } as unknown as HTMLElement;
    const closed: string[] = [];

    new PopupDismissal({ openPopups: () => closed.length === 0 ? [popup] : [], close: (_, reason) => closed.push(reason), onPress });

    return { popup, closed };
}

test("a right press outside a popup waiting for the click closes it at once", () => {
    const { closed } = watched();

    dispatch("pointerdown", 2, [{}]);

    assert.deepEqual(closed, ["outside"]);
});

test("a primary press outside waits for its click", () => {
    const { closed } = watched();

    dispatch("pointerdown", 0, [{}]);

    assert.deepEqual(closed, []);

    dispatch("click", 0, [{}]);

    assert.deepEqual(closed, ["outside"]);
});

test("a right press inside the popup is the popup's own", () => {
    const { popup, closed } = watched();

    dispatch("pointerdown", 2, [popup]);

    assert.deepEqual(closed, []);
});

test("a context menu asked for outside a popup closes it at once, however it was asked for: a long press, a Ctrl+click, the Menu key", () => {
    const { closed } = watched();

    dispatch("pointerdown", 0, [{}]);
    dispatch("contextmenu", 0, [{}]);

    assert.deepEqual(closed, ["outside"]);

    const inside = watched();

    dispatch("contextmenu", 0, [inside.popup]);

    assert.deepEqual(inside.closed, []);
});

test("a popup behind an open modal dialog is left alone: a press in the dialog is not outside it", () => {
    const { closed } = watched();
    const dialog = { hasAttribute: () => true, contains: () => false };

    openDialogs = [dialog];

    try {
        dispatch("pointerdown", 2, [dialog]);
        dispatch("click", 0, [dialog]);
    }
    finally {
        openDialogs = [];
    }

    assert.deepEqual(closed, []);
});

test("Escape in a rename field inside a popup is the field's, cancelling the rename; the next one closes the popup", () => {
    const { closed } = watched();
    const press = (target: FakeTarget): FakeKeyboardEvent => {
        const domEvent = new FakeKeyboardEvent("Escape", target);

        for (const listener of listeners.get("keydown") ?? [])
            listener(domEvent as unknown as Event);

        return domEvent;
    };

    assert.equal(press(new FakeTarget(true)).defaultPrevented, false);
    assert.deepEqual(closed, []);

    assert.equal(press(new FakeTarget(false)).defaultPrevented, true);
    assert.deepEqual(closed, ["escape"]);
});
