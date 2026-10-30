// Action bars over their hosts (`data-ui-action-bar`): one at a time, over the host the reader chose — pressed, tapped, or reached by
// the keyboard (in a list, the row its cursor lights) — standing above it as a floating layer the list's scrolling box never clips,
// until a press elsewhere, Escape, or another host chosen. Never on hover: a row carries nothing for its bar until it is chosen. The
// bar is a view of the host's context menu: a press on an icon is the entry's own press, after the opening its menu would have heard.

// `.ts` on the value imports: `node --test` loads this module as it is.
import { ActionBarAttribute, ActionBarButtonClass, ActionBarClass, ActionBarOutClass, ComponentKeyAttribute, ComponentSelector, ContextMenuAttribute, ContextMenuOpenClass, EventBoundaryAttribute, InActionBarAttribute, NoRowDragAttribute, PopupRoleSelector, RowBarAttribute, VisibilityTierAttributes } from "../addressing/dom-attributes.ts";
import { clientStrings } from "../rendering/client-strings.ts";
import type { HostIdentity } from "./action-bar.ts";
import { actionBarEntryOf, barButtons, barGapOf, barPlacement, drawActionBar, findByIdentity, hostsIn, identityOf, isShownEntry, markMoreOpen, moreButtonOf, openMenuFrom, ownMenuHost, readActionBarEntries, rowOfHost, takesFocus } from "./action-bar.ts";
import { placeAnchoredPopup, releaseAnchoredPopup, repositionAnchoredPopup } from "./anchored-popup.ts";
import { actionBarMenuOf, isTouchOpening } from "./context-menu-engine.ts";
import { canScroll, isClippedOut, isInSight, viewBoxAround } from "./element-visibility.ts";
import { escapeIsClaimed } from "./field-escape.ts";
import { isInert } from "./interactive-state.ts";
import { isPlainKey } from "./keyboard-shortcut.ts";
import { isBehindModal, OpenDialogSelector } from "./open-dialogs.ts";
import { registerEscapeLayer } from "./popup-dismissal.ts";
import { ownControlOf } from "./own-control.ts";
import { onlyPressWaves } from "./press-wave.ts";
import { isPointerLast, isTouchLast, liveFocusReturn } from "./popup-focus.ts";
import type { ComponentIndex } from "./popup-focus.ts";
import { applyRovingTabIndex, moveRovingFocus, isRovingCandidate, resolveRovingTarget } from "./roving-focus.ts";
import { cursorRowOf } from "./row-cursor.ts";
import { SelectionRootSelector } from "./row-selection.ts";

