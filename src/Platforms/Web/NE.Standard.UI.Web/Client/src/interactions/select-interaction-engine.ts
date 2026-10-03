import {
    BindingAttributePrefix, ComponentContextAttribute, ComponentIdAttribute, ComponentKeyAttribute, ComponentParameterCountAttribute,
    ensureElementId, HiddenClass, ListTriggerClass as TriggerClass, SelectClass, SelectedKeysAttribute
} from "../addressing/dom-attributes.ts";
import { clientStrings } from "../runtime/client-strings.ts";
import { isAnchoredPopupPlacement } from "./anchored-popup.ts";
import { enterTags, holdsTagSeparator, isChoiceFull, parseChosenKeys, parseMaxChosen, removeChosenKey, splitTags, takeTypedTags, toggleChosenKey } from "./multi-select-keys.ts";
import type { TypedTag } from "./multi-select-keys.ts";
import { OwnedPopups } from "./owned-popup.ts";
import { ownDescendants } from "./own-descendants.ts";
import { isInert, isItemDisabled, isReadOnly } from "./interactive-state.ts";
import { focusAsLastInput, focusByPointer, isPointerLast, isTouchLast, markPointerFocus } from "./popup-focus.ts";
import { applyRovingTabIndex, resolveRovingTarget } from "./roving-focus.ts";
import { narrowToTerm, refreshEmptyState } from "./search-input-engine.ts";
import { TypeAhead, typeAheadCharacter } from "./type-ahead.ts";
import type { EntryValidation, FieldMarkWords, FieldValidation } from "./validation-engine.ts";

const SelectValueAttribute = "data-ui-select-value";
// Where the list opens when the author said so; below from the start edge otherwise.
const SelectPlacementAttribute = "data-ui-select-placement";
const OpenClass = "ui-select--open";
const TriggerContentClass = "ui-select__trigger-content";
// What the render leaves on the content it drew, naming the option it drew — read once and taken off.
const ServerContentAttribute = "data-ui-select-content";
const PlaceholderClass = "ui-select__placeholder";
const PrefixIconClass = "ui-input__affix-icon--prefix";
const PopupClass = "ui-select__popup";
// The listbox the options stand in: the popup itself in a select, the part under the field in a search's.
const ListClass = "ui-select__list";
const OptionClass = "ui-select__option";
const ValueInputClass = "ui-select__value-input";
const ClearAttribute = "data-ui-select-clear";
// A select whose open list carries a text field over its options; the field holds the keyboard while the list is open.
const SearchClass = "ui-search";
const SearchInputClass = "ui-search__input";
const TitleClass = "ui-text__title";
// The option the arrows or the pointer reached, marked outright: `:focus` fails in an unfocused window, and a search keeps its focus.
const ActiveAttribute = "data-ui-active";
// A multi-select wears the select's shell: its value is the JSON list on the root's chosen-keys attribute, shown as chips.
const MultiClass = "ui-multi-select";
const ChipsClass = "ui-multi-select__chips";
const ChipClass = "ui-multi-select__chip";
const ChipLabelClass = "ui-multi-select__chip-label";
const ChipRemoveClass = "ui-multi-select__chip-remove";
// On a chip, the key of the option it stands for.
const ChipAttribute = "data-ui-select-chip";
// On a multi-select's root, how many options it takes at most.
const MaxAttribute = "data-ui-select-max";
// On a multi-select's root that takes the reader's own text: its entry after the chips is the control the reader types in.
const FreeTextAttribute = "data-ui-select-free-text";
const EntryClass = "ui-multi-select__entry";
// On a free-text multi-select whose first suggestion Enter takes, marked as the reader types: "first-suggestion".
const TagEntryAttribute = "data-ui-select-tag-entry";

export type SelectInteractionEngineOptions = {
    readonly root?: ParentNode;
    /** Where a free-text entry asks the field's rules about a tag, and says on its line why one was refused. */
    readonly validation?: FieldValidation & EntryValidation;
};

// Never an attribute this engine writes itself: answering its own writes is a loop and a sync on every scroll frame.
const ObservedAttributes = [SelectValueAttribute, SelectedKeysAttribute, MaxAttribute, "class", ComponentKeyAttribute];

/** A read-only select, search or multi-select keeps its field focusable and readable, and offers no list and no change. */
function isFixed(select: HTMLElement | null): boolean {
    return select === null || isReadOnly(select) || isInert(select);
}

function isMultiple(select: HTMLElement): boolean {
    return select.classList.contains(MultiClass);
}

function isSearch(select: HTMLElement): boolean {
    return select.classList.contains(SearchClass);
}

/** A search's text field, at the top of its list: before the options in the markup, so never one drawn inside an option. */
function searchFieldOf(select: HTMLElement): HTMLInputElement | null {
    return isSearch(select) ? select.querySelector<HTMLInputElement>(`.${SearchInputClass}`) : null;
}

/** A free-text multi-select's entry, in its own field's box: never one drawn inside an option. */
function entryOf(select: HTMLElement): HTMLInputElement | null {
    return select.hasAttribute(FreeTextAttribute) ? select.querySelector<HTMLInputElement>(`:scope > .${TriggerClass} .${EntryClass}`) : null;
}

/** The text field that holds the keyboard while the list is open — a search's, a free-text entry — whose list's mark is an attribute. */
function typedFieldOf(select: HTMLElement): HTMLInputElement | null {
    return searchFieldOf(select) ?? entryOf(select);
}

/** Where the field's keyboard stands when it is closed: a free-text entry, else the trigger. */
function controlOf(select: HTMLElement): HTMLElement | null {
    return entryOf(select) ?? select.querySelector<HTMLElement>(`.${TriggerClass}`);
}

/** The free-text entry an event happened in and its multi-select, or null for any other target. */
function entryTarget(domEvent: Event): { entry: HTMLInputElement; select: HTMLElement } | null {
    const entry = domEvent.target instanceof HTMLInputElement && domEvent.target.classList.contains(EntryClass) ? domEvent.target : null;
    const select = entry?.closest<HTMLElement>(`.${SelectClass}`) ?? null;

    return entry === null || select === null ? null : { entry, select };
}

/** This select's own options: a select rendered inside an option's template keeps its list to itself. */
function optionsOf(select: HTMLElement): HTMLElement[] {
    return ownDescendants(select, `.${PopupClass} .${OptionClass}`, `.${SelectClass}`);
}

/** What an option reads as in a field: its title where it has one, else everything it draws. */
function optionLabel(option: HTMLElement | null): string | null {
    return option === null ? null : option.querySelector<HTMLElement>(`.${TitleClass}`)?.textContent ?? option.textContent;
}

