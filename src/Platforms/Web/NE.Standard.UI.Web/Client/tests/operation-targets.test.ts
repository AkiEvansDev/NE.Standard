// Where a property's operation lands: the root by name, the root itself where its selector names it (an icon-only button its
// tooltip names), else the component's own part the selector finds — never a part of a component nested inside it.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, installFakeDom, real } from "./fake-dom.ts";

installFakeDom();

const { resolveOperationElements } = await import("../src/addressing/operation-targets.ts");

const NamedTarget = "[data-ui-tooltip-named]:not([data-ui-text-title])";

function land(component: FakeElement, target: string): Element[] {
    return resolveOperationElements(real<Element>(component), { kind: "Attribute", name: "aria-label", target }, () => []);
}

test("a selector that names the root lands on the root, while the root still matches it", () => {
    const button = FakeElement.of("ui-button", { "data-ui-id": "4", "data-ui-tooltip-named": "" }, "button").append(new FakeElement("span"));

    assert.deepEqual(land(button, NamedTarget), [button]);

    // A title shown: the tooltip no longer names the button.
    button.setAttribute("data-ui-text-title", "");

    assert.deepEqual(land(button, NamedTarget), []);
});

test("a selector finds the component's own part, not one of a component nested inside it", () => {
    const nested = FakeElement.of("ui-select__field", { "data-ui-labelled": "" });
    const own = FakeElement.of("ui-input__field", { "data-ui-labelled": "" });
    const field = FakeElement.of("ui-input", { "data-ui-id": "5" }).append(FakeElement.of("", { "data-ui-id": "6" }).append(nested), own);

    assert.deepEqual(land(field, "[data-ui-labelled]"), [own]);
});
