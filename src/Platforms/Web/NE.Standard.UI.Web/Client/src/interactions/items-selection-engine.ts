// Choosing rows in an items view, a table or a tree by click or key; the tree walks its own rows, since its arrows also fold.
// How a gesture changes the chosen set is `row-selection.ts`'s.

// `.ts` on the value imports: `node --test` runs this module directly.
import {
    ItemsHostAttribute, NoRowOpenAttribute, NoRowSelectAttribute, SelectedKeyAttribute, SelectedKeysAttribute, SelectionAttribute, TableScrollClass, UnremovableAttribute
} from "../addressing/dom-attributes.ts";
import { observeComponents } from "./dom-mutations.ts";
import { ownControlOf, ownPressControlsOf, soleControlOf } from "./own-control.ts";
import { ownDescendants } from "./own-descendants.ts";
import { isInert, isItemDisabled } from "./interactive-state.ts";
import type { RowAxis } from "./row-cursor.ts";
import { dispatchRowEvent, focusedRow, isRowKey, litRow, resolveRowTarget, RowPressEventName, rowKeyTarget, setRowFocus } from "./row-cursor.ts";
import {
    chooseRow, choosesOnEnter, ensureAnchor, gestureOf, KeyboardRowsRootSelector as KeyboardRootSelector, keyGestureOf, markSelectedRows, PlainGesture,
    selectedRows, SelectionRootSelector as RootSelector, SelectionRowSelector as ItemSelector, setAnchor
} from "./row-selection.ts";
import { applyHeaderStops, enterHeader, handleHeaderKey, headerTableOf } from "./table-header-group.ts";

// The keys besides the arrows this engine answers; any other passes without the rows being read.
const ActionKeys = new Set([" ", "Enter", "Delete"]);

const TableRootSelector = ".ui-table";

// A host's own boxes: its rows' host and a table's scrolling box, either of which may be the element that scrolls.
const HostBoxSelector = `:scope > [${ItemsHostAttribute}], :scope > .${TableScrollClass}, :scope > .${TableScrollClass} > [${ItemsHostAttribute}]`;

export type ItemsSelectionEngineOptions = {
    readonly root?: ParentNode;
};

export class ItemsSelectionEngine {
    private readonly root: ParentNode;

    public constructor(options: ItemsSelectionEngineOptions = {}) {
        this.root = options.root ?? document;

        this.applyAll(this.root.querySelectorAll<HTMLElement>(RootSelector));

        this.root.addEventListener("click", domEvent => this.handleClick(domEvent), true);
        this.root.addEventListener("dblclick", domEvent => this.handleDoubleClick(domEvent), true);
        this.root.addEventListener("keydown", domEvent => this.handleKeyDown(domEvent), true);
        this.root.addEventListener("focusin", domEvent => this.handleFocusIn(domEvent));

        // A pushed key, a re-rendered row and a switched mode all land as mutations with the same answer.
        observeComponents(
            this.root,
            RootSelector,
            { childList: true, attributeFilter: [SelectionAttribute, SelectedKeyAttribute, SelectedKeysAttribute] },
            roots => this.applyAll(roots)
        );
    }

    private applyAll(roots: Iterable<HTMLElement>): void {
        for (const root of roots)
            this.apply(root);
    }

    /**
     * Marks the chosen rows from whichever keys the mode reads; the root is a tab stop from the renderer, whatever the mode, and the
     * host's one. A row that is one control (a tile that is a button) is pressed through the cursor, and a part of a row that answers a
     * press itself (a grid's chevron or checkbox) is reached by the row's keys, so neither is a stop of its own; a table's header is
     * reached from its rows.
     */
    private apply(root: HTMLElement): void {
        const rows = this.ownItems(root);

        markSelectedRows(root, rows);

        // The browser makes a scrolling box with no stop inside it a stop of its own.
        for (const box of root.querySelectorAll<HTMLElement>(HostBoxSelector))
            leaveTabOrder(box);

        if (!root.matches(KeyboardRootSelector))
            return;

        if (root.matches(TableRootSelector))
            applyHeaderStops(root);

        for (const row of rows) {
            const control = soleControlOf(row);

            if (control !== null)
                leaveTabOrder(control);

            for (const own of ownPressControlsOf(row))
                leaveTabOrder(own);
        }
    }

