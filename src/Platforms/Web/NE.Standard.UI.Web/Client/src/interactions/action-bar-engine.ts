// Action bars over their hosts (`data-ui-action-bar`): one at a time, over the host the reader chose — pressed, tapped, or reached by
// the keyboard (in a list, the row its cursor lights) — standing above it as a floating layer the list's scrolling box never clips,
// until a press elsewhere, Escape, or another host chosen. Never on hover: a row carries nothing for its bar until it is chosen. The
// bar is a view of the host's context menu: a press on an icon is the entry's own press, after the opening its menu would have heard.

// `.ts` on the value imports: `node --test` loads this module as it is.
import type { AnchoredPopupPlacement } from "./anchored-popup.ts";
import { ActionBarAttribute, ActionBarClass, ActionBarKeyAttribute, ComponentKeyAttribute, ComponentSelector, ContextMenuAttribute, EventBoundaryAttribute, InActionBarAttribute, NoRowDragAttribute, RowBarAttribute, TableRowClass, TreeRowClass, VisibilityTierAttributes } from "../addressing/dom-attributes.ts";
import { clientStrings } from "../runtime/client-strings.ts";
import { ActionBarButtonClass, actionBarEntryOf, drawActionBar, isShownEntry, readActionBarEntries } from "./action-bar.ts";
import { placeAnchoredPopup, releaseAnchoredPopup, repositionAnchoredPopup } from "./anchored-popup.ts";
import { actionBarMenuOf, isTouchOpening, OpenClass as MenuOpenClass } from "./context-menu-engine.ts";
import { canScroll, isClippedOut, viewBoxAround } from "./element-visibility.ts";
import { escapeIsClaimed } from "./field-escape.ts";
import { isInert } from "./interactive-state.ts";
import { OpenDialogSelector } from "./open-dialogs.ts";
import { FocusableSelector, isPointerLast, isTouchLast, liveFocusReturn } from "./popup-focus.ts";
import type { ComponentIndex } from "./popup-focus.ts";
import { applyRovingTabIndex, moveRovingFocus, isRovingCandidate, resolveRovingTarget } from "./roving-focus.ts";
import { cursorRowOf } from "./row-cursor.ts";
import { SelectionRootSelector } from "./row-selection.ts";

const HostSelector = `[${ActionBarAttribute}]`;
const BarSelector = `.${ActionBarClass}`;

// On a bar whose host the scroll took wholly out of sight: it stays chosen, and shows again as the host comes back.
const OutClass = `${ActionBarClass}--out`;

// The rows that hold a host as their child; a tree's row holds it in its node face's wrapper.
const HostRowSelector = `.ui-items-view__item, .${TableRowClass}`;
const TreeNodeWrapperClass = "ui-tree__node";

// Between the bar and the edge of the item it stands over, so the two never read as one. A host whose look reaches past its box (a
// canvas node's selection ring) sets a wider one on itself.
const BarGap = 6;
const BarGapProperty = "--ui-action-bar-gap";

// A double tap's second tap lands where the bar its first one brought up now stands (a canvas moving the chosen node clear for it):
// a finger's press on a bar younger than this is held, not pressed. When each bar came up is kept by the bar.
const DoubleTapHold = 400;
const shownAt = new WeakMap<HTMLElement, number>();

// What a change in the menu may alter in its entries as a bar shows them; the tab stops the menu engine moves are not among them.
const EntryStateAttributes = ["class", "style", "hidden", "aria-disabled", "aria-checked", InActionBarAttribute, ...VisibilityTierAttributes];

type ShownBar = {
    readonly bar: HTMLElement;
    readonly menu: HTMLElement;
    readonly observer: MutationObserver;
    /** The list's row the bar stands over, marked while it does (`.ui-row-bar()`). */
    readonly row: Element | null;
};

/**
 * What a chosen host stands for, so the one drawn in its place keeps the bar: a row redrawn, a window scrolled past it and back, a
 * node a package drew anew. The element under `scope` carrying `key` in `attribute` — the host itself where a package keys it
 * (`data-ui-action-bar-key`), else its row (`data-ui-key`) — and the host's place among the hosts there.
 */
