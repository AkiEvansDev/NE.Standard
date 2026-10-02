// A background picture's dim and blur are the browser's: the converters write what the server writes (held to range, nothing for
// none), a live change sets and takes off what the stylesheet reads, the stylesheet lays the veil over the picture and the blur's
// layer under the content, and a popup under a blurred surface is lifted out of its isolated stacking.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";
import { FakeElement, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

const blurred = new Set<FakeElement>();

installFakeDom({
    window: { innerWidth: 1000, innerHeight: 800, addEventListener: () => undefined },
    ResizeObserver: class {
        public observe(): void {
        }

        public unobserve(): void {
        }
    },
    getComputedStyle: (element: FakeElement) => ({
        transform: "none",
        filter: "none",
        perspective: "none",
        isolation: blurred.has(element) ? "isolate" : "auto",
        transitionProperty: "opacity",
        transitionDuration: "0s",
        getPropertyValue: () => "auto"
    })
});

const { webDomConverters } = await import("../src/rendering/web-dom-converters.ts");
const { DomOperationRegistry } = await import("../src/updates/dom-operation-registry.ts");
const { placeAnchoredPopup } = await import("../src/interactions/anchored-popup.ts");
type DomOperationContext = import("../src/updates/dom-operation-registry.ts").DomOperationContext;

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;

function convert(converterName: string, value: unknown): string | undefined {
    const converter = webDomConverters.get(converterName);

    assert.ok(converter !== undefined, `No converter '${converterName}'.`);

    return converter(value);
}

/** Applies a bound value through one of the operations SurfaceStyleRenderer registers, as a patch does. */
function patch(target: FakeElement, operation: { kind: string; name: string; converter?: string; condition?: string; value?: string }, value: unknown): void {
    new DomOperationRegistry().apply({
        resolved: { componentId: 1, propertyId: operation.name },
        operation,
        target,
        value,
        convertedValue: operation.converter === undefined ? value : convert(operation.converter, value),
        local: false
    } as unknown as DomOperationContext);
}

/** The declarations of the first rule whose selector list is exactly `selector`, or null. */
function declarations(selector: string): string | null {
    const match = new RegExp(`(?:^|\\n)${selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} \\{([^}]*)\\}`).exec(css);

    return match?.[1] ?? null;
}

test("the dim is held to 0–1 as the server holds it, and nothing that is not a number is drawn", () => {
    assert.equal(convert("backgroundImageDimCss", 0.4), "0.4");
    assert.equal(convert("backgroundImageDimCss", 1.5), "1");
    assert.equal(convert("backgroundImageDimCss", -0.2), "0");
    assert.equal(convert("backgroundImageDimCss", "0.25"), "0.25");
    assert.equal(convert("backgroundImageDimCss", null), "");
    assert.equal(convert("backgroundImageDimCss", "dark"), "");
});

test("the blur draws only above zero, as a length, and says so in its attribute", () => {
    assert.equal(convert("backgroundImageBlurCss", 12.5), "12.5px");
    assert.equal(convert("backgroundImageBlurCss", "8"), "8px");
    assert.equal(convert("backgroundImageBlurCss", 0), "");
    assert.equal(convert("backgroundImageBlurCss", -4), "");
    assert.equal(convert("backgroundImageBlurCss", Number.POSITIVE_INFINITY), "");
    assert.equal(convert("backgroundImageBlurAttribute", 12), "");
    assert.equal(convert("backgroundImageBlurAttribute", 0), undefined);
    assert.equal(convert("backgroundImageBlurAttribute", null), undefined);
});

test("a vignette is its attribute, by name or by number, and the even default is none", () => {
    assert.equal(convert("backgroundImageDimModeAttribute", "Vignette"), "vignette");
    assert.equal(convert("backgroundImageDimModeAttribute", 1), "vignette");
    assert.equal(convert("backgroundImageDimModeAttribute", "Uniform"), undefined);
    assert.equal(convert("backgroundImageDimModeAttribute", 0), undefined);
});

test("a live change moves the numbers and puts on and takes off the attributes the stylesheet reads", () => {
    const surface = new FakeElement();
    const dim = { kind: "Style", name: "--ui-surface-image-dim", converter: "backgroundImageDimCss" };
    const blur = { kind: "Attribute", name: "data-ui-surface-image-blur", converter: "backgroundImageBlurAttribute" };
    const mode = { kind: "Attribute", name: "data-ui-surface-image-dim", converter: "backgroundImageDimModeAttribute" };
    const picture = { kind: "ToggleAttribute", name: "data-ui-surface-image", condition: "HasText", value: "" };

    patch(surface, dim, 0.3);
    assert.equal(surface.style["--ui-surface-image-dim"], "0.3");
    patch(surface, dim, null);
    assert.equal(surface.style["--ui-surface-image-dim"], undefined);

    patch(surface, blur, 10);
    assert.equal(surface.getAttribute("data-ui-surface-image-blur"), "");
    patch(surface, blur, 0);
    assert.equal(surface.hasAttribute("data-ui-surface-image-blur"), false);

    patch(surface, mode, "Vignette");
    assert.equal(surface.getAttribute("data-ui-surface-image-dim"), "vignette");
    patch(surface, mode, "Uniform");
    assert.equal(surface.hasAttribute("data-ui-surface-image-dim"), false);

    patch(surface, picture, "/images/harbour-sky.jpg");
    assert.equal(surface.getAttribute("data-ui-surface-image"), "", "the address is not copied into the attribute");
    patch(surface, picture, null);
    assert.equal(surface.hasAttribute("data-ui-surface-image"), false);
});

test("the veil is the ground at the dim's share over the picture, evenly or on the edges alone", () => {
    const shown = declarations(".ui-container[data-ui-surface-image]") ?? "";

    assert.match(shown, /--ui-surface-image-veil: linear-gradient\(color-mix\(in srgb, var\(--ui-ground, var\(--ui-color-surface\)\) calc\(var\(--ui-surface-image-dim\) \* 100%\), transparent\)/);
    assert.match(shown, /background-image: var\(--ui-surface-image-veil, none\), var\(--ui-surface-image\);/);
    assert.match(declarations(".ui-container[data-ui-surface-image][data-ui-surface-image-dim=\"vignette\"]") ?? "", /radial-gradient\(closest-side, transparent 45%, color-mix/);
    assert.match(declarations(".ui-container") ?? "", /--ui-surface-image-veil: initial;/, "a nested surface does not wear its host's veil");
    assert.match(declarations(".ui-container") ?? "", /background-origin: border-box;/, "the picture and its veil cover the same box, no undimmed strip at the border");
});

test("the blur's layer stands under the content on the pseudo-element the root leaves free, and a scroller's stays in view", () => {
    const blur = "[data-ui-surface-image][data-ui-surface-image-blur]:not(.ui-loading, [data-ui-row-drop])";

    assert.match(declarations(`.ui-container${blur}`) ?? "", /isolation: isolate;[\s\S]*position: relative;/);
    assert.match(declarations(`.ui-container${blur}::after`) ?? "", /z-index: -1;[\s\S]*backdrop-filter: blur\(var\(--ui-surface-image-blur\)\);[\s\S]*inset: 0;/);
    assert.match(declarations(`.ui-button${blur}:not(.ui-items-view__item > .ui-pressing)::before`) ?? "", /backdrop-filter/, "a button's ::after is its press's wave, and a pressed tile's ::before");
    assert.match(declarations(`.ui-scroll${blur}:not(.ui-items-view__item > .ui-pressing)::before`) ?? "", /position: sticky;[\s\S]*float: inline-start;[\s\S]*height: 100%;/);
    assert.doesNotMatch(declarations(`.ui-scroll${blur}`) ?? "", /position: relative/);
});

test("a wrapped tile's wash keeps the tile's veil between itself and the picture", () => {
    assert.match(css, /linear-gradient\(var\(--ui-row-wash\), var\(--ui-row-wash\)\), var\(--ui-surface-image-veil, none\), var\(--ui-surface-image, none\)/);
});

test("a popup under a blurred surface is lifted into the top layer", () => {
    const surface = FakeElement.of("surface");
    const anchor = FakeElement.of("anchor");
    const popup = FakeElement.of("popup");
    let shown = false;

    Object.assign(popup, { showPopover: () => { shown = true; } });
    surface.setAttribute("data-ui-surface-image-blur", "");
    blurred.add(surface);
    anchor.rect = { left: 100, top: 300, width: 80, height: 30 };
    popup.rect = { left: 0, top: 0, width: 120, height: 34 };
    fakeDocument.body.append(surface.append(anchor.append(popup)));

    placeAnchoredPopup(real(anchor), real(popup), { placement: "bottom", gap: 6 });

    assert.ok(shown);
    assert.equal(popup.getAttribute("popover"), "manual");
});
