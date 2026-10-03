// A pager aimed at a paged host (`PagerComponent`): it draws where the host's window stands — the pages by number, the rows the page
// holds, the page size — and asks for another page by offset through the window engine, the host's own window request. Page Up and
// Page Down in a paged host turn its page too, the keyboard's row keeping its place on the page.

// `.ts` on the value imports, and types imported as types: `node --test` loads this module as it is.
import {
    ComponentSelector, cssAttributeValue, HostModeAttribute, ItemsHostAttribute, PagerPageAttribute, PagerSizeAttribute, PagerTargetAttribute, WindowMoreAfterAttribute,
    WindowOffsetAttribute, WindowPagedAttribute, WindowSizeAttribute, WindowTotalAttribute
} from "../addressing/dom-attributes.ts";
import type { DomRegistry } from "../addressing/dom-registry.ts";
import { readComponentId } from "../addressing/dom-registry.ts";
import { readHostScroll, scrollHostTo } from "../items/items-viewport.ts";
import type { PageMark, PageState } from "../items/item-pages.ts";
import { currentPage, openPageNumbers, pageCount, pageNumbers, pageOffset, readPageState } from "../items/item-pages.ts";
import type { ItemWindows } from "../items/items-window-engine.ts";
import { formatNumber, readNumberCulture } from "../rendering/number-format.ts";
import type { NumberCulturePack } from "../rendering/number-format.ts";
import { clientStrings } from "../runtime/client-strings.ts";
import { ClientStore } from "../state/client-store.ts";
import type { ClientStringKey } from "../runtime/client-strings.ts";
import { observeComponents } from "./dom-mutations.ts";
import { componentStates, isInert } from "./interactive-state.ts";
import { ownControlOf } from "./own-control.ts";
import { ownDescendants } from "./own-descendants.ts";
import { OwnedPopups } from "./owned-popup.ts";
import { focusByPointer, focusOpenedList } from "./popup-focus.ts";
import { applyRovingTabIndex, isRovingCandidate, isRovingKey, resolveRovingTarget } from "./roving-focus.ts";
import { litRow, rowKeyTarget, setRowFocus } from "./row-cursor.ts";
import { KeyboardRowsRootSelector, SelectionRootSelector, SelectionRowSelector } from "./row-selection.ts";

export type PagerEngineOptions = {
    readonly root?: ParentNode;
    readonly dom: Pick<DomRegistry, "findEveryComponent">;
    readonly windows: ItemWindows;
    /** Where Page Up and Page Down are heard, ahead of the row cursor's own Page keys on the root: the window by default. */
    readonly pageKeys?: EventTarget;
};

const PagerClass = "ui-pager";
const PagerSelector = `.${PagerClass}`;
const ButtonClass = "ui-pager__button";
const NumberClass = "ui-pager__number";
const PagesClass = "ui-pager__pages";
const GapClass = "ui-pager__gap";
const RangeClass = "ui-pager__range";
const SizeClass = "ui-pager__size";
const SizeOpenClass = "ui-pager__size--open";
const SizeTriggerClass = "ui-pager__size-trigger";
const SizeLabelClass = "ui-pager__size-label";
const SizeMenuClass = "ui-pager__sizes";
const SizeChoiceClass = "ui-pager__size-choice";
// The framework's small ghost button, the look the renderer gives the four ends.
const NumberClasses = [ButtonClass, NumberClass, "ui-button", "ui-button--ghost", "ui-button--small"];

const PageKey: ClientStringKey = "ui.pager.page";
const RangeKey: ClientStringKey = "ui.pager.range";
const RowsKey: ClientStringKey = "ui.pager.rows";
const SizeKey: ClientStringKey = "ui.pager.size";

// What says where a host's window stands; a change to any of them is a page the pagers aimed at it draw again.
const WindowAttributes = [WindowOffsetAttribute, WindowTotalAttribute, WindowMoreAfterAttribute, WindowSizeAttribute, WindowPagedAttribute];

// Where a viewer's page size is kept: under the target's own name, as a table keeps its columns' widths.
const PageSizeSlot = "page-size";

export class PagerEngine {
    private readonly options: PagerEngineOptions;
    private readonly root: ParentNode;
    // What each pager last drew, so a sync that would change nothing writes nothing: the observer would hear its own writes otherwise.
    private drawn = new WeakMap<HTMLElement, string>();
    private readonly store = new ClientStore();
    // The pagers whose kept size was read: once each, on its first sync, before the window engine asks for a first window.
    private readonly restored = new WeakSet<HTMLElement>();