type HostIdentity = {
    readonly scope: Element;
    readonly attribute: string;
    readonly key: string;
    readonly index: number;
};

/**
 * A finger's press on its way to a tap: its host is chosen as it lifts, unless the press turned into a scroll or a long press — the
 * host drawn in its place where the press itself redrew it (a canvas settling a node it began to drag).
 */
type PendingTap = {
    readonly pointerId: number;
    readonly host: HTMLElement | null;
    readonly identity: HostIdentity | null;
};

export type ActionBarEngineOptions = {
    readonly root?: ParentNode;
    /** The page's components by id (the runtime's `DomRegistry`), through which an opener the page redrew away is found again. */
    readonly dom?: ComponentIndex;
};

export class ActionBarEngine {
    private readonly root: ParentNode;
    private readonly components: ComponentIndex | null;
    private readonly shown = new Map<HTMLElement, ShownBar>();

    // The host the reader chose, and what it stands for; the host is null while its row is not on the page (a window scrolled past).
    private chosen: HTMLElement | null = null;
    private identity: HostIdentity | null = null;
    private scopeObserver: MutationObserver | null = null;

    private pendingTap: PendingTap | null = null;

    // What held the keyboard before it went into a bar, for Escape to give it back.
    private cameFrom: HTMLElement | null = null;

    // The host whose menu its "more" opened: its bar stands under the menu until it closes, for the keyboard to come back to "more".
    private menuHost: HTMLElement | null = null;

    public constructor(options: ActionBarEngineOptions = {}) {
        this.root = options.root ?? document;
        this.components = options.dom ?? null;

        this.root.addEventListener("pointerdown", domEvent => this.handlePointerDown(domEvent));
        this.root.addEventListener("pointerup", domEvent => this.handlePointerUp(domEvent));
        this.root.addEventListener("pointercancel", () => {
            this.pendingTap = null;
        });
        this.root.addEventListener("contextmenu", domEvent => this.handleContextMenu(domEvent));
        // A drag takes the row away under the pointer: its bar goes, rather than being carried into the drag's picture.
        this.root.addEventListener("dragstart", () => this.choose(null));
        this.root.addEventListener("focusin", domEvent => this.handleFocusIn(domEvent));
        this.root.addEventListener("focusout", domEvent => this.handleFocusOut(domEvent));
        this.root.addEventListener("keydown", domEvent => this.handleKeyDown(domEvent));
        // Capture phase: the scroll of any box around a host, which does not bubble.
        this.root.addEventListener("scroll", () => this.markOut(), true);
    }

    /**
     * A mouse's or a pen's press chooses the host under it, or takes the bar away; a finger's waits to be a tap. A press in a bar or
     * in a context menu is neither. A right press chooses nothing: it opens the menu, and takes away a bar standing elsewhere.
     */
    private handlePointerDown(domEvent: Event): void {
        const pointer = domEvent as Partial<PointerEvent>;
        const target = domEvent.target instanceof Element ? domEvent.target : null;

        if (target === null || target.closest(`${BarSelector}, [${ContextMenuAttribute}]`) !== null)
            return;

        const host = pressedHostOf(target);

        if (pointer.pointerType === "touch") {
            this.pendingTap = { pointerId: pointer.pointerId ?? 0, host, identity: host === null ? null : identityOf(host) };
            return;
        }

        if ((pointer.button ?? 0) !== 0) {
            if (host !== this.chosen)
                this.choose(null);

            return;
        }

        if (host !== null && host === this.chosen)
            this.askAgain(host);
        else
            this.choose(host);
    }

    /** A finger lifted from a tap chooses what it tapped; a press its host kept shut (a drag beginning) asks for the bar again. */
    private handlePointerUp(domEvent: Event): void {
        const tap = this.pendingTap;

        this.pendingTap = null;

        if (tap !== null && tap.pointerId === ((domEvent as Partial<PointerEvent>).pointerId ?? 0)) {
            const host = tap.host !== null && !tap.host.isConnected && tap.identity !== null ? findByIdentity(tap.identity) : tap.host;

            if (host !== null && host === this.chosen)
                this.askAgain(host);
            else
                this.choose(host);
        }

        if (this.chosen !== null && this.chosen.isConnected && !this.shown.has(this.chosen))
            this.sync();
    }

