// One predicate for "answers nothing": an element disabled itself, or inside a disabled, loading or inert component — over a small
// stand-in for the DOM that knows classes, attributes and :disabled, which is all the predicate's selectors use.

import assert from "node:assert/strict";
import test from "node:test";

import { isInert, isReadOnly } from "../src/interactions/interactive-state.ts";
import { isRovingCandidate } from "../src/interactions/roving-focus.ts";

type FakeOptions = { readonly classes?: readonly string[]; readonly attributes?: Readonly<Record<string, string>>; readonly disabled?: boolean };

class FakeElement {
    public readonly parent: FakeElement | null;
    public readonly classes: Set<string>;
    public readonly attributes: Map<string, string>;
    public readonly disabled: boolean;

    public constructor(parent: FakeElement | null, options: FakeOptions = {}) {
        this.parent = parent;
        this.classes = new Set(options.classes ?? []);
        this.attributes = new Map(Object.entries(options.attributes ?? {}));
        this.disabled = options.disabled ?? false;
    }

    public getClientRects(): unknown[] {
        return [{}];
    }

    public matches(selectors: string): boolean {
        return selectors.split(",").some(selector => this.matchesOne(selector.trim()));
    }

    public closest(selectors: string): FakeElement | null {
        return this.matches(selectors) ? this : this.parent?.closest(selectors) ?? null;
    }

    private matchesOne(selector: string): boolean {
        if (selector === ":disabled")
            return this.disabled;

        if (selector.startsWith("."))
            return this.classes.has(selector.slice(1));

        const attribute = /^\[([\w-]+)(?:='([^']*)')?\]$/.exec(selector);

        if (attribute === null)
            throw new Error(`The stand-in does not read "${selector}".`);

        return attribute[2] === undefined ? this.attributes.has(attribute[1]) : this.attributes.get(attribute[1]) === attribute[2];
    }
}

function element(parent: FakeElement | null, options?: FakeOptions): HTMLElement {
    return new FakeElement(parent, options) as unknown as HTMLElement;
}

function fake(value: HTMLElement): FakeElement {
    return value as unknown as FakeElement;
}

test("an entry of a disabled or loading menu is inert, and so no stop for the arrows or a shortcut", () => {
    const disabledMenu = element(null, { classes: ["ui-menu", "ui-disabled"] });
    const loadingMenu = element(null, { classes: ["ui-menu", "ui-loading"] });

    assert.equal(isInert(element(fake(disabledMenu), { classes: ["ui-menu-item"] })), true);
    assert.equal(isRovingCandidate(element(fake(loadingMenu), { classes: ["ui-menu-item"] })), false);
});

test("a tab's label inside a disabled tab item is skipped, while its neighbour's is not", () => {
    const strip = element(null, { classes: ["ui-tabs-view"] });
    const disabled = element(fake(element(fake(strip), { classes: ["ui-tab-item", "ui-disabled"], attributes: { inert: "" } })), { classes: ["ui-tab-item__label"] });
    const live = element(fake(element(fake(strip), { classes: ["ui-tab-item"] })), { classes: ["ui-tab-item__label"] });

    assert.equal(isRovingCandidate(disabled), false);
    assert.equal(isRovingCandidate(live), true);
});

test("an element disabled itself, natively or for a screen reader, is inert", () => {
    assert.equal(isInert(element(null, { disabled: true })), true);
    assert.equal(isInert(element(null, { attributes: { "aria-disabled": "true" } })), true);
    assert.equal(isInert(element(null, { attributes: { "aria-disabled": "false" } })), false);
});

test("read-only is the input root's mark, read from anywhere inside it", () => {
    const root = element(null, { classes: ["ui-checkbox", "ui-readonly"], attributes: { "data-ui-id": "box" } });

    assert.equal(isReadOnly(root), true);
    assert.equal(isReadOnly(element(fake(root))), true);
    assert.equal(isReadOnly(element(null, { classes: ["ui-checkbox"], attributes: { "data-ui-id": "other" } })), false);
    assert.equal(isInert(element(fake(root))), false);
});

test("a component inside a read-only host answers for itself, not for the host", () => {
    const host = element(null, { classes: ["ui-code-input", "ui-readonly"], attributes: { "data-ui-id": "code" } });
    const bar = element(fake(host), { classes: ["ui-code-input__status"] });
    const select = element(fake(bar), { classes: ["ui-select"], attributes: { "data-ui-id": "language" } });
    const trigger = element(fake(select), { classes: ["ui-select__trigger"] });

    assert.equal(isReadOnly(bar), true);
    assert.equal(isReadOnly(trigger), false);
    fake(select).classes.add("ui-readonly");
    assert.equal(isReadOnly(trigger), true);
});
