// A page whose content root fills the height keeps the regions' own scroll on a phone (runtime.less): the shell marks the root from
// the first value, and the content root's Height ends its operations with the one that keeps the mark as the height changes.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, installFakeDom } from "./fake-dom.ts";

installFakeDom({});

const { DomOperationRegistry } = await import("../src/updates/dom-operation-registry.ts");
const { ContentFillsOperationKind } = await import("../src/updates/content-fills.ts");
type DomOperationContext = import("../src/updates/dom-operation-registry.ts").DomOperationContext;

const Fills = "data-ui-content-fills";
const FillHeight = "var(--ui-fill-height, 100%)";

/** The operation as a patch of the component's Height runs it, after the base tier's custom property. */
function patched(component: FakeElement, height: string): void {
    // Where the base tier's Style operation, run before, writes it.
    component.style["--ui-height"] = height;
    new DomOperationRegistry().apply({
        resolved: { componentId: 7, propertyId: "p1", component },
        operation: { kind: ContentFillsOperationKind },
        target: component,
        value: null,
        convertedValue: null,
        local: false
    } as unknown as DomOperationContext);
}

function page(): { root: FakeElement; content: FakeElement } {
    const content = FakeElement.of("ui-container", { "data-ui-id": "7" });
    const root = FakeElement.of("ui-root", { "data-ui-root": "" }).append(FakeElement.of("ui-region", { "data-ui-region": "content" }).append(content));

    return { root, content };
}

test("the content root's height turning to Fill and back moves the root's mark", () => {
    const { root, content } = page();

    patched(content, FillHeight);
    assert.equal(root.hasAttribute(Fills), true, "filled");
    patched(content, "auto");
    assert.equal(root.hasAttribute(Fills), false, "auto again");
});

test("a component standing anywhere but at the content region's root leaves the root alone", () => {
    const { root, content } = page();
    const inner = FakeElement.of("ui-text", { "data-ui-id": "8" });
    const side = FakeElement.of("ui-menu", { "data-ui-id": "9" });

    content.append(inner);
    root.append(FakeElement.of("ui-region", { "data-ui-region": "left" }).append(side));

    patched(inner, FillHeight);
    patched(side, FillHeight);
    assert.equal(root.hasAttribute(Fills), false);
});
