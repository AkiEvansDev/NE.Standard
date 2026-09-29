// A side as a drawer: its button opens it and takes the focus into it once its content has begun to show — a key's opening into
// its first control, a press's onto the drawer itself, a holder, so no field raises a phone's keyboard unasked — and Escape puts it
// away, the focus going back to the button; a field's own Escape leaves the field first.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, FakeInput, FakeKeyboardEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

// Frames run by hand, so a test says when the drawer's content has begun to show.
const frames: (() => void)[] = [];

installFakeDom({
    CSS: { escape: (value: string) => value },
    requestAnimationFrame: (callback: () => void) => frames.push(callback)
});

const { SideDrawerEngine } = await import("../src/interactions/side-drawer-engine.ts");
const { noteKey, notePress } = await import("../src/interactions/popup-focus.ts");

function runFrames(): void {
    for (const frame of frames.splice(0))
        frame();
}

function shell(): { root: FakeElement; toggle: FakeElement; drawer: FakeElement; search: FakeInput } {
    const toggle = FakeElement.of("", { "data-ui-drawer-toggle": "left" }, "button");
    const search = new FakeInput("search");
    const drawer = FakeElement.of("", { "data-ui-region": "left" }).append(new FakeElement().append(search));
    const root = FakeElement.of("", { "data-ui-root": "" }).append(FakeElement.of("", { "data-ui-region": "header" }).append(toggle), drawer);

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(root);
    frames.length = 0;

    return { root, toggle, drawer, search };
}

new SideDrawerEngine({ root: real<ParentNode>(fakeDocument.body) });

function openByKey(toggle: FakeElement): void {
    noteKey(real<Event>(new FakeKeyboardEvent("Enter")));
    toggle.dispatchEvent(new FakeEvent("click"));
}

test("the drawer a key opened gives its first control the focus once its content shows, not left on the button it covers", () => {
    const { root, toggle, search } = shell();

    // The content fades its visibility in from the drawer's hidden: on the key's own frame it refuses the focus.
    search.visible = false;
    toggle.focus();
    openByKey(toggle);

    assert.equal(root.getAttribute("data-ui-drawer-open"), "left");
    assert.equal(toggle.getAttribute("aria-expanded"), "true");
    assert.equal(fakeDocument.activeElement, toggle);

    search.visible = true;
    runFrames();

    assert.equal(fakeDocument.activeElement, search);
});

test("the drawer a press opened takes the focus itself, as a holder, and no field of it; put away, it is no holder", () => {
    const { root, toggle, drawer } = shell();

    drawer.visible = false;
    toggle.focus();
    notePress(real(toggle));
    toggle.dispatchEvent(new FakeEvent("click"));

    assert.equal(drawer.hasAttribute("data-ui-focus-holder"), true);
    assert.equal(drawer.getAttribute("tabindex"), "-1");

    drawer.visible = true;
    runFrames();

    assert.equal(fakeDocument.activeElement, drawer);

    notePress(real(toggle));
    toggle.dispatchEvent(new FakeEvent("click"));

    assert.equal(root.hasAttribute("data-ui-drawer-open"), false);
    assert.equal(fakeDocument.activeElement, toggle);
    assert.equal(drawer.hasAttribute("data-ui-focus-holder"), false);
    assert.equal(drawer.hasAttribute("tabindex"), false);
});

test("a focus the reader moved meanwhile is not taken back into the drawer", () => {
    const { toggle, search } = shell();
    const elsewhere = new FakeElement("button");

    fakeDocument.body.append(elsewhere);
    search.visible = false;
    toggle.focus();
    openByKey(toggle);
    elsewhere.focus();
    search.visible = true;
    runFrames();

    assert.equal(fakeDocument.activeElement, elsewhere);
});

test("Escape puts the drawer away and gives the focus back to its button; one a field already took leaves it open", () => {
    const { root, toggle, search } = shell();

    toggle.focus();
    openByKey(toggle);

    assert.equal(fakeDocument.activeElement, search);

    const taken = new FakeKeyboardEvent("Escape", search);

    taken.preventDefault();
    search.dispatchEvent(taken);

    assert.equal(root.getAttribute("data-ui-drawer-open"), "left");

    search.dispatchEvent(new FakeKeyboardEvent("Escape", search));

    assert.equal(root.hasAttribute("data-ui-drawer-open"), false);
    assert.equal(toggle.getAttribute("aria-expanded"), "false");
    assert.equal(fakeDocument.activeElement, toggle);
});
