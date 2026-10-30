// A wizard's sequence of steps: the step matching SelectedKey is current (data-ui-selected, aria-current="step"), the shown steps before
// it are completed (data-ui-step-completed), and a press or arrow key on a selectable step chooses it.

import { BindSelectedKeyAttribute, ComponentKeyAttribute, HiddenClass, OrientationVerticalClass, SelectedAttribute, SelectedKeyAttribute, StepCollapsedAttribute, StepCompletedAttribute, StepsClass, StepsItemClass, StepsStackedAttribute, UnselectableAttribute, VisibilityTierAttributes, writeAttribute } from "../addressing/dom-attributes.ts";
import { currentResponsiveTier, onTierChange, reachesTier } from "../rendering/responsive-tier.ts";
import type { ResponsiveTier } from "../rendering/responsive-tier.ts";
import { markSteps } from "./breadcrumbs-engine.ts";
import { observeComponents } from "./dom-mutations.ts";
import { isInert, isItemDisabled, isItemRefused } from "./interactive-state.ts";
import { isPlainKey } from "./keyboard-shortcut.ts";
import { ownDescendants } from "./own-descendants.ts";
import { applyRovingTabIndex, isRovingCandidate, resolveRovingTarget } from "./roving-focus.ts";
import { writeSelectedKey } from "./selected-key.ts";

export type StepsEngineOptions = {
    readonly root?: ParentNode;
};

export class StepsEngine {
    private readonly root: ParentNode;
    private readonly clickListener: (domEvent: Event) => void;
    private readonly keyDownListener: (domEvent: Event) => void;
    private readonly offTierChange: () => void;
    private readonly observer: MutationObserver | null;
    private readonly fittedWidths = new WeakMap<Element, number>();
    private readonly neededWidths = new WeakMap<HTMLElement, number>();
    private readonly resizes = typeof ResizeObserver === "function"
        ? new ResizeObserver((entries, observer) => {
            const roots = new Set<HTMLElement>();

            for (const entry of entries) {
                if (!entry.target.isConnected) {
                    observer.unobserve(entry.target);
                    continue;
                }

                if (entry.target instanceof HTMLElement && this.fittedWidths.get(entry.target) !== entry.contentRect.width) {
                    this.fittedWidths.set(entry.target, entry.contentRect.width);
                    roots.add(entry.target);
                }
            }

            for (const root of roots)
                this.fit(root);
        })
        : null;

    public constructor(options: StepsEngineOptions = {}) {
        this.root = options.root ?? document;
        this.clickListener = domEvent => this.handleClick(domEvent);
        this.keyDownListener = domEvent => this.handleKeyDown(domEvent);

        this.applyAll(this.root.querySelectorAll<HTMLElement>(`.${StepsClass}`));

        this.root.addEventListener("click", this.clickListener, true);
        this.root.addEventListener("keydown", this.keyDownListener, true);

        this.offTierChange = onTierChange(() => this.applyAll(this.root.querySelectorAll<HTMLElement>(`.${StepsClass}`)));

        this.observer = observeComponents(
            this.root,
            `.${StepsClass}`,
            { childList: true, addedOnly: true, attributeFilter: [SelectedKeyAttribute, UnselectableAttribute, "class", ...VisibilityTierAttributes] },
            roots => this.applyAll(roots)
        );
    }

    public dispose(): void {
        this.root.removeEventListener("click", this.clickListener, true);
        this.root.removeEventListener("keydown", this.keyDownListener, true);
        this.offTierChange();
        this.observer?.disconnect();
        this.resizes?.disconnect();
    }

    private applyAll(roots: Iterable<HTMLElement>): void {
        for (const root of roots)
            this.apply(root);
    }

    private apply(root: HTMLElement): void {
        const items = this.ownItems(root);
        const tier = currentResponsiveTier();

        markSteps(items);

        const shown = items.filter(item => !item.classList.contains(HiddenClass));
        const key = root.getAttribute(SelectedKeyAttribute) ?? "";
        const selectedIndex = key.length === 0 ? -1 : shown.findIndex(item => item.getAttribute(ComponentKeyAttribute) === key);
        const selectable: HTMLElement[] = [];
        let current: HTMLElement | null = null;

        for (const item of items) {
            const shownIndex = shown.indexOf(item);
            const selected = selectedIndex >= 0 && shownIndex === selectedIndex;
            const completed = selectedIndex >= 0 && shownIndex >= 0 && shownIndex < selectedIndex;

            item.toggleAttribute(SelectedAttribute, selected);
            item.toggleAttribute(StepCompletedAttribute, completed);
            writeAttribute(item, "aria-current", selected ? "step" : null);

            if (canSelect(item, tier)) {
                writeAttribute(item, "role", "button");
                selectable.push(item);

                if (selected)
                    current = item;
            }
            else {
                item.removeAttribute("tabindex");
                item.removeAttribute("role");
            }
        }

        applyRovingTabIndex(selectable, current ?? selectable.find(isRovingCandidate) ?? null);
        this.neededWidths.delete(root);
        this.resizes?.observe(root);
        this.fit(root, items);
    }

