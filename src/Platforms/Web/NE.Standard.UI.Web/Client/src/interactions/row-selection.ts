// Which rows of a host are chosen, and how a gesture changes that: with one row, the gesture names it; with many, a plain
// press chooses it alone, Ctrl adds or takes one, Shift takes the range to the anchor (the file manager's rules) — shared by
// the items view, the table and the tree, from click and keyboard alike.

import {
    BindSelectedKeyAttribute, ComponentKeyAttribute, ItemsHostAttribute, SelectedAttribute, SelectedKeyAttribute, SelectedKeysAttribute, SelectionAttribute,
    UnselectableAttribute
} from "../addressing/dom-attributes";
import { isRowDisabled } from "./row-cursor";
import { writeSelectedKey } from "./selected-key";

const SelectedKeysBindingAttribute = "data-ui-bind-selected-keys";

// The three hosts with rows to choose and the rows themselves; a root's rows are its own shape's, so a table in an items view's row
// chooses nothing outside itself.
export const SelectionRootSelector = ".ui-items-view, .ui-table, .ui-tree";
export const SelectionRowSelector = ".ui-items-view__item, .ui-table__row, .ui-tree__row";

/** The modifier keys a choosing gesture carried. */
export type SelectionGesture = {
    readonly shift: boolean;
    readonly ctrl: boolean;
};

export const PlainGesture: SelectionGesture = { shift: false, ctrl: false };

// The row a Shift range is measured from, per host: the last row chosen without Shift.
const anchors = new WeakMap<HTMLElement, string>();

/**
 * Names the row a Shift range is measured from, when no gesture has named one yet — a list reached by Tab has had no click to
 * take an anchor from, so without this every Shift move would range just one row.
 */
export function ensureAnchor(root: HTMLElement, row: HTMLElement | null): void {
    if (row === null || anchors.has(root))
        return;

    const key = keyOf(row);

    if (key.length > 0)
        anchors.set(root, key);
}

export function gestureOf(domEvent: MouseEvent | KeyboardEvent): SelectionGesture {
    return { shift: domEvent.shiftKey, ctrl: domEvent.ctrlKey || domEvent.metaKey };
}

/** The keys the host's mode reads as chosen. */
export function readSelectedKeys(root: HTMLElement): Set<string> {
    switch (root.getAttribute(SelectionAttribute)) {
        case "one": {
            const key = root.getAttribute(SelectedKeyAttribute);

            return new Set(key === null || key.length === 0 ? [] : [key]);
        }
        case "many":
            return new Set(readKeyList(hostOf(root)));
        default:
            return new Set();
    }
}

/** Marks the rows the keys name. */
export function markSelectedRows(root: HTMLElement, rows: readonly HTMLElement[]): void {
    const keys = readSelectedKeys(root);

    for (const row of rows)
        row.toggleAttribute(SelectedAttribute, keys.has(keyOf(row)));
}

/** The chosen rows among the given ones, in their order. */
export function selectedRows(rows: readonly HTMLElement[]): HTMLElement[] {
    return rows.filter(row => row.hasAttribute(SelectedAttribute));
}

/** Chooses the row the way the mode and the gesture say; answers false when the host chooses nothing or the row refuses. */
export function chooseRow(root: HTMLElement, rows: readonly HTMLElement[], row: HTMLElement, gesture: SelectionGesture): boolean {
    const key = keyOf(row);

    if (key.length === 0 || row.hasAttribute(UnselectableAttribute))
        return false;

    switch (root.getAttribute(SelectionAttribute)) {
        case "one":
            writeSelectedKey(root, key, { attribute: SelectedKeyAttribute, bindingAttribute: BindSelectedKeyAttribute, apply: target => markSelectedRows(target, rows) });
            return true;
        case "many":
            chooseMany(root, rows, row, key, gesture);
            return true;
        default:
            return false;
    }
}

function chooseMany(root: HTMLElement, rows: readonly HTMLElement[], row: HTMLElement, key: string, gesture: SelectionGesture): void {
    const host = hostOf(root);

    if (host === null)
        return;

    const keys = readKeyList(host);
    let next: string[];

    if (gesture.shift) {
        const anchor = rows.find(candidate => keyOf(candidate) === anchors.get(root)) ?? row;
        const range = rangeBetween(rows, anchor, row).map(keyOf);

        // Ctrl+Shift keeps what was chosen outside the range; Shift alone replaces it.
        next = gesture.ctrl ? [...keys.filter(existing => !range.includes(existing)), ...range] : range;
    } else if (gesture.ctrl) {
        next = keys.includes(key) ? keys.filter(existing => existing !== key) : [...keys, key];
        anchors.set(root, key);
    } else {
        next = [key];
        anchors.set(root, key);
    }

    writeSelectedKeys(root, rows, next);
}

