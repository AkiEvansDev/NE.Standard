// Switching tabs is instant and local: the strip and the pages are already in the DOM, so a click only has
// to move one attribute. The new key is then written back through the ordinary two-way path, which is what
// lets a controller both read the current tab and drive it — the same shape a Select's value has.

import { applyRovingTabIndex, resolveRovingTarget } from "./roving-focus";

const RootClass = "ui-tabs";
const HeaderClass = "ui-tab-header";
const SelectedModifier = "ui-tab-header--selected";

const SelectedAttribute = "data-ui-tabs-selected";
const TabKeyAttribute = "data-ui-tab-key";
const PageAttribute = "data-ui-tab-page";
/** The generic binding attribute `RenderProperty` emits for `SelectedKey`; see ValueBindingEngine. */
const SelectedKeyBindingAttribute = "data-ui-bind-selected-key";

export type TabsEngineOptions = {
    readonly root?: ParentNode;
};

export class TabsEngine {
    private readonly root: ParentNode;

    public constructor(options: TabsEngineOptions = {}) {
        this.root = options.root ?? document;

        this.applyAll(this.root.querySelectorAll<HTMLElement>(`.${RootClass}`));

        this.root.addEventListener("click", domEvent => this.handleClick(domEvent), true);
        this.root.addEventListener("keydown", domEvent => this.handleKeydown(domEvent), true);

        if (this.root instanceof Node) {
            // A server patch writes the same attribute a click does, so re-applying off the mutation is all
            // that is needed for a controller-driven switch.
            const observer = new MutationObserver(mutations => {
                for (const mutation of mutations) {
                    if (mutation.type === "attributes"
                        && mutation.attributeName === SelectedAttribute
                        && mutation.target instanceof HTMLElement) {
                        this.apply(mutation.target);
                    }
                }
            });

            observer.observe(this.root, { attributes: true, subtree: true, attributeFilter: [SelectedAttribute] });
        }
    }

    private applyAll(roots: Iterable<HTMLElement>): void {
        for (const root of roots)
            this.apply(root);
    }

    /**
     * Marks the current caption and shows its page. Both are decided here rather than server-side, so the
     * strip and the pages can never disagree about which tab is current.
     */
    private apply(root: HTMLElement): void {
        const selected = root.getAttribute(SelectedAttribute) ?? "";

        const headers = this.ownHeaders(root);
        let current: HTMLElement | null = null;

        for (const header of headers) {
            const own = (header.getAttribute(TabKeyAttribute) ?? "") === selected;

            header.classList.toggle(SelectedModifier, own);
            header.setAttribute("aria-selected", own ? "true" : "false");

            if (own)
                current = header;
        }

        applyRovingTabIndex(headers, current);

        for (const page of this.ownPages(root))
            page.hidden = (page.getAttribute(PageAttribute) ?? "") !== selected;
    }

    private handleClick(domEvent: Event): void {
        if (!(domEvent.target instanceof Element))
            return;

        const header = domEvent.target.closest<HTMLElement>(`.${HeaderClass}`);

        if (header === null || header.matches(":disabled, .ui-disabled"))
            return;

        const root = header.closest<HTMLElement>(`.${RootClass}`);
        const key = header.getAttribute(TabKeyAttribute);

        // Scoped to the strip that owns it: a tabs component nested inside another's page must not switch the
        // outer one.
        if (root === null || key === null || header.closest(`.${RootClass}`) !== root)
            return;

        domEvent.preventDefault();
        this.select(root, key);
    }

    private handleKeydown(domEvent: Event): void {
        if (!(domEvent instanceof KeyboardEvent) || !(domEvent.target instanceof Element))
            return;

        const header = domEvent.target.closest<HTMLElement>(`.${HeaderClass}`);
        const root = header?.closest<HTMLElement>(`.${RootClass}`) ?? null;

        if (header === null || root === null)
            return;

        // A strip runs horizontally, so only the horizontal arrows walk it. Hidden captions are skipped
        // rather than focused-and-invisible: a hidden page is not reachable.
        const next = resolveRovingTarget({
            key: domEvent.key,
            items: this.ownHeaders(root),
            current: header,
            axis: "horizontal"
        });

        if (next === null)
            return;

        domEvent.preventDefault();

        // A strip selects as the caret moves — that is the pattern, and what makes arrows worth having here
        // rather than tab-then-Enter.
        this.select(root, next.getAttribute(TabKeyAttribute) ?? "");
        next.focus();
    }

    private select(root: HTMLElement, key: string): void {
        if (key.length === 0 || root.getAttribute(SelectedAttribute) === key)
            return;

        root.setAttribute(SelectedAttribute, key);
        this.apply(root);

        // The write-back travels the generic two-way path: the bound element carries the binding attribute and
        // a "change" is what ValueBindingEngine listens for.
        if (root.hasAttribute(SelectedKeyBindingAttribute))
            root.dispatchEvent(new Event("change", { bubbles: true }));
    }

    private ownHeaders(root: HTMLElement): HTMLElement[] {
        return [...root.querySelectorAll<HTMLElement>(`.${HeaderClass}`)]
            .filter(header => header.closest(`.${RootClass}`) === root);
    }

    private ownPages(root: HTMLElement): HTMLElement[] {
        return [...root.querySelectorAll<HTMLElement>(`[${PageAttribute}]`)]
            .filter(page => page.closest(`.${RootClass}`) === root);
    }
}
