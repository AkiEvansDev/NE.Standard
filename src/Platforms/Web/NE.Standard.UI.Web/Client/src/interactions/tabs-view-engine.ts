// The items variant of a tabs strip: captions and pages come from one collection, so a tab's key is the item's own key.

import {
    BindSelectedKeyAttribute, ComponentKeyAttribute, ItemsHostAttribute, TabCaptionAttribute, TabOrderAttribute, TabsSelectedAttribute, UndraggableAttribute,
    TabsDraggableAttribute, TabsUnremovableAttribute, UnremovableAttribute, UnrenamableAttribute, VisibilityTierAttributes
} from "../addressing/dom-attributes";
import { EffectRegistry } from "../effects/effect-registry";
import { getIdValue, RenameTabClientEffect } from "../metadata/metadata-index";
import { logWarn } from "../runtime/logger";
import { observeComponents } from "./dom-mutations";
import { markDragStart } from "./drag-marks";
import { isLaidOut } from "./element-visibility";
import { openInlineRename } from "./inline-rename";
import { ownDescendants } from "./own-descendants";
import { applyRovingTabIndex, resolveRovingTarget } from "./roving-focus";
import { writeSelectedKey } from "./selected-key";
import { OverflowButtonClass, StripOverflowMenu, fitStrip } from "./strip-overflow";

const RootClass = "ui-tabs-view";
const ItemClass = "ui-tab-item";
const LabelClass = "ui-tab-item__label";
const CloseClass = "ui-tab-item__close";
const RenameClass = "ui-tab-item__rename";
const CaptionClass = "ui-tab-item__caption";
const TitleSelector = ".ui-text__title";
const DraggingModifier = "ui-tab-item--dragging";
const OverflowedModifier = "ui-tab-item__caption--overflowed";
const OverflowingModifier = "ui-tabs-view--overflowing";
const NoOverflowModifier = "ui-tabs-view--no-overflow";
const PageClass = "ui-tab-item__page";
const SelectedModifier = "ui-tab-item--selected";

const RenamableAttribute = "data-ui-tabs-renamable";

export type TabsViewEngineOptions = {
    readonly root?: ParentNode;
    readonly effects?: EffectRegistry;
};

export class TabsViewEngine {
    private readonly root: ParentNode;
    private readonly overflow: StripOverflowMenu;

    // Where the dragged tab's row sat before the drag, so a cancelled drop can put it back rather than commit the live reorder.
    private dragStart: { readonly parent: Node; readonly next: Node | null } | null = null;

    // The strip is fitted again whenever its width changes; a host is observed once, on first sight.
    private readonly resizes = typeof ResizeObserver === "function"
        ? new ResizeObserver(entries => {
            for (const entry of entries) {
                const root = entry.target.closest<HTMLElement>(`.${RootClass}`);

                if (root !== null)
                    this.apply(root);
            }
        })
        : null;

    public constructor(options: TabsViewEngineOptions = {}) {
        this.root = options.root ?? document;
        this.overflow = new StripOverflowMenu(this.root, (strip, key) => this.select(strip, key));

        this.applyAll();

        // A controller may ask for the field a double-click opens, from a context menu or a shortcut of its own.
        options.effects?.register("RenameTab", context => {
            const effect = context.effect as RenameTabClientEffect;
            const target = effect.target;

            if (target === undefined || target.id === undefined || typeof effect.key !== "string") {
                logWarn("rename tab effect carries no target or key.", effect);
                return;
            }

            const root = context.dom.findComponent(getIdValue(target.id), target.dynamicParameters ?? []);
            const item = root === null ? undefined : this.ownItems(root as HTMLElement).find(candidate => tabKey(candidate) === effect.key);
            const label = item?.querySelector<HTMLElement>(`.${LabelClass}`) ?? null;

            if (label === null) {
                logWarn("rename tab effect names no tab on the page.", effect);
                return;
            }

            this.startRename(label);
        });

        this.root.addEventListener("click", domEvent => this.handleClick(domEvent), true);
        this.root.addEventListener("dblclick", domEvent => this.handleDoubleClick(domEvent), true);
        this.root.addEventListener("dragstart", domEvent => this.handleDragStart(domEvent), true);
        this.root.addEventListener("dragover", domEvent => this.handleDragOver(domEvent), true);
        this.root.addEventListener("dragend", domEvent => this.handleDragEnd(domEvent), true);
        this.root.addEventListener("keydown", domEvent => this.handleKeydown(domEvent), true);

        // Tabs arrive with the collection, so childList counts as much as the selected attribute.
        observeComponents(this.root, `.${RootClass}`, { childList: true, attributeFilter: [TabsSelectedAttribute, ...VisibilityTierAttributes] }, views => {
            for (const view of views)
                this.apply(view);
        });
    }

