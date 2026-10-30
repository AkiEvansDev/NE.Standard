// A tree's rows as a flat list in walking order: depth, fold (kept in the browser), keys, lazy children, rename and drag/drop.

// `.ts` on the value imports, and types imported as types: `node --test` loads this module as it is.
import {
    DragKindAttribute, ItemsHostAttribute, TextTitleClass, TreeBootAttribute, TreeChildrenAttribute, TreeDraggableAttribute, TreeDropMarkAttribute, TreeDropTargetAttribute, TreeExpandedAttribute,
    TreeLoadingAttribute, TreeNodeClass, TreeNodeRenameClass, TreeNodeTextClass, TreeNodeToggleClass, TreeParentAttribute, TreeRenamableAttribute, TreeRenameOnDoubleClickAttribute, TreeRootClass, TreeRowClass,
    TreeRowDraggingClass, TreeRowFilteredClass, TreeRowFoldedClass, TreeRulesEventName, TreeTitleAttribute, TreeUnremovableAttribute, UnfoldSettledEventName, UnrenamableAttribute,
    UnselectableAttribute
} from "../addressing/dom-attributes.ts";
import type { EffectRunner } from "../addressing/dom-registry.ts";
import type { EventRegistration } from "../events/event-descriptor.ts";
import { ClientStore } from "../state/client-store.ts";
import type { PropertyPatchEngine, PropertyValueChange } from "../updates/property-patch-engine.ts";
import { observeComponents } from "./dom-mutations.ts";
import { clearDragMarks, giveDragPayload, leftAltogether, markDragStart } from "./drag-marks.ts";
import { allowedEffect, beginItemsDrag, carriedRows, isDraggableRow, offeredItems } from "./item-drags.ts";
import { openInlineRename } from "./inline-rename.ts";
import { chooseOnMove, enterRow, removeRows, spaceRow } from "./items-selection-engine.ts";
import { ownControlOf } from "./own-control.ts";
import { isInert, isItemDisabled, isItemRefused } from "./interactive-state.ts";
import { raiseItemMove } from "./items-reorder-engine.ts";
import { isPointerLast } from "./popup-focus.ts";
import { dispatchRowEvent, enterRowCursor, focusedRow, hostKeyTarget, isRowKey, keepRowCursorShown, litRow, nameRowBy, resolveRowTarget, setRowFocus } from "./row-cursor.ts";
import { isComposing, isPlainKey } from "./keyboard-shortcut.ts";
import { announceMoved } from "./live-announcer.ts";
import type { SelectionGesture } from "./row-selection.ts";
import { keyGestureOf, PlainGesture, rowKey } from "./row-selection.ts";
import type { TreeKeyMove, TreeMovePlace, TreeNodePlace } from "./tree-drop.ts";
import { folderTakesDrop, keyMovePlace, markTreeDrop, nodeOf, placeMoves, siblingAfter, takesDrop } from "./tree-drop.ts";
import {
    authoredExpandedOf, DepthVariable, ExpandedSlot, matchingTreeRows, orderTreeRows, placeLoadingRow, pruneFold, readStoredFold, resolveTreeRules, revealRows, writeBootFold
} from "./tree-fold.ts";
import type { Placement, StoredFold, TreeRuleServices } from "./tree-fold.ts";

export type { TreeRuleServices } from "./tree-fold.ts";

const TitleSelector = `.${TextTitleClass}`;
// On the place a drag would drop at (`markTreeDrop`).
const DropAttribute = TreeDropMarkAttribute;
// A folder a drag hovers over for this long opens, so a node can be dropped deeper without letting go.
const SpringOpenMilliseconds = 600;
// Where a row's height splits for a drop: on a folder the outer quarters are the lines either side of it and the middle goes into it;
// on any other node each half is the line on its side.
const FolderEdgeShare = 0.25;
// Alt with an arrow: where the keyboard's node moves.
const KeyMoves: Readonly<Record<string, TreeKeyMove>> = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "out", ArrowRight: "in" };
// The keys besides Up, Down, Home and End the tree answers; any other passes without the rows being read.
const ActionKeys = new Set([" ", "ArrowRight", "ArrowLeft", "Enter", "F2", "Delete"]);