/** Writes the list, marks the rows and sends the list back where it is bound; an unchanged list is left alone. */
export function writeSelectedKeys(root: HTMLElement, rows: readonly HTMLElement[], keys: readonly string[]): void {
    const host = hostOf(root);

    if (host === null)
        return;

    const text = JSON.stringify(keys);

    if (host.getAttribute(SelectedKeysAttribute) === text)
        return;

    host.setAttribute(SelectedKeysAttribute, text);
    markSelectedRows(root, rows);

    if (host.hasAttribute(SelectedKeysBindingAttribute))
        host.dispatchEvent(new Event("change", { bubbles: true }));
}

/** The rows from one to the other, in the host's order, that can be chosen: drawn, enabled, not refusing. */
function rangeBetween(rows: readonly HTMLElement[], from: HTMLElement, to: HTMLElement): HTMLElement[] {
    const start = rows.indexOf(from);
    const end = rows.indexOf(to);

    if (start < 0 || end < 0)
        return [to];

    return rows
        .slice(Math.min(start, end), Math.max(start, end) + 1)
        .filter(row => row.getClientRects().length > 0 && !isRowDisabled(row) && !row.hasAttribute(UnselectableAttribute) && keyOf(row).length > 0);
}

function readKeyList(host: HTMLElement | null): string[] {
    const text = host?.getAttribute(SelectedKeysAttribute) ?? null;

    if (text === null || text.length === 0)
        return [];

    try {
        const parsed: unknown = JSON.parse(text);

        return Array.isArray(parsed) ? parsed.filter((key): key is string => typeof key === "string") : [];
    } catch {
        return [];
    }
}

/** The host's own items host, wherever its box puts it — under a table's scroll box — and never a nested list's. */
function hostOf(root: HTMLElement): HTMLElement | null {
    for (const host of root.querySelectorAll<HTMLElement>(`[${ItemsHostAttribute}]`)) {
        if (host.closest(SelectionRootSelector) === root)
            return host;
    }

    return null;
}

export function keyOf(row: Element): string {
    return row.getAttribute(ComponentKeyAttribute) ?? "";
}

/**
 * The chosen rows as a package reaches them: the host owns the list (`SelectedKey`/`SelectedKeys` and its binding); these only
 * ask it to change. A package adds the gesture — a grid's checkbox column being the first.
 */
export type ItemSelection = {
    isSelected(row: Element): boolean;
    /** Adds the row to the chosen ones or takes it out, leaving the rest alone. */
    toggle(row: Element): void;
    /** Takes or clears every row named, in one write; the rows not named keep whatever they were. */
    setSelected(root: Element, rows: Iterable<Element>, selected: boolean): void;
};

export const itemSelection: ItemSelection = {
    isSelected: row => row.hasAttribute(SelectedAttribute),
    toggle: toggleSelectedRow,
    setSelected: setRowsSelected
};

/** Adds the row to its host's chosen ones or takes it out, leaving the rest — the gesture a checkbox makes. */
function toggleSelectedRow(row: Element): void {
    const host = row.closest<HTMLElement>(SelectionRootSelector);

    if (host !== null && row instanceof HTMLElement)
        chooseRow(host, selectableRows(host), row, { shift: false, ctrl: true });
}

function setRowsSelected(root: Element, rows: Iterable<Element>, selected: boolean): void {
    if (!(root instanceof HTMLElement))
        return;

    const named = new Set<string>();

    for (const row of rows) {
        const key = keyOf(row);

        if (key.length > 0)
            named.add(key);
    }

    const kept = [...readSelectedKeys(root)].filter(key => !named.has(key));

    writeSelectedKeys(root, selectableRows(root), selected ? [...kept, ...named] : kept);
}

/** The host's own rows, a nested list's left to it. */
function selectableRows(root: HTMLElement): HTMLElement[] {
    return [...root.querySelectorAll<HTMLElement>(SelectionRowSelector)].filter(row => row.closest(SelectionRootSelector) === root);
}