    private applyAll(): void {
        for (const root of this.root.querySelectorAll<HTMLElement>(`.${RootClass}`))
            this.apply(root);
    }

    /** Marks the current caption and shows its page; a selection naming no shown tab falls back to the first and writes that back. */
    private apply(root: HTMLElement): void {
        const items = this.ownItems(root);
        const shown = items.filter(isLaidOut);

        if (shown.length === 0)
            return;

        const selected = root.getAttribute(TabsSelectedAttribute) ?? "";

        if (!shown.some(item => tabKey(item) === selected)) {
            this.select(root, tabKey(shown[0]));
            return;
        }

        const reorderable = root.hasAttribute(TabsDraggableAttribute);
        const captions: HTMLElement[] = [];
        let currentCaption: HTMLElement | null = null;

        for (const item of items) {
            const own = tabKey(item) === selected;

            item.classList.toggle(SelectedModifier, own);

            const caption = item.querySelector<HTMLElement>(`.${CaptionClass}`);

            if (caption !== null) {
                caption.draggable = reorderable;

                if (shown.includes(item)) {
                    captions.push(caption);

                    if (own)
                        currentCaption = caption;
                }
            }

            item.querySelector<HTMLElement>(`.${LabelClass}`)?.setAttribute("aria-selected", own ? "true" : "false");

            for (const page of item.querySelectorAll<HTMLElement>(`.${PageClass}`))
                page.hidden = !own;
        }

        this.fitCaptions(root, captions, currentCaption);

        // Only the captions left on the strip take part in arrow-key travel; a hidden one is reached through the list.
        const labels: HTMLElement[] = [];
        let current: HTMLElement | null = null;

        for (const caption of captions) {
            const label = caption.querySelector<HTMLElement>(`.${LabelClass}`);

            if (label === null || caption.classList.contains(OverflowedModifier))
                continue;

            labels.push(label);

            if (caption === currentCaption)
                current = label;
        }

        applyRovingTabIndex(labels, current);
    }

    /** Hides the captions past the strip's room and shows the "…" control when any is hidden. */
    private fitCaptions(root: HTMLElement, captions: readonly HTMLElement[], selected: HTMLElement | null): void {
        const host = root.querySelector<HTMLElement>(`:scope > [${ItemsHostAttribute}]`);
        const button = root.querySelector<HTMLElement>(`:scope > .${OverflowButtonClass}`);

        if (host === null || button === null)
            return;

        // A strip without the "…" list wraps its captions instead: every caption stays on the strip.
        if (root.classList.contains(NoOverflowModifier)) {
            for (const caption of captions)
                caption.classList.remove(OverflowedModifier);

            root.classList.remove(OverflowingModifier);
            return;
        }

        this.resizes?.observe(host);

        // Shown for the measurement, so a control that was hidden has a width; taken off again when everything fits.
        root.classList.add(OverflowingModifier);

        const overflowing = fitStrip({
            captions,
            selected,
            width: host.clientWidth,
            buttonWidth: button.getBoundingClientRect().width,
            hiddenClass: OverflowedModifier
        });

        root.classList.toggle(OverflowingModifier, overflowing);

        if (!overflowing && this.overflow.isOpenFor(root))
            this.overflow.close();
    }

    private toggleOverflow(root: HTMLElement, button: HTMLElement): void {
        if (this.overflow.isOpenFor(root)) {
            this.overflow.close();
            return;
        }

        const selected = root.getAttribute(TabsSelectedAttribute) ?? "";
        const entries = this.ownItems(root).filter(isLaidOut).map(item => ({
            key: tabKey(item),
            title: item.querySelector(`.${LabelClass}`)?.textContent?.trim() ?? tabKey(item),
            current: tabKey(item) === selected
        }));

        this.overflow.open(button, root, entries);
    }

    private handleClick(domEvent: Event): void {
        if (!(domEvent.target instanceof Element))
            return;

        if (this.handleClose(domEvent, domEvent.target))
            return;

        const overflowButton = domEvent.target.closest<HTMLElement>(`.${OverflowButtonClass}`);
        const overflowRoot = overflowButton?.parentElement ?? null;

        if (overflowButton !== null && overflowRoot !== null && overflowRoot.classList.contains(RootClass)) {
            domEvent.preventDefault();
            this.toggleOverflow(overflowRoot, overflowButton);
            return;
        }

        const label = domEvent.target.closest<HTMLElement>(`.${LabelClass}`);
        const root = label?.closest<HTMLElement>(`.${RootClass}`) ?? null;

        if (label === null || root === null || label.matches(":disabled, .ui-disabled"))
            return;

        const item = label.closest<HTMLElement>(`.${ItemClass}`);

        // Scoped to the strip that owns it: a nested tabs view must not switch the outer one.
        if (item === null || item.closest(`.${RootClass}`) !== root)
            return;

        domEvent.preventDefault();
        this.select(root, tabKey(item));
    }

