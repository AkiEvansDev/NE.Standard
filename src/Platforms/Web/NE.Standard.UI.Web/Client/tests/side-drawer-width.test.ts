// A view's sides are drawers below the width it names (UIViewOptions.SideDrawers): a tablet's for `xl`, a phone's alone for `md`. From
// the medium breakpoint up a pin stands a side in its column — its button pressed, the drawer put away, the pin kept under the side's
// authored id and written on the next page's root, the keyboard kept on a pin pressed inside — while a phone's sides stay drawers
// whatever is pinned, and a bottom bar takes no pin. A modeless side's drawer holds nothing but the tab index it gives back: the page
// beside it keeps its keys, and Escape puts it away only from inside it. A breakpoint puts away only a drawer whose side it ends.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, FakeInput, FakeKeyboardEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

let width = 800;
const widthListeners: (() => void)[] = [];
const stored = new Map<string, string>();

installFakeDom({
    CSS: { escape: (value: string) => value },
    requestAnimationFrame: () => undefined,
    matchMedia: (query: string) => ({ matches: width >= Number(/min-width: (\d+)px/.exec(query)?.[1] ?? 0), addEventListener: (_: string, listener: () => void) => widthListeners.push(listener) }),
    window: {
        addEventListener: () => undefined,
        localStorage: {
            getItem: (key: string): string | null => stored.get(key) ?? null,
            setItem: (key: string, value: string): void => void stored.set(key, value),
            removeItem: (key: string): void => void stored.delete(key)
        }
    }
});

const { SideDrawerEngine } = await import("../src/interactions/side-drawer-engine.ts");
const { sideIsDrawer } = await import("../src/rendering/side-drawer-width.ts");

function resize(to: number): void {
    width = to;

    for (const listener of widthListeners)
        listener();
}

function shell(drawers: string, modeless?: string): { root: FakeElement; toggle: FakeElement; pin: FakeElement; drawer: FakeElement; field: FakeInput; outside: FakeInput } {
    const toggle = FakeElement.of("", { "data-ui-drawer-toggle": "left-side" }, "button");
    const pin = FakeElement.of("", { "data-ui-drawer-pin": "left-side", "aria-pressed": "false" }, "button");
    const field = new FakeInput("sampler");
    const outside = new FakeInput("message");
    const drawer = FakeElement.of("", { "data-ui-region": "left-side" }).append(FakeElement.of("", { "data-ui-name": "settings" }).append(pin, field));
    const root = FakeElement.of("", { "data-ui-root": "", "data-ui-side-drawers": drawers, ...modeless === undefined ? {} : { "data-ui-drawer-modeless": modeless } })
        .append(FakeElement.of("", { "data-ui-region": "header" }).append(toggle), drawer, FakeElement.of("", { "data-ui-region": "content" }).append(outside));

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(root);
    stored.clear();

    return { root, toggle, pin, drawer, field, outside };
}

new SideDrawerEngine({ root: real<ParentNode>(fakeDocument.body) });

test("a tablet's sides are drawers for a view naming the extra-large breakpoint, and columns for one naming the medium", () => {
    width = 800;

    const wide = shell("xl");

    wide.toggle.dispatchEvent(new FakeEvent("click"));
    assert.equal(wide.root.getAttribute("data-ui-drawer-open"), "left-side");

    const narrow = shell("md");

    narrow.toggle.dispatchEvent(new FakeEvent("click"));
    assert.equal(narrow.root.hasAttribute("data-ui-drawer-open"), false, "standing in its column, the side opens as nothing");
});

test("a pin stands the side in its column, put away first, and is kept under the side's id for the root of the next page", () => {
    width = 800;

    const { root, toggle, pin } = shell("xl");

    toggle.dispatchEvent(new FakeEvent("click"));
    pin.dispatchEvent(new FakeEvent("click"));

    assert.equal(root.hasAttribute("data-ui-pinned-left-side"), true);
    assert.equal(root.hasAttribute("data-ui-drawer-open"), false);
    assert.equal(pin.getAttribute("aria-pressed"), "true");
    assert.equal(stored.get("ne.ui:settings:pinned"), "true");
    assert.deepEqual(JSON.parse(stored.get("ne.ui:settings:boot") ?? "{}"), { pinned: { root: true, attributes: { "data-ui-pinned-left-side": "" } } });

    toggle.dispatchEvent(new FakeEvent("click"));
    assert.equal(root.hasAttribute("data-ui-drawer-open"), false, "a pinned side is no drawer to open");

    pin.dispatchEvent(new FakeEvent("click"));

    assert.equal(root.hasAttribute("data-ui-pinned-left-side"), false);
    assert.equal(pin.getAttribute("aria-pressed"), "false");
    assert.equal(stored.has("ne.ui:settings:pinned"), false);
    assert.equal(stored.has("ne.ui:settings:boot"), false);
});

