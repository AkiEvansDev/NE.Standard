// A strip of captions that does not fit: the ones past the room are hidden, never wrapped or scrolled, and a "…" control at the end
import { ComponentKeyAttribute } from "../addressing/dom-attributes";
// lists every tab so a hidden one is a click away. The selected caption is fitted first, so it is always on the strip.

import { placeAnchoredPopup, releaseAnchoredPopup } from "./anchored-popup";
import { PopupDismissal } from "./popup-dismissal";

export const OverflowButtonClass = "ui-tab-overflow";

const MenuClass = "ui-tab-overflow__menu";
const MenuOpenClass = "ui-tab-overflow__menu--open";
const EntryClass = "ui-tab-overflow__entry";
const EntryCurrentClass = "ui-tab-overflow__entry--current";

export type StripFit = {
    /** The captions in strip order; a caption not laid out at all is not among them. */
    readonly captions: readonly HTMLElement[];
    readonly selected: HTMLElement | null;
    /** The room the captions have, with nothing else in it. */
    readonly width: number;
    /** What the "…" control takes once it shows. */
    readonly buttonWidth: number;
    readonly hiddenClass: string;
};

/** Hides the captions past the room, keeping the selected one whatever its place; answers whether any is hidden. */
export function fitStrip(fit: StripFit): boolean {
    for (const caption of fit.captions)
        caption.classList.remove(fit.hiddenClass);

    // Measured with every caption shown, in one read, so the pass forces one layout.
    const widths = fit.captions.map(caption => caption.getBoundingClientRect().width);
    let total = 0;

    for (const width of widths)
        total += width;

    if (total <= fit.width)
        return false;

    const available = fit.width - fit.buttonWidth;
    let used = fit.selected === null ? 0 : widths[fit.captions.indexOf(fit.selected)] ?? 0;

    for (let i = 0; i < fit.captions.length; i++) {
        const caption = fit.captions[i];

        if (caption === fit.selected)
            continue;

        if (used + widths[i] <= available)
            used += widths[i];
        else
            caption.classList.add(fit.hiddenClass);
    }

    return true;
}

export type StripOverflowEntry = {
    readonly key: string;
    readonly title: string;
    readonly current: boolean;
};

/** The list behind the "…" control: every tab, the current one marked; one list per engine, anchored to whichever control opened it. */
export class StripOverflowMenu {
    private readonly menu: HTMLElement;
    private button: HTMLElement | null = null;
    private strip: HTMLElement | null = null;

    public constructor(root: ParentNode, private readonly pick: (strip: HTMLElement, key: string) => void) {
        this.menu = document.createElement("div");
        this.menu.className = MenuClass;
        this.menu.setAttribute("role", "menu");
        this.menu.addEventListener("click", domEvent => this.handleClick(domEvent));

        new PopupDismissal({
            root,
            openPopups: () => this.button === null ? [] : [this.menu],
            close: () => this.close(),
            // The control that opened it counts as inside: its own click is the toggle, handled by the engine.
            isInside: (_, path) => path.includes(this.menu) || (this.button !== null && path.includes(this.button)),
            onWindowBlur: true
        });
    }

    /** Whether the list is open for this strip; one list serves every strip an engine drives. */
    public isOpenFor(strip: HTMLElement): boolean {
        return this.strip === strip;
    }

    public open(button: HTMLElement, strip: HTMLElement, entries: readonly StripOverflowEntry[]): void {
        this.close();

        this.menu.replaceChildren(...entries.map(createEntry));

        if (this.menu.parentElement === null)
            document.body.appendChild(this.menu);

        this.button = button;
        this.strip = strip;
        this.menu.classList.add(MenuOpenClass);
        button.setAttribute("aria-expanded", "true");

        placeAnchoredPopup(button, this.menu, { placement: "bottom-end", gap: 4 });

        (this.menu.querySelector<HTMLElement>(`.${EntryCurrentClass}`) ?? this.menu.querySelector<HTMLElement>(`.${EntryClass}`))?.focus({ preventScroll: true });
    }

    public close(): void {
        if (this.button === null)
            return;

        releaseAnchoredPopup(this.menu);
        this.menu.classList.remove(MenuOpenClass);
        this.button.setAttribute("aria-expanded", "false");
        this.button = null;
        this.strip = null;
    }

    private handleClick(domEvent: Event): void {
        if (!(domEvent.target instanceof Element))
            return;

        const entry = domEvent.target.closest<HTMLElement>(`.${EntryClass}`);
        const key = entry?.getAttribute(ComponentKeyAttribute) ?? null;
        const strip = this.strip;

        if (entry === null || key === null || strip === null)
            return;

        this.close();
        this.pick(strip, key);
    }
}

function createEntry(entry: StripOverflowEntry): HTMLElement {
    const button = document.createElement("button");

    button.type = "button";
    button.className = `${EntryClass} ui-button ui-button--ghost ui-button--small`;
    button.classList.toggle(EntryCurrentClass, entry.current);
    button.setAttribute("role", "menuitem");
    button.setAttribute(ComponentKeyAttribute, entry.key);
    button.textContent = entry.title;

    if (entry.current)
        button.setAttribute("aria-current", "true");

    return button;
}
