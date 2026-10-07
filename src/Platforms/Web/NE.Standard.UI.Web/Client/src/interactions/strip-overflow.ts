// A strip of captions that does not fit: the ones past the room are hidden, never wrapped or scrolled, and a "…" control lists them.
// One fitter serves the tabs component's strip and the tabs view's — the selected tab kept, every tab listed — and the command bar's
// row, whose trailing commands go and are the ones listed.

import { ComponentKeyAttribute, DisabledClass, SmallGhostButtonClasses } from "../addressing/dom-attributes.ts";
import { carryPopupGround } from "./anchored-popup.ts";
import { isInert } from "./interactive-state.ts";
import { OwnedPopups } from "./owned-popup.ts";
import { focusByPointer, focusOpenedList } from "./popup-focus.ts";
import { applyRovingTabIndex, resolveRovingTarget } from "./roving-focus.ts";

export const OverflowButtonClass = "ui-tab-overflow";

const MenuClass = "ui-tab-overflow__menu";
const MenuOpenClass = "ui-tab-overflow__menu--open";
const EntryClass = "ui-tab-overflow__entry";
const EntryCurrentClass = "ui-tab-overflow__entry--current";

/** One kind of strip as the fitter sees it: its classes, and its engine's answers to a refit and a pick from the list. */
export type StripFitterOptions = {
    /** The strip's root class; a watched room answers to the root around it. */
    readonly rootClass: string;
    /** On the root while a caption is hidden, which shows the "…" control. */
    readonly overflowingClass: string;
    /** Whether the strip wraps or stacks its captions rather than hiding them — ShowOverflow off, a wrapping or vertical bar. */
    readonly wraps: (root: HTMLElement) => boolean;
    /** On a caption past the room. */
    readonly hiddenClass: string;
    /**
     * Hides from the first caption past the room to the end, the strip's order being its priority (a command bar), and watches
     * each caption's own width, which a bound label changes; otherwise the selected caption is kept and each other one is hidden
     * by its own width (a tab strip).
     */
    readonly trailing?: boolean;
    /** Lays a strip out again: the width of its room or its ShowOverflow changed. */
    readonly refit: (root: HTMLElement) => void;
    /** A tab picked from the list, by its key. */
    readonly pick: (root: HTMLElement, key: string) => void;
};

/** Where one strip's captions stand at this layout. */
export type StripLayout = {
    /** The box whose width the captions share; in trailing mode, the one the "…" control stands at the end of. */
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
    /** A disabled tab: listed, as a disabled menu entry is, but neither reached by the arrows nor picked. */
    readonly disabled: boolean;
};

export class StripFitter {
    private readonly options: StripFitterOptions;
    private readonly list: StripOverflowMenu;

    // Width and wrap at the last fit: a room growing taller changes nothing, and the fit's own class changes are not a switch.
    private readonly fittedWidths = new WeakMap<Element, number>();
    private readonly wraps = new WeakMap<Element, boolean>();

    // A strip is fitted again whenever its room's width changes (a trailing strip's, a caption's too); observed on first sight, and
    // fitted once however many of its boxes changed together.
    private readonly resizes = typeof ResizeObserver === "function"
        ? new ResizeObserver((entries, observer) => {
            const roots = new Set<HTMLElement>();

            for (const entry of entries) {
                // A strip gone from the page is let go: observed, its whole subtree would stay alive as long as the page.
                if (!entry.target.isConnected) {
                    observer.unobserve(entry.target);
                    continue;
                }

                const root = entry.target.closest<HTMLElement>(`.${this.options.rootClass}`);

                if (root === null || this.fittedWidths.get(entry.target) === entry.contentRect.width)
                    continue;

                this.fittedWidths.set(entry.target, entry.contentRect.width);
                roots.add(root);
            }

            for (const root of roots)
                this.options.refit(root);
        })
        : null;

