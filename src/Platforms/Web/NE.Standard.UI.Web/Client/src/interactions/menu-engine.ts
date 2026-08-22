// Everything about a menu that the server cannot decide: walking it from the keyboard, and firing an entry
// from its shortcut. Opening and placing a *context* menu stays in context-menu-engine.ts — this engine knows
// nothing about how a menu came to be on screen.

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

        this.root.addEventListener("keydown", domEvent => this.handleKeydown(domEvent), true);
        this.root.addEventListener("focusin", domEvent => this.handleFocusIn(domEvent));

        this.applyTabStops();

        if (this.root instanceof Node) {
            // Entries arrive and leave with every items patch, so the registry is invalidated rather than
            // rebuilt here — the rebuild costs a query and only the next shortcut press pays for it. The tab
            // stops cannot wait for a press, so those are redone right after the batch settles.
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

        // A timer, not requestAnimationFrame: a hidden tab gets no frames, and a menu rendered while the tab
        // is in the background would then never become reachable from the keyboard.
        setTimeout(() => {
            this.tabStopsScheduled = false;
            this.applyTabStops();
        }, 0);
    }

    /**
     * Gives every menu exactly one tab stop, up front. An entry with a command and no <c>Url</c> is an anchor
     * without an href — not focusable at all — so without this a menu could not be entered from the keyboard,
     * and the arrows below would have nothing to move from.
     */
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

    private handleKeydown(domEvent: Event): void {
        if (!(domEvent instanceof KeyboardEvent) || domEvent.defaultPrevented)
            return;

        if (this.handleNavigation(domEvent))
            return;

        this.handleShortcut(domEvent);
    }

    /** Arrow/Home/End inside a menu. Returns whether the key belonged to a menu at all. */
    private handleNavigation(domEvent: KeyboardEvent): boolean {
        if (!(domEvent.target instanceof Element))
            return false;

        const item = domEvent.target.closest<HTMLElement>(`.${ItemClass}`);
        const menu = item?.closest<HTMLElement>(`.${RootClass}`) ?? null;

        if (item === null || menu === null)
            return false;

        const items = this.ownItems(menu);

        const next = resolveRovingTarget({
            key: domEvent.key,
            items,
            current: item,
            // A horizontal menu is walked left-right, a vertical one up-down. Not "both": in a horizontal menu
            // the vertical arrows belong to whatever the menu sits in, most often the page.
            axis: menu.classList.contains(HorizontalClass) ? "horizontal" : "vertical"
        });

        if (next === null)
            return false;

        domEvent.preventDefault();

        applyRovingTabIndex(items, next);
        next.focus();

        return true;
    }

    /**
     * Keeps the menu a single tab stop: whichever entry the user last reached is the one Tab returns to.
     */
    private handleFocusIn(domEvent: Event): void {
        if (!(domEvent.target instanceof Element))
            return;

        const item = domEvent.target.closest<HTMLElement>(`.${ItemClass}`);
        const menu = item?.closest<HTMLElement>(`.${RootClass}`) ?? null;

        if (item !== null && menu !== null)
            applyRovingTabIndex(this.ownItems(menu), item);
    }

    private handleShortcut(domEvent: KeyboardEvent): void {
        if (this.shortcutsStale)
            this.rebuildShortcuts();

        if (this.shortcuts.size === 0 || isTypingTarget(domEvent))
            return;

        for (const entry of this.shortcuts.values()) {
            // A null entry is a claimed-twice combination: it fires nothing, on purpose.
            if (entry === null || !matchesShortcut(entry.shortcut, domEvent))
                continue;

            if (entry.element.getClientRects().length === 0 || entry.element.matches(":disabled, .ui-disabled"))
                return;

            domEvent.preventDefault();
            entry.element.click();

            return;
        }
    }

    /**
     * A combination claimed by two entries fires neither: with the menu holding both, there is no principled
     * way to pick one, and picking the first would depend on collection order.
     */
    private rebuildShortcuts(): void {
        this.shortcuts.clear();
        this.shortcutsStale = false;

        for (const element of this.root.querySelectorAll<HTMLElement>(`[${ShortcutAttribute}]`)) {
            // A context menu lives in a row template, so every row would claim the same combination and the
            // rule below would void it. Its shortcut text is a label for a key bound elsewhere.
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

    /**
     * The entries of this menu, excluding those of a menu nested inside it and the two kinds that are not
     * controls: a caption names the entries under it and a rule is a line, so neither takes the caret.
     */
    private ownItems(menu: HTMLElement): HTMLElement[] {
        return [...menu.querySelectorAll<HTMLElement>(`.${ItemClass}:not(${NonInteractiveSelector})`)]
            .filter(item => item.closest(`.${RootClass}`) === menu);
    }
}

/**
 * Whether the press belongs to text the user is editing. A bare "Delete" or "F2" must not fire a menu entry
 * mid-word; a modified one — Ctrl+S — is exactly the case that should still work while typing.
 */
function isTypingTarget(domEvent: KeyboardEvent): boolean {
    if (domEvent.ctrlKey || domEvent.metaKey || domEvent.altKey)
        return false;

    const target = domEvent.target;

    if (!(target instanceof HTMLElement))
        return false;

    return target.isContentEditable || target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement;
}
