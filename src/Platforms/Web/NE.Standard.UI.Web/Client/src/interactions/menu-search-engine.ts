// A menu's search, by the one matching rule (`search-terms.ts`) over the words an entry shows — translated, not the keys behind
// them. Emptied, or the menu folded, the menu is as it was.

import { CollapsedAttribute, ComponentKeyAttribute, MenuGroupAttribute, MenuItemClass as EntryClass, MenuItemKindAttribute, MenuOpenAttribute, MenuSearchAttribute, MenuSearchingAttribute, MenuSelectAttribute, MenuUnmatchedAttribute, PassiveMenuEntrySelector } from "../addressing/dom-attributes";
import { observeComponents } from "./dom-mutations";
import { isRovingCandidate } from "./roving-focus";
import { foldWords, matchesTerms, searchTerms } from "./search-terms";

const RootClass = "ui-menu";
const SearchableSelector = `.${RootClass}[${MenuSearchAttribute}]`;
const BarSelector = ":scope > .ui-collapsible__bar";
const HostSelector = ":scope > .ui-menu__host";
const ItemWrapperClass = "ui-menu__item";
const EntrySelector = `:scope > .${EntryClass}`;
const TitleSelector = ".ui-text__title";
const SubmenuHostSelector = ":scope > .ui-menu__submenu > .ui-menu > .ui-menu__host";

export type MenuSearchEngineOptions = {
    readonly root?: ParentNode;
};

type ActiveSearch = {
    readonly field: HTMLInputElement;
    // The groups open before the search began, by key where a group has one: a refill replaces the elements.
    readonly openBefore: ReadonlySet<Element | string>;
};

export class MenuSearchEngine {
    private readonly active = new WeakMap<HTMLElement, ActiveSearch>();

    public constructor(options: MenuSearchEngineOptions = {}) {
        const root = options.root ?? document;

        // The field's clear button says so with a change rather than an input.
        root.addEventListener("input", domEvent => this.handle(domEvent), true);
        root.addEventListener("change", domEvent => this.handle(domEvent), true);
        root.addEventListener("keydown", domEvent => this.handleKeydown(domEvent));

        // Rows the server adds or refills mid-search arrive unmarked, and a fold hides the field that says what is filtered.
        observeComponents(root, SearchableSelector, { childList: true, characterData: true, attributeFilter: [CollapsedAttribute] }, menus => this.reconcile(menus));
    }

    private handle(domEvent: Event): void {
        const field = domEvent.target;

        if (!(field instanceof HTMLInputElement))
            return;

        const menu = searchableMenuOf(field);

        if (menu !== null)
            this.search(menu, field);
    }

    private search(menu: HTMLElement, field: HTMLInputElement): void {
        const host = menu.querySelector<HTMLElement>(HostSelector);

        if (host === null)
            return;

        const terms = searchTerms(field.value, menu);

        if (terms.length === 0) {
            this.clear(menu, host);
            return;
        }

        if (!this.active.has(menu))
            this.active.set(menu, { field, openBefore: openGroups(host) });

        menu.setAttribute(MenuSearchingAttribute, "");
        this.filter(host, terms);
    }

    /** Marks what stays under one host and answers whether anything did; a caption stays while an entry after it does. */
    private filter(host: HTMLElement, terms: readonly string[]): boolean {
        let caption: HTMLElement | null = null;
        let captionHasMatch = false;
        let any = false;

        for (const entry of wrappers(host)) {
            const kind = kindOf(entry);

            if (kind === "header") {
                if (caption !== null)
                    mark(caption, captionHasMatch);

                caption = entry;
                captionHasMatch = false;
                continue;
            }

            const shown = kind !== "separator" && this.match(entry, terms);

            mark(entry, shown);
            captionHasMatch ||= shown;
            any ||= shown;
        }

        if (caption !== null)
            mark(caption, captionHasMatch);

        return any;
    }

