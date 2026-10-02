// Type-ahead on a select, as on a native list: typed characters with no pause between them make a prefix, the same letter again walks
// the options it begins, disabled options are passed; a closed field opens on the match, an open list moves its current option, and
// nothing is chosen. A chord and a composing key are left alone; a search's typing is its term (search-field.test.ts).

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, FakeKeyboardEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

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
const { TypeAhead } = await import("../src/interactions/type-ahead.ts");
const { noteKey, notePress } = await import("../src/interactions/popup-focus.ts");

new SelectInteractionEngine({ root: real<ParentNode>(fakeDocument.body) });

const Cities = ["Amsterdam", "Ashburn", "Ålesund", "Berlin", "Bern", "Singapore"];

type Scene = { readonly select: FakeElement; readonly trigger: FakeElement; readonly options: readonly FakeElement[] };

function scene(options: { readonly multiple?: boolean; readonly value?: string; readonly disabled?: string } = {}): Scene {
    const trigger = FakeElement.of("ui-select__trigger", { tabindex: "0" }, options.multiple === true ? "div" : "button");
    const list = Cities.map(city => {
        const key = city.toLowerCase();
        const option = FakeElement.of(`ui-select__option${key === options.disabled ? " ui-disabled" : ""}`, { "data-ui-key": key, role: "option", tabindex: "0", "aria-selected": key === options.value ? "true" : "false" });

        option.append(Object.assign(FakeElement.of("ui-text__title", {}, "span"), { textContent: city }));
        return option;
    });
    const popup = FakeElement.of("ui-select__popup ui-select__list", { role: "listbox" }).append(...list);
    const select = FakeElement.of(`ui-select${options.multiple === true ? " ui-multi-select" : ""}`, { "data-ui-id": "3", lang: "en" }).append(trigger, popup);

    if (options.value !== undefined)
        select.setAttribute(options.multiple === true ? "data-ui-selected-keys" : "data-ui-select-value", options.multiple === true ? JSON.stringify([options.value]) : options.value);

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(select);
    fakeDocument.activeElement = fakeDocument.body;

    return { select, trigger, options: list };
}

function type(characters: string, extra: Readonly<Record<string, unknown>> = {}): FakeKeyboardEvent[] {
    return Array.from(characters, character => {
        const event = Object.assign(new FakeKeyboardEvent(character, fakeDocument.activeElement), { getModifierState: () => false }, extra);

        noteKey(real<Event>(event));
        fakeDocument.activeElement?.dispatchEvent(event);
        return event;
    });
}

function focusField(at: Scene): void {
    noteKey(real<Event>(new FakeKeyboardEvent("Tab")));
    at.trigger.focus();
}

function press(at: Scene): void {
    notePress(real(at.trigger));
    at.trigger.focus();
    at.trigger.dispatchEvent(new FakeEvent("click"));
}

function isOpen(at: Scene): boolean {
    return at.select.classes.has("ui-select--open");
}

function active(at: Scene): string | null {
    return at.options.find(option => option.hasAttribute("data-ui-active"))?.getAttribute("data-ui-key") ?? null;
}

function close(at: Scene): void {
    if (isOpen(at))
        at.trigger.dispatchEvent(new FakeEvent("click"));
}

/** A type-ahead on a clock the test moves, over the cities as plain words. */
function clocked(): { readonly next: (character: string, current: string | null) => string | null; readonly wait: (milliseconds: number) => void } {
    let now = 0;
    const typeAhead = new TypeAhead(() => now);
    const context = real<Element>({ closest: () => null });
    const owner = {};

    return {
        next: (character, current) => typeAhead.next({ owner, character, entries: Cities, current, words: city => city, context }),
        wait: milliseconds => {
            now += milliseconds;
        }
    };
}

test("characters typed with no pause make one prefix", () => {
    const list = clocked();

    assert.equal(list.next("b", null), "Berlin");
    assert.equal(list.next("e", "Berlin"), "Berlin");
    assert.equal(list.next("r", "Berlin"), "Berlin");
    assert.equal(list.next("n", "Berlin"), "Bern");
});