/**
 * How the pipeline reads a node's `unfold`: once its command settles — answered, failed, refused, the connection dropped — the row
 * hears it, and its next unfold may ask again (`TreeEngine`).
 */
export const TreeUnfoldEvent: { readonly name: string; readonly registration: Omit<EventRegistration, "name"> } = {
    name: "unfold",
    registration: {
        completed: context => {
            context.domEvent.target?.dispatchEvent(new Event(UnfoldSettledEventName, { bubbles: true }));
        }
    }
};

export type TreeEngineOptions = {
    readonly root?: ParentNode;
    readonly effects?: EffectRunner;
    readonly propertyPatchEngine?: Pick<PropertyPatchEngine, "addValueChangeHandler">;
    /** Without these the walk applies no filter and no sort — a test's tree, or a page with no rules. */
    readonly rules?: TreeRuleServices;
};

export class TreeEngine {
    private readonly root: ParentNode;
    private readonly store = new ClientStore();
    private readonly rules: TreeRuleServices | undefined;
    private readonly unsubscribePatches: (() => void) | null;

    // The title a committed rename replaced, put back when the server answers a refused `RenamedTitle` with no text of its own.
    private readonly beforeRename = new WeakMap<HTMLElement, string>();

    // The fold per tree, read from the store once: a tree with no name to store under still folds while the page lives.
    private readonly folds = new WeakMap<Element, StoredFold>();

    // A node asked for its children once per unfold; folding it again once the ask settled lets the next unfold ask again.
    private readonly requested = new WeakSet<Element>();

    // The asks whose command has not settled and whose children have not come: one asked again would bring them twice.
    private readonly inFlight = new WeakSet<Element>();

    // The boot patches each tree last wrote, so a walk that changed no fold writes nothing to the browser's storage.
    private readonly writtenBoot = new WeakMap<Element, string>();

    // The folder a drag is waiting over, and the wait.
    private springTarget: HTMLElement | null = null;
    private springTimer = 0;

    // Where the drag would drop now, as its last dragover found it.
    private dropPlace: TreeMovePlace | null = null;

    public constructor(options: TreeEngineOptions = {}) {
        this.root = options.root ?? document;
        this.rules = options.rules;

        // The rule watcher's word that a filter's or a sort's source changed: the walk runs again over the same rows.
        this.root.addEventListener(TreeRulesEventName, domEvent => {
            const tree = domEvent.target instanceof Element ? domEvent.target.closest<HTMLElement>(`.${TreeRootClass}`) : null;

            if (tree === null)
                return;

            this.layout(tree);
            // A filter that left the cursor's node out moves the cursor to the nearest node it shows.
            keepRowCursorShown(tree, this.rowsOf(tree));
        }, true);

        this.root.addEventListener(UnfoldSettledEventName, domEvent => this.handleUnfoldSettled(domEvent), true);

        this.root.addEventListener("click", domEvent => this.handleClick(domEvent), true);
        this.root.addEventListener("dblclick", domEvent => this.handleDoubleClick(domEvent), true);
        this.root.addEventListener("keydown", domEvent => this.handleKeyDown(domEvent), true);
        this.root.addEventListener("focusin", domEvent => this.handleFocusIn(domEvent));
        this.root.addEventListener("dragstart", domEvent => this.handleDragStart(domEvent), true);
        this.root.addEventListener("dragover", domEvent => this.handleDragOver(domEvent), true);
        this.root.addEventListener("dragleave", domEvent => this.handleDragLeave(domEvent), true);
        this.root.addEventListener("drop", domEvent => this.handleDrop(domEvent), true);
        this.root.addEventListener("dragend", domEvent => this.handleDragEnd(domEvent), true);

        // A controller may ask for the field F2 opens, from a menu entry of its own.
        options.effects?.registerItemRenamer(TreeRootClass, (tree, key) => {
            const row = this.rowsOf(tree).find(candidate => rowKey(candidate) === key) ?? null;

            if (row === null)
                return false;

            this.startRename(row);
            return true;
        });

        this.layoutAll(this.root.querySelectorAll<HTMLElement>(`.${TreeRootClass}`));

        // Rows, a node's parent or children flag, and the tree's switches run the walk again; a change deeper in a row does not.
        observeComponents(
            this.root,
            `.${TreeRootClass}`,
            { childList: true, attributeFilter: [TreeParentAttribute, TreeChildrenAttribute, TreeExpandedAttribute, TreeDraggableAttribute], relevant: movesRows },
            trees => this.layoutAll(trees)
        );

        this.unsubscribePatches = options.propertyPatchEngine?.addValueChangeHandler(change => this.handlePropertyChange(change)) ?? null;
    }