    /**
     * A finger's long press opens the menu with the bar's icons in a row atop it (context-menu-engine.ts): the bar standing goes rather
     * than show the same icons twice, and nothing is chosen once the menu closes — the menu was the reader's way to the actions. A
     * right press keeps it (its menu has no row of icons), and so does "more", whose menu the bar stands under.
     */
    private handleContextMenu(domEvent: Event): void {
        this.pendingTap = null;

        if (domEvent instanceof MouseEvent && domEvent.target instanceof Element && domEvent.target.closest(BarSelector) === null && isTouchOpening(domEvent))
            this.choose(null);
    }

    private handleFocusIn(domEvent: Event): void {
        const target = domEvent.target instanceof HTMLElement ? domEvent.target : null;

        if (target === null)
            return;

        const bar = target.closest<HTMLElement>(BarSelector);

        if (bar !== null) {
            if (this.isHostedBar(bar))
                applyRovingTabIndex(barButtons(bar), target);

            return;
        }

        // The pointer's focus follows its press, which chose already; the menu "more" opened is the bar's own, and so is the owner
        // around the host it gives the keyboard back to as it closes ("more" was drawn again under it, and a package's node menu stands
        // outside the node) — the close takes it on to "more".
        if (isPointerLast() || this.isInOpenMenu(target) || (this.menuHost !== null && target.contains(this.menuHost)))
            return;

        this.choose(focusHostOf(target));
    }

    /** Notes where the keyboard came into a bar from. */
    private handleFocusOut(domEvent: Event): void {
        const to = (domEvent as FocusEvent).relatedTarget;
        const bar = to instanceof Element ? to.closest<HTMLElement>(BarSelector) : null;

        if (bar !== null && this.isHostedBar(bar) && domEvent.target instanceof HTMLElement && !bar.contains(domEvent.target))
            this.cameFrom = domEvent.target;
    }

    private handleKeyDown(domEvent: Event): void {
        if (!(domEvent instanceof KeyboardEvent) || !(domEvent.target instanceof HTMLElement))
            return;

        const target = domEvent.target;

        // The list's own engine moved its cursor on this key, before this one, and took it (an arrow scrolls nothing): the bar goes
        // with the cursor all the same.
        if (domEvent.defaultPrevented) {
            if (target.matches(SelectionRootSelector))
                this.choose(focusHostOf(target));

            return;
        }

        const bar = target.closest<HTMLElement>(BarSelector);

        if (bar !== null && target.classList.contains(ActionBarButtonClass)) {
            this.handleBarKey(domEvent, bar, target);
            return;
        }

        // Escape no popup took is the bar's: it goes. One in an open dialog the host is not in — the framework's, or a package's own
        // `<dialog>` — is the dialog's.
        if (domEvent.key === "Escape") {
            if (escapeIsClaimed(domEvent))
                return;

            const dialog = target.closest(OpenDialogSelector);

            if (dialog === null || (this.chosen !== null && dialog.contains(this.chosen))) {
                // Spent on a bar it took away, as each step of the Escape chain is: the field's own leave waits for the next.
                if (this.chosen !== null)
                    domEvent.preventDefault();

                this.choose(null);
            }

            return;
        }

        // Tab from a list goes to the bar of the row its cursor lights, the row's own way to its actions.
        if (domEvent.key === "Tab" && !domEvent.shiftKey && !domEvent.ctrlKey && !domEvent.altKey && !domEvent.metaKey && target.matches(SelectionRootSelector)) {
            const stop = this.chosen === null ? null : this.tabStopOf(this.chosen);

            if (stop !== null && target.contains(stop)) {
                domEvent.preventDefault();
                stop.focus();
            }

            return;
        }

        // The cursor moved on the list's own keydown, before this one: the bar goes with it.
        if (target.matches(SelectionRootSelector))
            this.choose(focusHostOf(target));
    }

