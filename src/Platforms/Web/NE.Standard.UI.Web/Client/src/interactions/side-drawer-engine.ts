// A side as a drawer below the width its view names (UIViewOptions.SideDrawers): opened by its header button, or a button of the
// page's own (ButtonComponent.OpensDrawer); put away by a press outside, Escape, a link or a menu entry taken inside it, the fold switch
// lying where that button was, or the screen crossing a breakpoint that stands its side in its column. Open over its backdrop, the
// drawer is a modal dialog: a focus holder, as a dialog's surface is, Tab kept inside it, and Escape closing it at once, from a field
// in it too, once no popup is open.
// A side the view leaves modeless (UIViewOptions.LeftDrawerModal) opens over the page as it is, which keeps working beside it, and
// Escape puts it away only from inside it. A pin (MenuComponent.DrawerPin, ButtonComponent.PinsDrawer) stands a side in its column
// from the medium breakpoint up, kept in the browser under the first authored id in the side and written on the root as the parser
// reaches that id (boot.ts): before the content after it paints, a right side's not before the content ahead of it.

import { BottomBarAttribute, CollapsedAttribute, ComponentNameAttribute, CollapseToggleAttribute, cssAttributeValue, DrawerBackdropAttribute, DrawerModelessAttribute, DrawerOpenAttribute, DrawerPinAttribute, DrawerSwitchAttribute, DrawerSwitchRowAttribute, DrawerToggleAttribute, FocusHolderAttribute, MenuItemClass, MenuPopupSelector, pinnedAttribute, RegionAttribute } from "../addressing/dom-attributes.ts";
import { escapeIsClaimed } from "./field-escape.ts";
import { isComposing } from "./keyboard-shortcut.ts";
import { choosesMenuEntry } from "./menu-group-engine.ts";
import { isBehindModal } from "./open-dialogs.ts";
import { hasOpenPopups } from "./popup-dismissal.ts";
import { motion } from "../rendering/motion.ts";
import { clientStrings } from "../runtime/client-strings.ts";
import { DrawerBreakpointQueries, isBottomBarSide, sideIsDrawer } from "../rendering/side-drawer-width.ts";
import { ClientStore } from "../state/client-store.ts";
import { focusAsLastInput, isPointerLast, moveFocusInto, restoreFocusTo, trapTab } from "./popup-focus.ts";

const RootSelector = "[data-ui-root]";
const LinkSelector = "a[href]";
const CollapsibleClass = "ui-collapsible";
const BarClass = "ui-collapsible__bar";
const RightSide = "right-side";
const LeftEdgeClass = "ui-side--left";
const RightEdgeClass = "ui-side--right";
const PinnedSlot = "pinned";

export type SideDrawerEngineOptions = {
    readonly root?: ParentNode;
};

export class SideDrawerEngine {
    private readonly root: ParentNode;

    // The drawers held while open — a modal one as a focus holder — each with whether its tab index and its name were this engine's to
    // add and the role it had.
    private readonly holders = new Map<HTMLElement, { readonly modal: boolean; readonly addsTabIndex: boolean; readonly addsName: boolean; readonly role: string | null }>();

    // The button that opened each shell's drawer, which the keyboard goes back to: a side may have more than one.
    private readonly openers = new WeakMap<HTMLElement, HTMLElement>();

    // The name each open drawer's own switch had before it was called what it does there, given back as the drawer is put away.
    private readonly switchNames = new Map<HTMLElement, string | null>();

    private readonly store = new ClientStore();

    public constructor(options: SideDrawerEngineOptions = {}) {
        this.root = options.root ?? document;

        this.root.addEventListener("click", domEvent => this.handleClick(domEvent));
        // Capturing, ahead of the field keys' leave: a drawer closes on the first Escape, as a dialog does.
        this.root.addEventListener("keydown", domEvent => this.handleKeydown(domEvent), true);

        // Across a breakpoint a side may stand in its column again: a drawer left open would hold the page under its backdrop.
        if (typeof matchMedia === "function") {
            for (const query of DrawerBreakpointQueries)
                matchMedia(query).addEventListener("change", () => this.refit());
        }

        for (const shell of document.querySelectorAll<HTMLElement>(RootSelector))
            markPins(shell);
    }

