// Walking a menu from the keyboard, and firing an entry from its shortcut.

import { findOpenModalDialog } from "./open-dialogs.ts";
import { ownDescendants } from "./own-descendants.ts";
import { focusByPointer } from "./popup-focus.ts";
import { applyRovingTabIndex, isRovingCandidate, resolveRovingTarget } from "./roving-focus.ts";
import type { KeyboardShortcut } from "./keyboard-shortcut.ts";
import { matchesShortcut, parseShortcut, shortcutKey } from "./keyboard-shortcut.ts";
import type { TooltipWordsProvider } from "./tooltip-engine.ts";
import { isBottomBar, towardContent } from "./menu-group-engine.ts";
import { registerTooltipWords } from "./tooltip-engine.ts";
import { escapeInlineMarkup } from "../rendering/inline-markup.ts";
import { logWarn } from "../runtime/logger.ts";
import { CollapsedAttribute, MenuItemClass as ItemClass, MenuRailClass, MenuUnmatchedAttribute, PassiveMenuEntrySelector, TooltipAttribute } from "../addressing/dom-attributes.ts";

const RootClass = "ui-menu";
const SelectedModifier = "ui-menu-item--selected";
const ContextMenuClass = "ui-context-menu";

const HorizontalClass = "ui-orientation--horizontal";

// A rail's own entries (UIMenuDisplay.Rail), whose one-line label may be cut; a collapsed menu's, whose title is hidden; the title.
const RailEntrySelector = `.${MenuRailClass} > .ui-menu__host > .ui-menu__item > .${ItemClass}`;
const CollapsedEntrySelector = `.ui-menu[${CollapsedAttribute}] > .ui-menu__host > .ui-menu__item > .${ItemClass}`;
const TitledEntrySelector = `${RailEntrySelector}, ${CollapsedEntrySelector}`;
const TitleSelector = ":scope > .ui-button__content > .ui-text__body > .ui-text__header > .ui-text__title";

const ShortcutAttribute = "data-ui-menu-shortcut";

// A popup menu's entries, the only ones rendered as menu items (a check among them as a checkbox of the menu).
const PopupEntrySelector = "[role='menuitem'], [role='menuitemcheckbox']";

type ShortcutEntry = {
    readonly shortcut: KeyboardShortcut;
    readonly element: HTMLElement;
};

export type MenuEngineOptions = {
    readonly root?: ParentNode;
};

export class MenuEngine {
    private readonly root: ParentNode;
    private readonly shortcuts = new Map<string, ShortcutEntry | null>();
    private shortcutsStale = true;
    private tabStopsScheduled = false;

    public constructor(options: MenuEngineOptions = {}) {
        this.root = options.root ?? document;

        // The arrows are taken first; a shortcut waits for the bubble, so a field that takes the chord itself has prevented it.
        this.root.addEventListener("keydown", domEvent => this.handleEntryKeydown(domEvent), true);
        this.root.addEventListener("keydown", domEvent => this.handleShortcutKeydown(domEvent));
        this.root.addEventListener("focusin", domEvent => this.handleFocusIn(domEvent));
        this.root.addEventListener("pointermove", domEvent => this.handlePointerMove(domEvent), true);

        // The page's tooltip engine opens and closes an entry's hidden or cut title as any tooltip; this engine only says what it is.
        registerTooltipWords(EntryTitleWords);

        this.applyTabStops();

        if (this.root instanceof Node) {
            // Not observeComponents: any change stales the shortcuts (rebuilt on the next press); tab stops, which can't wait for a
            // press, rebuild only for a change that touched a menu, not every row a table draws.
            const observer = new MutationObserver(mutations => {
                this.shortcutsStale = true;

                if (mutations.some(touchesMenu))
                    this.scheduleTabStops();
            });

            // The search's mark too: an entry it hides can't stay the one Tab lands on.
            observer.observe(this.root, { childList: true, subtree: true, attributeFilter: [ShortcutAttribute, MenuUnmatchedAttribute] });
        }
    }

    private scheduleTabStops(): void {
        if (this.tabStopsScheduled)
            return;

        this.tabStopsScheduled = true;

        // A timer, not requestAnimationFrame: a background tab gets no frames.
        setTimeout(() => {
            this.tabStopsScheduled = false;
            this.applyTabStops();
        }, 0);
    }