function stripAddressingAttributes(element: Element): void {
    for (const node of [element, ...element.querySelectorAll("*")]) {
        node.removeAttribute(ComponentIdAttribute);
        node.removeAttribute(ComponentKeyAttribute);
        node.removeAttribute(ComponentParameterCountAttribute);
        node.removeAttribute(ComponentContextAttribute);

        for (const attribute of [...node.attributes]) {
            if (attribute.name.startsWith(BindingAttributePrefix))
                node.removeAttribute(attribute.name);
        }
    }
}

export class SelectInteractionEngine {
    private readonly root: ParentNode;

    // Closing takes the mark off the list; the focus goes back to the trigger.
    private readonly popups = new OwnedPopups({
        show: ({ owner }) => owner.classList.add(OpenClass),
        hide: ({ owner }) => {
            owner.classList.remove(OpenClass);
            this.markActive(owner, null);
            const popup = owner.querySelector<HTMLElement>(`.${PopupClass}`);

            if (popup !== null)
                popup.style.minHeight = "";
        }
    });

    private readonly typeAhead = new TypeAhead();

    // The option key each trigger draws, so a search keeps showing a chosen option its answer to a term leaves out.
    private readonly drawnKeys = new WeakMap<HTMLElement, string>();

    private readonly validation: (FieldValidation & EntryValidation) | undefined;

    // The free-text fields whose line says why a tag was refused, until the reader edits the entry again.
    private readonly refusedEntries = new WeakSet<HTMLElement>();

    public constructor(options: SelectInteractionEngineOptions = {}) {
        this.root = options.root ?? document;
        this.validation = options.validation;

        for (const select of this.root.querySelectorAll<HTMLElement>(`.${SelectClass}`))
            this.sync(select);

        if (this.root instanceof Node) {
            // Hand-rolled rather than observeComponents: only the record says which select it names; each syncs once per batch.
            const observer = new MutationObserver(mutations => {
                const selects = new Set<HTMLElement>();

                for (const mutation of mutations)
                    collectMutatedSelects(mutation, selects);

                for (const select of selects)
                    this.sync(select);
            });

            observer.observe(this.root, { attributes: true, attributeFilter: ObservedAttributes, childList: true, characterData: true, subtree: true });
        }

        this.root.addEventListener("click", domEvent => this.handleClick(domEvent), true);
        this.root.addEventListener("keydown", domEvent => this.handleKeydown(domEvent), true);
        this.root.addEventListener("pointermove", domEvent => this.handlePointerMove(domEvent), true);

        // The clear and a chip's remove take no focus on their press: both vanish, and the focus would fall to the page's body. Nor
        // does a press on a free-text field's box around its entry, which keeps the keyboard in the entry.
        this.root.addEventListener("mousedown", domEvent => {
            if (domEvent.target instanceof Element && (domEvent.target.closest(`[${ClearAttribute}], .${ChipRemoveClass}`) !== null || isBoxAroundEntry(domEvent.target)))
                domEvent.preventDefault();
        }, true);

        // On the window, the first node an event's capture passes: the entry's text is a draft, and the value's listeners — its
        // binding, its rules, an interaction reading it — must hear the chips, never the text being typed.
        window.addEventListener("input", domEvent => this.handleEntryEdit(domEvent), true);
        window.addEventListener("compositionend", domEvent => this.handleEntryEdit(domEvent), true);
        window.addEventListener("change", domEvent => this.holdEntryDraft(domEvent), true);
        // Ahead of the popups' own Escape, which would close the list the mark stands in.
        window.addEventListener("keydown", domEvent => this.handleEntryEscape(domEvent), true);
        this.root.addEventListener("paste", domEvent => this.handleEntryPaste(domEvent), true);
    }

    /** Typing in a free-text entry: a separator makes chips of what stands before it; otherwise the suggestions follow the text. */
    private handleEntryEdit(domEvent: Event): void {
        const target = this.holdEntryDraft(domEvent);

        if (target === null || (domEvent as InputEvent).isComposing === true)
            return;

        const { entry, select } = target;

        if (isFixed(select))
            return;

        this.releaseRefusal(select);

        const typed = takeTypedTags(entry.value);

        if (typed.tags.length > 0)
            this.enterTyped(select, entry, typed.tags, typed.rest);
        else
            this.suggest(select, entry);
    }

    /** Keeps an entry's own event from every other listener, and answers the entry it was; null for any other event. */
    private holdEntryDraft(domEvent: Event): { entry: HTMLInputElement; select: HTMLElement } | null {
        const target = entryTarget(domEvent);

        if (target === null || (this.root instanceof Node && !this.root.contains(target.select)))
            return null;

        domEvent.stopImmediatePropagation();
        return target;
    }

    /** Escape on an entry whose first suggestion is marked takes the mark off before it closes the list: Enter then takes the text. */
    private handleEntryEscape(domEvent: Event): void {
        const target = domEvent instanceof KeyboardEvent && domEvent.key === "Escape" && !domEvent.defaultPrevented ? entryTarget(domEvent) : null;

        if (target === null || this.openSelect !== target.select || target.select.getAttribute(TagEntryAttribute) !== "first-suggestion" || !optionsOf(target.select).some(option => option.hasAttribute(ActiveAttribute)))
            return;

        domEvent.preventDefault();
        this.markActive(target.select, null);
    }

    /** A paste holding a separator is several tags — "a, b, c" three chips — taken with whatever the entry already held around it. */
    private handleEntryPaste(domEvent: Event): void {
        const target = entryTarget(domEvent);
        const text = (domEvent as ClipboardEvent).clipboardData?.getData("text") ?? "";

        if (target === null || isFixed(target.select) || !holdsTagSeparator(text))
            return;

        const { entry, select } = target;
        const start = entry.selectionStart ?? entry.value.length;
        const end = entry.selectionEnd ?? start;

        domEvent.preventDefault();
        this.releaseRefusal(select);
        this.enterTyped(select, entry, splitTags(entry.value.slice(0, start) + text + entry.value.slice(end)), "");
    }

