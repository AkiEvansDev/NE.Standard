// Every `data-ui-*` attribute the client spells lives once, in `dom-attributes.ts`, beside its `WebAttributes` twin or marked
// `Client-only:`; no engine holds a literal of its own, nor reaches one through `dataset`, so a rename there reaches every reader and
// the sync tests see the whole contract. The classes, events and ids are held so by `WebClassNamesSyncTests`.

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const sourceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../src");
const DomNamesFile = "addressing/dom-attributes.ts";

function sources(directory: string): string[] {
    return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
        const path = join(directory, entry.name);

        return entry.isDirectory() ? sources(path) : entry.name.endsWith(".ts") ? [path] : [];
    });
}

/** The source with its comments blanked: a comment that names an attribute spells nothing. */
function withoutComments(text: string): string {
    let result = "";
    let quote: string | null = null;
    const templates: number[] = [];
    let depth = 0;

    for (let index = 0; index < text.length; index++) {
        const char = text[index];
        const next = text[index + 1];

        if (quote !== null) {
            result += char;

            if (char === "\\") {
                result += next ?? "";
                index++;
            } else if (quote === "`" && char === "$" && next === "{") {
                result += next;
                index++;
                templates.push(depth);
                quote = null;
            } else if (char === quote) {
                quote = null;
            }

            continue;
        }

        if (char === "/" && next === "/") {
            const end = text.indexOf("\n", index);
            index = end < 0 ? text.length : end - 1;
            continue;
        }

        if (char === "/" && next === "*") {
            const end = text.indexOf("*/", index + 2);
            index = end < 0 ? text.length : end + 1;
            continue;
        }

        if (char === "\"" || char === "'" || char === "`")
            quote = char;
        else if (char === "{")
            depth++;
        else if (char === "}" && templates.length > 0 && templates[templates.length - 1] === depth) {
            templates.pop();
            quote = "`";
        } else if (char === "}")
            depth--;

        result += char;
    }

    return result;
}

const files = sources(sourceRoot).map(path => ({ name: relative(sourceRoot, path).replaceAll("\\", "/"), code: withoutComments(readFileSync(path, "utf8")) }));

// A name, or the prefix of a family of them: not the tail of a longer word.
const NamePattern = /(?<![-\w$])data-ui-[a-z0-9-]*/g;
const DatasetPattern = /\.dataset(?:\.ui[A-Z]|\[\s*["'`]ui)/g;

test("no client source but dom-attributes.ts spells a data-ui- attribute, nor reads one through dataset", () => {
    assert.ok(files.length > 100);
    const spelled: string[] = [];

    for (const file of files) {
        if (file.name === DomNamesFile)
            continue;

        for (const match of file.code.matchAll(NamePattern))
            spelled.push(`${file.name}: ${match[0]}`);

        for (const match of file.code.matchAll(DatasetPattern))
            spelled.push(`${file.name}: ${match[0]}`);
    }

    assert.deepEqual(spelled, []);
});

test("dom-attributes.ts spells each name once", () => {
    const names = new Map<string, string[]>();

    for (const match of files.find(file => file.name === DomNamesFile)!.code.matchAll(/const (\w+) = "((?:data-)?ui-[a-z0-9_-]+)";/g))
        names.set(match[2], [...names.get(match[2]) ?? [], match[1]]);

    assert.ok(names.size > 400);
    assert.deepEqual([...names].filter(([, constants]) => constants.length > 1), []);
});
