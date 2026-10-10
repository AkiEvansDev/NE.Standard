// A command bar to the keyboard is a toolbar: one Tab stop, the arrows along it round past either end, Home and End to its ends, over
// every shown command's controls — both parts of a split button — and the "…" while it shows; a field in it keeps its own caret
// keys, and a control the focus came to is where Tab comes back in.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeInput, FakeKeyboardEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

installFakeDom({
    window: { addEventListener: () => undefined, setTimeout, innerWidth: 1280, innerHeight: 900 },
    getComputedStyle: () => ({
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        direction: "ltr",
        getPropertyValue: () => ""
    }),
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

const { CommandBarEngine } = await import("../src/interactions/command-bar-engine.ts");

type Bar = { readonly root: FakeElement; readonly controls: readonly FakeElement[] };

/** Copy, a split button Deploy with its chevron, and a search field, in a page of their own. */
function bar(rootClasses = ""): Bar {
    const copy = FakeElement.of("ui-button", { "data-ui-id": "1" }, "button");
    const main = FakeElement.of("ui-split-button__main", {}, "button");
    const toggle = FakeElement.of("ui-split-button__toggle", { "aria-haspopup": "menu" }, "button");
    const split = FakeElement.of("ui-split-button", { "data-ui-id": "2" }).append(main, toggle, FakeElement.of("ui-split-button__menu", { role: "presentation" }).append(FakeElement.of("ui-menu", { role: "menu" }).append(FakeElement.of("ui-menu-item", {}, "button"))));
    const field = new FakeInput();
    const search = FakeElement.of("ui-text-input", { "data-ui-id": "3" }).append(field);
    const host = FakeElement.of("ui-command-bar__host").append(...[copy, split, search].map(command => FakeElement.of("ui-command-bar__item").append(command)));
    const more = FakeElement.of("ui-command-bar__overflow ui-button ui-button--ghost", {}, "button");
    const root = FakeElement.of(`ui-command-bar ${rootClasses}`, { role: "toolbar" }).append(host, more);
    // The menu is shut: nothing in it is laid out.
    split.children[2].laidOut = false;
    split.children[2].children[0].laidOut = false;
    split.children[2].children[0].children[0].laidOut = false;
    more.laidOut = false;

    fakeDocument.body.replaceChildren(FakeElement.of("page").append(root));
    new CommandBarEngine({ root: real<ParentNode>(fakeDocument.body.children[0]) });

    return { root, controls: [copy, main, toggle, field] };
}

function press(target: FakeElement, key: string): FakeKeyboardEvent {
    const domEvent = new FakeKeyboardEvent(key, target);

    target.dispatchEvent(domEvent);

    return domEvent;
}

test("the bar is one Tab stop: its first control, the rest taken out until the arrows come to them", () => {
    const { controls } = bar();

    assert.deepEqual(controls.map(control => control.tabIndex), [0, -1, -1, -1]);
    // A split button's menu is no part of the walk.
    assert.equal(fakeDocument.body.querySelector(".ui-menu-item")?.hasAttribute("data-ui-tab-out"), false);
});

test("Right and Left walk the controls, a split button's two parts each, round past either end", () => {
    const { controls } = bar();

    controls[0].focus();
    press(controls[0], "ArrowRight");

    assert.equal(fakeDocument.activeElement, controls[1]);

    press(controls[1], "ArrowRight");

    assert.equal(fakeDocument.activeElement, controls[2]);
    assert.deepEqual(controls.map(control => control.tabIndex), [-1, -1, 0, -1]);

    controls[0].focus();
    press(controls[0], "ArrowLeft");

    assert.equal(fakeDocument.activeElement, controls[3]);
});

test("Home and End go to the bar's ends; a vertical bar walks by Up and Down", () => {
    const { controls } = bar();

    controls[1].focus();
    press(controls[1], "End");

    assert.equal(fakeDocument.activeElement, controls[3]);

    controls[1].focus();
    press(controls[1], "Home");

    assert.equal(fakeDocument.activeElement, controls[0]);

    const column = bar("ui-orientation--vertical");

    column.controls[0].focus();

    assert.equal(press(column.controls[0], "ArrowRight").defaultPrevented, false);

    press(column.controls[0], "ArrowDown");

    assert.equal(fakeDocument.activeElement, column.controls[1]);
});

test("a field keeps its caret keys; a modified arrow is no step of the bar's", () => {
    const { controls } = bar();
    const field = controls[3] as FakeInput;

    field.value = "logs";
    field.focus();
    field.setSelectionRange(2, 2);

    assert.equal(press(field, "ArrowLeft").defaultPrevented, false);
    assert.equal(fakeDocument.activeElement, field);

    controls[0].focus();

    const chord = Object.assign(new FakeKeyboardEvent("ArrowRight", controls[0]), { altKey: true });

    controls[0].dispatchEvent(chord);

    assert.equal(chord.defaultPrevented, false);
    assert.equal(fakeDocument.activeElement, controls[0]);
});

test("a control the focus came to — pressed, or picked from the list — is where Tab comes back in", () => {
    const { controls } = bar();

    controls[2].focus();

    assert.deepEqual(controls.map(control => control.tabIndex), [-1, -1, 0, -1]);
});
