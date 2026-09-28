// The items variant of a tabs strip: captions and pages come from one collection, so a tab's key is the item's own key. The strip
// runs its own tab menu: the built-in entries it chose, as the tab it was opened on allows, and the application's entries raised
// with the tab's key.

import {
    BindSelectedKeyAttribute, ComponentKeyAttribute, ContextMenuAttribute, ItemsHostAttribute, MenuGroupEntrySelector, MenuItemKindAttribute, PassiveMenuEntrySelector,
    TabCaptionAttribute, TabOrderAttribute, TabPinnedAttribute, TabsMenuAttribute, TabsRemovesAttribute, TabsRenamableAttribute, TabsSelectedAttribute,
    UndraggableAttribute, TabsDraggableAttribute, TabsUnremovableAttribute, UnremovableAttribute, UnrenamableAttribute, VisibilityTierAttributes
} from "../addressing/dom-attributes";
import { EffectRegistry } from "../effects/effect-registry";
import { EventRegistration } from "../events/event-descriptor";
import { getIdValue, RenameTabClientEffect } from "../metadata/metadata-index";
import { logWarn } from "../runtime/logger";
import { ContextMenuOpeningDetail, ContextMenuOpeningEventName } from "./context-menu-engine";
import { happenedInside, observeComponents } from "./dom-mutations";
import { markDragStart } from "./drag-marks";
import { isLaidOut } from "./element-visibility";
import { openInlineRename } from "./inline-rename";
import { ownDescendants } from "./own-descendants";
import { applyRovingTabIndex, resolveRovingTarget } from "./roving-focus";
import { writeSelectedKey } from "./selected-key";
import { OverflowButtonClass, StripFitter } from "./strip-overflow";
import {
    MenuRow, PinEntry, RemoveSeparatorEntry, RenameEntry, SeparatorEntry, TabMenuName, TabMenuPrefix, UnpinEntry, readTabMenuChoice, shownRules, tabMenuEntries
} from "./tab-menu";
import { StripTab, ordersAfterMove, pinnedBoundary } from "./tab-order";

const RootClass = "ui-tabs-view";
const ItemClass = "ui-tab-item";
const LabelClass = "ui-tab-item__label";
const CloseClass = "ui-tab-item__close";
const RenameClass = "ui-tab-item__rename";
const CaptionClass = "ui-tab-item__caption";
const PinClass = "ui-tab-item__pin";
const TitleSelector = ".ui-text__title";
const DraggingModifier = "ui-tab-item--dragging";
const OverflowedModifier = "ui-tab-item__caption--overflowed";
const OverflowingModifier = "ui-tabs-view--overflowing";
const NoOverflowModifier = "ui-tabs-view--no-overflow";
const PageClass = "ui-tab-item__page";
const SelectedModifier = "ui-tab-item--selected";

const MenuEntrySelector = ".ui-menu-item";

/** An application's entry of the tab menu, raised on the strip: EventNames.TabMenuEntry. */
const TabMenuEntryEventName = "tab-menu-entry";

type TabMenuEntryDetail = {
    readonly keys: readonly string[];
};

/** How the pipeline reads the tab menu's entry event: its keys are the entry's and the tab's, in place of the chain above the strip. */
export const TabMenuEntryEvent: { readonly name: string; readonly registration: Omit<EventRegistration<CustomEvent<TabMenuEntryDetail>>, "name"> } = {
    name: TabMenuEntryEventName,
    registration: { dynamicParameters: context => context.domEvent.detail?.keys ?? null }
};

/** Written on the host: what the caption strip took of it, so the page below can fill the rest. */
const StripHeightVariable = "--ui-tabs-view-strip";

export type TabsViewEngineOptions = {
    readonly root?: ParentNode;
    readonly effects?: EffectRegistry;
};

export class TabsViewEngine {
    private readonly root: ParentNode;
    private readonly fitter: StripFitter;

    // Where the dragged tab's row sat before the drag, so a cancelled drop can put it back rather than commit the live reorder.
    private dragStart: { readonly parent: Node; readonly next: Node | null } | null = null;

    // The strip and the key of the tab its menu was last opened on, which the menu's entries act on: a key, since the tab's row
    // may be drawn again while the menu stands open.
    private menuTab: { readonly root: HTMLElement; readonly key: string } | null = null;