    /** Fires the tab's own `remove` event, which carries its key by sitting inside it. */
    private handleClose(domEvent: Event, target: Element): boolean {
        const close = target.closest<HTMLElement>(`.${CloseClass}`);
        const item = close?.closest<HTMLElement>(`.${ItemClass}`) ?? null;
        const root = item?.closest<HTMLElement>(`.${RootClass}`) ?? null;

        if (close === null || item === null || root === null)
            return false;

        domEvent.preventDefault();
        domEvent.stopPropagation();

        // A tab that cannot be removed, or a strip that removes nothing, has its close hidden; a press that still lands raises nothing.
        if (root.hasAttribute(TabsUnremovableAttribute) || rowOf(item).hasAttribute(UnremovableAttribute) || item.hasAttribute(UnremovableAttribute))
            return true;

        item.dispatchEvent(new Event("remove", { bubbles: true }));

        return true;
    }

    /** Renaming lays a field over the caption rather than editing it, so a refused rename leaves it as it was. */
    private handleDoubleClick(domEvent: Event): void {
        if (!(domEvent.target instanceof Element))
            return;

        const label = domEvent.target.closest<HTMLElement>(`.${LabelClass}`);
        const root = label?.closest<HTMLElement>(`.${RootClass}`) ?? null;

        if (label === null || root === null || !root.hasAttribute(RenamableAttribute))
            return;

        domEvent.preventDefault();
        this.startRename(label);
    }

    /** Lays the field over the caption; a tab that refuses the rename refuses it from a menu's effect too. */
    private startRename(label: HTMLElement): void {
        const caption = label.parentElement;
        const title = label.querySelector<HTMLElement>(TitleSelector) ?? label;
        const item = label.closest<HTMLElement>(`.${ItemClass}`);

        if (caption === null || item === null || rowOf(item).hasAttribute(UnrenamableAttribute))
            return;

        openInlineRename({
            container: caption,
            title,
            className: RenameClass,
            value: label.getAttribute(TabCaptionAttribute) ?? title.textContent?.trim() ?? "",
            commit: value => {
                label.setAttribute(TabCaptionAttribute, value);

                // Two events: `change` carries the value back, `rename` is what a command hangs on — a reorder raises `change` too.
                label.dispatchEvent(new Event("change", { bubbles: true }));
                label.dispatchEvent(new Event("rename", { bubbles: true }));
            },
            done: () => label.focus()
        });
    }

    private handleKeydown(domEvent: Event): void {
        if (!(domEvent instanceof KeyboardEvent) || domEvent.defaultPrevented || !(domEvent.target instanceof Element))
            return;

        const label = domEvent.target.closest<HTMLElement>(`.${LabelClass}`);
        const root = label?.closest<HTMLElement>(`.${RootClass}`) ?? null;

        if (label === null || root === null)
            return;

        // F2 renames the caption the caret is on, the key the tree's rows answer too.
        if (domEvent.key === "F2") {
            if (!root.hasAttribute(RenamableAttribute))
                return;

            domEvent.preventDefault();
            this.startRename(label);
            return;
        }

        const labels = this.ownItems(root)
            .map(item => item.querySelector<HTMLElement>(`.${LabelClass}`))
            .filter((candidate): candidate is HTMLElement => candidate !== null);

        const next = resolveRovingTarget({ key: domEvent.key, items: labels, current: label, axis: "horizontal" });

        if (next === null)
            return;

        domEvent.preventDefault();

        const item = next.closest<HTMLElement>(`.${ItemClass}`);

        // A strip selects as the caret moves, the same rule the plain variant follows.
        if (item !== null)
            this.select(root, tabKey(item));

        next.focus();
    }

    /** Reordering moves the tab at once and reports afterwards, the way switching does. */
    private handleDragStart(domEvent: Event): void {
        const item = draggedItem(domEvent);

        if (item === null)
            return;

        // A tab whose item refuses to be dragged (a pinned one) stays where it is; only a tab's own drag is refused here —
        // this listener sees every drag on the page.
        if (rowOf(item).hasAttribute(UndraggableAttribute)) {
            domEvent.preventDefault();
            return;
        }

        markDragStart(domEvent, item.closest(`.${RootClass}`) ?? item, item, DraggingModifier, tabKey(item));

        const row = rowOf(item);

        this.dragStart = row.parentNode === null ? null : { parent: row.parentNode, next: row.nextSibling };
    }

