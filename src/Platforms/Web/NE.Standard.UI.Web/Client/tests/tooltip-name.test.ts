// An icon-only button whose bound title is pushed empty is named by its tooltip again: the tooltip's plain text, read off the
// component's root where the tooltip's own operations wrote it; with no tooltip the name comes off rather than staying stale.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, installFakeDom, real } from "./fake-dom.ts";

installFakeDom();

const { writeTooltipName } = await import("../src/updates/tooltip-name.ts");

test("a title pushed empty names the button by its tooltip's plain text", () => {
    const button = FakeElement.of("ui-button", { "data-ui-tooltip": "Add **a** row, see [the docs](https://docs.example.com)", "data-ui-tooltip-named": "" }, "button");

    writeTooltipName(real(button), real(button), "aria-label");

    assert.equal(button.getAttribute("aria-label"), "Add a row, see the docs");
});

test("a split button's press is named by the tooltip on the component's root", () => {
    const press = FakeElement.of("ui-split-button__press", { "data-ui-tooltip-named": "" }, "button");
    const root = FakeElement.of("ui-split-button", { "data-ui-tooltip": "Save" }).append(press);

    writeTooltipName(real(root), real(press), "aria-label");

    assert.equal(press.getAttribute("aria-label"), "Save");
    assert.equal(root.hasAttribute("aria-label"), false);
});

test("with no tooltip the stale name comes off", () => {
    const button = FakeElement.of("ui-button", { "aria-label": "Add", "data-ui-tooltip-named": "" }, "button");

    writeTooltipName(real(button), real(button), "aria-label");

    assert.equal(button.hasAttribute("aria-label"), false);
});
