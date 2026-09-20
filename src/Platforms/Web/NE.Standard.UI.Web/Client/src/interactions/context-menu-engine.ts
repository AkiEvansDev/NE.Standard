// Right-click menus: shown at the pointer, since there is no anchor to place against. An owner may carry several, by name: the
// part pressed says which (`data-ui-context-menu-use`), and the unnamed one is the rest's.

import { ComponentKeyAttribute, ItemsHostAttribute, MarkedMenuEntrySelector, NoContextMenuAttribute } from "../addressing/dom-attributes";
import { clampToViewport } from "./anchored-popup";
import { PopupDismissal } from "./popup-dismissal";
import { FocusableSelector, restoreFocusTo } from "./popup-focus";

const OwnerAttribute = "data-ui-context-menu-owner";
const MenuAttribute = "data-ui-context-menu";
const UseAttribute = "data-ui-context-menu-use";
const OpenClass = "ui-context-menu--open";

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

        const owner = domEvent.target.closest<HTMLElement>(`[${OwnerAttribute}]`);

        if (owner === null)
            return;

        // The nearest part that names a menu, inside this owner; a name the owner has no menu for falls back to its unnamed one.
        const part = domEvent.target.closest(`[${UseAttribute}]`);
        const name = part !== null && owner.contains(part) ? part.getAttribute(UseAttribute) ?? "" : "";
        const menu = ownMenu(owner, name) ?? (name.length > 0 ? ownMenu(owner, "") : null);

        if (menu === null || isRefused(owner))
            return;

        domEvent.preventDefault();

        this.close();
        this.open(menu, domEvent.clientX, domEvent.clientY);
    }

    private open(menu: HTMLElement, x: number, y: number): void {
        this.returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;

        menu.classList.add(OpenClass);
        this.openMenu = menu;

        // Measured after the class is applied, or a display:none menu measures as zero and never flips.
        const rect = menu.getBoundingClientRect();

        menu.style.left = `${clampToViewport(x, rect.width, window.innerWidth)}px`;
        menu.style.top = `${clampToViewport(y, rect.height, window.innerHeight)}px`;

        menu.querySelector<HTMLElement>(FocusableSelector)?.focus({ preventScroll: true });
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
