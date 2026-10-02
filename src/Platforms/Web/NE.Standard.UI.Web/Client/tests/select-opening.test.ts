// Where a select's list starts: opened by a press with no value it lights no option and the field keeps the keyboard, so the first
// ArrowDown lands on the first option and the first ArrowUp on the last; opened by a key, or on a value, it starts on that option.

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
const { noteKey, notePress } = await import("../src/interactions/popup-focus.ts");

new SelectInteractionEngine({ root: real<ParentNode>(fakeDocument.body) });

type Scene = { readonly select: FakeElement; readonly trigger: FakeElement; readonly options: readonly FakeElement[] };

function scene(options: { readonly value?: string } = {}): Scene {
    const trigger = FakeElement.of("ui-select__trigger", {}, "button");
    const list = ["amsterdam", "ashburn", "singapore"].map(key => FakeElement.of("ui-select__option", { "data-ui-key": key, role: "option", tabindex: "0", "aria-selected": key === options.value ? "true" : "false" }));
    const popup = FakeElement.of("ui-select__popup ui-select__list", { role: "listbox" }).append(...list);
    const select = FakeElement.of("ui-select", { "data-ui-id": "3" }).append(trigger, popup);

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(select);
    fakeDocument.activeElement = fakeDocument.body;

    return { select, trigger, options: list };
}

function press(at: Scene): void {
    notePress(real(at.trigger));
    at.trigger.focus();
    at.trigger.dispatchEvent(new FakeEvent("click"));
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

test("a capped list opens scrolled to its chosen option, and one already in view stays where it is", () => {
    const at = scene({ value: "singapore" });
    const list = at.select.querySelector(".ui-select__popup")!;

    // A list two options tall over three, each option 32 px: the chosen third stands under the list's foot.
    list.rect = { left: 0, top: 100, width: 200, height: 64 };
    at.options.forEach((option, i) => {
        option.rect = { left: 0, top: 100 + i * 32, width: 200, height: 32 };
    });

    press(at);

    assert.equal(list.scrollTop, 32);
    close(at);

    list.scrollTop = 0;
    at.options[2].setAttribute("aria-selected", "false");
    at.options[1].setAttribute("aria-selected", "true");
    press(at);

    assert.equal(list.scrollTop, 0);
    close(at);
});

test("an arrow on a closed select opens it on its chosen option, else ArrowDown on the first and ArrowUp on the last", () => {
    const at = scene();

    noteKey(real<Event>(new FakeKeyboardEvent("Tab")));
    at.trigger.focus();
    arrow("ArrowDown");

    assert.equal(at.select.classes.has("ui-select--open"), true);
    assert.equal(active(at), "amsterdam");
    assert.equal(fakeDocument.activeElement, at.options[0]);
    close(at);

    at.trigger.focus();
    arrow("ArrowUp");

    assert.equal(active(at), "singapore");
    close(at);

    const chosen = scene({ value: "ashburn" });

    chosen.trigger.focus();
    arrow("ArrowUp");

    assert.equal(active(chosen), "ashburn");
    close(chosen);
});
