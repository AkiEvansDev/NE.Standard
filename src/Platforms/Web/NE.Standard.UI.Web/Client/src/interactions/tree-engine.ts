// A tree's rows are a flat list in walking order; this derives each row's depth and fold from the node above it, keeps the
// viewer's fold in the browser, walks the rows with the keyboard, opens a node, asks for children it does not have yet, lays
// the rename field over a title, and reports a drag from one node onto another — or of every chosen node at once.

import {
    ComponentKeyAttribute, ItemsHostAttribute, SelectedAttribute, SelectionAttribute, TreeChildrenAttribute, TreeDraggableAttribute, TreeDropTargetAttribute,
    TreeExpandedAttribute, TreeLoadingAttribute, TreeParentAttribute, TreeRenamableAttribute, TreeRenameOnDoubleClickAttribute, TreeTitleAttribute,
    TreeUnremovableAttribute, UndraggableAttribute, UnrenamableAttribute, UnselectableAttribute
} from "../addressing/dom-attributes";
import { EffectRegistry } from "../effects/effect-registry";
import { getIdValue, RenameNodeClientEffect } from "../metadata/metadata-index";
import { clientStrings } from "../runtime/client-strings";
import { logWarn } from "../runtime/logger";
import { ClientStore } from "../state/client-store";
import { observeComponents } from "./dom-mutations";
import { clearDragMarks, markDragStart } from "./drag-marks";
import { openInlineRename } from "./inline-rename";
import { removableRows } from "./items-selection-engine";
import { ownControlOf } from "./own-control";
import { focusedRow, isRowDisabled, resolveRowTarget, setRowFocus } from "./row-cursor";
import type { SelectionGesture } from "./row-selection";
import { chooseRow, ensureAnchor, gestureOf, PlainGesture, selectedRows } from "./row-selection";

const RootClass = "ui-tree";
const RowClass = "ui-tree__row";
const FoldedClass = "ui-tree__row--folded";
const DraggingClass = "ui-tree__row--dragging";
const LoadingClass = "ui-tree__loading";
const LoadingRingClass = "ui-tree__loading-ring";
const NodeClass = "ui-tree-node";
const TextClass = "ui-tree-node__text";
const ToggleClass = "ui-tree-node__toggle";
const RenameClass = "ui-tree-node__rename";
const TitleSelector = ".ui-text__title";
const DropAttribute = "data-ui-tree-drop";
const DepthVariable = "--ui-tree-depth";
const ExpandedSlot = "expanded";
// A folder a drag hovers over for this long opens, so a node can be dropped deeper without letting go.
const SpringOpenMilliseconds = 600;

/** The viewer's fold by node key: true unfolded, false folded; a node not in it keeps its authored start. */
type StoredFold = Record<string, boolean>;

type Placement = {
    readonly row: HTMLElement;
    readonly depth: number;
    readonly shown: boolean;
    readonly expanded: boolean;
};

export type TreeEngineOptions = {
    readonly root?: ParentNode;
    readonly effects?: EffectRegistry;
};

export class TreeEngine {
    private readonly root: ParentNode;
    private readonly store = new ClientStore();

    // The fold as this page has it, per tree: read from the store on first sight and written back on every change, so a tree
    // with no name to store under still folds for as long as the page lives.
    private readonly folds = new WeakMap<Element, StoredFold>();

    // A node asked for its children once per unfold; folding it again lets the next unfold ask again.
    private readonly requested = new WeakSet<Element>();

    // The folder a drag is waiting over, and the wait.
    private springTarget: HTMLElement | null = null;
    private springTimer = 0;

