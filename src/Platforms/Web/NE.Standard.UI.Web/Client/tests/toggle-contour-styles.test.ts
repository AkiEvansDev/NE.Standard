// Read back from the compiled stylesheet: every labelled toggle hugs its `[indicator + label]` content width and answers pointer hover
// and keyboard focus with an outer `::before` contour wash (`--ui-wash-hover`, `inset: -0.125rem -0.375rem`, `z-index: -1`), a stepped
// indicator fill (`--ui-wash-hover-share + 4%`) and a `40%` indicator ring (or `88%` primary lean toward `on-primary` when checked),
// while bare unlabeled checkboxes and switches (a table's select column, a trailing row toggle) draw no outer wash.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css.replace(/\/\*[\s\S]*?\*\//g, "");

function selectorsOf(list: string): string[] {
    const selectors: string[] = [];
    let depth = 0;
    let current = "";

    for (const character of list) {
        if (character === "(" || character === "[")
            depth++;
        else if (character === ")" || character === "]")
            depth--;

        if (character === "," && depth === 0) {
            selectors.push(current.trim());
            current = "";
        }
        else
            current += character;
    }

    selectors.push(current.trim());

    return selectors.filter(selector => selector.length > 0);
}

function rulesOf(text: string): { readonly selector: string; readonly body: string }[] {
    const rules: { readonly selector: string; readonly body: string }[] = [];
    let index = 0;

    while (index < text.length) {
        const open = text.indexOf("{", index);
        const close = text.indexOf("}", index);

        if (close >= 0 && (open < 0 || close < open)) {
            index = close + 1;
            continue;
        }

        if (open < 0)
            break;

        const head = text.slice(index, open).split(";").pop()!.trim();

        if (head.startsWith("@")) {
            index = open + 1;
            continue;
        }

        const end = text.indexOf("}", open);

        for (const selector of selectorsOf(head))
            rules.push({ selector, body: text.slice(open + 1, end) });

        index = end + 1;
    }

    return rules;
}

const rules = rulesOf(css);

function bodiesOf(selector: string): string {
    return rules.filter(rule => rule.selector === selector).map(rule => rule.body).join("\n");
}

const labelled = ":is([data-ui-text-title], [data-ui-text-description], [data-ui-text-icon], [data-ui-text-badge-icon], [data-ui-text-badge-title])";
const live = ":not(.ui-disabled, .ui-readonly, .ui-loading)";
const itemLive = ":not([data-ui-row-idle], [aria-disabled='true'], [data-ui-pending])";

test("checkboxes, switches and toggle-group items hug their content width and isolate their row stacking", () => {
    for (const root of [".ui-checkbox", ".ui-switch"]) {
        const body = bodiesOf(root);

        assert.match(body, /grid-template-columns: auto minmax\(0, auto\) minmax\(0, 1fr\);/, root);
        assert.match(body, /width: var\(--ui-width-xxl, [^;]*var\(--ui-width, fit-content\)\)\)\)\);/, root);
        assert.match(body, /max-width: var\(--ui-max-width-xxl, [^;]*var\(--ui-max-width, var\(--ui-fill-width, 100%\)\)\)\)\)\);/, root);
        assert.match(body, /isolation: isolate;/, root);
        assert.match(body, /column-gap: 0;/, root);
    }

    for (const item of [".ui-radio-group .ui-radio-group__item", ".ui-multi-select--checkboxes .ui-multi-select__check"]) {
        const body = bodiesOf(item);

        assert.match(body, /width: fit-content;/, item);
        assert.match(body, /max-width: 100%;/, item);
        assert.match(body, /isolation: isolate;/, item);
    }

    const nonRootCheckbox = bodiesOf(".ui-checkbox:not([data-ui-id])");

    assert.match(nonRootCheckbox, /--ui-width: initial;/);
    assert.match(nonRootCheckbox, /--ui-max-width: initial;/);
    assert.match(nonRootCheckbox, /--ui-height: initial;/);
});

