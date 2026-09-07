// Walking a menu from the keyboard, and firing an entry from its shortcut.

import { findOpenModalDialog } from "./dialog-engine";
import { ownDescendants } from "./own-descendants";
import { applyRovingTabIndex, isRovingCandidate, resolveRovingTarget } from "./roving-focus";
import { KeyboardShortcut, matchesShortcut, parseShortcut, shortcutKey } from "./keyboard-shortcut";
import { logWarn } from "../runtime/logger";

const RootClass = "ui-menu";
const ItemClass = "ui-menu-item";
const SelectedModifier = "ui-menu-item--selected";
const ContextMenuClass = "ui-context-menu";

const HorizontalClass = "ui-orientation--horizontal";

const KindAttribute = "data-ui-menu-item-kind";
const NonInteractiveSelector = `[${KindAttribute}="header"], [${KindAttribute}="separator"]`;

const ShortcutAttribute = "data-ui-menu-shortcut";

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

        // The arrows are a menu's own, taken before anything else sees them; a shortcut waits for the bubble, so a field or a
        // popup that takes the chord itself (a code field's Ctrl+S) has already prevented it.
        this.root.addEventListener("keydown", domEvent => this.handleNavigationKeydown(domEvent), true);
        this.root.addEventListener("keydown", domEvent => this.handleShortcutKeydown(domEvent));
        this.root.addEventListener("focusin", domEvent => this.handleFocusIn(domEvent));

        this.applyTabStops();

        if (this.root instanceof Node) {
            // The shortcut registry is only invalidated, so the next press pays for the rebuild; tab stops cannot wait for a press.
            const observer = new MutationObserver(() => {
                this.shortcutsStale = true;
                this.scheduleTabStops();
            });

            observer.observe(this.root, { childList: true, subtree: true, attributeFilter: [ShortcutAttribute] });
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
            const current = items.find(item => item.classList.contains(SelectedModifier))
                ?? items.find(isRovingCandidate)
                ?? items[0];

            applyRovingTabIndex(items, current);
        }
    }

    /** Arrow/Home/End inside a menu. */
    private handleNavigationKeydown(domEvent: Event): void {
        if (!(domEvent instanceof KeyboardEvent) || domEvent.defaultPrevented || domEvent.isComposing || !(domEvent.target instanceof Element))
            return;

        const item = domEvent.target.closest<HTMLElement>(`.${ItemClass}`);
        const menu = item?.closest<HTMLElement>(`.${RootClass}`) ?? null;

        if (item === null || menu === null)
            return;

        const items = this.ownItems(menu);

        const next = resolveRovingTarget({
            key: domEvent.key,
            items,
            current: item,
            // One axis only: the other arrows belong to whatever the menu sits in.
            axis: menu.classList.contains(HorizontalClass) ? "horizontal" : "vertical"
        });

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

    /**
     * A shortcut is an accelerator: it fires from anywhere on the page, a field included, unless the field took the chord itself. Two
     * things stop it — an unmodified key belongs to the text under the caret, and an open modal dialog keeps every entry outside it out
     * of reach, as it does the pointer.
     */
    private handleShortcutKeydown(domEvent: Event): void {
        if (!(domEvent instanceof KeyboardEvent) || domEvent.defaultPrevented || domEvent.isComposing)
            return;

        if (this.shortcutsStale)
            this.rebuildShortcuts();

        if (this.shortcuts.size === 0 || isTypingTarget(domEvent))
            return;

        const modal = findOpenModalDialog(this.root);

        for (const entry of this.shortcuts.values()) {
            // A null entry is a claimed-twice combination: it fires nothing, on purpose.
            if (entry === null || !matchesShortcut(entry.shortcut, domEvent))
                continue;

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
            // A context menu lives in a row template, so its shortcut text only labels a key bound elsewhere.
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
        return ownDescendants(menu, `.${ItemClass}:not(${NonInteractiveSelector})`, `.${RootClass}`);
    }
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
