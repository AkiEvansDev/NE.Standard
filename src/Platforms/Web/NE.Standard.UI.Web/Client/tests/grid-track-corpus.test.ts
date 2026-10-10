// A grid track's syntax has three ports: the server's first paint (WebCssValues.GridUnit), the client's live patch (`gridUnitCss`)
// and the splitter's reading of a template (grid-tracks.ts). Each case of the corpus WebCssValuesGridUnitTests reads is written by the
// converter as the server writes it, read back by the splitter, and written back by it the same.

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import test from "node:test";

import { formatGridTracks, parseGridTracks } from "../src/interactions/grid-tracks.ts";
import { webDomConverters } from "../src/rendering/web-dom-converters.ts";

type GridTrackCase = {
    readonly name: string;
    readonly unit: Readonly<Record<string, unknown>>;
    readonly css: string;
    readonly track: Readonly<Record<string, unknown>>;
};

const here = dirname(fileURLToPath(import.meta.url));
const corpusPath = resolve(here, "../../../../../../eng/Tests/Shared/grid-track-corpus.json");
const corpus = JSON.parse(readFileSync(corpusPath, "utf8")) as { readonly cases: readonly GridTrackCase[] };
const gridUnitCss = webDomConverters.get("gridUnitCss");

assert.ok(corpus.cases.length > 0, "The grid-track corpus is empty.");
assert.ok(gridUnitCss !== undefined, "No converter 'gridUnitCss'.");

for (const corpusCase of corpus.cases) {
    test(`corpus: ${corpusCase.name}`, () => {
        assert.equal(gridUnitCss(corpusCase.unit), corpusCase.css, "the live patch writes what the first paint writes");

        const tracks = parseGridTracks(corpusCase.css);

        assert.deepEqual(tracks, [corpusCase.track], "the splitter reads the track back");
        assert.equal(formatGridTracks(tracks ?? []), corpusCase.css, "the splitter writes it back the same");
    });
}