    public constructor(options: TreeEngineOptions = {}) {
        this.root = options.root ?? document;

        this.root.addEventListener("click", domEvent => this.handleClick(domEvent), true);
        this.root.addEventListener("dblclick", domEvent => this.handleDoubleClick(domEvent), true);
        this.root.addEventListener("keydown", domEvent => this.handleKeyDown(domEvent), true);
        this.root.addEventListener("dragstart", domEvent => this.handleDragStart(domEvent), true);
        this.root.addEventListener("dragover", domEvent => this.handleDragOver(domEvent), true);
        this.root.addEventListener("dragleave", domEvent => this.handleDragLeave(domEvent), true);
        this.root.addEventListener("drop", domEvent => this.handleDrop(domEvent), true);
        this.root.addEventListener("dragend", domEvent => this.handleDragEnd(domEvent), true);

        // A controller may ask for the field F2 opens, from a menu entry of its own.
        options.effects?.register("RenameNode", context => {
            const effect = context.effect as RenameNodeClientEffect;
            const target = effect.target;

            if (target === undefined || target.id === undefined || typeof effect.key !== "string") {
                logWarn("rename node effect carries no target or key.", effect);
                return;
            }

            const tree = context.dom.findComponent(getIdValue(target.id), target.dynamicParameters ?? []);
            const row = tree === null ? null : this.rowsOf(tree as HTMLElement).find(candidate => keyOf(candidate) === effect.key) ?? null;

            if (row === null) {
                logWarn("rename node effect names no node on the page.", effect);
                return;
            }

            this.startRename(row);
        });

        this.layoutAll(this.root.querySelectorAll<HTMLElement>(`.${RootClass}`));

        // A row added or removed, a node's parent or its children flag patched, the tree's own switches: the walk runs again.
        observeComponents(
            this.root,
            `.${RootClass}`,
            { childList: true, attributeFilter: [TreeParentAttribute, TreeChildrenAttribute, TreeExpandedAttribute, TreeDraggableAttribute] },
            trees => this.layoutAll(trees)
        );
    }

    private layoutAll(trees: Iterable<HTMLElement>): void {
        for (const tree of trees)
            this.layout(tree);
    }

    /** Derives every row's depth and fold from the rows above it, the viewer's fold over the authored one. */
    private layout(tree: HTMLElement): void {
        const stored = this.foldOf(tree);
        const rows = this.rowsOf(tree);
        const draggable = tree.hasAttribute(TreeDraggableAttribute);
        const children = new Set<string>();

        for (const row of rows) {
            const parent = nodeOf(row)?.getAttribute(TreeParentAttribute);

            if (parent !== null && parent !== undefined && parent.length > 0)
                children.add(parent);
        }

        const placed = new Map<string, Placement>();

        for (const row of rows) {
            const key = keyOf(row);
            const node = nodeOf(row);
            const parentKey = node?.getAttribute(TreeParentAttribute) ?? "";
            const parent = parentKey.length > 0 ? placed.get(parentKey) : undefined;
            const depth = parent === undefined ? 0 : parent.depth + 1;
            const shown = parent === undefined ? true : parent.shown && parent.expanded;
            const declared = node?.hasAttribute(TreeChildrenAttribute) === true;
            const hasChildren = declared || children.has(key);
            const expanded = hasChildren && (stored[key] ?? node?.hasAttribute(TreeExpandedAttribute) === true);

            row.style.setProperty(DepthVariable, String(depth));
            row.setAttribute("aria-level", String(depth + 1));
            row.classList.toggle(FoldedClass, !shown);
            row.draggable = draggable && !row.hasAttribute(UndraggableAttribute);

            if (hasChildren)
                row.setAttribute("aria-expanded", expanded ? "true" : "false");
            else
                row.removeAttribute("aria-expanded");

            // The children arrived, or the node stopped claiming any: either way the wait is over.
            if (children.has(key) || !declared)
                row.removeAttribute(TreeLoadingAttribute);

            // Unfolded, claiming children, holding none: the controller is asked, once per unfold.
            if (expanded && shown && declared && !children.has(key) && !this.requested.has(row)) {
                this.requested.add(row);
                row.setAttribute(TreeLoadingAttribute, "");
                row.dispatchEvent(new Event("unfold", { bubbles: true }));
            }

            if (!expanded)
                this.requested.delete(row);

            this.placeLoadingRow(row, depth + 1, row.hasAttribute(TreeLoadingAttribute), shown && expanded);
            placed.set(key, { row, depth, shown, expanded });
        }
    }

