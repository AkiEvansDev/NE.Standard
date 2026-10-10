// The client half of the inline-markup parity check, against the same corpus UIInlineMarkupParityTests reads.

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import test from "node:test";

import { escapeInlineMarkup, inlineMarkupToPlainText, parseInlineMarkup } from "../src/rendering/inline-markup.ts";
import { isExternalLink } from "../src/rendering/url-safety.ts";
import { webDomConverters } from "../src/rendering/web-dom-converters.ts";

type CorpusSegment = { readonly text: string; readonly styles: number; readonly url: string | null; readonly icon?: string | null; readonly fold?: string | null };
type CorpusCase = { readonly name: string; readonly input: string; readonly segments: readonly CorpusSegment[] };

const here = dirname(fileURLToPath(import.meta.url));
const corpusPath = resolve(here, "../../../../../../eng/Tests/Shared/inline-markup-corpus.json");
const corpus = JSON.parse(readFileSync(corpusPath, "utf8")) as { readonly cases: readonly CorpusCase[] };

assert.ok(corpus.cases.length > 0, "The inline-markup corpus is empty.");

for (const testCase of corpus.cases) {
    test(`inline markup: ${testCase.name}`, () => {
        // `icon` and `fold` are normalised to null on both sides, or an omitted case and an undefined compare unequal.
        const actual = parseInlineMarkup(testCase.input).map(segment => ({
            text: segment.text,
            styles: segment.styles,
            url: segment.url,
            icon: segment.icon ?? null,
            fold: segment.fold ?? null
        }));

        assert.deepEqual(actual, testCase.segments.map(segment => ({ ...segment, icon: segment.icon ?? null, fold: segment.fold ?? null })));
    });
}

const externalLinks = (JSON.parse(readFileSync(corpusPath, "utf8")) as { readonly externalLinks: readonly { readonly url: string; readonly external: boolean }[] }).externalLinks;

assert.ok(externalLinks.length > 0, "The corpus names no link targets.");

test("inline markup: a link opens beside the page when the browser reads it as leaving the application", () => {
    for (const link of externalLinks)
        assert.equal(isExternalLink(link.url), link.external, JSON.stringify(link.url));
});

const escapeCases = (JSON.parse(readFileSync(corpusPath, "utf8")) as { readonly escape: readonly { readonly name: string; readonly input: string; readonly escaped: string }[] }).escape;

assert.ok(escapeCases.length > 0, "The corpus names no escaped values.");

for (const escapeCase of escapeCases) {
    test(`inline markup escape: ${escapeCase.name}`, () => {
        assert.equal(escapeInlineMarkup(escapeCase.input), escapeCase.escaped);
        assert.equal(inlineMarkupToPlainText(escapeCase.escaped), escapeCase.input);
    });
}

test("inline markup: the element written into says while it holds a fold, as the server's render says it", async () => {
    const { FakeElement, installFakeDom } = await import("./fake-dom.ts");

    installFakeDom({});

    const { applyInlineMarkup } = await import("../src/rendering/inline-markup.ts");
    const description = new FakeElement("span");
    const write = (text: string): void => applyInlineMarkup(description as unknown as Element, text);

    write("Frozen. [Why?]{The branch is re-cut.}");
    assert.equal(description.getAttribute("data-ui-folds"), "");

    write("Frozen.");
    assert.equal(description.hasAttribute("data-ui-folds"), false);

    write("**Frozen** [Why?]{Because [how]{nested}.}");
    assert.equal(description.hasAttribute("data-ui-folds"), true);

    write("");
    assert.equal(description.hasAttribute("data-ui-folds"), false);
});

test("inline markup: plain text reads a fold unfolded", () => {
    assert.equal(inlineMarkupToPlainText("Frozen. [Why?]{The **branch** is re-cut, [and how]{by the pipeline}.}"), "Frozen. Why? The branch is re-cut, and how by the pipeline.");
});

test("inline markup: a tooltip's words name an icon-only button as plain text, never as their markup; none leaves no name", () => {
    const toName = webDomConverters.get("inlineMarkupPlainText");

    assert.ok(toName !== undefined);
    assert.equal(toName("Shown **and** on focus — see [the docs](https://docs.example)."), "Shown and on focus — see the docs.");
    assert.equal(toName(null), undefined);
    assert.equal(toName(undefined), undefined);
});

test("inline markup: marks left open cost a single pass", () => {
    const started = performance.now();

    for (const input of ["[".repeat(200_000), "[a](".repeat(50_000), "**a ".repeat(50_000), "[a]{".repeat(50_000)])
        parseInlineMarkup(input);

    // Linear: a few milliseconds each. The quadratic scan this guards against took minutes on the same inputs.
    assert.ok(performance.now() - started < 5_000);
});

test("inline markup: folds nested past the cap read as text instead of recursing", () => {
    const depth = 20_000;

    assert.ok(inlineMarkupToPlainText(`${"[a]{".repeat(depth)}x${"}".repeat(depth)}`).endsWith("x" + "}".repeat(depth - 8)));
});
