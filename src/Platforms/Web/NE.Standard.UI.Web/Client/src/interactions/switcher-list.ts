// The list a switcher opens — the theme's, the language's: a button's menu below its end, a field's listbox below its box and at
// least as wide, as a select's; opened on the current choice, by a press or the arrows from its trigger, walked by the arrows and the
// pointer (popup-list.ts). What a choice does, and when a press opens the list rather than acting itself, is each switcher's own.

// `.ts` on the value imports: `node --test` loads this module as it is.
import { SwitcherFieldValue } from "../addressing/dom-attributes.ts";
import { isPlainKey } from "./keyboard-shortcut.ts";
import { OwnedPopups } from "./owned-popup.ts";
import { followPointer, handleChoiceListKey, openChoiceList } from "./popup-list.ts";

export type SwitcherListParts = {
    /** The attribute a switcher's root carries, `field` on the field shape. */
    readonly attribute: string;
    readonly menuClass: string;
    readonly choiceClass: string;
    /** On the switcher while its list is open. */
    readonly openClass: string;
    /** What opens the list: the button, or the field's box. */
    readonly triggerSelector: string;
};

export class SwitcherList {
    private readonly parts: SwitcherListParts;
    private readonly selector: string;

    // The whole switcher counts as inside: a press on its button or box is the engine's to toggle, not the dismissal's to close.
    private readonly menus: OwnedPopups;

    public constructor(parts: SwitcherListParts) {
        this.parts = parts;
        this.selector = `[${parts.attribute}]`;
        this.menus = new OwnedPopups({
            show: ({ owner }) => owner.classList.add(parts.openClass),
            hide: ({ owner }) => owner.classList.remove(parts.openClass),
            closesWhenReadOnly: false,
            closesOnTab: true,
            sheetOnPhone: true
        });
    }

    public switcherOf(element: Element): HTMLElement | null {
        return element.closest<HTMLElement>(this.selector);
    }

    public isField(switcher: Element): boolean {
        return switcher.getAttribute(this.parts.attribute) === SwitcherFieldValue;
    }

    public choicesOf(switcher: HTMLElement): HTMLElement[] {
        return [...switcher.querySelectorAll<HTMLElement>(`:scope > .${this.parts.menuClass} > .${this.parts.choiceClass}`)];
    }

    /** How a choice says it is the current one: a menu's radio entry is checked, a listbox's option selected. */
    public chosenAttribute(switcher: Element): "aria-checked" | "aria-selected" {
        return this.isField(switcher) ? "aria-selected" : "aria-checked";
    }

    public isOpen(switcher: HTMLElement): boolean {
        return this.menus.isOpen(switcher);
    }

    public close(switcher: HTMLElement): void {
        this.menus.close(switcher);
    }

    public toggle(switcher: HTMLElement, trigger: HTMLElement): void {
        if (this.menus.isOpen(switcher))
            this.menus.close(switcher);
        else
            this.open(switcher, trigger);
    }

    /** Opens the list on the current choice, as a select's opens on its value; with none current, as any menu opens. */
    public open(switcher: HTMLElement, trigger: HTMLElement, fromEnd = false): void {
        const menu = switcher.querySelector<HTMLElement>(`:scope > .${this.parts.menuClass}`);

        if (menu === null)
            return;

        const choices = this.choicesOf(switcher);
        const chosen = choices.find(choice => choice.getAttribute(this.chosenAttribute(switcher)) === "true") ?? null;
        const opening = this.isField(switcher)
            ? { anchor: trigger, placement: { placement: "bottom-start", minAnchorWidth: true } as const }
            : { anchor: switcher, placement: { placement: "bottom-end" } as const };

        openChoiceList(this.menus, { owner: switcher, popup: menu, ...opening, openers: [trigger] }, choices, chosen, fromEnd);
    }

    /** The arrows open the list from its trigger, as a select's or a menu button's do, and move among the choices once it is open. */
    public handleKeyDown(event: KeyboardEvent, opensList: (switcher: HTMLElement, choices: readonly HTMLElement[]) => boolean): void {
        if (event.defaultPrevented || !(event.target instanceof Element))
            return;

        const switcher = this.switcherOf(event.target);

        if (switcher === null)
            return;

        const choices = this.choicesOf(switcher);
        const trigger = event.target.closest<HTMLElement>(this.parts.triggerSelector);

        if (trigger !== null && opensList(switcher, choices) && !this.menus.isOpen(switcher) && (event.key === "ArrowDown" || event.key === "ArrowUp") && isPlainKey(event)) {
            event.preventDefault();
            this.open(switcher, trigger, event.key === "ArrowUp");
            return;
        }

        if (this.menus.isOpen(switcher))
            handleChoiceListKey(event, choices);
    }

    /** The pointer moves the open list's current choice, as in a native list, so the arrows go on from it. */
    public handlePointerMove(event: PointerEvent): void {
        if (!(event.target instanceof Element))
            return;

        const choice = event.target.closest<HTMLElement>(`.${this.parts.choiceClass}`);
        const switcher = choice === null ? null : this.switcherOf(choice);

        if (choice !== null && switcher !== null && this.menus.isOpen(switcher))
            followPointer(choice, this.choicesOf(switcher));
    }
}
