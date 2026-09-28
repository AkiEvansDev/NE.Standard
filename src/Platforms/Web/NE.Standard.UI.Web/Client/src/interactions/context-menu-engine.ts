// Right-click menus: shown at the pointer, since there is no anchor to place against. An owner may carry several, by name: the
// part pressed says which (`data-ui-context-menu-use`), and the unnamed one is the rest's. An owner with no menu for the press —
// or only menus that have nothing to offer it — hands it to the owner around it.

import { ComponentKeyAttribute, ContextMenuAttribute, ItemsHostAttribute, MarkedMenuEntrySelector, NoContextMenuAttribute, PassiveMenuEntrySelector } from "../addressing/dom-attributes";
import { clampToViewport } from "./anchored-popup";
import { ownDescendants } from "./own-descendants";
import { PopupDismissal } from "./popup-dismissal";
import { restoreFocusTo } from "./popup-focus";
import { applyRovingTabIndex, isRovingCandidate } from "./roving-focus";

const OwnerAttribute = "data-ui-context-menu-owner";
const MenuAttribute = ContextMenuAttribute;
const UseAttribute = "data-ui-context-menu-use";
const OpenClass = "ui-context-menu--open";
const MenuRootClass = "ui-menu";
const EntrySelector = `.ui-menu-item:not(${PassiveMenuEntrySelector})`;

/**
 * Raised on a menu just before it opens, with the element pressed: an engine whose menu depends on what it was opened on sets its
 * entries here, and cancels the event to keep a menu with nothing to offer shut.
 */
export const ContextMenuOpeningEventName = "ui-context-menu-opening";

export type ContextMenuOpeningDetail = {
    readonly target: Element;
};

/** An entry whose click keeps the menu up: a group's own entry opens its block, a check turns in place. */
const StayingEntrySelector = MarkedMenuEntrySelector;

export type ContextMenuEngineOptions = {
    readonly root?: ParentNode;
};

export class ContextMenuEngine {
    private readonly root: ParentNode;
    private openMenu: HTMLElement | null = null;
    // Where the keyboard was when the menu took it, to give it back on close: the menu's own hide would drop it on the body.
    private returnFocus: HTMLElement | null = null;

    public constructor(options: ContextMenuEngineOptions = {}) {
        this.root = options.root ?? document;

        this.root.addEventListener("contextmenu", domEvent => this.handleContextMenu(domEvent), true);

        // A click inside closes on the click, not the press, or the entry it landed on never activates.
        this.root.addEventListener("click", domEvent => this.handleInside(domEvent), false);

        new PopupDismissal({
            openPopups: () => this.openMenu === null ? [] : [this.openMenu],
            close: () => this.close(),
            onPress: true,
            onWindowBlur: true
        });
    }

    private handleContextMenu(domEvent: Event): void {
        if (!(domEvent instanceof MouseEvent) || !(domEvent.target instanceof Element))
            return;

        const target = domEvent.target;

        // A right press on the open menu is the menu's own: nothing opens over it, the browser's menu included.
        if (this.openMenu !== null && domEvent.composedPath().includes(this.openMenu)) {
            domEvent.preventDefault();
            return;
        }

        const refusing = target.closest(`[${NoContextMenuAttribute}]`);
        const part = target.closest(`[${UseAttribute}]`);

        for (let owner = target.closest<HTMLElement>(`[${OwnerAttribute}]`); owner !== null; owner = owner.parentElement?.closest<HTMLElement>(`[${OwnerAttribute}]`) ?? null) {
            // A part of the owner that refuses a menu — a panel standing over a canvas — keeps the owner's menu off it, as a row does.
            if (refusing !== null && owner.contains(refusing))
                return;

            // The nearest part that names a menu, inside this owner, then the owner's unnamed one: a name the owner has no menu for,
            // or a named menu with nothing to offer this press, falls back to it.
            const name = part !== null && owner.contains(part) ? part.getAttribute(UseAttribute) ?? "" : "";
            const candidates = [name.length > 0 ? ownMenu(owner, name) : null, ownMenu(owner, "")].filter((menu): menu is HTMLElement => menu !== null);

            // A strip with only a named menu for its captions has nothing for its pages: the owner around it answers there.
            if (candidates.length === 0)
                continue;

            if (isRefused(owner))
                return;

            const menu = candidates.find(candidate => this.prepare(candidate, target));

            // Every menu the owner has kept itself shut for this press — a tab menu with nothing to offer a tab: the owner around it answers.
            if (menu === undefined)
                continue;

            domEvent.preventDefault();

            this.close();
            this.open(menu, domEvent.clientX, domEvent.clientY);
            return;
        }
    }

