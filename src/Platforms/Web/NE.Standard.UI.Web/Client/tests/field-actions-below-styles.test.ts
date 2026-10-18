// A text field's actions under it below the tier it names (ActionsBelow, a text area's and a text input's alike), read back from the
// compiled stylesheet: in each width band narrower than the tier the same nodes laid out on the root's grid, the field's ground under
// both rows and a hairline between them; placement written once outside the bands, where it changes nothing. The tools' row keeps the
// field row's insets, so its ends stand under the field's own buttons; a group sent to its other end (belowAt) stands there, two
// groups at one end in a pair.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;

const roots = ":is(.ui-text-area, .ui-text-input)";
const box = ":is(.ui-text-area__box, .ui-text-input__row)";
const inFieldStart = ":is(.ui-text-area__action--in-field.ui-text-area__action--leading, .ui-text-input__action--in-field.ui-text-input__action--leading)";
const inFieldEnd = ":is(.ui-text-area__action--in-field, .ui-text-input__action--in-field):not(.ui-text-area__action--leading, .ui-text-input__action--leading)";
const tools = ":is(:is(.ui-text-area__action, .ui-text-input__action):not(.ui-text-area__action--in-field, .ui-text-input__action--in-field), .ui-text-area__below, .ui-text-input__below)";
const endTools = ":is(.ui-text-area__action:not(.ui-text-area__action--leading, .ui-text-area__action--in-field, .ui-text-area__action--below-start), .ui-text-input__action:not(.ui-text-input__action--leading, .ui-text-input__action--in-field, .ui-text-input__action--below-start), .ui-text-area__action--below-end, .ui-text-input__action--below-end, .ui-text-area__below--end, .ui-text-input__below--end)";
const pair = ":is(.ui-text-area__below, .ui-text-input__below)";
const pairStart = ":is(.ui-text-area__below--start, .ui-text-input__below--start)";
const pairEnd = ":is(.ui-text-area__below--end, .ui-text-input__below--end)";
const sentStart = ":is(.ui-text-area__action--below-start, .ui-text-input__action--below-start)";
const sentEnd = ":is(.ui-text-area__action--below-end, .ui-text-input__action--below-end)";
const leadingHolders = ":is(.ui-text-area__action--leading, .ui-text-input__action--leading, .ui-text-area__below, .ui-text-input__below)";
const trailingHolders = ":is(.ui-text-area__action:not(.ui-text-area__action--leading), .ui-text-input__action:not(.ui-text-input__action--leading), .ui-text-area__below, .ui-text-input__below)";
const notInFieldOrSentEnd = ":not(.ui-text-area__action--in-field, .ui-text-input__action--in-field, .ui-text-area__action--below-end, .ui-text-input__action--below-end)";
const notInFieldOrSentStart = ":not(.ui-text-area__action--in-field, .ui-text-input__action--in-field, .ui-text-area__action--below-start, .ui-text-input__action--below-start)";
const wordsField = ":is(.ui-text-area, .ui-text-input):not(.ui-input--small, .ui-input--underline)";
const leadingGroups = ":is(.ui-text-area__action--leading, .ui-text-input__action--leading)";
const trailingGroups = ":is(.ui-text-area__action, .ui-text-input__action):not(.ui-text-area__action--leading, .ui-text-input__action--leading)";
const words = ".ui-button--ghost[data-ui-text-title]";

/** Each width band's media query with its body, outermost blocks only. */
const bands = [...css.matchAll(/@media ([^{]*)\{((?:[^{}]*\{[^}]*\})*)\s*\}/g)].map(match => ({ query: match[1].trim(), body: match[2] }));

/** The bands that lay the box out on its root, by the root selector they name. */
const laidOut = bands
    .map(band => ({ query: band.query, root: new RegExp(`(${escape(roots)}[^{}]*?) > ${escape(box)} \\{\\s*display: contents;`).exec(band.body)?.[1], body: band.body }))
    .filter(band => band.root !== undefined);

/** The stylesheet with every media block taken out. */
const outside = css.replace(/@media [^{]*\{(?:[^{}]*\{[^}]*\})*\s*\}/g, "");

test("each band narrower than a named tier lays both fields out on the root, the widest none", () => {
    assert.deepEqual(laidOut.map(band => [band.query, band.root]), [
        ["(max-width: 639.98px)", `${roots}[data-ui-actions-below]`],
        ["(min-width: 640px) and (max-width: 767.98px)", `${roots}[data-ui-actions-below]:not([data-ui-actions-below='sm'])`],
        ["(min-width: 768px) and (max-width: 1279.98px)", `${roots}:is([data-ui-actions-below='xl'], [data-ui-actions-below='xxl'])`],
        ["(min-width: 1280px) and (max-width: 1535.98px)", `${roots}[data-ui-actions-below='xxl']`]
    ]);

    for (const band of laidOut)
        assert.match(rule(band.body, band.root!), /display: grid;\s*gap: 0;/, band.query);
});

