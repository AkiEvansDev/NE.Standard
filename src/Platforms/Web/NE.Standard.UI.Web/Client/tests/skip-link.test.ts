// The shell's skip link moves the keyboard to the content region, past the header and the left side, and the address keeps no `#`:
// the region takes the focus for that moment only, its tab index gone again as the focus leaves it, so a press on its plain parts
// never focuses it.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

installFakeDom();

const { SkipLinkEngine } = await import("../src/interactions/skip-link-engine.ts");

type Shell = {
    readonly link: FakeElement;
    readonly side: FakeElement;
    readonly content: FakeElement;
};

function shell(): Shell {
    fakeDocument.body.children.length = 0;
    fakeDocument.activeElement = fakeDocument.body;

    const link = FakeElement.of("ui-shell__skip-link", { "data-ui-skip-link": "", href: "#ui-content" }, "a");
    const side = FakeElement.of("", { "data-ui-region": "left-side", role: "navigation" }, "section");
    const content = FakeElement.of("", { "data-ui-region": "content", role: "main", id: "ui-content" }, "section");
    const root = FakeElement.of("", { "data-ui-root": "" }, "form");

    root.append(link, side, content);
    fakeDocument.body.append(root);

    new SkipLinkEngine({ root: real<ParentNode>(fakeDocument.body) });

    return { link, side, content };
}

function press(element: FakeElement): FakeEvent {
    const click = new FakeEvent("click");

    element.dispatchEvent(click);

    return click;
}

test("the link puts the keyboard on the content region and keeps the address as it is", () => {
    const { link, content } = shell();

    link.focus();

    const click = press(link);

    assert.equal(fakeDocument.activeElement, content);
    assert.equal(content.getAttribute("tabindex"), "-1");
    assert.ok(click.defaultPrevented);
});

test("the region's tab index goes as the focus leaves it", () => {
    const { link, side, content } = shell();

    press(link);
    side.setAttribute("tabindex", "0");
    side.focus();

    assert.equal(content.hasAttribute("tabindex"), false);
});

test("a region that is a stop of its own keeps its tab index", () => {
    const { link, side, content } = shell();

    content.setAttribute("tabindex", "0");
    press(link);
    side.setAttribute("tabindex", "0");
    side.focus();

    assert.equal(content.getAttribute("tabindex"), "0");
});

test("a press anywhere else is left alone", () => {
    const { side, content } = shell();

    const click = press(side);

    assert.notEqual(fakeDocument.activeElement, content);
    assert.equal(click.defaultPrevented, false);
});
