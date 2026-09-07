// Right-click menus: when a menu rendered inside its owner is shown, and where — at the pointer, so there is no anchor to place against.

import { ComponentKeyAttribute, ItemsHostAttribute, NoContextMenuAttribute } from "../addressing/dom-attributes";
import { clampToViewport } from "./anchored-popup";
import { PopupDismissal } from "./popup-dismissal";
import { FocusableSelector } from "./popup-focus";

const OwnerAttribute = "data-ui-context-menu-owner";
const MenuAttribute = "data-ui-context-menu";
const OpenClass = "ui-context-menu--open";

/** An entry whose click keeps the menu up: a group's own entry opens its block, a check turns in place. */
const StayingEntrySelector = "[data-ui-menu-group] > .ui-menu-item, .ui-menu-item[data-ui-menu-item-kind=\"check\"]";

export type ContextMenuEngineOptions = {
    readonly root?: ParentNode;
};

export class ContextMenuEngine {
    private readonly root: ParentNode;
    private openMenu: HTMLElement | null = null;

    public constructor(options: ContextMenuEngineOptions = {}) {
        this.root = options.root ?? document;

        this.root.addEventListener("contextmenu", domEvent => this.handleContextMenu(domEvent), true);

        // A click inside closes on the click, not the press, or the entry it landed on never activates.
        document.addEventListener("click", domEvent => this.handleInside(domEvent), false);

        new PopupDismissal({
            root: this.root,
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

        // This owner's own menu: a renderer may nest it, but a nested owner's menu must not open for the outer one.
        const menu = owner.querySelector<HTMLElement>(`[${MenuAttribute}]`);

        if (menu === null || menu.closest(`[${OwnerAttribute}]`) !== owner || isRefused(owner))
            return;

        domEvent.preventDefault();

        this.close();
        this.open(menu, domEvent.clientX, domEvent.clientY);
    }

    private open(menu: HTMLElement, x: number, y: number): void {
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

        this.openMenu.classList.remove(OpenClass);
        this.openMenu = null;
    }
}

/**
 * The menu is refused where the owner says so, where the row the owner stands in says so, or where the host of that row says so
 * for every row — the three places `ShowContextMenu` and `CanShowContextMenu` are written.
 */
function isRefused(owner: HTMLElement): boolean {
    if (owner.hasAttribute(NoContextMenuAttribute))
        return true;

    const row = owner.closest<HTMLElement>(`[${ComponentKeyAttribute}]`);
    const host = row?.parentElement?.hasAttribute(ItemsHostAttribute) === true ? row.parentElement : null;

    return row !== null && (row.hasAttribute(NoContextMenuAttribute) || host?.parentElement?.hasAttribute(NoContextMenuAttribute) === true);
}