test("labelled checkboxes, switches and toggle-group items draw an outer row-1 contour wash on hover and keyboard focus; bare toggles do not", () => {
    const wash = "background-color: var(--ui-wash-hover);";

    for (const root of [".ui-checkbox", ".ui-switch"]) {
        const contour = bodiesOf(`${root}${labelled}${live}:not([data-ui-pending])::before`);

        assert.match(contour, /inset: -0\.125rem -0\.375rem;/, root);
        assert.match(contour, /border-radius: var\(--ui-radius-button\);/, root);
        assert.match(contour, /z-index: -1;/, root);
        assert.match(contour, /grid-row: 1 \/ 2;/, root);
        assert.match(contour, /grid-column: 1 \/ 3;/, root);

        assert.match(bodiesOf(`${root}${labelled} > :is(.ui-text, .ui-validation-message)`), /margin-inline-start: 0\.5rem;/, root);
        assert.match(bodiesOf(`${root} > .ui-validation-message`), /grid-column: 2 \/ -1;/, root);

        assert.ok(bodiesOf(`${root}${labelled}${live}:not([data-ui-pending]):hover::before`).includes(wash), `${root} hover wash`);
        assert.ok(bodiesOf(`${root}${labelled}${live}:not([data-ui-pending])[data-ui-focus-within='keyboard']::before`).includes(wash), `${root} keyboard wash`);
        assert.equal(bodiesOf(`${root}:hover::before`), "", `${root} bare toggle must not draw an outer wash`);
    }

    for (const [group, item] of [[".ui-radio-group", ".ui-radio-group__item"], [".ui-multi-select--checkboxes", ".ui-multi-select__check"]] as const) {
        const prefix = `${group}${live}:not([data-ui-pending]) ${item}${itemLive}`;
        const contour = bodiesOf(`${prefix}::before`);

        assert.match(contour, /inset: -0\.125rem -0\.375rem;/, group);
        assert.match(contour, /border-radius: var\(--ui-radius-button\);/, group);
        assert.match(contour, /z-index: -1;/, group);

        assert.ok(bodiesOf(`${prefix}:hover::before`).includes(wash), `${group} hover wash`);
        assert.ok(bodiesOf(`${prefix}[data-ui-focus-within='keyboard']::before`).includes(wash), `${group} keyboard wash`);
    }
});

test("toggle indicators step their fill, ring, switch mark and checked primary lean cleanly on hover, keyboard focus and press", () => {
    assert.ok(css.includes("background: color-mix(in srgb, var(--ui-color-on-surface) calc(var(--ui-wash-hover-share) + 4%), var(--ui-color-surface));"));
    assert.ok(css.includes("border-color: color-mix(in srgb, var(--ui-color-on-surface) 40%, var(--ui-color-mark));"));
    assert.ok(css.includes("border-color: color-mix(in srgb, var(--ui-color-on-surface) 60%, var(--ui-color-mark));"));
    assert.ok(css.includes("background: color-mix(in srgb, var(--ui-color-primary) var(--ui-toggle-lean, 88%), var(--ui-color-on-primary));"));
    assert.ok(css.includes("--ui-toggle-lean: 80%;"));
    assert.ok(bodiesOf(`.ui-switch${live}:hover > .ui-switch__input:not(:disabled):not(:checked) ~ .ui-switch__box::after`).includes("background: color-mix(in srgb, var(--ui-color-on-surface) 40%, var(--ui-color-mark));"));
    assert.ok(bodiesOf(`.ui-switch${live}:active > .ui-switch__input:not(:disabled):not(:checked) ~ .ui-switch__box::after`).includes("background: color-mix(in srgb, var(--ui-color-on-surface) 60%, var(--ui-color-mark));"));
    assert.match(css, /@media \(hover: hover\) \{[\s\S]*?--ui-toggle-lean: 80%;\s*\}\s*\}/);
});
