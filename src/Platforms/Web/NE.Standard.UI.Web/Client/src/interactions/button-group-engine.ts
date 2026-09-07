// A button group's current segment: a press writes the key back the way a tab strip's does, a pushed key marks the
// segment the same way, and the arrows walk the strip like a radio group's.

import { BindSelectedKeyAttribute, ComponentKeyAttribute, SelectedAttribute, SelectedKeyAttribute } from "../addressing/dom-attributes";
import { observeComponents } from "./dom-mutations";
import { ownDescendants } from "./own-descendants";
import { applyRovingTabIndex, isRovingCandidate, resolveRovingTarget } from "./roving-focus";
import { writeSelectedKey } from "./selected-key";

const RootClass = "ui-button-group";
const ItemClass = "ui-button-group__item";
const ButtonClass = "ui-button";

export type ButtonGroupEngineOptions = {
    readonly root?: ParentNode;
};

export class ButtonGroupEngine {
    private readonly root: ParentNode;

    public constructor(options: ButtonGroupEngineOptions = {}) {
        this.root = options.root ?? document;

        this.applyAll(this.root.querySelectorAll<HTMLElement>(`.${RootClass}`));

        this.root.addEventListener("click", domEvent => this.handleClick(domEvent), true);
        this.root.addEventListener("keydown", domEvent => this.handleKeyDown(domEvent), true);

        // A pushed key and a re-rendered segment land as mutations with the same answer.
        observeComponents(this.root, `.${RootClass}`, { childList: true, attributeFilter: [SelectedKeyAttribute] }, roots => this.applyAll(roots));
    }

    private applyAll(roots: Iterable<HTMLElement>): void {
        for (const root of roots)
            this.apply(root);
    }

    /** Marks the current segment, tells the assistive tree, and leaves one segment in the tab order. */
    private apply(root: HTMLElement): void {
        const key = root.getAttribute(SelectedKeyAttribute) ?? "";
        const buttons: HTMLElement[] = [];
        let current: HTMLElement | null = null;

        for (const item of this.ownItems(root)) {
            const selected = key.length > 0 && item.getAttribute(ComponentKeyAttribute) === key;
            const button = buttonOf(item);

            item.toggleAttribute(SelectedAttribute, selected);

            if (button === null)
                continue;

            button.setAttribute("aria-pressed", selected ? "true" : "false");
            buttons.push(button);

            if (selected)
                current = button;
        }

        applyRovingTabIndex(buttons, current ?? buttons.find(isRovingCandidate) ?? null);
    }

    private handleClick(domEvent: Event): void {
        if (!(domEvent.target instanceof Element))
            return;

        const item = domEvent.target.closest<HTMLElement>(`.${ItemClass}`);
        const root = item?.closest<HTMLElement>(`.${RootClass}`) ?? null;

        if (item === null || root === null || item.closest(`.${RootClass}`) !== root || root.matches(".ui-disabled"))
            return;

        // A disabled segment is inert to the pointer already; the guard is for a press that arrives another way.
        if (buttonOf(item)?.matches(".ui-disabled, :disabled") === true)
            return;

        this.choose(root, item);
    }

    /** The arrows choose as they move, as a radio group's do: the segment under the caret is the current one. */
    private handleKeyDown(domEvent: Event): void {
        if (!(domEvent instanceof KeyboardEvent) || domEvent.defaultPrevented || !(domEvent.target instanceof Element))
            return;

        const button = domEvent.target.closest<HTMLElement>(`.${ItemClass} > .${ButtonClass}`);
        const root = button?.closest<HTMLElement>(`.${RootClass}`) ?? null;

        if (button === null || root === null)
            return;

        const buttons = this.ownItems(root).map(buttonOf).filter((candidate): candidate is HTMLElement => candidate !== null);
        const target = resolveRovingTarget({ key: domEvent.key, items: buttons, current: button, axis: "horizontal" });

        if (target === null)
            return;

        domEvent.preventDefault();
        target.focus({ preventScroll: true });

        const item = target.closest<HTMLElement>(`.${ItemClass}`);

        if (item !== null)
            this.choose(root, item);
    }

    private choose(root: HTMLElement, item: HTMLElement): void {
        const key = item.getAttribute(ComponentKeyAttribute) ?? "";

        writeSelectedKey(root, key, { attribute: SelectedKeyAttribute, bindingAttribute: BindSelectedKeyAttribute, apply: target => this.apply(target) });
    }

    private ownItems(root: HTMLElement): HTMLElement[] {
        return ownDescendants(root, `.${ItemClass}`, `.${RootClass}`);
    }
}

function buttonOf(item: HTMLElement): HTMLElement | null {
    return item.querySelector<HTMLElement>(`:scope > .${ButtonClass}`);
}