    private handleClick(domEvent: Event): void {
        if (!(domEvent.target instanceof Element))
            return;

        const toggle = domEvent.target.closest<HTMLElement>(`[${DrawerToggleAttribute}]`);

        if (toggle !== null) {
            const shell = toggle.closest<HTMLElement>(RootSelector);
            const side = toggle.getAttribute(DrawerToggleAttribute);

            if (shell !== null && side !== null)
                this.toggle(shell, side, toggle);

            return;
        }

        const pin = domEvent.target.closest<HTMLElement>(`[${DrawerPinAttribute}]`);

        if (pin !== null) {
            const shell = pin.closest<HTMLElement>(RootSelector);
            const side = pin.getAttribute(DrawerPinAttribute);

            if (shell !== null && side !== null)
                this.pin(shell, side, !shell.hasAttribute(pinnedAttribute(side)), pin);

            return;
        }

        if (domEvent.target.closest(`[${DrawerBackdropAttribute}]`) !== null) {
            this.closeAll();
            return;
        }

        // A switch that just unfolded its panel (collapsible-engine.ts, prevented) reads as an open one by now: that press was the fold's.
        const fold = domEvent.target.closest(`[${CollapseToggleAttribute}]`);

        if (fold !== null && !domEvent.defaultPrevented && isDrawerFoldSwitch(fold)) {
            this.closeAll();
            return;
        }

        // A link taken inside an open drawer leaves the page it opened over, and a menu entry pressed there has done what the drawer was
        // opened for: the page goes on with it put away.
        const taken = domEvent.target.closest<HTMLElement>(`${LinkSelector}, .${MenuItemClass}`);
        const drawer = taken?.closest<HTMLElement>(`[${RegionAttribute}]`);
        const shell = drawer?.parentElement ?? null;

        if (taken !== null && drawer !== null && drawer !== undefined && shell?.getAttribute(DrawerOpenAttribute) === drawer.getAttribute(RegionAttribute) && closesDrawer(taken))
            this.close(shell);
    }

    private handleKeydown(domEvent: Event): void {
        if (!(domEvent instanceof KeyboardEvent) || domEvent.defaultPrevented || isComposing(domEvent))
            return;

        if (domEvent.key === "Tab") {
            this.trapTab(domEvent);
            return;
        }

        // A popup open in the drawer or over it takes the first Escape, as a dialog leaves it to one.
        if (domEvent.key !== "Escape" || escapeIsClaimed(domEvent) || hasOpenPopups())
            return;

        let closed = false;

        // A modeless drawer leaves the keys of the page beside it alone: only an Escape from inside puts it away.
        for (const { shell, drawer, modal } of this.openDrawers()) {
            if (!modal && !drawer.contains(document.activeElement))
                continue;

            this.close(shell);
            closed = true;
        }

        if (closed)
            domEvent.preventDefault();
    }

    /** Tab stays in an open modal drawer, round from its last stop to its first, as in a modal dialog; a modeless one lets it go on. */
    private trapTab(domEvent: KeyboardEvent): void {
        for (const { drawer, modal } of this.openDrawers()) {
            if (modal)
                trapTab(drawer, domEvent);
        }
    }

    /** The drawers open now that the keyboard can reach: not one a modal dialog opened from it stands over, whose keys are the dialog's. */
    private openDrawers(): { readonly shell: HTMLElement; readonly drawer: HTMLElement; readonly modal: boolean }[] {
        const drawers: { readonly shell: HTMLElement; readonly drawer: HTMLElement; readonly modal: boolean }[] = [];

        for (const shell of document.querySelectorAll<HTMLElement>(`${RootSelector}[${DrawerOpenAttribute}]`)) {
            const side = shell.getAttribute(DrawerOpenAttribute) ?? "";
            const drawer = drawerOf(shell, side);

            if (drawer !== null && !isBehindModal(drawer))
                drawers.push({ shell, drawer, modal: isModal(shell, side) });
        }

        return drawers;
    }

    /**
     * Puts away each open drawer whose side a breakpoint stood in its column again, and stands the switch of one still a drawer over
     * its opener again, which the new width may have moved.
     */
    private refit(): void {
        for (const shell of document.querySelectorAll<HTMLElement>(`${RootSelector}[${DrawerOpenAttribute}]`)) {
            const side = shell.getAttribute(DrawerOpenAttribute) ?? "";
            const drawer = drawerOf(shell, side);
            const opener = this.openers.get(shell);

            if (drawer === null || !sideIsDrawer(shell, side))
                this.close(shell);
            else if (opener?.isConnected === true)
                this.placeSwitch(drawer, opener);
        }
    }

