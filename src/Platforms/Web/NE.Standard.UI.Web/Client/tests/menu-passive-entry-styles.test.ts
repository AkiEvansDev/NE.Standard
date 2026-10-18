// A menu's caption and rule read back from the compiled stylesheet: a line between entries, never an entry's slot with the line on
// top. Every rule that sizes a menu entry is swept from the whole sheet, not listed: where it can reach a caption or a rule, their
// own rule outweighs it for each measure it sets. A rail's entry size (#218) and a phone sheet's touch size (#225) each stood an
// entry's empty slot under the line, as a folded menu's padding and line did.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css.replace(/\/\*[\s\S]*?\*\//g, "");

type CssRule = { readonly conditions: readonly string[]; readonly selector: string; readonly declarations: ReadonlyMap<string, string>; readonly order: number };

// Rules that are no box's style at rest: an animation's frames, a font, a property's registration, a transition's first frame.
const SkippedAtRules = /^@(keyframes|font-face|property|starting-style|view-transition|page)\b/;

/** Every style rule with the at-rules it stands in, one entry per selector of its list, in the cascade's order. */
function rulesOf(text: string, conditions: readonly string[] = [], into: CssRule[] = []): CssRule[] {
    let index = 0;

    while (index < text.length) {
        const open = text.indexOf("{", index);

        if (open < 0)
            break;

        const close = blockEnd(text, open);
        const head = text.slice(index, open).trim();
        const body = text.slice(open + 1, close);

        if (head.startsWith("@")) {
            if (!SkippedAtRules.test(head))
                rulesOf(body, [...conditions, head], into);
        }
        else {
            const declarations = declarationsOf(body);

            for (const selector of splitTopLevel(head, ","))
                into.push({ conditions, selector, declarations, order: into.length });
        }

        index = close + 1;
    }

    return into;
}

/** The index of the brace closing the block opened at `open`. */
function blockEnd(text: string, open: number): number {
    let depth = 0;

    for (let index = open; index < text.length; index++) {
        if (text[index] === "{")
            depth++;
        else if (text[index] === "}" && --depth === 0)
            return index;
    }

    return text.length;
}

/** A rule's own declarations, a nested block (a rule's `@starting-style`) left out. */
function declarationsOf(body: string): Map<string, string> {
    const declarations = new Map<string, string>();
    let flat = body;

    for (let open = flat.indexOf("{"); open >= 0; open = flat.indexOf("{")) {
        const start = flat.lastIndexOf(";", open) + 1;

        flat = flat.slice(0, start) + flat.slice(blockEnd(flat, open) + 1);
    }

    for (const declaration of flat.split(";")) {
        const colon = declaration.indexOf(":");

        if (colon > 0)
            declarations.set(declaration.slice(0, colon).trim(), declaration.slice(colon + 1).trim());
    }

    return declarations;
}

/** A list split on its top-level separators only, so `:is(a, b)` and `[a="b c"]` stay whole. */
function splitTopLevel(list: string, separator: string): string[] {
    const parts: string[] = [];
    let depth = 0;
    let quote = "";
    let current = "";

    for (const character of list) {
        if (quote !== "") {
            if (character === quote)
                quote = "";
        }
        else if (character === "\"" || character === "'")
            quote = character;
        else if (character === "(" || character === "[")
            depth++;
        else if (character === ")" || character === "]")
            depth--;

        if (character === separator && depth === 0 && quote === "") {
            parts.push(current.trim());
            current = "";
        }
        else
            current += character;
    }

    parts.push(current.trim());

    return parts.filter(part => part.length > 0);
}

// Three-valued, since a menu's surroundings are any page's: a rule may reach an entry wherever it stands.
const No = 0;
const Maybe = 1;
const Yes = 2;
type Truth = typeof No | typeof Maybe | typeof Yes;

type Box = { readonly tag: string; readonly classes: readonly string[]; readonly attributes: Readonly<Record<string, string>> };

