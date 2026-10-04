// Items dragged out of one host onto another component that takes their kind (`OnDrop`): a list or a table takes them at the place a
// line marks among its rows, a tree into the folder under the pointer, anything else whole, its edge dashed. The drop raises
// `drop:<kind>` on the target, carrying a `UIDrop` the command reads. Between two lists of one kind the rows move at once and come
// back if the answer does not keep them there (`PendingTransfers`); anything else waits for the server. The keyboard does the same:
// Ctrl+X on a row (or the chosen rows) is the plain drag and Ctrl+C the copy gesture, and Ctrl+V on a target drops them after the
// keyboard's row there, the target choosing the effect as a drop does. In a field the caret sits in the three keys stay the browser's.

// `.ts` on the value imports, and types imported as types: `node --test` loads this module as it is.
import { ComponentKeyAttribute, cssAttributeValue, DragKindAttribute, ItemDropOverAttribute, TreeRootClass, TreeRowClass } from "../addressing/dom-attributes.ts";
import { aheadOfAnswer } from "../events/ahead-of-answer.ts";
import type { EventRegistration } from "../events/event-descriptor.ts";
import { resolveHostMode, windowOffset } from "../items/items-host-mode.ts";
import type { PendingTransfer, PendingTransfers } from "../items/pending-transfers.ts";
import { leftAltogether } from "./drag-marks.ts";
import { isInert } from "./interactive-state.ts";
import type { ItemDrag, ItemDropEffect } from "./item-drags.ts";
import { carriedRows, currentItemDrag, endItemDrag, isLiftable, offeredItems } from "./item-drags.ts";
import type { Place } from "./items-reorder-engine.ts";
import { flowOf, insertIndex, lineOffset, markRowDrop, placeAmong, rowOrder, shownRows } from "./items-reorder-engine.ts";
import type { KeyboardShortcut } from "./keyboard-shortcut.ts";
import { isMacPlatform, matchesShortcut } from "./keyboard-shortcut.ts";
import { focusedRow, litRow, rowKeyTarget } from "./row-cursor.ts";
import { hostOf, KeyboardRowsRootSelector, rowBox, rowKey, SelectionRowSelector } from "./row-selection.ts";
import { takesTyping } from "./screen-keyboard.ts";
import { dropFolderOf, markTreeDrop } from "./tree-drop.ts";

/** What items of a kind dropped on a component are raised as on it, the kind after it (`EventNames.DropPrefix`). */
export const DropEventPrefix = "drop:";

// On the rows a Ctrl+X took, until they are pasted or let go of: the stylesheet dims them.
const CutClass = "ui-row--cut";

// By the key's place, not its letter: Ctrl+X is the same key on a Cyrillic layout. Cmd stands for Ctrl on a Mac.
const CutKeys: KeyboardShortcut = { code: "KeyX", ctrl: true, shift: false, alt: false, meta: false };
const CopyKeys: KeyboardShortcut = { code: "KeyC", ctrl: true, shift: false, alt: false, meta: false };
const PasteKeys: KeyboardShortcut = { code: "KeyV", ctrl: true, shift: false, alt: false, meta: false };

/** A drop as the command reads it (`UIDrop`): what was dropped, from where, and where it lands. */
type ItemDropPayload = {
    readonly kind: string;
    readonly source: string | null;
    readonly keys: readonly string[];
    readonly index: number | null;
    readonly folder: string | null;
    readonly effect: ItemDropEffect;
};

/** What the drop event carries: the drop, and the rows moved ahead of its command between two lists of one kind. */
type ItemDropDetail = {
    readonly drop: ItemDropPayload;
    readonly transfer: { readonly source: Element; readonly target: Element; readonly keys: readonly string[]; readonly index: number } | null;
};

/** What a drop between two lists of one kind asks of the rows moved ahead: moved into the target now, settled once answered. */
export type TransfersAhead = Pick<PendingTransfers, "ahead" | "settle">;

/** Where items would land on a target, and how the target is marked meanwhile. */
type Landing = {
    readonly index: number | null;
    readonly folder: string | null;
    readonly mark: () => void;
    /** The list the rows would stand in at `index`, where they can be moved there ahead of the answer. */
    readonly list: HTMLElement | null;
};

/** A drag over a component that takes it: the items, the component, what the drop does and where it lands. */
type Drop = {
    readonly drag: ItemDrag;
    readonly target: HTMLElement;
    readonly effect: ItemDropEffect;
    readonly landing: Landing;
};