    private toggle(shell: HTMLElement, side: string, opener: HTMLElement): void {
        if (shell.getAttribute(DrawerOpenAttribute) === side) {
            this.close(shell);
            return;
        }

        const drawer = drawerOf(shell, side);

        // A page's own button naming a side that is no drawer — none, the phone's bottom bar, or one standing in its column at this
        // width — opens nothing.
        if (drawer === null || drawer.hasAttribute(BottomBarAttribute) || !sideIsDrawer(shell, side))
            return;

        // One drawer open at a time: the other side's is put away first, its holder's marks and its switch's name given back.
        if (shell.hasAttribute(DrawerOpenAttribute))
            this.close(shell);

        shell.setAttribute(DrawerOpenAttribute, side);
        this.openers.set(shell, opener);
        this.markToggles(shell);
        this.hold(drawer, isModal(shell, side));
        this.placeSwitch(drawer, opener);

        // Into the drawer, not behind the backdrop; retried each frame while its fade-in still hides the controls, unless the reader moved.
        // A press gives it to the drawer itself: a field of it focused at once would raise a phone's on-screen keyboard unasked.
        this.focusInto(shell, side, drawer, document.activeElement, isPointerLast(), performance.now() + motion.normal);
    }

    /**
     * Makes an open drawer focusable, as a press gives it the keyboard, and a modal one a modal dialog — over its backdrop the page
     * behind is out of reach — and a focus holder: a field in it let go by Enter or Escape hands it the keyboard, not the page's body.
     */
    private hold(drawer: HTMLElement, modal: boolean): void {
        if (this.holders.has(drawer) || drawer.hasAttribute(FocusHolderAttribute))
            return;

        const addsTabIndex = !drawer.hasAttribute("tabindex");
        // A dialog is named; a side named by its page keeps that name, one with none is called what it is.
        const addsName = modal && !drawer.hasAttribute("aria-label") && !drawer.hasAttribute("aria-labelledby");

        this.holders.set(drawer, { modal, addsTabIndex, addsName, role: drawer.getAttribute("role") });

        if (addsTabIndex)
            drawer.tabIndex = -1;

        if (!modal)
            return;

        drawer.setAttribute(FocusHolderAttribute, "");
        drawer.setAttribute("role", "dialog");
        drawer.setAttribute("aria-modal", "true");

        if (addsName)
            drawer.setAttribute("aria-label", clientStrings.text("ui.side.panel"));
    }

    /**
     * Stands the drawer's own switch where the button that opened it is, in that button's size, and calls it what it does there: the
     * drawer opens and goes away under one button that stays put. The place is custom properties the drawer's rules read
     * (side-drawers.less), so the switch keeps it while the drawer slides away and a side standing in its column again leaves it unread.
     */
    private placeSwitch(drawer: HTMLElement, opener: HTMLElement): void {
        const fold = drawerSwitch(drawer);
        const target = opener.getBoundingClientRect();

        if (fold === null)
            return;

        if (!this.switchNames.has(fold))
            this.switchNames.set(fold, fold.getAttribute("aria-label"));

        fold.setAttribute("aria-label", clientStrings.text("ui.side.close"));

        const row = fold.parentElement?.classList.contains(BarClass) === true ? fold.parentElement : fold;

        // A button out of sight — a collapsed header's — leaves the switch where the side's own padding puts it.
        if (target.width === 0 || target.height === 0) {
            fold.removeAttribute(DrawerSwitchAttribute);
            row.removeAttribute(DrawerSwitchRowAttribute);
            return;
        }

        fold.style.setProperty("--ui-drawer-switch-width", `${target.width}px`);
        fold.style.setProperty("--ui-drawer-switch-height", `${target.height}px`);
        fold.style.setProperty("--ui-drawer-switch-x", "0px");
        row.style.setProperty("--ui-drawer-switch-y", "0px");
        fold.setAttribute(DrawerSwitchAttribute, "");
        row.setAttribute(DrawerSwitchRowAttribute, "");

        // Measured in its new size, against the drawer's own box: the drawer is still off its edge by a transform, which its offset
        // leaves out, and slides only across. An opener beyond that box — lower on the page, across the screen — leaves the switch at
        // the box's nearest edge rather than out of the drawer or its content pushed down after it.
        const box = fold.getBoundingClientRect();
        const frame = drawer.getBoundingClientRect();
        const left = within(target.left - drawer.offsetLeft, drawer.clientWidth - box.width);
        const top = within(target.top - frame.top, drawer.clientHeight - box.height);

        fold.style.setProperty("--ui-drawer-switch-x", `${left - (box.left - frame.left)}px`);
        row.style.setProperty("--ui-drawer-switch-y", `${top - (box.top - frame.top)}px`);
    }

