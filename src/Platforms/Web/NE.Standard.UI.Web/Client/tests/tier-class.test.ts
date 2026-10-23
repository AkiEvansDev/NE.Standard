// A layout value drawn by a class that differs by breakpoint (TierClassRenderer): the element wears the class of the width the window
// stands at, from the family's list of tiers, and a patch's converters write the width's class and the tiers again; one value at every
// width writes no list.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, installFakeDom } from "./fake-dom.ts";

let width = 900;

installFakeDom({
    window: { addEventListener: () => undefined, setTimeout, clearTimeout, innerWidth: 900, innerHeight: 844 },
    // The stylesheet's own question: a `min-width` query answered for the width this test sets.
    // Live, as a browser's list is: the page keeps one per breakpoint and reads it again.
    matchMedia: (query: string) => ({ get matches() { return width >= Number(/min-width: (\d+)px/.exec(query)?.[1] ?? 0); }, addEventListener: () => undefined })
});

const { fitAllTierClasses, fitTierClasses } = await import("../src/rendering/tier-class.ts");
const { webDomConverters } = await import("../src/rendering/web-dom-converters.ts");

const Turning = "ui-orientation--vertical ui-orientation--vertical ui-orientation--horizontal ui-orientation--horizontal ui-orientation--horizontal";

test("an element wears its family's class of the width it stands at, the other tiers' taken off", () => {
    const panel = FakeElement.of("ui-stack-panel ui-orientation--vertical", { "data-ui-id": "1", "data-ui-tier-orientation": Turning });

    width = 900;
    fitTierClasses(panel as unknown as Element);
    assert.ok(panel.classList.contains("ui-orientation--horizontal"));
    assert.ok(!panel.classList.contains("ui-orientation--vertical"));

    width = 500;
    fitTierClasses(panel as unknown as Element);
    assert.ok(panel.classList.contains("ui-orientation--vertical"));
    assert.ok(!panel.classList.contains("ui-orientation--horizontal"));
    // Another family on the element is its own.
    assert.ok(panel.classList.contains("ui-stack-panel"));
});

test("a page is fitted whole, a size and a layout beside an orientation", () => {
    const button = FakeElement.of("ui-button ui-button--primary ui-button--small", { "data-ui-tier-size": "ui-button--small ui-button--small ui-button--small ui-button--large ui-button--large" });
    const list = FakeElement.of("ui-items-view ui-items-view--stack", { "data-ui-tier-layout": "ui-items-view--stack ui-items-view--stack ui-items-view--wrap ui-items-view--wrap ui-items-view--wrap" });
    const root = FakeElement.of("ui-root").append(button, list);

    width = 1400;
    fitAllTierClasses(root as unknown as ParentNode);

    assert.ok(button.classList.contains("ui-button--large"));
    assert.ok(!button.classList.contains("ui-button--small"));
    // The button's kind shares the prefix and is no size: it stays.
    assert.ok(button.classList.contains("ui-button--primary"));
    assert.ok(list.classList.contains("ui-items-view--wrap"));
});

test("a patch writes the width's class and every tier's, and no list for one value at every width", () => {
    const value = { base: "Vertical", md: "Horizontal" };
    const className = webDomConverters.get("orientationClass");
    const tiers = webDomConverters.get("orientationTierClasses");

    assert.ok(className !== undefined && tiers !== undefined);

    width = 900;
    assert.equal(className(value), "ui-orientation--horizontal");
    width = 500;
    assert.equal(className(value), "ui-orientation--vertical");
    assert.equal(tiers(value), Turning);
    // A bare value, the way a bound plain value arrives, is its own at every width.
    assert.equal(className("Horizontal"), "ui-orientation--horizontal");
    assert.equal(tiers("Horizontal"), undefined);
    assert.equal(webDomConverters.get("inputSizeTierClasses")?.({ base: "Large", sm: "Medium" }), "ui-input--large ui-input--medium ui-input--medium ui-input--medium ui-input--medium");
});
