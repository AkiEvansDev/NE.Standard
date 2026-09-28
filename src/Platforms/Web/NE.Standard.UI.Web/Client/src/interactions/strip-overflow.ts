// A strip of captions that does not fit: the ones past the room are hidden, never wrapped or scrolled, and a "…" control at the end
// lists every tab so a hidden one is a click away. The selected caption is fitted first, so it is always on the strip. One fitter
// serves both strips — the tabs component's and the tabs view's — each engine handing it where its captions stand.

import { ComponentKeyAttribute } from "../addressing/dom-attributes";
import { placeAnchoredPopup, releaseAnchoredPopup } from "./anchored-popup";
import { PopupDismissal } from "./popup-dismissal";
import { restoreFocusTo } from "./popup-focus";
import { applyRovingTabIndex, resolveRovingTarget } from "./roving-focus";

export const OverflowButtonClass = "ui-tab-overflow";

const MenuClass = "ui-tab-overflow__menu";
const MenuOpenClass = "ui-tab-overflow__menu--open";
const EntryClass = "ui-tab-overflow__entry";
const EntryCurrentClass = "ui-tab-overflow__entry--current";

/** One kind of strip as the fitter sees it: its classes, and what its engine does when a strip must be laid out again or a tab is picked from the list. */
export type StripFitterOptions = {
    /** The strip's root class; a watched room answers to the root around it. */
    readonly rootClass: string;
    /** On the root while a caption is hidden, which shows the "…" control. */
    readonly overflowingClass: string;
    /** On the root when the strip wraps its captions rather than hiding them — ShowOverflow off. */
    readonly wrapsClass: string;
    /** On a caption past the room. */
    readonly hiddenClass: string;
    /** Lays a strip out again: the width of its room or its ShowOverflow changed. */
    readonly refit: (root: HTMLElement) => void;
    /** A tab picked from the list, by its key. */
    readonly pick: (root: HTMLElement, key: string) => void;
};

/** Where one strip's captions stand at this layout. */
export type StripLayout = {
    /** The box whose width the captions share. */
    readonly room: HTMLElement;
    readonly button: HTMLElement;
    /** The captions in strip order; a caption not laid out at all is not among them. */
    readonly captions: readonly HTMLElement[];
    readonly selected: HTMLElement | null;
};

export type StripOverflowEntry = {
    readonly key: string;
    readonly title: string;
    readonly current: boolean;
};

export class StripFitter {
    private readonly options: StripFitterOptions;
    private readonly list: StripOverflowMenu;

    // The width each room was last fitted at, and whether each strip wrapped then: a room growing taller changes nothing on the
    // strip, and the fit's own class changes on the root are not a switch.
    private readonly fittedWidths = new WeakMap<Element, number>();
    private readonly wraps = new WeakMap<Element, boolean>();

    // A strip is fitted again whenever its room's width changes; a room is observed on first sight.
    private readonly resizes = typeof ResizeObserver === "function"
        ? new ResizeObserver(entries => {
            for (const entry of entries) {
                const root = entry.target.closest<HTMLElement>(`.${this.options.rootClass}`);

                if (root === null || this.fittedWidths.get(entry.target) === entry.contentRect.width)
                    continue;

                this.fittedWidths.set(entry.target, entry.contentRect.width);
                this.options.refit(root);
            }
        })
        : null;

    // ShowOverflow switched live is a class on the root, which the engines' own observers do not watch: only the root's class is
    // watched here, so the rest of the page's class changes cost nothing.
    private readonly switches = typeof MutationObserver === "function"
        ? new MutationObserver(records => {
            const roots = new Set<HTMLElement>();

            for (const record of records) {
                if (record.target instanceof HTMLElement && this.wraps.get(record.target) !== record.target.classList.contains(this.options.wrapsClass))
                    roots.add(record.target);
            }

            for (const root of roots)
                this.options.refit(root);
        })
        : null;

    public constructor(options: StripFitterOptions) {
        this.options = options;
        this.list = new StripOverflowMenu(options.pick);
    }

