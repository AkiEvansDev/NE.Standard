// A picture whose source is missing or fails shows its author's stand-in; with none, or one that fails too, the framework's own —
// its fallback glyph over the box, a person's on a round one and a picture's on any other unless its author named another — never
// the browser's broken mark; a source given later is tried again.

import assert from "node:assert/strict";
import test from "node:test";

import { FakeElement, FakeEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

let mutate: ((records: readonly unknown[]) => void) | null = null;

/** The pictures the icons asked for (icon-stand-in.ts), which a test answers. */
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

installFakeDom({
    MutationObserver: class {
        public constructor(callback: (records: readonly unknown[]) => void) {
            mutate = callback;
        }

        public observe(): void {
        }
    },
    Image: ProbeImage
});

class FakeImage extends FakeElement {
    public complete = false;
    public naturalWidth = 0;
}

(globalThis as { HTMLImageElement?: unknown }).HTMLImageElement = FakeImage;

const { ImageFallbackEngine } = await import("../src/interactions/image-fallback-engine.ts");

/** A picture's box holding its `<img>`, as `ImageComponentRenderer` draws one, on a page whose engine has started. */
function picture(attributes: Record<string, string>, circle = false, boxAttributes: Record<string, string> = {}): { readonly box: FakeElement; readonly image: FakeImage } {
    const box = FakeElement.of(circle ? "ui-image ui-image--circle" : "ui-image", boxAttributes, "span");
    const image = new FakeImage("img");

    image.className = "ui-image__picture";

    for (const [name, value] of Object.entries(attributes))
        image.setAttribute(name, value);

    box.append(image);
    fakeDocument.body.replaceChildren(box);
    new ImageFallbackEngine({ root: real<ParentNode>(fakeDocument.body) });

    return { box, image };
}

function fail(image: FakeImage): void {
    image.dispatchEvent(new FakeEvent("error"));
}

/** What the engine does next as the browser reports it: the `src` the picture was given, or the class its box was. */
function changed(target: FakeElement, attributeName: string): void {
    mutate?.([{ type: "attributes", target, attributeName }]);
}

function glyphOf(box: FakeElement): FakeElement | null {
    return box.querySelector(":scope > .ui-icon-stand-in");
}

test("a failed picture with its author's stand-in shows the stand-in", () => {
    const { box, image } = picture({ src: "/missing.jpg", "data-ui-fallback-src": "/stand-in.jpg" });

    fail(image);

    assert.equal(image.getAttribute("src"), "/stand-in.jpg");
    assert.equal(box.hasAttribute("data-ui-image-failed"), false);
});

test("a failed picture with no stand-in shows the framework's: a picture's glyph over a clear box, and on a round one the person's", () => {
    const square = picture({ src: "/missing.jpg" });

    fail(square.image);
    assert.equal(square.box.hasAttribute("data-ui-image-failed"), true);
    assert.match(square.image.getAttribute("src") ?? "", /^data:image\/svg\+xml,.*width='96' height='96'\/%3E$/, "a clear square keeps an unsized box a picture's size");
    assert.ok(glyphOf(square.box)?.classList.contains("ui-icon-glyph--ne-image"), "the picture's glyph, which MapUIGlyph redraws by its class");
    assert.equal(glyphOf(square.box)?.getAttribute("aria-hidden"), "true");

    const round = picture({ src: "/missing.jpg" }, true);

    fail(round.image);
    assert.equal(round.box.hasAttribute("data-ui-image-failed"), true);
    assert.match(round.image.getAttribute("src") ?? "", /^data:image\/svg\+xml,.*width='40' height='40'\/%3E$/, "a clear square keeps the box a picture's size");
    assert.ok(glyphOf(round.box)?.classList.contains("ui-icon-glyph--ne-person"), "the person's glyph, which MapUIGlyph redraws by its class");
    assert.equal(glyphOf(round.box)?.getAttribute("aria-hidden"), "true");
});

test("a picture of any shape shows its author's fallback glyph", () => {
    for (const circle of [true, false]) {
        const { box, image } = picture({ src: "/missing.jpg" }, circle, { "data-ui-fallback-icon": "ms-face" });

        fail(image);

        assert.ok(glyphOf(box)?.classList.contains("ui-icon-glyph--ms-face"));
        assert.equal(glyphOf(box)?.classList.contains("ui-icon-glyph--ne-person"), false);
        assert.equal(glyphOf(box)?.classList.contains("ui-icon-glyph--ne-image"), false);
    }
});

test("an author's stand-in that fails too gives way to the framework's, which never chases itself", () => {
    const { box, image } = picture({ src: "/missing.jpg", "data-ui-fallback-src": "/also-missing.jpg" });

    fail(image);
    fail(image);
    const standIn = image.getAttribute("src");

    fail(image);

    assert.equal(box.hasAttribute("data-ui-image-failed"), true);
    assert.equal(image.getAttribute("src"), standIn);
});

test("a picture with no source at all shows the framework's stand-in as the page starts", () => {
    for (const circle of [true, false]) {
        const { box } = picture({}, circle);

        assert.equal(box.hasAttribute("data-ui-image-failed"), true);
        assert.notEqual(glyphOf(box), null);
    }
});

test("a source given later is tried again, and the glyph goes", () => {
    for (const circle of [true, false]) {
        const { box, image } = picture({ src: "/missing.jpg" }, circle);

        fail(image);
        image.setAttribute("src", "/found.jpg");
        changed(image, "src");

        assert.equal(box.hasAttribute("data-ui-image-failed"), false);
        assert.equal(image.getAttribute("src"), "/found.jpg");
        assert.equal(glyphOf(box), null);
    }
});

test("a source taken away later stands in again, and a shape changed meanwhile changes the stand-in", () => {
    const { box, image } = picture({ src: "/found.jpg" }, true);

    image.removeAttribute("src");
    changed(image, "src");
    assert.equal(box.hasAttribute("data-ui-image-failed"), true);
    assert.notEqual(glyphOf(box), null);

    box.classList.remove("ui-image--circle");
    changed(box, "class");
    assert.match(image.getAttribute("src") ?? "", /width='96' height='96'/, "a square box keeps a picture's size");
    assert.ok(glyphOf(box)?.classList.contains("ui-icon-glyph--ne-image"), "a square box shows a picture's glyph");
    assert.equal(glyphOf(box)?.classList.contains("ui-icon-glyph--ne-person"), false);
});

test("a picture icon of any shape on the page as it starts is asked for, and stands in when it fails", () => {
    const square = FakeElement.of("ui-text__icon ui-icon ui-icon--image", {}, "span");

    // As icon-value.ts writes a picture's address, which the stand-in reads back.
    square.style["--ui-icon-url"] = "url(\"/stickers/start.png\")";
    fakeDocument.body.replaceChildren(FakeElement.of("ui-text").append(square));
    new ImageFallbackEngine({ root: real<ParentNode>(fakeDocument.body) });

    assert.equal(probes.at(-1)?.src, "/stickers/start.png");

    probes.at(-1)?.answer(false);
    assert.equal(square.getAttribute("data-ui-icon-failed"), "failed");
    assert.ok(glyphOf(square)?.classList.contains("ui-icon-glyph--ne-image"));
});