// An entry's classes and marks as the renderer writes them; a modifier it may wear by its Size or state is a maybe, any other class
// or mark is not on it.
const EntryClasses = ["ui-menu-item", "ui-button", "ui-button--ghost", "ui-button--medium", "ui-button--align-start"];
const EntryModifiers = /^(ui-button--|ui-menu-item--)/;
const EntryMarks = { "data-ui-id": "1", "data-ui-context": "1", "data-ui-pc": "1", "data-ui-tooltip-placement": "top", "data-ui-tooltip-named": "" };

function entry(kind: string, role: string | null, titled: boolean): Box {
    return {
        tag: "a",
        classes: EntryClasses,
        attributes: { ...EntryMarks, "data-ui-menu-item-kind": kind, ...(role === null ? {} : { role }), ...(titled ? { "data-ui-text-title": "" } : {}) }
    };
}

/** A caption in a folded menu's or a rail's flyout: its row, the nested menu's host and root, the flyout. */
function inFlyout(chain: Chain): Chain {
    return [
        ...chain,
        { tag: "div", classes: ["ui-menu__host"], attributes: {} },
        { tag: "div", classes: ["ui-menu", "ui-menu--nested", "ui-orientation--vertical"], attributes: {} },
        { tag: "div", classes: ["ui-menu__submenu"], attributes: { "data-ui-menu-flyout": "" } }
    ];
}

function row(passive: boolean): Box {
    return { tag: "div", classes: ["ui-menu__item"], attributes: { "data-ui-key": "a", ...(passive ? { "data-ui-menu-passive": "" } : {}) } };
}

/** An entry and the row it stands in; what is above them is any page's. */
type Chain = readonly Box[];

// In a popup a rule is a separator and an entry a menu item; elsewhere neither carries a role, and a caption never does.
const Separators: Chain[] = [[entry("separator", "separator", false), row(true)], [entry("separator", null, false), row(true)]];
const Captions: Chain[] = [[entry("header", null, true), row(true)]];
const Entries: Chain[] = [[entry("item", "menuitem", true), row(false)], [entry("item", null, true), row(false)]];

/** Whether the selector matches the chain's element at `level`. */
function matches(selector: string, chain: Chain, level = 0): Truth {
    return matchFrom(compoundsOf(selector), chain, level);
}

type Step = { readonly combinator: string; readonly compound: string };

/** A complex selector as its compounds, each with the combinator that leads to it from the one before. */
function compoundsOf(selector: string): Step[] {
    const steps: Step[] = [];
    let depth = 0;
    let quote = "";
    let current = "";
    let combinator = "";

    for (const character of selector.trim()) {
        if (quote !== "") {
            current += character;

            if (character === quote)
                quote = "";

            continue;
        }

        if (character === "\"" || character === "'")
            quote = character;
        else if (character === "(" || character === "[")
            depth++;
        else if (character === ")" || character === "]")
            depth--;

        if (depth === 0 && /[\s>+~]/.test(character)) {
            if (current !== "") {
                steps.push({ combinator, compound: current });
                current = "";
                combinator = " ";
            }

            if (character !== " " && character !== "\n")
                combinator = character;
        }
        else
            current += character;
    }

    steps.push({ combinator, compound: current });

    return steps;
}

function matchFrom(steps: readonly Step[], chain: Chain, level: number, index = steps.length - 1): Truth {
    const own = matchCompound(steps[index].compound, chain, level);

    if (own === No || index === 0)
        return own;

    const combinator = steps[index].combinator;
    let rest: Truth;

    if (combinator === ">")
        rest = matchFrom(steps, chain, level + 1, index - 1);
    else if (combinator === " ") {
        // Any ancestor: each one the chain knows, and past them any page's.
        rest = Maybe;

        for (let ancestor = level + 1; ancestor < chain.length; ancestor++)
            rest = Math.max(rest, matchFrom(steps, chain, ancestor, index - 1)) as Truth;
    }
    else
        rest = Maybe;

    return Math.min(own, rest) as Truth;
}

function matchCompound(compound: string, chain: Chain, level: number): Truth {
    let result: Truth = Yes;

    for (const simple of simplesOf(compound)) {
        result = Math.min(result, matchSimple(simple, chain, level)) as Truth;

        if (result === No)
            break;
    }

    return result;
}