    private handleClick(domEvent: Event): void {
        const resolved = this.resolveRow(domEvent, RootSelector);

        if (resolved === null || !(domEvent instanceof MouseEvent))
            return;

        const { root, item } = resolved;
        const rows = this.ownItems(root);

        // The cursor follows the pointer so the arrows carry on from the clicked row; the host takes the focus, as a file manager's list does.
        setRowFocus(root, rows, item);
        root.focus({ preventScroll: true });

        // A host choosing by a control of its own (a grid's checkboxes) leaves the click; its keyboard's Shift ranges from the clicked row.
        if (root.hasAttribute(NoRowSelectAttribute)) {
            setAnchor(root, item);
            return;
        }

        // A row that refuses to be chosen leaves the click to whatever else the row does.
        if (chooseRow(root, rows, item, gestureOf(domEvent)))
            domEvent.preventDefault();
    }

    /** The row a press landed in and the host that owns it: a list nested in another's row must not choose the outer one. */
    private resolveRow(domEvent: Event, rootSelector: string): { readonly root: HTMLElement; readonly item: HTMLElement } | null {
        if (!(domEvent.target instanceof Element))
            return null;

        const item = domEvent.target.closest<HTMLElement>(ItemSelector);
        const root = item?.closest<HTMLElement>(RootSelector) ?? null;

        if (item === null || root === null || item.closest(RootSelector) !== root || !root.matches(rootSelector) || isInert(root))
            return null;

        return ownControlOf(domEvent.target, item) === null && !isItemDisabled(item) ? { root, item } : null;
    }

    /** Opens a row double-clicked anywhere but on its own controls, as Enter does, unless the cell edits on a double click. */
    private handleDoubleClick(domEvent: Event): void {
        const resolved = this.resolveRow(domEvent, KeyboardRootSelector);

        if (resolved === null || (domEvent.target instanceof Element && resolved.item.contains(domEvent.target.closest(`[${NoRowOpenAttribute}]`))))
            return;

        domEvent.preventDefault();
        dispatchRowEvent(resolved.item, "open");
    }

    private handleKeyDown(domEvent: Event): void {
        // Alt with an arrow moves the row itself where the host's rows move (items-reorder-engine.ts), never the cursor.
        if (!(domEvent instanceof KeyboardEvent) || domEvent.defaultPrevented || domEvent.altKey || !(domEvent.target instanceof Element))
            return;

        // A table's header is a group of its own, walked by its own keys and left by Down for the rows.
        const header = headerTableOf(domEvent.target);

        if (header !== null && !isInert(header)) {
            if (handleHeaderKey(domEvent, header, () => this.enterRows(header)))
                domEvent.preventDefault();

            return;
        }

        // The nearest host of any kind, so a tree in a list's row keeps its arrows; a key in a row's control or the host's chrome is theirs.
        const found = rowKeyTarget(domEvent.target);

        if (found === null || (found.row !== null && ownControlOf(domEvent.target, found.row) !== null))
            return;

        const { root } = found;

        if (!root.matches(KeyboardRootSelector) || isInert(root))
            return;

        const axis = axisOf(root);

        if (!ActionKeys.has(domEvent.key) && !isRowKey(domEvent.key, axis))
            return;

        const rows = this.ownItems(root);
        const current = focusedRow(rows);
        const next = resolveRowTarget(domEvent.key, rows, litRow(rows), axis);

        if (next !== null) {
            domEvent.preventDefault();
            setRowFocus(root, rows, next);

            // A single-choice move chooses, like a file list; with many, Shift extends from the anchor, or where the cursor stood.
            if (root.getAttribute(SelectionAttribute) === "one" || domEvent.shiftKey) {
                if (domEvent.shiftKey)
                    ensureAnchor(root, current);

                chooseRow(root, rows, next, keyGestureOf(root, domEvent));
            }

            return;
        }

        // Up past the first row, or in a table with no row to stand on, goes to its header, as the grid pattern's Up from a top cell does.
        if (domEvent.key === "ArrowUp" && !domEvent.shiftKey && !domEvent.ctrlKey && !domEvent.metaKey && root.matches(TableRootSelector) && enterHeader(root)) {
            domEvent.preventDefault();
            return;
        }

        if (current === null || isItemDisabled(current))
            return;

        // A row that is one control is pressed through the cursor, as a listbox of buttons is.
        const control = soleControlOf(current);

        switch (domEvent.key) {
            case " ":
                // Space toggles the row under the cursor and leaves the rest as they are; a host that chooses nothing presses it.
                if (!chooseRow(root, rows, current, { shift: false, ctrl: true }))
                    pressRow(current, control);
                break;
            case "Enter":
                enterRow(root, rows, current, control);
                break;
            case "Delete": {
                // The chosen group goes together; the controller decides each removal, and with nothing removable the key is the page's.
                const removable = removableRows(rows, current);

                if (removable.length === 0)
                    return;

                for (const row of removable)
                    dispatchRowEvent(row, "remove");

                break;
            }
            default:
                return;
        }

        domEvent.preventDefault();
    }

