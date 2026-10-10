// Switching tabs: a click moves one attribute over strip and pages already in the DOM, and the new key goes back the two-way path.

import { BindSelectedKeyAttribute, TabsSelectedAttribute, VisibilityTierAttributes } from "../addressing/dom-attributes.ts";
import { isFieldKey } from "./caret-fields.ts";
import { happenedInside, observeComponents } from "./dom-mutations.ts";
import { isLaidOut } from "./element-visibility.ts";
import { isInert } from "./interactive-state.ts";
import { isPlainKey } from "./keyboard-shortcut.ts";
import { ownDescendants } from "./own-descendants.ts";
import { applyRovingTabIndex, resolveRovingTarget } from "./roving-focus.ts";
import { resolveShownKey, writeSelectedKey } from "./selected-key.ts";
import { OverflowButtonClass, StripFitter } from "./strip-overflow.ts";
import { fadeInPage, reserveCaptionWidth, slideCaptionMark } from "./tab-switch.ts";

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
            wraps: root => root.classList.contains(NoOverflowModifier),
            hiddenClass: OverflowedModifier,
            refit: root => this.apply(root),
            pick: (root, key) => this.pickFromOverflow(root, key)
        });

        this.applyAll(this.root.querySelectorAll<HTMLElement>(`.${RootClass}`));

        this.root.addEventListener("click", domEvent => this.handleClick(domEvent), true);
        this.root.addEventListener("keydown", domEvent => this.handleKeydown(domEvent), true);

        // A patch, a caption hidden or shown, or a strip arriving whole with its attribute already written all apply again.
        // What happens inside a page is its own: a table patched there must not force a strip layout on every push.
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

    /** Marks the current caption and shows its page; a key naming no shown caption hands over to the first shown one and writes it back. */
    private apply(root: HTMLElement): void {
        const selected = root.getAttribute(TabsSelectedAttribute) ?? "";
        const headers = this.ownHeaders(root);
        const shownHeaders = headers.filter(isShown);
        const shownKey = resolveShownKey(shownHeaders, selected, header => header.getAttribute(TabKeyAttribute) ?? "");

        if (shownKey !== null && shownKey !== selected) {
            this.select(root, shownKey);
            return;
        }

        const previous = headers.find(header => header.classList.contains(SelectedModifier)) ?? null;
        let current: HTMLElement | null = null;

        for (const header of headers) {
            const own = (header.getAttribute(TabKeyAttribute) ?? "") === selected;

            header.classList.toggle(SelectedModifier, own);
            header.setAttribute("aria-selected", own ? "true" : "false");
            reserveCaptionWidth(header);

            if (own)
                current = header;
        }

        this.fitHeaders(root, shownHeaders, current);
        slideCaptionMark(previous, current);

        // Only the captions left on the strip take part in arrow-key travel; a hidden one is reached through the list.
        applyRovingTabIndex(headers.filter(header => !header.classList.contains(OverflowedModifier)), current);

        for (const page of this.ownPages(root)) {
            page.hidden = (page.getAttribute(PageAttribute) ?? "") !== selected;

            if (!page.hidden && previous !== null && previous !== current)
                fadeInPage(page);
        }
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

            return this.ownHeaders(root).filter(isShown).map(header => {
                const key = header.getAttribute(TabKeyAttribute) ?? "";

                return { key, title: header.textContent?.trim() ?? key, current: key === selected, disabled: isInert(header) };
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

        if (header === null || isInert(header))
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
        if (!(domEvent instanceof KeyboardEvent) || domEvent.defaultPrevented || !(domEvent.target instanceof Element) || isFieldKey(domEvent) || !isPlainKey(domEvent))
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

/** A caption its author shows: laid out, or hidden only by the fit. */
function isShown(header: HTMLElement): boolean {
    // By layout alone, a caption the fitter hid would drop out of the next fit and stay hidden with no "…" to reach it.
    return header.classList.contains(OverflowedModifier) || isLaidOut(header);
}
