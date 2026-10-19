// A file size the server painted in English is written in the page's language by the boot script as the parser hands the element over,
// before the first paint: in a words mark's arguments and where `data-ui-page-written` names it; a page with no patterns leaves its
// moments to the runtime and still writes its sizes. A file tile's size, which the server leaves empty, is written the same way.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, fakeDocument, installFakeDom } from "./fake-dom.ts";

// The boot script's observer, which a test hands the parser's batches to.
const observers: ((records: readonly { readonly addedNodes: readonly FakeElement[] }[]) => void)[] = [];

/** An element's own text as the one text node the boot script walks: its words stand in an element of their own here. */
function walkText(element: FakeElement): { nextNode(): unknown } {
    let walked = false;

    return {
        nextNode: () => {
            if (walked)
                return null;

            walked = true;

            return {
                get data(): string {
                    return element.textContent;
                },
                set data(value: string) {
                    element.textContent = value;
                }
            };
        }
    };
}

Object.assign(fakeDocument.documentElement, { lang: "ru" });

installFakeDom({
    document: Object.assign(fakeDocument, { createTreeWalker: walkText }),
    NodeFilter: { SHOW_TEXT: 4 },
    MutationObserver: class {
        public constructor(callback: (records: readonly { readonly addedNodes: readonly FakeElement[] }[]) => void) {
            observers.push(callback);
        }

        public observe(): void {
        }
    }
});

const { formatFileSize } = await import("../src/rendering/file-size.ts");

await import("../src/boot.ts");

/** Hands the boot script's observer one batch of the parser's, a record per node. */
function handOver(...nodes: FakeElement[]): void {
    for (const observer of observers)
        observer(nodes.map(node => ({ addedNodes: [node] })));
}

test("a size in a words mark is written in the page's language where the server's English paint of it stands", () => {
    const text = FakeElement.of("ui-text", { "data-ui-words": JSON.stringify({ "#text": ["home.file", { name: "report.pdf", size: { fileSize: 1572864 } }] }) });

    text.textContent = "report.pdf, 1.5 MB";
    fakeDocument.body.replaceChildren(text);
    handOver(text);

    assert.equal(text.textContent, `report.pdf, ${formatFileSize(1572864, "ru")}`);
    assert.notEqual(text.textContent, "report.pdf, 1.5 MB");
});

test("a size a property's painted phrase holds is written where data-ui-page-written names it", () => {
    const text = FakeElement.of("ui-text__title", { "data-ui-page-written": JSON.stringify([{ fileSize: 45 }]) });

    text.textContent = "45 bytes";
    fakeDocument.body.replaceChildren(text);
    handOver(text);

    assert.equal(text.textContent, formatFileSize(45, "ru"));
});

test("a page with no patterns leaves a moment as the server painted it and still writes the size after it", () => {
    const text = FakeElement.of("ui-text", { "data-ui-words": JSON.stringify({ "#text": ["home.sent", { at: { moment: "2026-09-30T14:05:00.000Z" }, size: { fileSize: 2048 } }] }) });

    text.textContent = "Sent 2026-09-30 14:05 UTC, 2 kB";
    fakeDocument.body.replaceChildren(text);
    handOver(text);

    assert.equal(text.textContent, `Sent 2026-09-30 14:05 UTC, ${formatFileSize(2048, "ru")}`);
});

test("a file tile's size is written in the page's language once its size part has arrived, as the tile engine will", () => {
    const tile = FakeElement.of("ui-file-tile", { "data-ui-file-size": "1572864" });
    const size = FakeElement.of("ui-file-tile__size", {}, "span");

    fakeDocument.body.replaceChildren(tile);
    // The root in one batch, its size part in the next.
    handOver(tile);
    tile.append(size);
    handOver(size);

    assert.equal(size.textContent, formatFileSize(1572864, "ru"));
});

test("a file tile with no size, or none the page can read, keeps its size part empty", () => {
    const unset = FakeElement.of("ui-file-tile").append(FakeElement.of("ui-file-tile__size", {}, "span"));
    const broken = FakeElement.of("ui-file-tile", { "data-ui-file-size": "soon" }).append(FakeElement.of("ui-file-tile__size", {}, "span"));

    fakeDocument.body.replaceChildren(unset, broken);
    handOver(unset, broken);

    assert.equal(unset.children[0].textContent, "");
    assert.equal(broken.children[0].textContent, "");
});