    /**
     * Makes chips of typed tags: each the option its words name, else its own text. One past `MaxSelected`, or one the field's rules
     * refuse, stays in the entry as typed and is said on the field's line; `rest` is what is still being typed after them.
     */
    private enterTyped(select: HTMLElement, entry: HTMLInputElement, texts: readonly string[], rest: string): void {
        const keys = parseChosenKeys(select.getAttribute(SelectedKeysAttribute));
        const max = parseMaxChosen(select.getAttribute(MaxAttribute));
        const tags = texts.map(text => ({ text, key: optionKeyNamed(select, text) ?? text }) satisfies TypedTag);
        const full: FieldMarkWords = { key: "ui.select.full", args: { max } };
        const entered = enterTags<FieldMarkWords>(keys, tags, max, full, (current, next) => this.validation?.entryRefusal(select, current, next) ?? null);

        if (entered.keys.length !== keys.length)
            this.writeChosen(select, entered.keys);

        entry.value = [...entered.refused, rest].filter(part => part.trim().length > 0).join(", ");

        if (entered.reason !== null && this.validation !== undefined) {
            this.validation.mark(select, "error", entered.reason);
            this.refusedEntries.add(select);
        }

        this.suggest(select, entry);
    }

    /** Takes the line a refused tag left off, once the reader edits what they typed. */
    private releaseRefusal(select: HTMLElement): void {
        if (this.refusedEntries.delete(select))
            this.validation?.mark(select, null);
    }

    /**
     * The options the entry's text names, as a search's own options are narrowed: the list opens over them as the reader types and
     * closes when the text names none — the text itself is then the tag. Nothing is marked, so Enter takes the text unless an arrow
     * picked a suggestion; a field whose Enter takes the first suggestion (`UITagEntry.FirstSuggestion`) marks it as it is typed.
     */
    private suggest(select: HTMLElement, entry: HTMLInputElement): void {
        narrowToTerm(entry);

        const typed = entry.value.trim().length > 0;
        const shown = typed ? optionsOf(select).filter(option => isShown(option) && !isItemDisabled(option)) : [];
        // The first suggestion not chosen already: Enter on a chosen one would take it out.
        const first = shown.find(option => option.getAttribute("aria-selected") !== "true") ?? null;

        if (this.openSelect === select) {
            if (shown.length > 0 || !typed)
                this.popups.reposition(select);
            else
                this.close();
        }
        else if (shown.length > 0) {
            this.toggle(select, true);
        }

        if (this.openSelect !== select || select.getAttribute(TagEntryAttribute) !== "first-suggestion")
            return;

        this.markActive(select, first);

        if (first !== null)
            scrollIntoList(select, first);
    }

    private get openSelect(): HTMLElement | null {
        return this.popups.current;
    }

    private sync(select: HTMLElement): void {
        if (isMultiple(select)) {
            this.syncMultiple(select);
            return;
        }

        const value = select.getAttribute(SelectValueAttribute);

        this.decorateOptions(select);

        const selectedOption = value === null
            ? null
            : optionsOf(select).find(option => option.getAttribute(ComponentKeyAttribute) === value) ?? null;

        const drawn = this.renderTriggerContent(select, selectedOption, value);
        const placeholder = select.querySelector<HTMLElement>(`.${PlaceholderClass}`);

        if (placeholder !== null)
            placeholder.style.display = drawn ? "none" : "";

        for (const option of optionsOf(select))
            option.setAttribute("aria-selected", value !== null && option.dataset.uiKey === value ? "true" : "false");

        // Cleared as well as set: a value taken off from outside must leave the value input too, or the next read brings it back.
        const valueInput = select.querySelector<HTMLInputElement>(`.${ValueInputClass}`);

        if (valueInput !== null && valueInput.value !== (value ?? ""))
            valueInput.value = value ?? "";

        // Last, because it reads the list this method has just finished putting in order.
        refreshEmptyState(select);
    }

    /** Draws a multi-select's value: its chips in chosen order, the chosen options checked, the rest refused once it is full. */
    private syncMultiple(select: HTMLElement): void {
        const keys = parseChosenKeys(select.getAttribute(SelectedKeysAttribute));
        const chosen = new Set(keys);
        const full = isChoiceFull(keys, parseMaxChosen(select.getAttribute(MaxAttribute)));

        this.decorateOptions(select, option => full && !chosen.has(option.dataset.uiKey ?? ""));

        const options = optionsOf(select);
        const byKey = new Map(options.map(option => [option.dataset.uiKey ?? "", option]));
        const entry = entryOf(select);
        // A key no option has is a tag the reader typed, where the field takes free text; anywhere else, nothing to show.
        const shown = entry === null ? keys.filter(key => byKey.has(key)) : keys;

        renderChips(select, shown.map(key => ({ key, label: chipLabel(byKey.get(key) ?? null, key) })));

        if (entry !== null && entry.readOnly !== isFixed(select))
            entry.readOnly = isFixed(select);

        const placeholder = select.querySelector<HTMLElement>(`.${PlaceholderClass}`);

        if (placeholder !== null)
            placeholder.style.display = shown.length > 0 ? "none" : "";

        for (const option of options)
            option.setAttribute("aria-selected", chosen.has(option.dataset.uiKey ?? "") ? "true" : "false");

        // The list the value binding reads, written as it stands: an empty field sends an empty list, not nothing.
        const valueInput = select.querySelector<HTMLInputElement>(`.${ValueInputClass}`);
        const text = JSON.stringify(keys);

        if (valueInput !== null && valueInput.getAttribute(SelectedKeysAttribute) !== text)
            valueInput.setAttribute(SelectedKeysAttribute, text);

        refreshEmptyState(select);
    }

    /**
     * The closed trigger shows the selected option through its item template, rebuilt from the popup unless the server drew this one;
     * answers whether it shows one. A search's list is the answer to its term, so a chosen option that answer leaves out stays drawn.
     */
    private renderTriggerContent(select: HTMLElement, option: HTMLElement | null, value: string | null): boolean {
        const trigger = select.querySelector<HTMLElement>(`.${TriggerClass}`);

        if (trigger === null)
            return option !== null;

        let content = trigger.querySelector<HTMLElement>(`:scope > .${TriggerContentClass}`);
        const serverKey = content?.getAttribute(ServerContentAttribute) ?? null;

        // Read once and taken off: from here on the drawing is the client's.
        if (content !== null && serverKey !== null) {
            content.removeAttribute(ServerContentAttribute);
            this.drawnKeys.set(select, serverKey);
        }

        if (option === null) {
            if (content !== null && value !== null && isSearch(select) && this.drawnKeys.get(select) === value)
                return true;

            content?.remove();
            this.drawnKeys.delete(select);
            return false;
        }

        const optionKey = option.getAttribute(ComponentKeyAttribute);

        if (optionKey === null)
            this.drawnKeys.delete(select);
        else
            this.drawnKeys.set(select, optionKey);

        if (content !== null && optionKey !== null && serverKey === optionKey)
            return true;

        if (content === null) {
            content = document.createElement("span");
            content.className = TriggerContentClass;

            // Before the placeholder and the chevron, but after the prefix icon, which is not part of the value.
            const prefixIcon = trigger.querySelector<HTMLElement>(`:scope > .${PrefixIconClass}`);

            if (prefixIcon === null)
                trigger.prepend(content);
            else
                prefixIcon.after(content);
        }

        content.style.display = "inline-flex";

        const clone = option.cloneNode(true) as HTMLElement;

        // Or the copy resolves as the same component as the option it was cloned from, and patches land on either.
        stripAddressingAttributes(clone);
        content.replaceChildren(...clone.childNodes);

        return true;
    }

