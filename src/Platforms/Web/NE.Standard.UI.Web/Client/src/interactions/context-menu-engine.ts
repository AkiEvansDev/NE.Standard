// Right-click menus, shown at the pointer. An owner may carry several by name — the part pressed says which
// (`data-ui-context-menu-use`), the unnamed one takes the rest — and one with nothing to offer a press hands it to the owner around it.
// A long press on a part with an action bar opens the menu with the bar's icons in a row atop it; the bar's "more" opens it under
// itself, as a menu button opens its list, without the bar's own entries where the host asks for the rest alone.

import type { AnchoredPopupOptions } from "./anchored-popup.ts";
import { ActionBarAttribute, ActionBarClass, ActionBarRestAttribute, ComponentKeyAttribute, ContextMenuAttribute, ContextMenuUseAttribute, ItemsHostAttribute, MarkedMenuEntrySelector, MenuItemClass, MenuItemKindAttribute, MenuLeftOutAttribute, MenuRootClass, NoContextMenuAttribute, PassiveMenuEntrySelector } from "../addressing/dom-attributes.ts";
import { ActionBarMoreClass, drawActionBar, isShownEntry, readActionBarEntries } from "./action-bar.ts";
import { clampToViewport } from "./anchored-popup.ts";
import { isInert } from "./interactive-state.ts";
import { isLongPressOpening, LongPress } from "./long-press.ts";
import { ownDescendants } from "./own-descendants.ts";
import { OwnedPopups } from "./owned-popup.ts";
import { shownRules } from "./tab-menu.ts";
import type { MenuRow } from "./tab-menu.ts";
import { FocusableSelector, focusBeforePress, focusOpenedList, isTouchLast, liveFocusReturn } from "./popup-focus.ts";
import { finishTransitions } from "../rendering/motion.ts";

const OwnerAttribute = "data-ui-context-menu-owner";
const MenuAttribute = ContextMenuAttribute;

// On a menu while it is open; the action bar reads it to keep "more" standing under the menu it opened.
export const OpenClass = "ui-context-menu--open";
const EntrySelector = `.${MenuItemClass}:not(${PassiveMenuEntrySelector})`;
const StripClass = `${ActionBarClass}--strip`;
// "More" on a bar standing over its host, not in the row atop a menu.
const MoreSelector = `.${ActionBarClass}:not(.${StripClass}) > .${ActionBarMoreClass}`;
const MoreMenuPlacement: AnchoredPopupOptions = { placement: "bottom-start", gap: 4 };
// A long press in a field is the field's: its caret, its selection, the system's own menu for its text.
const TypingSelector = "input, textarea, select, [contenteditable=''], [contenteditable='true']";

/** Raised on a menu just before it opens, with the pressed element: an engine sets its entries here, or cancels to keep it shut. */
export const ContextMenuOpeningEventName = "ui-context-menu-opening";

