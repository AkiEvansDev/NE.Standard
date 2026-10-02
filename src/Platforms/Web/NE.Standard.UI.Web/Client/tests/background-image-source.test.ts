// A surface's pushed background picture is held to the check its first paint is (`SurfaceStyleRenderer`, `WebIconValue.TryReadImage`):
// the client half of SurfaceImageSourceCorpusTests, against the icon-value corpus both read, whose `url` is what either side writes.

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import test from "node:test";

import { webDomConverters } from "../src/rendering/web-dom-converters.ts";

type CorpusCase = { readonly name: string; readonly value: string; readonly url: string };

const here = dirname(fileURLToPath(import.meta.url));
const corpusPath = resolve(here, "../../../../../../eng/Tests/Shared/icon-value-corpus.json");
const corpus = JSON.parse(readFileSync(corpusPath, "utf8")) as { readonly cases: readonly CorpusCase[] };

function convert(converterName: string, value: unknown): string | undefined {
    const converter = webDomConverters.get(converterName);

    assert.ok(converter !== undefined, `No converter '${converterName}'.`);

    return converter(value);
}

for (const testCase of corpus.cases) {
    test(`background picture: ${testCase.name}`, () => {
        assert.equal(convert("backgroundImageCss", testCase.value), testCase.url);
        assert.equal(convert("backgroundImageAttribute", testCase.value), testCase.url.length === 0 ? undefined : "");
    });
}

test("background picture: none set writes nothing and marks nothing", () => {
    assert.equal(convert("backgroundImageCss", null), "");
    assert.equal(convert("backgroundImageCss", undefined), "");
    assert.equal(convert("backgroundImageAttribute", null), undefined);
    assert.equal(convert("backgroundImageAttribute", "   "), undefined);
});
