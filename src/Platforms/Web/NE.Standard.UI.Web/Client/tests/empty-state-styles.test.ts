// The empty state of every host with ShowEmptyTemplate, read back from the compiled stylesheet: one shared rule
// (mixins/empty-state.less) gives a host showing its empty state the placeholder's whole box, and hides it under a root marked by
// ShowEmptyTemplate off — through the host alone, so a list nested in a row keeps its own. EmptyStateRenderTests holds every
// IEmptyStateComponent's stylesheet to the mixin.

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const styles = resolve(dirname(fileURLToPath(import.meta.url)), "../src/styles");
const source = resolve(styles, "../ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;

/** The declarations of every rule whose selector list is exactly `selector` or ends with it, or null where there is none. */
function declarations(selector: string): string | null {
    const matches = [...css.matchAll(new RegExp(`(?:^|\\n)\\s*${selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} \\{([^}]*)\\}`, "g"))];

    return matches.length === 0 ? null : matches.map(match => match[1]).join("");
}

// Each host's root and the path from it to its items host.
const hosts: readonly (readonly [string, string])[] = [
    [".ui-items-view", "[data-ui-items-host]"],
    [".ui-tree", ".ui-tree__host"],
    [".ui-table", ".ui-table__scroll > .ui-table__host"],
    [".ui-tabs-view", ".ui-tabs-view__host"],
    [".ui-menu", ".ui-menu__host"],
    [".ui-radio-group", ".ui-radio-group__host"],
    [".ui-key-value-action", ".ui-key-value-action__host"]
];

test("each host marked by ShowEmptyTemplate off hides its own empty state, through its host alone", () => {
    for (const [root, host] of hosts) {
        const selector = `${root}[data-ui-no-empty] > ${host} > [data-ui-empty-placeholder]`;

        assert.match(declarations(selector) ?? "", /display: none;/, selector);
    }
});

test("each host showing its empty state gives the placeholder its whole box, a stretched auto row", () => {
    for (const [root, host] of hosts) {
        const selector = `${root} > ${host}[data-ui-items-empty]`;
        const rule = declarations(selector) ?? "";

        assert.match(rule, /display: grid;/, selector);
        assert.match(rule, /grid-auto-rows: auto;/, selector);
        assert.match(rule, /align-content: stretch;/, selector);
        // Across, where the host keeps its rows at the top, the placeholder still stretches.
        assert.match(rule, /align-items: stretch;/, selector);
        // The table keeps its columns, the rest stand the placeholder in one.
        assert.match(rule, root === ".ui-table" ? /grid-template-columns: subgrid;/ : /grid-template-columns: minmax\(0, 1fr\);/, selector);
    }
});

test("each host's placeholder spans every track it keeps, so a key-value list with no actions and no stretch stands it across", () => {
    for (const [root, host] of hosts) {
        const selector = `${root} > ${host} > [data-ui-empty-placeholder]`;

        assert.match(declarations(selector) ?? "", /grid-column: 1 \/ -1;/, selector);
    }

    // That list's own columns tie with the empty host's rule and follow it, so they are the ones it shows.
    assert.ok(css.indexOf(".ui-key-value-action--no-actions.ui-key-value-action--no-stretch .ui-key-value-action__host {") > css.indexOf(".ui-key-value-action > .ui-key-value-action__host[data-ui-items-empty] {"));
});

test("no stylesheet hides an empty state by a class of its own", () => {
    const components = resolve(styles, "components");

    for (const file of readdirSync(components))
        assert.doesNotMatch(readFileSync(resolve(components, file), "utf8"), /--no-empty/, file);
});