    public dispose(): void {
        this.unsubscribePatches?.();
    }

    private layoutAll(trees: Iterable<HTMLElement>): void {
        for (const tree of trees)
            this.layout(tree);
    }

    /** Derives every row's depth and fold — the viewer's over the authored — after the sorts and the filter. */
    private layout(tree: HTMLElement): void {
        const stored = this.foldOf(tree);
        const host = this.hostOf(tree);
        const rules = resolveTreeRules(tree, host, this.rules);
        const rows = rules === null ? this.rowsOf(tree) : orderTreeRows(host, this.rowsOf(tree), rules, this.rules);
        // Lifted to move among the nodes, or to be offered to another host as a kind (`DragKind`).
        const draggable = tree.hasAttribute(TreeDraggableAttribute) || tree.hasAttribute(DragKindAttribute);
        const children = new Set<string>();

        for (const row of rows) {
            const parent = nodeOf(row)?.getAttribute(TreeParentAttribute);

            if (parent !== null && parent !== undefined && parent.length > 0)
                children.add(parent);
        }

        const kept = rules?.filtering === true ? matchingTreeRows(rows, rules, this.rules) : null;
        const placed = new Map<string, Placement>();

        for (const row of rows) {
            const key = rowKey(row);
            const node = nodeOf(row);
            const parentKey = node?.getAttribute(TreeParentAttribute) ?? "";
            const parent = parentKey.length > 0 ? placed.get(parentKey) : undefined;
            const depth = parent === undefined ? 0 : parent.depth + 1;
            const shown = parent === undefined ? true : parent.shown && parent.expanded;
            const declared = node?.hasAttribute(TreeChildrenAttribute) === true;
            const hasChildren = declared || children.has(key);
            const authoredExpanded = hasChildren && node?.hasAttribute(TreeExpandedAttribute) === true;
            const authoredShown = parent === undefined ? true : parent.authoredShown && authoredExpandedOf(parent);
            // A folder with a match under it stands open while the filter lasts; the viewer's fold is neither read nor written for it.
            const expanded = hasChildren && (kept !== null ? kept.has(key) : stored.get(key) ?? authoredExpanded);
            const filtered = kept !== null && !kept.has(key);

            row.style.setProperty(DepthVariable, String(depth));
            row.setAttribute("aria-level", String(depth + 1));
            // Named by its text, not its content: the chevron's own words ("Expand or collapse") are no part of the node's name.
            nameRowBy(row, node?.querySelector(`:scope > .${TreeNodeTextClass}`) ?? null);
            row.classList.toggle(TreeRowFoldedClass, !shown);
            row.classList.toggle(TreeRowFilteredClass, filtered);
            row.removeAttribute(TreeBootAttribute);
            // A disabled node is not lifted: its own component is inert, but the row around it would still start a drag.
            row.draggable = draggable && isDraggableRow(row);

            if (hasChildren)
                row.setAttribute("aria-expanded", expanded ? "true" : "false");
            else
                row.removeAttribute("aria-expanded");

            // The children arrived, or the node stopped claiming any: either way the wait is over.
            if (children.has(key) || !declared) {
                row.removeAttribute(TreeLoadingAttribute);
                this.inFlight.delete(row);
            }

            // Unfolded, claiming children, holding none: the controller is asked, once per unfold.
            if (expanded && shown && declared && !children.has(key) && !this.requested.has(row)) {
                this.requested.add(row);
                this.inFlight.add(row);
                row.setAttribute(TreeLoadingAttribute, "");
                row.dispatchEvent(new Event("unfold", { bubbles: true }));
            }

            // Only a settled ask is let go of on a fold; one that settled with no children keeps its faded chevron all the same, the
            // developer's signal, and the next unfold asks again.
            if (!expanded && !this.inFlight.has(row))
                this.requested.delete(row);

            placeLoadingRow(row, depth + 1, row.hasAttribute(TreeLoadingAttribute), shown && expanded && !filtered);
            placed.set(key, { row, depth, shown, expanded, authoredShown });
        }

        if (kept === null)
            writeBootFold(tree, stored, placed, this.writtenBoot, this.store);
    }

