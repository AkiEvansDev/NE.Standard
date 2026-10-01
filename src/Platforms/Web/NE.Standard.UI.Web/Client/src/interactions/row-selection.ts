// Which rows of a host are chosen and how a gesture changes that, by the file manager's rules (Ctrl adds or takes one, Shift takes
// the range to the anchor) — for the items view, the table and the tree, by click and key alike.

import {
    BindSelectedKeyAttribute, ComponentIdAttribute, ComponentKeyAttribute, HiddenClass, ItemsHostAttribute, NoRowSelectAttribute, SelectedAttribute, SelectedKeyAttribute,
    SelectedKeysAttribute, SelectionAttribute, TableRowClass, UnselectableAttribute
} from "../addressing/dom-attributes.ts";
import { isItemDisabled } from "./interactive-state.ts";
import { writeSelectedKey } from "./selected-key.ts";

const SelectedKeysBindingAttribute = "data-ui-bind-selected-keys";

// A root's rows are its own shape's, so a table in an items view's row chooses nothing outside itself.
export const SelectionRootSelector = ".ui-items-view, .ui-table, .ui-tree";
export const SelectionRowSelector = `.ui-items-view__item, .${TableRowClass}, .ui-tree__row`;

// The hosts whose rows' keyboard is items-selection-engine.ts's; the tree walks its own.
export const KeyboardRowsRootSelector = ".ui-items-view, .ui-table";

/** The modifier keys a choosing gesture carried. */
export type SelectionGesture = {
    readonly shift: boolean;
    readonly ctrl: boolean;
};

export const PlainGesture: SelectionGesture = { shift: false, ctrl: false };

// The row a Shift range is measured from, per host: the last row chosen without Shift.
const anchors = new WeakMap<HTMLElement, string>();

/** Names the Shift range's anchor when no gesture has named one yet. */
export function ensureAnchor(root: HTMLElement, row: HTMLElement | null): void {
    // A list reached by Tab has had no click to take one from, and every Shift move would range just one row.
    if (row !== null && !anchors.has(root))
        setAnchor(root, row);
}

/** Names the row a Shift range is measured from outright: where a click put the cursor on a host whose click chooses nothing. */
export function setAnchor(root: HTMLElement, row: HTMLElement): void {
    const key = rowKey(row);

    if (key.length > 0)
        anchors.set(root, key);
}

export function gestureOf(domEvent: MouseEvent | KeyboardEvent): SelectionGesture {
    return { shift: domEvent.shiftKey, ctrl: domEvent.ctrlKey || domEvent.metaKey };
}

/** The gesture a key makes on a host. */
export function keyGestureOf(root: Element, domEvent: KeyboardEvent): SelectionGesture {
    const gesture = gestureOf(domEvent);

    // Where rows are chosen by the host's own (a grid's checkboxes), Shift adds its range: the keyboard must not undo the boxes.
    return gesture.shift && root.hasAttribute(NoRowSelectAttribute) ? { shift: true, ctrl: true } : gesture;
}

/** Whether Enter chooses the row it opens: not where the rows are chosen by something of the host's own, whose choice it would replace. */
export function choosesOnEnter(root: Element): boolean {
    return !root.hasAttribute(NoRowSelectAttribute);
}

/** The box a row is drawn as: the row, or the component it wraps where the row is display: contents (a wrap's); null when not drawn. */
export function rowBox(row: HTMLElement): HTMLElement | null {
    if (row.getClientRects().length > 0)
        return row;

    const wrapped = row.querySelector<HTMLElement>(`:scope > [${ComponentIdAttribute}]`);

    return wrapped !== null && wrapped.getClientRects().length > 0 ? wrapped : null;
}

