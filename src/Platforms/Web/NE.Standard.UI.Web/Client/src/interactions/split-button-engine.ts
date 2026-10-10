// A split button's menu: opened from its end part (or its whole, as a menu button), placed under it, closed by the chosen entry.

import { MenuItemClass, MenuRootClass as ListClass, SplitModeAttribute, SplitPlacementAttribute } from "../addressing/dom-attributes.ts";
import { isAnchoredPopupPlacement } from "./anchored-popup.ts";
import { isPlainKey } from "./keyboard-shortcut.ts";
import { choosesMenuEntry, menuWalk } from "./menu-group-engine.ts";
import { OwnedPopups } from "./owned-popup.ts";
import { focusOpenedList } from "./popup-focus.ts";

const RootClass = "ui-split-button";
const MainClass = "ui-split-button__main";
const ToggleClass = "ui-split-button__toggle";
const MenuClass = "ui-split-button__menu";
const OpenClass = "ui-split-button--open";

export type SplitButtonEngineOptions = {
    readonly root?: ParentNode;
};

export class SplitButtonEngine {
    private readonly root: ParentNode;

    // The whole button counts as inside: a press on its opener is this engine's to toggle, not the dismissal's to close.
    private readonly menus = new OwnedPopups({
        show: ({ owner }) => owner.classList.add(OpenClass),
        hide: ({ owner }) => owner.classList.remove(OpenClass),
        closesWhenReadOnly: false,
        closesOnTab: true,
        sheetOnPhone: true
    });

    public constructor(options: SplitButtonEngineOptions = {}) {
        this.root = options.root ?? document;

        this.root.addEventListener("click", domEvent => this.handleClick(domEvent), true);
        this.root.addEventListener("keydown", domEvent => this.handleKeyDown(domEvent), true);

        // On the click, not the press: the entry under the pointer has to activate first.
        document.addEventListener("click", domEvent => this.handleChoice(domEvent), false);
    }

    private handleClick(domEvent: Event): void {
        const opener = resolveOpener(domEvent.target);

        if (opener !== null) {
            domEvent.preventDefault();

            if (this.menus.isOpen(opener))
                this.menus.close(opener);
            else
                this.openMenu(opener);

            return;
        }

        const open = this.menus.current;

        // The main part pressed while the list is open runs its command and takes the list away with it.
        if (open !== null && domEvent.target instanceof Element && domEvent.target.closest(`.${MainClass}`)?.closest(`.${RootClass}`) === open)
            this.menus.close(open);
    }

    /** The arrows open the menu from either opener the way they open a select: ArrowDown on its first entry, ArrowUp on its last. */
    private handleKeyDown(domEvent: Event): void {
        if (!(domEvent instanceof KeyboardEvent) || domEvent.defaultPrevented || (domEvent.key !== "ArrowDown" && domEvent.key !== "ArrowUp") || !isPlainKey(domEvent))
            return;

        const opener = resolveOpener(domEvent.target);

        if (opener === null || this.menus.isOpen(opener))
            return;

        domEvent.preventDefault();
        this.openMenu(opener, domEvent.key === "ArrowUp");
    }

    /** An entry chosen closes the menu; a caption or a rule is not a choice, a group's entry opens its block, a check turns in place. */
    private handleChoice(domEvent: Event): void {
        const open = this.menus.current;

        if (open === null || !(domEvent.target instanceof Element))
            return;

        const menu = menuOf(open);
        const entry = domEvent.target.closest<HTMLElement>(`.${MenuItemClass}`);

        if (menu !== null && entry !== null && menu.contains(entry) && choosesMenuEntry(entry))
            this.menus.close(open);
    }

    /** Opens the list afresh — from its first entry (its last for `fromEnd`) for a key, from none for a press — not where it was left. */
    private openMenu(button: HTMLElement, fromEnd = false): void {
        const menu = menuOf(button);
        const list = menu?.querySelector<HTMLElement>(`.${ListClass}`) ?? null;

        if (menu === null || list === null)
            return;

        // Against the whole pill — under it, its end at the button's end, unless the author placed it otherwise (`MenuPlacement`): the
        // list belongs to the button, not to the part that opened it.
        const token = button.getAttribute(SplitPlacementAttribute) ?? "";
        const opened = this.menus.open({
            owner: button,
            popup: menu,
            anchor: button,
            placement: { placement: isAnchoredPopupPlacement(token) ? token : "bottom-end" },
            openers: openersOf(button)
        });

        // Once shown: a hidden entry is no candidate for the keyboard.
        if (opened)
            focusOpenedList(list, menuWalk(list), fromEnd);
    }
}

/** The split button whose opener the target is in: the end part always, the main part only for a menu button. */
function resolveOpener(target: EventTarget | null): HTMLElement | null {
    if (!(target instanceof Element))
        return null;

    const part = target.closest<HTMLElement>(`.${ToggleClass}, .${MainClass}`);
    const button = part?.closest<HTMLElement>(`.${RootClass}`) ?? null;

    if (part === null || button === null)
        return null;

    if (part.classList.contains(MainClass) && button.getAttribute(SplitModeAttribute) !== "menu")
        return null;

    return button;
}

function menuOf(button: HTMLElement): HTMLElement | null {
    return button.querySelector<HTMLElement>(`:scope > .${MenuClass}`);
}

function openersOf(button: HTMLElement): HTMLElement[] {
    return [...button.querySelectorAll<HTMLElement>(`:scope > [aria-haspopup]`)];
}