    /** An unfold whose command settled, whatever came of it: folding the node lets the next unfold ask again. */
    private handleUnfoldSettled(domEvent: Event): void {
        if (domEvent.target instanceof Element)
            this.inFlight.delete(domEvent.target);
    }

    /** The chevron folds; so does the whole row of an unselectable node, whose click chooses nothing. Choosing is the selection engine's. */
    private handleClick(domEvent: Event): void {
        const found = this.rowOfEvent(domEvent);

        if (found === null)
            return;

        const { tree, row, target } = found;
        const toggle = target.closest<HTMLElement>(`.${TreeNodeToggleClass}`);

        if (toggle === null && (!isItemRefused(row, UnselectableAttribute) || ownControlOf(target, row) !== null))
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
            dispatchRowEvent(row, "open");
    }

    /** The row and the tree a pointer event landed in, scoped to the tree that owns the row. */
    private rowOfEvent(domEvent: Event): { readonly tree: HTMLElement; readonly row: HTMLElement; readonly target: Element } | null {
        if (!(domEvent.target instanceof Element))
            return null;

        const row = domEvent.target.closest<HTMLElement>(`.${TreeRowClass}`);
        const tree = row?.closest<HTMLElement>(`.${TreeRootClass}`) ?? null;

        if (row === null || tree === null || row.closest(`.${TreeRootClass}`) !== tree || isItemDisabled(row))
            return null;

        return { tree, row, target: domEvent.target };
    }

    /** The tree reached from the keyboard shows its cursor at once (`enterRowCursor`); a press places it on the node it lands on. */
    private handleFocusIn(domEvent: Event): void {
        const tree = domEvent.target;

        if (!(tree instanceof HTMLElement) || !tree.classList.contains(TreeRootClass) || isInert(tree) || isPointerLast())
            return;

        enterRowCursor(tree, this.rowsOf(tree));
    }

    private handleKeyDown(domEvent: Event): void {
        // A key another engine took — an open select's arrows — is not the tree's.
        if (!(domEvent instanceof KeyboardEvent) || domEvent.defaultPrevented || isComposing(domEvent) || !(domEvent.target instanceof Element))
            return;

        // Only keys on the tree or its rows: the rename field, a row's control and a nested list keep theirs.
        const found = hostKeyTarget(domEvent);

        if (found === null)
            return;

        const tree = found.root;

        if (!tree.classList.contains(TreeRootClass) || isInert(tree))
            return;

        const keyMove = domEvent.altKey && isPlainKey(domEvent, { alt: true }) ? KeyMoves[domEvent.key] : undefined;

        if (keyMove !== undefined && tree.hasAttribute(TreeDraggableAttribute)) {
            // Taken whether or not the node moves: in a tree whose nodes move, Alt+Left would otherwise take the page back.
            domEvent.preventDefault();
            this.moveByKey(tree, keyMove);
            return;
        }

        // Any other Alt chord is the browser's: Alt+Left takes the page back rather than folding the node.
        if (domEvent.altKey || (!ActionKeys.has(domEvent.key) && !isRowKey(domEvent.key, "vertical")))
            return;

        const rows = this.rowsOf(tree);
        const current = focusedRow(rows);
        const next = resolveRowTarget(domEvent.key, rows, litRow(rows), "vertical");

        if (next !== null) {
            domEvent.preventDefault();
            this.setFocus(tree, next, keyGestureOf(tree, domEvent));
            return;
        }

        if (current === null || isItemDisabled(current))
            return;

        switch (domEvent.key) {
            case " ":
                spaceRow(tree, rows, current, null);
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
                // As on a list's row: chooses, raises the node's click and opens it. A node is never one control (its chevron folds),
                // and Enter does not fold: Right and Left do.
                enterRow(tree, rows, current, null);
                break;
            case "F2":
                if (!this.canRename(tree, current))
                    return;

                this.startRename(current);
                break;
            case "Delete":
                // A tree that removes nothing by key says so on its root, whatever a node says.
                if (tree.hasAttribute(TreeUnremovableAttribute) || !removeRows(tree, rows, current))
                    return;

                break;
            default:
                return;
        }

        domEvent.preventDefault();
    }