/** The keys the host's mode reads as chosen. */
function readSelectedKeys(root: HTMLElement): Set<string> {
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

/** Marks the rows the keys name, for the stylesheet and, on a host that chooses, for the reader too. */
export function markSelectedRows(root: HTMLElement, rows: readonly HTMLElement[]): void {
    const keys = readSelectedKeys(root);
    const mode = root.getAttribute(SelectionAttribute);
    // A host that chooses nothing says nothing about choosing: `aria-selected` on its rows would announce a choice it cannot make.
    const choosing = mode === "one" || mode === "many";

    for (const row of rows) {
        const selected = keys.has(rowKey(row));

        row.toggleAttribute(SelectedAttribute, selected);

        if (choosing)
            row.setAttribute("aria-selected", selected ? "true" : "false");
        else
            row.removeAttribute("aria-selected");
    }
}

/** The chosen rows among the given ones, in their order. */
export function selectedRows(rows: readonly HTMLElement[]): HTMLElement[] {
    return rows.filter(row => row.hasAttribute(SelectedAttribute));
}

/** Chooses the row the way the mode and the gesture say; answers false when the host chooses nothing or the row refuses. */
export function chooseRow(root: HTMLElement, rows: readonly HTMLElement[], row: HTMLElement, gesture: SelectionGesture): boolean {
    const key = rowKey(row);

    if (!isChoosable(row))
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
        const anchor = rows.find(candidate => rowKey(candidate) === anchors.get(root)) ?? row;
        const range = rangeBetween(rows, anchor, row).map(rowKey);

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
function writeSelectedKeys(root: HTMLElement, rows: readonly HTMLElement[], keys: readonly string[]): void {
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

/** Whether a row takes a choice at all: it has a key, and is neither disabled nor refusing to be chosen. */
function isChoosable(row: Element): boolean {
    return rowKey(row).length > 0 && !row.hasAttribute(UnselectableAttribute) && !isItemDisabled(row);
}

/** The rows from one to the other, in the host's order, that can be chosen: drawn, enabled, not refusing. */
function rangeBetween(rows: readonly HTMLElement[], from: HTMLElement, to: HTMLElement): HTMLElement[] {
    const start = rows.indexOf(from);
    const end = rows.indexOf(to);

    if (start < 0 || end < 0)
        return [to];

    return rows.slice(Math.min(start, end), Math.max(start, end) + 1).filter(row => rowBox(row) !== null && isChoosable(row));
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
export function hostOf(root: HTMLElement): HTMLElement | null {
    for (const host of root.querySelectorAll<HTMLElement>(`[${ItemsHostAttribute}]`)) {
        if (host.closest(SelectionRootSelector) === root)
            return host;
    }

    return null;
}

/** The key a row of a list, a table or a tree is known by; empty for a row that carries none. */
export function rowKey(row: Element): string {
    return row.getAttribute(ComponentKeyAttribute) ?? "";
}

/** The chosen rows as a package reaches them: the host owns the list and its binding; these only ask it to change. */
export type ItemSelection = {
    isSelected(row: Element): boolean;
    /** Adds the row to the chosen ones or takes it out, leaving the rest alone. */
    toggle(row: Element): void;
    /** Takes or clears every row named in one write, leaving the rest; a row a filter hides is not taken. */
    setSelected(root: Element, rows: Iterable<Element>, selected: boolean): void;
    /** The same by key, for rows a virtualized host has not drawn: every key named is taken or cleared in one write. */
    setSelectedKeys(root: Element, keys: Iterable<string>, selected: boolean): void;
};

export const itemSelection: ItemSelection = {
    isSelected: row => row.hasAttribute(SelectedAttribute),
    toggle: toggleSelectedRow,
    setSelected: setRowsSelected,
    setSelectedKeys: setKeysSelected
};

/** Adds the row to its host's chosen ones or takes it out, leaving the rest — the gesture a checkbox makes. */
function toggleSelectedRow(row: Element): void {
    const host = row.closest<HTMLElement>(SelectionRootSelector);

    if (host !== null && row instanceof HTMLElement)
        chooseRow(host, selectableRows(host), row, { shift: false, ctrl: true });
}

function setRowsSelected(root: Element, rows: Iterable<Element>, selected: boolean): void {
    const keys: string[] = [];

    for (const row of rows) {
        // A row the host's filter hides is not one the viewer can see being chosen, whatever gesture named it (a select-all).
        if (!row.classList.contains(HiddenClass))
            keys.push(rowKey(row));
    }

    setKeysSelected(root, keys, selected);
}

function setKeysSelected(root: Element, keys: Iterable<string>, selected: boolean): void {
    if (!(root instanceof HTMLElement))
        return;

    const rows = selectableRows(root);
    // A drawn row that refuses a choice keeps what it was; a key with no row drawn (a virtualized host's) is taken as named.
    const refusing = new Set(rows.filter(row => !isChoosable(row)).map(rowKey));
    const named = new Set<string>();

    for (const key of keys) {
        if (key.length > 0 && !refusing.has(key))
            named.add(key);
    }

    const kept = [...readSelectedKeys(root)].filter(key => !named.has(key));

    writeSelectedKeys(root, rows, selected ? [...kept, ...named] : kept);
}

/** The host's own rows, a nested list's left to it. */
function selectableRows(root: HTMLElement): HTMLElement[] {
    return [...root.querySelectorAll<HTMLElement>(SelectionRowSelector)].filter(row => row.closest(SelectionRootSelector) === root);
}
