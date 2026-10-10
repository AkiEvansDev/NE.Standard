// The client half of the colour and typography parity check, against the same corpus ThemeAppearanceParityTests reads.

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import test from "node:test";

import { webDomConverters } from "../src/rendering/web-dom-converters.ts";

// `ink`, `onColor` and `roleInk`, where a case carries them: the colour spent on words, the text colour that reads on it as a ground,
// and the ink a badge writes inline (none for a raw colour).
type ThemeColorCase = { readonly name: string; readonly value: unknown; readonly css: string; readonly class: string; readonly ink?: string; readonly onColor?: string; readonly roleInk?: string };
type TextAppearanceCase = {
    readonly name: string;
    readonly value: unknown;
    readonly class: string;
    readonly fontSize: string;
    readonly fontWeight: string;
    readonly lineHeight: string;
    readonly letterSpacing: string;
};

const here = dirname(fileURLToPath(import.meta.url));
const corpusPath = resolve(here, "../../../../../../eng/Tests/Shared/theme-appearance-corpus.json");
const corpus = JSON.parse(readFileSync(corpusPath, "utf8")) as {
    readonly themeColors: readonly ThemeColorCase[];
    readonly textAppearances: readonly TextAppearanceCase[];
};

assert.ok(corpus.themeColors.length > 0 && corpus.textAppearances.length > 0, "The theme-appearance corpus is empty.");

function convert(name: string, value: unknown): string {
    const converter = webDomConverters.get(name);

    assert.ok(converter !== undefined, `No converter '${name}'.`);

    return converter(value) ?? "";
}

for (const testCase of corpus.themeColors) {
    test(`colour: ${testCase.name}`, () => {
        assert.equal(convert("themeColorCss", testCase.value), testCase.css);
        assert.equal(convert("themeColorClass", testCase.value), testCase.class);

        if (testCase.ink !== undefined)
            assert.equal(convert("themeInkCss", testCase.value), testCase.ink);

        if (testCase.onColor !== undefined)
            assert.equal(convert("themeOnColorCss", testCase.value), testCase.onColor);

        if (testCase.roleInk !== undefined)
            assert.equal(convert("roleInkCss", testCase.value), testCase.roleInk);
    });
}

for (const testCase of corpus.textAppearances) {
    test(`text: ${testCase.name}`, () => {
        assert.equal(convert("textAppearanceClass", testCase.value), testCase.class);
        assert.equal(convert("textAppearanceFontSizeCss", testCase.value), testCase.fontSize);
        assert.equal(convert("textAppearanceFontWeightCss", testCase.value), testCase.fontWeight);
        assert.equal(convert("textAppearanceLineHeightCss", testCase.value), testCase.lineHeight);
        assert.equal(convert("textAppearanceLetterSpacingCss", testCase.value), testCase.letterSpacing);
    });
}
