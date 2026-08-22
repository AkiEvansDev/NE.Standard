import { EmptyPlaceholderAttribute, EmptyTemplateAttribute } from "../addressing/dom-attributes";

const DebounceAttribute = "data-ui-search-debounce";
const MinLengthAttribute = "data-ui-search-min-length";
const ManualAttribute = "data-ui-search-manual";
const SearchInputClass = "ui-search__input";
const SelectClass = "ui-select";
const PopupClass = "ui-select__popup";
const OptionClass = "ui-select__option";
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
    }

    private handleInput(domEvent: Event): void {
        if (!(domEvent.target instanceof HTMLInputElement) || !domEvent.target.classList.contains(SearchInputClass))
            return;

        const input = domEvent.target;
        filterOptions(input);

        const existing = this.timers.get(input);

        if (existing !== undefined)
            window.clearTimeout(existing);

        const debounceText = input.getAttribute(DebounceAttribute);
        const debounce = debounceText === null ? DefaultDebounceMilliseconds : Number(debounceText);

        this.timers.set(input, window.setTimeout(() => this.commit(input), debounce));
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

export function filterOptions(input: HTMLInputElement): void {
    const select = input.closest<HTMLElement>(`.${SelectClass}`);
    const popup = select?.querySelector<HTMLElement>(`.${PopupClass}`);

    if (select === null || select === undefined || popup === null || popup === undefined)
        return;

    const minLengthText = input.getAttribute(MinLengthAttribute);
    const minLength = minLengthText === null ? 0 : Number(minLengthText);
    const query = input.value.trim().toLowerCase();
    const filtering = query.length > 0 && query.length >= minLength;
    let visibleCount = 0;

    for (const option of popup.querySelectorAll<HTMLElement>(`.${OptionClass}`)) {
        const isMatch = !filtering || (option.textContent ?? "").toLowerCase().includes(query);
        option.style.display = isMatch ? "" : "none";

        if (isMatch)
            visibleCount++;
    }

    toggleNoMatchPlaceholder(select, popup, filtering && visibleCount === 0);
}

export function clearOptionsFilter(select: HTMLElement): void {
    const popup = select.querySelector<HTMLElement>(`.${PopupClass}`);

    if (popup === null)
        return;

    for (const option of popup.querySelectorAll<HTMLElement>(`.${OptionClass}`))
        option.style.display = "";

    toggleNoMatchPlaceholder(select, popup, false);
}

function toggleNoMatchPlaceholder(select: HTMLElement, popup: HTMLElement, show: boolean): void {
    const existing = popup.querySelector<HTMLElement>(`:scope > [${EmptyPlaceholderAttribute}]`);

    if (!show) {
        existing?.remove();
        return;
    }

    if (existing !== null)
        return;

    const template = select.querySelector<HTMLTemplateElement>(`:scope > template[${EmptyTemplateAttribute}]`);

    if (template === null)
        return;

    const fragment = template.content.cloneNode(true) as DocumentFragment;
    const root = fragment.firstElementChild;

    if (root === null)
        return;

    root.setAttribute(EmptyPlaceholderAttribute, "");
    popup.appendChild(root);
}
