// A picture whose source is missing or fails shows its author's stand-in; with none, or one that fails too, the framework's own —
// a person's glyph on a round picture, a picture's on any other — never the browser's broken mark; a source given later is tried again.

import assert from "node:assert/strict";
import test from "node:test";

import { FakeElement, FakeEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

let mutate: ((records: readonly unknown[]) => void) | null = null;

installFakeDom({
    MutationObserver: class {
        public constructor(callback: (records: readonly unknown[]) => void) {
            mutate = callback;
        }

        public observe(): void {
        }
    }
});

class FakeImage extends FakeElement {
    public complete = false;
    public naturalWidth = 0;
}

(globalThis as { HTMLImageElement?: unknown }).HTMLImageElement = FakeImage;

const { ImageFallbackEngine } = await import("../src/interactions/image-fallback-engine.ts");

function picture(attributes: Record<string, string>, circle = false): FakeImage {
    const image = new FakeImage("img");

    image.className = circle ? "ui-image ui-image--circle" : "ui-image";

    for (const [name, value] of Object.entries(attributes))
        image.setAttribute(name, value);

    fakeDocument.body.replaceChildren(image);
    new ImageFallbackEngine({ root: real<ParentNode>(fakeDocument.body) });

    return image;
}

function fail(image: FakeImage): void {
    image.dispatchEvent(new FakeEvent("error"));
}

test("a failed picture with its author's stand-in shows the stand-in", () => {
    const image = picture({ src: "/missing.jpg", "data-ui-fallback-src": "/stand-in.jpg" });

    fail(image);

    assert.equal(image.getAttribute("src"), "/stand-in.jpg");
    assert.equal(image.hasAttribute("data-ui-image-failed"), false);
});

test("a failed picture with no stand-in shows the framework's, a person's on a round one", () => {
    const square = picture({ src: "/missing.jpg" });

    fail(square);
    assert.equal(square.hasAttribute("data-ui-image-failed"), true);
    assert.match(square.getAttribute("src") ?? "", /^data:image\/svg\+xml,.*rect/);

    const round = picture({ src: "/missing.jpg" }, true);

    fail(round);
    assert.match(round.getAttribute("src") ?? "", /^data:image\/svg\+xml,.*circle cx='12' cy='8'/);
});

test("an author's stand-in that fails too gives way to the framework's, which never chases itself", () => {
    const image = picture({ src: "/missing.jpg", "data-ui-fallback-src": "/also-missing.jpg" });

    fail(image);
    fail(image);
    const standIn = image.getAttribute("src");

    fail(image);

    assert.equal(image.hasAttribute("data-ui-image-failed"), true);
    assert.equal(image.getAttribute("src"), standIn);
});

test("a picture with no source at all shows the framework's stand-in as the page starts", () => {
    const image = picture({});

    assert.equal(image.hasAttribute("data-ui-image-failed"), true);
});

test("a source given later is tried again", () => {
    const image = picture({ src: "/missing.jpg" });

    fail(image);
    image.setAttribute("src", "/found.jpg");
    mutate?.([{ type: "attributes", target: image, attributeName: "src" }]);

    assert.equal(image.hasAttribute("data-ui-image-failed"), false);
    assert.equal(image.getAttribute("src"), "/found.jpg");
});