    private focusInto(shell: HTMLElement, side: string, drawer: HTMLElement, from: Element | null, pressed: boolean, until: number): void {
        if (shell.getAttribute(DrawerOpenAttribute) !== side || document.activeElement !== from || drawer.contains(from))
            return;

        moveFocusInto(drawer, pressed ? drawer : null);

        if (performance.now() < until && document.activeElement === from)
            requestAnimationFrame(() => this.focusInto(shell, side, drawer, from, pressed, until));
    }

    /**
     * Pins a side or unpins it: pinned, it stands in its column from the medium breakpoint up — put away first, as a drawer, if open —
     * and the pin is kept under the first authored id in the side (its root, or a menu in plain boxes), written on the next page's root
     * as the parser reaches that id. A pin pressed inside the side keeps the keyboard there as it stands in its column; unpinned, the side is
     * a drawer put away, and the keyboard goes to the button that opens it. A bottom bar takes no pin: it stands as a bar whatever is
     * pinned.
     */
    private pin(shell: HTMLElement, side: string, pinned: boolean, pin: HTMLElement): void {
        const drawer = drawerOf(shell, side);

        if (drawer === null || isBottomBarSide(shell, side))
            return;

        const inside = drawer.contains(pin);

        if (pinned && shell.getAttribute(DrawerOpenAttribute) === side)
            this.close(shell, !inside);

        shell.toggleAttribute(pinnedAttribute(side), pinned);
        markPins(shell);

        if (!pinned && inside && drawer.contains(document.activeElement)) {
            const toggle = this.returnTarget(shell, side);

            if (toggle !== null)
                focusAsLastInput(toggle);
        }

        const owner = drawer.querySelector(`[${ComponentNameAttribute}]`);

        if (owner !== null)
            this.store.write(owner, PinnedSlot, pinned ? "true" : null, pinned ? { root: true, attributes: { [pinnedAttribute(side)]: "" } } : null);
    }

    private closeAll(): void {
        for (const shell of document.querySelectorAll<HTMLElement>(`${RootSelector}[${DrawerOpenAttribute}]`))
            this.close(shell);
    }

    /** Puts a shell's open drawer away, and the keyboard back on its button unless `refocus` is off: a pin keeps it where it is. */
    private close(shell: HTMLElement, refocus = true): void {
        const side = shell.getAttribute(DrawerOpenAttribute);

        shell.removeAttribute(DrawerOpenAttribute);
        this.markToggles(shell);

        if (side === null)
            return;

        const drawer = drawerOf(shell, side);

        // Back to its button: not inside a drawer out of sight, nor on the body after a press on the backdrop, which takes no focus.
        const active = document.activeElement;

        if (refocus && (active === null || active === document.body || drawer?.contains(active) === true)) {
            const toggle = this.returnTarget(shell, side);

            // From inside the drawer as any popup gives it back, a pointer's opening's as the pointer's; from the body, plainly.
            if (toggle !== null && drawer !== null && drawer.contains(active))
                restoreFocusTo(toggle, drawer);
            else if (toggle !== null)
                focusAsLastInput(toggle);
        }

        this.release(drawer);
        this.renameSwitch(drawer);
    }

    /** The button the drawer opened from, or failing that the side's first one in sight: not one a collapsed header holds. */
    private returnTarget(shell: HTMLElement, side: string): HTMLElement | null {
        const opener = this.openers.get(shell);

        this.openers.delete(shell);

        if (opener?.isConnected === true && opener.getAttribute(DrawerToggleAttribute) === side && opener.checkVisibility())
            return opener;

        const toggles = [...shell.querySelectorAll<HTMLElement>(`[${DrawerToggleAttribute}="${cssAttributeValue(side)}"]`)];

        return toggles.find(toggle => toggle.checkVisibility()) ?? toggles[0] ?? null;
    }

    private markToggles(shell: HTMLElement): void {
        const open = shell.getAttribute(DrawerOpenAttribute);

        for (const toggle of shell.querySelectorAll<HTMLElement>(`[${DrawerToggleAttribute}]`))
            toggle.setAttribute("aria-expanded", String(toggle.getAttribute(DrawerToggleAttribute) === open));
    }