    // ShowOverflow switched live is a root class the engines' observers miss; only the root's class is watched, so the rest cost nothing.
    private readonly switches = typeof MutationObserver === "function"
        ? new MutationObserver(records => {
            const roots = new Set<HTMLElement>();

            for (const record of records) {
                if (record.target instanceof HTMLElement && this.wraps.get(record.target) !== this.options.wraps(record.target))
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

        const wraps = this.options.wraps(root);

        this.wraps.set(root, wraps);

        if (wraps) {
            for (const caption of layout.captions)
                caption.classList.remove(this.options.hiddenClass);

            root.classList.remove(this.options.overflowingClass);
            this.closeListOf(root);
            return;
        }

        // Whether the captions fit is measured with the "…" control hidden: a strip only as wide as its captions grows by the control,
        // so with it shown everything would fit, and taking it off would shrink the strip into the next fit, a fit that never settles.
        // Shown only once a caption has to go, so it has a width to leave room for.
        root.classList.remove(this.options.overflowingClass);

        const showButton = (): void => root.classList.add(this.options.overflowingClass);
        const overflowing = this.options.trailing === true
            ? this.fitTrailing(layout, showButton)
            : fitStrip({ ...layout, hiddenClass: this.options.hiddenClass, showButton });

        root.classList.toggle(this.options.overflowingClass, overflowing);

        if (!overflowing)
            this.closeListOf(root);
    }

    private fitTrailing(layout: StripLayout, showButton: () => void): boolean {
        for (const caption of layout.captions)
            this.resizes?.observe(caption);

        return fitTrailing(layout, this.options.hiddenClass, showButton);
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

type StripFit = StripLayout & {
    readonly hiddenClass: string;
    /** Shows the "…" control, once a caption has to go. */
    readonly showButton: () => void;
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

    if (total <= fit.room.clientWidth)
        return false;

    fit.showButton();

    const available = fit.room.clientWidth - fit.button.getBoundingClientRect().width;
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

/**
 * Hides every caption from the first that ends past the room left before the "…" control, shown only once one has to go, and answers
 * whether any is hidden. Measured from the room's inline start, so the gaps and separators between captions count.
 */
function fitTrailing(layout: StripLayout, hiddenClass: string, showButton: () => void): boolean {
    for (const caption of layout.captions)
        caption.classList.remove(hiddenClass);

    const style = getComputedStyle(layout.room);
    const rtl = style.direction === "rtl";
    const paddingLeft = Number.parseFloat(style.paddingLeft) || 0;
    const paddingRight = Number.parseFloat(style.paddingRight) || 0;
    const room = layout.room.getBoundingClientRect();
    const start = rtl ? room.right - layout.room.clientLeft - paddingRight : room.left + layout.room.clientLeft + paddingLeft;
    const width = layout.room.clientWidth - paddingLeft - paddingRight;

    // Read in one pass, with every caption shown, so the fit forces one layout.
    const ends = layout.captions.map(caption => {
        const rect = caption.getBoundingClientRect();

        return rtl ? start - rect.left : rect.right - start;
    });

    if (ends.every(end => end <= width))
        return false;

    showButton();

    // Where the "…" begins, its own margin before it: what is left of the room for the captions.
    const button = layout.button.getBoundingClientRect();
    const buttonStyle = getComputedStyle(layout.button);
    const margin = Number.parseFloat(rtl ? buttonStyle.marginRight : buttonStyle.marginLeft) || 0;
    const available = (rtl ? start - button.right : button.left - start) - margin;
    let past = false;

    for (let i = 0; i < layout.captions.length; i++) {
        past ||= ends[i] > available;

        if (past)
            layout.captions[i].classList.add(hiddenClass);
    }

    return true;
}

/** The list behind the "…" control: the tabs or the commands it holds; one per fitter, anchored to whichever control opened it. */
class StripOverflowMenu {
    private readonly menu: HTMLElement;
    private button: HTMLElement | null = null;

    // The opening control counts as inside: its own click is the engine's toggle.
    private readonly list = new OwnedPopups({
        show: ({ popup }) => popup.classList.add(MenuOpenClass),
        hide: ({ popup }) => {
            popup.classList.remove(MenuOpenClass);
            this.button = null;
        },
        closesWhenReadOnly: false,
        isInside: ({ popup }, path) => path.includes(popup) || (this.button !== null && path.includes(this.button)),
        onWindowBlur: true
    });

    private readonly pick: (strip: HTMLElement, key: string) => void;

    public constructor(pick: (strip: HTMLElement, key: string) => void) {
        this.pick = pick;
        this.menu = document.createElement("div");
        this.menu.className = MenuClass;
        this.menu.setAttribute("role", "menu");
        this.menu.addEventListener("click", domEvent => this.handleClick(domEvent));
        this.menu.addEventListener("keydown", domEvent => this.handleKeydown(domEvent));
        this.menu.addEventListener("pointermove", domEvent => this.handlePointerMove(domEvent));
    }

    /** Whether the list is open for this strip; one list serves every strip a fitter drives. */
    public isOpenFor(strip: HTMLElement): boolean {
        return this.list.isOpen(strip);
    }

    public open(button: HTMLElement, strip: HTMLElement, entries: readonly StripOverflowEntry[]): void {
        this.close();

        this.menu.replaceChildren(...entries.map(createEntry));

        if (this.menu.parentElement === null)
            document.body.appendChild(this.menu);

        // A list of tabs opens on the current one; a list with none (the commands) as every popup list does, by what opened it.
        const current = this.menu.querySelector<HTMLElement>(`.${EntryCurrentClass}`);

        // One tab stop, as in any menu: the arrows walk the list, and a Tab leaves it.
        if (current !== null)
            applyRovingTabIndex(this.entries(), current);

        this.button = button;
        carryPopupGround(button, this.menu);

        const opened = this.list.open({
            owner: strip,
            popup: this.menu,
            anchor: button,
            placement: { placement: "bottom-end" },
            openers: [button],
            focus: current ?? false,
            returnFocus: () => button
        });

        if (!opened)
            this.button = null;
        else if (current === null)
            focusOpenedList(this.menu, this.entries());
    }

    public close(): void {
        this.list.close();
    }

    private handleClick(domEvent: Event): void {
        if (!(domEvent.target instanceof Element))
            return;

        const entry = domEvent.target.closest<HTMLElement>(`.${EntryClass}`);
        const key = entry?.getAttribute(ComponentKeyAttribute) ?? null;
        const strip = this.list.current;

        if (entry === null || key === null || strip === null || isInert(entry))
            return;

        this.close();
        this.pick(strip, key);
    }

    /** The arrows, Home and End walk the list, as they walk any menu; Tab closes it and goes on from the "…" control. */
    private handleKeydown(domEvent: KeyboardEvent): void {
        if (domEvent.defaultPrevented || !(domEvent.target instanceof HTMLElement))
            return;

        // The list hangs at the body's end, where Tab would leave the page: closing returns the focus, and the browser's Tab goes on.
        if (domEvent.key === "Tab") {
            this.close();
            return;
        }

        const entries = this.entries();
        const next = resolveRovingTarget({ key: domEvent.key, items: entries, current: domEvent.target, axis: "vertical" });

        if (next === null)
            return;

        domEvent.preventDefault();

        applyRovingTabIndex(entries, next);
        next.focus();
    }

    /** The pointer takes the keyboard's place in the list, as in a native menu, so one entry is current and the arrows go on from it. */
    private handlePointerMove(domEvent: PointerEvent): void {
        const entry = domEvent.target instanceof Element ? domEvent.target.closest<HTMLElement>(`.${EntryClass}`) : null;

        if (entry === null || entry === document.activeElement || isInert(entry))
            return;

        applyRovingTabIndex(this.entries(), entry);
        focusByPointer(entry);
    }

    private entries(): HTMLElement[] {
        return Array.from(this.menu.querySelectorAll<HTMLElement>(`.${EntryClass}`));
    }
}

function createEntry(entry: StripOverflowEntry): HTMLElement {
    const button = document.createElement("button");

    button.type = "button";
    button.className = `${EntryClass} ${SmallGhostButtonClasses}`;
    button.classList.toggle(EntryCurrentClass, entry.current);
    button.setAttribute("role", "menuitem");
    button.setAttribute(ComponentKeyAttribute, entry.key);
    button.textContent = entry.title;

    if (entry.current)
        button.setAttribute("aria-current", "true");

    // The look of any disabled control; aria-disabled rather than `disabled`, so a screen reader still lists it.
    if (entry.disabled) {
        button.classList.add(DisabledClass);
        button.setAttribute("aria-disabled", "true");
    }

    return button;
}