export type ContextMenuOpeningDetail = {
    readonly target: Element;
    /** Asked for an action bar about to show the menu's entries, not for an opening: set their state, but choose nothing. */
    readonly actionBar?: boolean;
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

    // Placed at the pointer, or under a bar's "more"; inside is the menu alone, since a press elsewhere on its owner is outside it.
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

        // A finger held still asks for the menu too, where iOS Safari raises no `contextmenu` for it; before the listener below, so
        // the browser's own one for a press already answered never reaches it.
        new LongPress({ root: this.root, first: typeof window === "undefined" ? undefined : window, opensMenu: target => target.closest(`[${OwnerAttribute}]`) !== null && target.closest(TypingSelector) === null });

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

        for (let owner = target.closest<HTMLElement>(`[${OwnerAttribute}]`); owner !== null; owner = owner.parentElement?.closest<HTMLElement>(`[${OwnerAttribute}]`) ?? null) {
            // A part of the owner that refuses a menu — a panel standing over a canvas — keeps the owner's menu off it, as a row does.
            if (refusing !== null && owner.contains(refusing))
                return;

            const candidates = candidateMenus(owner, target);

            // A strip with only its captions' named menu has nothing for its pages, nor has an inert owner: the owner around answers.
            if (candidates.length === 0 || isInert(owner))
                continue;

            if (isRefused(owner))
                return;

            const menu = candidates.find(candidate => prepareMenu(candidate, target, false));

            // Every menu the owner has kept itself shut for this press — a tab menu with nothing to offer a tab: the owner around it answers.
            if (menu === undefined)
                continue;

            domEvent.preventDefault();

            // A finger's long press: the bar's icons stand atop the menu, its frequent entries one press away.
            this.open(owner, menu, domEvent.clientX, domEvent.clientY, isTouchOpening(domEvent) ? target : null, target.closest<HTMLElement>(MoreSelector));
            return;
        }
    }

    private open(owner: HTMLElement, menu: HTMLElement, x: number, y: number, touched: Element | null, more: HTMLElement | null): void {
        this.menus.close();

        // The row of a bar's icons a long press put atop it last time, and what a bar's "more" left out; this opening draws its own,
        // before the menu is measured.
        menu.querySelector(`:scope > .${StripClass}`)?.remove();
        bringBackLeftOut(menu);

        if (touched !== null)
            addActionBarStrip(owner, menu, touched);

        if (more?.closest(`[${ActionBarAttribute}]`)?.hasAttribute(ActionBarRestAttribute) === true)
            leaveOutBarEntries(menu);

        // The menu this one takes the place of goes at once, as a native menu swapped for another does, not fading under it.
        if (this.closed !== null) {
            finishTransitions(this.closed);
            this.closed = null;
        }

        // A right press on nothing focusable has already dropped the focus to the body; it goes back to what held it before.
        const active = document.activeElement instanceof HTMLElement && document.activeElement !== document.body ? document.activeElement : null;
        const held = active ?? focusBeforePress();

        // Under "more" as a menu button's list stands under the button, flipping where there is no room; else at the pointer.
        const placed = more === null ? {} : { anchor: more, placement: MoreMenuPlacement };

        // What held the focus, else the owner, else the component around it made focusable for the return: never the body.
        if (!this.menus.open({ owner, popup: menu, ...placed, returnFocus: () => (held === null ? null : liveFocusReturn(held)) ?? liveFocusReturn(owner) }))
            return;

        if (more === null) {
            // Measured once shown, or a display:none menu measures as zero and never flips.
            const rect = menu.getBoundingClientRect();

            menu.style.left = `${clampToViewport(x, rect.width, window.innerWidth)}px`;
            menu.style.top = `${clampToViewport(y, rect.height, window.innerHeight)}px`;
        }

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

/**
 * The menus a press on `target` inside `owner` may open, in the order they are asked: the pressed part's named one, then the owner's
 * unnamed one, which also takes a name with no menu or nothing to offer.
 */
function candidateMenus(owner: HTMLElement, target: Element): HTMLElement[] {
    const part = target.closest(`[${ContextMenuUseAttribute}]`);
    const name = part !== null && owner.contains(part) ? part.getAttribute(ContextMenuUseAttribute) ?? "" : "";

    return [name.length > 0 ? ownMenu(owner, name) : null, ownMenu(owner, "")].filter((menu): menu is HTMLElement => menu !== null);
}

/** Lets an engine set the menu's entries for what it was opened on; false when it kept the menu shut. */
function prepareMenu(menu: HTMLElement, target: Element, actionBar: boolean): boolean {
    const opening = new CustomEvent<ContextMenuOpeningDetail>(ContextMenuOpeningEventName, { bubbles: true, cancelable: true, detail: { target, actionBar } });

    return menu.dispatchEvent(opening);
}

/**
 * The menu a right press on `target` would open from its nearest owner — the one an action bar there is a view of — asked first as an
 * opening asks it; null where that owner opens none for it. `actionBar` asks for the bar's showing rather than for an opening.
 */
export function actionBarMenuOf(target: Element, actionBar: boolean): HTMLElement | null {
    const owner = target.closest<HTMLElement>(`[${OwnerAttribute}]`);
    const refusing = target.closest(`[${NoContextMenuAttribute}]`);

    if (owner === null || isInert(owner) || isRefused(owner) || (refusing !== null && owner.contains(refusing)))
        return null;

    return candidateMenus(owner, target).find(menu => prepareMenu(menu, target, actionBar)) ?? null;
}

/**
 * Whether a finger's long press asked for the menu — the timed one, else the event says so where it is a pointer's, else the press
 * before it: the opening that draws the bar's icons atop the menu, which the action bar engine reads too.
 */
export function isTouchOpening(domEvent: MouseEvent): boolean {
    const pointerType = (domEvent as Partial<PointerEvent>).pointerType;

    if (isLongPressOpening(domEvent))
        return true;

    return typeof pointerType === "string" && pointerType.length > 0 ? pointerType === "touch" : isTouchLast();
}

/** Puts back what a bar's "more" left out of the menu's last opening. */
function bringBackLeftOut(menu: HTMLElement): void {
    for (const row of menu.querySelectorAll(`[${MenuLeftOutAttribute}]`))
        row.removeAttribute(MenuLeftOutAttribute);
}

/** The action bar of the part pressed, as a row of its icons atop the menu it views; a press on one is its entry's own. */
function addActionBarStrip(owner: HTMLElement, menu: HTMLElement, target: Element): void {
    const host = target.closest(`[${ActionBarAttribute}]`);

    // "More" on the bar opens the menu under the bar, whose icons stand there already.
    if (host === null || target.closest(`.${ActionBarClass}`) !== null || !owner.contains(host) || !candidateMenus(owner, host).includes(menu))
        return;

    const { entries } = readActionBarEntries(menu);

    if (entries.length === 0)
        return;

    const strip = document.createElement("div");

    strip.className = `${ActionBarClass} ${StripClass}`;
    strip.setAttribute("role", "group");
    drawActionBar(strip, { entries, more: false, role: "menuitem", press: pressFromStrip });
    menu.insertBefore(strip, menu.firstElementChild);
}

/** The menu is open on what it was asked for: the entry's press is all there is, and the menu closes on the click as on its own. */
function pressFromStrip(entry: HTMLElement): void {
    if (!isInert(entry))
        entry.click();
}

/**
 * Leaves out of this opening the entries the bar over the host shows — its "more" opened the rest — and then a caption over nothing
 * and a rule with nothing on one side of it, or another rule beside it.
 */
function leaveOutBarEntries(host: HTMLElement): void {
    const { entries } = readActionBarEntries(host);
    const menu = host.querySelector<HTMLElement>(`.${MenuRootClass}`);

    if (entries.length === 0 || menu === null)
        return;

    for (const entry of entries)
        leaveOut(entry);

    // The menu's own entries this opening still shows, in order; a group's block is a list of its own.
    const shown = ownDescendants(menu, `.${MenuItemClass}`, `.${MenuRootClass}`).filter(entry => entry.closest(`[${MenuLeftOutAttribute}]`) === null && isShownEntry(entry, host));
    const kept: HTMLElement[] = [];

    for (const [index, entry] of shown.entries()) {
        const next = shown[index + 1];

        if (entry.getAttribute(MenuItemKindAttribute) === "header" && (next === undefined || next.matches(PassiveMenuEntrySelector)))
            leaveOut(entry);
        else
            kept.push(entry);
    }

    // A rule stands between two runs of entries only; a caption counts as neither.
    const rows = kept.map((entry): MenuRow => {
        const kind = entry.getAttribute(MenuItemKindAttribute);

        return kind === "separator" ? "rule" : kind === "header" ? "hidden" : "shown";
    });

    shownRules(rows).forEach((shownRule, index) => {
        if (rows[index] === "rule" && !shownRule)
            leaveOut(kept[index]);
    });
}

/** Leaves an entry out of this opening: its row in the menu's list, so the list's gap goes with it. */
function leaveOut(entry: HTMLElement): void {
    const row = entry.parentElement;

    (row !== null && row.parentElement?.hasAttribute(ItemsHostAttribute) === true ? row : entry).setAttribute(MenuLeftOutAttribute, "");
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