    /** Gives every menu exactly one tab stop, so it can be entered from the keyboard. */
    private applyTabStops(): void {
        for (const menu of this.root.querySelectorAll<HTMLElement>(`.${RootClass}`)) {
            const items = this.ownItems(menu);

            if (items.length === 0)
                continue;

            // The current entry, so Tab lands where the user already is rather than at the top of the list.
            const current = items.find(item => item.classList.contains(SelectedModifier) && isRovingCandidate(item))
                ?? items.find(isRovingCandidate)
                ?? items[0];

            applyRovingTabIndex(items, current);
        }
    }

    /** Enter or Space presses the entry the caret is on; Arrow/Home/End walk the menu. */
    private handleEntryKeydown(domEvent: Event): void {
        if (!(domEvent instanceof KeyboardEvent) || domEvent.defaultPrevented || domEvent.isComposing || !(domEvent.target instanceof Element))
            return;

        const item = domEvent.target.closest<HTMLElement>(`.${ItemClass}`);
        const menu = item?.closest<HTMLElement>(`.${RootClass}`) ?? null;

        if (item === null) {
            this.enterFromContainer(domEvent);
            return;
        }

        if (menu === null)
            return;

        if (domEvent.key === "Enter" || domEvent.key === " ") {
            pressEntry(domEvent, item);
            return;
        }

        const items = this.ownItems(menu);

        const next = resolveRovingTarget({
            key: domEvent.key,
            items,
            current: item,
            // One axis only: the other arrows belong to whatever the menu sits in. A rail laid along the bottom bar runs across.
            axis: menu.classList.contains(HorizontalClass) || isBottomBar(menu) ? "horizontal" : "vertical"
        });

        if (next === null)
            return;

        domEvent.preventDefault();

        applyRovingTabIndex(items, next);
        next.focus();
    }

    /** A popup menu the pointer opened holds the keyboard itself, no entry current: the first arrow enters at the near end. */
    private enterFromContainer(domEvent: KeyboardEvent): void {
        const container = domEvent.target instanceof HTMLElement && domEvent.target.getAttribute("role") === "menu" ? domEvent.target : null;
        const menu = container === null ? null : container.matches(`.${RootClass}`) ? container : container.querySelector<HTMLElement>(`.${RootClass}`);

        if (menu === null)
            return;

        const items = this.ownItems(menu);
        const next = resolveRovingTarget({ key: domEvent.key, items, current: null, axis: menu.classList.contains(HorizontalClass) ? "horizontal" : "vertical" });

        if (next === null)
            return;

        domEvent.preventDefault();

        applyRovingTabIndex(items, next);
        next.focus();
    }

    /** Keeps the menu a single tab stop: whichever entry the user last reached is the one Tab returns to. */
    private handleFocusIn(domEvent: Event): void {
        if (!(domEvent.target instanceof Element))
            return;

        const item = domEvent.target.closest<HTMLElement>(`.${ItemClass}`);
        const menu = item?.closest<HTMLElement>(`.${RootClass}`) ?? null;

        if (item !== null && menu !== null)
            applyRovingTabIndex(this.ownItems(menu), item);
    }

    /** In a popup menu the pointer moves the keyboard's entry, as in a native menu. */
    private handlePointerMove(domEvent: Event): void {
        const item = domEvent.target instanceof Element ? domEvent.target.closest<HTMLElement>(`.${ItemClass}`) : null;

        // A popup's entries only: a sidebar's entry focused on hover would open its tooltip at once and keep it.
        if (item === null || item === document.activeElement || !item.matches(PopupEntrySelector) || item.matches(PassiveMenuEntrySelector) || !isRovingCandidate(item))
            return;

        // The menu's keyboard is in it: on an entry, or on the menu itself where the pointer opened it.
        const active = document.activeElement;
        const holdsMenu = active instanceof HTMLElement && active.getAttribute("role") === "menu" && active.contains(item);

        if (holdsMenu || item.closest(`.${RootClass}`)?.contains(active) === true)
            focusByPointer(item);
    }

    /** Fires an entry from its shortcut anywhere on the page, a field included, unless the field took the chord itself. */
    private handleShortcutKeydown(domEvent: Event): void {
        if (!(domEvent instanceof KeyboardEvent) || domEvent.defaultPrevented || domEvent.isComposing)
            return;

        if (this.shortcutsStale)
            this.rebuildShortcuts();

        // An unmodified key belongs to the caret's text.
        if (this.shortcuts.size === 0 || isTypingTarget(domEvent))
            return;

        const modal = findOpenModalDialog(this.root);

        for (const entry of this.shortcuts.values()) {
            // A null entry is a claimed-twice combination: it fires nothing, on purpose.
            if (entry === null || !matchesShortcut(entry.shortcut, domEvent))
                continue;

            // An open modal keeps outside entries out of reach, as it does the pointer.
            if (!isRovingCandidate(entry.element) || (modal !== null && !modal.contains(entry.element)))
                return;

            domEvent.preventDefault();
            entry.element.click();

            return;
        }
    }

