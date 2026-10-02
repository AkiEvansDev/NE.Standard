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
// The listbox the options stand in, under the field.
const ListClass = "ui-select__list";
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
        // After the select engine's, whose Enter chooses the marked option; before FieldKeysEngine's, whose Enter leaves the field.
        this.root.addEventListener("keydown", domEvent => this.handleEnter(domEvent), true);
    }

    private handleInput(domEvent: Event): void {
        if (!(domEvent.target instanceof HTMLInputElement) || !domEvent.target.classList.contains(SearchInputClass))
            return;

        if (domEvent instanceof InputEvent && domEvent.isComposing)
            return;

        const input = domEvent.target;
        narrowToTerm(input);

        const existing = this.timers.get(input);

        if (existing !== undefined)
            window.clearTimeout(existing);

        const debounceText = input.getAttribute(DebounceAttribute);
        const debounce = debounceText === null ? DefaultDebounceMilliseconds : Number(debounceText);

        this.timers.set(input, window.setTimeout(() => this.commit(input), Number.isFinite(debounce) && debounce >= 0 ? debounce : DefaultDebounceMilliseconds));
    }

    /** Enter no option took asks at once: a manual search's way to ask, an automatic one's past its debounce; the list stays open. */
    private handleEnter(domEvent: Event): void {
        if (!(domEvent instanceof KeyboardEvent) || domEvent.key !== "Enter" || domEvent.defaultPrevented || domEvent.isComposing)
            return;

        if (!(domEvent.target instanceof HTMLInputElement) || !domEvent.target.classList.contains(SearchInputClass))
            return;

        const input = domEvent.target;
        const existing = this.timers.get(input);

        domEvent.preventDefault();

        if (existing !== undefined) {
            window.clearTimeout(existing);
            this.timers.delete(input);
        }

        this.commit(input, true);
    }

    /** `asked`: the reader asked for the search, which a manual field waits for; a term under the least length still asks nothing. */
    private commit(input: HTMLInputElement, asked = false): void {
        input.dispatchEvent(new Event("change", { bubbles: true }));

        if (!asked && input.hasAttribute(ManualAttribute))
            return;

        const minLengthText = input.getAttribute(MinLengthAttribute);
        const minLength = minLengthText === null ? 0 : Number(minLengthText);

        if (input.value.length < minLength)
            return;

        input.dispatchEvent(new Event("search", { bubbles: true }));
    }
}

/** Narrows a search's own options to the term its field holds; a list the server answers stands as it is. */
export function narrowToTerm(input: HTMLInputElement): void {
    // Narrowed here as well, the answer's own options could be hidden by a rule the server's match does not share.
    if (input.hasAttribute(AnsweredAttribute))
        return;

    const select = input.closest<HTMLElement>(`.${SelectClass}`);
    const list = select?.querySelector<HTMLElement>(`.${ListClass}`);

    if (select === null || select === undefined || list === null || list === undefined)
        return;

    const minLengthText = input.getAttribute(MinLengthAttribute);
    const minLength = minLengthText === null ? 0 : Number(minLengthText);
    const terms = input.value.trim().length >= minLength ? searchTerms(input.value, input) : [];
    const shown = narrow(list, option => terms.length === 0 || matchesTerms(foldWords(optionWords(option), option), terms));

    toggleNoMatchPlaceholder(select, list, terms.length > 0 && shown === 0);
}

/** The words an option shows as its name: its title where it has one, else all it draws — what the menu's search reads too. */
function optionWords(option: HTMLElement): string {
    return option.querySelector(`.${TitleClass}`)?.textContent ?? option.textContent ?? "";
}

/** Shows the options `keep` keeps and hides the rest, a group's header standing while an option after it does; answers how many stayed. */
function narrow(list: HTMLElement, keep: (option: HTMLElement) => boolean): number {
    let header: HTMLElement | null = null;
    let headerKept = false;
    let kept = 0;

    for (const row of list.children) {
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
    const list = select.querySelector<HTMLElement>(`.${ListClass}`);

    if (list === null)
        return;

    const shown = narrow(list, option => option.style.display !== "none");

    toggleNoMatchPlaceholder(select, list, shown === 0);
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