test("a pause ends the prefix and the next character starts a new one", () => {
    const list = clocked();

    assert.equal(list.next("s", null), "Singapore");
    list.wait(400);
    assert.equal(list.next("x", "Singapore"), null);
    list.wait(501);
    assert.equal(list.next("a", "Singapore"), "Amsterdam");
});

test("the same letter again walks the options it begins, round past the end", () => {
    const list = clocked();

    assert.equal(list.next("a", null), "Amsterdam");
    assert.equal(list.next("a", "Amsterdam"), "Ashburn");
    // Case and accents aside: the folded Å begins with an a.
    assert.equal(list.next("a", "Ashburn"), "Ålesund");
    assert.equal(list.next("a", "Ålesund"), "Amsterdam");
});

test("a first letter starts past the current option, as a native list's does", () => {
    const list = clocked();

    assert.equal(list.next("B", "Berlin"), "Bern");
});

test("a closed select opens on the first option the typed prefix begins, and chooses nothing", () => {
    const at = scene({ value: "amsterdam" });

    focusField(at);
    type("be");

    assert.equal(isOpen(at), true);
    assert.equal(active(at), "berlin");
    assert.equal(fakeDocument.activeElement, at.options[3]);
    assert.equal(at.select.getAttribute("data-ui-select-value"), "amsterdam");
    close(at);
});

test("a closed select with no match stays shut, and the key is taken all the same", () => {
    const at = scene();

    focusField(at);
    const [event] = type("z");

    assert.equal(isOpen(at), false);
    assert.equal(event.defaultPrevented, true);
});

test("an open list moves its current option with the prefix and the same letter walks on, the value untouched", () => {
    const at = scene({ value: "singapore" });

    press(at);
    type("b");
    assert.equal(active(at), "berlin");
    assert.equal(fakeDocument.activeElement, at.options[3]);

    type("b");
    assert.equal(active(at), "bern");
    assert.equal(at.options[4].getAttribute("tabindex"), "0");
    assert.equal(at.select.getAttribute("data-ui-select-value"), "singapore");
    assert.equal(isOpen(at), true);
    close(at);
});

test("a list a press opened with no value takes the prefix from its field", () => {
    const at = scene();

    press(at);
    assert.equal(fakeDocument.activeElement, at.trigger);

    type("s");
    assert.equal(active(at), "singapore");
    close(at);
});

test("a disabled option is passed over", () => {
    const at = scene({ disabled: "berlin" });

    press(at);
    type("b");

    assert.equal(active(at), "bern");
    close(at);
});

test("a chord, a composing key, a space and a named key are no prefix", () => {
    const at = scene();

    focusField(at);
    type("b", { ctrlKey: true });
    type("b", { altKey: true });
    type("b", { metaKey: true });
    type("b", { isComposing: true });
    type(" ");
    const [process] = type("x", { key: "Process" });

    assert.equal(isOpen(at), false);
    assert.equal(process.defaultPrevented, false);
});

test("AltGr, which arrives as Ctrl and Alt, types its letter", () => {
    const at = scene();

    focusField(at);
    type("b", { ctrlKey: true, altKey: true, getModifierState: (key: string) => key === "AltGraph" });

    assert.equal(active(at), "berlin");
    close(at);
});

test("a multi-select's list moves its current option and ticks nothing", () => {
    const at = scene({ multiple: true, value: "singapore" });

    focusField(at);
    type("a");

    assert.equal(isOpen(at), true);
    assert.equal(active(at), "amsterdam");

    type("s");
    assert.equal(active(at), "ashburn");
    assert.equal(at.select.getAttribute("data-ui-selected-keys"), JSON.stringify(["singapore"]));
    close(at);
});

test("a read-only select offers no list to a typed key", () => {
    const at = scene();

    at.select.classes.add("ui-readonly");
    focusField(at);
    type("b");

    assert.equal(isOpen(at), false);
});