    /** Rebuilds the shortcut registry; a combination claimed by two entries fires neither. */
    private rebuildShortcuts(): void {
        this.shortcuts.clear();
        this.shortcutsStale = false;

        for (const element of this.root.querySelectorAll<HTMLElement>(`[${ShortcutAttribute}]`)) {
            // A context menu's entry acts on what the menu was opened on, which a shortcut has none of: its text only labels a key bound elsewhere.
            if (element.closest(`.${ContextMenuClass}`) !== null)
                continue;

            const shortcut = parseShortcut(element.getAttribute(ShortcutAttribute));

            if (shortcut === null) {
                logWarn("menu shortcut could not be parsed.", { element, value: element.getAttribute(ShortcutAttribute) });
                continue;
            }

            const key = shortcutKey(shortcut);

            if (!this.shortcuts.has(key)) {
                this.shortcuts.set(key, { shortcut, element });
                continue;
            }

            const existing = this.shortcuts.get(key);

            if (existing !== null) {
                logWarn("menu shortcut is claimed twice and will fire nothing.", {
                    shortcut: element.getAttribute(ShortcutAttribute),
                    elements: [existing?.element, element]
                });
            }

            this.shortcuts.set(key, null);
        }
    }

    /** This menu's own entries, excluding a nested menu's and the kinds that are not controls. */
    private ownItems(menu: HTMLElement): HTMLElement[] {
        return ownDescendants(menu, `.${ItemClass}:not(${PassiveMenuEntrySelector})`, `.${RootClass}`);
    }
}

/**
 * An entry's title as its tooltip where the menu hides it (folded to its icons) or cuts it (a rail's label, only when cut); an entry
 * with a tooltip of its own says that instead.
 */
const EntryTitleWords: TooltipWordsProvider = {
    anchor: target => target.closest(TitledEntrySelector),
    words: entry => {
        if ((entry.getAttribute(TooltipAttribute) ?? "").trim().length > 0)
            return null;

        const title = entry.querySelector<HTMLElement>(TitleSelector);
        const words = title?.textContent?.trim() ?? "";

        if (title === null || words.length === 0 || (entry.matches(RailEntrySelector) && title.scrollWidth <= title.clientWidth))
            return null;

        // The words as the label shows them, never read again as markup.
        return escapeInlineMarkup(words);
    },
    // Beside the entry, toward the content, where above it the words would cover the entry before it.
    placement: entry => {
        const menu = entry.closest(`.${RootClass}`);

        return menu === null ? null : towardContent(menu);
    }
};

/** The keyboard's press on an entry; Enter on one with an address is the browser's to follow. */
function pressEntry(domEvent: KeyboardEvent, entry: HTMLElement): void {
    if (domEvent.target !== entry || domEvent.ctrlKey || domEvent.metaKey || domEvent.altKey || entry.matches(PassiveMenuEntrySelector) || !isRovingCandidate(entry))
        return;

    if (entry.hasAttribute("href") && domEvent.key === "Enter")
        return;

    // An entry is a link, and one without an address has no press of its own for Enter or Space.
    domEvent.preventDefault();

    if (!domEvent.repeat)
        entry.click();
}

/** Whether a mutation happened in a menu or brought one: only then are the tab stops worth laying out again. */
function touchesMenu(mutation: MutationRecord): boolean {
    const target = mutation.target instanceof Element ? mutation.target : mutation.target.parentElement;

    if (target !== null && target.closest(`.${RootClass}`) !== null)
        return true;

    for (const node of mutation.addedNodes) {
        if (node instanceof Element && (node.classList.contains(RootClass) || node.querySelector(`.${RootClass}`) !== null))
            return true;
    }

    return false;
}

/** Whether an unmodified press belongs to text the user is editing. */
function isTypingTarget(domEvent: KeyboardEvent): boolean {
    if (domEvent.ctrlKey || domEvent.metaKey || domEvent.altKey)
        return false;

    const target = domEvent.target;

    if (!(target instanceof HTMLElement))
        return false;

    return target.isContentEditable || target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement;
}
