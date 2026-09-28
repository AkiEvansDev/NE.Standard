// A side as a drawer on a narrow screen (UIViewOptions.SideDrawers): its button in the header slides it over the content, and a
// press outside it, Escape, a link taken inside it, or the screen growing wide enough to hold it again puts it away.

import { DrawerBackdropAttribute, DrawerOpenAttribute, DrawerToggleAttribute, RegionAttribute } from "../addressing/dom-attributes";
import { responsiveBreakpoints } from "../rendering/responsive-tier";

const RootSelector = "[data-ui-root]";
const LinkSelector = "a[href]";

export type SideDrawerEngineOptions = {
    readonly root?: ParentNode;
};

export class SideDrawerEngine {
    private readonly root: ParentNode;

    public constructor(options: SideDrawerEngineOptions = {}) {
        this.root = options.root ?? document;

        this.root.addEventListener("click", domEvent => this.handleClick(domEvent));
        this.root.addEventListener("keydown", domEvent => this.handleKeydown(domEvent));

        // Wide again, the side stands in its column: a drawer left open would hold the page under its backdrop.
        if (typeof matchMedia === "function")
            matchMedia(`(min-width: ${responsiveBreakpoints.md}px)`).addEventListener("change", () => this.closeAll());
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

        // Into the drawer, so a keyboard reader lands on what was opened rather than behind the backdrop.
        shell.querySelector<HTMLElement>(`:scope > [${RegionAttribute}="${CSS.escape(side)}"] :is(a[href], button, input, [tabindex="0"])`)?.focus();
    }

    private closeAll(): void {
        for (const shell of document.querySelectorAll<HTMLElement>(`${RootSelector}[${DrawerOpenAttribute}]`))
            this.close(shell);
    }

    private close(shell: HTMLElement): void {
        const side = shell.getAttribute(DrawerOpenAttribute);

        shell.removeAttribute(DrawerOpenAttribute);
        this.markToggles(shell);

        // Back to the button that opened it, so focus is not left inside a drawer now out of sight.
        if (side !== null && document.activeElement !== null && shell.querySelector(`:scope > [${RegionAttribute}="${CSS.escape(side)}"]`)?.contains(document.activeElement))
            shell.querySelector<HTMLElement>(`[${DrawerToggleAttribute}="${CSS.escape(side)}"]`)?.focus();
    }

    private markToggles(shell: HTMLElement): void {
        const open = shell.getAttribute(DrawerOpenAttribute);

        for (const toggle of shell.querySelectorAll<HTMLElement>(`[${DrawerToggleAttribute}]`))
            toggle.setAttribute("aria-expanded", String(toggle.getAttribute(DrawerToggleAttribute) === open));
    }
}