    /** Takes the holder's marks off a drawer put away: a side standing in its column again is no layer, and its landmark again. */
    private release(drawer: HTMLElement | null): void {
        const held = drawer === null ? undefined : this.holders.get(drawer);

        if (drawer === null || held === undefined)
            return;

        this.holders.delete(drawer);

        if (held.addsTabIndex)
            drawer.removeAttribute("tabindex");

        if (!held.modal)
            return;

        drawer.removeAttribute(FocusHolderAttribute);
        drawer.removeAttribute("aria-modal");

        if (held.role === null)
            drawer.removeAttribute("role");
        else
            drawer.setAttribute("role", held.role);

        if (held.addsName)
            drawer.removeAttribute("aria-label");
    }

    /** Gives a drawer put away its switch's own name back: in its column the switch folds the side again. It keeps its place, unread there. */
    private renameSwitch(drawer: HTMLElement | null): void {
        for (const [fold, name] of this.switchNames) {
            if (drawer?.contains(fold) !== true && fold.isConnected)
                continue;

            this.switchNames.delete(fold);

            if (name === null)
                fold.removeAttribute("aria-label");
            else
                fold.setAttribute("aria-label", name);
        }
    }
}

/**
 * The switch of the panel an open drawer starts with, hung on its edge, which puts the drawer away (`isDrawerFoldSwitch`); none where
 * no such panel heads the side — one further down lies nowhere near the button that opened the drawer.
 */
function drawerSwitch(drawer: HTMLElement): HTMLElement | null {
    for (const fold of drawer.querySelectorAll<HTMLElement>(`[${CollapseToggleAttribute}]`)) {
        if (isDrawerFoldSwitch(fold) && fold.checkVisibility() && headsDrawer(fold.closest(`.${CollapsibleClass}`), drawer))
            return fold;
    }

    return null;
}

/** Whether a panel is what a drawer starts with: the first element at every step down from the drawer to it. */
function headsDrawer(panel: Element | null, drawer: HTMLElement): boolean {
    let node = panel;

    while (node !== null && node !== drawer) {
        const parent: Element | null = node.parentElement;

        if (parent === null || parent.firstElementChild !== node)
            return false;

        node = parent;
    }

    return node === drawer;
}

/** A length clamped to 0 and `end`, or 0 where `end` is below it. */
function within(length: number, end: number): number {
    return Math.max(0, Math.min(length, end));
}

/**
 * Whether a fold switch is an open drawer's own: an open panel's hung on the drawer's edge — a sidebar menu's — stands where the
 * header's button was, under the drawer, so a press there puts the drawer away, as a second press on that button would, rather than
 * fold the panel (collapsible-engine.ts leaves it). A folded panel's switch still unfolds it: a drawer has room for the whole of it.
 */
export function isDrawerFoldSwitch(toggle: Element): boolean {
    const panel = toggle.closest(`.${CollapsibleClass}`);
    const drawer = panel?.closest(`[${RegionAttribute}]`);
    const side = drawer?.getAttribute(RegionAttribute);
    const shell = drawer?.parentElement;

    if (panel === null || panel === undefined || panel.hasAttribute(CollapsedAttribute) || side === null || side === undefined || shell === null || shell === undefined)
        return false;

    return shell.matches(RootSelector) && shell.getAttribute(DrawerOpenAttribute) === side && panel.classList.contains(side === RightSide ? RightEdgeClass : LeftEdgeClass);
}

/**
 * Whether a press on a link or a menu entry inside an open drawer puts it away: a link does, an entry as it would put its menu away
 * (`choosesMenuEntry`) — but not an entry of a popup menu (a context menu, a split button's list, a flyout's), which acts on the
 * drawer's own content.
 */
function closesDrawer(taken: HTMLElement): boolean {
    if (!taken.classList.contains(MenuItemClass))
        return true;

    return choosesMenuEntry(taken) && taken.closest(MenuPopupSelector) === null;
}

/** Whether a side's open drawer dims the page and holds it out of reach; a modeless one leaves it working beside it. */
function isModal(shell: Element, side: string): boolean {
    return !(shell.getAttribute(DrawerModelessAttribute) ?? "").split(" ").includes(side);
}

/** Tells every pin of the shell whether its side is pinned. */
function markPins(shell: Element): void {
    for (const pin of shell.querySelectorAll<HTMLElement>(`[${DrawerPinAttribute}]`))
        pin.setAttribute("aria-pressed", String(shell.hasAttribute(pinnedAttribute(pin.getAttribute(DrawerPinAttribute) ?? ""))));
}

function drawerOf(shell: HTMLElement, side: string): HTMLElement | null {
    return shell.querySelector<HTMLElement>(`:scope > [${RegionAttribute}="${cssAttributeValue(side)}"]`);
}