    /** Stacks a horizontal strip vertically when its single-row width overflows its container, and unstacks once the room returns. */
    private fit(root: HTMLElement, own?: readonly HTMLElement[]): void {
        if (!reachesTier("sm") || root.classList.contains(OrientationVerticalClass)) {
            root.removeAttribute(StepsStackedAttribute);
            this.neededWidths.delete(root);
            return;
        }

        const items = own ?? this.ownItems(root);
        const host = items[0]?.parentElement ?? null;

        if (host === null || host.clientWidth <= 0)
            return;

        if (root.hasAttribute(StepsStackedAttribute)) {
            const needed = this.neededWidths.get(root) ?? 0;

            if (needed > 0 && host.clientWidth + 1 < needed)
                return;

            root.removeAttribute(StepsStackedAttribute);
        }

        if (host.scrollWidth > host.clientWidth + 1) {
            this.neededWidths.set(root, host.scrollWidth);
            root.setAttribute(StepsStackedAttribute, "");
        }
        else {
            this.neededWidths.delete(root);
        }
    }

    private handleClick(domEvent: Event): void {
        if (!(domEvent.target instanceof Element))
            return;

        const item = domEvent.target.closest<HTMLElement>(`.${StepsItemClass}`);
        const root = item?.closest<HTMLElement>(`.${StepsClass}`) ?? null;

        if (item === null || root === null || isInert(root) || !canSelect(item, currentResponsiveTier()))
            return;

        // A press on the item's circle or padding lands outside the template root where OnItemClick is wired; forward it there once.
        if (domEvent.target === item && item.firstElementChild instanceof HTMLElement) {
            domEvent.stopImmediatePropagation();
            domEvent.stopPropagation();
            item.firstElementChild.click();
            return;
        }

        this.choose(root, item);
    }

    private handleKeyDown(domEvent: Event): void {
        if (!(domEvent instanceof KeyboardEvent) || domEvent.defaultPrevented || !(domEvent.target instanceof Element))
            return;

        const item = domEvent.target.closest<HTMLElement>(`.${StepsItemClass}`);
        const root = item?.closest<HTMLElement>(`.${StepsClass}`) ?? null;

        if (item === null || root === null || isInert(root) || !isPlainKey(domEvent))
            return;

        const tier = currentResponsiveTier();

        if (domEvent.key === "Enter" || domEvent.key === " ") {
            if (!canSelect(item, tier))
                return;

            domEvent.preventDefault();
            (item.firstElementChild instanceof HTMLElement ? item.firstElementChild : item).click();
            return;
        }

        const selectable = this.ownItems(root).filter(candidate => canSelect(candidate, tier));
        const target = resolveRovingTarget({ key: domEvent.key, items: selectable, current: item, axis: "both" });

        if (target === null)
            return;

        domEvent.preventDefault();
        target.focus({ preventScroll: true });
        this.choose(root, target);
    }

    private choose(root: HTMLElement, item: HTMLElement): void {
        const key = item.getAttribute(ComponentKeyAttribute) ?? "";

        writeSelectedKey(root, key, { attribute: SelectedKeyAttribute, bindingAttribute: BindSelectedKeyAttribute, apply: target => this.apply(target) });
    }

    private ownItems(root: HTMLElement): HTMLElement[] {
        return ownDescendants(root, `.${StepsItemClass}`, `.${StepsClass}`);
    }
}

function canSelect(item: HTMLElement, tier: ResponsiveTier): boolean {
    return !item.classList.contains(HiddenClass) && !isStepCollapsed(item, tier) && !isItemDisabled(item) && !isItemRefused(item, UnselectableAttribute);
}

function isStepCollapsed(item: HTMLElement, tier: ResponsiveTier): boolean {
    const collapsed = item.getAttribute(StepCollapsedAttribute);

    return collapsed !== null && collapsed.split(" ").includes(tier);
}