    private handleDragOver(domEvent: Event): void {
        if (!(domEvent instanceof DragEvent) || !(domEvent.target instanceof Element))
            return;

        const over = domEvent.target.closest<HTMLElement>(`.${CaptionClass}`)?.closest<HTMLElement>(`.${ItemClass}`) ?? null;
        const root = over?.closest<HTMLElement>(`.${RootClass}`) ?? null;

        if (over === null || root === null)
            return;

        const dragging = root.querySelector<HTMLElement>(`.${DraggingModifier}`);

        if (dragging === null || dragging === over)
            return;

        domEvent.preventDefault();

        if (domEvent.dataTransfer !== null)
            domEvent.dataTransfer.dropEffect = "move";

        // Which side of the tab under the pointer decides the insertion point, so nothing is dropped on a gap.
        const bounds = over.querySelector<HTMLElement>(`.${CaptionClass}`)?.getBoundingClientRect();

        if (bounds === undefined)
            return;

        const before = domEvent.clientX < bounds.left + bounds.width / 2;

        // The host's own child moves — the wrapper round the tab, not the tab out of it into another's wrapper.
        const draggingRow = rowOf(dragging);
        const overRow = rowOf(over);

        overRow.parentElement?.insertBefore(draggingRow, before ? overRow : overRow.nextElementSibling);
    }

    private handleDragEnd(domEvent: Event): void {
        const item = draggedItem(domEvent);

        if (item === null)
            return;

        item.classList.remove(DraggingModifier);

        const start = this.dragStart;

        this.dragStart = null;

        // A cancelled or invalid drop (dropped outside a target, or Escape) undoes the live reorder instead of committing it.
        if (domEvent instanceof DragEvent && domEvent.dataTransfer?.dropEffect === "none" && start !== null) {
            start.parent.insertBefore(rowOf(item), start.next);
            return;
        }

        this.commitOrder(item);
    }

    /** The dropped tab takes the midpoint between its new neighbours, so no other tab is renumbered. */
    private commitOrder(item: HTMLElement): void {
        const row = rowOf(item);
        const previous = readOrder(itemOf(row.previousElementSibling));
        const next = readOrder(itemOf(row.nextElementSibling));

        const order = previous === null && next === null ? 0
            : previous === null ? next! - 1
                : next === null ? previous + 1
                    : (previous + next) / 2;

        if (readOrder(item) === order)
            return;

        item.setAttribute(TabOrderAttribute, String(order));
        item.dispatchEvent(new Event("change", { bubbles: true }));
    }

    private select(root: HTMLElement, key: string): void {
        writeSelectedKey(root, key, { attribute: TabsSelectedAttribute, bindingAttribute: BindSelectedKeyAttribute, apply: target => this.apply(target) });
    }

    private ownItems(root: HTMLElement): HTMLElement[] {
        return ownDescendants(root, `.${ItemClass}`, `.${RootClass}`);
    }
}

/** The items host's child that holds a tab: the tab itself when nothing wraps it, else its wrapper. */
function rowOf(item: HTMLElement): HTMLElement {
    const parent = item.parentElement;

    return parent !== null && !parent.hasAttribute(ItemsHostAttribute) && parent.closest(`[${ItemsHostAttribute}]`) === parent.parentElement
        ? parent
        : item;
}

function itemOf(row: Element | null): Element | null {
    if (row === null)
        return null;

    return row.matches(`.${ItemClass}`) ? row : row.querySelector(`.${ItemClass}`);
}

function draggedItem(domEvent: Event): HTMLElement | null {
    if (!(domEvent.target instanceof Element))
        return null;

    const caption = domEvent.target.closest<HTMLElement>(`.${CaptionClass}`);

    return caption?.closest<HTMLElement>(`.${ItemClass}`) ?? null;
}

/** Puts `element` exactly where `target` sits inside `container`, in the same type. */
function readOrder(item: Element | null): number | null {
    const value = item?.getAttribute(TabOrderAttribute) ?? null;

    if (value === null)
        return null;

    const order = Number(value);

    return Number.isFinite(order) ? order : null;
}

/** A tab is keyed by its item, so the key sits on the wrapper the items host renders, not on the tab. */
function tabKey(item: HTMLElement): string {
    return item.closest(`[${ComponentKeyAttribute}]`)?.getAttribute(ComponentKeyAttribute) ?? "";
}
