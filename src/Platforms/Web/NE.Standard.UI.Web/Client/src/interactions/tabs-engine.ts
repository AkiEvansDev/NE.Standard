// Switching tabs: a click moves one attribute over strip and pages already in the DOM, and the new key goes back the two-way path.

import { BindSelectedKeyAttribute, TabActionsAttribute, TabCaptionClass, TabCaptionOverflowedClass, TabCaptionSelectedClass, TabKeyAttribute, TabOverflowClass, TabPageAttribute, TabsBandClass, TabsClass, TabsNoOverflowClass, TabsOverflowingClass, TabsSelectedAttribute, TabsStripClass, VisibilityTierAttributes } from "../addressing/dom-attributes.ts";
import { isFieldKey } from "./caret-fields.ts";
import { happenedInside, observeComponents } from "./dom-mutations.ts";
import { isLaidOut } from "./element-visibility.ts";
import { isInert } from "./interactive-state.ts";
import { isPlainKey } from "./keyboard-shortcut.ts";
import { ownDescendants } from "./own-descendants.ts";
import { applyRovingTabIndex, moveRovingFocus, resolveRovingTarget } from "./roving-focus.ts";
import { resolveShownKey, writeSelectedKey } from "./selected-key.ts";
import { StripFitter } from "./strip-overflow.ts";
import { fadeInPage, reserveCaptionWidth, slideCaptionMark } from "./tab-switch.ts";

export type TabsEngineOptions = {
    readonly root?: ParentNode;
};

export class TabsEngine {
    private readonly root: ParentNode;
    private readonly fitter: StripFitter;

    public constructor(options: TabsEngineOptions = {}) {
        this.root = options.root ?? document;
        this.fitter = new StripFitter({
            rootClass: TabsClass,
            overflowingClass: TabsOverflowingClass,
            wraps: root => root.classList.contains(TabsNoOverflowClass),
            hiddenClass: TabCaptionOverflowedClass,
            refit: root => this.apply(root),
            pick: (root, key) => this.pickFromOverflow(root, key)
        });

        this.applyAll(this.root.querySelectorAll<HTMLElement>(`.${TabsClass}`));

        this.root.addEventListener("click", domEvent => this.handleClick(domEvent), true);
        this.root.addEventListener("keydown", domEvent => this.handleKeydown(domEvent), true);

        // A patch, a caption hidden or shown, or a strip arriving whole with its attribute already written all apply again.
        // What happens inside a page is its own: a table patched there must not force a strip layout on every push.
        observeComponents(
            this.root,
            `.${TabsClass}`,
            { childList: true, attributeFilter: [TabsSelectedAttribute, ...VisibilityTierAttributes], relevant: mutation => !happenedInside(mutation, `[${TabPageAttribute}]`, `.${TabsClass}`) },
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

        const previous = headers.find(header => header.classList.contains(TabCaptionSelectedClass)) ?? null;
        let current: HTMLElement | null = null;

        // A tab's own actions come and go with it, before the captions are fitted into the room they leave.
        for (const group of ownDescendants(root, `[${TabActionsAttribute}]`, `.${TabsClass}`))
            group.hidden = (group.getAttribute(TabActionsAttribute) ?? "") !== selected;

        for (const header of headers) {
            const own = (header.getAttribute(TabKeyAttribute) ?? "") === selected;

            header.classList.toggle(TabCaptionSelectedClass, own);
            header.setAttribute("aria-selected", own ? "true" : "false");
            reserveCaptionWidth(header);

            if (own)
                current = header;
        }

        this.fitHeaders(root, shownHeaders, current);
        slideCaptionMark(previous, current);

        // Only the captions left on the strip take part in arrow-key travel; a hidden one is reached through the list.
        const visibleHeaders = headers.filter(header => !header.classList.contains(TabCaptionOverflowedClass));
        const stop = previous !== null && previous !== current
            ? current
            : visibleHeaders.find(header => header === document.activeElement) ?? current;

        applyRovingTabIndex(visibleHeaders, stop);

        for (const page of this.ownPages(root)) {
            page.hidden = (page.getAttribute(TabPageAttribute) ?? "") !== selected;

            if (!page.hidden && previous !== null && previous !== current)
                fadeInPage(page);
        }
    }

    /** Hides the captions past the strip's room and shows the "…" control when any is hidden. */
    private fitHeaders(root: HTMLElement, headers: readonly HTMLElement[], selected: HTMLElement | null): void {
        const strip = root.querySelector<HTMLElement>(`:scope > .${TabsStripClass}, :scope > .${TabsBandClass} > .${TabsStripClass}`);
        const button = strip?.querySelector<HTMLElement>(`:scope > .${TabOverflowClass}`) ?? null;

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

        const overflowButton = domEvent.target.closest<HTMLElement>(`.${TabOverflowClass}`);
        const overflowRoot = overflowButton?.closest<HTMLElement>(`.${TabsClass}`) ?? null;

        if (overflowButton !== null && overflowRoot !== null && overflowButton.closest(`.${TabsClass}`) === overflowRoot) {
            domEvent.preventDefault();
            this.toggleOverflow(overflowRoot, overflowButton);
            return;
        }

        const header = domEvent.target.closest<HTMLElement>(`.${TabCaptionClass}`);

        if (header === null || isInert(header))
            return;

        const root = header.closest<HTMLElement>(`.${TabsClass}`);
        const key = header.getAttribute(TabKeyAttribute);

        // Scoped to the strip that owns it: a nested tabs component must not switch the outer one.
        if (root === null || key === null || header.closest(`.${TabsClass}`) !== root)
            return;

        domEvent.preventDefault();
        this.select(root, key);
    }

    private handleKeydown(domEvent: Event): void {
        if (!(domEvent instanceof KeyboardEvent) || domEvent.defaultPrevented || !(domEvent.target instanceof Element) || isFieldKey(domEvent) || !isPlainKey(domEvent))
            return;

        const header = domEvent.target.closest<HTMLElement>(`.${TabCaptionClass}`);
        const root = header?.closest<HTMLElement>(`.${TabsClass}`) ?? null;

        if (header === null || root === null)
            return;

        // A strip runs horizontally, so only the horizontal arrows walk it; Enter and Space press the caption the caret is on.
        const headers = this.ownHeaders(root).filter(candidate => !candidate.classList.contains(TabCaptionOverflowedClass));
        const next = resolveRovingTarget({
            key: domEvent.key,
            items: headers,
            current: header,
            axis: "horizontal"
        });

        if (next === null)
            return;

        domEvent.preventDefault();
        moveRovingFocus(headers, next);
    }

    private select(root: HTMLElement, key: string): void {
        writeSelectedKey(root, key, { attribute: TabsSelectedAttribute, bindingAttribute: BindSelectedKeyAttribute, apply: target => this.apply(target) });
    }

    private ownHeaders(root: HTMLElement): HTMLElement[] {
        return ownDescendants(root, `.${TabCaptionClass}`, `.${TabsClass}`);
    }

    private ownPages(root: HTMLElement): HTMLElement[] {
        return ownDescendants(root, `[${TabPageAttribute}]`, `.${TabsClass}`);
    }
}

/** A caption its author shows: laid out, or hidden only by the fit. */
function isShown(header: HTMLElement): boolean {
    // By layout alone, a caption the fitter hid would drop out of the next fit and stay hidden with no "…" to reach it.
    return header.classList.contains(TabCaptionOverflowedClass) || isLaidOut(header);
}
