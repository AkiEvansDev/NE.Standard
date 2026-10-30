// A colour input's palette entry is found by its name in a selector: a name holding a quote or a backslash is escaped there, so the
// entry is still found and its colour shown. Its open picker is called what its toggle is, the field's caption.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, FakeInput, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

installFakeDom({
    window: { addEventListener: () => undefined, setTimeout, innerWidth: 1280, innerHeight: 900 },
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
    },
    getComputedStyle: () => ({ transform: "none", filter: "none", perspective: "none" })
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
    const engine = new ColorInputEngine({ root: real<ParentNode>(fakeDocument.body) });

    try {
        assert.equal((input.style.getPropertyValue as (property: string) => string)("--ui-color-input-solid"), "rgba(51, 102, 153, 1.000)");
        assert.equal(chip.hasAttribute("data-ui-color-name-selected"), true);
        assert.equal(chip.getAttribute("aria-pressed"), "true");
    }
    finally {
        engine.dispose();
    }
});

test("the open picker is called what its toggle is: the field's caption the toggle carries", () => {
    const toggle = FakeElement.of("ui-color-input__swatch", { "data-ui-color-toggle": "", "aria-haspopup": "dialog", "aria-label": "Brand colour" }, "button");
    const popup = FakeElement.of("ui-color-input__popup", { role: "dialog" });
    const input = FakeElement.of("ui-color-input", { "data-ui-id": "9" }).append(FakeElement.of("ui-color-input__row").append(toggle), popup);

    fakeDocument.body.replaceChildren(FakeElement.of("page").append(input));
    const engine = new ColorInputEngine({ root: real<ParentNode>(fakeDocument.body) });

    try {
        toggle.dispatchEvent(new FakeEvent("click"));

        assert.notEqual(toggle.id, "");
        assert.equal(popup.getAttribute("aria-labelledby"), toggle.id);
    }
    finally {
        engine.dispose();
    }
});

test("without the palette, opening the popup focuses the hex field directly and tabs sync aria-selected", () => {
    const toggle = FakeElement.of("ui-color-input__swatch", { "data-ui-color-toggle": "", "aria-haspopup": "dialog", "aria-label": "Fill" }, "button");
    const pickerTab = FakeElement.of("ui-color-input__tab", { "data-ui-color-tab": "picker", role: "tab" }, "button");
    const paletteTab = FakeElement.of("ui-color-input__tab", { "data-ui-color-tab": "palette", role: "tab" }, "button");
    const tabs = FakeElement.of("ui-color-input__tabs", { role: "tablist" }).append(pickerTab, paletteTab);
    const hexField = Object.assign(new FakeInput("text"), { value: "" });
    hexField.setAttribute("data-ui-color-hex", "");
    const pickerPane = FakeElement.of("ui-color-input__pane", { "data-ui-color-pane": "picker" }).append(hexField);
    const popup = FakeElement.of("ui-color-input__popup", { role: "dialog" }).append(tabs, pickerPane);
    const input = FakeElement.of("ui-color-input", { "data-ui-id": "10", "data-ui-color-no-palette": "" })
        .append(FakeElement.of("ui-color-input__row").append(toggle), popup);

    fakeDocument.body.replaceChildren(FakeElement.of("page").append(input));
    const engine = new ColorInputEngine({ root: real<ParentNode>(fakeDocument.body) });

    try {
        assert.equal(pickerTab.getAttribute("aria-selected"), "true");
        assert.equal(paletteTab.getAttribute("aria-selected"), "false");

        toggle.dispatchEvent(new FakeEvent("click"));

        assert.equal(fakeDocument.activeElement, hexField);
    }
    finally {
        engine.dispose();
    }
});

test("without opacity, an 8-digit hex is refused and picking clamps opacity to 255", () => {
    const valueInput = Object.assign(new FakeInput("hidden"), { value: "#33669980" });
    valueInput.classes.add("ui-color-input__value-input");

    const hexField = Object.assign(new FakeInput("text"), { value: "" });
    hexField.setAttribute("data-ui-color-hex", "");

    const redField = Object.assign(new FakeInput("text"), { value: "" });
    redField.setAttribute("data-ui-color-channel", "r");

    const input = FakeElement.of("ui-color-input", { "data-ui-id": "12", "data-ui-color-no-opacity": "" })
        .append(valueInput, hexField, redField);

    fakeDocument.body.replaceChildren(FakeElement.of("page").append(input));
    const engine = new ColorInputEngine({ root: real<ParentNode>(fakeDocument.body) });

    try {
        hexField.focus();
        hexField.value = "#10203080";
        hexField.dispatchEvent(new FakeEvent("change"));

        assert.equal(hexField.value, "#336699");
        assert.equal(valueInput.value, "#33669980");

        redField.value = "64";
        redField.dispatchEvent(new FakeEvent("change"));

        assert.equal(valueInput.value, "#406699");
    }
    finally {
        engine.dispose();
    }
});
