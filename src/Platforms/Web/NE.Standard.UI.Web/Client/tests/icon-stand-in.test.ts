// A round picture icon with no picture — none given, or one that fails to load — shows its fallback glyph (the person's unless its
// author named another) on a neutral circle, and its host shows the icon for it; a square picture icon that fails shows its fallback
// glyph too (a picture's unless its author named another); a later good value brings the picture back, and a mark the host wore for a
// value is never taken by the stand-in.

import assert from "node:assert/strict";
import test from "node:test";

import { FakeElement, installFakeDom } from "./fake-dom.ts";

/** The pictures the icons asked for, which a test answers. */
const probes: ProbeImage[] = [];

class ProbeImage {
    public src = "";
    private readonly listeners = new Map<string, () => void>();

    public constructor() {
        probes.push(this);
    }

    public addEventListener(type: string, listener: () => void): void {
        this.listeners.set(type, listener);
    }

    public answer(loaded: boolean): void {
        this.listeners.get(loaded ? "load" : "error")?.();
    }
}

installFakeDom({ Image: ProbeImage });

const { webDomConverters } = await import("../src/rendering/web-dom-converters.ts");
const { DomOperationRegistry } = await import("../src/updates/dom-operation-registry.ts");
const { FailedRetryMilliseconds } = await import("../src/updates/icon-stand-in.ts");
type DomOperationContext = import("../src/updates/dom-operation-registry.ts").DomOperationContext;

const Shown = "data-ui-text-icon";

/** A text's root and its round icon part, as the server draws them with no value yet. */
function roundIcon(fallback?: string): { readonly host: FakeElement; readonly icon: FakeElement } {
    return textIcon("ui-text__icon ui-icon ui-icon--circle", fallback);
}

/** A text's root and its icon part in the default shape, as the server draws them with no value yet. */
function squareIcon(fallback?: string): { readonly host: FakeElement; readonly icon: FakeElement } {
    return textIcon("ui-text__icon ui-icon", fallback);
}

function textIcon(className: string, fallback: string | undefined): { readonly host: FakeElement; readonly icon: FakeElement } {
    const icon = FakeElement.of(className, fallback === undefined ? {} : { "data-ui-fallback-icon": fallback }, "span");
    const host = FakeElement.of("ui-text").append(icon);

    return { host, icon };
}

/** A new icon value through the operations `TextContentRendererBase` registers for it, the stand-in's last, as a patch runs them. */
function patchIcon(registry: InstanceType<typeof DomOperationRegistry>, host: FakeElement, icon: FakeElement, value: string | null): void {
    const operations = [
        { kind: "Class", converter: "iconClass", target: icon },
        { kind: "Style", name: "--ui-icon-url", converter: "iconUrlCss", target: icon },
        { kind: "ToggleAttribute", name: Shown, condition: "DrawsIcon", target: host },
        { kind: "icon-stand-in", name: Shown, target: icon }
    ];

    for (const { target, ...operation } of operations) {
        const converter = operation.converter === undefined ? undefined : webDomConverters.get(operation.converter);

        registry.apply({
            resolved: { componentId: 1, propertyId: "Icon", component: host },
            operation,
            target,
            value,
            convertedValue: converter === undefined ? value : converter(value),
            local: false
        } as unknown as DomOperationContext);
    }
}

function glyphOf(icon: FakeElement): FakeElement | null {
    return icon.querySelector(":scope > .ui-icon-stand-in");
}

test("a round icon with no value stands in with the person, and its host shows the icon for it", () => {
    const registry = new DomOperationRegistry();
    const { host, icon } = roundIcon();

    patchIcon(registry, host, icon, null);

    assert.equal(icon.getAttribute("data-ui-icon-failed"), "missing");
    assert.ok(glyphOf(icon)?.classList.contains("ui-icon-glyph--ne-person"), "the person's glyph, which MapUIGlyph redraws by its class");
    assert.equal(host.hasAttribute(Shown), true);
});

test("its author's fallback glyph stands in instead", () => {
    const registry = new DomOperationRegistry();
    const { host, icon } = roundIcon("ms-face");

    patchIcon(registry, host, icon, "");

    assert.ok(glyphOf(icon)?.classList.contains("ui-icon-glyph--ms-face"));
});

