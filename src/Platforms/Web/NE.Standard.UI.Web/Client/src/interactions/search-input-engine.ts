// A search field over a list: it asks the server as the reader types, and narrows the list itself only where the list is its own —
// static options. A list the server answers `OnSearch` with stands as it is until the answer, and shows that answer whole.

import { EmptyPlaceholderAttribute, EmptyTemplateAttribute, GroupHeaderAttribute, SelectClass } from "../addressing/dom-attributes.ts";
import { foldWords, matchesTerms, searchTerms } from "./search-terms.ts";

const DebounceAttribute = "data-ui-search-debounce";
const MinLengthAttribute = "data-ui-search-min-length";
const ManualAttribute = "data-ui-search-manual";
// On the field of a search whose list is the server's answer to `OnSearch` (SearchComponentRenderer).
const AnsweredAttribute = "data-ui-search-answered";
const SearchInputClass = "ui-search__input";
const PopupClass = "ui-select__popup";
const OptionClass = "ui-select__option";
const TitleClass = "ui-text__title";
const DefaultDebounceMilliseconds = 300;

export type SearchInputEngineOptions = {
    readonly root?: ParentNode;
};

export class SearchInputEngine {
    private readonly root: ParentNode;
    private readonly timers = new WeakMap<HTMLInputElement, number>();

    public constructor(options: SearchInputEngineOptions = {}) {
        this.root = options.root ?? document;

        this.root.addEventListener("input", domEvent => this.handleInput(domEvent), true);
        // A composed character arrives whole at its end; the keystrokes that build it are not a query yet.
        this.root.addEventListener("compositionend", domEvent => this.handleInput(domEvent), true);
    }

    private handleInput(domEvent: Event): void {
        if (!(domEvent.target instanceof HTMLInputElement) || !domEvent.target.classList.contains(SearchInputClass))
            return;

        if (domEvent instanceof InputEvent && domEvent.isComposing)
            return;

        const input = domEvent.target;
        filterOptions(input);

        const existing = this.timers.get(input);

        if (existing !== undefined)
            window.clearTimeout(existing);

        const debounceText = input.getAttribute(DebounceAttribute);
        const debounce = debounceText === null ? DefaultDebounceMilliseconds : Number(debounceText);

        this.timers.set(input, window.setTimeout(() => this.commit(input), Number.isFinite(debounce) && debounce >= 0 ? debounce : DefaultDebounceMilliseconds));
    }

    private commit(input: HTMLInputElement): void {
        input.dispatchEvent(new Event("change", { bubbles: true }));

        if (input.hasAttribute(ManualAttribute))
            return;

        const minLengthText = input.getAttribute(MinLengthAttribute);
        const minLength = minLengthText === null ? 0 : Number(minLengthText);

        if (input.value.length < minLength)
            return;

        input.dispatchEvent(new Event("search", { bubbles: true }));
    }
}

function filterOptions(input: HTMLInputElement): void {
    // Narrowed here as well, the answer's own options could be hidden by a rule the server's match does not share.
    if (input.hasAttribute(AnsweredAttribute))
        return;

    const select = input.closest<HTMLElement>(`.${SelectClass}`);
    const popup = select?.querySelector<HTMLElement>(`.${PopupClass}`);

    if (select === null || select === undefined || popup === null || popup === undefined)
        return;

    const minLengthText = input.getAttribute(MinLengthAttribute);
    const minLength = minLengthText === null ? 0 : Number(minLengthText);
    const terms = input.value.trim().length >= minLength ? searchTerms(input.value, input) : [];
    const shown = narrow(popup, option => terms.length === 0 || matchesTerms(foldWords(optionWords(option), option), terms));

    toggleNoMatchPlaceholder(select, popup, terms.length > 0 && shown === 0);
}

/** The words an option shows as its name: its title where it has one, else all it draws — what the menu's search reads too. */
function optionWords(option: HTMLElement): string {
    return option.querySelector(`.${TitleClass}`)?.textContent ?? option.textContent ?? "";
}

/** Shows the options `keep` keeps and hides the rest, a group's header standing while an option after it does; answers how many stayed. */
function narrow(popup: HTMLElement, keep: (option: HTMLElement) => boolean): number {
    let header: HTMLElement | null = null;
    let headerKept = false;
    let kept = 0;

    for (const row of popup.children) {
        if (!(row instanceof HTMLElement))
            continue;

        if (row.hasAttribute(GroupHeaderAttribute)) {
            if (header !== null)
                show(header, headerKept);

            header = row;
            headerKept = false;
            continue;
        }

        if (!row.classList.contains(OptionClass))
            continue;

        const shown = keep(row);

        show(row, shown);
        headerKept ||= shown;

        if (shown)
            kept++;
    }

    if (header !== null)
        show(header, headerKept);

    return kept;
}

function show(row: HTMLElement, shown: boolean): void {
    const display = shown ? "" : "none";

    if (row.style.display !== display)
        row.style.display = display;
}

/** The empty state, decided from what is in the list rather than from the query that narrowed it; a refill's headers follow its options. */
export function refreshEmptyState(select: HTMLElement): void {
    const popup = select.querySelector<HTMLElement>(`.${PopupClass}`);

    if (popup === null)
        return;

    const shown = narrow(popup, option => option.style.display !== "none");

    toggleNoMatchPlaceholder(select, popup, shown === 0);
}

/** Takes the query's filter off every option and header, leaving the empty state to `refreshEmptyState` alone. */
export function clearOptionsFilter(select: HTMLElement): void {
    const popup = select.querySelector<HTMLElement>(`.${PopupClass}`);

    if (popup !== null)
        narrow(popup, () => true);
}

/** Puts the owner's empty template in its list while a search leaves nothing there, and takes it out again — a select's, a menu's. */
export function toggleNoMatchPlaceholder(owner: HTMLElement, list: HTMLElement, show: boolean): void {
    const existing = list.querySelector<HTMLElement>(`:scope > [${EmptyPlaceholderAttribute}]`);

    if (!show) {
        existing?.remove();
        return;
    }

    if (existing !== null)
        return;

    const template = owner.querySelector<HTMLTemplateElement>(`:scope > template[${EmptyTemplateAttribute}]`);

    if (template === null)
        return;

    const fragment = template.content.cloneNode(true) as DocumentFragment;
    const root = fragment.firstElementChild;

    if (root === null)
        return;

    root.setAttribute(EmptyPlaceholderAttribute, "");
    list.appendChild(root);
}
