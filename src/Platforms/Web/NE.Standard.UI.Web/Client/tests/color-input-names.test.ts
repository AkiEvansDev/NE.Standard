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

test("factor and opacity sliders and their sibling readouts update live and on patch", () => {
    const chip = FakeElement.of("ui-color-input__chip", { "data-ui-color-name": "Teal" }, "button");
    (chip.style.setProperty as (property: string, text: string) => void)("--ui-color-input-chip", "#006E64");

    const valueInput = Object.assign(new FakeInput("hidden"), { value: "Teal/None/0/255" });
    valueInput.classes.add("ui-color-input__value-input");

    const factorSlider = Object.assign(new FakeInput("range"), { value: "0" });
    factorSlider.setAttribute("data-ui-color-factor", "");

    const factorReadout = FakeElement.of("ui-color-input__slider-value", {}, "span");
    factorReadout.textContent = "0";

    const opacitySlider = Object.assign(new FakeInput("range"), { value: "255" });
    opacitySlider.setAttribute("data-ui-color-opacity", "");

    const opacityReadout = FakeElement.of("ui-color-input__slider-value", {}, "span");
    opacityReadout.textContent = "255";

    const sliderRow = FakeElement.of("ui-color-input__slider", {}, "label").append(factorSlider, factorReadout);
    const opacityRow = FakeElement.of("ui-color-input__slider ui-color-input__slider--opacity", {}, "label").append(opacitySlider, opacityReadout);
    const input = FakeElement.of("ui-color-input", { "data-ui-id": "14" }).append(valueInput, chip, sliderRow, opacityRow);

    fakeDocument.body.replaceChildren(FakeElement.of("page").append(input));

    let notifyPatch: ((change: { readonly components: readonly HTMLElement[] }) => void) = () => undefined;
    const engine = new ColorInputEngine({
        root: real<ParentNode>(fakeDocument.body),
        propertyPatchEngine: real({
            addValueChangeHandler: (handler: (change: { readonly components: readonly HTMLElement[] }) => void) => {
                notifyPatch = handler;

                return () => undefined;
            }
        })
    });

    try {
        assert.equal(factorSlider.value, "0");
        assert.equal(factorReadout.textContent, "0");
        assert.equal(opacitySlider.value, "255");
        assert.equal(opacityReadout.textContent, "255");

        factorSlider.value = "-4";
        factorSlider.dispatchEvent(new FakeEvent("input"));

        assert.equal(factorReadout.textContent, "-4");
        assert.equal(valueInput.value, "Teal/Shade/4/255");

        opacitySlider.value = "180";
        opacitySlider.dispatchEvent(new FakeEvent("input"));

        assert.equal(opacityReadout.textContent, "180");
        assert.equal(valueInput.value, "Teal/Shade/4/180");

        valueInput.value = "Teal/Tint/6/128";
        notifyPatch({ components: [real<HTMLElement>(input)] });

        assert.equal(factorSlider.value, "6");
        assert.equal(factorReadout.textContent, "6");
        assert.equal(opacitySlider.value, "128");
        assert.equal(opacityReadout.textContent, "128");
    }
    finally {
        engine.dispose();
    }
});

test("arrow keys walk the 8-column palette grid horizontally and vertically and update roving tabindex", () => {
    const names = [
        "StellarRed", "SolarAmber", "EclipseOlive", "AuroraGreen", "AstralTeal", "QuantumBlue", "NovaPurple", "IronFog",
        "NebulaRose", "NebulaLemon", "NebulaLime", "NebulaMint", "NebulaCyan", "NebulaAqua", "NebulaViolet", "SilverNight"
    ];
    const chips = names.map(name => {
        const chip = FakeElement.of("ui-color-input__chip", { "data-ui-color-name": name }, "button");
        (chip.style.setProperty as (property: string, text: string) => void)("--ui-color-input-chip", "#006E64");
        return chip;
    });

    const valueInput = Object.assign(new FakeInput("hidden"), { value: "StellarRed/None/0/255" });
    valueInput.classes.add("ui-color-input__value-input");

    const paletteTab = FakeElement.of("ui-color-input__tab", { "data-ui-color-tab": "palette", role: "tab" }, "button");
    const grid = FakeElement.of("ui-color-input__grid").append(...chips);
    const palettePane = FakeElement.of("ui-color-input__pane", { "data-ui-color-pane": "palette" }).append(grid);
    const popup = FakeElement.of("ui-color-input__popup", { role: "dialog" }).append(paletteTab, palettePane);
    const input = FakeElement.of("ui-color-input", { "data-ui-id": "16" }).append(valueInput, popup);

    fakeDocument.body.replaceChildren(FakeElement.of("page").append(input));
    const engine = new ColorInputEngine({ root: real<ParentNode>(fakeDocument.body) });

    try {
        paletteTab.dispatchEvent(new FakeEvent("click"));
        assert.equal(chips[0].getAttribute("tabindex"), "0");
        assert.equal(chips[1].getAttribute("tabindex"), "-1");

        chips[0].focus();
        chips[0].dispatchEvent(Object.assign(new FakeEvent("keydown"), { key: "ArrowRight" }));

        assert.equal(fakeDocument.activeElement, chips[1]);
        assert.equal(valueInput.value, "SolarAmber/None/0/255");
        assert.equal(chips[1].getAttribute("tabindex"), "0");
        assert.equal(chips[0].getAttribute("tabindex"), "-1");

        chips[1].dispatchEvent(Object.assign(new FakeEvent("keydown"), { key: "ArrowDown" }));

        assert.equal(fakeDocument.activeElement, chips[9]);
        assert.equal(valueInput.value, "NebulaLemon/None/0/255");

        chips[9].dispatchEvent(Object.assign(new FakeEvent("keydown"), { key: "ArrowLeft" }));

        assert.equal(fakeDocument.activeElement, chips[8]);
        assert.equal(valueInput.value, "NebulaRose/None/0/255");

        chips[8].dispatchEvent(Object.assign(new FakeEvent("keydown"), { key: "ArrowUp" }));

        assert.equal(fakeDocument.activeElement, chips[0]);
        assert.equal(valueInput.value, "StellarRed/None/0/255");
    }
    finally {
        engine.dispose();
    }
});