    /** One row of waiting under a node that asked for its children, in the children's place; gone the moment they arrive. */
    private placeLoadingRow(row: HTMLElement, depth: number, loading: boolean, shown: boolean): void {
        const next = row.nextElementSibling;
        const existing = next instanceof HTMLElement && next.classList.contains(LoadingClass) ? next : null;

        if (!loading) {
            existing?.remove();
            return;
        }

        const placeholder = existing ?? createLoadingRow();

        placeholder.style.setProperty(DepthVariable, String(depth));
        placeholder.classList.toggle(FoldedClass, !shown);

        if (existing === null)
            row.after(placeholder);
    }

    /**
     * The chevron folds; so does the whole row of a node that refuses to be chosen, since a click on it chooses nothing. Choosing
     * is the selection engine's, which also moves the keyboard's row under the pointer.
     */
    private handleClick(domEvent: Event): void {
        const found = this.rowOfEvent(domEvent);

        if (found === null)
            return;

        const { tree, row, target } = found;
        const toggle = target.closest<HTMLElement>(`.${ToggleClass}`);

        if (toggle === null && (!row.hasAttribute(UnselectableAttribute) || ownControlOf(target, row) !== null))
            return;

        domEvent.preventDefault();
        this.setFocus(tree, row, null);
        this.toggle(tree, row);
    }

    /** A double click anywhere on the row but its own controls opens the node — or renames it, where the tree says so. */
    private handleDoubleClick(domEvent: Event): void {
        const found = this.rowOfEvent(domEvent);

        if (found === null || ownControlOf(found.target, found.row) !== null)
            return;

        const { tree, row } = found;

        domEvent.preventDefault();

        if (tree.hasAttribute(TreeRenameOnDoubleClickAttribute) && this.canRename(tree, row))
            this.startRename(row);
        else
            row.dispatchEvent(new Event("open", { bubbles: true }));
    }

    /** The row and the tree a pointer event landed in, scoped to the tree that owns the row. */
    private rowOfEvent(domEvent: Event): { readonly tree: HTMLElement; readonly row: HTMLElement; readonly target: Element } | null {
        if (!(domEvent.target instanceof Element))
            return null;

        const row = domEvent.target.closest<HTMLElement>(`.${RowClass}`);
        const tree = row?.closest<HTMLElement>(`.${RootClass}`) ?? null;

        if (row === null || tree === null || row.closest(`.${RootClass}`) !== tree || isRowDisabled(row))
            return null;

        return { tree, row, target: domEvent.target };
    }

    private handleKeyDown(domEvent: Event): void {
        // A key another engine took — an open select's arrows — is not the tree's.
        if (!(domEvent instanceof KeyboardEvent) || domEvent.defaultPrevented || domEvent.isComposing || !(domEvent.target instanceof Element))
            return;

        // The rename field's keys are its own, and so are a control's inside a row.
        const inRow = domEvent.target.closest(`.${RowClass}`);

        if (inRow !== null && ownControlOf(domEvent.target, inRow) !== null)
            return;

        const tree = domEvent.target.closest<HTMLElement>(`.${RootClass}`);

        if (tree === null || tree.matches(".ui-disabled"))
            return;

        const rows = this.rowsOf(tree);
        const current = focusedRow(rows);
        const next = resolveRowTarget(domEvent.key, rows, current, "vertical");

        if (next !== null) {
            domEvent.preventDefault();
            this.setFocus(tree, next, gestureOf(domEvent));
            return;
        }

        if (current === null || isRowDisabled(current))
            return;

        switch (domEvent.key) {
            case " ":
                // Space toggles the node under the cursor and leaves the rest as they are.
                if (!chooseRow(tree, rows, current, { shift: false, ctrl: true }))
                    return;
                break;
            case "ArrowRight":
                // A folded node unfolds; an unfolded one hands the focus to its first child.
                if (current.getAttribute("aria-expanded") === "false")
                    this.toggle(tree, current);
                else if (current.getAttribute("aria-expanded") === "true")
                    this.setFocus(tree, resolveRowTarget("ArrowDown", rows, current, "vertical"), PlainGesture);
                break;
            case "ArrowLeft":
                // An unfolded node folds; any other hands the focus to the node above it.
                if (current.getAttribute("aria-expanded") === "true")
                    this.toggle(tree, current);
                else
                    this.setFocus(tree, this.parentOf(tree, current), PlainGesture);
                break;
            case "Enter":
                // Enter is the keyboard's click: it chooses the node as a click does, and opens it as a double click does. A cursor
                // already inside a chosen group leaves the group standing, since Delete reads that same group.
                if (!selectedRows(rows).includes(current))
                    chooseRow(tree, rows, current, PlainGesture);

                current.dispatchEvent(new Event("open", { bubbles: true }));
                break;
            case "F2":
                if (!this.canRename(tree, current))
                    return;

                this.startRename(current);
                break;
            case "Delete": {
                // The chosen nodes go together when the cursor is on one of them. A node that cannot be removed raises nothing, nor
                // does a tree that removes nothing; whether one that can is removed is the controller's answer.
                if (tree.hasAttribute(TreeUnremovableAttribute))
                    return;

                const removable = removableRows(rows, current);

                if (removable.length === 0)
                    return;

                for (const row of removable)
                    row.dispatchEvent(new Event("remove", { bubbles: true }));

                break;
            }
            default:
                return;
        }

        domEvent.preventDefault();
    }

