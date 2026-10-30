// Right-to-left is out of scope: no stylesheet of the core's or a package's turns a rule round for the page's direction.

import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { addOnEntries } from "./add-on-stylesheets.ts";

const here = dirname(fileURLToPath(import.meta.url));

/** Every Less source under a folder, its own and its subfolders'. */
function lessSources(folder: string): string[] {
    return readdirSync(folder, { recursive: true, encoding: "utf8" }).filter(name => name.endsWith(".less")).map(name => join(folder, name));
}

const sources = [resolve(here, "../src/styles"), resolve(here, "../plugin"), ...addOnEntries.map(entry => dirname(entry))].filter(existsSync).flatMap(lessSources);

test("no core or package stylesheet reads the page's direction", () => {
    assert.ok(sources.length > 50, `found ${sources.length} stylesheets`);

    const turned = sources.filter(source => readFileSync(source, "utf8").includes(":dir("));

    assert.deepEqual(turned, []);
});
