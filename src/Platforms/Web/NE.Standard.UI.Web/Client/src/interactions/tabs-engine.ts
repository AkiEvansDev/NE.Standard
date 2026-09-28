// Switching tabs: a click moves one attribute over strip and pages already in the DOM, and the new key goes back the two-way path.

import { BindSelectedKeyAttribute, TabsSelectedAttribute, VisibilityTierAttributes } from "../addressing/dom-attributes";
import { happenedInside, observeComponents } from "./dom-mutations";
import { isLaidOut } from "./element-visibility";
import { ownDescendants } from "./own-descendants";
import { applyRovingTabIndex, resolveRovingTarget } from "./roving-focus";
import { writeSelectedKey } from "./selected-key";
import { OverflowButtonClass, StripFitter } from "./strip-overflow";

const RootClass = "ui-tabs";
const HeaderClass = "ui-tab-header";
const SelectedModifier = "ui-tab-header--selected";
const OverflowedModifier = "ui-tab-header--overflowed";
const OverflowingModifier = "ui-tabs--overflowing";
const NoOverflowModifier = "ui-tabs--no-overflow";
const StripClass = "ui-tabs__strip";

const TabKeyAttribute = "data-ui-tab-key";
const PageAttribute = "data-ui-tab-page";

export type TabsEngineOptions = {
    readonly root?: ParentNode;
};

export class TabsEngine {
    private readonly root: ParentNode;
    private readonly fitter: StripFitter;

    public constructor(options: TabsEngineOptions = {}) {
        this.root = options.root ?? document;
        this.fitter = new StripFitter({
            rootClass: RootClass,
            overflowingClass: OverflowingModifier,
            wrapsClass: NoOverflowModifier,
            hiddenClass: OverflowedModifier,
            refit: root => this.apply(root),
            pick: (root, key) => this.pickFromOverflow(root, key)
        });

        this.applyAll(this.root.querySelectorAll<HTMLElement>(`.${RootClass}`));

        this.root.addEventListener("click", domEvent => this.handleClick(domEvent), true);
        this.root.addEventListener("keydown", domEvent => this.handleKeydown(domEvent), true);

        // A server patch writes the same attribute a click does, as does a caption hidden or shown; a tabs view that arrives whole
        // (a row the client built) had its attribute written before it joined the document, so it's applied on arrival. What happens
        // inside a page is the page's own: a table patched there must not re-measure the strip with a forced layout on every push.
        observeComponents(
            this.root,
            `.${RootClass}`,
            { childList: true, attributeFilter: [TabsSelectedAttribute, ...VisibilityTierAttributes], relevant: mutation => !happenedInside(mutation, `[${PageAttribute}]`, `.${RootClass}`) },
            roots => this.applyAll(roots)
        );
    }

    private applyAll(roots: Iterable<HTMLElement>): void {
        for (const root of roots)
            this.apply(root);
    }

    /** Marks the current caption and shows its page; a selected caption that is hidden hands over to the first shown one. */
    private apply(root: HTMLElement): void {
        const selected = root.getAttribute(TabsSelectedAttribute) ?? "";
        const headers = this.ownHeaders(root);
        const selectedHeader = headers.find(header => (header.getAttribute(TabKeyAttribute) ?? "") === selected) ?? null;

        if (selectedHeader !== null && !isLaidOut(selectedHeader)) {
            const fallback = headers.find(isLaidOut);

            if (fallback !== undefined) {
                this.select(root, fallback.getAttribute(TabKeyAttribute) ?? "");
                return;
            }
        }

        let current: HTMLElement | null = null;

        for (const header of headers) {
            const own = (header.getAttribute(TabKeyAttribute) ?? "") === selected;

            header.classList.toggle(SelectedModifier, own);
            header.setAttribute("aria-selected", own ? "true" : "false");

            if (own)
                current = header;
        }

        this.fitHeaders(root, headers.filter(isLaidOut), current);

        // Only the captions left on the strip take part in arrow-key travel; a hidden one is reached through the list.
        applyRovingTabIndex(headers.filter(header => !header.classList.contains(OverflowedModifier)), current);

        for (const page of this.ownPages(root))
            page.hidden = (page.getAttribute(PageAttribute) ?? "") !== selected;
    }

