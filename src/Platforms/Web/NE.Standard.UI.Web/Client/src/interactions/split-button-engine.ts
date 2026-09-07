// A split button's menu: opened from its end part (or its whole, as a menu button), placed under the button, dismissed
// like every popup, and closed by the entry that was chosen.

import { SplitModeAttribute } from "../addressing/dom-attributes";
import { placeAnchoredPopup, releaseAnchoredPopup } from "./anchored-popup";
import { PopupDismissal } from "./popup-dismissal";
import { moveFocusInto, restoreFocusTo } from "./popup-focus";

const RootClass = "ui-split-button";
const MainClass = "ui-split-button__main";
const ToggleClass = "ui-split-button__toggle";
const MenuClass = "ui-split-button__menu";
const OpenClass = "ui-split-button--open";
const MenuItemClass = "ui-menu-item";
const KindAttribute = "data-ui-menu-item-kind";
const MenuGap = 4;

export type SplitButtonEngineOptions = {
    readonly root?: ParentNode;
};

export class SplitButtonEngine {
    private readonly root: ParentNode;
    private open: HTMLElement | null = null;
    private returnFocus: HTMLElement | null = null;

    public constructor(options: SplitButtonEngineOptions = {}) {
        this.root = options.root ?? document;

        this.root.addEventListener("click", domEvent => this.handleClick(domEvent), true);
        this.root.addEventListener("keydown", domEvent => this.handleKeyDown(domEvent), true);

        // On the click, not the press: the entry under the pointer has to activate first.
        document.addEventListener("click", domEvent => this.handleChoice(domEvent), false);

        // The whole button counts as inside: a press on its opener is this engine's to toggle, not the dismissal's to close.
        new PopupDismissal({
            root: this.root,
            openPopups: () => this.open === null ? [] : [this.open],
            close: () => this.close()
        });
    }

    private handleClick(domEvent: Event): void {
        const opener = resolveOpener(domEvent.target);

        if (opener !== null) {
            domEvent.preventDefault();

            if (this.open === opener)
                this.close();
            else
                this.openMenu(opener);

            return;
        }

        // The main part pressed while the list is open runs its command and takes the list away with it.
        if (this.open !== null && domEvent.target instanceof Element && domEvent.target.closest(`.${MainClass}`)?.closest(`.${RootClass}`) === this.open)
            this.close();
    }

    /** The arrows open the menu from either opener the way they open a select, landing on the first entry. */
    private handleKeyDown(domEvent: Event): void {
        if (!(domEvent instanceof KeyboardEvent) || domEvent.defaultPrevented || (domEvent.key !== "ArrowDown" && domEvent.key !== "ArrowUp"))
            return;

        const opener = resolveOpener(domEvent.target);

        if (opener === null || this.open === opener)
            return;

        domEvent.preventDefault();
        this.openMenu(opener);
    }

    /** An entry chosen closes the menu; a caption or a rule is not a choice, a group's entry opens its block, a check turns in place. */
    private handleChoice(domEvent: Event): void {
        if (this.open === null || !(domEvent.target instanceof Element))
            return;

        const menu = menuOf(this.open);
        const entry = domEvent.target.closest<HTMLElement>(`.${MenuItemClass}`);

        if (menu === null || entry === null || !menu.contains(entry))
            return;

        if (entry.matches(`[${KindAttribute}="header"], [${KindAttribute}="separator"], [${KindAttribute}="check"]`) || entry.parentElement?.hasAttribute("data-ui-menu-group") === true)
            return;

        this.close();
    }

    private openMenu(button: HTMLElement): void {
        this.close();

        const menu = menuOf(button);

        if (menu === null)
            return;

        this.open = button;
        button.classList.add(OpenClass);

        for (const opener of openersOf(button))
            opener.setAttribute("aria-expanded", "true");

        // Under the whole pill, its end at the button's end: the list belongs to the button, not to the part that opened it.
        placeAnchoredPopup(button, menu, { placement: "bottom-end", gap: MenuGap });

        this.returnFocus = moveFocusInto(menu);
    }

    private close(): void {
        const button = this.open;

        if (button === null)
            return;

        this.open = null;
        button.classList.remove(OpenClass);

        for (const opener of openersOf(button))
            opener.setAttribute("aria-expanded", "false");

        const menu = menuOf(button);

        if (menu !== null) {
            releaseAnchoredPopup(menu);
            restoreFocusTo(this.returnFocus, menu);
        }

        this.returnFocus = null;
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
