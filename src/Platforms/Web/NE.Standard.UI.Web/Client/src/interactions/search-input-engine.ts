// A search field over a list: it asks the server as the reader types, and narrows the list itself only where the list is its own —
// static options. A list the server answers `OnSearch` with stands as it is until the answer, and shows that answer whole; a query
// the server takes past a moment to answer turns the field's glyph into the loading ring until the last one asked is answered.

// `.ts` on the value imports, and types imported as types: `node --test` loads this module as it is.
import { EmptyPlaceholderAttribute, EmptyTemplateAttribute, GroupHeaderAttribute, ItemsEmptyAttribute, SelectClass } from "../addressing/dom-attributes.ts";
import type { EventRegistration } from "../events/event-descriptor.ts";
import { PendingDelayMilliseconds } from "../events/pending-mark.ts";
import { CommitPauses } from "./debounced-commit-engine.ts";
import { isComposing } from "./keyboard-shortcut.ts";
import { entryWords, foldWords, matchesTerms, searchTerms } from "./search-terms.ts";

const DebounceAttribute = "data-ui-search-debounce";
const MinLengthAttribute = "data-ui-search-min-length";
const ManualAttribute = "data-ui-search-manual";
// On the field of a search whose list is the server's answer to `OnSearch` (SearchComponentRenderer).
const AnsweredAttribute = "data-ui-search-answered";
const SearchInputClass = "ui-search__input";
// The listbox the options stand in, under the field.
const ListClass = "ui-select__list";
const OptionClass = "ui-select__option";
const DefaultDebounceMilliseconds = 300;
// On the field's box while a query is past its moment unanswered: the glyph in it is the loading ring (ui-search.less).
const WaitingAttribute = "data-ui-search-waiting";
const FieldClass = "ui-search__field";

/** The queries a field has asked and not had answered, and the moment that shows the ring if they outlast it. */
type SearchWait = { asked: number; timer: number | null };

const waits = new WeakMap<Element, SearchWait>();

/**
 * How the pipeline reads a search's `search`: from the query's command taken to its answer — answered, failed, refused, the connection
 * dropped — the field waits; a query asked while one is still unanswered keeps the wait, and the ring with it.
 */
export const SearchEvent: { readonly name: string; readonly registration: Omit<EventRegistration, "name"> } = {
    name: "search",
    registration: {
        started: context => awaitAnswer(context.domEvent.target),
        completed: context => settleAnswer(context.domEvent.target)
    }
};

function awaitAnswer(target: EventTarget | null): void {
    if (!(target instanceof Element))
        return;

    const wait = waits.get(target) ?? { asked: 0, timer: null };

    waits.set(target, wait);

    if (wait.asked++ > 0)
        return;

    // Busy to a screen reader at once; the ring for the eye only past the moment.
    listOf(target)?.setAttribute("aria-busy", "true");
    wait.timer = window.setTimeout(() => {
        wait.timer = null;
        target.closest(`.${FieldClass}`)?.setAttribute(WaitingAttribute, "");
    }, PendingDelayMilliseconds);
}

function settleAnswer(target: EventTarget | null): void {
    if (!(target instanceof Element))
        return;

    const wait = waits.get(target);

    if (wait === undefined || --wait.asked > 0)
        return;

    waits.delete(target);

    if (wait.timer !== null)
        window.clearTimeout(wait.timer);

    listOf(target)?.removeAttribute("aria-busy");
    target.closest(`.${FieldClass}`)?.removeAttribute(WaitingAttribute);
}

/** The listbox a search's field asks the options of. */
function listOf(input: Element): Element | null {
    return input.closest(`.${SelectClass}`)?.querySelector(`.${ListClass}`) ?? null;
}

export type SearchInputEngineOptions = {
    readonly root?: ParentNode;
};

export class SearchInputEngine {
    private readonly root: ParentNode;
    // One of the page's pauses: a leave commits a query still waiting, and a field's cancel drops it, as a debounced field's.
    private readonly pauses: CommitPauses;

