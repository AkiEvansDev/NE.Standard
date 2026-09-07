// Choosing rows in an items view, a table or a tree: a click marks the row and sends the key back, and a pushed key marks the rows the
// same way. For an items view and a table the keyboard is here too — the arrows move the keyboard's row, Space chooses, Enter
// opens, Delete removes; a tree walks its own rows, since its arrows fold as well as move.

import {
    BindSelectedKeyAttribute, ComponentKeyAttribute, ItemsHostAttribute, SelectedAttribute, SelectedKeyAttribute, SelectedKeysAttribute, SelectionAttribute,
    UnremovableAttribute, UnselectableAttribute
} from "../addressing/dom-attributes";
import { observeComponents } from "./dom-mutations";
import { ownControlOf } from "./own-control";
import { ownDescendants } from "./own-descendants";
import { dispatchRowEvent, focusedRow, isRowDisabled, resolveRowTarget, setRowFocus } from "./row-cursor";
import { writeSelectedKey } from "./selected-key";

// The three hosts with rows to choose; a root's rows are its own shape's, so a table in an items view's row chooses nothing outside itself.
const RootSelector = ".ui-items-view, .ui-table, .ui-tree";
const ItemSelector = ".ui-items-view__item, .ui-table__row, .ui-tree__row";

// The two whose keyboard is this engine's; the tree's is its own.
const KeyboardRootSelector = ".ui-items-view, .ui-table";

const SelectedKeysBindingAttribute = "data-ui-bind-selected-keys";

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
        const keys = this.readKeys(root);

        for (const item of this.ownItems(root))
            item.toggleAttribute(SelectedAttribute, keys.has(item.getAttribute(ComponentKeyAttribute) ?? ""));

        const mode = root.getAttribute(SelectionAttribute);

        if (mode === "one" || mode === "many")
            root.tabIndex = 0;
    }

    private readKeys(root: HTMLElement): Set<string> {
        switch (root.getAttribute(SelectionAttribute)) {
            case "one": {
                const key = root.getAttribute(SelectedKeyAttribute);

                return new Set(key === null || key.length === 0 ? [] : [key]);
            }
            case "many":
                return new Set(this.readKeyList(this.hostOf(root)));
            default:
                return new Set();
        }
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

        if (resolved === null)
            return;

        const { root, item } = resolved;

        // The keyboard's row follows the pointer, in the tree as well — its own engine moves the mark only for what it folds.
        setRowFocus(root, this.ownItems(root), item);

        // A row that refuses to be chosen leaves the click to whatever else the row does.
        if (item.hasAttribute(UnselectableAttribute))
            return;

        if (this.choose(root, item))
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

            // With one row to choose, a move chooses it too, as a file list does.
            if (root.getAttribute(SelectionAttribute) === "one" && !next.hasAttribute(UnselectableAttribute))
                this.selectOne(root, next.getAttribute(ComponentKeyAttribute) ?? "");

            return;
        }

        if (current === null || isRowDisabled(current))
            return;

        switch (domEvent.key) {
            case " ":
                if (current.hasAttribute(UnselectableAttribute) || !this.choose(root, current))
                    return;
                break;
            case "Enter":
                dispatchRowEvent(current, "open");
                break;
            case "Delete":
                // A row that cannot be removed raises nothing; whether one that can is removed is the controller's answer.
                if (current.hasAttribute(UnremovableAttribute))
                    return;

                dispatchRowEvent(current, "remove");
                break;
            default:
                return;
        }

        domEvent.preventDefault();
    }

    /** Chooses the row the way the mode says; answers false when the host chooses nothing. */
    private choose(root: HTMLElement, item: HTMLElement): boolean {
        const key = item.getAttribute(ComponentKeyAttribute);

        if (key === null || key.length === 0)
            return false;

        switch (root.getAttribute(SelectionAttribute)) {
            case "one":
                this.selectOne(root, key);
                return true;
            case "many":
                this.toggleOne(root, key);
                return true;
            default:
                return false;
        }
    }

    private selectOne(root: HTMLElement, key: string): void {
        writeSelectedKey(root, key, { attribute: SelectedKeyAttribute, bindingAttribute: BindSelectedKeyAttribute, apply: target => this.apply(target) });
    }

    /** Toggles one key in the host's list and sends the list back. */
    private toggleOne(root: HTMLElement, key: string): void {
        const host = this.hostOf(root);

        if (host === null)
            return;

        const keys = this.readKeyList(host);
        const index = keys.indexOf(key);

        if (index >= 0)
            keys.splice(index, 1);
        else
            keys.push(key);

        host.setAttribute(SelectedKeysAttribute, JSON.stringify(keys));
        this.apply(root);

        if (host.hasAttribute(SelectedKeysBindingAttribute))
            host.dispatchEvent(new Event("change", { bubbles: true }));
    }

    private readKeyList(host: HTMLElement | null): string[] {
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

    private hostOf(root: HTMLElement): HTMLElement | null {
        return root.querySelector<HTMLElement>(`:scope > [${ItemsHostAttribute}]`);
    }

    private ownItems(root: HTMLElement): HTMLElement[] {
        return ownDescendants(root, ItemSelector, RootSelector);
    }
}