    public constructor(options: TabsViewEngineOptions = {}) {
        this.root = options.root ?? document;
        this.fitter = new StripFitter({
            rootClass: RootClass,
            overflowingClass: OverflowingModifier,
            wrapsClass: NoOverflowModifier,
            hiddenClass: OverflowedModifier,
            refit: root => this.apply(root),
            pick: (root, key) => this.pickFromOverflow(root, key)
        });

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

        this.root.addEventListener(ContextMenuOpeningEventName, domEvent => this.prepareMenu(domEvent));
        this.root.addEventListener("click", domEvent => this.handleClick(domEvent), true);
        this.root.addEventListener("dblclick", domEvent => this.handleDoubleClick(domEvent), true);
        this.root.addEventListener("dragstart", domEvent => this.handleDragStart(domEvent), true);
        this.root.addEventListener("dragover", domEvent => this.handleDragOver(domEvent), true);
        this.root.addEventListener("drop", domEvent => this.handleDrop(domEvent), true);
        this.root.addEventListener("dragend", domEvent => this.handleDragEnd(domEvent), true);
        this.root.addEventListener("keydown", domEvent => this.handleKeydown(domEvent), true);

        // Tabs arrive with the collection, so childList counts as much as the selected attribute; a strip whose Draggable switches
        // live rewrites every caption's draggable flag, so that's watched too. What happens inside a page is the page's own: a table
        // patched there must not re-measure the strip with a forced layout on every push.
        observeComponents(
            this.root,
            `.${RootClass}`,
            { childList: true, attributeFilter: [TabsSelectedAttribute, TabsDraggableAttribute, ...VisibilityTierAttributes], relevant: mutation => !happenedInside(mutation, `.${PageClass}`, `.${RootClass}`) },
            views => {
                for (const view of views)
                    this.apply(view);
            }
        );
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
        let currentPage: HTMLElement | null = null;

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

            if (own)
                currentPage = item.querySelector<HTMLElement>(`.${PageClass}`);
        }

        this.fitCaptions(root, captions, currentCaption);
        this.writeStripHeight(root, currentPage);

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

    /**
     * How much of the host the strip took, written on the host as a variable the stylesheet reads. The strip and page are lines of
     * one wrapping flex, so a page has no way of its own to fill what's left; this variable gives it one.
     */
    private writeStripHeight(root: HTMLElement, page: HTMLElement | null): void {
        const host = this.hostOf(root);

        if (host === null || page === null || !isLaidOut(page))
            return;

        const strip = Math.max(0, Math.round(page.getBoundingClientRect().top - host.getBoundingClientRect().top));

        host.style.setProperty(StripHeightVariable, `${strip}px`);
    }

    private hostOf(root: HTMLElement): HTMLElement | null {
        return root.querySelector<HTMLElement>(`:scope > [${ItemsHostAttribute}]`);
    }

    /** Hides the captions past the strip's room and shows the "…" control when any is hidden. */
    private fitCaptions(root: HTMLElement, captions: readonly HTMLElement[], selected: HTMLElement | null): void {
        const host = this.hostOf(root);
        const button = root.querySelector<HTMLElement>(`:scope > .${OverflowButtonClass}`);

        // The host holds the pages too: its width is the strip's room, and a page growing taller changes nothing on the strip.
        if (host !== null && button !== null)
            this.fitter.fit(root, { room: host, button, captions, selected });
    }

    /** A tab picked from the list is the current one, fitted onto the strip first, and the keyboard carries on from its caption. */
    private pickFromOverflow(root: HTMLElement, key: string): void {
        this.select(root, key);
        this.ownItems(root).find(item => tabKey(item) === key)?.querySelector<HTMLElement>(`.${LabelClass}`)?.focus({ preventScroll: true });
    }

    private toggleOverflow(root: HTMLElement, button: HTMLElement): void {
        this.fitter.toggleList(root, button, () => {
            const selected = root.getAttribute(TabsSelectedAttribute) ?? "";

            return this.ownItems(root).filter(isLaidOut).map(item => ({
                key: tabKey(item),
                title: item.querySelector(`.${LabelClass}`)?.textContent?.trim() ?? tabKey(item),
                current: tabKey(item) === selected
            }));
        });
    }

