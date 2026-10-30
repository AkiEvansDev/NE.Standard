// A bound tab as the tabs view's items host holds it: in a wrapper of its own, or bare, and what it refuses read off both.

// With its extensions: the node test runner loads this module as it is.
import { ComponentKeyAttribute, ensureElementId, ItemsHostAttribute, MenuItemKindAttribute, TabIdPrefix, TabItemCaptionClass, TabItemClass, TabItemCloseClass, TabItemLabelClass, TabItemPageClass, TabPanelIdPrefix, TabPinnedAttribute, TabsMenuAttribute, TabsNoneRemovableAttribute, TabsRemovesAttribute, TabsUnremovableAttribute, TabsViewClass, TabsViewTablistClass, TextTitleClass, UnremovableAttribute, UnrenamableAttribute, writeAttribute } from "../addressing/dom-attributes.ts";
import { clientStrings } from "../rendering/client-strings.ts";
import { isInRenameField } from "./inline-rename.ts";
import { isInert, isItemRefused } from "./interactive-state.ts";
import { ownDescendants } from "./own-descendants.ts";
import { RemoveSeparatorEntry, SeparatorEntry, readTabMenuChoice, tabMenuEntries } from "./tab-menu.ts";
import type { StripTab } from "./tab-order.ts";

const TitleSelector = `.${TextTitleClass}`;

/** The items host's child that holds a tab: the tab itself when nothing wraps it, else its wrapper. */
export function rowOf(item: HTMLElement): HTMLElement {
    const parent = item.parentElement;

    return parent !== null && !parent.hasAttribute(ItemsHostAttribute) && parent.closest(`[${ItemsHostAttribute}]`) === parent.parentElement
        ? parent
        : item;
}

/** The items host of the strip a tab stands in; null for anything but a tab. */
export function stripHostOf(target: EventTarget | null): Element | null {
    return target instanceof HTMLElement && target.classList.contains(TabItemClass) ? rowOf(target).parentElement : null;
}

/** Whether a tab refuses a gesture by its mark: on its wrapper, the item's word, or on the tab itself, its template's. */
export function isTabRefused(item: HTMLElement, attribute: string): boolean {
    return isItemRefused(rowOf(item), attribute);
}

/** The row of the last pinned tab in the strip, leaving the dragged row out; null when nothing is pinned. */
export function lastPinnedRow(root: HTMLElement, draggingRow: HTMLElement): HTMLElement | null {
    let last: HTMLElement | null = null;

    for (const item of ownDescendants(root, `.${TabItemClass}`, `.${TabsViewClass}`)) {
        const row = rowOf(item);

        if (row !== draggingRow && item.hasAttribute(TabPinnedAttribute))
            last = row;
    }

    return last;
}

/** Marks a strip none of whose tabs can be closed, which keeps no room for a close; the render marked the first paint. */
export function markNoneRemovable(root: HTMLElement, items: readonly HTMLElement[]): void {
    const none = !items.some(item => !isTabRefused(item, UnremovableAttribute));

    if (root.hasAttribute(TabsNoneRemovableAttribute) !== none)
        root.toggleAttribute(TabsNoneRemovableAttribute, none);
}

/**
 * Ties each tab to its page both ways and gives the strip's tablist its tabs: a caption and its page are one template's, side by side
 * in the items host, so the tablist owns the tabs (`aria-owns`) rather than holding them, and holds no page or close. A tab's close is
 * named after it, a tab the client drew too.
 */
export function ownTabs(root: HTMLElement, items: readonly HTMLElement[]): void {
    const tabs: string[] = [];

    for (const item of items) {
        const label = item.querySelector<HTMLElement>(`:scope > .${TabItemCaptionClass} > .${TabItemLabelClass}`);
        const page = item.querySelector<HTMLElement>(`:scope > .${TabItemPageClass}`);

        if (label === null)
            continue;

        const tab = ensureElementId(label, TabIdPrefix);

        tabs.push(tab);

        if (page !== null) {
            writeAttribute(label, "aria-controls", ensureElementId(page, TabPanelIdPrefix));
            writeAttribute(page, "aria-labelledby", tab);
        }

        nameClose(item, label);
    }

    const tablist = root.querySelector<HTMLElement>(`:scope > .${TabsViewTablistClass}`);

    if (tablist !== null)
        writeAttribute(tablist, "aria-owns", tabs.join(" "));
}

