// Walking a menu from the keyboard; an entry's shortcut is the page's registry's (shortcut-engine.ts).

import { isFieldKey } from "./caret-fields.ts";
import { focusByPointer } from "./popup-focus.ts";
import { typeAheadEntry } from "./popup-list.ts";
import { applyRovingTabIndex, moveRovingFocus, isRovingCandidate, resolveRovingTarget } from "./roving-focus.ts";
import type { TooltipWordsProvider } from "./tooltip-engine.ts";
import { isComposing, isPlainKey, SpaceRelease } from "./keyboard-shortcut.ts";
import { isBottomBar, isFlyoutGroup, menuWalk, submenuGroupOf, towardContent, walkRootOf } from "./menu-group-engine.ts";
import { registerTooltipWords } from "./tooltip-engine.ts";
import { typeAheadCharacter } from "./type-ahead.ts";
import { escapeInlineMarkup } from "../rendering/inline-markup.ts";
import { CollapsedAttribute, MenuGroupEntrySelector, MenuItemClass as ItemClass, MenuItemSelectedClass as SelectedModifier, MenuOpenAttribute, MenuRailClass, MenuRootClass as RootClass, MenuSearchAttribute, MenuUnmatchedAttribute, PassiveMenuEntrySelector, TooltipAttribute } from "../addressing/dom-attributes.ts";

const HorizontalClass = "ui-orientation--horizontal";

// A rail's own entries (UIMenuDisplay.Rail), whose one-line label may be cut; a collapsed menu's, whose title is hidden; the title.
const RailEntrySelector = `.${MenuRailClass} > .ui-menu__host > .ui-menu__item > .${ItemClass}`;
const CollapsedEntrySelector = `.ui-menu[${CollapsedAttribute}] > .ui-menu__host > .ui-menu__item > .${ItemClass}`;
const TitledEntrySelector = `${RailEntrySelector}, ${CollapsedEntrySelector}`;
const TitleSelector = ":scope > .ui-button__content > .ui-text__body > .ui-text__header > .ui-text__title";

// A popup menu's entries, the only ones rendered as menu items (a check among them as a checkbox of the menu).
const PopupEntrySelector = "[role='menuitem'], [role='menuitemcheckbox']";

export type MenuEngineOptions = {
    readonly root?: ParentNode;
};

export class MenuEngine {
    private readonly root: ParentNode;
    private tabStopsScheduled = false;

    // The entry a Space went down on: it presses on the key's release, as a button does.
    private readonly space = new SpaceRelease();