    /**
     * Leaves in the tab menu what the strip chose and the tab it was opened on allows, and a rule only between two shown entries; a
     * menu left with nothing to offer stays shut.
     */
    private prepareMenu(domEvent: Event): void {
        const menu = domEvent.target;

        if (!(domEvent instanceof CustomEvent) || !(menu instanceof HTMLElement) || menu.getAttribute(ContextMenuAttribute) !== TabMenuName)
            return;

        const root = menu.parentElement;
        const item = (domEvent.detail as ContextMenuOpeningDetail).target.closest<HTMLElement>(`.${ItemClass}`);

        if (root === null || !root.classList.contains(RootClass) || item === null || item.closest(`.${RootClass}`) !== root) {
            domEvent.preventDefault();
            return;
        }

        const offered = offeredEntries(root, item);
        const rows = menuRows(menu);

        // An application's entry keeps its own visibility; a built-in one shows as offered.
        const kinds = rows.map((row): MenuRow => {
            if (isRule(row))
                return "rule";

            const shown = offered.get(row.getAttribute(ComponentKeyAttribute) ?? "");

            if (shown !== undefined)
                row.style.display = shown ? "" : "none";

            return (shown ?? isLaidOut(row)) ? "shown" : "hidden";
        });

        shownRules(kinds).forEach((shown, i) => {
            if (kinds[i] === "rule")
                rows[i].style.display = shown ? "" : "none";
        });

        if (!kinds.includes("shown")) {
            domEvent.preventDefault();
            return;
        }

        this.menuTab = { root, key: tabKey(item) };
    }

    /** An entry of a strip's tab menu: the strip's own run here, an application's is raised with the tab the menu was opened on. */
    private handleMenuEntry(target: Element): boolean {
        const menu = target.closest<HTMLElement>(`[${ContextMenuAttribute}="${TabMenuName}"]`);
        const root = menu?.parentElement ?? null;
        const entry = target.closest<HTMLElement>(MenuEntrySelector);

        if (menu === null || root === null || !root.classList.contains(RootClass) || entry === null || !menu.contains(entry))
            return false;

        const key = entry.closest(`[${ComponentKeyAttribute}]`)?.getAttribute(ComponentKeyAttribute) ?? "";
        const opened = this.menuTab;
        const item = opened === null || opened.root !== root ? undefined : this.ownItems(root).find(candidate => tabKey(candidate) === opened.key);

        // A group's own entry opens its block, a rule or a caption runs nothing, and a tab closed while the menu stood open has none.
        if (key.length === 0 || entry.matches(`${MenuGroupEntrySelector}, ${PassiveMenuEntrySelector}`) || item === undefined)
            return true;

        if (!key.startsWith(TabMenuPrefix)) {
            root.dispatchEvent(new CustomEvent<TabMenuEntryDetail>(TabMenuEntryEventName, { bubbles: true, detail: { keys: [key, tabKey(item)] } }));
            return true;
        }

        // Asked again at the click: the strip's choice or the tab may have changed while the menu stood open.
        if (offeredEntries(root, item).get(key) !== true)
            return true;

        switch (key) {
            case RenameEntry: {
                const label = item.querySelector<HTMLElement>(`.${LabelClass}`);

                if (label !== null)
                    this.startRename(label);

                break;
            }
            case PinEntry:
            case UnpinEntry:
                this.setPinned(root, item, key === PinEntry);
                break;
            default:
                // Close and Delete are the one remove entry, worded two ways: both do what the cross does.
                item.dispatchEvent(new Event("remove", { bubbles: true }));
                break;
        }

        return true;
    }