const HostSelector = `[${ActionBarAttribute}]`;
const BarSelector = `.${ActionBarClass}`;

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
        // A bar standing in a dialog or a drawer is nearer than they are: they leave it the Escape they would take, theirs the next one.
        registerEscapeLayer(target => this.takesEscape(target, true));
    }

    /**
     * A mouse's or a pen's press chooses the host under it, or takes the bar away; a finger's waits to be a tap. A press in a bar or
     * in a context menu is neither. A right press chooses nothing: it opens the menu, and takes away a bar standing elsewhere. A press
     * on a control of the host's own (a button, a link, a clickable picture) is the control's: it chooses nothing, and leaves a bar
     * standing on that host where it is.
     */
    private handlePointerDown(domEvent: Event): void {
        const pointer = domEvent as Partial<PointerEvent>;
        const target = domEvent.target instanceof Element ? domEvent.target : null;

        if (target === null || target.closest(`${BarSelector}, [${ContextMenuAttribute}]`) !== null)
            return;

        const pressed = pressedHostOf(target);
        const host = pressed !== null && pressed !== this.chosen && pressesOwnControl(target, pressed) ? null : pressed;

        if (pointer.pointerType === "touch") {
            this.pendingTap = { pointerId: pointer.pointerId ?? 0, host, identity: host === null ? null : identityOf(host) };
            return;
        }

        if ((pointer.button ?? 0) !== 0) {
            if (pressed !== this.chosen)
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

        if (this.chosen !== null && ((this.chosen.isConnected && !this.shown.has(this.chosen)) || isBehindModal(this.chosen)))
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

        // Escape no popup took is the bar's: it goes.
        if (domEvent.key === "Escape") {
            if (escapeIsClaimed(domEvent) || !this.takesEscape(target, false))
                return;

            // Spent on a bar it took away, as each step of the Escape chain is: the field's own leave waits for the next.
            if (this.chosen !== null)
                domEvent.preventDefault();

            this.choose(null);
            return;
        }

        // Tab from a list goes to the bar of the row its cursor lights, the row's own way to its actions.
        if (domEvent.key === "Tab" && isPlainKey(domEvent) && target.matches(SelectionRootSelector)) {
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
        if (!isPlainKey(domEvent, { shift: true }))
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

    /**
     * Whether an Escape landing on `target` is the bar's: not one in an open dialog the host is not in — the framework's, or a package's
     * own `<dialog>` — which is the dialog's. With `shown`, only while a bar stands in sight over the chosen host, as a dialog or a
     * drawer asks before leaving it the key.
     */
    private takesEscape(target: EventTarget | null, shown: boolean): boolean {
        const dialog = target instanceof Element ? target.closest(OpenDialogSelector) : null;
        const chosen = this.chosen;

        if (dialog !== null && (chosen === null || !dialog.contains(chosen)))
            return false;

        if (!shown)
            return true;

        const bar = chosen === null ? undefined : this.shown.get(chosen)?.bar;

        return chosen !== null && bar !== undefined && !bar.classList.contains(ActionBarOutClass) && isInSight(chosen) && !isBehindModal(chosen);
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

        this.scopeObserver = new MutationObserver(records => {
            // A press's wave in the chosen row is no new row.
            if (!onlyPressWaves(records))
                this.scopeChanged();
        });
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

    /**
     * Shows the bars of the chosen host and of the one whose menu its "more" opened, and takes every other away. A host a modal dialog
     * stands over is chosen no more, as after a press elsewhere: the reader went on to the dialog (a canvas's picker, opened as a wire
     * pulled from the host's pin is let go), and a bar shown after it opened stood in the top layer over it.
     */
    private sync(): void {
        if (this.chosen !== null && isBehindModal(this.chosen)) {
            this.chosen = null;
            this.identity = null;
            this.watchScope();
        }

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
        clientStrings.write(bar, "aria-label", "ui.actionbar.name");
        // A press on the bar is never its host's — a row's click, a surface's press, a drag of the row.
        bar.setAttribute(EventBoundaryAttribute, "");
        bar.setAttribute(NoRowDragAttribute, "");

        if (!drawBar(bar, menu, button => this.openMore(host, button), false))
            return;

        // Inside the host, before the host's own menu, which a renderer writes last in the host: the host's content keeps its last
        // child, and the bar's events still pass through the host. Placed fixed, so no box around the host clips it.
        host.insertBefore(bar, ownMenuHost(host));
        placeAnchoredPopup(host, bar, { placement: barPlacement(host), gap: barGapOf(host), boundary: viewBoxAround(host) ?? undefined });
        bar.classList.toggle(ActionBarOutClass, isClippedOut(host));

        // An entry's words, state and mark change while the bar stands — a push, a language switch: the bar is drawn again.
        const observer = new MutationObserver(records => {
            if (!onlyPressWaves(records))
                this.redraw(host);
        });

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
        if (!shown.menu.classList.contains(ContextMenuOpenClass)) {
            this.menuHost = null;
            return;
        }

        markMoreOpen(shown.bar, true);

        const observer = new MutationObserver(() => {
            if (shown.menu.classList.contains(ContextMenuOpenClass))
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
            shown.bar.classList.toggle(ActionBarOutClass, isClippedOut(host));
    }

    /** Whether the focus went into the menu a shown bar's "more" opened, which may stand outside its host (a package's node menu). */
    private isInOpenMenu(target: Element): boolean {
        for (const shown of this.shown.values()) {
            if (shown.menu.classList.contains(ContextMenuOpenClass) && shown.menu.contains(target))
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

/** Whether the press landed on a control of the host's own — not on the control the whole host is (a tile that is a button). */
function pressesOwnControl(target: Element, host: HTMLElement): boolean {
    const row = host.closest(`[${ComponentKeyAttribute}]`) ?? host;
    const control = ownControlOf(target, row);

    return control !== null && !isWholeOf(control, host);
}

// What stands beside a host's content and is no part of it: its right-click menu and the bar drawn over it.
const BesideContentSelector = `[${ContextMenuAttribute}], .${ActionBarClass}, ${PopupRoleSelector}`;

/**
 * Whether the control is the host as a whole, with nothing beside it on the way up — no part, no words — but the host's menu: a tile
 * that is a button. Being the row's one control is not enough — a message holding only a photo, a line holding only a link.
 */
function isWholeOf(control: Element, host: Element): boolean {
    if (control.contains(host))
        return true;

    for (let part: Element = control; part !== host;) {
        const parent = part.parentElement;

        if (parent === null)
            return false;

        let words = wordsOf(parent) - wordsOf(part);

        for (const sibling of parent.children) {
            if (sibling === part)
                continue;

            if (!sibling.matches(BesideContentSelector))
                return false;

            words -= wordsOf(sibling);
        }

        if (words > 0)
            return false;

        part = parent;
    }

    return true;
}

/** How many letters an element holds, its spacing aside. */
function wordsOf(element: Element): number {
    return (element.textContent ?? "").replace(/s+/g, "").length;
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