test("outside the bands the tier only places parts, which a flex item ignores, and the boxes stay rows", () => {
    for (const match of outside.matchAll(/([^{}]*data-ui-actions-below[^{}]*)\{([^}]*)\}/g))
        assert.doesNotMatch(match[2], /(^|[\s;])(display|content|margin[\w-]*|gap|padding[\w-]*|left|right):/, `${match[1].trim()} lays out at every width`);

    assert.match(outside, /\.ui-text-area__box \{\s*display: flex;/);
    assert.match(outside, /\.ui-text-input__row(, [^{]*)? \{[^}]*display: flex;/);
});

test("the field's ground is a stand-in under both rows that takes every edge and mark the box's rules give it, so the tools stand on it", () => {
    const before = rule(outside, `${roots}[data-ui-actions-below] > ${box}::before`);

    assert.match(before, /grid-row: 2 \/ 4;/);
    assert.match(before, /grid-column: 1 \/ -1;/);

    for (const property of ["border", "border-radius", "background", "outline", "outline-offset", "box-shadow"])
        assert.match(before, new RegExp(`(^|\\s)${property}: inherit;`), property);

    for (const band of laidOut)
        assert.match(rule(band.body, `${band.root} > ${box}::before,\n  ${band.root} > ${box}::after`), /content: "";/, band.query);
});

test("the field's row keeps the box's height with a hairline at its foot across the field, inert, the tools six pixels under it", () => {
    const after = rule(outside, `${roots}[data-ui-actions-below] > ${box}::after`);

    assert.match(after, /grid-row: 2;/);
    assert.match(after, /grid-column: 1 \/ -1;/);
    assert.match(after, /min-height: inherit;/);
    assert.match(after, /border-bottom: 1px solid var\(--ui-color-border\);/);
    assert.match(after, /pointer-events: none;/);
    // One hairline on every appearance: an edged field's bottom edge now runs under the tools.
    assert.doesNotMatch(css, /\.ui-input--[a-z]+\)?[^{}]*\[data-ui-actions-below\] > [^{}]*::after \{/);

    // Top and bottom alone: the sides keep the groups' own half step, as in the field's row.
    for (const band of laidOut)
        assert.match(rule(band.body, `${band.root} > ${box} > ${tools}`), /^\s*margin-top: 0\.375rem;\s*margin-bottom: calc\(1\.5 \* 0\.25rem \+ var\(--ui-border-width, 1px\)\);\s*$/, band.query);
});

test("the box's ::after is the hairline's alone", () => {
    for (const match of css.matchAll(/([^{}]*(\.ui-text-area__box|\.ui-text-input__row|\.ui-field-box)[^{}]*::after[^{}]*)\{/g))
        assert.match(match[1], /data-ui-actions-below/, `${match[1].trim()} draws on the box's ::after too`);
});

test("the in-field actions keep the field's row at its two ends and the others stand under it, leading at the start and trailing at the end", () => {
    assert.match(rule(outside, `${roots}[data-ui-actions-below] > ${box} > ${inFieldStart}`), /grid-column: 2;/);
    assert.match(rule(outside, `${roots}[data-ui-actions-below] > ${box} > ${inFieldEnd}`), /grid-column: -3;/);

    const below = rule(outside, `${roots}[data-ui-actions-below] > ${box} > ${tools}`);

    assert.match(below, /grid-row: 3;/);
    assert.match(below, /justify-self: start;/);
    assert.match(rule(outside, `${roots}[data-ui-actions-below] > ${box} > ${tools}${endTools}`), /^\s*justify-self: end;\s*$/);

    for (const band of laidOut) {
        assert.match(rule(band.body, `${band.root} > ${box} > ${inFieldStart}`), /^\s*margin-right: var\(--ui-field-gap\);\s*$/, band.query);
        assert.match(rule(band.body, `${band.root} > ${box} > ${inFieldEnd}`), /^\s*margin-left: var\(--ui-field-gap\);\s*$/, band.query);
    }
});

test("the tools' row stands between the field's insets with the groups' own half step, so its ends line up with the field's buttons", () => {
    assert.match(rule(outside, `${roots}[data-ui-actions-below] > ${box} > ${tools}`), /grid-column: 2 \/ -2;/);

    for (const kind of ["ui-text-input", "ui-text-area"]) {
        assert.match(rule(outside, `.${kind}__action`), /margin-right: -0\.25rem;/, kind);
        assert.match(rule(outside, `.${kind}__action--leading`), /margin-right: 0;\s*margin-left: -0\.25rem;/, kind);
    }

    // Underline gives no half step back, in a pair as anywhere.
    assert.match(rule(outside, ".ui-input--underline > .ui-text-input__row > .ui-text-input__action--leading,\n.ui-input--underline > .ui-text-input__row > .ui-text-input__below > .ui-text-input__action--leading"), /margin-left: 0;/);
    assert.match(rule(outside, ".ui-input--underline > .ui-text-area__box > .ui-text-area__action,\n.ui-input--underline > .ui-text-area__box > .ui-text-area__below > .ui-text-area__action"), /margin-right: 0;\s*margin-left: 0;/);
    assert.match(outside, /\.ui-input--underline > \.ui-text-input__row > \.ui-text-input__below > \.ui-text-input__action \{\s*margin-right: 0;/);

    // The insets the columns take by appearance and size: the row's or the box's own padding and border.
    const insets: [string, string, string][] = [
        [":is(.ui-input--filled, .ui-input--tonal, .ui-input--outline)", "--ui-field-inset", "calc(0.75rem + var(--ui-border-width, 1px))"],
        [".ui-input--ghost", "--ui-field-inset", "calc(0.5rem + var(--ui-border-width, 1px))"],
        [".ui-input--underline", "--ui-field-inset", "0px"],
        [".ui-input--small", "--ui-field-inset", "calc(0.375rem + var(--ui-border-width, 1px))"],
        [".ui-input--underline.ui-input--small", "--ui-field-inset", "0px"],
        [".ui-text-area", "--ui-text-area-inset", "calc(0.75rem + var(--ui-border-width, 1px))"],
        [".ui-text-area.ui-input--ghost", "--ui-text-area-inset", "calc(0.5rem + var(--ui-border-width, 1px))"],
        [".ui-text-area.ui-input--underline", "--ui-text-area-inset", "0px"]
    ];

    for (const [selector, variable, value] of insets)
        assert.match(rules(outside, selector), new RegExp(`${escape(variable)}: ${escape(value)};`), selector);
});

test("a ghost button with words at a field's outer end stands its words on the inset, in the field's row and the tools' row alike", () => {
    // The first leading and the last trailing in the markup, by itself or in a pair: a pair holds a group of each side.
    const first = `:nth-child(1 of ${leadingHolders})`;
    const last = `:nth-last-child(1 of ${trailingHolders})`;
    const start = rule(outside, [
        `${wordsField} > ${box} > ${leadingGroups}${first} > ${words}:first-child`,
        `${wordsField} > ${box} > ${leadingGroups}${first} > .ui-flyout:first-child > .ui-flyout__anchor > ${words}`,
        `${wordsField} > ${box} > ${pair}${first} > :first-child > ${words}:first-child`,
        `${wordsField} > ${box} > ${pair}${first} > :first-child > .ui-flyout:first-child > .ui-flyout__anchor > ${words}`
    ].join(",\n"));
    const end = rule(outside, [
        `${wordsField} > ${box} > ${trailingGroups}${last} > ${words}:last-child`,
        `${wordsField} > ${box} > ${trailingGroups}${last} > .ui-flyout:last-child > .ui-flyout__anchor > ${words}`,
        `${wordsField} > ${box} > ${pair}${last} > :last-child > ${words}:last-child`,
        `${wordsField} > ${box} > ${pair}${last} > :last-child > .ui-flyout:last-child > .ui-flyout__anchor > ${words}`
    ].join(",\n"));

    // Moved rather than given a margin, which shrank the button inside its group; a band empties the variable for a sent group.
    assert.match(start, /^\s*left: var\(--ui-field-words-start, -0\.25rem\);\s*$/);
    assert.match(end, /^\s*right: var\(--ui-field-words-end, -0\.25rem\);\s*$/);

    for (const band of laidOut) {
        const root = `${wordsField}${band.root!.slice(roots.length)}`;

        assert.match(rule(band.body, `${root} > ${box} > :is(${leadingGroups}, ${sentStart})${notInFieldOrSentEnd} > ${words}:first-child,\n  ${root} > ${box} > ${pairStart} > :first-child > ${words}:first-child`), /^\s*left: -0\.25rem;\s*$/, band.query);
        assert.match(rule(band.body, `${root} > ${box} > :is(${trailingGroups}, ${sentEnd})${notInFieldOrSentStart} > ${words}:last-child,\n  ${root} > ${box} > ${pairEnd} > :last-child > ${words}:last-child`), /^\s*right: -0\.25rem;\s*$/, band.query);
    }
});

test("a group sent to the tools' row's other end stands at that end, two groups there in one pair, each with that end's half step", () => {
    // Beside the field a pair is no box, so each of its groups keeps its own side in the flex order.
    assert.match(rule(outside, pair), /^\s*display: contents;\s*$/);

    // Under it the row's end holds one item: the trailing tools, a leading group sent there, or the pair of both.
    assert.match(rule(outside, `${roots}[data-ui-actions-below] > ${box} > ${tools}${endTools}`), /justify-self: end;/);

    for (const band of laidOut) {
        const notUnderline = `${roots}:not(.ui-input--underline)${band.root!.slice(roots.length)}`;

        assert.match(rule(band.body, `${band.root} > ${box} > ${pair}`), /^\s*display: flex;\s*gap: var\(--ui-field-gap\);\s*$/, band.query);
        // None toward the row's middle, nor the words' step toward the side the group left beside the text.
        assert.match(rule(band.body, `${band.root} > ${box} ${sentStart}`), /^\s*--ui-field-words-end: auto;\s*margin-right: 0;\s*$/, band.query);
        assert.match(rule(band.body, `${band.root} > ${box} ${sentEnd}`), /^\s*--ui-field-words-start: auto;\s*margin-left: 0;\s*$/, band.query);
        // By itself it stands at the row's outer side, half a step into the inset, as the group of that side would.
        assert.match(rule(band.body, `${notUnderline} > ${box} > ${sentStart}`), /^\s*margin-left: -0\.25rem;\s*$/, band.query);
        assert.match(rule(band.body, `${notUnderline} > ${box} > ${sentEnd}`), /^\s*margin-right: -0\.25rem;\s*$/, band.query);
    }
});

test("a text input's parts stand in the row's order after the leading in-field action, the value's column taking the room between", () => {
    assert.match(rule(outside, ".ui-text-input[data-ui-actions-below]"), /grid-template-columns: var\(--ui-field-inset\) auto fit-content\(65%\) auto auto minmax\(0, 1fr\) auto auto auto auto var\(--ui-field-inset\);/);

    const parts = [".ui-input__header", ".ui-input__affix-icon--prefix", ".ui-input__affix--prefix", ".ui-text-input__field", ".ui-input__affix--suffix", ".ui-input__affix-icon--suffix", ".ui-text-input__clear"];

    parts.forEach((part, index) => assert.match(rule(outside, `.ui-text-input[data-ui-actions-below] > .ui-text-input__row > ${part}`), new RegExp(`grid-column: ${index + 3};`), part));
});

test("a text area's text keeps the row between its in-field actions, all three ending on its last line", () => {
    assert.match(rule(outside, ".ui-text-area[data-ui-actions-below]"), /grid-template-columns: var\(--ui-text-area-inset\) auto minmax\(0, 1fr\) auto var\(--ui-text-area-inset\);/);
    assert.match(rule(outside, ".ui-text-area[data-ui-actions-below] > .ui-text-area__box > .ui-text-area__field"), /grid-column: 3;/);
    assert.match(rule(outside, ".ui-text-area[data-ui-actions-below] > .ui-text-area__box > :is(.ui-text-area__field, .ui-text-area__action--in-field)"), /align-self: end;/);
});

test("each group stands on its side of the field by its order, and a band's grid lets the keyboard walk its rows as they are drawn", () => {
    for (const group of [".ui-text-area__action", ".ui-text-input__action"]) {
        assert.match(rules(outside, group), /order: 1;/, group);
        assert.match(rules(outside, `${group}--leading`), /order: -1;/, `${group}--leading`);
    }

    for (const band of laidOut)
        assert.match(rule(band.body, band.root!), /reading-flow: grid-rows;/, band.query);
});

/** The body of the rule whose selector is exactly <selector>, or "" where there is none. */
function rule(text: string, selector: string): string {
    return new RegExp(`(?:^|[}\\s])${escape(selector)} \\{([^}]*)\\}`).exec(text)?.[1] ?? "";
}

/** The bodies of every rule whose selector is exactly <selector>, one after another. */
function rules(text: string, selector: string): string {
    return [...text.matchAll(new RegExp(`(?:^|[}\\s])${escape(selector)} \\{([^}]*)\\}`, "g"))].map(match => match[1]).join("");
}

function escape(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
