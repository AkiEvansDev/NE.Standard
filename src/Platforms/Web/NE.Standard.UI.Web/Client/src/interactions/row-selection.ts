// Which rows of a host are chosen, and how a gesture changes that: with one row to choose the gesture names it; with many, a plain
// press chooses that row alone, Ctrl adds or takes one, Shift takes every row from the anchor to it — the file manager's rules.
// The items view, the table and the tree all choose through here, from a click and from the keyboard alike.

import {
    BindSelectedKeyAttribute, ComponentKeyAttribute, ItemsHostAttribute, SelectedAttribute, SelectedKeyAttribute, SelectedKeysAttribute, SelectionAttribute,
    UnselectableAttribute
} from "../addressing/dom-attributes";
import { isRowDisabled } from "./row-cursor";
import { writeSelectedKey } from "./selected-key";

const SelectedKeysBindingAttribute = "data-ui-bind-selected-keys";

/** The modifier keys a choosing gesture carried. */
export type SelectionGesture = {
    readonly shift: boolean;
    readonly ctrl: boolean;
};

export const PlainGesture: SelectionGesture = { shift: false, ctrl: false };

// The row a Shift range is measured from, per host: the last row chosen without Shift.
const anchors = new WeakMap<HTMLElement, string>();

/**
 * Names the row a Shift range is measured from when no gesture has named one yet. A list the reader reached with Tab has had no
 * click to take an anchor from, and without this the range would be measured from the row the move lands on — one row, every time.
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

function hostOf(root: HTMLElement): HTMLElement | null {
    return root.querySelector<HTMLElement>(`:scope > [${ItemsHostAttribute}]`);
}

function keyOf(row: Element): string {
    return row.getAttribute(ComponentKeyAttribute) ?? "";
}