    /**
     * Pins or unpins a tab and moves it to the boundary of the pinned ones, the strip's head; both are written back through the
     * tab's own values, the pin as its state and the place as its order, the way a drag writes its order.
     */
    private setPinned(root: HTMLElement, item: HTMLElement, pinned: boolean): void {
        if (item.hasAttribute(TabPinnedAttribute) === pinned)
            return;

        const pin = item.querySelector<HTMLElement>(`:scope > .${CaptionClass} > .${PinClass}`);

        item.toggleAttribute(TabPinnedAttribute, pinned);

        if (pin !== null) {
            pin.toggleAttribute(TabPinnedAttribute, pinned);
            pin.dispatchEvent(new Event("change", { bubbles: true }));
        }

        const items = this.ownItems(root);
        const others = items.filter(other => other !== item);
        const index = pinnedBoundary(others.map(stripTab));

        // Already standing there, the tab's order is already between its neighbours; a tab alone always is.
        if (items.indexOf(item) === index)
            return;

        const next = others[index];

        if (next !== undefined)
            rowOf(next).before(rowOf(item));
        else
            rowOf(others[others.length - 1]).after(rowOf(item));

        writeOrders([...others.slice(0, index), item, ...others.slice(index)], index);
    }

    private handleClick(domEvent: Event): void {
        if (!(domEvent.target instanceof Element))
            return;

        if (this.handleMenuEntry(domEvent.target))
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
        if (!isRemovable(root, item))
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

        if (label === null || root === null || !root.hasAttribute(TabsRenamableAttribute))
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
            if (!root.hasAttribute(TabsRenamableAttribute))
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

        // A tab whose item refuses to be dragged, and a pinned one, stay where they are; only its own drag is refused, since
        // this listener sees every drag on the page.
        if (rowOf(item).hasAttribute(UndraggableAttribute) || item.hasAttribute(TabPinnedAttribute)) {
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

        if (dragging === null)
            return;

        // Accepted over every tab of the strip, the dragged one included, since a drop the browser wasn't told to accept ends the
        // drag as cancelled and the live reorder would be put back.
        domEvent.preventDefault();

        if (domEvent.dataTransfer !== null)
            domEvent.dataTransfer.dropEffect = "move";

        if (dragging === over)
            return;

        // Which side of the tab under the pointer decides the insertion point, so nothing is dropped on a gap.
        const bounds = over.querySelector<HTMLElement>(`.${CaptionClass}`)?.getBoundingClientRect();

        if (bounds === undefined)
            return;

        // The host's own child moves — the wrapper round the tab, not the tab out of it into another's wrapper.
        const draggingRow = rowOf(dragging);

        // The pinned tabs are the strip's head, as a browser keeps them: a tab dragged over one lands right after the last of them.
        const pinnedHead = over.hasAttribute(TabPinnedAttribute) ? lastPinnedRow(root, draggingRow) : null;
        const overRow = pinnedHead ?? rowOf(over);
        const before = pinnedHead === null && domEvent.clientX < bounds.left + bounds.width / 2;
        const reference = before ? overRow : overRow.nextElementSibling;

        if (reference !== draggingRow)
            overRow.parentElement?.insertBefore(draggingRow, reference);
    }

    /** The drop itself: accepted so the browser reports a move at dragend; the order was already rebuilt under the pointer. */
    private handleDrop(domEvent: Event): void {
        if (!(domEvent instanceof DragEvent) || !(domEvent.target instanceof Element))
            return;

        const root = domEvent.target.closest<HTMLElement>(`.${RootClass}`);

        if (root === null || root.querySelector(`.${DraggingModifier}`) === null)
            return;

        domEvent.preventDefault();

        if (domEvent.dataTransfer !== null)
            domEvent.dataTransfer.dropEffect = "move";
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

        // Decided by where the tab stands against where it started, not by comparing orders, since the order read off the element
        // can be one the server has since moved, missing a move judged "no change" by it.
        const row = rowOf(item);

        if (start !== null && row.parentNode === start.parent && row.nextSibling === start.next)
            return;

        const root = item.closest<HTMLElement>(`.${RootClass}`);

        if (root === null)
            return;

        const items = this.ownItems(root);

        writeOrders(items, items.indexOf(item));
    }

    private select(root: HTMLElement, key: string): void {
        writeSelectedKey(root, key, { attribute: TabsSelectedAttribute, bindingAttribute: BindSelectedKeyAttribute, apply: target => this.apply(target) });
    }

    private ownItems(root: HTMLElement): HTMLElement[] {
        return ownDescendants(root, `.${ItemClass}`, `.${RootClass}`);
    }
}

/** The row of the last pinned tab in the strip, leaving the dragged row out; null when nothing is pinned. */
function lastPinnedRow(root: HTMLElement, draggingRow: HTMLElement): HTMLElement | null {
    let last: HTMLElement | null = null;

    for (const item of ownDescendants(root, `.${ItemClass}`, `.${RootClass}`)) {
        const row = rowOf(item);

        if (row !== draggingRow && item.hasAttribute(TabPinnedAttribute))
            last = row;
    }

    return last;
}

/** Whether a tab may be closed: neither the strip nor the tab's item refuses it. */
function isRemovable(root: HTMLElement, item: HTMLElement): boolean {
    return !root.hasAttribute(TabsUnremovableAttribute) && !rowOf(item).hasAttribute(UnremovableAttribute) && !item.hasAttribute(UnremovableAttribute);
}

/**
 * The built-in entries of the tab menu a tab is offered: what the strip chose, as the tab allows. Rename needs only the item's
 * `CanRename`, not the strip's `Renamable`, which governs the double click and F2; the remove entry needs a remove command and a removable tab.
 */
function offeredEntries(root: HTMLElement, item: HTMLElement): ReadonlyMap<string, boolean> {
    return tabMenuEntries(readTabMenuChoice(root.getAttribute(TabsMenuAttribute)), {
        pinned: item.hasAttribute(TabPinnedAttribute),
        renamable: !rowOf(item).hasAttribute(UnrenamableAttribute),
        removable: root.hasAttribute(TabsRemovesAttribute) && isRemovable(root, item)
    });
}

/** Whether a row of the tab menu is a rule: one of the strip's own, or one among the application's entries. */
function isRule(row: HTMLElement): boolean {
    const key = row.getAttribute(ComponentKeyAttribute);

    return key === SeparatorEntry || key === RemoveSeparatorEntry || row.querySelector(`:scope > [${MenuItemKindAttribute}="separator"]`) !== null;
}

/** The tab menu's entries and rules, its items host's own rows: an entry's sub-entries are rows of a host of their own. */
function menuRows(menu: HTMLElement): HTMLElement[] {
    const host = menu.querySelector<HTMLElement>(`[${ItemsHostAttribute}]`);

    return host === null ? [] : Array.from(host.children).filter((row): row is HTMLElement => row instanceof HTMLElement && row.hasAttribute(ComponentKeyAttribute));
}

/** The items host's child that holds a tab: the tab itself when nothing wraps it, else its wrapper. */
function rowOf(item: HTMLElement): HTMLElement {
    const parent = item.parentElement;

    return parent !== null && !parent.hasAttribute(ItemsHostAttribute) && parent.closest(`[${ItemsHostAttribute}]`) === parent.parentElement
        ? parent
        : item;
}

function draggedItem(domEvent: Event): HTMLElement | null {
    if (!(domEvent.target instanceof Element))
        return null;

    const caption = domEvent.target.closest<HTMLElement>(`.${CaptionClass}`);

    return caption?.closest<HTMLElement>(`.${ItemClass}`) ?? null;
}

/**
 * Writes the orders a move leaves a strip with — `items` in their new order, the moved tab at `index`: the moved tab's own
 * between its neighbours, so no other tab is renumbered where that holds, each through the tab's two-way `Order`.
 */
function writeOrders(items: readonly HTMLElement[], index: number): void {
    for (const [place, order] of ordersAfterMove(items.map(stripTab), index)) {
        items[place].setAttribute(TabOrderAttribute, String(order));
        items[place].dispatchEvent(new Event("change", { bubbles: true }));
    }
}

function stripTab(item: HTMLElement): StripTab {
    return { order: readOrder(item), pinned: item.hasAttribute(TabPinnedAttribute) };
}

/** The order a row was last written with, or null for a row that carries none or one that does not parse. */
function readOrder(item: Element): number | null {
    const value = item.getAttribute(TabOrderAttribute);

    if (value === null)
        return null;

    const order = Number(value);

    return Number.isFinite(order) ? order : null;
}

/** A tab is keyed by its item, so the key sits on the wrapper the items host renders, not on the tab. */
function tabKey(item: HTMLElement): string {
    return item.closest(`[${ComponentKeyAttribute}]`)?.getAttribute(ComponentKeyAttribute) ?? "";
}
