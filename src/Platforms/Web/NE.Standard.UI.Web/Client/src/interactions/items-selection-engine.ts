// Choosing rows in an items view, a table or a tree: a click marks the row and sends the key back, and a pushed key marks the rows the
// same way. For an items view and a table the keyboard is here too — the arrows move the keyboard's row, Space and Enter choose,
// Enter opens, Delete removes; a tree walks its own rows, since its arrows fold as well as move. How a gesture changes the chosen
// set is `row-selection.ts`, which the tree shares.

import { SelectedKeyAttribute, SelectedKeysAttribute, SelectionAttribute, UnremovableAttribute } from "../addressing/dom-attributes";
import { observeComponents } from "./dom-mutations";
import { ownControlOf } from "./own-control";
import { ownDescendants } from "./own-descendants";
import { dispatchRowEvent, focusedRow, isRowDisabled, resolveRowTarget, setRowFocus } from "./row-cursor";
import { chooseRow, ensureAnchor, gestureOf, markSelectedRows, PlainGesture, selectedRows } from "./row-selection";

// The three hosts with rows to choose; a root's rows are its own shape's, so a table in an items view's row chooses nothing outside itself.
const RootSelector = ".ui-items-view, .ui-table, .ui-tree";
const ItemSelector = ".ui-items-view__item, .ui-table__row, .ui-tree__row";

// The two whose keyboard is this engine's; the tree's is its own.
const KeyboardRootSelector = ".ui-items-view, .ui-table";

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

    /** Marks the chosen rows from whichever keys the mode reads; a host with rows to choose takes the focus, so its keys can reach them. */
    private apply(root: HTMLElement): void {
        markSelectedRows(root, this.ownItems(root));

        const mode = root.getAttribute(SelectionAttribute);

        if (mode === "one" || mode === "many")
            root.tabIndex = 0;
    }

    /** The row and its host a press landed in, scoped to the host that owns the row: a list nested in another's row must not choose the outer one. */
    private resolveRow(domEvent: Event, rootSelector: string): { readonly root: HTMLElement; readonly item: HTMLElement } | null {
        if (!(domEvent.target instanceof Element))
            return null;

        const item = domEvent.target.closest<HTMLElement>(ItemSelector);
        const root = item?.closest<HTMLElement>(RootSelector) ?? null;

        if (item === null || root === null || item.closest(RootSelector) !== root || !root.matches(rootSelector) || root.matches(".ui-disabled"))
            return null;

        return ownControlOf(domEvent.target, item) === null && !isRowDisabled(item) ? { root, item } : null;
    }

    private handleClick(domEvent: Event): void {
        const resolved = this.resolveRow(domEvent, RootSelector);

        if (resolved === null || !(domEvent instanceof MouseEvent))
            return;

        const { root, item } = resolved;
        const rows = this.ownItems(root);

        // The keyboard's row follows the pointer, in the tree as well — its own engine moves the mark only for what it folds. The
        // host takes the focus with it, as a file manager's list does, so the arrows carry on from the row that was clicked; a host
        // that chooses nothing is not focusable, so nothing is taken from the page there.
        setRowFocus(root, rows, item);
        root.focus({ preventScroll: true });

        // A row that refuses to be chosen leaves the click to whatever else the row does.
        if (chooseRow(root, rows, item, gestureOf(domEvent)))
            domEvent.preventDefault();
    }

    /** A double click anywhere on the row but its own controls opens it, as Enter does. */
    private handleDoubleClick(domEvent: Event): void {
        const resolved = this.resolveRow(domEvent, KeyboardRootSelector);

        if (resolved === null)
            return;

        domEvent.preventDefault();
        dispatchRowEvent(resolved.item, "open");
    }

    private handleKeyDown(domEvent: Event): void {
        if (!(domEvent instanceof KeyboardEvent) || domEvent.defaultPrevented || !(domEvent.target instanceof Element))
            return;

        // A key typed into a control of a row's own is that control's.
        const item = domEvent.target.closest(ItemSelector);

        if (item !== null && ownControlOf(domEvent.target, item) !== null)
            return;

        const root = domEvent.target.closest<HTMLElement>(KeyboardRootSelector);

        if (root === null || root.matches(".ui-disabled"))
            return;

        const rows = this.ownItems(root);
        const current = focusedRow(rows);
        // A horizontal list walks with Left and Right as well as Up and Down; a table only up and down.
        const next = resolveRowTarget(domEvent.key, rows, current, root.matches(".ui-orientation--horizontal") ? "both" : "vertical");

        if (next !== null) {
            domEvent.preventDefault();
            setRowFocus(root, rows, next);

            // With one row to choose, a move chooses it too, as a file list does; with many, a move under Shift extends the range
            // from where the cursor stood — which is the anchor when no click has set one.
            if (root.getAttribute(SelectionAttribute) === "one" || domEvent.shiftKey) {
                if (domEvent.shiftKey)
                    ensureAnchor(root, current);

                chooseRow(root, rows, next, gestureOf(domEvent));
            }

            return;
        }

        if (current === null || isRowDisabled(current))
            return;

        switch (domEvent.key) {
            case " ":
                // Space toggles the row under the cursor and leaves the rest as they are.
                if (!chooseRow(root, rows, current, { shift: false, ctrl: true }))
                    return;
                break;
            case "Enter":
                // Enter is the keyboard's click: it chooses the row as a click does, and opens it as a double click does. A cursor
                // already inside a chosen group leaves the group standing, since Delete reads that same group.
                if (!selectedRows(rows).includes(current))
                    chooseRow(root, rows, current, PlainGesture);

                dispatchRowEvent(current, "open");
                break;
            case "Delete": {
                // The chosen rows go together when the cursor is on one of them; a row that cannot be removed raises nothing, and
                // whether one that can is removed is the controller's answer. With nothing to remove the key is the page's again.
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

/** The rows a Delete on `current` removes: every chosen row that allows it when `current` is among them, else `current` alone. */
export function removableRows(rows: readonly HTMLElement[], current: HTMLElement): HTMLElement[] {
    const chosen = selectedRows(rows);
    const group = chosen.includes(current) ? chosen : [current];

    return group.filter(row => !row.hasAttribute(UnremovableAttribute));
}