    /** Gives each option its role, tab index and `aria-disabled`: disabled, or `refused` in a full multi-select. */
    private decorateOptions(select: HTMLElement, refused: (option: HTMLElement) => boolean = () => false): void {
        // The wrapper metadata carries no tab index and not always a role, so a client-built option gets them here.
        for (const option of optionsOf(select)) {
            if (!option.hasAttribute("role"))
                option.setAttribute("role", "option");

            const disabled = isItemDisabled(option);

            // Re-read on every sync, since `Enabled` is bound and moves; the arrows and the pointer pass a refused option.
            const flag = disabled || refused(option) ? "true" : "false";

            // Written only when it changes, so the observer above stays honest.
            if (option.getAttribute("aria-disabled") !== flag)
                option.setAttribute("aria-disabled", flag);

            // Out of the tab order until the roving index puts the one stop where it belongs; a disabled option never gets one.
            if (disabled ? option.tabIndex !== -1 : !option.hasAttribute("tabindex"))
                option.tabIndex = -1;
        }
    }

    /** The pointer moves the list's one current option, as a native list's does, so no second option is lit beside the keyboard's. */
    private handlePointerMove(domEvent: Event): void {
        const select = this.openSelect;
        const option = select === null || !(domEvent.target instanceof Element) ? null : domEvent.target.closest<HTMLElement>(`.${OptionClass}`);

        if (select === null || option === null || option.hasAttribute(ActiveAttribute) || isItemDisabled(option) || isInert(option) || option.closest(`.${SelectClass}`) !== select)
            return;

        // A search's field and a free-text entry keep the keyboard, and their options are no tab stops.
        if (typedFieldOf(select) === null) {
            applyRovingTabIndex(optionsOf(select).filter(candidate => !isItemDisabled(candidate)), option);
            focusByPointer(option);
        }

        this.markActive(select, option, true);
    }

    private handleClick(domEvent: Event): void {
        if (!(domEvent.target instanceof Element))
            return;

        // Before the trigger: the chip stands inside it, and taking one option out is no request to open the list.
        const remove = domEvent.target.closest<HTMLElement>(`.${ChipRemoveClass}`);

        if (remove !== null) {
            const removeSelect = remove.closest<HTMLElement>(`.${SelectClass}`);

            if (removeSelect !== null) {
                domEvent.preventDefault();
                domEvent.stopPropagation();

                if (!isFixed(removeSelect))
                    this.removeChosen(removeSelect, remove.closest<HTMLElement>(`.${ChipClass}`)?.getAttribute(ChipAttribute) ?? null);
            }

            return;
        }

        const clear = domEvent.target.closest<HTMLElement>(`[${ClearAttribute}]`);

        if (clear !== null) {
            const clearSelect = clear.closest<HTMLElement>(`.${SelectClass}`);

            if (clearSelect !== null) {
                domEvent.preventDefault();
                domEvent.stopPropagation();

                if (!isFixed(clearSelect)) {
                    this.clearValue(clearSelect);
                    keepFieldFocus(clearSelect);
                }
            }

            return;
        }

        const trigger = domEvent.target.closest<HTMLElement>(`.${TriggerClass}`);

        if (trigger !== null) {
            const select = trigger.closest<HTMLElement>(`.${SelectClass}`);

            // A read-only field keeps its text readable and offers no list.
            if (isFixed(select))
                return;

            domEvent.preventDefault();

            const entry = select === null ? null : entryOf(select);

            if (select !== null && entry !== null)
                this.pressEntryBox(select, entry, domEvent.target === entry);
            else
                this.toggle(select);

            return;
        }

        const option = domEvent.target.closest<HTMLElement>(`.${OptionClass}`);

        if (option === null)
            return;

        const select = option.closest<HTMLElement>(`.${SelectClass}`);

        if (select !== null)
            this.choose(select, option);
    }

    /**
     * A press on a free-text field: the keyboard goes to its entry, and the suggestions open — a press on the entry itself never closes
     * them, since it only puts the caret. A field with no options to suggest opens no list.
     */
    private pressEntryBox(select: HTMLElement, entry: HTMLInputElement, onEntry: boolean): void {
        if (document.activeElement !== entry)
            entry.focus();

        if (optionsOf(select).length === 0 || (onEntry && this.openSelect === select))
            return;

        this.toggle(select);
    }

    private handleKeydown(domEvent: Event): void {
        // A key composing a character is the input method's, Enter's confirming it included.
        if (!(domEvent instanceof KeyboardEvent) || domEvent.defaultPrevented || domEvent.isComposing)
            return;

        if (this.handleEntryKey(domEvent) || this.handleChipKey(domEvent))
            return;

        // Only a key inside the open select: the arrows of a field focus has since reached are that field's.
        if ((domEvent.key === "ArrowDown" || domEvent.key === "ArrowUp") && this.openSelect !== null && domEvent.target instanceof Node && this.openSelect.contains(domEvent.target)) {
            domEvent.preventDefault();
            this.moveCurrent(this.openSelect, domEvent.key === "ArrowDown" ? 1 : -1);
            return;
        }

        if ((domEvent.key === "ArrowDown" || domEvent.key === "ArrowUp") && this.handleClosedArrow(domEvent))
            return;

        if (this.handleTypeAhead(domEvent))
            return;

        if (this.handleMultipleTriggerKey(domEvent) || (domEvent.key !== "Enter" && domEvent.key !== " "))
            return;

        if (!(domEvent.target instanceof Element))
            return;

        const option = domEvent.target.closest<HTMLElement>(`.${OptionClass}`) ?? this.markedOption(domEvent);

        if (option === null)
            return;

        const select = option.closest<HTMLElement>(`.${SelectClass}`);

        if (select === null)
            return;

        domEvent.preventDefault();
        this.choose(select, option);
    }