    /** The tree renames, and this node has not refused it. */
    private canRename(tree: HTMLElement, row: HTMLElement): boolean {
        return tree.hasAttribute(TreeRenamableAttribute) && !row.hasAttribute(UnrenamableAttribute);
    }

    private handleDragStart(domEvent: Event): void {
        const row = draggedRow(domEvent);
        const tree = row?.closest<HTMLElement>(`.${RootClass}`) ?? null;

        if (row === null || tree === null || !tree.hasAttribute(TreeDraggableAttribute))
            return;

        // A chosen node dragged takes the other chosen nodes with it; one that is not chosen goes alone. A node folded away is not
        // among them: the viewer cannot see it, so moving it would be a move they never asked for.
        const companions = row.hasAttribute(SelectedAttribute)
            ? selectedRows(this.rowsOf(tree)).filter(other => other !== row && other.draggable && other.getClientRects().length > 0)
            : [];

        markDragStart(domEvent, tree, row, DraggingClass, keyOf(row), companions);
    }

    /** The rows in the air, in walking order. */
    private draggingRows(tree: HTMLElement): HTMLElement[] {
        return this.rowsOf(tree).filter(row => row.classList.contains(DraggingClass));
    }

    /** Over a row that is not the dragged one or under it, or over the tree's own ground: the drop is taken and the place marked. */
    private handleDragOver(domEvent: Event): void {
        if (!(domEvent instanceof DragEvent) || !(domEvent.target instanceof Element))
            return;

        const tree = domEvent.target.closest<HTMLElement>(`.${RootClass}`);
        const dragging = tree === null ? [] : this.draggingRows(tree);
        const host = tree === null ? null : this.hostOf(tree);

        if (tree === null || dragging.length === 0 || host === null)
            return;

        const over = domEvent.target.closest<HTMLElement>(`.${RowClass}`);
        const target = over !== null && over.closest(`.${RootClass}`) === tree ? over : host;

        if (target !== host && dragging.some(row => row === target || this.isUnder(tree, target, row)))
            return;

        domEvent.preventDefault();

        if (domEvent.dataTransfer !== null)
            domEvent.dataTransfer.dropEffect = "move";

        this.markDrop(tree, target);
        this.springOpen(tree, target === host ? null : target);
    }

    /** Starts the wait over a folded folder, or ends it when the drag moved on. */
    private springOpen(tree: HTMLElement, target: HTMLElement | null): void {
        const folder = target !== null && target.getAttribute("aria-expanded") === "false" ? target : null;

        if (folder === this.springTarget)
            return;

        window.clearTimeout(this.springTimer);
        this.springTarget = folder;

        if (folder !== null)
            this.springTimer = window.setTimeout(() => this.expand(tree, folder), SpringOpenMilliseconds);
    }