    /** Along the bar with the arrows, Home and End; Escape gives the keyboard back to where it came into the bar from. */
    private handleBarKey(domEvent: KeyboardEvent, bar: HTMLElement, button: HTMLElement): void {
        if (domEvent.ctrlKey || domEvent.altKey || domEvent.metaKey)
            return;

        if (domEvent.key === "Escape") {
            if (!this.isHostedBar(bar))
                return;

            const host = this.hostOfBar(bar);
            // Only while it can still take the focus: a root made focusable for one return has given its tab index back since.
            const back = this.cameFrom !== null && this.cameFrom.isConnected && takesFocus(this.cameFrom) && host !== null && (host.contains(this.cameFrom) || this.cameFrom.contains(host))
                ? this.cameFrom
                : liveFocusReturn(host, this.components);

            domEvent.preventDefault();
            back?.focus();
            return;
        }

        const buttons = barButtons(bar);
        const next = resolveRovingTarget({ key: domEvent.key, items: buttons, current: button, axis: "horizontal" });

        if (next === null)
            return;

        domEvent.preventDefault();
        moveRovingFocus(buttons, next);
    }

    /** Chooses a host, or none: its bar shows and every other goes. The one chosen already is left as it stands. */
    private choose(host: HTMLElement | null): void {
        // None chosen is also a host waiting for its row to come back (a window scrolled past it), which a choice of none forgets.
        if (host === null ? this.chosen === null && this.identity === null : host === this.chosen)
            return;

        this.chosen = host;
        this.identity = host === null ? null : identityOf(host);
        this.watchScope();
        this.sync();

        if (host !== null)
            this.makeRoomAbove(host);
    }

    /**
     * A host chosen at its scrolling box's top edge: the box scrolls down by what the bar lacks to stand above it, as a messenger
     * brings the message into view rather than covering the next one with its bar. Under the host only where the box cannot scroll
     * that far (its first row); only on a choice, never as the reader scrolls the chosen host up there.
     */
    private makeRoomAbove(host: HTMLElement): void {
        const shown = this.shown.get(host);
        const box = viewBoxAround(host);

        if (shown === undefined || box === null || !canScroll(box, true))
            return;

        const top = Math.max(0, box.getBoundingClientRect().top + box.clientTop);
        const shortfall = Math.ceil(shown.bar.getBoundingClientRect().height + barGapOf(host) - (host.getBoundingClientRect().top - top));

        if (shortfall <= 0 || shortfall > box.scrollTop)
            return;

        box.scrollTop -= shortfall;
        repositionAnchoredPopup(shown.bar);
        this.markOut();
    }

    /**
     * The chosen host pressed again: its menu is asked again, as for a showing, and a host that keeps it shut for the press (a canvas
     * starting a drag of it) has no bar meanwhile — it is asked for again as the press ends.
     */
    private askAgain(host: HTMLElement): void {
        const shown = this.shown.get(host);

        if (shown === undefined) {
            this.sync();
            return;
        }

        if (actionBarMenuOf(host, true) === null)
            this.hide(host, shown);
    }

    /** Watches the chosen host's row or siblings, for the host drawn anew in its place and for a list redrawn around it. */
    private watchScope(): void {
        this.scopeObserver?.disconnect();
        this.scopeObserver = null;

        if (this.identity === null)
            return;

        this.scopeObserver = new MutationObserver(() => this.scopeChanged());
        this.scopeObserver.observe(this.identity.scope, { childList: true, subtree: true, characterData: true });
    }

    /** The chosen host's place changed: the host drawn in its place keeps the bar, and the bar is placed again over it. */
    private scopeChanged(): void {
        const identity = this.identity;

        if (identity === null)
            return;

        if (this.chosen === null || !this.chosen.isConnected) {
            // The rows' own box gone with its list: nothing comes back to choose.
            if (!identity.scope.isConnected) {
                this.choose(null);
                return;
            }

            this.chosen = findByIdentity(identity);
            this.sync();
        }

        for (const shown of this.shown.values())
            repositionAnchoredPopup(shown.bar);

        this.markOut();
    }

    /** Shows the bars of the chosen host and of the one whose menu its "more" opened, and takes every other away. */
    private sync(): void {
        for (const [host, shown] of this.shown) {
            if ((host !== this.chosen && host !== this.menuHost) || !host.isConnected)
                this.hide(host, shown);
        }

        for (const host of [this.chosen, this.menuHost]) {
            if (host !== null && host.isConnected && !this.shown.has(host))
                this.show(host);
        }
    }

