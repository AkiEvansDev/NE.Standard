import {
    BindingAttributePrefix, ComponentContextAttribute, ComponentIdAttribute, ComponentKeyAttribute, ComponentParameterCountAttribute,
    ensureElementId, ListTriggerClass as TriggerClass, SelectClass, SelectedKeysAttribute
} from "../addressing/dom-attributes.ts";
import { clientStrings } from "../runtime/client-strings.ts";
import { isAnchoredPopupPlacement } from "./anchored-popup.ts";
import { isChoiceFull, parseChosenKeys, parseMaxChosen, removeChosenKey, toggleChosenKey } from "./multi-select-keys.ts";
import { OwnedPopups } from "./owned-popup.ts";
import { ownDescendants } from "./own-descendants.ts";
import { isInert, isItemDisabled, isReadOnly } from "./interactive-state.ts";
import { focusAsLastInput, focusByPointer, isPointerLast, markPointerFocus } from "./popup-focus.ts";
import { applyRovingTabIndex, resolveRovingTarget } from "./roving-focus.ts";
import { clearOptionsFilter, refreshEmptyState } from "./search-input-engine.ts";
import { TypeAhead, typeAheadCharacter } from "./type-ahead.ts";

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
const OptionClass = "ui-select__option";
const ValueInputClass = "ui-select__value-input";
const ClearAttribute = "data-ui-select-clear";
const TriggerModeAttribute = "data-ui-select-trigger-mode";
const SearchInputClass = "ui-search__input";
// The one selection mode that writes the chosen option into the field; the other keeps whatever the reader typed.
const ReplaceModeClass = "ui-search-mode--replace";
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

const PopupGap = 4;

export type SelectInteractionEngineOptions = {
    readonly root?: ParentNode;
};

// Never an attribute this engine writes itself: answering its own writes is a loop and a sync on every scroll frame.
const ObservedAttributes = [SelectValueAttribute, SelectedKeysAttribute, MaxAttribute, "class", ComponentKeyAttribute, "placeholder"];

/** A read-only select, search or multi-select keeps its field focusable and readable, and offers no list and no change. */
function isFixed(select: HTMLElement | null): boolean {
    return select === null || isReadOnly(select) || isInert(select);
}

function isMultiple(select: HTMLElement): boolean {
    return select.classList.contains(MultiClass);
}