    /** Whether an entry stays: its own words match, or — for a group — one of its sub-entries' do, the group then opening on them. */
    private match(entry: HTMLElement, terms: readonly string[]): boolean {
        const own = matchesTerms(wordsOf(entry), terms);
        const submenu = entry.hasAttribute(MenuGroupAttribute) ? entry.querySelector<HTMLElement>(SubmenuHostSelector) : null;

        if (submenu === null)
            return own;

        // A group whose own words match keeps all it holds: what was asked for is the group.
        if (own) {
            unmarkAll(submenu);
            entry.removeAttribute(MenuOpenAttribute);

            return true;
        }

        const any = this.filter(submenu, terms);

        entry.toggleAttribute(MenuOpenAttribute, any);

        return any;
    }

    /** Every entry back, and the groups open as they were before the search began. */
    private clear(menu: HTMLElement, host: HTMLElement): void {
        unmarkAll(host);
        menu.removeAttribute(MenuSearchingAttribute);

        const search = this.active.get(menu);

        if (search === undefined)
            return;

        this.active.delete(menu);

        // A folded menu keeps no group open inline: its groups fly out, and the fold has already closed them.
        const collapsed = menu.hasAttribute(CollapsedAttribute);

        for (const group of host.querySelectorAll(`[${MenuGroupAttribute}]:not([${MenuSelectAttribute}])`))
            group.toggleAttribute(MenuOpenAttribute, !collapsed && search.openBefore.has(group.getAttribute(ComponentKeyAttribute) ?? group));
    }

    private reconcile(menus: Iterable<HTMLElement>): void {
        for (const menu of menus) {
            const search = this.active.get(menu);

            if (search === undefined)
                continue;

            // Folded, the search is let go of whole rather than left filtering an icon rail with no field to show why.
            if (menu.hasAttribute(CollapsedAttribute)) {
                search.field.value = "";
                search.field.blur();
            }

            this.search(menu, search.field);
        }
    }

    /** The arrow down from the field goes on to the first entry left, as it would from an entry above it. */
    private handleKeydown(domEvent: Event): void {
        if (!(domEvent instanceof KeyboardEvent) || domEvent.key !== "ArrowDown" || domEvent.defaultPrevented || !(domEvent.target instanceof HTMLInputElement))
            return;

        const menu = searchableMenuOf(domEvent.target);
        const entries = menu?.querySelector<HTMLElement>(HostSelector)?.querySelectorAll<HTMLElement>(`.${EntryClass}:not(${PassiveMenuEntrySelector})`) ?? [];
        const first = [...entries].find(isRovingCandidate);

        if (first === undefined)
            return;

        domEvent.preventDefault();
        first.focus();
    }
}

/** The searchable menu whose own bar holds the field, not a menu the field merely sits in. */
function searchableMenuOf(field: HTMLInputElement): HTMLElement | null {
    const menu = field.closest<HTMLElement>(SearchableSelector);
    const bar = menu?.querySelector(BarSelector) ?? null;

    return menu !== null && bar !== null && bar.contains(field) ? menu : null;
}

function openGroups(host: HTMLElement): Set<Element | string> {
    const open = new Set<Element | string>();

    for (const group of host.querySelectorAll(`[${MenuGroupAttribute}][${MenuOpenAttribute}]`))
        open.add(group.getAttribute(ComponentKeyAttribute) ?? group);

    return open;
}

function wrappers(host: Element): HTMLElement[] {
    return [...host.children].filter((child): child is HTMLElement => child instanceof HTMLElement && child.classList.contains(ItemWrapperClass));
}

function kindOf(wrapper: HTMLElement): string {
    return wrapper.querySelector(EntrySelector)?.getAttribute(MenuItemKindAttribute) ?? "item";
}

/** The words an entry shows, as the viewer reads them. */
function wordsOf(wrapper: HTMLElement): string {
    return foldWords(wrapper.querySelector(EntrySelector)?.querySelector(TitleSelector)?.textContent ?? "", wrapper);
}

function mark(wrapper: HTMLElement, shown: boolean): void {
    wrapper.toggleAttribute(MenuUnmatchedAttribute, !shown);
}

function unmarkAll(host: HTMLElement): void {
    for (const entry of host.querySelectorAll<HTMLElement>(`[${MenuUnmatchedAttribute}]`))
        entry.removeAttribute(MenuUnmatchedAttribute);
}