    /**
     * A free-text entry's keys: Enter takes the suggestion an arrow marked, else makes chips of the text, and on an empty entry opens
     * or closes the suggestions, as the field's Enter does in a multi-select of options alone; a comma makes a chip of the text;
     * Backspace on an empty entry takes the last chip; ArrowLeft at the entry's start walks into the chips; the arrows move the
     * suggestions' mark, the focus staying in the entry.
     */
    private handleEntryKey(domEvent: KeyboardEvent): boolean {
        const target = entryTarget(domEvent);

        if (target === null)
            return false;

        const { entry, select } = target;

        if (isFixed(select))
            return false;

        switch (domEvent.key) {
            case "ArrowLeft":
                return entry.selectionStart === 0 && entry.selectionEnd === 0 && this.focusChip(domEvent, select, -1);
            case "ArrowDown":
            case "ArrowUp":
                domEvent.preventDefault();

                if (this.openSelect === select)
                    this.moveCurrent(select, domEvent.key === "ArrowDown" ? 1 : -1);
                else
                    this.openSuggestions(select, entry, domEvent.key === "ArrowDown");

                return true;
            case "Enter": {
                const marked = this.openSelect === select ? optionsOf(select).find(option => option.hasAttribute(ActiveAttribute) && isShown(option) && !isItemDisabled(option)) : undefined;

                if (marked !== undefined) {
                    domEvent.preventDefault();
                    this.choose(select, marked);
                    return true;
                }

                domEvent.preventDefault();

                if (entry.value.trim().length === 0) {
                    this.pressEntryBox(select, entry, false);
                    return true;
                }

                this.releaseRefusal(select);
                this.enterTyped(select, entry, splitTags(entry.value), "");
                return true;
            }
            case ",":
                domEvent.preventDefault();
                this.releaseRefusal(select);
                this.enterTyped(select, entry, splitTags(entry.value), "");
                return true;
            case "Backspace": {
                if (entry.value.length > 0)
                    return false;

                const chips = select.querySelectorAll<HTMLElement>(`.${ChipsClass} > .${ChipClass}`);

                if (chips.length === 0)
                    return false;

                domEvent.preventDefault();
                this.removeChosen(select, chips[chips.length - 1].getAttribute(ChipAttribute));
                return true;
            }
            default:
                return false;
        }
    }

    /**
     * Moves the keyboard one chip along from `from` — or, with none, onto the last chip from the field's control; past the last chip it
     * goes back to that control. Answers whether there was a chip to walk.
     */
    private focusChip(domEvent: KeyboardEvent, select: HTMLElement, step: -1 | 1, from: HTMLElement | null = null): boolean {
        const chips = chipsOf(select);

        if (chips.length === 0)
            return false;

        const index = from === null ? chips.length : chips.findIndex(chip => chip.contains(from));
        const target = chips[index + step]?.querySelector<HTMLElement>(`.${ChipRemoveClass}`) ?? (step === 1 ? controlOf(select) : null);

        domEvent.preventDefault();

        if (target === null)
            return true;

        target.focus();

        // Back in the entry, the caret stands at its start, where the walk left it.
        if (target instanceof HTMLInputElement)
            target.setSelectionRange(0, 0);

        return true;
    }

    /** An arrow on an entry whose suggestions are closed opens them, narrowed to its text, marked at the near end. */
    private openSuggestions(select: HTMLElement, entry: HTMLInputElement, down: boolean): void {
        narrowToTerm(entry);

        const shown = optionsOf(select).filter(option => isShown(option) && !isItemDisabled(option) && !isInert(option));
        const start = (down ? shown[0] : shown[shown.length - 1]) ?? null;

        if (start !== null)
            this.toggle(select, true, start);
    }

    /**
     * A chip's own keys, its remove button holding the focus: the arrows walk the chips and leave them for the field's control past the
     * last, and Backspace or Delete takes the chip out, the focus going on to the chip that takes its place.
     */
    private handleChipKey(domEvent: KeyboardEvent): boolean {
        const remove = domEvent.target instanceof HTMLElement && domEvent.target.classList.contains(ChipRemoveClass) ? domEvent.target : null;
        const select = remove?.closest<HTMLElement>(`.${SelectClass}`) ?? null;

        if (remove === null || select === null || !isMultiple(select))
            return false;

        switch (domEvent.key) {
            case "ArrowLeft":
                return this.focusChip(domEvent, select, -1, remove);
            case "ArrowRight":
                return this.focusChip(domEvent, select, 1, remove);
            case "Backspace":
            case "Delete": {
                domEvent.preventDefault();

                if (isFixed(select))
                    return true;

                const chips = chipsOf(select);
                const index = chips.findIndex(chip => chip.contains(remove));
                const neighbour = (chips[index + 1] ?? chips[index - 1])?.getAttribute(ChipAttribute) ?? null;

                this.removeChosen(select, chips[index]?.getAttribute(ChipAttribute) ?? null);

                const next = neighbour === null ? null : chipsOf(select).find(chip => chip.getAttribute(ChipAttribute) === neighbour) ?? null;

                if (next !== null)
                    next.querySelector<HTMLElement>(`.${ChipRemoveClass}`)?.focus();

                return true;
            }
            default:
                return false;
        }
    }

    /** An arrow on a closed field opens it on its chosen option, else at the near end: the first for ArrowDown, the last for ArrowUp. */
    private handleClosedArrow(domEvent: KeyboardEvent): boolean {
        const trigger = domEvent.target instanceof HTMLElement && domEvent.target.classList.contains(TriggerClass) ? domEvent.target : null;
        const select = trigger?.closest<HTMLElement>(`.${SelectClass}`) ?? null;

        if (select === null || select === this.openSelect || isFixed(select))
            return false;

        domEvent.preventDefault();

        // A search's list opens narrowed to the term its field kept, so it starts among the options that term leaves.
        const field = searchFieldOf(select);

        if (field !== null)
            narrowToTerm(field);

        const options = optionsOf(select).filter(option => isShown(option) && !isItemDisabled(option) && !isInert(option));
        const start = options.find(option => option.getAttribute("aria-selected") === "true") ?? (domEvent.key === "ArrowDown" ? options[0] : options[options.length - 1]) ?? null;

        this.toggle(select, false, start);
        return true;
    }