/** A search's trigger is its own text field, which keeps the focus while the list is open. */
function isSearch(select: HTMLElement): boolean {
    return select.querySelector<HTMLElement>(`.${TriggerClass}`)?.getAttribute(TriggerModeAttribute) === "input";
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
        }
    });

    // The value each select was last synced at, so the search's filter is spent only when the value itself moves.
    private readonly syncedValues = new WeakMap<HTMLElement, string | null>();

    private readonly typeAhead = new TypeAhead();

    // A Replace search the pointer's press focused, whose label that press's click selects.
    private pressFocusedSearch: HTMLInputElement | null = null;

    public constructor(options: SelectInteractionEngineOptions = {}) {
        this.root = options.root ?? document;

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
        // Typing is asking to search, and asking to search is asking to see the answers.
        this.root.addEventListener("input", domEvent => this.handleSearchInput(domEvent), true);
        this.root.addEventListener("focusin", domEvent => this.handleSearchFocus(domEvent), true);
        this.root.addEventListener("pointermove", domEvent => this.handlePointerMove(domEvent), true);

        // The clear and a chip's remove take no focus on their press: both vanish, and the focus would fall to the page's body.
        this.root.addEventListener("mousedown", domEvent => {
            if (domEvent.target instanceof Element && domEvent.target.closest(`[${ClearAttribute}], .${ChipRemoveClass}`) !== null)
                domEvent.preventDefault();
        }, true);
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

        const matched = selectedOption !== null;
        const matchedLabel = optionLabel(selectedOption);

        this.renderTriggerContent(select, selectedOption);

        // Search's label goes into its input only in Replace mode, or a value arriving would wipe a term just typed; a focused empty field holds none.
        const searchInput = select.querySelector<HTMLInputElement>(`.${SearchInputClass}`);

        if (searchInput !== null) {
            const focused = document.activeElement === searchInput;

            // An empty hint rather than none: the stylesheet reads a Keep field's "no term" off `:placeholder-shown`, which needs one.
            if (!searchInput.hasAttribute("placeholder"))
                searchInput.setAttribute("placeholder", "");

            if (select.classList.contains(ReplaceModeClass) && (!focused || searchInput.value.length === 0)) {
                searchInput.value = matchedLabel ?? "";

                if (focused)
                    searchInput.select();
            }

            // The query is spent only when the value moves: a sync for anything else must leave the reader's narrowing standing.
            if (this.syncedValues.has(select) && this.syncedValues.get(select) !== value)
                clearOptionsFilter(select);
        }

        this.syncedValues.set(select, value);

        const placeholder = select.querySelector<HTMLElement>(`.${PlaceholderClass}`);

        if (placeholder !== null)
            placeholder.style.display = matched ? "none" : "";

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
        const shown = keys.filter(key => byKey.has(key));

        renderChips(select, shown.map(key => ({ key, label: chipLabel(byKey.get(key) ?? null, key) })));

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

    // The closed trigger shows the selected option through its item template, rebuilt from the popup unless the server drew this one.
    private renderTriggerContent(select: HTMLElement, option: HTMLElement | null): void {
        const trigger = select.querySelector<HTMLElement>(`.${TriggerClass}`);

        if (trigger === null)
            return;

        let content = trigger.querySelector<HTMLElement>(`:scope > .${TriggerContentClass}`);

        if (option === null) {
            content?.remove();
            return;
        }

        const optionKey = option.getAttribute(ComponentKeyAttribute);

        if (content !== null && optionKey !== null && content.getAttribute(ServerContentAttribute) === optionKey) {
            content.removeAttribute(ServerContentAttribute);
            return;
        }

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

    private handleSearchInput(domEvent: Event): void {
        if (!(domEvent.target instanceof HTMLElement) || !domEvent.target.classList.contains(SearchInputClass))
            return;

        const select = domEvent.target.closest<HTMLElement>(`.${SelectClass}`);

        if (select === null || select === this.openSelect)
            return;

        this.toggle(select, true);
    }

    /** The pointer moves the list's one current option, as a native list's does, so no second option is lit beside the keyboard's. */
    private handlePointerMove(domEvent: Event): void {
        const select = this.openSelect;
        const option = select === null || !(domEvent.target instanceof Element) ? null : domEvent.target.closest<HTMLElement>(`.${OptionClass}`);

        if (select === null || option === null || option.hasAttribute(ActiveAttribute) || isItemDisabled(option) || isInert(option) || option.closest(`.${SelectClass}`) !== select)
            return;

        applyRovingTabIndex(optionsOf(select).filter(candidate => !isItemDisabled(candidate)), option);

        if (!isSearch(select))
            focusByPointer(option);

        this.markActive(select, option, true);
    }

    /** A Replace search reached by the keyboard writes its chosen text into the field, selected, so typing replaces it at once. */
    private handleSearchFocus(domEvent: Event): void {
        if (!(domEvent.target instanceof HTMLInputElement) || !domEvent.target.classList.contains(SearchInputClass))
            return;

        const input = domEvent.target;
        const select = input.closest<HTMLElement>(`.${SelectClass}`);

        this.pressFocusedSearch = null;

        if (select === null || select === this.openSelect || input.readOnly || !select.classList.contains(ReplaceModeClass))
            return;

        const value = select.getAttribute(SelectValueAttribute);

        if (value === null)
            return;

        // The label rather than whatever query was last typed and left: a term nobody chose from is spent when the field is left.
        input.value = optionLabel(optionsOf(select).find(option => option.getAttribute(ComponentKeyAttribute) === value) ?? null) ?? input.value;
        input.select();

        if (isPointerLast())
            this.pressFocusedSearch = input;
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

            // Search's trigger is a real text field: with the popup open, a click in it places the caret.
            if (trigger.getAttribute(TriggerModeAttribute) === "input" && domEvent.target instanceof HTMLInputElement && select === this.openSelect)
                return;

            // A Replace search the press brought the focus to — on the press, or by the opening — has its caret, not its label selected.
            const field = select?.classList.contains(ReplaceModeClass) === true ? trigger.querySelector<HTMLInputElement>(`.${SearchInputClass}`) : null;
            const arrived = field !== null && (field === this.pressFocusedSearch || document.activeElement !== field);

            this.pressFocusedSearch = null;
            domEvent.preventDefault();
            this.toggle(select);

            // Typing would append to the label; a selection the press dragged stands.
            if (arrived && select === this.openSelect && document.activeElement === field && field.selectionStart === field.selectionEnd)
                field.select();

            return;
        }

        const option = domEvent.target.closest<HTMLElement>(`.${OptionClass}`);

        if (option === null)
            return;

        const select = option.closest<HTMLElement>(`.${SelectClass}`);

        if (select !== null)
            this.choose(select, option);
    }

    private handleKeydown(domEvent: Event): void {
        if (!(domEvent instanceof KeyboardEvent) || domEvent.defaultPrevented)
            return;

        // Only a key inside the open select: the arrows of a field focus has since reached are that field's.
        if ((domEvent.key === "ArrowDown" || domEvent.key === "ArrowUp") && this.openSelect !== null && domEvent.target instanceof Node && this.openSelect.contains(domEvent.target)) {
            domEvent.preventDefault();
            this.moveFocus(this.openSelect, domEvent.key === "ArrowDown" ? 1 : -1);
            return;
        }

        if ((domEvent.key === "ArrowDown" || domEvent.key === "ArrowUp") && this.handleClosedArrow(domEvent))
            return;

        if (this.handleTypeAhead(domEvent))
            return;

        if (domEvent.isComposing || this.handleMultipleTriggerKey(domEvent) || (domEvent.key !== "Enter" && domEvent.key !== " "))
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

    /** An arrow on a closed field opens it on its chosen option, else at the near end: the first for ArrowDown, the last for ArrowUp. */
    private handleClosedArrow(domEvent: KeyboardEvent): boolean {
        const trigger = domEvent.target instanceof HTMLElement && domEvent.target.classList.contains(TriggerClass) ? domEvent.target : null;
        const select = trigger?.closest<HTMLElement>(`.${SelectClass}`) ?? null;

        // A search's field keeps its arrows: its caret is a text field's.
        if (select === null || select === this.openSelect || isFixed(select) || isSearch(select))
            return false;

        domEvent.preventDefault();

        const options = optionsOf(select).filter(option => !isItemDisabled(option) && !isInert(option));
        const start = options.find(option => option.getAttribute("aria-selected") === "true") ?? (domEvent.key === "ArrowDown" ? options[0] : options[options.length - 1]) ?? null;

        this.toggle(select, false, start);
        return true;
    }

    /**
     * A character typed on a closed field or in an open list moves to the first option its prefix begins: a closed list opens on it,
     * as Enter opens one, and nothing is chosen until Enter. A search's field takes the characters as its term instead.
     */
    private handleTypeAhead(domEvent: KeyboardEvent): boolean {
        const character = typeAheadCharacter(domEvent);
        const target = domEvent.target instanceof HTMLElement ? domEvent.target : null;

        // The field or an option itself, not a control drawn inside an option's template, which takes its own keys.
        if (character === null || target === null || !(target.classList.contains(TriggerClass) || target.classList.contains(OptionClass)))
            return false;

        const select = target.closest<HTMLElement>(`.${SelectClass}`);
        const open = select !== null && select === this.openSelect;

        if (select === null || isFixed(select) || isSearch(select) || (!open && !target.classList.contains(TriggerClass)))
            return false;

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
     * `typing`: the list opens on a keystroke whose query the search engine is about to apply, so no old filter is taken off.
     * `start`: the option a typed prefix opens the list on, in place of its chosen one.
     */
    private toggle(select: HTMLElement | null, typing = false, start: HTMLElement | null = null): void {
        if (select === null)
            return;

        if (this.openSelect === select) {
            this.close();
            return;
        }

        this.close();

        // A list opened by a press shows every option: a query left in the field from before chose nothing.
        if (!typing) {
            clearOptionsFilter(select);
            refreshEmptyState(select);
        }

        const trigger = select.querySelector<HTMLElement>(`.${TriggerClass}`);
        const popup = select.querySelector<HTMLElement>(`.${PopupClass}`);
        const token = select.getAttribute(SelectPlacementAttribute);

        if (trigger === null || popup === null)
            return;

        // What the trigger says about the list it opens: which list it is; the popups say whether it is open.
        trigger.setAttribute("aria-controls", ensureElementId(popup, "ui-select-popup"));

        // A search's focus goes back to its field on close: its trigger is a row that takes no focus.
        const returnTarget = isSearch(select) ? select.querySelector<HTMLElement>(`.${SearchInputClass}`) ?? trigger : trigger;
        const opened = this.popups.open({
            owner: select,
            popup,
            anchor: trigger,
            placement: { placement: token !== null && isAnchoredPopupPlacement(token) ? token : "bottom-start", gap: PopupGap, minAnchorWidth: true },
            openers: [trigger],
            returnFocus: () => returnTarget
        });

        if (opened)
            this.initializeFocus(select, start);
    }

    private close(): void {
        this.popups.close();
    }

    private initializeFocus(select: HTMLElement, start: HTMLElement | null): void {
        const options = optionsOf(select).filter(option => !isItemDisabled(option));

        if (options.length === 0)
            return;

        const selected = start ?? options.find(option => option.getAttribute("aria-selected") === "true");

        // Opened by a press on a list with no value: no option current until an arrow, which enters at the near end. The field
        // keeps the keyboard — a search's input, else the trigger (which a press on some systems does not focus).
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

        // Search keeps focus in its field: the roving tab stop above still lets ArrowDown step into the list.
        if (isSearch(select)) {
            const input = select.querySelector<HTMLInputElement>(`.${SearchInputClass}`);

            if (input !== null && document.activeElement !== input)
                input.focus();

            return;
        }

        focusAsLastInput(target);
    }

    // Only what can be chosen, and without the wrap: a list has a top and a bottom.
    private moveFocus(select: HTMLElement, direction: 1 | -1): void {
        const options = optionsOf(select).filter(option => !isItemDisabled(option));

        // Focus first, then the mark: Search keeps focus in its field, so only the mark knows where the list's cursor is.
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

        applyRovingTabIndex(options, next);

        next.focus();
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
            select.querySelector<HTMLElement>(`.${TriggerClass}`)?.focus();
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

/** Keeps the keyboard with a field after its clear — a search's input, else the trigger — so it never falls to the page's body. */
function keepFieldFocus(select: HTMLElement): void {
    const target = select.querySelector<HTMLElement>(isSearch(select) ? `.${SearchInputClass}` : `.${TriggerClass}`);

    if (target !== null && !target.contains(document.activeElement))
        focusAsLastInput(target);
}

/** Scrolls a select's list, and nothing around it, so the option stands whole inside the list's edge and padding. */
function scrollIntoList(select: HTMLElement, option: HTMLElement): void {
    const list = select.querySelector<HTMLElement>(`.${PopupClass}`);

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

    // A search's hint taken off (a bound Placeholder emptied): its sync puts the empty one back.
    if (mutation.type === "attributes" && mutation.attributeName === "placeholder") {
        const search = mutation.target instanceof HTMLElement && mutation.target.classList.contains(SearchInputClass) ? mutation.target.closest<HTMLElement>(`.${SelectClass}`) : null;

        if (search !== null)
            selects.add(search);

        return;
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