    // The whole size choice counts as inside: a press on its button is this engine's to toggle, not the dismissal's to close.
    private readonly menus = new OwnedPopups({
        show: ({ owner }) => owner.classList.add(SizeOpenClass),
        hide: ({ owner }) => owner.classList.remove(SizeOpenClass),
        closesWhenReadOnly: false
    });

    public constructor(options: PagerEngineOptions) {
        this.options = options;
        this.root = options.root ?? document;

        this.syncAll();

        this.root.addEventListener("click", domEvent => this.handleClick(domEvent));
        this.root.addEventListener("keydown", domEvent => this.handleKeyDown(domEvent as KeyboardEvent));
        this.root.addEventListener("pointermove", domEvent => this.handlePointerMove(domEvent));
        // Capturing, above the root: the row cursor's Page keys listen there, and a paged host's are this engine's while a page lies that way.
        (options.pageKeys ?? window).addEventListener("keydown", domEvent => this.handlePageKey(domEvent), true);

        // A host's window moved, its rows came, or a pager came onto the page; the pager's own drawing passes unheard.
        observeComponents(this.root, `${PagerSelector}, [${ItemsHostAttribute}]`, {
            childList: true,
            attributeFilter: WindowAttributes,
            relevant: mutation => mutation.type === "attributes" || isItemsHost(mutation.target) || addsPager(mutation)
        }, found => this.syncFound(found));

        // A language switch wrote the pager's number pack again: the figures are drawn in it, not only the words.
        clientStrings.onChange(() => {
            this.drawn = new WeakMap();
            this.syncAll();
        });
    }

    /** Draws every pager on the page again from its host. */
    public syncAll(): void {
        for (const pager of this.root.querySelectorAll<HTMLElement>(PagerSelector))
            this.sync(pager);
    }

    private syncFound(found: Iterable<HTMLElement>): void {
        for (const element of found) {
            if (element.matches(PagerSelector)) {
                this.sync(element);
                continue;
            }

            for (const pager of this.pagersOf(element))
                this.sync(pager);
        }
    }

    /** The pagers aimed at the component a host stands in. */
    private pagersOf(host: Element): HTMLElement[] {
        const owner = host.closest(ComponentSelector);
        const componentId = owner === null ? 0 : readComponentId(owner);

        return componentId > 0 ? [...this.root.querySelectorAll<HTMLElement>(`${PagerSelector}[${PagerTargetAttribute}="${cssAttributeValue(componentId)}"]`)] : [];
    }

    /** The host a pager is aimed at: the items host of the target's root, the first copy of it on the page that has one. */
    private hostOf(pager: Element): HTMLElement | null {
        return this.targetOf(pager)?.host ?? null;
    }

    private targetOf(pager: Element): { readonly component: Element; readonly host: HTMLElement } | null {
        const componentId = Number(pager.getAttribute(PagerTargetAttribute));

        if (!Number.isInteger(componentId) || componentId <= 0)
            return null;

        for (const component of this.options.dom.findEveryComponent(componentId)) {
            const host = windowedHostOf(component);

            if (host !== null)
                return { component, host };
        }

        return null;
    }

    /** One pager from its host: hidden where the host's window is no page, else the numbers, the line, the size and the ends. */
    private sync(pager: HTMLElement): void {
        const target = this.targetOf(pager);
        const host = target?.host ?? null;
        const paged = host !== null && host.hasAttribute(WindowPagedAttribute);

        if (pager.hasAttribute("hidden") === paged)
            pager.toggleAttribute("hidden", !paged);

        if (target === null || host === null || !paged)
            return;

        if (!this.restored.has(pager)) {
            this.restored.add(pager);
            this.restoreSize(pager, target.component, host);
        }

        const state = readPageState(host);
        const signature = `${state.offset}|${state.count}|${state.size}|${state.total}|${state.moreAfter}`;

        if (this.drawn.get(pager) === signature)
            return;

        this.drawn.set(pager, signature);

        const culture = readNumberCulture(pager);
        const figure = (value: number): string => formatNumber(value, "N0", culture);

        this.drawNumbers(pager, state, culture);
        drawRange(pager, state, figure);
        drawSize(pager, state, figure);

        for (const button of pager.querySelectorAll<HTMLElement>(`:scope > .${ButtonClass}[${PagerPageAttribute}]`))
            componentStates.setDisabled(button, pageOffset(state, button.getAttribute(PagerPageAttribute) ?? "") === null);

        applyStop(pager);
    }