    /**
     * A character typed on a closed field or in an open list moves to the first option its prefix begins: a closed list opens on it,
     * as Enter opens one, and nothing is chosen until Enter. A closed search opens with the character as its term instead.
     */
    private handleTypeAhead(domEvent: KeyboardEvent): boolean {
        const character = typeAheadCharacter(domEvent);
        const target = domEvent.target instanceof HTMLElement ? domEvent.target : null;

        // The field or an option itself, not a control drawn inside an option's template, which takes its own keys.
        if (character === null || target === null || !(target.classList.contains(TriggerClass) || target.classList.contains(OptionClass)))
            return false;

        const select = target.closest<HTMLElement>(`.${SelectClass}`);
        const open = select !== null && select === this.openSelect;

        if (select === null || isFixed(select) || (!open && !target.classList.contains(TriggerClass)))
            return false;

        const field = searchFieldOf(select);

        // An open search's keys are its field's, which holds the keyboard.
        if (field !== null) {
            if (open)
                return false;

            domEvent.preventDefault();
            this.typeIntoSearch(select, field, character);
            return true;
        }

        // Taken whether or not it matches, as a native list takes it: a page's bare-key shortcut is not the field's prefix.
        domEvent.preventDefault();

        // Read off the options, not their layout: a closed list's options have none.
        const options = optionsOf(select).filter(option => !isItemDisabled(option) && !isInert(option));
        const current = open
            ? options.find(option => option === document.activeElement) ?? options.find(option => option.hasAttribute(ActiveAttribute)) ?? null
            : options.find(option => option.getAttribute("aria-selected") === "true") ?? null;
        const match = this.typeAhead.next({ owner: select, character, entries: options, current, words: option => optionLabel(option) ?? "", context: select });

        if (match === null)
            return true;

        if (!open) {
            this.toggle(select, false, match);
            return true;
        }

        applyRovingTabIndex(optionsOf(select).filter(option => !isItemDisabled(option)), match);
        scrollIntoList(select, match);
        focusAsLastInput(match);
        this.markActive(select, match);
        return true;
    }

    /** Opens a search with what was typed on its closed field as the whole term: the old one is replaced, as typing into it would. */
    private typeIntoSearch(select: HTMLElement, field: HTMLInputElement, character: string): void {
        this.toggle(select, true);

        if (this.openSelect !== select)
            return;

        // The keyboard's opening has put the focus in the field; the search engine hears the term as it hears any typing.
        field.value = character;
        field.setSelectionRange(character.length, character.length);
        field.dispatchEvent(new Event("input", { bubbles: true }));
    }

    /** A multi-select's field, a focusable box rather than a button: Enter and Space open it, Backspace takes the last chip. */
    private handleMultipleTriggerKey(domEvent: KeyboardEvent): boolean {
        const trigger = domEvent.target instanceof HTMLElement && domEvent.target.classList.contains(TriggerClass) ? domEvent.target : null;
        const select = trigger?.closest<HTMLElement>(`.${SelectClass}`) ?? null;

        if (select === null || !isMultiple(select) || isFixed(select))
            return false;

        switch (domEvent.key) {
            case "Enter":
            case " ":
                domEvent.preventDefault();
                this.toggle(select);
                return true;
            case "ArrowLeft":
                return this.focusChip(domEvent, select, -1);
            case "Backspace": {
                const chips = select.querySelectorAll<HTMLElement>(`.${ChipsClass} > .${ChipClass}`);

                if (chips.length === 0)
                    return false;

                domEvent.preventDefault();
                this.removeChosen(select, chips[chips.length - 1].getAttribute(ChipAttribute));
                return true;
            }
            default:
                return false;
        }
    }

    /** The marked option Enter chooses from a search's field, which keeps the focus; Space there is a character, never a choice. */
    private markedOption(domEvent: KeyboardEvent): HTMLElement | null {
        const select = this.openSelect;

        if (domEvent.key !== "Enter" || select === null || !(domEvent.target instanceof HTMLInputElement) || !domEvent.target.classList.contains(SearchInputClass) || !select.contains(domEvent.target))
            return null;

        return optionsOf(select).find(option => option.hasAttribute(ActiveAttribute) && !isItemDisabled(option) && option.style.display !== "none") ?? null;
    }

    /**
     * `typing`: the list opens on a keystroke a search's field is about to take as its whole term, so the term it kept narrows
     * nothing and no option is current. `start`: the option a typed prefix or an arrow opens the list on, in place of its chosen one.
     */
    private toggle(select: HTMLElement | null, typing = false, start: HTMLElement | null = null): void {
        if (select === null)
            return;

        if (this.openSelect === select) {
            this.close();
            return;
        }

        this.close();

        const field = typedFieldOf(select);
        const entry = entryOf(select);

        // The list answers what the field says: a search's kept term, an entry's text, narrows it again, as typing it did.
        if (field !== null && !typing)
            narrowToTerm(field);

        refreshEmptyState(select);

        const trigger = select.querySelector<HTMLElement>(`.${TriggerClass}`);
        const popup = select.querySelector<HTMLElement>(`.${PopupClass}`);
        const list = select.querySelector<HTMLElement>(`.${ListClass}`) ?? popup;
        const token = select.getAttribute(SelectPlacementAttribute);

        if (trigger === null || popup === null || list === null)
            return;

        // What the trigger and a search's field say about the list they open: which list it is; the popups say whether it is open.
        const listId = ensureElementId(list, "ui-select-list");

        // An entry stands for the box: the box itself is no control then.
        if (entry === null)
            trigger.setAttribute("aria-controls", listId);

        field?.setAttribute("aria-controls", listId);

        const opened = this.popups.open({
            owner: select,
            popup,
            anchor: trigger,
            placement: { placement: token !== null && isAnchoredPopupPlacement(token) ? token : "bottom-start", minAnchorWidth: true },
            // Read as "open" only while it is: a package's editor waits on an open opener before a key is its own.
            openers: entry !== null ? [entry] : field === null ? [trigger] : [trigger, field],
            returnFocus: () => entry ?? trigger
        });

        if (!opened)
            return;

        if (field === null) {
            this.initializeFocus(select, start);
            return;
        }

        if (entry === null)
            this.initializeSearch(select, field, start, typing);
        else
            this.initializeEntry(select, start);

        holdHeightAbove(popup);
    }

    private close(): void {
        this.popups.close();
    }