    /**
     * Alt+Up and Alt+Down move the keyboard's node past its sibling, Alt+Left out of its folder to right after it, Alt+Right into the
     * folder just above it as its last node — a drop's move, refused where a drop there would be, and among siblings while a sort
     * orders them, which would put the node back.
     */
    private moveByKey(tree: HTMLElement, move: TreeKeyMove): void {
        const rows = this.rowsOf(tree);
        const current = focusedRow(rows);

        if (current === null || !current.draggable || ((move === "up" || move === "down") && this.isSorted(tree)))
            return;

        const nodes = nodePlaces(rows);
        const key = rowKey(current);
        const place = keyMovePlace(nodes, key, move);

        if (place === null)
            return;

        const [index] = this.moveRows(tree, [current], place, move === "in" ? rows.find(row => rowKey(row) === place.parent) ?? null : null);
        // Its place among the nodes of the folder it now stands in, itself counted once.
        const count = nodes.filter(node => node.parent === place.parent && node.key !== key).length + 1;

        announceMoved(index + 1, count);
    }

    /** Whether a sort orders the tree's siblings now: a node put among them would be put back by it. */
    private isSorted(tree: HTMLElement): boolean {
        return (resolveTreeRules(tree, this.hostOf(tree), this.rules)?.sorts.length ?? 0) > 0;
    }

    /** The tree renames, and this node has not refused it. */
    private canRename(tree: HTMLElement, row: HTMLElement): boolean {
        return tree.hasAttribute(TreeRenamableAttribute) && !isItemRefused(row, UnrenamableAttribute);
    }

    private handleDragStart(domEvent: Event): void {
        const row = draggedRow(domEvent);
        const tree = row?.closest<HTMLElement>(`.${TreeRootClass}`) ?? null;
        const moves = tree?.hasAttribute(TreeDraggableAttribute) === true;
        const host = tree === null ? null : this.hostOf(tree);

        if (row === null || tree === null || host === null || (!moves && !tree.hasAttribute(DragKindAttribute)))
            return;

        // Disabled since the rows were last laid out: refused here rather than left to a lift that carries nothing.
        if (isItemDisabled(row)) {
            domEvent.preventDefault();
            return;
        }

        // A chosen node takes the other chosen ones; one folded away stays, as moving it would be a move nobody saw.
        const carried = carriedRows(row, this.rowsOf(tree));
        const items = offeredItems(tree, host, carried);
        const picture = nodeOf(row)?.querySelector<HTMLElement>(`.${TreeNodeTextClass}`) ?? undefined;

        // Marked as this tree's own drag only where its nodes move among themselves; a tree that only offers them drops nothing on itself.
        if (moves)
            markDragStart(domEvent, tree, row, TreeRowDraggingClass, rowKey(row), carried.filter(other => other !== row), allowedEffect(items, true), picture);
        else
            giveDragPayload(domEvent, rowKey(row), allowedEffect(items, false), picture);

        beginItemsDrag(domEvent, items);
    }

    /** The rows in the air, in walking order. */
    private draggingRows(tree: HTMLElement): HTMLElement[] {
        return this.rowsOf(tree).filter(row => row.classList.contains(TreeRowDraggingClass));
    }

