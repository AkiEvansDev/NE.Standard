// The window's tier is read off the page's one watch per breakpoint (responsive-tier.ts): whether a list stands as a sheet, whether a
// side is a drawer, asked on every opening and every fit, make no media query list of their own.

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { FakeElement, installFakeDom, real } from "./fake-dom.ts";

let width = 500;
const queries: string[] = [];

installFakeDom({
    matchMedia: (query: string) => {
        queries.push(query);

        return { get matches() { return width >= Number(/min-width: (\d+)px/.exec(query)?.[1] ?? 0); }, addEventListener: () => undefined };
    }
});

const { placesAsSheet } = await import("../src/interactions/anchored-popup.ts");
const { sideIsDrawer } = await import("../src/rendering/side-drawer-width.ts");

test("asking for the sheet and the drawers again and again makes one watch per breakpoint, and follows the width", () => {
    const shell = real<Element>(FakeElement.of("", { "data-ui-side-drawers": "md" }));

    for (let i = 0; i < 5; i++) {
        assert.equal(placesAsSheet(), true);
        assert.equal(sideIsDrawer(shell, "left-side"), true);
    }

    width = 1000;

    assert.equal(placesAsSheet(), false);
    assert.equal(sideIsDrawer(shell, "left-side"), false);
    assert.equal(new Set(queries).size, queries.length, "a breakpoint was queried more than once");
});

const sourceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../src");

function sources(directory: string): string[] {
    return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
        const path = join(directory, entry.name);

        return entry.isDirectory() ? sources(path) : entry.name.endsWith(".ts") ? [path] : [];
    });
}

test("no engine queries a breakpoint of its own: only responsive-tier.ts makes a tier's media query", () => {
    const files = sources(sourceRoot).map(path => ({ name: relative(sourceRoot, path).replaceAll("\\", "/"), text: readFileSync(path, "utf8") }));

    for (const file of files.filter(each => each.name !== "rendering/responsive-tier.ts")) {
        assert.doesNotMatch(file.text, /responsiveTierQuery\(/, `${file.name} makes a tier's query of its own`);
        assert.doesNotMatch(file.text, /min-width:/, `${file.name} writes a breakpoint's query of its own`);
    }
});