    private initializeFocus(select: HTMLElement, start: HTMLElement | null): void {
        const options = optionsOf(select).filter(option => !isItemDisabled(option));

        if (options.length === 0)
            return;

        const selected = start ?? options.find(option => option.getAttribute("aria-selected") === "true");

        // Opened by a press on a list with no value: no option current until an arrow, which enters at the near end. The trigger
        // keeps the keyboard (a press on some systems does not focus it).
        if (selected === undefined && isPointerLast()) {
            applyRovingTabIndex(options, null);
            this.markActive(select, null);
            keepFieldFocus(select);
            return;
        }

        const target = selected ?? options[0];

        applyRovingTabIndex(options, target);

        // Opened by a press, the mark is the pointer's, and stays unlit until the pointer reaches it: the keyboard has not moved yet.
        this.markActive(select, target, isPointerLast());
        // A capped list opens on its chosen option, as a native select does; the focus below scrolls nothing, so the page stays put.
        scrollIntoList(select, target);
        focusAsLastInput(target);
    }

    /**
     * A search opens with the keyboard in its field and the kept term selected, so typing replaces it — but not after a finger's
     * tap, which leaves the focus on the closed field rather than raise the on-screen keyboard unasked. Current is its chosen option,
     * else, opened by a key, the first the term leaves; the arrows move that mark, never the focus, so no option is a tab stop and
     * Tab leaves the field for what follows the search.
     */
    private initializeSearch(select: HTMLElement, field: HTMLInputElement, start: HTMLElement | null, typing: boolean): void {
        const options = optionsOf(select);
        const shown = options.filter(option => isShown(option) && !isItemDisabled(option));
        const chosen = typing ? undefined : start ?? shown.find(option => option.getAttribute("aria-selected") === "true");
        const target = chosen ?? (typing || isPointerLast() ? null : shown[0] ?? null);

        applyRovingTabIndex(options, null);
        this.markActive(select, target, isPointerLast());

        if (target !== null)
            scrollIntoList(select, target);

        if (isTouchLast())
            return;

        focusAsLastInput(field);
        field.select();
    }

    /**
     * A free-text entry's suggestions open with the keyboard left in the entry: the arrows move their mark, and only an arrow that
     * opened them starts one — typing leaves none, so Enter takes the text unless the reader picked a suggestion.
     */
    private initializeEntry(select: HTMLElement, start: HTMLElement | null): void {
        applyRovingTabIndex(optionsOf(select), null);
        this.markActive(select, start);

        if (start !== null)
            scrollIntoList(select, start);
    }

    // Only what can be chosen, and without the wrap: a list has a top and a bottom.
    private moveCurrent(select: HTMLElement, direction: 1 | -1): void {
        const options = optionsOf(select).filter(option => !isItemDisabled(option));

        // Focus first, then the mark: a search keeps the focus in its field, so only the mark knows where the list's cursor is.
        const focused = options.find(option => option === document.activeElement);
        const current = focused ?? options.find(option => option.hasAttribute(ActiveAttribute)) ?? null;

        const next = resolveRovingTarget({
            key: direction === 1 ? "ArrowDown" : "ArrowUp",
            items: options,
            current,
            axis: "vertical",
            loop: false
        });

        if (next === null)
            return;

        // A search's field or an entry keeps the keyboard, so its list is scrolled to the mark here, as the focus scrolls a select's.
        if (typedFieldOf(select) !== null) {
            scrollIntoList(select, next);
        }
        else {
            applyRovingTabIndex(options, next);
            next.focus();
        }

        this.markActive(select, next);
    }

    /** Marks the option Enter would choose, where the arrows or the pointer put it; `pointer` when the pointer did. */
    private markActive(select: HTMLElement, active: HTMLElement | null, pointer = false): void {
        for (const option of optionsOf(select)) {
            if (option === active)
                option.setAttribute(ActiveAttribute, "");
            else if (option.hasAttribute(ActiveAttribute))
                option.removeAttribute(ActiveAttribute);

            markPointerFocus(option, option === active && pointer);
        }

        // The option a screen reader reads as current while a search's field or an entry keeps the keyboard.
        const field = typedFieldOf(select);

        if (field === null)
            return;

        if (active === null)
            field.removeAttribute("aria-activedescendant");
        else
            field.setAttribute("aria-activedescendant", ensureElementId(active, "ui-select-option"));
    }

    private choose(select: HTMLElement, option: HTMLElement): void {
        const key = option.dataset.uiKey;

        // Both the click and the keyboard come through here, so this refuses everywhere, a list left open on a read-only field too.
        if (key === undefined || isItemDisabled(option) || isFixed(select))
            return;

        // A multi-select toggles the option and keeps the list open for the next one.
        if (isMultiple(select)) {
            const next = toggleChosenKey(parseChosenKeys(select.getAttribute(SelectedKeysAttribute)), key, parseMaxChosen(select.getAttribute(MaxAttribute)));

            this.markActive(select, option, isPointerLast());

            if (next !== null)
                this.writeChosen(select, next);

            // A suggestion taken stands for what was typed to find it: the entry starts again, the whole list before it.
            const entry = entryOf(select);

            if (entry !== null && entry.value.length > 0) {
                entry.value = "";
                this.releaseRefusal(select);
                this.suggest(select, entry);
            }

            return;
        }

        // Choosing the value already selected is not a change.
        if (select.getAttribute(SelectValueAttribute) === key) {
            this.close();
            return;
        }

        select.setAttribute(SelectValueAttribute, key);
        this.sync(select);

        const valueInput = select.querySelector<HTMLInputElement>(`.${ValueInputClass}`);

        if (valueInput !== null) {
            valueInput.value = key;
            valueInput.dispatchEvent(new Event("change", { bubbles: true }));
        }

        this.close();
    }

    /** One chip's option taken out; the keyboard's place moves back to the field when it was on the chip's own button. */
    private removeChosen(select: HTMLElement, key: string | null): void {
        const next = key === null ? null : removeChosenKey(parseChosenKeys(select.getAttribute(SelectedKeysAttribute)), key);

        if (next === null)
            return;

        const focusWasOnChip = document.activeElement instanceof HTMLElement && document.activeElement.closest(`.${ChipClass}`) !== null;

        this.writeChosen(select, next);

        if (focusWasOnChip || document.activeElement === document.body)
            controlOf(select)?.focus();
    }

    /** A multi-select's new value: on the root, drawn, and sent through the value input as any field's change is. */
    private writeChosen(select: HTMLElement, keys: readonly string[]): void {
        if (keys.length === 0)
            select.removeAttribute(SelectedKeysAttribute);
        else
            select.setAttribute(SelectedKeysAttribute, JSON.stringify(keys));

        this.sync(select);

        // The field may have grown or lost a line of chips under an open list.
        this.popups.reposition(select);

        select.querySelector<HTMLInputElement>(`.${ValueInputClass}`)?.dispatchEvent(new Event("change", { bubbles: true }));
    }