    /** Over a row that is not the dragged one or under it, or over the tree's own ground: the drop is taken and the place marked. */
    private handleDragOver(domEvent: Event): void {
        if (!(domEvent instanceof DragEvent) || !(domEvent.target instanceof Element))
            return;

        const tree = domEvent.target.closest<HTMLElement>(`.${TreeRootClass}`);
        const dragging = tree === null ? [] : this.draggingRows(tree);
        const host = tree === null ? null : this.hostOf(tree);

        if (tree === null || dragging.length === 0 || host === null)
            return;

        const over = domEvent.target.closest<HTMLElement>(`.${TreeRowClass}`);
        const target = over !== null && over.closest(`.${TreeRootClass}`) === tree ? over : null;
        // The tree's own ground takes a node to the end of the top level.
        const drop = target === null ? { mark: "", place: { parent: "", before: null } } : this.dropAt(tree, target, dragging, domEvent.clientY);

        // Left untaken, the drop shows as impossible and a release sends nothing; the mark of the place before it goes, so nothing
        // stays lit.
        if (drop === null) {
            this.markDrop(tree, null);
            this.springOpen(tree, null);
            return;
        }

        domEvent.preventDefault();

        if (domEvent.dataTransfer !== null)
            domEvent.dataTransfer.dropEffect = "move";

        this.markDrop(tree, target ?? host, drop.mark, drop.depth);
        this.dropPlace = drop.place;
        this.springOpen(tree, target !== null && drop.mark === "" ? target : null);
    }

    /**
     * Where a drag over a row would drop: into it, the middle of a folder; or on the line before or after it, the edges of a folder
     * and either half of any other node — after a folder whose nodes show below it, its first node's place. Into a folder only where
     * it takes a drop (`takesDrop`; a disabled folder does not) and is not the dragged node or under it; on a line only into a folder
     * that takes nodes the same way, and while no sort orders the siblings. Null where the drop is refused.
     */
    private dropAt(tree: HTMLElement, target: HTMLElement, dragging: readonly HTMLElement[], clientY: number): { readonly mark: string; readonly place: TreeMovePlace; readonly depth?: number } | null {
        const parents = this.parentKeysOf(tree);
        const key = rowKey(target);
        const inside = (folder: string): boolean => dragging.some(row => rowKey(row) === folder || isUnder(parents, folder, rowKey(row)));
        const folder = takesDrop(target, nodeOf(target));
        const box = target.getBoundingClientRect();
        const share = box.height > 0 ? (clientY - box.top) / box.height : 0.5;
        const edge = folder ? FolderEdgeShare : 0.5;
        const side = this.isSorted(tree) ? null : share < edge ? "before" : share >= 1 - edge ? "after" : null;

        if (side === null)
            return folder && !inside(key) ? { mark: "", place: { parent: key, before: null } } : null;

        if (dragging.includes(target))
            return null;

        const rows = this.rowsOf(tree);
        const nodes = nodePlaces(rows);
        const depth = Number(target.style.getPropertyValue(DepthVariable)) || 0;
        const skip = new Set(dragging.map(rowKey));
        const firstChild = side === "after" && target.getAttribute("aria-expanded") === "true" ? nodes.find(node => node.parent === key && node.shown !== false && !skip.has(node.key)) : undefined;
        const parent = parents.get(key) ?? "";
        const place = firstChild !== undefined
            ? { parent: key, before: firstChild.key }
            : { parent, before: side === "before" ? key : siblingAfter(nodes, parent, key, false, skip) };

        if (!folderTakesDrop(place.parent, folder => rows.find(row => rowKey(row) === folder) ?? null) || inside(place.parent))
            return null;

        return { mark: side, place, depth: firstChild !== undefined ? depth + 1 : depth };
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

        const tree = domEvent.target.closest<HTMLElement>(`.${TreeRootClass}`);

        if (tree !== null && leftAltogether(domEvent, tree)) {
            this.markDrop(tree, null);
            this.springOpen(tree, null);
        }
    }

    /** A drop on a folder, between two nodes or on the tree's ground moves the nodes in the air there. */
    private handleDrop(domEvent: Event): void {
        if (!(domEvent instanceof DragEvent) || !(domEvent.target instanceof Element))
            return;

        const tree = domEvent.target.closest<HTMLElement>(`.${TreeRootClass}`);
        const dragging = tree === null ? [] : this.draggingRows(tree);
        const marked = tree?.querySelector<HTMLElement>(`[${DropAttribute}]`) ?? null;
        const place = this.dropPlace;

        if (tree === null || dragging.length === 0 || marked === null || place === null)
            return;

        domEvent.preventDefault();

        const parents = this.parentKeysOf(tree);
        const moved = dragging.filter(row => !dragging.some(other => other !== row && isUnder(parents, rowKey(row), rowKey(other))));
        const into = marked.getAttribute(DropAttribute) === "" && marked.classList.contains(TreeRowClass) ? marked : null;

        this.markDrop(tree, null);
        this.springOpen(tree, null);
        clearDragMarks(tree, TreeRowDraggingClass);

        this.moveRows(tree, moved, place, into);
    }