    /** Down from a table's header: the keyboard back on the table, on the row it stood on, else the first, as an arrow puts it there. */
    private enterRows(table: HTMLElement): void {
        const rows = this.ownItems(table);
        const row = litRow(rows) ?? resolveRowTarget("ArrowDown", rows, null, "vertical");

        table.focus({ preventScroll: true });

        if (row === null)
            return;

        setRowFocus(table, rows, row);

        if (table.getAttribute(SelectionAttribute) === "one")
            chooseRow(table, rows, row, PlainGesture);
    }

    /** A press on a host's own box, past its rows, focuses the box: the keyboard goes to the root, where the rows' keys are read. */
    private handleFocusIn(domEvent: Event): void {
        const box = domEvent.target instanceof HTMLElement && domEvent.target.matches(`[${ItemsHostAttribute}], .${TableScrollClass}`) ? domEvent.target : null;
        const root = box?.closest<HTMLElement>(RootSelector) ?? null;

        if (box !== null && root !== null && [...root.querySelectorAll(HostBoxSelector)].includes(box))
            root.focus({ preventScroll: true });
    }

    private ownItems(root: HTMLElement): HTMLElement[] {
        return ownDescendants(root, ItemSelector, RootSelector);
    }
}

/** Takes an element out of the Tab order, focusable still; written only when it changes, so an observer is not woken for nothing. */
function leaveTabOrder(element: HTMLElement): void {
    if (element.getAttribute("tabindex") !== "-1")
        element.setAttribute("tabindex", "-1");
}

/**
 * Enter on the cursor's row of any host, a tree's too: the keyboard's click and double click. It chooses where the host chooses on
 * Enter — a chosen group under the cursor stands, since Delete reads that same group —, presses the row, and opens it unless the press
 * was the row's one control's.
 */
export function enterRow(root: HTMLElement, rows: readonly HTMLElement[], row: HTMLElement, control: HTMLElement | null): void {
    if (choosesOnEnter(root) && !selectedRows(rows).includes(row))
        chooseRow(root, rows, row, PlainGesture);

    pressRow(row, control);

    if (control === null)
        dispatchRowEvent(row, "open");
}

/**
 * The row's click from the keyboard: its one control pressed, else the row's own click command raised — through an event only the
 * event pipeline hears, so no engine that reads a pointer's click (a detail's toggle, a popup's dismissal) takes it for one.
 */
export function pressRow(row: HTMLElement, control: HTMLElement | null): void {
    if (control === null)
        dispatchRowEvent(row, RowPressEventName);
    else
        control.click();
}

/** How the host's rows lie for the arrows: a wrap in lines whatever its orientation, a horizontal list both ways, the rest up and down. */
function axisOf(root: HTMLElement): RowAxis {
    if (root.matches(".ui-items-view--wrap"))
        return "grid";

    return root.matches(".ui-orientation--horizontal") ? "both" : "vertical";
}

/** The rows a Delete on `current` removes: every chosen row that allows it when `current` is among them, else `current` alone. */
export function removableRows(rows: readonly HTMLElement[], current: HTMLElement): HTMLElement[] {
    const chosen = selectedRows(rows);
    const group = chosen.includes(current) ? chosen : [current];

    // A row chosen before it was disabled stays chosen, but a disabled row is never acted on.
    return group.filter(row => !row.hasAttribute(UnremovableAttribute) && !isItemDisabled(row));
}