    private show(host: HTMLElement): void {
        // Asked as an opening would ask it, so an engine that sets its entries for what the menu is opened on sets them for this host.
        const menu = actionBarMenuOf(host, true);

        if (menu === null)
            return;

        const bar = document.createElement("div");

        bar.className = ActionBarClass;
        bar.setAttribute("role", "toolbar");
        clientStrings.write(bar, "aria-label", "ui.actionbar.label");
        // A press on the bar is never its host's — a row's click, a surface's press, a drag of the row.
        bar.setAttribute(EventBoundaryAttribute, "");
        bar.setAttribute(NoRowDragAttribute, "");

        if (!drawBar(bar, menu, button => this.openMore(host, button), false))
            return;

        // Inside the host, before the host's own menu, which a renderer writes last in the host: the host's content keeps its last
        // child, and the bar's events still pass through the host. Placed fixed, so no box around the host clips it.
        host.insertBefore(bar, ownMenuHost(host));
        placeAnchoredPopup(host, bar, { placement: barPlacement(host), gap: barGapOf(host), boundary: viewBoxAround(host) ?? undefined });
        bar.classList.toggle(OutClass, isClippedOut(host));

        // An entry's words, state and mark change while the bar stands — a push, a language switch: the bar is drawn again.
        const observer = new MutationObserver(() => this.redraw(host));

        observer.observe(menu, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: EntryStateAttributes });

        const row = rowOfHost(host);

        row?.setAttribute(RowBarAttribute, "");
        this.shown.set(host, { bar, menu, observer, row });
        shownAt.set(bar, Date.now());
    }

    /** Draws a shown bar again, the keyboard kept on the button of the entry it was on. */
    private redraw(host: HTMLElement): void {
        const shown = this.shown.get(host);

        if (shown === undefined)
            return;

        const active = document.activeElement;
        const focused = active instanceof HTMLElement && shown.bar.contains(active) ? active : null;
        const entry = focused === null ? null : actionBarEntryOf(focused);

        if (!drawBar(shown.bar, shown.menu, button => this.openMore(host, button), host === this.menuHost)) {
            this.hide(host, shown);
            return;
        }

        if (focused === null)
            return;

        const buttons = barButtons(shown.bar);
        // "More" is the one button standing for no entry.
        const again = buttons.find(button => actionBarEntryOf(button) === entry) ?? buttons.find(isRovingCandidate) ?? null;

        moveRovingFocus(buttons, again);
    }

    /** "More" opens the menu itself, as a right press there would; the bar stands under it, its "more" said to be open, until it closes. */
    private openMore(host: HTMLElement, button: HTMLElement): void {
        const shown = this.shown.get(host);

        if (shown === undefined || isHeld(button))
            return;

        this.menuHost = host;
        openMenuFrom(button);

        // The opening kept the menu shut: the bar answers to the choice alone again.
        if (!shown.menu.classList.contains(MenuOpenClass)) {
            this.menuHost = null;
            return;
        }

        markMoreOpen(shown.bar, true);

        const observer = new MutationObserver(() => {
            if (shown.menu.classList.contains(MenuOpenClass))
                return;

            observer.disconnect();
            this.closeMore(host);
        });

        observer.observe(shown.menu, { attributes: true, attributeFilter: ["class"] });
    }

    /**
     * The menu "more" opened has closed. A keyboard's close gave the focus back to the menu's owner — "more" itself was drawn again
     * under the menu — and it goes on to "more", where it came from; a pointer's press keeps the focus where it put it.
     */
    private closeMore(host: HTMLElement): void {
        if (this.menuHost !== host)
            return;

        this.menuHost = null;
        this.sync();

        const shown = this.shown.get(host);

        if (shown === undefined)
            return;

        markMoreOpen(shown.bar, false);

        const active = document.activeElement;

        if (!isPointerLast() && (active === null || active === document.body || host.contains(active) || active.contains(host)))
            moreButtonOf(shown.bar)?.focus();
    }

    private hide(host: HTMLElement, shown: ShownBar): void {
        shown.observer.disconnect();
        releaseAnchoredPopup(shown.bar);
        shown.bar.remove();
        this.shown.delete(host);

        // Another bar over the same row (the one "more" opened beside the chosen) keeps it marked.
        if (shown.row !== null && ![...this.shown.values()].some(other => other.row === shown.row))
            shown.row.removeAttribute(RowBarAttribute);
    }

    /** A bar whose host the scroll took wholly out of sight is not seen floating against nothing; back in sight, it is again. */
    private markOut(): void {
        for (const [host, shown] of this.shown)
            shown.bar.classList.toggle(OutClass, isClippedOut(host));
    }

    /** Whether the focus went into the menu a shown bar's "more" opened, which may stand outside its host (a package's node menu). */
    private isInOpenMenu(target: Element): boolean {
        for (const shown of this.shown.values()) {
            if (shown.menu.classList.contains(MenuOpenClass) && shown.menu.contains(target))
                return true;
        }

        return false;
    }

    /** The button of a shown bar the keyboard enters it by. */
    private tabStopOf(host: HTMLElement): HTMLElement | null {
        const shown = this.shown.get(host);

        return shown === undefined ? null : barButtons(shown.bar).find(button => button.tabIndex === 0) ?? null;
    }

    /** A bar this engine stands over a host, not the row of icons atop a menu a long press opened. */
    private isHostedBar(bar: HTMLElement): boolean {
        return this.hostOfBar(bar) !== null;
    }

    private hostOfBar(bar: HTMLElement): HTMLElement | null {
        for (const [host, shown] of this.shown) {
            if (shown.bar === bar)
                return host;
        }

        return null;
    }
}

