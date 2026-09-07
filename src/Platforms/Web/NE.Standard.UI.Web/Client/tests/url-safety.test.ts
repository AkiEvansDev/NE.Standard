import assert from "node:assert/strict";
import { test } from "node:test";
import { isSafeLink, toSafeImageSource, toSafeLink } from "../src/rendering/url-safety.ts";

test("a link keeps the schemes a renderer allows and refuses the rest", () => {
    assert.equal(isSafeLink("https://example.test/a?b#c"), true);
    assert.equal(isSafeLink("mailto:a@example.test"), true);
    assert.equal(isSafeLink("/docs/index.html"), true);
    assert.equal(isSafeLink("#top"), true);
    assert.equal(isSafeLink("docs/index.html"), true);
    assert.equal(isSafeLink("javascript:alert(1)"), false);
    assert.equal(isSafeLink("JavaScript:alert(1)"), false);
    assert.equal(isSafeLink("data:text/html,hi"), false);
    assert.equal(isSafeLink("http://a\nb"), false);
    assert.equal(isSafeLink(""), false);
    assert.equal(isSafeLink(null), false);
});

test("a refused link takes the attribute away rather than writing something else", () => {
    assert.equal(toSafeLink("https://example.test"), "https://example.test");
    assert.equal(toSafeLink("javascript:void(0)"), undefined);
});

test("an image source is a path, http(s) or an image data url", () => {
    assert.equal(toSafeImageSource("/media/a.png"), "/media/a.png");
    assert.equal(toSafeImageSource(" https://example.test/a.png "), "https://example.test/a.png");
    assert.equal(toSafeImageSource("data:image/png;base64,AAAA"), "data:image/png;base64,AAAA");
    assert.equal(toSafeImageSource("//evil.test/a.png"), undefined);
    assert.equal(toSafeImageSource("data:text/html,hi"), undefined);
    assert.equal(toSafeImageSource("javascript:alert(1)"), undefined);
    assert.equal(toSafeImageSource(""), undefined);
});