test("a picture that fails stands in, and a later good one brings the picture back", () => {
    const registry = new DomOperationRegistry();
    const { host, icon } = roundIcon();

    patchIcon(registry, host, icon, "/avatars/broken.png");
    assert.equal(icon.hasAttribute("data-ui-icon-failed"), false, "the picture is drawn while it is on its way");
    assert.equal(probes.at(-1)?.src, "/avatars/broken.png");

    probes.at(-1)?.answer(false);
    assert.equal(icon.getAttribute("data-ui-icon-failed"), "failed");
    assert.notEqual(glyphOf(icon), null);
    assert.equal(host.hasAttribute(Shown), true, "a failed picture is still the icon's value");

    patchIcon(registry, host, icon, "/avatars/good.png");
    probes.at(-1)?.answer(true);
    assert.equal(icon.hasAttribute("data-ui-icon-failed"), false);
    assert.equal(glyphOf(icon), null);
    assert.ok(icon.classList.contains("ui-icon--image"));
});

test("an address that failed is not asked for again soon after", () => {
    const registry = new DomOperationRegistry();
    const { host, icon } = roundIcon();
    const asked = probes.length;

    patchIcon(registry, host, icon, "/avatars/broken.png");

    assert.equal(probes.length, asked);
    assert.equal(icon.getAttribute("data-ui-icon-failed"), "failed");
});

test("drawn again a while after it failed, the address is asked for again, its stand-in kept until the answer", t => {
    const registry = new DomOperationRegistry();
    const { host, icon } = roundIcon();

    t.mock.timers.enable({ apis: ["Date"], now: Date.now() });
    patchIcon(registry, host, icon, "/avatars/processing.png");
    probes.at(-1)?.answer(false);

    const asked = probes.length;

    t.mock.timers.tick(FailedRetryMilliseconds);
    patchIcon(registry, host, icon, "/avatars/processing.png");

    assert.equal(probes.length, asked + 1);
    assert.equal(icon.getAttribute("data-ui-icon-failed"), "failed");

    probes.at(-1)?.answer(true);

    assert.equal(icon.hasAttribute("data-ui-icon-failed"), false);
    assert.equal(glyphOf(icon), null);
});

test("a value given after the stand-in takes the host's mark back to the value's, and none takes it away", () => {
    const registry = new DomOperationRegistry();
    const { host, icon } = roundIcon();

    patchIcon(registry, host, icon, null);
    patchIcon(registry, host, icon, "ne-check");
    assert.equal(host.hasAttribute(Shown), true);
    assert.equal(glyphOf(icon), null, "a glyph is drawn as it is, round or not");

    icon.classList.remove("ui-icon--circle");
    patchIcon(registry, host, icon, null);
    assert.equal(host.hasAttribute(Shown), false, "a square icon with no value shows nothing");
});

test("a square picture that fails stands in with a picture's glyph, its host's mark kept, and a later good one brings it back", () => {
    const registry = new DomOperationRegistry();
    const { host, icon } = squareIcon();

    patchIcon(registry, host, icon, "/stickers/broken.png");
    assert.equal(icon.hasAttribute("data-ui-icon-failed"), false, "the picture is drawn while it is on its way");
    assert.equal(probes.at(-1)?.src, "/stickers/broken.png");

    probes.at(-1)?.answer(false);
    assert.equal(icon.getAttribute("data-ui-icon-failed"), "failed");
    assert.ok(glyphOf(icon)?.classList.contains("ui-icon-glyph--ne-image"), "the picture's glyph, which MapUIGlyph redraws by its class");
    assert.equal(host.hasAttribute(Shown), true, "a failed picture is still the icon's value");

    patchIcon(registry, host, icon, "/stickers/good.png");
    probes.at(-1)?.answer(true);
    assert.equal(icon.hasAttribute("data-ui-icon-failed"), false);
    assert.equal(glyphOf(icon), null);
});

test("a square picture that fails stands in with its author's fallback glyph", () => {
    const registry = new DomOperationRegistry();
    const { host, icon } = squareIcon("ms-hide-image");

    patchIcon(registry, host, icon, "/stickers/gone.png");
    probes.at(-1)?.answer(false);

    assert.ok(glyphOf(icon)?.classList.contains("ui-icon-glyph--ms-hide-image"));
    assert.equal(glyphOf(icon)?.classList.contains("ui-icon-glyph--ne-image"), false);
});

test("a square icon that is no picture never stands in, nor touches a mark the first paint wrote", () => {
    const registry = new DomOperationRegistry();
    const icon = FakeElement.of("ui-text__icon ui-icon", {}, "span");
    const host = FakeElement.of("ui-text", { [Shown]: "" }).append(icon);

    registry.apply({
        resolved: { componentId: 1, propertyId: "IconShape", component: host },
        operation: { kind: "icon-stand-in", name: Shown },
        target: icon,
        value: null,
        convertedValue: null,
        local: false
    } as unknown as DomOperationContext);

    assert.equal(icon.hasAttribute("data-ui-icon-failed"), false);
    assert.equal(host.hasAttribute(Shown), true);
});