/**
 * The host a press chose: the nearest around what it landed on, or — on a row's own edge, around the host its template draws — the
 * host in that row. A press on another component in the row (a day's header over its first message) chooses none.
 */
function pressedHostOf(target: Element): HTMLElement | null {
    const host = target.closest<HTMLElement>(HostSelector);

    if (host !== null)
        return host;

    const row = target.closest(`[${ComponentKeyAttribute}]`);
    const component = target.closest(ComponentSelector);

    return row === null || (component !== null && !component.contains(row)) ? null : hostsIn(row)[0] ?? null;
}

/**
 * The host the keyboard is in: on a list holding the focus, the host in the row its cursor lights (the rows are no tab stops of
 * their own); elsewhere the nearest host around the focus.
 */
function focusHostOf(active: Element): HTMLElement | null {
    if (active instanceof HTMLElement && active.matches(SelectionRootSelector)) {
        const row = cursorRowOf(active);
        const host = row === null ? undefined : hostsIn(row)[0];

        if (host !== undefined)
            return host;
    }

    return active.closest<HTMLElement>(HostSelector);
}

/** The hosts an element holds, itself first where it is one. */
function hostsIn(element: Element): HTMLElement[] {
    const inside = [...element.querySelectorAll<HTMLElement>(HostSelector)];

    return element.matches(HostSelector) ? [element as HTMLElement, ...inside] : inside;
}

function identityOf(host: HTMLElement): HostIdentity | null {
    const own = host.getAttribute(ActionBarKeyAttribute);

    if (own !== null && host.parentElement !== null)
        return { scope: host.parentElement, attribute: ActionBarKeyAttribute, key: own, index: 0 };

    const row = host.closest(`[${ComponentKeyAttribute}]`);
    const key = row?.getAttribute(ComponentKeyAttribute) ?? null;

    if (row === null || key === null || row.parentElement === null)
        return null;

    return { scope: row.parentElement, attribute: ComponentKeyAttribute, key, index: hostsIn(row).indexOf(host) };
}

/** The host drawn in the place of the one an identity was taken from; null while nothing stands there. */
function findByIdentity(identity: HostIdentity): HTMLElement | null {
    for (const child of identity.scope.children) {
        if (child.getAttribute(identity.attribute) === identity.key)
            return hostsIn(child)[identity.index] ?? null;
    }

    return null;
}

/** Above the host, at its end, its start or its middle as the host says, the page's direction mirroring start and end. */
function barPlacement(host: HTMLElement): AnchoredPopupPlacement {
    const alignment = host.getAttribute(ActionBarAttribute);

    if (alignment === "center")
        return "top";

    const rightToLeft = getComputedStyle(host).direction === "rtl";

    return (alignment === "start") !== rightToLeft ? "top-start" : "top-end";
}

