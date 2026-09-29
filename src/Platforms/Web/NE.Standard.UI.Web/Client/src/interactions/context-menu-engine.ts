// Right-click menus, shown at the pointer. An owner may carry several by name — the part pressed says which
// (`data-ui-context-menu-use`), the unnamed one takes the rest — and one with nothing to offer a press hands it to the owner around it.

import { ComponentKeyAttribute, ContextMenuAttribute, ContextMenuUseAttribute, ItemsHostAttribute, MarkedMenuEntrySelector, NoContextMenuAttribute, PassiveMenuEntrySelector } from "../addressing/dom-attributes.ts";
import { clampToViewport } from "./anchored-popup.ts";
import { isInert } from "./interactive-state.ts";
import { ownDescendants } from "./own-descendants.ts";
import { OwnedPopups } from "./owned-popup.ts";
import { FocusableSelector, focusBeforePress, focusOpenedList, liveFocusReturn } from "./popup-focus.ts";
import { finishTransitions } from "../rendering/motion.ts";

const OwnerAttribute = "data-ui-context-menu-owner";
const MenuAttribute = ContextMenuAttribute;

const OpenClass = "ui-context-menu--open";
const MenuRootClass = "ui-menu";
const EntrySelector = `.ui-menu-item:not(${PassiveMenuEntrySelector})`;

/** Raised on a menu just before it opens, with the pressed element: an engine sets its entries here, or cancels to keep it shut. */
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

    // The menu last put away, whose fade a new menu cuts short.
    private closed: HTMLElement | null = null;

    // Placed at the pointer, not an anchor; inside is the menu alone, since a press elsewhere on its owner is outside it.
    private readonly menus = new OwnedPopups({
        show: ({ popup }) => popup.classList.add(OpenClass),
        hide: ({ popup }, reason) => {
            popup.classList.remove(OpenClass);
            this.closed = popup;

            if (reason === "outside")
                keepFocusThroughPress();
        },
        closesWhenReadOnly: false,
        isInside: ({ popup }, path) => path.includes(popup),
        onPress: true,
        onWindowBlur: true
    });

    public constructor(options: ContextMenuEngineOptions = {}) {
        this.root = options.root ?? document;

        this.root.addEventListener("contextmenu", domEvent => this.handleContextMenu(domEvent), true);

        // A click inside closes on the click, not the press, or the entry it landed on never activates.
        this.root.addEventListener("click", domEvent => this.handleInside(domEvent), false);
    }

    private get openMenu(): HTMLElement | null {
        const owner = this.menus.current;

        return owner === null ? null : this.menus.popupOf(owner);
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
        const part = target.closest(`[${ContextMenuUseAttribute}]`);

        for (let owner = target.closest<HTMLElement>(`[${OwnerAttribute}]`); owner !== null; owner = owner.parentElement?.closest<HTMLElement>(`[${OwnerAttribute}]`) ?? null) {
            // A part of the owner that refuses a menu — a panel standing over a canvas — keeps the owner's menu off it, as a row does.
            if (refusing !== null && owner.contains(refusing))
                return;

            // The pressed part's named menu, then the owner's unnamed one, which also takes a name with no menu or nothing to offer.
            const name = part !== null && owner.contains(part) ? part.getAttribute(ContextMenuUseAttribute) ?? "" : "";
            const candidates = [name.length > 0 ? ownMenu(owner, name) : null, ownMenu(owner, "")].filter((menu): menu is HTMLElement => menu !== null);

            // A strip with only its captions' named menu has nothing for its pages, nor has an inert owner: the owner around answers.
            if (candidates.length === 0 || isInert(owner))
                continue;

            if (isRefused(owner))
                return;

            const menu = candidates.find(candidate => this.prepare(candidate, target));

            // Every menu the owner has kept itself shut for this press — a tab menu with nothing to offer a tab: the owner around it answers.
            if (menu === undefined)
                continue;

            domEvent.preventDefault();

            this.open(owner, menu, domEvent.clientX, domEvent.clientY);
            return;
        }
    }

    /** Lets an engine set the menu's entries for what it was opened on; false when it kept the menu shut. */
    private prepare(menu: HTMLElement, target: Element): boolean {
        const opening = new CustomEvent<ContextMenuOpeningDetail>(ContextMenuOpeningEventName, { bubbles: true, cancelable: true, detail: { target } });

        return menu.dispatchEvent(opening);
    }

    private open(owner: HTMLElement, menu: HTMLElement, x: number, y: number): void {
        this.menus.close();

        // The menu this one takes the place of goes at once, as a native menu swapped for another does, not fading under it.
        if (this.closed !== null) {
            finishTransitions(this.closed);
            this.closed = null;
        }

        // A right press on nothing focusable has already dropped the focus to the body; it goes back to what held it before.
        const active = document.activeElement instanceof HTMLElement && document.activeElement !== document.body ? document.activeElement : null;
        const held = active ?? focusBeforePress();

        // What held the focus, else the owner, else the component around it made focusable for the return: never the body.
        if (!this.menus.open({ owner, popup: menu, returnFocus: () => (held === null ? null : liveFocusReturn(held)) ?? liveFocusReturn(owner) }))
            return;

        // Measured once shown, or a display:none menu measures as zero and never flips.
        const rect = menu.getBoundingClientRect();

        menu.style.left = `${clampToViewport(x, rect.width, window.innerWidth)}px`;
        menu.style.top = `${clampToViewport(y, rect.height, window.innerHeight)}px`;

        focusOpening(menu);
    }

    private handleInside(domEvent: Event): void {
        if (this.openMenu === null || !domEvent.composedPath().includes(this.openMenu))
            return;

        if (domEvent.target instanceof Element && domEvent.target.closest(StayingEntrySelector) !== null)
            return;

        this.menus.close();
    }
}

/** A key's opening gives the first entry it shows the keyboard; a press's gives it to the menu, no entry current until an arrow. */
function focusOpening(host: HTMLElement): void {
    const menu = host.querySelector<HTMLElement>(`.${MenuRootClass}`);

    // The stop laid out while the menu was hidden may be an entry this opening left out, or one disabled for it.
    if (menu !== null)
        focusOpenedList(host, ownDescendants(menu, EntrySelector, `.${MenuRootClass}`));
}

/** Swallows the closing press where it lands on nothing focusable, so the keyboard stays where the menu gave it back, not on the body. */
function keepFocusThroughPress(): void {
    const keep = (domEvent: Event): void => {
        if (domEvent.target instanceof Element && domEvent.target.closest(`${FocusableSelector}, [contenteditable='true']`) === null)
            domEvent.preventDefault();
    };

    // The closing press raises its `mousedown` in this same task, so the listener goes with the task.
    document.addEventListener("mousedown", keep, { capture: true, once: true });
    setTimeout(() => document.removeEventListener("mousedown", keep, true));
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