test("a phone's sides are drawers whatever is pinned", () => {
    width = 700;

    const { root, toggle } = shell("xl");

    root.setAttribute("data-ui-pinned-left-side", "");
    toggle.dispatchEvent(new FakeEvent("click"));

    assert.equal(root.getAttribute("data-ui-drawer-open"), "left-side");
});

test("a modeless drawer holds nothing: the page keeps its keys beside it, and Escape puts it away only from inside", () => {
    width = 800;

    const { root, toggle, drawer, field, outside } = shell("xl", "left-side");

    toggle.dispatchEvent(new FakeEvent("click"));

    assert.equal(drawer.hasAttribute("aria-modal"), false);
    assert.equal(drawer.hasAttribute("data-ui-focus-holder"), false);

    outside.focus();
    outside.dispatchEvent(new FakeKeyboardEvent("Escape"));
    assert.equal(root.getAttribute("data-ui-drawer-open"), "left-side", "an Escape in the page beside it is the page's");

    field.focus();
    field.dispatchEvent(new FakeKeyboardEvent("Escape"));
    assert.equal(root.hasAttribute("data-ui-drawer-open"), false);
});

test("a pin pressed inside the open drawer keeps the keyboard as the side stands in its column; unpinned, it goes to the side's button", () => {
    width = 800;

    const { root, toggle, pin } = shell("xl");

    toggle.dispatchEvent(new FakeEvent("click"));
    pin.focus();
    pin.dispatchEvent(new FakeEvent("click"));

    assert.equal(root.hasAttribute("data-ui-pinned-left-side"), true);
    assert.equal(fakeDocument.activeElement, pin, "the burger it would go back to is hidden by the pin");

    pin.dispatchEvent(new FakeEvent("click"));

    assert.equal(root.hasAttribute("data-ui-pinned-left-side"), false);
    assert.equal(fakeDocument.activeElement, toggle, "the pin is in a drawer put away");
});

test("a modeless drawer gives back the tab index it took as it is put away", () => {
    width = 800;

    const { toggle, drawer } = shell("xl", "left-side");

    toggle.dispatchEvent(new FakeEvent("click"));
    assert.equal(drawer.getAttribute("tabindex"), "-1");

    toggle.dispatchEvent(new FakeEvent("click"));
    assert.equal(drawer.hasAttribute("tabindex"), false);
});

test("a bottom bar takes no pin: it is the bar whatever is pinned", () => {
    width = 800;

    const { root, drawer, pin } = shell("xl");

    drawer.setAttribute("data-ui-bottom-bar", "");
    pin.dispatchEvent(new FakeEvent("click"));

    assert.equal(root.hasAttribute("data-ui-pinned-left-side"), false);

    root.setAttribute("data-ui-pinned-left-side", "");
    assert.equal(sideIsDrawer(real(root), "left-side"), true, "a pin kept from another page is read past");
});

test("across a breakpoint only a drawer whose side stands in its column again is put away", () => {
    width = 800;

    const { root, toggle } = shell("xl");

    toggle.dispatchEvent(new FakeEvent("click"));
    resize(1000);
    assert.equal(root.getAttribute("data-ui-drawer-open"), "left-side", "below the extra-large breakpoint still a drawer");

    resize(1300);
    assert.equal(root.hasAttribute("data-ui-drawer-open"), false);
});

test("a page's own pin is a toggle that announces its side's pin, pressed or restored on load, for an interaction on its Pressed", () => {
    width = 800;

    const { root, pin } = shell("xl");
    const heard: string[] = [];

    pin.setAttribute("data-ui-value-kind", "pressed");
    pin.addEventListener("change", () => void heard.push(pin.getAttribute("aria-pressed") ?? ""));

    pin.dispatchEvent(new FakeEvent("click"));
    pin.dispatchEvent(new FakeEvent("click"));
    assert.deepEqual(heard, ["true", "false"]);

    root.setAttribute("data-ui-pinned-left-side", "");
    heard.length = 0;
    new SideDrawerEngine({ root: real<ParentNode>(root) });

    assert.deepEqual(heard, ["true"], "a pin the page came back with");
});