/** The room between a host and its bar: the host's own `--ui-action-bar-gap` in pixels, else the framework's. */
function barGapOf(host: HTMLElement): number {
    const own = Number.parseFloat(getComputedStyle(host).getPropertyValue(BarGapProperty));

    return Number.isFinite(own) ? own : BarGap;
}

/**
 * The list's row a host's bar stands over, as each list draws it: a table's row is a host itself, an items view's or a table's row holds
 * one as its child, a tree's row in its node face's wrapper. A host further inside a row (a card in a template) has none.
 */
function rowOfHost(host: HTMLElement): Element | null {
    if (host.classList.contains(TableRowClass))
        return host;

    const parent = host.parentElement;

    if (parent === null)
        return null;

    if (parent.matches(HostRowSelector))
        return parent;

    const row = parent.parentElement;

    return parent.classList.contains(TreeNodeWrapperClass) && row !== null && row.classList.contains(TreeRowClass) ? row : null;
}

/** Draws the bar's buttons from its menu, one tab stop among them; false when the menu has nothing shown to offer. */
function drawBar(bar: HTMLElement, menu: HTMLElement, openMore: (button: HTMLElement) => void, menuOpen: boolean): boolean {
    const { entries, more } = readActionBarEntries(menu);

    if (entries.length === 0 && !more)
        return false;

    const buttons = drawActionBar(bar, {
        entries,
        more,
        role: "button",
        press: pressEntry,
        openMore
    });

    // Not yet laid out: the first button that answers is the stop, read off its state rather than its box.
    applyRovingTabIndex(buttons, buttons.find(button => !isInert(button)) ?? buttons[0] ?? null);
    markMoreOpen(bar, menuOpen);

    return true;
}

/** Says on "more" whether its menu is open; open, its tooltip stays away as an open popup trigger's does (tooltip-engine.ts). */
function markMoreOpen(bar: HTMLElement, open: boolean): void {
    moreButtonOf(bar)?.setAttribute("aria-expanded", open ? "true" : "false");
}

/** "More", the one button standing for no entry. */
function moreButtonOf(bar: HTMLElement): HTMLElement | null {
    return barButtons(bar).find(button => actionBarEntryOf(button) === null) ?? null;
}

/** The host's own context menu, a child of its root, where the owner is the host; null where the menu stands elsewhere. */
function ownMenuHost(host: HTMLElement): HTMLElement | null {
    for (const child of host.children) {
        if (child.hasAttribute(ContextMenuAttribute))
            return child as HTMLElement;
    }

    return null;
}

function barButtons(bar: HTMLElement): HTMLElement[] {
    return [...bar.querySelectorAll<HTMLElement>(`:scope > .${ActionBarButtonClass}`)];
}

/**
 * An icon's press: the menu hears the opening it would hear before its own press — the engine that sets its entries for what it was
 * opened on choosing the host now — then the entry is pressed as the menu presses it, unless the opening left it out or turned it off.
 */
function pressEntry(entry: HTMLElement, button: HTMLElement): void {
    if (isInert(button) || isHeld(button))
        return;

    const menu = actionBarMenuOf(button, false);

    if (menu === null || !menu.contains(entry) || isInert(entry) || !isShownEntry(entry, menu))
        return;

    entry.click();
}

/** A finger's press on a bar that came up less than a double tap ago: the second tap of a double tap on its host, never a press. */
function isHeld(button: HTMLElement): boolean {
    const bar = button.closest<HTMLElement>(BarSelector);
    const at = bar === null ? undefined : shownAt.get(bar);

    return at !== undefined && isTouchLast() && Date.now() - at < DoubleTapHold;
}

/** "More" opens the menu itself under the button, as a right press there would, the keyboard's press giving it the first entry. */
function openMenuFrom(button: HTMLElement): void {
    const rect = button.getBoundingClientRect();

    button.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true, cancelable: true, button: 2, clientX: rect.left, clientY: rect.bottom }));
}

/** Whether a script's focus would land on the element: focusable by its markup or by a tab index of any value. */
function takesFocus(element: HTMLElement): boolean {
    return element.matches(FocusableSelector) || element.hasAttribute("tabindex");
}