    /** Leaving the tree altogether clears the mark; a move between its rows is followed by a dragover that marks the next place. */
    private handleDragLeave(domEvent: Event): void {
        if (!(domEvent instanceof DragEvent) || !(domEvent.target instanceof Element))
            return;

        const tree = domEvent.target.closest<HTMLElement>(`.${RootClass}`);

        if (tree !== null && !(domEvent.relatedTarget instanceof Node && tree.contains(domEvent.relatedTarget))) {
            this.markDrop(tree, null);
            this.springOpen(tree, null);
        }
    }

    /**
     * The drop writes where each node landed on its own text and raises `move` on its row, one node at a time; the controller does
     * the moving. A node whose parent is in the air stays with it. The folder dropped on opens, so the moved nodes are in view.
     */
    private handleDrop(domEvent: Event): void {
        if (!(domEvent instanceof DragEvent) || !(domEvent.target instanceof Element))
            return;

        const tree = domEvent.target.closest<HTMLElement>(`.${RootClass}`);
        const dragging = tree === null ? [] : this.draggingRows(tree);
        const marked = tree?.querySelector<HTMLElement>(`[${DropAttribute}]`) ?? null;

        if (tree === null || dragging.length === 0 || marked === null)
            return;

        domEvent.preventDefault();

        const targetKey = marked.classList.contains(RowClass) ? keyOf(marked) : "";
        const moved = dragging.filter(row => !dragging.some(other => other !== row && this.isUnder(tree, row, other)));

        this.markDrop(tree, null);
        this.springOpen(tree, null);
        clearDragMarks(tree, DraggingClass);

        if (marked.classList.contains(RowClass))
            this.expand(tree, marked);

        for (const row of moved) {
            const text = nodeOf(row)?.querySelector<HTMLElement>(`.${TextClass}`) ?? null;

            if (text === null)
                continue;

            text.setAttribute(TreeDropTargetAttribute, targetKey);
            // Two events: `change` carries the target back through the node's two-way binding, `move` is what a command hangs on.
            text.dispatchEvent(new Event("change", { bubbles: true }));
            row.dispatchEvent(new Event("move", { bubbles: true }));
        }
    }

    private handleDragEnd(domEvent: Event): void {
        const tree = draggedRow(domEvent)?.closest<HTMLElement>(`.${RootClass}`) ?? null;

        if (tree === null)
            return;

        clearDragMarks(tree, DraggingClass);
        this.markDrop(tree, null);
        this.springOpen(tree, null);
    }

    private markDrop(tree: HTMLElement, target: HTMLElement | null): void {
        for (const marked of tree.querySelectorAll(`[${DropAttribute}]`)) {
            if (marked !== target)
                marked.removeAttribute(DropAttribute);
        }

        target?.setAttribute(DropAttribute, "");
    }

    /** Whether `row` sits under `ancestor`, by the parent keys the nodes carry. */
    private isUnder(tree: HTMLElement, row: HTMLElement, ancestor: HTMLElement): boolean {
        const ancestorKey = keyOf(ancestor);

        for (let parent = this.parentOf(tree, row); parent !== null; parent = this.parentOf(tree, parent)) {
            if (keyOf(parent) === ancestorKey)
                return true;
        }

        return false;
    }

    /** Folds or unfolds a node, remembers the viewer's choice and lays the tree out again from it. */
    private toggle(tree: HTMLElement, row: HTMLElement): void {
        this.fold(tree, row, row.getAttribute("aria-expanded") !== "true");
    }

    /** Unfolds a folded node; one already open, or with nothing under it, is left alone. */
    private expand(tree: HTMLElement, row: HTMLElement): void {
        if (row.getAttribute("aria-expanded") === "false")
            this.fold(tree, row, true);
    }

