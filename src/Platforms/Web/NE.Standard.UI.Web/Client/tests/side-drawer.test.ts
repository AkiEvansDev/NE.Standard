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
    // Given back as a pointer's opening gives it: no keyboard ring, no tooltip on the button.
    assert.equal(toggle.hasAttribute("data-ui-pointer-focus"), true);
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

test("a page's own button opens the drawer, and the keyboard goes back to it rather than to a button out of sight", () => {
    const { root, toggle, drawer } = shell();
    const opener = FakeElement.of("ui-button", { "data-ui-drawer-toggle": "left", "aria-expanded": "false" }, "button");

    // The shell's own, in a header collapsed on a phone: first in the page, out of sight.
    toggle.laidOut = false;
    root.append(FakeElement.of("", { "data-ui-region": "content" }).append(opener));
    drawer.visible = true;
    opener.focus();
    openByKey(opener);

    assert.equal(root.getAttribute("data-ui-drawer-open"), "left");
    assert.equal(opener.getAttribute("aria-expanded"), "true");

    fakeDocument.activeElement?.dispatchEvent(new FakeKeyboardEvent("Escape", fakeDocument.activeElement));

    assert.equal(root.hasAttribute("data-ui-drawer-open"), false);
    assert.equal(opener.getAttribute("aria-expanded"), "false");
    assert.equal(fakeDocument.activeElement, opener);
});

test("a button naming a side that is the phone's bottom bar, or no side at all, opens nothing", () => {
    const { root, drawer } = shell();
    const toBar = FakeElement.of("ui-button", { "data-ui-drawer-toggle": "left" }, "button");
    const toNothing = FakeElement.of("ui-button", { "data-ui-drawer-toggle": "right" }, "button");

    drawer.setAttribute("data-ui-bottom-bar", "");
    root.append(toBar, toNothing);
    toBar.dispatchEvent(new FakeEvent("click"));
    toNothing.dispatchEvent(new FakeEvent("click"));

    assert.equal(root.hasAttribute("data-ui-drawer-open"), false);
    assert.equal(drawer.hasAttribute("data-ui-focus-holder"), false);
});

test("a press on a menu entry in the drawer puts it away, a command's as a link's", () => {
    const { root, toggle, drawer } = shell();
    const entry = FakeElement.of("ui-menu-item", {}, "a");

    drawer.append(FakeElement.of("ui-menu").append(FakeElement.of("ui-menu__host").append(FakeElement.of("ui-menu__item").append(entry))));
    toggle.dispatchEvent(new FakeEvent("click"));

    assert.equal(root.getAttribute("data-ui-drawer-open"), "left");

    entry.dispatchEvent(new FakeEvent("click"));

    assert.equal(root.hasAttribute("data-ui-drawer-open"), false);
});

test("a group's own entry, a check, a caption, a disabled entry and a popup menu's entry leave the drawer open", () => {
    const { root, toggle, drawer } = shell();
    const groupEntry = FakeElement.of("ui-menu-item", { href: "/settings" }, "a");
    const check = FakeElement.of("ui-menu-item", { "data-ui-menu-item-kind": "check" }, "a");
    const caption = FakeElement.of("ui-menu-item", { "data-ui-menu-item-kind": "header" }, "a");
    const disabled = FakeElement.of("ui-menu-item", { "aria-disabled": "true" }, "a");
    const popupEntry = FakeElement.of("ui-menu-item", {}, "a");

    drawer.append(
        FakeElement.of("ui-menu").append(
            FakeElement.of("ui-menu__host").append(
                FakeElement.of("ui-menu__item", { "data-ui-menu-group": "" }).append(groupEntry),
                FakeElement.of("ui-menu__item").append(check),
                FakeElement.of("ui-menu__item").append(caption),
                FakeElement.of("ui-menu__item").append(disabled)
            )
        ),
        FakeElement.of("ui-context-menu").append(FakeElement.of("ui-menu").append(popupEntry))
    );
    toggle.dispatchEvent(new FakeEvent("click"));

    for (const entry of [groupEntry, check, caption, disabled, popupEntry]) {
        entry.dispatchEvent(new FakeEvent("click"));

        assert.equal(root.getAttribute("data-ui-drawer-open"), "left", `${entry.className} closed it`);
    }
});