    private clearValue(select: HTMLElement): void {
        if (isMultiple(select)) {
            if (select.hasAttribute(SelectedKeysAttribute))
                this.writeChosen(select, []);

            return;
        }

        // Nothing was selected, so there is nothing to clear.
        if (!select.hasAttribute(SelectValueAttribute))
            return;

        select.removeAttribute(SelectValueAttribute);
        this.sync(select);

        const valueInput = select.querySelector<HTMLInputElement>(`.${ValueInputClass}`);

        if (valueInput !== null) {
            valueInput.value = "";
            valueInput.dispatchEvent(new Event("change", { bubbles: true }));
        }
    }
}

/** Keeps the keyboard in a field after its clear, or a list's opening by a press, so it never falls to the page's body. */
function keepFieldFocus(select: HTMLElement): void {
    const trigger = select.querySelector<HTMLElement>(`.${TriggerClass}`);
    const target = controlOf(select);

    if (trigger !== null && target !== null && !trigger.contains(document.activeElement))
        focusAsLastInput(target);
}

/** Whether an option stands in its list: not left out by a search's term or by the list's own filter. */
function isShown(option: HTMLElement): boolean {
    return option.style.display !== "none" && !option.classList.contains(HiddenClass);
}

/** Scrolls a select's list, and nothing around it, so the option stands whole inside the list's edge and padding. */
function scrollIntoList(select: HTMLElement, option: HTMLElement): void {
    const list = select.querySelector<HTMLElement>(`.${ListClass}`);

    if (list === null)
        return;

    const box = list.getBoundingClientRect();
    const own = option.getBoundingClientRect();
    const style = getComputedStyle(list);
    // The scrolling box starts inside the edge; its padding is room the option should clear.
    const inside = box.top + (Number.parseFloat(style.borderTopWidth) || 0);
    const top = inside + (Number.parseFloat(style.paddingTop) || 0);
    const bottom = inside + list.clientHeight - (Number.parseFloat(style.paddingBottom) || 0);

    if (own.top < top)
        list.scrollTop -= top - own.top;
    else if (own.bottom > bottom)
        list.scrollTop += own.bottom - bottom;
}

/** A multi-select's chips, in the order they stand. */
function chipsOf(select: HTMLElement): HTMLElement[] {
    return [...select.querySelectorAll<HTMLElement>(`.${ChipsClass} > .${ChipClass}`)];
}

/** A press on a free-text field's box but not on its entry: the keyboard stays in the entry rather than leaving it for the box. */
function isBoxAroundEntry(target: Element): boolean {
    const select = target.closest(`.${TriggerClass}`)?.closest<HTMLElement>(`.${SelectClass}`) ?? null;

    return select !== null && entryOf(select) !== null && !target.classList.contains(EntryClass);
}

/** The key of the option a typed tag names by its words or its key, case aside; null where it names none. */
function optionKeyNamed(select: HTMLElement, text: string): string | null {
    const wanted = text.trim().toLocaleLowerCase();

    for (const option of optionsOf(select)) {
        const key = option.dataset.uiKey;

        if (key !== undefined && !isItemDisabled(option) && (key.toLocaleLowerCase() === wanted || optionLabel(option)?.trim().toLocaleLowerCase() === wanted))
            return key;
    }

    return null;
}

/** What a chip says: the option's words as a field shows them, or its key where the option shows none. */
function chipLabel(option: HTMLElement | null, key: string): string {
    const label = optionLabel(option)?.trim() ?? "";

    return label.length > 0 ? label : key;
}

/** Draws a multi-select's chips before the placeholder, rebuilt only when the chosen options or their words changed. */
function renderChips(select: HTMLElement, chips: readonly { readonly key: string; readonly label: string }[]): void {
    const host = select.querySelector<HTMLElement>(`.${ChipsClass}`);

    if (host === null)
        return;

    const existing = [...host.querySelectorAll<HTMLElement>(`:scope > .${ChipClass}`)];
    const unchanged = existing.length === chips.length && existing.every((chip, index) =>
        chip.getAttribute(ChipAttribute) === chips[index].key && chip.querySelector(`.${ChipLabelClass}`)?.textContent === chips[index].label
    );

    // Only on a change, so the chips the server drew stay.
    if (unchanged)
        return;

    for (const chip of existing)
        chip.remove();

    host.prepend(...chips.map(chip => createChip(chip.key, chip.label)));
}

function createChip(key: string, label: string): HTMLElement {
    const chip = document.createElement("span");
    const text = document.createElement("span");
    const remove = document.createElement("button");

    chip.className = ChipClass;
    chip.setAttribute(ChipAttribute, key);

    text.className = ChipLabelClass;
    text.textContent = label;

    remove.className = ChipRemoveClass;
    remove.type = "button";
    // As the server draws it: Backspace and the list reach every chip without a tab stop per chip.
    remove.tabIndex = -1;
    clientStrings.write(remove, "aria-label", "ui.select.remove", { label });

    chip.append(text, remove);
    return chip;
}

/** Adds the selects a record calls to be synced: one arriving whole, one whose value moved, one whose popup changed. */
function collectMutatedSelects(mutation: MutationRecord, selects: Set<HTMLElement>): void {
    // A select arriving whole (a row the client built) had its value written before it joined, so no attribute record comes for it.
    if (mutation.type === "childList") {
        for (const added of mutation.addedNodes) {
            if (!(added instanceof HTMLElement))
                continue;

            if (added.classList.contains(SelectClass))
                selects.add(added);

            for (const select of added.querySelectorAll<HTMLElement>(`.${SelectClass}`))
                selects.add(select);
        }
    }

    if (mutation.type === "attributes" && (mutation.attributeName === SelectValueAttribute || mutation.attributeName === SelectedKeysAttribute || mutation.attributeName === MaxAttribute)) {
        if (mutation.target instanceof HTMLElement && mutation.target.classList.contains(SelectClass))
            selects.add(mutation.target);

        return;
    }

    const target = mutation.target instanceof HTMLElement ? mutation.target : mutation.target.parentElement;
    const select = target?.closest(`.${PopupClass}`)?.closest<HTMLElement>(`.${SelectClass}`);

    if (select !== null && select !== undefined)
        selects.add(select);
}

/**
 * A search's list standing above its field keeps the height it opened at: it grows from its foot, so a list narrowed by every
 * keystroke would pull the search field at its top down and up. Below its field the list may shrink, the field staying put.
 */
function holdHeightAbove(popup: HTMLElement): void {
    if (popup.dataset.uiPlacement?.startsWith("top") === true)
        popup.style.minHeight = `${popup.offsetHeight}px`;
}