/** "Close {title}" on a tab's close, from the words its caption shows, unless it says so already (the render's, for a written title). */
function nameClose(item: HTMLElement, label: HTMLElement): void {
    const close = item.querySelector<HTMLElement>(`:scope > .${TabItemCaptionClass} > .${TabItemCloseClass}`);
    const title = label.querySelector(TitleSelector)?.textContent?.trim() ?? "";

    // Against the whole name the key writes: a title cut short ("Reports" renamed "Report") is still inside the old one.
    if (close === null || title.length === 0 || close.getAttribute("aria-label") === clientStrings.translate("ui.tabs.close", { title }))
        return;

    clientStrings.write(close, "aria-label", "ui.tabs.close", { title });
}

/** Whether a tab may be closed: neither the strip nor the tab's item refuses it. */
export function isRemovable(root: HTMLElement, item: HTMLElement): boolean {
    return !root.hasAttribute(TabsUnremovableAttribute) && !isTabRefused(item, UnremovableAttribute);
}

/** Whether Delete closes a tab: one the cross closes — removable, its close raising a command — and not pinned, as a browser keeps one. */
export function isClosable(root: HTMLElement, item: HTMLElement): boolean {
    return root.hasAttribute(TabsRemovesAttribute) && isRemovable(root, item) && !item.hasAttribute(TabPinnedAttribute) && !isInert(item);
}

/** The built-in tab-menu entries a tab is offered: what the strip chose, as the tab allows. */
export function offeredEntries(root: HTMLElement, item: HTMLElement): ReadonlyMap<string, boolean> {
    return tabMenuEntries(readTabMenuChoice(root.getAttribute(TabsMenuAttribute)), {
        pinned: item.hasAttribute(TabPinnedAttribute),
        // The item's CanRename alone: the strip's Renamable governs the double click and F2.
        renamable: !isTabRefused(item, UnrenamableAttribute),
        removable: root.hasAttribute(TabsRemovesAttribute) && isRemovable(root, item)
    });
}

/** Whether a row of the tab menu is a rule: one of the strip's own, or one among the application's entries. */
export function isRule(row: HTMLElement): boolean {
    const key = row.getAttribute(ComponentKeyAttribute);

    return key === SeparatorEntry || key === RemoveSeparatorEntry || row.querySelector(`:scope > [${MenuItemKindAttribute}="separator"]`) !== null;
}

/** The tab menu's entries and rules, its items host's own rows: an entry's sub-entries are rows of a host of their own. */
export function menuRows(menu: HTMLElement): HTMLElement[] {
    const host = menu.querySelector<HTMLElement>(`[${ItemsHostAttribute}]`);

    return host === null ? [] : Array.from(host.children).filter((row): row is HTMLElement => row instanceof HTMLElement && row.hasAttribute(ComponentKeyAttribute));
}

/** The label of the caption a press landed on — anywhere but its close or an open rename field. */
export function captionLabel(target: Element): HTMLElement | null {
    if (target.closest(`.${TabItemCloseClass}`) !== null || isInRenameField(target))
        return null;

    // The caption washes under the pointer as a whole, so it answers the press as a whole.
    return target.closest<HTMLElement>(`.${TabItemCaptionClass}`)?.querySelector<HTMLElement>(`:scope > .${TabItemLabelClass}`) ?? null;
}

export function draggedItem(domEvent: Event): HTMLElement | null {
    if (!(domEvent.target instanceof Element))
        return null;

    const caption = domEvent.target.closest<HTMLElement>(`.${TabItemCaptionClass}`);

    return caption?.closest<HTMLElement>(`.${TabItemClass}`) ?? null;
}

export function stripTab(item: HTMLElement): StripTab {
    return { pinned: item.hasAttribute(TabPinnedAttribute) };
}

/** A tab is keyed by its item, so the key sits on the wrapper the items host renders, not on the tab. */
export function tabKey(item: HTMLElement): string {
    return item.closest(`[${ComponentKeyAttribute}]`)?.getAttribute(ComponentKeyAttribute) ?? "";
}