    /** Hides the captions past the strip's room and shows the "…" control when any is hidden; a wrapping strip hides none. */
    public fit(root: HTMLElement, layout: StripLayout): void {
        // Watched whatever the strip does with its captions: a room that changed size has a strip of another height under it.
        this.resizes?.observe(layout.room);
        this.switches?.observe(root, { attributeFilter: ["class"] });

        const wraps = root.classList.contains(this.options.wrapsClass);

        this.wraps.set(root, wraps);

        if (wraps) {
            for (const caption of layout.captions)
                caption.classList.remove(this.options.hiddenClass);

            root.classList.remove(this.options.overflowingClass);
            this.closeListOf(root);
            return;
        }

        // Shown for the measurement, so a control that was hidden has a width; taken off again when everything fits.
        root.classList.add(this.options.overflowingClass);

        const overflowing = fitStrip({
            captions: layout.captions,
            selected: layout.selected,
            width: layout.room.clientWidth,
            buttonWidth: layout.button.getBoundingClientRect().width,
            hiddenClass: this.options.hiddenClass
        });

        root.classList.toggle(this.options.overflowingClass, overflowing);

        if (!overflowing)
            this.closeListOf(root);
    }

    private closeListOf(root: HTMLElement): void {
        if (this.list.isOpenFor(root))
            this.list.close();
    }

    /** Opens the list of every tab under the "…" control, or closes it when it is already open for this strip. */
    public toggleList(root: HTMLElement, button: HTMLElement, entries: () => readonly StripOverflowEntry[]): void {
        if (this.list.isOpenFor(root)) {
            this.list.close();
            return;
        }

        this.list.open(button, root, entries());
    }
}

type StripFit = {
    readonly captions: readonly HTMLElement[];
    readonly selected: HTMLElement | null;
    /** The room the captions have, with nothing else in it. */
    readonly width: number;
    /** What the "…" control takes once it shows. */
    readonly buttonWidth: number;
    readonly hiddenClass: string;
};

/** Hides the captions past the room, keeping the selected one whatever its place; answers whether any is hidden. */
function fitStrip(fit: StripFit): boolean {
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

/** The list behind the "…" control: every tab, the current one marked; one list per fitter, anchored to whichever control opened it. */
class StripOverflowMenu {
    private readonly menu: HTMLElement;
    private button: HTMLElement | null = null;
    private strip: HTMLElement | null = null;

    public constructor(private readonly pick: (strip: HTMLElement, key: string) => void) {
        this.menu = document.createElement("div");
        this.menu.className = MenuClass;
        this.menu.setAttribute("role", "menu");
        this.menu.addEventListener("click", domEvent => this.handleClick(domEvent));
        this.menu.addEventListener("keydown", domEvent => this.handleKeydown(domEvent));
        this.menu.addEventListener("focusout", domEvent => this.handleFocusOut(domEvent));

        new PopupDismissal({
            openPopups: () => this.button === null ? [] : [this.menu],
            close: () => this.close(),
            // The control that opened it counts as inside: its own click is the toggle, handled by the engine.
            isInside: (_, path) => path.includes(this.menu) || (this.button !== null && path.includes(this.button)),
            onWindowBlur: true
        });
    }

    /** Whether the list is open for this strip; one list serves every strip a fitter drives. */
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

        const first = this.menu.querySelector<HTMLElement>(`.${EntryCurrentClass}`) ?? this.menu.querySelector<HTMLElement>(`.${EntryClass}`);

        // One tab stop, as in any menu: the arrows walk the list, and a Tab leaves it.
        applyRovingTabIndex(this.entries(), first);
        first?.focus({ preventScroll: true });
    }

    public close(): void {
        if (this.button === null)
            return;

        // Back to the control that opened it, before the list hides and drops the focus on the body.
        restoreFocusTo(this.button, this.menu);
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

    /** The arrows, Home and End walk the list, as they walk any menu. */
    private handleKeydown(domEvent: KeyboardEvent): void {
        if (domEvent.defaultPrevented || !(domEvent.target instanceof HTMLElement))
            return;

        const entries = this.entries();
        const next = resolveRovingTarget({ key: domEvent.key, items: entries, current: domEvent.target, axis: "vertical" });

        if (next === null)
            return;

        domEvent.preventDefault();

        applyRovingTabIndex(entries, next);
        next.focus();
    }

    /**
     * The keyboard gone to anything but the list or its control closes the list, so a Tab walks on rather than leaving it open
     * behind. A focus lost to nothing — a press on the page, the window left — is the dismissal's, which waits for the click.
     */
    private handleFocusOut(domEvent: FocusEvent): void {
        const next = domEvent.relatedTarget;

        if (!(next instanceof Node) || this.menu.contains(next) || this.button?.contains(next) === true)
            return;

        this.close();
    }

    private entries(): HTMLElement[] {
        return Array.from(this.menu.querySelectorAll<HTMLElement>(`.${EntryClass}`));
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
