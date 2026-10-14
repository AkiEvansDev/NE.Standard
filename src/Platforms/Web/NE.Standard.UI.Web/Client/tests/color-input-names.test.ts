// A colour input's palette entry is found by its name in a selector: a name holding a quote or a backslash is escaped there, so the
// entry is still found and its colour shown.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeInput, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

installFakeDom({
    window: { addEventListener: () => undefined },
    MutationObserver: class {
        public observe(): void {
        }
    },
    getComputedStyle: () => ({ direction: "ltr" })
});

const { ColorInputEngine } = await import("../src/interactions/color-input-engine.ts");

test("a palette entry whose name holds a quote is found, and the input shows its colour", () => {
    const name = "Sky \"Deep\" \\ Blue";
    const chip = FakeElement.of("ui-color-input__chip", { "data-ui-color-name": name }, "button");
    const value = Object.assign(new FakeInput("hidden"), { value: `${name}/Tint/0/255` });

    value.classes.add("ui-color-input__value-input");
    (chip.style.setProperty as (property: string, text: string) => void)("--ui-color-input-chip", "#336699");

    const input = FakeElement.of("ui-color-input").append(value, chip);

    fakeDocument.body.replaceChildren(FakeElement.of("page").append(input));
    new ColorInputEngine({ root: real<ParentNode>(fakeDocument.body) });

    assert.equal((input.style.getPropertyValue as (property: string) => string)("--ui-color-input-solid"), "rgba(51, 102, 153, 1.000)");
    assert.equal(chip.hasAttribute("data-ui-color-name-selected"), true);
});