/** Items a Ctrl+X or Ctrl+C took, and whether the paste moves them. */
type Clipboard = {
    readonly items: ItemDrag;
    readonly cut: boolean;
};

/**
 * How the pipeline reads a drop: the drop rides as one text after the target's own keys, where `UIAction.ArgEventValue` reads it, and
 * the rows a drop between two lists of one kind moved ahead wait for the command's answer.
 */
export function itemDropEvent(transfers?: TransfersAhead): Omit<EventRegistration, "name"> {
    return {
        dynamicParameters: context => {
            const detail = dropDetailOf(context.domEvent);

            return detail === null ? null : [...context.dynamicParameters, JSON.stringify(detail.drop)];
        },
        ...aheadOfAnswer<PendingTransfer>(domEvent => transferAhead(transfers, domEvent), transfer => transfers?.settle(transfer))
    };
}

function dropDetailOf(domEvent: Event): ItemDropDetail | null {
    const detail = domEvent instanceof CustomEvent ? (domEvent.detail as Partial<ItemDropDetail> | null) : null;

    return detail?.drop === undefined ? null : detail as ItemDropDetail;
}

/** Moves the rows a drop between two lists of one kind carries into the target now; null where it carries none or none moved. */
function transferAhead(transfers: TransfersAhead | undefined, domEvent: Event): PendingTransfer | null {
    const transfer = dropDetailOf(domEvent)?.transfer ?? null;

    return transfer === null || transfers === undefined ? null : transfers.ahead(transfer.source, transfer.target, transfer.keys, transfer.index);
}

export type ItemDragEngineOptions = {
    readonly root?: ParentNode;
    /** The nearest component at or above the element that takes items of the kind (its `drop:<kind>` event), or null. */
    readonly targetOf: (element: Element, kind: string) => HTMLElement | null;
    /** A virtualized host's whole collection, for the index a drop takes among it. */
    readonly keysOf?: (host: Element) => readonly string[] | null;
};

export class ItemDragEngine {
    private readonly root: ParentNode;
    private readonly options: ItemDragEngineOptions;
    // The target a drag stands over now, marked; the one to unmark when it moves on.
    private marked: HTMLElement | null = null;
    private clipboard: Clipboard | null = null;

    public constructor(options: ItemDragEngineOptions) {
        this.root = options.root ?? document;
        this.options = options;

        this.root.addEventListener("dragover", domEvent => this.handleDragOver(domEvent), true);
        this.root.addEventListener("dragleave", domEvent => this.handleDragLeave(domEvent), true);
        this.root.addEventListener("drop", domEvent => this.handleDrop(domEvent), true);
        this.root.addEventListener("dragend", () => this.endDrag(), true);
        // Bubbling, after the page's chords: a view's own Ctrl+C or Ctrl+V takes the key first and these leave it.
        this.root.addEventListener("keydown", domEvent => this.handleKeyDown(domEvent));
    }

    /** Over a component taking the kind in the air: the drop is taken and where it lands marked. */
    private handleDragOver(domEvent: Event): void {
        if (!(domEvent instanceof DragEvent))
            return;

        const drop = this.dropOf(domEvent);

        this.unmark();

        if (drop === null)
            return;

        domEvent.preventDefault();

        if (domEvent.dataTransfer !== null)
            domEvent.dataTransfer.dropEffect = drop.effect;

        drop.landing.mark();
        this.marked = drop.target;
    }

    /** What a drag event would drop where it stands; null where nothing there takes the items in the air, or none are. */
    private dropOf(domEvent: DragEvent): Drop | null {
        const drag = currentItemDrag(domEvent);
        const over = domEvent.target instanceof Element ? domEvent.target : null;
        const target = drag === null || over === null ? null : this.targetOf(drag, over);

        if (drag === null || over === null || target === null)
            return null;

        const effect = effectOf(drag, target, isCopyGesture(domEvent));
        const landing = effect === null ? null : this.landingOf(target, over, domEvent);

        return effect === null || landing === null ? null : { drag, target, effect, landing };
    }

    /**
     * The component the items at the element would drop on: the nearest taking their kind, unless it is disabled or loading; none while
     * the element stands in the items' own source, whose rows are never a drop on a component around them.
     */
    private targetOf(drag: ItemDrag, element: Element): HTMLElement | null {
        if (drag.root.contains(element))
            return null;

        const target = this.options.targetOf(element, drag.kind);

        return target === null || isInert(target) ? null : target;
    }

