import assert from "node:assert/strict";
import { test } from "node:test";
import { asBrowserReads, isImageSource, isLocalRoute, isSafeLink, readImageSource, toSafeImageSource, toSafeLink } from "../src/rendering/url-safety.ts";

test("a navigation target is a path of this site and nothing a browser reads as another", () => {
    assert.equal(isLocalRoute("/"), true);
    assert.equal(isLocalRoute("/screens/account?tab=1"), true);
    assert.equal(isLocalRoute("//evil.example"), false);
    assert.equal(isLocalRoute("/\\evil.example"), false);
    assert.equal(isLocalRoute("/\t/evil.example"), false);
    assert.equal(isLocalRoute("/\n/evil.example"), false);
    assert.equal(isLocalRoute("/\r\\evil.example"), false);
    assert.equal(isLocalRoute("https://evil.example"), false);
    assert.equal(isLocalRoute("screens/account"), false);
    assert.equal(isLocalRoute(""), false);
    assert.equal(isLocalRoute(null), false);
});

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

test("an image source is judged as the browser reads it, so no spelling of another host passes as a path", () => {
    for (const address of ["/\\evil.test/a.png", "/\t/evil.test/a.png", "/\n\\evil.test/a.png", "\\\\evil.test/a.png", "\\/evil.test/a.png", "\u0001//evil.test/a.png", " //evil.test/a.png"])
        assert.equal(isImageSource(address), false, JSON.stringify(address));

    assert.equal(isImageSource("/"), false);
    assert.equal(isImageSource("ht\ttps://example.test/a.png"), true);
    assert.equal(toSafeImageSource("\u0001/media/a\t.png"), "/media/a.png");
    assert.equal(readImageSource("java\tscript:alert(1)"), null);
});

test("the browser's reading strips controls and spaces at the ends and tabs and breaks inside, nothing else", () => {
    assert.equal(asBrowserReads("\u0000 /a\tb\r\nc d \u001f"), "/abc d");
    assert.equal(asBrowserReads(" /a"), " /a");
});
