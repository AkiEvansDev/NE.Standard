// A side as a drawer on a narrow screen (UIViewOptions.SideDrawers): opened by its header button, or a button of the page's own
// (ButtonComponent.OpensDrawer); put away by a press outside, Escape, a link or a menu entry taken inside it, the fold switch lying
// where that button was, or the screen growing wide again. Open over its backdrop, the drawer is a modal dialog: a focus holder, as a
// dialog's surface is, Tab kept inside it, and Escape closing it at once, from a field in it too, once no popup is open.

import { BottomBarAttribute, CollapsedAttribute, CollapseToggleAttribute, cssAttributeValue, DrawerBackdropAttribute, DrawerOpenAttribute, DrawerToggleAttribute, FocusHolderAttribute, MenuItemClass, MenuPopupSelector, RegionAttribute } from "../addressing/dom-attributes.ts";
import { escapeIsClaimed } from "./field-escape.ts";
import { isComposing } from "./keyboard-shortcut.ts";
import { choosesMenuEntry } from "./menu-group-engine.ts";
import { isBehindModal } from "./open-dialogs.ts";
import { hasOpenPopups } from "./popup-dismissal.ts";
import { motion } from "../rendering/motion.ts";
import { clientStrings } from "../runtime/client-strings.ts";
import { DrawerBreakpointQuery } from "../rendering/responsive-tier.ts";
import { focusAsLastInput, isPointerLast, moveFocusInto, restoreFocusTo, trapTab } from "./popup-focus.ts";

const RootSelector = "[data-ui-root]";
const LinkSelector = "a[href]";
const CollapsibleClass = "ui-collapsible";
const RightSide = "right-side";
const LeftEdgeClass = "ui-side--left";
const RightEdgeClass = "ui-side--right";

export type SideDrawerEngineOptions = {
    readonly root?: ParentNode;
};

export class SideDrawerEngine {
    private readonly root: ParentNode;

    // The drawers made modal holders while open, each with whether its tab index and its name were this engine's to add and the role it had.
    private readonly holders = new Map<HTMLElement, { readonly addsTabIndex: boolean; readonly addsName: boolean; readonly role: string | null }>();

    // The button that opened each shell's drawer, which the keyboard goes back to: a side may have more than one.
    private readonly openers = new WeakMap<HTMLElement, HTMLElement>();

    public constructor(options: SideDrawerEngineOptions = {}) {
        this.root = options.root ?? document;

        this.root.addEventListener("click", domEvent => this.handleClick(domEvent));
        // Capturing, ahead of the field keys' leave: a drawer closes on the first Escape, as a dialog does.
        this.root.addEventListener("keydown", domEvent => this.handleKeydown(domEvent), true);

        // Wide again, the side stands in its column: a drawer left open would hold the page under its backdrop.
        if (typeof matchMedia === "function")
            matchMedia(DrawerBreakpointQuery).addEventListener("change", () => this.closeAll());
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

        for (const { shell } of this.openDrawers()) {
            this.close(shell);
            closed = true;
        }

        if (closed)
            domEvent.preventDefault();
    }

    /** Tab stays in an open drawer, round from its last stop to its first, as in a modal dialog. */
    private trapTab(domEvent: KeyboardEvent): void {
        for (const { drawer } of this.openDrawers())
            trapTab(drawer, domEvent);
    }

    /** The drawers open now that the keyboard can reach: not one a modal dialog opened from it stands over, whose keys are the dialog's. */
    private openDrawers(): { readonly shell: HTMLElement; readonly drawer: HTMLElement }[] {
        const drawers: { readonly shell: HTMLElement; readonly drawer: HTMLElement }[] = [];

        for (const shell of document.querySelectorAll<HTMLElement>(`${RootSelector}[${DrawerOpenAttribute}]`)) {
            const drawer = drawerOf(shell, shell.getAttribute(DrawerOpenAttribute) ?? "");

            if (drawer !== null && !isBehindModal(drawer))
                drawers.push({ shell, drawer });
        }

        return drawers;
    }