    /** Lets an engine set the menu's entries for what it was opened on; false when it kept the menu shut. */
    private prepare(menu: HTMLElement, target: Element): boolean {
        const opening = new CustomEvent<ContextMenuOpeningDetail>(ContextMenuOpeningEventName, { bubbles: true, cancelable: true, detail: { target } });

        return menu.dispatchEvent(opening);
    }

    private open(menu: HTMLElement, x: number, y: number): void {
        this.returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;

        menu.classList.add(OpenClass);
        this.openMenu = menu;

        // Measured after the class is applied, or a display:none menu measures as zero and never flips.
        const rect = menu.getBoundingClientRect();

        menu.style.left = `${clampToViewport(x, rect.width, window.innerWidth)}px`;
        menu.style.top = `${clampToViewport(y, rect.height, window.innerHeight)}px`;

        focusFirstEntry(menu);
    }

    private handleInside(domEvent: Event): void {
        if (this.openMenu === null || !domEvent.composedPath().includes(this.openMenu))
            return;

        if (domEvent.target instanceof Element && domEvent.target.closest(StayingEntrySelector) !== null)
            return;

        this.close();
    }

    private close(): void {
        if (this.openMenu === null)
            return;

        const menu = this.openMenu;

        this.openMenu = null;

        // Before the menu hides, as every popup engine does: hidden, it has already dropped the focus there is to bring back.
        restoreFocusTo(this.returnFocus, menu);
        this.returnFocus = null;

        menu.classList.remove(OpenClass);
    }
}

/**
 * Gives the keyboard to the first entry this opening shows and can run, and makes it the menu's one tab stop: the stop the menu
 * engine laid out while the menu was hidden may be an entry an engine left out of this opening, or one disabled for it.
 */
function focusFirstEntry(host: HTMLElement): void {
    const menu = host.querySelector<HTMLElement>(`.${MenuRootClass}`);

    if (menu === null)
        return;

    const entries = ownDescendants(menu, EntrySelector, `.${MenuRootClass}`);
    const first = entries.find(isRovingCandidate) ?? null;

    if (first === null)
        return;

    applyRovingTabIndex(entries, first);
    first.focus({ preventScroll: true });
}

/** This owner's own menu of that name: a renderer may nest menus, but a nested owner's menu must not open for the outer one. */
function ownMenu(owner: HTMLElement, name: string): HTMLElement | null {
    for (const menu of owner.querySelectorAll<HTMLElement>(`[${MenuAttribute}]`)) {
        if ((menu.getAttribute(MenuAttribute) ?? "") === name && menu.closest(`[${OwnerAttribute}]`) === owner)
            return menu;
    }

    return null;
}

/** Refused where the owner says so, where its row says so, or where the row's host says so for every row. */
function isRefused(owner: HTMLElement): boolean {
    if (owner.hasAttribute(NoContextMenuAttribute))
        return true;

    const row = owner.closest<HTMLElement>(`[${ComponentKeyAttribute}]`);
    const host = row?.parentElement?.hasAttribute(ItemsHostAttribute) === true ? row.parentElement : null;

    return row !== null && (row.hasAttribute(NoContextMenuAttribute) || host?.parentElement?.hasAttribute(NoContextMenuAttribute) === true);
}