    public constructor(options: SearchInputEngineOptions = {}) {
        this.root = options.root ?? document;
        this.pauses = new CommitPauses(this.root);

        this.root.addEventListener("input", domEvent => this.handleInput(domEvent), true);
        // A composed character arrives whole at its end; the keystrokes that build it are not a query yet.
        this.root.addEventListener("compositionend", domEvent => this.handleInput(domEvent), true);
        // After the select engine's, whose Enter chooses the marked option; before FieldKeysEngine's, whose Enter leaves the field.
        this.root.addEventListener("keydown", domEvent => this.handleEnter(domEvent), true);
    }

    private handleInput(domEvent: Event): void {
        if (!(domEvent.target instanceof HTMLInputElement) || !domEvent.target.classList.contains(SearchInputClass))
            return;

        if ((domEvent as Partial<InputEvent>).isComposing === true)
            return;

        const input = domEvent.target;
        narrowToTerm(input);

        const debounceText = input.getAttribute(DebounceAttribute);
        const debounce = debounceText === null ? DefaultDebounceMilliseconds : Number(debounceText);

        this.pauses.wait(input, Number.isFinite(debounce) && debounce >= 0 ? debounce : DefaultDebounceMilliseconds, () => this.commit(input));
    }

    /** Enter no option took asks at once: a manual search's way to ask, an automatic one's past its debounce; the list stays open. */
    private handleEnter(domEvent: Event): void {
        if (!(domEvent instanceof KeyboardEvent) || domEvent.key !== "Enter" || domEvent.defaultPrevented || isComposing(domEvent))
            return;

        if (!(domEvent.target instanceof HTMLInputElement) || !domEvent.target.classList.contains(SearchInputClass))
            return;

        const input = domEvent.target;

        domEvent.preventDefault();
        this.pauses.drop(input);
        this.commit(input, true);
    }

    /** `asked`: the reader asked for the search, which a manual field waits for; a term under the least length still asks nothing. */
    private commit(input: HTMLInputElement, asked = false): void {
        input.dispatchEvent(new Event("change", { bubbles: true }));

        if (!asked && input.hasAttribute(ManualAttribute))
            return;

        if (!meetsMinLength(input))
            return;

        input.dispatchEvent(new Event("search", { bubbles: true }));
    }
}

/**
 * Whether a field's term is long enough to search by, as the server's search and the field's own narrowing both read it: trimmed, and
 * against a least length that reads as a number, none otherwise.
 */
function meetsMinLength(input: HTMLInputElement): boolean {
    const minLength = Number(input.getAttribute(MinLengthAttribute) ?? 0);

    return !Number.isFinite(minLength) || input.value.trim().length >= minLength;
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

    const terms = meetsMinLength(input) ? searchTerms(input.value, input) : [];
    const shown = narrow(list, option => terms.length === 0 || matchesTerms(foldWords(entryWords(option), option), terms));

    toggleNoMatchPlaceholder(select, list, terms.length > 0 && shown === 0);
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
        list.toggleAttribute(ItemsEmptyAttribute, false);
        return;
    }

    // The empty host's mark while the line stands there, as an items host wears it (items-empty-renderer.ts).
    list.toggleAttribute(ItemsEmptyAttribute, existing !== null || appendNoMatchPlaceholder(owner, list));
}

/** Clones the owner's empty template into the list and answers whether it had one. */
function appendNoMatchPlaceholder(owner: HTMLElement, list: HTMLElement): boolean {
    const template = owner.querySelector<HTMLTemplateElement>(`:scope > template[${EmptyTemplateAttribute}]`);

    if (template === null)
        return false;

    const fragment = template.content.cloneNode(true) as DocumentFragment;
    const root = fragment.firstElementChild;

    if (root === null)
        return false;

    root.setAttribute(EmptyPlaceholderAttribute, "");
    list.appendChild(root);

    return true;
}
