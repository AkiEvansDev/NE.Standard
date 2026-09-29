// Where a select's list starts: opened by a press with no value it lights no option and the field keeps the keyboard, so the first
// ArrowDown lands on the first option and the first ArrowUp on the last; opened by a key, or on a value, it starts on that option.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, FakeInput, FakeKeyboardEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

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
const { noteKey, notePress } = await import("../src/interactions/popup-focus.ts");

new SelectInteractionEngine({ root: real<ParentNode>(fakeDocument.body) });

type Scene = { readonly select: FakeElement; readonly trigger: FakeElement; readonly options: readonly FakeElement[]; readonly input: FakeInput | null };

function scene(options: { readonly search?: boolean; readonly value?: string } = {}): Scene {
    const field = options.search === true ? Object.assign(new FakeInput("search"), { className: "ui-search__input" }) : null;
    const trigger = FakeElement.of("ui-select__trigger", options.search === true ? { "data-ui-select-trigger-mode": "input" } : {}, options.search === true ? "div" : "button");
    const list = ["amsterdam", "ashburn", "singapore"].map(key => FakeElement.of("ui-select__option", { "data-ui-key": key, role: "option", tabindex: "0", "aria-selected": key === options.value ? "true" : "false" }));
    const popup = FakeElement.of("ui-select__popup", { role: "listbox" }).append(...list);
    const select = FakeElement.of("ui-select", { "data-ui-id": "3" }).append(trigger, popup);

    if (field !== null)
        trigger.append(field);

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(select);
    fakeDocument.activeElement = fakeDocument.body;

    return { select, trigger, options: list, input: field };
}

function press(at: Scene): void {
    const target = at.input ?? at.trigger;

    notePress(real(target));
    target.focus();
    target.dispatchEvent(new FakeEvent("click"));
}

function openByKey(at: Scene): void {
    noteKey(real<Event>(new FakeKeyboardEvent("Enter")));
    at.trigger.focus();
    at.trigger.dispatchEvent(new FakeEvent("click"));
}

function arrow(name: string): void {
    const event = new FakeKeyboardEvent(name, fakeDocument.activeElement);

    noteKey(real<Event>(event));
    fakeDocument.activeElement?.dispatchEvent(event);
}

function active(at: Scene): string | null {
    return at.options.find(option => option.hasAttribute("data-ui-active"))?.getAttribute("data-ui-key") ?? null;
}

function close(at: Scene): void {
    if (at.select.classes.has("ui-select--open"))
        at.trigger.dispatchEvent(new FakeEvent("click"));
}

test("a select a press opened with no value lights no option, leaves none a tab stop and keeps the keyboard on its trigger", () => {
    const at = scene();

    press(at);

    assert.equal(at.select.classes.has("ui-select--open"), true);
    assert.equal(active(at), null);
    assert.deepEqual(at.options.map(option => option.getAttribute("tabindex")), ["-1", "-1", "-1"]);
    assert.equal(fakeDocument.activeElement, at.trigger);
    close(at);
});

test("the first ArrowDown in such a list lands on the first option, the first ArrowUp on the last", () => {
    const at = scene();

    press(at);
    arrow("ArrowDown");

    assert.equal(active(at), "amsterdam");
    assert.equal(fakeDocument.activeElement, at.options[0]);
    close(at);

    press(at);
    arrow("ArrowUp");

    assert.equal(active(at), "singapore");
    close(at);
});

test("a select a key opened starts on its first option, lit", () => {
    const at = scene();

    openByKey(at);

    assert.equal(active(at), "amsterdam");
    assert.equal(fakeDocument.activeElement, at.options[0]);
    close(at);
});

test("a select with a value starts from it however it opened, and the arrow goes on from it", () => {
    const at = scene({ value: "ashburn" });

    press(at);

    assert.equal(active(at), "ashburn");

    arrow("ArrowDown");

    assert.equal(active(at), "singapore");
    close(at);
});

test("a search a press opened marks no option while its field keeps the keyboard; ArrowDown then enters at the first", () => {
    const at = scene({ search: true });

    press(at);

    assert.equal(active(at), null);
    assert.equal(fakeDocument.activeElement, at.input);

    arrow("ArrowDown");

    assert.equal(active(at), "amsterdam");
});
