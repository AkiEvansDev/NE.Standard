// Choosing rows in an items view, a table or a tree by click or key; the tree walks its own rows, since its arrows also fold.
// How a gesture changes the chosen set is `row-selection.ts`'s.

import { NoRowOpenAttribute, NoRowSelectAttribute, SelectedKeyAttribute, SelectedKeysAttribute, SelectionAttribute, UnremovableAttribute } from "../addressing/dom-attributes";
import { observeComponents } from "./dom-mutations";
import { ownControlOf } from "./own-control";
import { ownDescendants } from "./own-descendants";
import { isRovingKey } from "./roving-focus";
import { isInert, isItemDisabled } from "./interactive-state";
import type { RowAxis } from "./row-cursor";
import { dispatchRowEvent, focusedRow, resolveRowTarget, rowKeyTarget, setRowFocus } from "./row-cursor";
import {
    chooseRow, choosesOnEnter, ensureAnchor, gestureOf, keyGestureOf, markSelectedRows, PlainGesture, selectedRows, SelectionRootSelector as RootSelector,
    SelectionRowSelector as ItemSelector, setAnchor
} from "./row-selection";

// The two whose keyboard is this engine's; the tree's is its own.
const KeyboardRootSelector = ".ui-items-view, .ui-table";

// The keys besides the arrows this engine answers; any other passes without the rows being read.
const ActionKeys = new Set([" ", "Enter", "Delete"]);

export type ItemsSelectionEngineOptions = {
    readonly root?: ParentNode;
};

export class ItemsSelectionEngine {
    private readonly root: ParentNode;

    public constructor(options: ItemsSelectionEngineOptions = {}) {
        this.root = options.root ?? document;

        this.applyAll(this.root.querySelectorAll<HTMLElement>(`:is(${RootSelector})[${SelectionAttribute}]`));

        this.root.addEventListener("click", domEvent => this.handleClick(domEvent), true);
        this.root.addEventListener("dblclick", domEvent => this.handleDoubleClick(domEvent), true);
        this.root.addEventListener("keydown", domEvent => this.handleKeyDown(domEvent), true);

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

    /** Marks the chosen rows from whichever keys the mode reads; the root is a tab stop from the renderer, whatever the mode. */
    private apply(root: HTMLElement): void {
        markSelectedRows(root, this.ownItems(root));
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
        if (!(domEvent instanceof KeyboardEvent) || domEvent.defaultPrevented || !(domEvent.target instanceof Element))
            return;

        // The nearest host of any kind, so a tree in a list's row keeps its arrows; a key in a row's control or the host's chrome is theirs.
        const found = rowKeyTarget(domEvent.target);

        if (found === null || (found.row !== null && ownControlOf(domEvent.target, found.row) !== null))
            return;

        const { root } = found;

        if (!root.matches(KeyboardRootSelector) || isInert(root))
            return;

        const axis = axisOf(root);

        if (!ActionKeys.has(domEvent.key) && !isRovingKey(domEvent.key, axis === "grid" ? "both" : axis))
            return;

        const rows = this.ownItems(root);
        const current = focusedRow(rows);
        const next = resolveRowTarget(domEvent.key, rows, current, axis);

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

        if (current === null || isItemDisabled(current))
            return;

        switch (domEvent.key) {
            case " ":
                // Space toggles the row under the cursor and leaves the rest as they are.
                if (!chooseRow(root, rows, current, { shift: false, ctrl: true }))
                    return;
                break;
            case "Enter":
                // The keyboard's click and double click; a chosen group under the cursor stands, since Delete reads that same group.
                if (choosesOnEnter(root) && !selectedRows(rows).includes(current))
                    chooseRow(root, rows, current, PlainGesture);

                dispatchRowEvent(current, "open");
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

    private ownItems(root: HTMLElement): HTMLElement[] {
        return ownDescendants(root, ItemSelector, RootSelector);
    }
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