    private fold(tree: HTMLElement, row: HTMLElement, expanded: boolean): void {
        const key = keyOf(row);

        if (key.length === 0 || !row.hasAttribute("aria-expanded"))
            return;

        const stored = this.foldOf(tree);

        stored[key] = expanded;

        this.store.writeJson(tree, ExpandedSlot, stored);
        this.layout(tree);
    }

    private foldOf(tree: HTMLElement): StoredFold {
        let fold = this.folds.get(tree);

        if (fold === undefined) {
            fold = this.store.readJson<StoredFold>(tree, ExpandedSlot) ?? {};
            this.folds.set(tree, fold);
        }

        return fold;
    }

    /**
     * Moves the keyboard's row; with one row to choose, the move chooses it too, as a file list does, and with many, a move under
     * Shift extends the range. Given no gesture the move only moves.
     */
    private setFocus(tree: HTMLElement, row: HTMLElement | null, gesture: SelectionGesture | null): void {
        if (row === null)
            return;

        const rows = this.rowsOf(tree);
        const from = focusedRow(rows);

        setRowFocus(tree, rows, row);

        if (gesture === null || !(tree.getAttribute(SelectionAttribute) === "one" || gesture.shift))
            return;

        // A range measured from where the cursor stood, which is the anchor when no click has set one.
        if (gesture.shift)
            ensureAnchor(tree, from);

        chooseRow(tree, rows, row, gesture);
    }

    private parentOf(tree: HTMLElement, row: HTMLElement): HTMLElement | null {
        const parentKey = nodeOf(row)?.getAttribute(TreeParentAttribute) ?? "";

        return parentKey.length === 0 ? null : this.rowsOf(tree).find(candidate => keyOf(candidate) === parentKey) ?? null;
    }

    /** Lays the field over the node's title; on commit the node carries the new title back and the row raises `rename`. */
    private startRename(row: HTMLElement): void {
        const tree = row.closest<HTMLElement>(`.${RootClass}`);
        const node = nodeOf(row);
        const title = node?.querySelector<HTMLElement>(TitleSelector) ?? null;

        // A node that refuses the rename refuses it from a menu's effect too; the tree's own switch gates only the viewer's keys.
        if (tree === null || node === null || title === null || row.hasAttribute(UnrenamableAttribute))
            return;

        this.setFocus(tree, row, null);

        openInlineRename({
            container: node,
            title,
            className: RenameClass,
            value: node.getAttribute(TreeTitleAttribute) ?? title.textContent?.trim() ?? "",
            commit: value => {
                node.setAttribute(TreeTitleAttribute, value);

                // Two events: `change` carries the title back through the node's two-way binding, `rename` is what a command hangs on.
                node.dispatchEvent(new Event("change", { bubbles: true }));
                row.dispatchEvent(new Event("rename", { bubbles: true }));
            },
            done: () => tree.focus({ preventScroll: true })
        });
    }

    private hostOf(tree: HTMLElement): HTMLElement | null {
        return tree.querySelector<HTMLElement>(`:scope > [${ItemsHostAttribute}]`);
    }

    private rowsOf(tree: HTMLElement): HTMLElement[] {
        const host = this.hostOf(tree);
        const rows: HTMLElement[] = [];

        if (host === null)
            return rows;

        for (const child of host.children) {
            if (child instanceof HTMLElement && child.classList.contains(RowClass))
                rows.push(child);
        }

        return rows;
    }
}

function createLoadingRow(): HTMLElement {
    const placeholder = document.createElement("div");
    const ring = document.createElement("span");

    placeholder.className = LoadingClass;
    placeholder.setAttribute("aria-hidden", "true");
    ring.className = LoadingRingClass;
    placeholder.append(ring, clientStrings.text("ui.tree.loading"));

    return placeholder;
}

function draggedRow(domEvent: Event): HTMLElement | null {
    return domEvent.target instanceof Element ? domEvent.target.closest<HTMLElement>(`.${RowClass}`) : null;
}

function keyOf(row: Element): string {
    return row.getAttribute(ComponentKeyAttribute) ?? "";
}

function nodeOf(row: Element): HTMLElement | null {
    return row.querySelector<HTMLElement>(`.${NodeClass}`);
}