    /**
     * Where items land on the target: a list or a table at the place among its rows nearest the point (or, with no point, after its
     * cursor's row, else at its end), a tree in the folder under it or the folder of the node under it, anything else whole. Null on a
     * tree whose folder there takes no drop.
     */
    private landingOf(target: HTMLElement, over: Element | null, point: { readonly clientX: number; readonly clientY: number } | null): Landing | null {
        const host = target.matches(KeyboardRowsRootSelector) ? hostOf(target) : null;

        if (host !== null) {
            const rows = shownRows(host);
            const flow = flowOf(target, host);
            const order = rowOrder(host, this.options.keysOf);
            const place = over !== null && point !== null ? placeAmong(host, over, point, flow, rows) : afterCursor(rows);
            const at = place === null ? null : insertIndex(order, rowKey(place.anchor), place.side);

            return {
                index: (at ?? order.length) + windowOffset(host),
                folder: null,
                list: host,
                mark: () => place === null ? target.setAttribute(ItemDropOverAttribute, "") : markRowDrop(target, place, lineOffset(rows, place, flow))
            };
        }

        if (target.classList.contains(TreeRootClass)) {
            const folder = treeFolderAt(target, over ?? document.activeElement);

            if (folder === null)
                return null;

            // The tree's ground for its top level, as the tree marks its own drop there.
            const marked = folder.length === 0 ? hostOf(target) : treeRowOf(target, folder);

            return { index: null, folder, list: null, mark: () => markTreeDrop(target, marked) };
        }

        return { index: null, folder: null, list: null, mark: () => target.setAttribute(ItemDropOverAttribute, "") };
    }

    /** Takes the mark off the target marked last, and off every place marked in it. */
    private unmark(): void {
        const marked = this.marked;

        this.marked = null;

        if (marked === null)
            return;

        marked.removeAttribute(ItemDropOverAttribute);

        if (marked.matches(KeyboardRowsRootSelector))
            markRowDrop(marked, null);
        else if (marked.classList.contains(TreeRootClass))
            markTreeDrop(marked, null);
    }

    /** Leaving the marked target altogether takes its mark off; a move inside it is followed by a dragover that marks again. */
    private handleDragLeave(domEvent: Event): void {
        if (this.marked !== null && domEvent instanceof DragEvent && leftAltogether(domEvent, this.marked))
            this.unmark();
    }

    private handleDrop(domEvent: Event): void {
        const drop = domEvent instanceof DragEvent ? this.dropOf(domEvent) : null;

        if (drop === null)
            return;

        domEvent.preventDefault();
        this.unmark();
        this.drop(drop.drag, drop.target, drop.effect, drop.landing);
    }

    /** Raises the drop on the target, the rows moved there ahead of the answer where both hosts are lists of the kind holding their rows whole. */
    private drop(items: ItemDrag, target: HTMLElement, effect: ItemDropEffect, landing: Landing): void {
        const ahead = effect === "move" && landing.list !== null && landing.index !== null && items.root.matches(KeyboardRowsRootSelector)
            && target.getAttribute(DragKindAttribute) === items.kind && resolveHostMode(items.host) === "plain" && resolveHostMode(landing.list) === "plain";

        const detail: ItemDropDetail = {
            drop: { kind: items.kind, source: items.source, keys: items.keys, index: landing.index, folder: landing.folder, effect },
            transfer: ahead && landing.list !== null && landing.index !== null ? { source: items.host, target: landing.list, keys: items.keys, index: landing.index } : null
        };

        target.dispatchEvent(new CustomEvent(DropEventPrefix + items.kind, { bubbles: true, detail }));
    }

    private endDrag(): void {
        this.unmark();
        endItemDrag();
    }

    /** Ctrl+X and Ctrl+C take the keyboard's row of a host offering its rows (or its chosen rows); Ctrl+V drops them on a target; Escape lets go. */
    private handleKeyDown(domEvent: Event): void {
        if (!(domEvent instanceof KeyboardEvent) || domEvent.defaultPrevented || !(domEvent.target instanceof Element))
            return;

        if (domEvent.key === "Escape") {
            this.letGo();
            return;
        }

        // In a field the caret sits in the keys cut, copy and paste its words.
        if (takesTyping(domEvent.target))
            return;

        if (matchesShortcut(PasteKeys, domEvent))
            this.paste(domEvent, domEvent.target);
        else if (matchesShortcut(CutKeys, domEvent))
            this.take(domEvent, domEvent.target, true);
        else if (matchesShortcut(CopyKeys, domEvent))
            this.take(domEvent, domEvent.target, false);
    }