    /** The numbered pages, the current one marked; the keyboard on a number the redraw took away goes to the current page. */
    private drawNumbers(pager: HTMLElement, state: PageState, culture: NumberCulturePack): void {
        const pages = pager.querySelector<HTMLElement>(`:scope > .${PagesClass}`);

        if (pages === null)
            return;

        const current = currentPage(state);
        const count = pageCount(state);
        const marks = count === null ? openPageNumbers(current, state.moreAfter) : pageNumbers(current, count);
        const hadFocus = pages.contains(document.activeElement);

        pages.replaceChildren(...marks.map(mark => drawMark(mark, current, culture)));

        if (hadFocus && !pager.contains(document.activeElement))
            pages.querySelector<HTMLElement>("[aria-current='page']")?.focus({ preventScroll: true });
    }

    private handleClick(domEvent: Event): void {
        if (!(domEvent.target instanceof Element))
            return;

        const pager = domEvent.target.closest<HTMLElement>(PagerSelector);

        if (pager === null || isInert(domEvent.target))
            return;

        const choice = domEvent.target.closest<HTMLElement>(`.${SizeChoiceClass}`);

        if (choice !== null) {
            domEvent.preventDefault();
            this.chooseSize(pager, Number(choice.getAttribute(PagerSizeAttribute)));
            return;
        }

        const trigger = domEvent.target.closest<HTMLElement>(`.${SizeTriggerClass}`);

        if (trigger !== null) {
            domEvent.preventDefault();
            this.toggleSizes(trigger);
            return;
        }

        const button = domEvent.target.closest<HTMLElement>(`[${PagerPageAttribute}]`);
        const host = button === null ? null : this.hostOf(pager);

        if (button === null || host === null)
            return;

        const offset = pageOffset(readPageState(host), button.getAttribute(PagerPageAttribute) ?? "");

        if (offset === null)
            return;

        domEvent.preventDefault();
        void this.turnAsync(host, offset);
    }

    /** Asks for the page and shows it from its first row: a list that scrolls opens the new page at its top, as a book's page does. */
    private async turnAsync(host: HTMLElement, offset: number): Promise<void> {
        await this.options.windows.requestOffsetAsync(host, offset);

        if (readHostScroll(host).top > 0)
            scrollHostTo(host, 0);
    }

    /** The arrows walk the pager's buttons, one stop of the Tab order, and walk the sizes while their list is open. */
    private handleKeyDown(domEvent: KeyboardEvent): void {
        if (domEvent.defaultPrevented || !(domEvent.target instanceof Element))
            return;

        const pager = domEvent.target.closest<HTMLElement>(PagerSelector);

        if (pager === null)
            return;

        const size = domEvent.target.closest<HTMLElement>(`.${SizeClass}`);

        if (size !== null && this.handleSizeKey(domEvent, size))
            return;

        const current = domEvent.target.closest<HTMLElement>(`.${ButtonClass}, .${SizeTriggerClass}`);
        const stops = stopsOf(pager);

        if (current === null || !stops.includes(current))
            return;

        const next = resolveRovingTarget({ key: domEvent.key, items: stops, current, axis: "horizontal", loop: false });

        if (next === null)
            return;

        domEvent.preventDefault();
        applyRovingTabIndex(stops, next);
        next.focus();
    }

    /** Down or Up opens the sizes from their button, as a menu button's do; once open, the arrows move among them. */
    private handleSizeKey(domEvent: KeyboardEvent, size: HTMLElement): boolean {
        const trigger = domEvent.target instanceof Element ? domEvent.target.closest<HTMLElement>(`.${SizeTriggerClass}`) : null;

        if (trigger !== null && !this.menus.isOpen(size) && (domEvent.key === "ArrowDown" || domEvent.key === "ArrowUp")) {
            domEvent.preventDefault();
            this.openSizes(size, trigger, domEvent.key === "ArrowUp");
            return true;
        }

        if (!this.menus.isOpen(size) || !isRovingKey(domEvent.key, "vertical"))
            return false;

        const choices = choicesOf(size);
        const current = domEvent.target instanceof HTMLElement && choices.includes(domEvent.target) ? domEvent.target : null;
        const next = resolveRovingTarget({ key: domEvent.key, items: choices, current, axis: "vertical" });

        if (next !== null) {
            domEvent.preventDefault();
            next.focus();
        }

        return true;
    }

    /** The pointer moves the open list's current size, as in a native menu, so the arrows go on from it. */
    private handlePointerMove(domEvent: Event): void {
        const choice = domEvent.target instanceof Element ? domEvent.target.closest<HTMLElement>(`.${SizeChoiceClass}`) : null;

        if (choice === null || choice === document.activeElement || isInert(choice))
            return;

        const size = choice.closest<HTMLElement>(`.${SizeClass}`);

        if (size !== null && this.menus.isOpen(size))
            focusByPointer(choice);
    }

