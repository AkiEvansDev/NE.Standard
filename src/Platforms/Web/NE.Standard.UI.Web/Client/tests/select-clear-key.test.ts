// The clear no Tab reaches is done from the field's own control: Delete on a closed field that shows its clear empties it, Backspace
// too where the field holds one option, while a multi-select's Backspace keeps taking its last chip. A field without the clear, a
// read-only one or an open one leaves both keys alone.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeKeyboardEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

installFakeDom({
    window: { addEventListener: () => undefined, setTimeout, innerWidth: 1280, innerHeight: 900 },
    getComputedStyle: () => ({ transform: "none", filter: "none", perspective: "none", direction: "ltr" }),
    MutationObserver: class {
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
    }
});

const { SelectInteractionEngine } = await import("../src/interactions/select-interaction-engine.ts");
const { noteKey } = await import("../src/interactions/popup-focus.ts");

new SelectInteractionEngine({ root: real<ParentNode>(fakeDocument.body) });

type Scene = { readonly select: FakeElement; readonly trigger: FakeElement };

function single(classes = "ui-select", clearable = true): Scene {
    const trigger = FakeElement.of("ui-select__trigger", { role: "combobox" }, "button");
    const popup = FakeElement.of("ui-select__popup ui-select__list", { role: "listbox" })
        .append(FakeElement.of("ui-select__option", { "data-ui-key": "a", role: "option" }));
    const select = FakeElement.of(classes, { "data-ui-id": "3", "data-ui-select-value": "a", ...(clearable ? { "data-ui-clearable": "" } : {}) }).append(trigger, popup);

    return place(select, trigger);
}

function multiple(): Scene {
    // The chips as the render draws them, which Backspace reads for the last one.
    const chips = FakeElement.of("ui-multi-select__chips", {}, "span")
        .append(...["a", "b"].map(key => FakeElement.of("ui-multi-select__chip", { "data-ui-select-chip": key }, "span")));
    const trigger = FakeElement.of("ui-select__trigger ui-multi-select__trigger", { role: "combobox", tabindex: "0" }).append(chips);
    const popup = FakeElement.of("ui-select__popup ui-select__list", { role: "listbox" }).append(...["a", "b"].map(key => {
        const option = FakeElement.of("ui-select__option", { "data-ui-key": key, role: "option" });

        option.dataset.uiKey = key;
        return option;
    }));
    const select = FakeElement.of("ui-select ui-multi-select", { "data-ui-id": "4", "data-ui-selected-keys": "[\"a\",\"b\"]", "data-ui-clearable": "" }).append(trigger, popup);

    return place(select, trigger);
}

function place(select: FakeElement, trigger: FakeElement): Scene {
    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(select);
    trigger.focus();

    return { select, trigger };
}

function keys(at: Scene): string[] {
    return JSON.parse(at.select.getAttribute("data-ui-selected-keys") ?? "[]") as string[];
}

function press(at: Scene, name: string): FakeKeyboardEvent {
    const event = new FakeKeyboardEvent(name, at.trigger);

    noteKey(real<Event>(event));
    at.trigger.dispatchEvent(event);
    return event;
}

test("Delete on a closed select that shows its clear empties it, and so does Backspace", () => {
    for (const key of ["Delete", "Backspace"]) {
        const at = single();

        assert.equal(press(at, key).defaultPrevented, true);
        assert.equal(at.select.hasAttribute("data-ui-select-value"), false);
    }
});

test("a select without the clear, or read-only, keeps its value under both keys", () => {
    for (const [classes, clearable] of [["ui-select", false], ["ui-select ui-readonly", true]] as const) {
        const at = single(classes, clearable);

        press(at, "Delete");
        press(at, "Backspace");

        assert.equal(at.select.getAttribute("data-ui-select-value"), "a");
    }
});

test("Delete on a multi-select that shows its clear takes every chip; its Backspace takes the last one only", () => {
    const at = multiple();

    press(at, "Backspace");
    assert.deepEqual(keys(at), ["a"]);

    press(at, "Delete");
    assert.deepEqual(keys(at), []);
});