    /**
     * Writes the folder each node lands in on its text and raises `move` per node with the index it takes among that folder's nodes,
     * read by `UIAction.ArgEventValue` as a row's move is; the controller moves them, a folder dropped into opens. Answers those indexes.
     */
    private moveRows(tree: HTMLElement, rows: readonly HTMLElement[], place: TreeMovePlace, folder: HTMLElement | null): number[] {
        const indexes = placeMoves(nodePlaces(this.rowsOf(tree)), rows.map(rowKey), place);

        if (folder !== null)
            this.expand(tree, folder);

        rows.forEach((row, position) => {
            const text = nodeOf(row)?.querySelector<HTMLElement>(`.${TreeNodeTextClass}`) ?? null;

            if (text === null)
                return;

            text.setAttribute(TreeDropTargetAttribute, place.parent);
            // Two events: `change` carries the folder back through the node's two-way binding, `move` is what a command hangs on.
            text.dispatchEvent(new Event("change", { bubbles: true }));
            raiseItemMove(row, indexes[position]);
        });

        return indexes;
    }

    private handleDragEnd(domEvent: Event): void {
        const tree = draggedRow(domEvent)?.closest<HTMLElement>(`.${TreeRootClass}`) ?? null;

        if (tree === null)
            return;

        clearDragMarks(tree, TreeRowDraggingClass);
        this.markDrop(tree, null);
        this.springOpen(tree, null);
    }

    /** Marks the place a drag would drop at, or with none takes every mark and the place it stood for away. */
    private markDrop(tree: HTMLElement, target: HTMLElement | null, mark = "", depth?: number): void {
        markTreeDrop(tree, target, mark, depth);

        if (target === null)
            this.dropPlace = null;
    }

    /** Each row's parent key by its own, read once per drag event rather than once per ancestor of every dragged row. */
    private parentKeysOf(tree: HTMLElement): Map<string, string> {
        const parents = new Map<string, string>();

        for (const row of this.rowsOf(tree))
            parents.set(rowKey(row), nodeOf(row)?.getAttribute(TreeParentAttribute) ?? "");

        return parents;
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
        const key = rowKey(row);

        if (key.length === 0 || !row.hasAttribute("aria-expanded"))
            return;

        const stored = this.foldOf(tree);
        const rows = this.rowsOf(tree);

        // Taken out first, so it stands last: the latest a bound on the fold would let go of.
        stored.delete(key);
        stored.set(key, expanded);
        pruneFold(stored, rows);

        const folded = expanded ? rows.filter(candidate => candidate.classList.contains(TreeRowFoldedClass)) : [];

        this.store.writeJson(tree, ExpandedSlot, [...stored]);
        this.layout(tree);
        revealRows(folded.filter(candidate => !candidate.classList.contains(TreeRowFoldedClass)));
    }

    private foldOf(tree: HTMLElement): StoredFold {
        let fold = this.folds.get(tree);

        if (fold === undefined) {
            fold = readStoredFold(this.store.readJson<unknown>(tree, ExpandedSlot));
            this.folds.set(tree, fold);
        }

        return fold;
    }

    /** Moves the keyboard's row; under single choice it chooses too, like a file list, and under many Shift extends the range. */
    private setFocus(tree: HTMLElement, row: HTMLElement | null, gesture: SelectionGesture | null): void {
        if (row === null)
            return;

        const rows = this.rowsOf(tree);
        const from = focusedRow(rows);

        setRowFocus(tree, rows, row);

        if (gesture !== null)
            chooseOnMove(tree, rows, from, row, gesture);
    }