    private toggleSizes(trigger: HTMLElement): void {
        const size = trigger.closest<HTMLElement>(`.${SizeClass}`);

        if (size === null)
            return;

        if (this.menus.isOpen(size))
            this.menus.close(size);
        else
            this.openSizes(size, trigger, false);
    }

    /** Opens the sizes on the page's own, as a select's list opens on its value. */
    private openSizes(size: HTMLElement, trigger: HTMLElement, fromEnd: boolean): void {
        const menu = size.querySelector<HTMLElement>(`:scope > .${SizeMenuClass}`);

        if (menu === null)
            return;

        const choices = choicesOf(size);
        const checked = choices.find(choice => choice.getAttribute("aria-checked") === "true");

        const opened = this.menus.open({
            owner: size,
            popup: menu,
            anchor: trigger,
            placement: { placement: "bottom-end" },
            openers: [trigger],
            focus: checked ?? false
        });

        if (opened && checked === undefined)
            focusOpenedList(menu, choices, fromEnd);
    }

    /**
     * The size the viewer chose on an earlier visit, while the pager still offers it: written on the host before the window engine asks
     * for a first window, so an empty host's first read takes it; a window the server already read at the host's own size is read once
     * more. A size no longer offered is dropped; no storage, nothing kept, and the host's own size stands.
     */
    private restoreSize(pager: HTMLElement, component: Element, host: HTMLElement): void {
        const kept = this.store.read(component, PageSizeSlot);
        const rows = kept === null ? 0 : Number(kept);

        if (!Number.isInteger(rows) || rows <= 0)
            return;

        if (!offers(pager, rows)) {
            this.store.write(component, PageSizeSlot, null);
            return;
        }

        const state = readPageState(host);

        if (rows === state.size)
            return;

        host.setAttribute(WindowSizeAttribute, String(rows));

        if (state.count > 0)
            void this.turnAsync(host, Math.floor(state.offset / rows) * rows);
    }

    /**
     * A page of another size, starting at the page that holds the first row on show, kept in the browser under the target's name. The
     * host is asked by it from here on: a window request carries the host's size.
     */
    private chooseSize(pager: HTMLElement, rows: number): void {
        const size = pager.querySelector<HTMLElement>(`.${SizeClass}`);

        if (size !== null)
            this.menus.close(size);

        const target = this.targetOf(pager);

        if (target === null || !Number.isInteger(rows) || rows <= 0)
            return;

        const state = readPageState(target.host);

        if (rows === state.size)
            return;

        this.store.write(target.component, PageSizeSlot, String(rows));
        target.host.setAttribute(WindowSizeAttribute, String(rows));
        void this.turnAsync(target.host, Math.floor(state.offset / rows) * rows);
    }

    /** Page Down and Page Up in a paged host: the next or the previous page, where there is one; at an end the row cursor moves instead. */
    private handlePageKey(domEvent: Event): void {
        if (!(domEvent instanceof KeyboardEvent) || domEvent.defaultPrevented || (domEvent.key !== "PageDown" && domEvent.key !== "PageUp"))
            return;

        if (domEvent.altKey || domEvent.ctrlKey || domEvent.metaKey || domEvent.shiftKey || !(domEvent.target instanceof Element))
            return;

        const found = rowKeyTarget(domEvent.target);

        // A key in a row's own control, or in the host's chrome, is theirs.
        if (found === null || !found.root.matches(KeyboardRowsRootSelector) || isInert(found.root))
            return;

        if (found.row !== null && ownControlOf(domEvent.target, found.row) !== null)
            return;

        const host = windowedHostOf(found.root);

        if (host === null || !host.hasAttribute(WindowPagedAttribute))
            return;

        const offset = pageOffset(readPageState(host), domEvent.key === "PageDown" ? "next" : "previous");

        if (offset === null)
            return;

        domEvent.preventDefault();
        void this.turnFromKeyAsync(found.root, host, offset);
    }

    /** Turns the page and puts the keyboard's row where it stood on the page before, or on the last row of a shorter one. */
    private async turnFromKeyAsync(root: HTMLElement, host: HTMLElement, offset: number): Promise<void> {
        const before = rowsOf(root);
        const lit = litRow(before);
        const index = lit === null ? 0 : Math.max(0, before.indexOf(lit));

        await this.options.windows.requestOffsetAsync(host, offset);

        const rows = rowsOf(root);

        if (rows.length > 0)
            setRowFocus(root, rows, rows[Math.min(index, rows.length - 1)]);
    }
}