    public constructor(options: MenuEngineOptions = {}) {
        this.root = options.root ?? document;

        // The arrows are taken first, before the page's shortcuts, which wait for the bubble.
        this.root.addEventListener("keydown", domEvent => this.handleEntryKeydown(domEvent), true);
        this.root.addEventListener("keyup", domEvent => this.space.release(domEvent, isRovingCandidate), true);
        this.root.addEventListener("focusin", domEvent => this.handleFocusIn(domEvent));
        this.root.addEventListener("pointermove", domEvent => this.handlePointerMove(domEvent), true);

        // The page's tooltip engine opens and closes an entry's hidden or cut title as any tooltip; this engine only says what it is.
        registerTooltipWords(EntryTitleWords);

        this.applyTabStops();

        if (this.root instanceof Node) {
            // Not observeComponents: tab stops rebuild only for a change that touched a menu, not every row a table draws.
            const observer = new MutationObserver(mutations => {
                if (mutations.some(touchesMenu))
                    this.scheduleTabStops();
            });

            // The search's mark too: an entry it hides can't stay the one Tab lands on; a group opening or closing changes the walk.
            observer.observe(this.root, { childList: true, subtree: true, attributeFilter: [MenuUnmatchedAttribute, MenuOpenAttribute] });
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

    /** Gives every menu exactly one tab stop, so it can be entered from the keyboard; a group's inline block is its menu's. */
    private applyTabStops(): void {
        for (const menu of this.root.querySelectorAll<HTMLElement>(`.${RootClass}`)) {
            if (walkRootOf(menu) !== menu)
                continue;

            const items = menuWalk(menu);

            if (items.length === 0)
                continue;

            // The entry the keyboard is on, else the current one, else the one it last left, so Tab lands where the user already is
            // rather than at the top of the list. Two stops in one walk are a group's block drawn with its own: neither is the last left.
            const stops = items.filter(item => item.tabIndex === 0 && isRovingCandidate(item));
            const current = items.find(item => item === document.activeElement)
                ?? items.find(item => item.classList.contains(SelectedModifier) && isRovingCandidate(item))
                ?? (stops.length === 1 ? stops[0] : undefined)
                ?? items.find(isRovingCandidate)
                ?? items[0];

            applyRovingTabIndex(items, current);
        }
    }

    /**
     * Enter presses the entry the caret is on, Space on its release; Arrow/Home/End walk the menu, round past its ends; Right opens a
     * group and Left closes it; a typed letter reaches the next entry it begins.
     */
    private handleEntryKeydown(domEvent: Event): void {
        if (!(domEvent instanceof KeyboardEvent) || domEvent.defaultPrevented || isFieldKey(domEvent) || isComposing(domEvent) || !(domEvent.target instanceof Element))
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
            this.pressEntry(domEvent, item);
            return;
        }

        const root = walkRootOf(menu);
        const items = menuWalk(root);
        const character = typeAheadCharacter(domEvent);

        // Taken whether or not an entry begins with it, as a select's list takes it: a bare-key shortcut is not the menu's prefix.
        if (character !== null) {
            domEvent.preventDefault();
            moveRovingFocus(items, typeAheadEntry(items, item, character));
            return;
        }

        // One axis only: the other arrows belong to whatever the menu sits in. A rail laid along the bottom bar runs across.
        const axis = root.classList.contains(HorizontalClass) || isBottomBar(root) ? "horizontal" : "vertical";

        if (!isPlainKey(domEvent) || this.handleGroupKey(domEvent, item, root, axis))
            return;

        // Up from the first entry of a menu with a search goes back to its field, where Down came from.
        const field = domEvent.key === "ArrowUp" && item === items.find(isRovingCandidate) ? searchFieldOf(root) : null;
        const next = field ?? resolveRovingTarget({ key: domEvent.key, items, current: item, axis });

        if (next === null)
            return;

        domEvent.preventDefault();

        if (next !== field)
            applyRovingTabIndex(items, next);

        next.focus();
    }

    /**
     * Right on a group's entry opens it — into a flyout's first entry, or its block unfolding inline, whose entries join the walk —
     * and on an open one goes into it; Left on an entry of a group, or on an inline group's open entry, closes the group, the keyboard
     * back on its entry. A horizontal menu opens with Down, a bottom bar's toward the content, Up. Escape closes a flyout as any popup.
     */
    private handleGroupKey(domEvent: KeyboardEvent, item: HTMLElement, root: HTMLElement, axis: "horizontal" | "vertical"): boolean {
        const opens = axis === "vertical" ? "ArrowRight" : towardContent(root) === "top" ? "ArrowUp" : "ArrowDown";
        const group = item.matches(MenuGroupEntrySelector) ? item.parentElement : null;

        if (domEvent.key === opens && group !== null) {
            domEvent.preventDefault();

            if (!group.hasAttribute(MenuOpenAttribute))
                item.click();
            else
                moveRovingFocus([], firstOfBlock(group));

            return true;
        }

        if (domEvent.key !== "ArrowLeft" || axis !== "vertical")
            return false;

        // An inline group's open entry folds; any other entry closes the group it stands in.
        const closing = group !== null && group.hasAttribute(MenuOpenAttribute) && !isFlyoutGroup(group) ? group : groupAround(item);
        const entry = closing?.querySelector<HTMLElement>(`:scope > .${ItemClass}`) ?? null;

        if (closing === null || entry === null)
            return false;

        domEvent.preventDefault();

        // On its entry first: a block folding over the focus would drop it to the page; a flyout gives it back as it closes.
        if (!isFlyoutGroup(closing))
            entry.focus();

        entry.click();
        return true;
    }

    /** The keyboard's press on an entry: Enter's at once, Space's on its release; Enter on one with an address is the browser's to follow. */
    private pressEntry(domEvent: KeyboardEvent, entry: HTMLElement): void {
        if (domEvent.target !== entry || !isPlainKey(domEvent, { shift: true }) || entry.matches(PassiveMenuEntrySelector) || !isRovingCandidate(entry))
            return;

        if (entry.hasAttribute("href") && domEvent.key === "Enter")
            return;

        // An entry is a link, and one without an address has no press of its own for Enter or Space.
        domEvent.preventDefault();

        if (domEvent.repeat)
            return;

        if (domEvent.key === " ")
            this.space.hold(entry);
        else
            entry.click();
    }

    /** A popup menu the pointer opened holds the keyboard itself, no entry current: the first arrow enters at the near end. */
    private enterFromContainer(domEvent: KeyboardEvent): void {
        const container = domEvent.target instanceof HTMLElement && domEvent.target.getAttribute("role") === "menu" ? domEvent.target : null;
        const menu = container === null ? null : container.matches(`.${RootClass}`) ? container : container.querySelector<HTMLElement>(`.${RootClass}`);

        if (menu === null)
            return;

        const items = menuWalk(menu);
        const character = typeAheadCharacter(domEvent);

        if (character !== null) {
            domEvent.preventDefault();
            moveRovingFocus(items, typeAheadEntry(items, null, character));
            return;
        }

        const next = isPlainKey(domEvent) ? resolveRovingTarget({ key: domEvent.key, items, current: null, axis: menu.classList.contains(HorizontalClass) ? "horizontal" : "vertical" }) : null;

        if (next === null)
            return;

        domEvent.preventDefault();
        moveRovingFocus(items, next);
    }

    /** Keeps the menu a single tab stop: whichever entry the user last reached is the one Tab returns to. */
    private handleFocusIn(domEvent: Event): void {
        if (!(domEvent.target instanceof Element))
            return;

        const item = domEvent.target.closest<HTMLElement>(`.${ItemClass}`);
        const menu = item?.closest<HTMLElement>(`.${RootClass}`) ?? null;

        if (item !== null && menu !== null)
            applyRovingTabIndex(menuWalk(walkRootOf(menu)), item);
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
}

/** The first entry the keyboard can reach in an open group's block or flyout. */
function firstOfBlock(group: HTMLElement): HTMLElement | null {
    const block = group.querySelector<HTMLElement>(`:scope > .ui-menu__submenu > .${RootClass}`);

    return block === null ? null : menuWalk(block).find(isRovingCandidate) ?? null;
}

/** The open group an entry stands in, by the submenu its menu is. */
function groupAround(item: HTMLElement): HTMLElement | null {
    const menu = item.closest<HTMLElement>(`.${RootClass}`);
    const group = menu === null ? null : submenuGroupOf(menu);

    return group !== null && group.hasAttribute(MenuOpenAttribute) ? group : null;
}

/** The search field in a menu's own bar, where it has one. */
function searchFieldOf(menu: HTMLElement): HTMLInputElement | null {
    return menu.hasAttribute(MenuSearchAttribute) ? menu.querySelector<HTMLInputElement>(":scope > .ui-collapsible__bar input") : null;
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