/** A compound's simple selectors: a type, a class, an id, an attribute, a pseudo-class with its argument, a pseudo-element. */
function simplesOf(compound: string): string[] {
    return compound.match(/::?[\w-]+(\((?:[^()]|\((?:[^()]|\((?:[^()]|\([^()]*\))*\))*\))*\))?|\[[^\]]*\]|[.#][\w-]+|\*|[\w-]+/g) ?? [];
}

function matchSimple(simple: string, chain: Chain, level: number): Truth {
    if (simple.startsWith("::") || /^:(before|after)$/.test(simple))
        return No;

    const box = chain[level];

    if (simple.startsWith(":"))
        return matchPseudoClass(simple, chain, level);

    if (box === undefined)
        return Maybe;

    if (simple === "*")
        return Yes;

    if (simple.startsWith("."))
        return box.classes.includes(simple.slice(1)) ? Yes : level === 0 && EntryModifiers.test(simple.slice(1)) ? Maybe : No;

    if (simple.startsWith("#"))
        return No;

    if (simple.startsWith("["))
        return matchAttribute(simple, box);

    return simple === box.tag ? Yes : No;
}

function matchPseudoClass(simple: string, chain: Chain, level: number): Truth {
    const name = /^:([\w-]+)/.exec(simple)![1];
    const argument = simple.includes("(") ? simple.slice(simple.indexOf("(") + 1, -1) : "";
    const any = () => Math.max(No, ...splitTopLevel(argument, ",").map(selector => matches(selector, chain, level))) as Truth;

    if (name === "is" || name === "where" || name === "matches" || name === "-webkit-any")
        return any();

    if (name === "not")
        return (Yes - any()) as Truth;

    // A state, a position among siblings, a direction: anything an entry may be.
    return Maybe;
}

function matchAttribute(simple: string, box: Box): Truth {
    const [, name, operator, doubleQuoted, singleQuoted, bare] = /^\[\s*([\w-]+)\s*(?:([~|^$*]?=)\s*(?:"([^"]*)"|'([^']*)'|([^\s\]]+)))?/.exec(simple)!;
    const actual = box.attributes[name];
    const expected = doubleQuoted ?? singleQuoted ?? bare ?? "";

    if (actual === undefined)
        return No;

    switch (operator) {
        case undefined: return Yes;
        case "=": return actual === expected ? Yes : No;
        case "~=": return actual.split(/\s+/).includes(expected) ? Yes : No;
        case "|=": return actual === expected || actual.startsWith(`${expected}-`) ? Yes : No;
        case "^=": return actual.startsWith(expected) ? Yes : No;
        case "$=": return actual.endsWith(expected) ? Yes : No;
        default: return actual.includes(expected) ? Yes : No;
    }
}

type Specificity = readonly [number, number, number];

function specificityOf(selector: string): Specificity {
    let total: Specificity = [0, 0, 0];

    for (const { compound } of compoundsOf(selector)) {
        for (const simple of simplesOf(compound))
            total = add(total, simpleSpecificity(simple));
    }

    return total;
}

function simpleSpecificity(simple: string): Specificity {
    if (simple.startsWith("::") || /^:(before|after)$/.test(simple))
        return [0, 0, 1];

    if (simple.startsWith(":")) {
        const name = /^:([\w-]+)/.exec(simple)![1];
        const argument = simple.includes("(") ? simple.slice(simple.indexOf("(") + 1, -1) : "";

        if (name === "where")
            return [0, 0, 0];

        if (name === "is" || name === "not" || name === "has" || name === "matches")
            return splitTopLevel(argument, ",").map(specificityOf).reduce<Specificity>((most, next) => compare(next, most) > 0 ? next : most, [0, 0, 0]);

        return [0, 1, 0];
    }

    if (simple === "*")
        return [0, 0, 0];

    if (simple.startsWith("#"))
        return [1, 0, 0];

    return simple.startsWith(".") || simple.startsWith("[") ? [0, 1, 0] : [0, 0, 1];
}

function add(left: Specificity, right: Specificity): Specificity {
    return [left[0] + right[0], left[1] + right[1], left[2] + right[2]];
}

function compare(left: Specificity, right: Specificity): number {
    return left[0] - right[0] || left[1] - right[1] || left[2] - right[2];
}

// What sizes an entry along the block axis: its least height, its height, the room inside and around it.
const Measures = /^(min-height|min-block-size|height|block-size|(padding|margin)(-top|-bottom|-block(-start|-end)?)?)$/;

/** The value a chain of the author's variables falls back to: what the rule says when the author says nothing. */
function fallbackOf(value: string): string {
    let current = value.replace(/\s*!important$/, "").trim();

    for (let inner = /^var\(--[\w-]+,\s*([\s\S]*)\)$/.exec(current); inner !== null; inner = /^var\(--[\w-]+,\s*([\s\S]*)\)$/.exec(current))
        current = inner[1].trim();

    return current;
}

/** A measure the rule sets that leaves the box as it was: an authored Height or MinHeight that is not set. */
function sizesNothing(property: string, value: string): boolean {
    const fallback = fallbackOf(value);

    return /height|block-size/.test(property) && (fallback === "auto" || property.startsWith("min-") && /^0(px|rem)?$/.test(fallback));
}

/** Whether the own rule's property sets what the entry rule's does: a shorthand its sides, a logical name its physical one. */
function covers(own: string, measure: string): boolean {
    const family = (property: string) => property.replace("block-size", "height").replace(/-(top|bottom|block(-start|-end)?)$/, "");

    return own === measure || family(own) === family(measure) && !/-(top|bottom|block)/.test(own);
}

type Violation = { readonly kind: string; readonly selector: string; readonly measure: string };

/** Every measure an entry's rule sets on a caption or a rule (`chains`) that their own rule does not outweigh. */
function violations(rules: readonly CssRule[], kind: string, chains: readonly Chain[]): Violation[] {
    const reach = (selector: string, of: readonly Chain[]) => Math.max(No, ...of.map(chain => matches(selector, chain))) as Truth;
    const important = (value: string) => value.endsWith("!important");
    const own = rules.filter(rule => rule.conditions.length === 0 && reach(rule.selector, chains) === Yes && reach(rule.selector, Entries) === No);
    const found: Violation[] = [];

    for (const rule of rules) {
        const measures = [...rule.declarations].filter(([property, value]) => Measures.test(property) && !sizesNothing(property, value));

        if (measures.length === 0 || reach(rule.selector, Entries) === No || reach(rule.selector, chains) === No)
            continue;

        const weight = specificityOf(rule.selector);

        for (const [measure, value] of measures) {
            const outweighed = own.some(mine => [...mine.declarations].some(([property, ownValue]) => covers(property, measure)
                && (important(ownValue) && !important(value)
                    || important(ownValue) === important(value) && (compare(specificityOf(mine.selector), weight) > 0 || compare(specificityOf(mine.selector), weight) === 0 && mine.order > rule.order))));

            if (!outweighed)
                found.push({ kind, selector: rule.selector, measure });
        }
    }

    return found;
}

const rules = rulesOf(css);

test("the sweep reads a selector as the browser does", () => {
    const [separator] = Separators;

    assert.equal(matches('.ui-menu-item[data-ui-menu-item-kind="separator"]', separator), Yes);
    assert.equal(matches(".ui-menu__item:where(:not([data-ui-menu-passive])) > .ui-menu-item", separator), No);
    assert.equal(matches(".ui-menu__item > .ui-menu-item:where(:not([data-ui-menu-item-kind=\"header\"], [data-ui-menu-item-kind=\"separator\"]))", separator), No);
    assert.equal(matches(".ui-menu__item > .ui-menu-item", separator), Yes);
    assert.equal(matches(".ui-menu--rail .ui-menu-item", separator), Maybe, "the row is the entry's, what holds it any page's");
    assert.equal(matches("[data-ui-sheet][popover] :is([role=\"option\"], .ui-menu-item):not(.ui-action-bar > *)", separator), Maybe);
    assert.equal(matches(".ui-menu-item:not(.ui-action-bar > *, [data-ui-menu-item-kind=\"separator\"])", separator), No);
    assert.equal(matches(".ui-menu-item::after", separator), No, "a pseudo-element is not the entry's box");
    assert.deepEqual(specificityOf("[data-ui-sheet][popover] :is([role=\"menuitem\"], .ui-menu-item):not(.ui-action-bar > *)"), [0, 4, 0]);
    assert.deepEqual(specificityOf(".a:where(.b, .c) > .d::before"), [0, 2, 1]);
});

test("the sweep finds the faults #218 and #225 were: a rail's entry size and a sheet's touch size over the rule", () => {
    const faulty = (selector: string, body: string) => rulesOf(`${css}\n${selector} { ${body} }`);
    const rail = ".ui-menu--rail > .ui-menu__host > .ui-menu__item > .ui-menu-item";
    const sheet = "[data-ui-sheet][popover] :is([role=\"menuitem\"], [role=\"option\"], .ui-menu-item):not(.ui-action-bar > *)";

    assert.deepEqual(violations(faulty(rail, "min-height: 3rem;"), "separator", Separators), [{ kind: "separator", selector: rail, measure: "min-height" }]);
    assert.deepEqual(violations(faulty(sheet, "min-height: 3rem;"), "caption", Captions), [{ kind: "caption", selector: sheet, measure: "min-height" }]);
    assert.ok(rules.some(rule => rule.selector === ".ui-menu-item" && rule.declarations.has("min-height")), "the sweep would read no entry's size at all");
});

test("no rule that sizes a menu entry sizes its rule or its caption: each is outweighed or leaves them out, in every menu's form", () => {
    assert.deepEqual([...violations(rules, "separator", Separators), ...violations(rules, "caption", Captions)], []);
});

test("a flyout's caption is a popup list's, words and all: no folded menu's or rail's rule turns it into the rule", () => {
    const folded = [":is(.ui-menu[data-ui-collapsed]:not([data-ui-folding]), .ui-menu--rail) ", ".ui-menu[data-ui-collapsed]:not([data-ui-folding]) "];
    const captionRules = rules.filter(rule => folded.some(prefix => rule.selector.startsWith(prefix)) && rule.selector.includes('[data-ui-menu-item-kind="header"]'));

    assert.ok(captionRules.length >= 2, "the folded caption's rules are not read");

    for (const rule of captionRules)
        assert.equal(Math.max(...Captions.map(chain => matches(rule.selector, inFlyout(chain)))), No, rule.selector);

    assert.equal(matches('.ui-menu-item:not([data-ui-menu-flyout] *)', inFlyout(Captions[0])), No);
    assert.equal(matches('.ui-menu-item:not([data-ui-menu-flyout] *)', Captions[0]), Maybe);
});

test("a rule's content takes no line, a folded caption's words are out of sight, and no folded entry's line stands under either", () => {
    const content = (selector: string) => rules.find(rule => rule.selector === selector)?.declarations;
    const foldedWords = ':is(.ui-menu[data-ui-collapsed]:not([data-ui-folding]), .ui-menu--rail) .ui-menu-item[data-ui-menu-item-kind="header"]:not([data-ui-menu-flyout] *) > .ui-button__content';

    assert.equal(content('.ui-menu-item[data-ui-menu-item-kind="separator"] > .ui-button__content')?.get("display"), "none");
    // A rail's caption is the rule it stands for, as a collapsed menu's: its words stood as a line under the rule.
    assert.equal(content(foldedWords)?.get("position"), "absolute");
    assert.equal(content(foldedWords)?.get("clip"), "rect(0, 0, 0, 0)");
    assert.ok(rules.some(rule => rule.selector.endsWith(" > .ui-text") && rule.declarations.get("min-block-size") === "1lh"), "a folded entry's line is gone");

    for (const rule of rules.filter(rule => rule.declarations.has("min-block-size") && rule.selector.endsWith(" > .ui-text"))) {
        const words = (chain: Chain) => matches(rule.selector, [{ tag: "span", classes: ["ui-button__content", "ui-text"], attributes: {} }, ...chain]);

        assert.equal(Math.max(...Captions.map(words), ...Separators.map(words)), No, rule.selector);
    }
});
