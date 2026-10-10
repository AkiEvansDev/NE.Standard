// The client half of the enum converters' by-name check: the wire sends an enum as its member's name, so each converter is called
// with every name the corpus records and must write what the server's helper writes, against the corpus WebDomConverterValueTests reads.

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import test from "node:test";

import { webDomConverters } from "../src/rendering/web-dom-converters.ts";

const here = dirname(fileURLToPath(import.meta.url));
const corpusPath = resolve(here, "../../../../../../eng/Tests/Shared/dom-converter-corpus.json");
const corpus = JSON.parse(readFileSync(corpusPath, "utf8")) as { readonly converters: Readonly<Record<string, Readonly<Record<string, string>>>> };

assert.ok(Object.keys(corpus.converters).length > 0, "The dom-converter corpus is empty.");

for (const [name, members] of Object.entries(corpus.converters)) {
    test(name, () => {
        const converter = webDomConverters.get(name);

        assert.ok(converter !== undefined, `No converter '${name}'.`);

        for (const [member, expected] of Object.entries(members))
            assert.equal(converter(member) ?? "", expected, `${name}("${member}")`);
    });
}