    private letGo(): void {
        for (const row of this.clipboard?.items.rows ?? [])
            (rowBox(row) ?? row).classList.remove(CutClass);

        this.clipboard = null;
    }

    /** Drops what was taken on the component at the element, as a plain drag for a cut and a copy gesture for a copy would. */
    private paste(domEvent: KeyboardEvent, element: Element): void {
        const clipboard = this.clipboard;
        const target = clipboard === null ? null : this.targetOf(clipboard.items, element);
        const effect = clipboard === null || target === null ? null : effectOf(clipboard.items, target, !clipboard.cut);
        const landing = target === null || effect === null ? null : this.landingOf(target, null, null);

        if (clipboard === null || target === null || effect === null || landing === null)
            return;

        domEvent.preventDefault();
        this.drop(clipboard.items, target, effect, landing);

        // A cut goes once; a copy may be pasted again.
        if (clipboard.cut)
            this.letGo();
    }

    /** Takes the keyboard's row (or the chosen rows) of a host offering them: a cut where they may leave it, a copy where they may be copied. */
    private take(domEvent: KeyboardEvent, element: Element, cut: boolean): void {
        // Words the reader selected are copied as words.
        const selection = document.getSelection();

        if (selection !== null && !selection.isCollapsed)
            return;

        const found = rowKeyTarget(element);
        const host = found === null ? null : hostOf(found.root);

        if (found === null || host === null || isInert(found.root) || !found.root.hasAttribute(DragKindAttribute))
            return;

        // Drawn by their box: a wrap's row is `display: contents` and has none of its own.
        const rows = [...host.children].filter((row): row is HTMLElement => row instanceof HTMLElement && row.matches(SelectionRowSelector) && rowBox(row) !== null);
        const row = found.row ?? focusedRow(rows);
        const items = row === null || !isLiftable(row) ? null : offeredItems(found.root, host, carriedRows(row, rows));

        if (items === null || !items.effects.has(cut ? "move" : "copy"))
            return;

        domEvent.preventDefault();
        this.letGo();
        this.clipboard = { items, cut };

        if (cut) {
            // On the box: a wrap's row has none of its own for the fade to show on.
            for (const taken of items.rows)
                (rowBox(taken) ?? taken).classList.add(CutClass);
        }
    }
}

/**
 * What a drop on the target does: a move between hosts of one kind, a copy into anything else, Ctrl (⌥ on a Mac) asking for a copy;
 * where the source forbids the default, the other, but never one the gesture did not ask for. Null where nothing is allowed.
 */
function effectOf(drag: ItemDrag, target: Element, copy: boolean): ItemDropEffect | null {
    const wanted: ItemDropEffect = copy || target.getAttribute(DragKindAttribute) !== drag.kind ? "copy" : "move";

    if (drag.effects.has(wanted))
        return wanted;

    return copy ? null : wanted === "move" ? "copy" : "move";
}

function isCopyGesture(domEvent: DragEvent): boolean {
    return isMacPlatform() ? domEvent.altKey : domEvent.ctrlKey;
}

/** After the cursor's row of a list (or its chosen one), where a paste lands; null for a list with neither, which takes it at its end. */
function afterCursor(rows: readonly HTMLElement[]): Place | null {
    const row = litRow(rows);

    return row === null ? null : { anchor: row, side: "after" };
}

/** The folder of a tree a drop at the element lands in (`dropFolderOf`), the top level off its rows; null where it takes no drop. */
function treeFolderAt(tree: HTMLElement, element: Element | null): string | null {
    const row = element?.closest<HTMLElement>(`.${TreeRowClass}`) ?? null;

    if (row === null || row.closest(`.${TreeRootClass}`) !== tree)
        return "";

    return dropFolderOf(row, key => treeRowOf(tree, key));
}

/** A tree's row by its node's key. */
function treeRowOf(tree: HTMLElement, key: string): HTMLElement | null {
    return tree.querySelector<HTMLElement>(`.${TreeRowClass}[${ComponentKeyAttribute}="${cssAttributeValue(key)}"]`);
}