    /** Hides the captions past the strip's room and shows the "…" control when any is hidden. */
    private fitHeaders(root: HTMLElement, headers: readonly HTMLElement[], selected: HTMLElement | null): void {
        const strip = root.querySelector<HTMLElement>(`:scope > .${StripClass}`);
        const button = strip?.querySelector<HTMLElement>(`:scope > .${OverflowButtonClass}`) ?? null;

        if (strip !== null && button !== null)
            this.fitter.fit(root, { room: strip, button, captions: headers, selected });
    }

    /** A tab picked from the list is the current one, fitted onto the strip first, and the keyboard carries on from its caption. */
    private pickFromOverflow(root: HTMLElement, key: string): void {
        this.select(root, key);
        this.ownHeaders(root).find(header => (header.getAttribute(TabKeyAttribute) ?? "") === key)?.focus({ preventScroll: true });
    }

    private toggleOverflow(root: HTMLElement, button: HTMLElement): void {
        this.fitter.toggleList(root, button, () => {
            const selected = root.getAttribute(TabsSelectedAttribute) ?? "";

            return this.ownHeaders(root).filter(isLaidOut).map(header => {
                const key = header.getAttribute(TabKeyAttribute) ?? "";

                return { key, title: header.textContent?.trim() ?? key, current: key === selected };
            });
        });
    }

    private handleClick(domEvent: Event): void {
        if (!(domEvent.target instanceof Element))
            return;

        const overflowButton = domEvent.target.closest<HTMLElement>(`.${OverflowButtonClass}`);
        const overflowRoot = overflowButton?.closest<HTMLElement>(`.${RootClass}`) ?? null;

        if (overflowButton !== null && overflowRoot !== null && overflowButton.closest(`.${RootClass}`) === overflowRoot) {
            domEvent.preventDefault();
            this.toggleOverflow(overflowRoot, overflowButton);
            return;
        }

        const header = domEvent.target.closest<HTMLElement>(`.${HeaderClass}`);

        if (header === null || header.matches(":disabled, .ui-disabled"))
            return;

        const root = header.closest<HTMLElement>(`.${RootClass}`);
        const key = header.getAttribute(TabKeyAttribute);

        // Scoped to the strip that owns it: a nested tabs component must not switch the outer one.
        if (root === null || key === null || header.closest(`.${RootClass}`) !== root)
            return;

        domEvent.preventDefault();
        this.select(root, key);
    }

    private handleKeydown(domEvent: Event): void {
        if (!(domEvent instanceof KeyboardEvent) || domEvent.defaultPrevented || !(domEvent.target instanceof Element))
            return;

        const header = domEvent.target.closest<HTMLElement>(`.${HeaderClass}`);
        const root = header?.closest<HTMLElement>(`.${RootClass}`) ?? null;

        if (header === null || root === null)
            return;

        // A strip runs horizontally, so only the horizontal arrows walk it.
        const next = resolveRovingTarget({
            key: domEvent.key,
            items: this.ownHeaders(root),
            current: header,
            axis: "horizontal"
        });

        if (next === null)
            return;

        domEvent.preventDefault();

        // A strip selects as the caret moves, rather than needing tab-then-Enter.
        this.select(root, next.getAttribute(TabKeyAttribute) ?? "");
        next.focus();
    }

    private select(root: HTMLElement, key: string): void {
        writeSelectedKey(root, key, { attribute: TabsSelectedAttribute, bindingAttribute: BindSelectedKeyAttribute, apply: target => this.apply(target) });
    }

    private ownHeaders(root: HTMLElement): HTMLElement[] {
        return ownDescendants(root, `.${HeaderClass}`, `.${RootClass}`);
    }

    private ownPages(root: HTMLElement): HTMLElement[] {
        return ownDescendants(root, `[${PageAttribute}]`, `.${RootClass}`);
    }
}
