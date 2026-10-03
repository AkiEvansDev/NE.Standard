// The shell's skip link (WebViewRenderer, on a page with a left side): Enter or a press moves the keyboard to the content region,
// past the header and the side, and the address keeps no `#`. The region takes the focus for that moment only — a tab index written
// then and taken off as the focus leaves — since a region that could always be focused would take it from every press on its plain parts.

import { RegionAttribute, SkipLinkAttribute } from "../addressing/dom-attributes.ts";

const RootSelector = "[data-ui-root]";
const ContentRegion = "content";

export type SkipLinkEngineOptions = {
    readonly root?: ParentNode;
};

export class SkipLinkEngine {
    public constructor(options: SkipLinkEngineOptions = {}) {
        (options.root ?? document).addEventListener("click", domEvent => this.handleClick(domEvent));
    }

    private handleClick(domEvent: Event): void {
        if (!(domEvent.target instanceof Element))
            return;

        const link = domEvent.target.closest(`[${SkipLinkAttribute}]`);
        const content = link?.closest(RootSelector)?.querySelector<HTMLElement>(`:scope > [${RegionAttribute}="${ContentRegion}"]`) ?? null;

        if (content === null)
            return;

        domEvent.preventDefault();
        focusRegion(content);
    }
}

/** Puts the keyboard on a region that is no stop of its own, the next Tab going to the first stop inside it. */
function focusRegion(region: HTMLElement): void {
    if (!region.hasAttribute("tabindex")) {
        region.setAttribute("tabindex", "-1");
        region.addEventListener("blur", () => region.removeAttribute("tabindex"), { once: true });
    }

    region.focus();
}