    private toggle(shell: HTMLElement, side: string, opener: HTMLElement): void {
        if (shell.getAttribute(DrawerOpenAttribute) === side) {
            this.close(shell);
            return;
        }

        const drawer = drawerOf(shell, side);

        // A page's own button naming a side that is no drawer — none, or the phone's bottom bar — opens nothing.
        if (drawer === null || drawer.hasAttribute(BottomBarAttribute))
            return;

        shell.setAttribute(DrawerOpenAttribute, side);
        this.openers.set(shell, opener);
        this.markToggles(shell);
        this.hold(drawer);

        // Into the drawer, not behind the backdrop; retried each frame while its fade-in still hides the controls, unless the reader moved.
        // A press gives it to the drawer itself: a field of it focused at once would raise a phone's on-screen keyboard unasked.
        this.focusInto(shell, side, drawer, document.activeElement, isPointerLast(), performance.now() + motion.normal);
    }

    /**
     * Makes an open drawer a modal dialog — over its backdrop the page behind is out of reach — and a focus holder: a field in it let
     * go by Enter or Escape hands it the keyboard, not the page's body.
     */
    private hold(drawer: HTMLElement): void {
        if (this.holders.has(drawer) || drawer.hasAttribute(FocusHolderAttribute))
            return;

        const addsTabIndex = !drawer.hasAttribute("tabindex");
        // A dialog is named; a side named by its page keeps that name, one with none is called what it is.
        const addsName = !drawer.hasAttribute("aria-label") && !drawer.hasAttribute("aria-labelledby");

        this.holders.set(drawer, { addsTabIndex, addsName, role: drawer.getAttribute("role") });
        drawer.setAttribute(FocusHolderAttribute, "");
        drawer.setAttribute("role", "dialog");
        drawer.setAttribute("aria-modal", "true");

        if (addsName)
            drawer.setAttribute("aria-label", clientStrings.text("ui.side.panel"));

        if (addsTabIndex)
            drawer.tabIndex = -1;
    }

    private focusInto(shell: HTMLElement, side: string, drawer: HTMLElement, from: Element | null, pressed: boolean, until: number): void {
        if (shell.getAttribute(DrawerOpenAttribute) !== side || document.activeElement !== from || drawer.contains(from))
            return;

        moveFocusInto(drawer, pressed ? drawer : null);

        if (performance.now() < until && document.activeElement === from)
            requestAnimationFrame(() => this.focusInto(shell, side, drawer, from, pressed, until));
    }

    private closeAll(): void {
        for (const shell of document.querySelectorAll<HTMLElement>(`${RootSelector}[${DrawerOpenAttribute}]`))
            this.close(shell);
    }

    private close(shell: HTMLElement): void {
        const side = shell.getAttribute(DrawerOpenAttribute);

        shell.removeAttribute(DrawerOpenAttribute);
        this.markToggles(shell);

        if (side === null)
            return;

        const drawer = drawerOf(shell, side);

        // Back to its button: not inside a drawer out of sight, nor on the body after a press on the backdrop, which takes no focus.
        const active = document.activeElement;

        if (active === null || active === document.body || drawer?.contains(active) === true) {
            const toggle = this.returnTarget(shell, side);

            // From inside the drawer as any popup gives it back, a pointer's opening's as the pointer's; from the body, plainly.
            if (toggle !== null && drawer !== null && drawer.contains(active))
                restoreFocusTo(toggle, drawer);
            else if (toggle !== null)
                focusAsLastInput(toggle);
        }

        this.release(drawer);
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

    /** Takes the modal holder's marks off a drawer put away: a side standing in its column again is no layer, and its landmark again. */
    private release(drawer: HTMLElement | null): void {
        const held = drawer === null ? undefined : this.holders.get(drawer);

        if (drawer === null || held === undefined)
            return;

        this.holders.delete(drawer);
        drawer.removeAttribute(FocusHolderAttribute);
        drawer.removeAttribute("aria-modal");

        if (held.role === null)
            drawer.removeAttribute("role");
        else
            drawer.setAttribute("role", held.role);

        if (held.addsTabIndex)
            drawer.removeAttribute("tabindex");

        if (held.addsName)
            drawer.removeAttribute("aria-label");
    }
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

function drawerOf(shell: HTMLElement, side: string): HTMLElement | null {
    return shell.querySelector<HTMLElement>(`:scope > [${RegionAttribute}="${cssAttributeValue(side)}"]`);
}