    private parentOf(tree: HTMLElement, row: HTMLElement): HTMLElement | null {
        const parentKey = nodeOf(row)?.getAttribute(TreeParentAttribute) ?? "";

        return parentKey.length === 0 ? null : this.rowsOf(tree).find(candidate => rowKey(candidate) === parentKey) ?? null;
    }

    /** Lays the field over the node's title; on commit the node carries the new title back and the row raises `rename`. */
    private startRename(row: HTMLElement): void {
        const tree = row.closest<HTMLElement>(`.${TreeRootClass}`);
        const node = nodeOf(row);
        const title = node?.querySelector<HTMLElement>(TitleSelector) ?? null;

        // A node that refuses the rename refuses it from a menu's effect too; the tree's own switch gates only the viewer's keys.
        if (tree === null || node === null || title === null || isItemRefused(row, UnrenamableAttribute))
            return;

        const previousText = title.textContent ?? "";

        this.setFocus(tree, row, null);

        openInlineRename({
            container: node,
            title,
            className: TreeNodeRenameClass,
            value: node.getAttribute(TreeTitleAttribute) ?? title.textContent?.trim() ?? "",
            commit: value => {
                this.beforeRename.set(title, previousText);
                node.setAttribute(TreeTitleAttribute, value);
                title.textContent = value;

                // Two events: `change` carries the title back through the node's two-way binding, `rename` is what a command hangs on.
                node.dispatchEvent(new Event("change", { bubbles: true }));
                row.dispatchEvent(new Event("rename", { bubbles: true }));
            },
            refocus: () => tree.focus({ preventScroll: true })
        });
    }

    /** Reconciles the optimistic title when the server answers `RenamedTitle` (for example, refusing a gated write back to the old name). */
    private handlePropertyChange(change: PropertyValueChange): void {
        if (change.local || change.propertyName !== "RenamedTitle")
            return;

        for (const component of change.components) {
            if (!component.classList.contains(TreeNodeClass))
                continue;

            const title = component.querySelector<HTMLElement>(TitleSelector);

            if (title === null)
                continue;

            const pushed = typeof change.value === "string" ? change.value.trim() : "";
            const fallback = this.beforeRename.get(title) ?? "";
            const next = pushed.length > 0 ? pushed : fallback;

            this.beforeRename.delete(title);

            if (next.length > 0 && title.textContent !== next)
                title.textContent = next;
        }
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
            if (child instanceof HTMLElement && child.classList.contains(TreeRowClass))
                rows.push(child);
        }

        return rows;
    }
}

/** Whether the row keyed `key` sits under the one keyed `ancestorKey`, by the parent keys the nodes carry. */
function isUnder(parents: ReadonlyMap<string, string>, key: string, ancestorKey: string): boolean {
    const seen = new Set<string>();

    // A parent key that loops back on itself is a malformed tree, not a reason to hang the drag.
    for (let parent = parents.get(key) ?? ""; parent.length > 0 && !seen.has(parent); parent = parents.get(parent) ?? "") {
        if (parent === ancestorKey)
            return true;

        seen.add(parent);
    }

    return false;
}

/** Whether a record can move what the walk derives: rows coming, going or redrawn, or an attribute it reads. */
function movesRows(mutation: MutationRecord): boolean {
    if (mutation.type !== "childList")
        return true;

    const target = mutation.target;

    return target instanceof HTMLElement && (target.classList.contains(TreeRowClass) || (target.hasAttribute(ItemsHostAttribute) && target.parentElement?.classList.contains(TreeRootClass) === true));
}

function draggedRow(domEvent: Event): HTMLElement | null {
    return domEvent.target instanceof Element ? domEvent.target.closest<HTMLElement>(`.${TreeRowClass}`) : null;
}

/** The rows as a move reads them: key, folder, whether each takes a drop, and whether a filter left it shown. */
function nodePlaces(rows: readonly HTMLElement[]): TreeNodePlace[] {
    return rows.map(row => ({
        key: rowKey(row),
        parent: nodeOf(row)?.getAttribute(TreeParentAttribute) ?? "",
        takesDrop: takesDrop(row, nodeOf(row)),
        shown: !row.classList.contains(TreeRowFilteredClass)
    }));
}
