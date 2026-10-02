// A side as a drawer on a narrow screen (UIViewOptions.SideDrawers): opened by its header button, put away by a press outside,
// Escape, a link taken inside it, the fold switch lying where that button was, or the screen growing wide again. Open, the drawer
// is a focus holder, as a dialog's surface is.

import { CollapsedAttribute, CollapseToggleAttribute, cssAttributeValue, DrawerBackdropAttribute, DrawerOpenAttribute, DrawerToggleAttribute, FocusHolderAttribute, RegionAttribute } from "../addressing/dom-attributes.ts";
import { motion } from "../rendering/motion.ts";
import { DrawerBreakpointQuery } from "../rendering/responsive-tier.ts";
import { focusAsLastInput, isPointerLast, moveFocusInto, restoreFocusTo } from "./popup-focus.ts";

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

    // The drawers made holders while open, each with whether its tab index was this engine's to add.
    private readonly holders = new Map<HTMLElement, boolean>();

    public constructor(options: SideDrawerEngineOptions = {}) {
        this.root = options.root ?? document;

        this.root.addEventListener("click", domEvent => this.handleClick(domEvent));
        this.root.addEventListener("keydown", domEvent => this.handleKeydown(domEvent));

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
                this.toggle(shell, side);

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

        // A link taken inside an open drawer leaves the page it opened over: the next one starts with it put away.
        const link = domEvent.target.closest(LinkSelector);
        const drawer = link?.closest<HTMLElement>(`[${RegionAttribute}]`);
        const shell = drawer?.parentElement ?? null;

        if (drawer !== null && drawer !== undefined && shell?.getAttribute(DrawerOpenAttribute) === drawer.getAttribute(RegionAttribute))
            this.close(shell);
    }

    private handleKeydown(domEvent: Event): void {
        if (domEvent instanceof KeyboardEvent && domEvent.key === "Escape" && !domEvent.defaultPrevented)
            this.closeAll();
    }

    private toggle(shell: HTMLElement, side: string): void {
        if (shell.getAttribute(DrawerOpenAttribute) === side) {
            this.close(shell);
            return;
        }

        shell.setAttribute(DrawerOpenAttribute, side);
        this.markToggles(shell);

        const drawer = drawerOf(shell, side);

        if (drawer === null)
            return;

        this.hold(drawer);

        // Into the drawer, not behind the backdrop; retried each frame while its fade-in still hides the controls, unless the reader moved.
        // A press gives it to the drawer itself: a field of it focused at once would raise a phone's on-screen keyboard unasked.
        this.focusInto(shell, side, drawer, document.activeElement, isPointerLast(), performance.now() + motion.normal);
    }

    /** Makes an open drawer a focus holder: a field in it let go by Enter or Escape hands it the keyboard, not the page's body. */
    private hold(drawer: HTMLElement): void {
        if (this.holders.has(drawer) || drawer.hasAttribute(FocusHolderAttribute))
            return;

        const addsTabIndex = !drawer.hasAttribute("tabindex");

        drawer.setAttribute(FocusHolderAttribute, "");

        if (addsTabIndex)
            drawer.tabIndex = -1;

        this.holders.set(drawer, addsTabIndex);
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
            const toggle = shell.querySelector<HTMLElement>(`[${DrawerToggleAttribute}="${cssAttributeValue(side)}"]`);

            // From inside the drawer as any popup gives it back, a pointer's opening's as the pointer's; from the body, plainly.
            if (toggle !== null && drawer !== null && drawer.contains(active))
                restoreFocusTo(toggle, drawer);
            else if (toggle !== null)
                focusAsLastInput(toggle);
        }

        this.release(drawer);
    }

    private markToggles(shell: HTMLElement): void {
        const open = shell.getAttribute(DrawerOpenAttribute);

        for (const toggle of shell.querySelectorAll<HTMLElement>(`[${DrawerToggleAttribute}]`))
            toggle.setAttribute("aria-expanded", String(toggle.getAttribute(DrawerToggleAttribute) === open));
    }

    /** Takes the holder's marks off a drawer put away: a side standing in its column again is no layer. */
    private release(drawer: HTMLElement | null): void {
        const addedTabIndex = drawer === null ? undefined : this.holders.get(drawer);

        if (drawer === null || addedTabIndex === undefined)
            return;

        this.holders.delete(drawer);
        drawer.removeAttribute(FocusHolderAttribute);

        if (addedTabIndex)
            drawer.removeAttribute("tabindex");
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

function drawerOf(shell: HTMLElement, side: string): HTMLElement | null {
    return shell.querySelector<HTMLElement>(`:scope > [${RegionAttribute}="${cssAttributeValue(side)}"]`);
}