/** A number's button, the current page's marked for a screen reader and the eye, or the ellipsis standing for the pages left out. */
function drawMark(mark: PageMark, current: number, culture: NumberCulturePack): HTMLElement {
    if (mark === "gap") {
        const gap = document.createElement("span");

        gap.className = GapClass;
        gap.setAttribute("aria-hidden", "true");
        gap.textContent = "…";

        return gap;
    }

    const button = document.createElement("button");
    const figure = formatNumber(mark, "N0", culture);

    button.className = NumberClasses.join(" ");
    button.setAttribute("type", "button");
    button.setAttribute(PagerPageAttribute, String(mark));
    button.textContent = figure;
    // The figure on the button is in the name too, so a voice command naming what it sees finds it.
    clientStrings.write(button, "aria-label", PageKey, { page: figure });

    if (mark === current)
        button.setAttribute("aria-current", "page");

    return button;
}

/** The rows the page holds, out of the source's count where it keeps one; marked with its key, so a switch writes it again in place. */
function drawRange(pager: HTMLElement, state: PageState, figure: (value: number) => string): void {
    const range = pager.querySelector<HTMLElement>(`:scope > .${RangeClass}`);

    if (range === null)
        return;

    const from = figure(state.count === 0 ? 0 : state.offset + 1);
    const to = figure(state.offset + state.count);

    if (state.total === null)
        clientStrings.write(range, null, RowsKey, { from, to });
    else
        clientStrings.write(range, null, RangeKey, { from, to, total: figure(state.total) });
}

/** The size's button says the page's size, and its list checks it. */
function drawSize(pager: HTMLElement, state: PageState, figure: (value: number) => string): void {
    const size = pager.querySelector<HTMLElement>(`:scope > .${SizeClass}`);
    const label = size?.querySelector<HTMLElement>(`.${SizeLabelClass}`) ?? null;

    if (size === null || label === null)
        return;

    clientStrings.write(label, null, SizeKey, { size: figure(state.size) });

    for (const choice of choicesOf(size))
        choice.setAttribute("aria-checked", Number(choice.getAttribute(PagerSizeAttribute)) === state.size ? "true" : "false");
}

/** The pager's buttons in the order they stand: the ends, the numbers, the size's button. */
function stopsOf(pager: HTMLElement): HTMLElement[] {
    return [...pager.querySelectorAll<HTMLElement>(`.${ButtonClass}, .${SizeTriggerClass}`)];
}

/**
 * Leaves one button in the Tab order: the one the keyboard is on, else previous or next — which every look shows — where it leads
 * somewhere, else the first one shown.
 */
function applyStop(pager: HTMLElement): void {
    const stops = stopsOf(pager);
    const focused = stops.find(stop => stop === document.activeElement);
    const ends = stops.filter(stop => stop.getAttribute(PagerPageAttribute) === "previous" || stop.getAttribute(PagerPageAttribute) === "next");

    applyRovingTabIndex(stops, focused ?? ends.find(isRovingCandidate) ?? stops.find(stop => stop.getClientRects().length > 0) ?? null);
}

/** Whether the pager's size menu offers a size. */
function offers(pager: HTMLElement, rows: number): boolean {
    const size = pager.querySelector<HTMLElement>(`:scope > .${SizeClass}`);

    return size !== null && choicesOf(size).some(choice => Number(choice.getAttribute(PagerSizeAttribute)) === rows);
}

function choicesOf(size: HTMLElement): HTMLElement[] {
    return [...size.querySelectorAll<HTMLElement>(`:scope > .${SizeMenuClass} > .${SizeChoiceClass}`)];
}

/**
 * A component's own windowed host: not a list in one of its rows, nor one in its chrome — a grid's band holds a menu, whose host
 * comes first in the document.
 */
function windowedHostOf(component: Element): HTMLElement | null {
    for (const host of component.querySelectorAll<HTMLElement>(`[${ItemsHostAttribute}][${HostModeAttribute}="windowed"]`)) {
        if (host.closest(ComponentSelector) === component)
            return host;
    }

    return null;
}

/** A host's own rows, never a nested list's. */
function rowsOf(root: HTMLElement): HTMLElement[] {
    return ownDescendants(root, SelectionRowSelector, SelectionRootSelector);
}

function isItemsHost(node: Node): boolean {
    return node instanceof Element && node.hasAttribute(ItemsHostAttribute);
}

function addsPager(mutation: MutationRecord): boolean {
    for (const node of mutation.addedNodes) {
        if (node instanceof Element && (node.matches(PagerSelector) || node.querySelector(PagerSelector) !== null))
            return true;
    }

    return false;
}
