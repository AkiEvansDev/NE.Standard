import {
    ActiveAttribute, BadgeSelectClass, ComponentKeyAttribute, ensureElementId, ListTriggerClass as TriggerClass,
    MultiSelectChipClass, MultiSelectChipRemoveClass, MultiSelectChipsClass, SearchInputClass, SelectActionClass, SelectChipAttribute,
    SelectClass, SelectClearAttribute, SelectedKeysAttribute, SelectFreeTextAttribute, SelectListClass,
    SelectListIdPrefix, SelectMaxAttribute, SelectOpenClass, SelectOptionClass, SelectPlacementAttribute,
    SelectPopupClass, SelectTagEntryAttribute, SelectValueAttribute, SelectValueInputClass
} from "../addressing/dom-attributes.ts";
import { isAnchoredPopupPlacement } from "./anchored-popup.ts";
import { isCaretField } from "./caret-fields.ts";
import { dropWaiting } from "./debounced-commit-engine.ts";
import { isInert, isItemDisabled } from "./interactive-state.ts";
import { isComposing, isPlainKey } from "./keyboard-shortcut.ts";
import { enterTags, holdsTagSeparator, parseChosenKeys, parseMaxChosen, removeChosenKey, splitTags, takeTypedTags, toggleChosenKey } from "./multi-select-keys.ts";
import type { TypedTag } from "./multi-select-keys.ts";
import { OwnedPopups } from "./owned-popup.ts";
import { focusAsLastInput, focusByPointer, isPointerLast } from "./popup-focus.ts";
import { isPressWaveRecord } from "./press-wave.ts";
import { applyRovingTabIndex } from "./roving-focus.ts";
import { narrowToTerm, needsManualSearch, refreshEmptyState } from "./search-input-engine.ts";
import {
    BadgeOptionAttributes, candidateOptions, collectMutatedSelects, controlOf, currentOption, entryOf, entryTarget,
    focusChip, handleChipNavigationKey, holdHeightAbove, initializeEntryPopup, initializePopupFocus,
    initializeSearchPopup, isBoxAroundEntry, isDisabledOptionKey, isFixed, isMultiple, keepFieldFocus, markActiveOption, markListKeyboard,
    moveCurrentOption, ObservedAttributes, OptionAttributes, optionKeyNamed, optionLabel, optionsOf,
    resetSearchField, resolveClearKeySelect, resolveClosedArrowStart, scrollIntoList, searchFieldOf, syncMultipleSelect, syncSingleSelect,
    typedFieldOf
} from "./select-dom.ts";
import { TypeAhead, typeAheadCharacter } from "./type-ahead.ts";
import { trackInnerPointer } from "./surface-press-engine.ts";
import type { EntryValidation, FieldMarkWords, FieldValidation } from "./validation-engine.ts";
import { registerRuntimeCleanup } from "../runtime/cleanup-scope.ts";

// The keys that move an open list's current option.
const ListKeys = new Set(["ArrowDown", "ArrowUp", "Home", "End", "PageDown", "PageUp"]);

export type SelectInteractionEngineOptions = {
    readonly root?: ParentNode;
    /** Where a free-text entry asks the field's rules about a tag, and says on its line why one was refused. */
    readonly validation?: FieldValidation & EntryValidation;
};

export class SelectInteractionEngine {
    private readonly root: ParentNode;

    // Closing takes the mark off the list; the focus goes back to the trigger.
    private readonly popups = new OwnedPopups({
        show: ({ owner }) => owner.classList.add(SelectOpenClass),
        hide: ({ owner }) => {
            owner.classList.remove(SelectOpenClass);
            markActiveOption(owner, null);
            const popup = owner.querySelector<HTMLElement>(`.${SelectPopupClass}`);

            if (popup !== null)
                popup.style.minHeight = "";
        },
        closesOnTab: true,
        // Not a search's or a free-text entry's list: the on-screen keyboard is up while it shows, and the field stays in sight.
        sheetOnPhone: ({ owner }) => typedFieldOf(owner) === null
    });

    private readonly typeAhead = new TypeAhead();
    private readonly drawnKeys = new WeakMap<HTMLElement, string>();
    private readonly validation: (FieldValidation & EntryValidation) | undefined;
    private readonly refusedEntries = new WeakSet<HTMLElement>();
    private readonly optionWatch: MutationObserver | null;
    private readonly watched = new WeakSet<HTMLElement>();

    public constructor(options: SelectInteractionEngineOptions = {}) {
        this.root = options.root ?? document;
        this.validation = options.validation;

        const answer = (mutations: MutationRecord[]): void => {
            const selects = new Set<HTMLElement>();

            for (const mutation of mutations) {
                if (!isPressWaveRecord(mutation))
                    collectMutatedSelects(mutation, selects);
            }

            for (const select of selects)
                this.sync(select);
        };

        this.optionWatch = this.root instanceof Node ? new MutationObserver(answer) : null;
        registerRuntimeCleanup(() => this.optionWatch?.disconnect());

        if (this.root instanceof Node)
            new MutationObserver(answer).observe(this.root, { attributes: true, attributeFilter: ObservedAttributes, childList: true, subtree: true });

        for (const select of this.root.querySelectorAll<HTMLElement>(`.${SelectClass}`))
            this.sync(select);

        this.root.addEventListener("click", domEvent => this.handleClick(domEvent), true);
        this.root.addEventListener("keydown", domEvent => this.handleKeydown(domEvent), true);
        this.root.addEventListener("pointermove", domEvent => this.handlePointerMove(domEvent), true);
        this.root.addEventListener("input", domEvent => this.handleSearchEdit(domEvent), true);

        this.root.addEventListener("mousedown", domEvent => {
            if (domEvent.target instanceof Element && (domEvent.target.closest(`[${SelectClearAttribute}], .${MultiSelectChipRemoveClass}`) !== null || isBoxAroundEntry(domEvent.target)))
                domEvent.preventDefault();
        }, true);

        // Hovering an action, a clear or a chip's remove inside the trigger is that control's hover, not the chevron's.
        trackInnerPointer(this.root, ["hover"], target => {
            const inner = target.closest(`.${SelectActionClass}, [${SelectClearAttribute}], .${MultiSelectChipRemoveClass}`);
            const trigger = inner?.closest(`.${TriggerClass}`) ?? null;

            return trigger === null ? [] : [trigger];
        });

        window.addEventListener("input", domEvent => this.handleEntryEdit(domEvent), true);
        window.addEventListener("compositionend", domEvent => this.handleEntryEdit(domEvent), true);
        window.addEventListener("change", domEvent => this.holdEntryDraft(domEvent), true);
        window.addEventListener("keydown", domEvent => this.handleEntryEscape(domEvent), true);
        this.root.addEventListener("paste", domEvent => this.handleEntryPaste(domEvent), true);
    }

    private handleSearchEdit(domEvent: Event): void {
        if ((domEvent as InputEvent).isComposing === true || !(domEvent.target instanceof HTMLInputElement) || !domEvent.target.classList.contains(SearchInputClass))
            return;

        const search = domEvent.target.closest<HTMLElement>(`.${SelectClass}[${SelectFreeTextAttribute}]`);

        if (search !== null && this.openSelect === search)
            markActiveOption(search, null);
    }

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

    private holdEntryDraft(domEvent: Event): { entry: HTMLInputElement; select: HTMLElement } | null {
        const target = entryTarget(domEvent);

        if (target === null || (this.root instanceof Node && !this.root.contains(target.select)))
            return null;

        domEvent.stopImmediatePropagation();
        return target;
    }

    private handleEntryEscape(domEvent: Event): void {
        if (!(domEvent instanceof KeyboardEvent) || domEvent.key !== "Escape" || domEvent.defaultPrevented || isComposing(domEvent))
            return;

        if (domEvent.target instanceof HTMLInputElement && domEvent.target.classList.contains(SearchInputClass)) {
            const search = domEvent.target.closest<HTMLElement>(`.${SelectClass}[${SelectFreeTextAttribute}]`);

            if (search !== null && this.openSelect === search && optionsOf(search).some(option => option.hasAttribute(ActiveAttribute))) {
                domEvent.preventDefault();
                markActiveOption(search, null);
            }

            return;
        }

        const target = entryTarget(domEvent);

        if (target === null || this.openSelect !== target.select || target.select.getAttribute(SelectTagEntryAttribute) !== "first-suggestion" || !optionsOf(target.select).some(option => option.hasAttribute(ActiveAttribute)))
            return;

        domEvent.preventDefault();
        markActiveOption(target.select, null);
    }

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

    private enterTyped(select: HTMLElement, entry: HTMLInputElement, texts: readonly string[], rest: string): void {
        const keys = parseChosenKeys(select.getAttribute(SelectedKeysAttribute));
        const max = parseMaxChosen(select.getAttribute(SelectMaxAttribute));
        const disabledRefused: string[] = [];
        const tags: TypedTag[] = [];

        for (const text of texts) {
            const key = optionKeyNamed(select, text) ?? text;

            if (!keys.includes(key) && isDisabledOptionKey(select, key))
                disabledRefused.push(text);
            else
                tags.push({ text, key });
        }

        const full: FieldMarkWords = { key: "ui.select.full", args: { max } };
        const entered = enterTags<FieldMarkWords>(keys, tags, max, full, (current, next) => this.validation?.entryRefusal(select, current, next) ?? null);

        if (entered.keys.length !== keys.length)
            this.writeChosen(select, entered.keys);

        entry.value = [...disabledRefused, ...entered.refused, rest].filter(part => part.trim().length > 0).join(", ");

        if (entered.reason !== null && this.validation !== undefined) {
            this.validation.mark(select, "error", entered.reason);
            this.refusedEntries.add(select);
        }

        this.suggest(select, entry);
    }

    private releaseRefusal(select: HTMLElement): void {
        if (this.refusedEntries.delete(select))
            this.validation?.mark(select, null);
    }

    private suggest(select: HTMLElement, entry: HTMLInputElement): void {
        narrowToTerm(entry);

        const typed = entry.value.trim().length > 0;
        const shown = typed ? candidateOptions(select) : [];
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

        if (this.openSelect !== select || select.getAttribute(SelectTagEntryAttribute) !== "first-suggestion")
            return;

        markActiveOption(select, first);

        if (first !== null)
            scrollIntoList(select, first);
    }

    private get openSelect(): HTMLElement | null {
        return this.popups.current;
    }

    private sync(select: HTMLElement): void {
        this.watchOptions(select);
        markListKeyboard(select);

        if (isMultiple(select))
            syncMultipleSelect(select);
        else
            syncSingleSelect(select, this.drawnKeys);
    }

    private watchOptions(select: HTMLElement): void {
        if (this.optionWatch === null || this.watched.has(select))
            return;

        this.watched.add(select);
        const attributeFilter = select.classList.contains(BadgeSelectClass) ? BadgeOptionAttributes : OptionAttributes;

        this.optionWatch.observe(select, { attributes: true, attributeFilter, characterData: true, subtree: true });
    }

    private handlePointerMove(domEvent: Event): void {
        const select = this.openSelect;
        const option = select === null || !(domEvent.target instanceof Element) ? null : domEvent.target.closest<HTMLElement>(`.${SelectOptionClass}`);

        if (select === null || option === null || option.hasAttribute(ActiveAttribute) || isItemDisabled(option) || isInert(option) || option.closest(`.${SelectClass}`) !== select)
            return;

        if (typedFieldOf(select) === null) {
            applyRovingTabIndex(optionsOf(select).filter(candidate => !isItemDisabled(candidate)), option);
            focusByPointer(option);
        }

        markActiveOption(select, option, true);
    }

    private handleClick(domEvent: Event): void {
        if (!(domEvent.target instanceof Element))
            return;

        const remove = domEvent.target.closest<HTMLElement>(`.${MultiSelectChipRemoveClass}`);

        if (remove !== null) {
            const removeSelect = remove.closest<HTMLElement>(`.${SelectClass}`);

            if (removeSelect !== null) {
                domEvent.preventDefault();
                domEvent.stopPropagation();

                if (!isFixed(removeSelect))
                    this.removeChosen(removeSelect, remove.closest<HTMLElement>(`.${MultiSelectChipClass}`)?.getAttribute(SelectChipAttribute) ?? null);
            }

            return;
        }

        const clear = domEvent.target.closest<HTMLElement>(`[${SelectClearAttribute}]`);

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

        if (domEvent.target.closest(`.${SelectActionClass}`) !== null)
            return;

        const trigger = domEvent.target.closest<HTMLElement>(`.${TriggerClass}`);

        if (trigger !== null) {
            const select = trigger.closest<HTMLElement>(`.${SelectClass}`);

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

        const option = domEvent.target.closest<HTMLElement>(`.${SelectOptionClass}`);

        if (option === null)
            return;

        const select = option.closest<HTMLElement>(`.${SelectClass}`);

        if (select !== null)
            this.choose(select, option);
    }

    private pressEntryBox(select: HTMLElement, entry: HTMLInputElement, onEntry: boolean): void {
        if (document.activeElement !== entry)
            entry.focus();

        if (optionsOf(select).length === 0 || (onEntry && this.openSelect === select))
            return;

        this.toggle(select);
    }

    private handleKeydown(domEvent: Event): void {
        if (!(domEvent instanceof KeyboardEvent) || domEvent.defaultPrevented || isComposing(domEvent))
            return;

        if (domEvent.target instanceof Element && domEvent.target.closest(`.${SelectActionClass}`) !== null)
            return;

        if (domEvent.key === "Escape") {
            this.handleEntryEscape(domEvent);

            if (domEvent.defaultPrevented)
                return;
        }

        if (this.openSelect !== null)
            markListKeyboard(this.openSelect);

        if (this.handleEntryKey(domEvent) || handleChipNavigationKey(domEvent, (select, key) => this.removeChosen(select, key)))
            return;

        if (this.openSelect !== null && domEvent.target instanceof Node && this.openSelect.contains(domEvent.target) && this.handleOpenListKey(domEvent, this.openSelect))
            return;

        const clearSelect = resolveClearKeySelect(domEvent, this.openSelect);

        if (clearSelect !== null) {
            domEvent.preventDefault();
            this.clearValue(clearSelect);
            return;
        }

        if ((domEvent.key === "ArrowDown" || domEvent.key === "ArrowUp") && isPlainKey(domEvent, { alt: domEvent.key === "ArrowDown" })) {
            const arrow = resolveClosedArrowStart(domEvent, this.openSelect);

            if (arrow !== null) {
                domEvent.preventDefault();
                this.toggle(arrow.select, false, arrow.start);
                return;
            }
        }

        if (this.handleTypeAhead(domEvent))
            return;

        if (this.handleTriggerKey(domEvent) || (domEvent.key !== "Enter" && domEvent.key !== " "))
            return;

        if (!(domEvent.target instanceof Element))
            return;

        const option = domEvent.target.closest<HTMLElement>(`.${SelectOptionClass}`) ?? this.markedOption(domEvent);

        if (option === null) {
            this.commitSearchFreeText(domEvent);
            return;
        }

        const select = option.closest<HTMLElement>(`.${SelectClass}`);

        if (select === null)
            return;

        domEvent.preventDefault();
        this.choose(select, option);
    }

    private commitSearchFreeText(domEvent: KeyboardEvent): boolean {
        const select = this.openSelect;
        const field = domEvent.target instanceof HTMLInputElement && domEvent.target.classList.contains(SearchInputClass) ? domEvent.target : null;

        if (domEvent.key !== "Enter" || select === null || field === null || !select.hasAttribute(SelectFreeTextAttribute) || !select.contains(field) || isFixed(select) || needsManualSearch(field))
            return false;

        domEvent.preventDefault();
        dropWaiting(field);
        field.dispatchEvent(new Event("change", { bubbles: true }));

        const text = field.value.trim();

        if (text.length === 0) {
            this.close();
            return true;
        }

        const resolved = optionKeyNamed(select, text) ?? text;

        if (isDisabledOptionKey(select, resolved))
            return true;

        this.writeSingleValue(select, resolved);
        return true;
    }

    private handleOpenListKey(domEvent: KeyboardEvent, select: HTMLElement): boolean {
        if (domEvent.key === "ArrowUp" && domEvent.altKey && isPlainKey(domEvent, { alt: true })) {
            domEvent.preventDefault();

            const current = currentOption(select);

            if (current !== null && !isMultiple(select))
                this.choose(select, current);
            else
                this.close();

            return true;
        }

        if (!ListKeys.has(domEvent.key) || !isPlainKey(domEvent) || ((domEvent.key === "Home" || domEvent.key === "End") && isCaretField(domEvent.target)))
            return false;

        domEvent.preventDefault();
        moveCurrentOption(select, domEvent.key);
        return true;
    }

    private handleEntryKey(domEvent: KeyboardEvent): boolean {
        const target = entryTarget(domEvent);

        if (target === null)
            return false;

        const { entry, select } = target;

        if (isFixed(select))
            return false;

        switch (domEvent.key) {
            case "ArrowLeft":
                return entry.selectionStart === 0 && entry.selectionEnd === 0 && focusChip(domEvent, select, -1);
            case "ArrowDown":
            case "ArrowUp":
                domEvent.preventDefault();

                if (this.openSelect === select) {
                    moveCurrentOption(select, domEvent.key);
                }
                else {
                    narrowToTerm(entry);
                    const shown = candidateOptions(select);
                    const start = (domEvent.key === "ArrowDown" ? shown[0] : shown[shown.length - 1]) ?? null;

                    if (start !== null)
                        this.toggle(select, true, start);
                }

                return true;
            case "Enter": {
                const marked = this.openSelect === select ? candidateOptions(select).find(option => option.hasAttribute(ActiveAttribute)) : undefined;

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

                const chips = select.querySelectorAll<HTMLElement>(`.${MultiSelectChipsClass} > .${MultiSelectChipClass}`);

                if (chips.length === 0)
                    return false;

                domEvent.preventDefault();
                this.removeChosen(select, chips[chips.length - 1].getAttribute(SelectChipAttribute));
                return true;
            }
            default:
                return false;
        }
    }

    private handleTypeAhead(domEvent: KeyboardEvent): boolean {
        const character = typeAheadCharacter(domEvent);
        const target = domEvent.target instanceof HTMLElement ? domEvent.target : null;

        if (character === null || target === null || !(target.classList.contains(TriggerClass) || target.classList.contains(SelectOptionClass)))
            return false;

        const select = target.closest<HTMLElement>(`.${SelectClass}`);
        const open = select !== null && select === this.openSelect;

        if (select === null || isFixed(select) || (!open && !target.classList.contains(TriggerClass)))
            return false;

        const field = searchFieldOf(select);

        if (field !== null) {
            if (open)
                return false;

            domEvent.preventDefault();
            this.typeIntoSearch(select, field, character);
            return true;
        }

        domEvent.preventDefault();

        const options = candidateOptions(select);
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
        markActiveOption(select, match);
        return true;
    }

    private typeIntoSearch(select: HTMLElement, field: HTMLInputElement, character: string): void {
        this.toggle(select, true);

        if (this.openSelect !== select)
            return;

        field.value = character;
        field.setSelectionRange(character.length, character.length);
        field.dispatchEvent(new Event("input", { bubbles: true }));
    }

    private handleTriggerKey(domEvent: KeyboardEvent): boolean {
        const trigger = domEvent.target instanceof HTMLElement && domEvent.target.classList.contains(TriggerClass) ? domEvent.target : null;
        const select = trigger?.closest<HTMLElement>(`.${SelectClass}`) ?? null;

        if (select === null || isFixed(select))
            return false;

        if (domEvent.key === "Enter" || domEvent.key === " ") {
            domEvent.preventDefault();
            this.toggle(select);
            return true;
        }

        if (!isMultiple(select))
            return false;

        switch (domEvent.key) {
            case "ArrowLeft":
                return focusChip(domEvent, select, -1);
            case "Backspace": {
                const chips = select.querySelectorAll<HTMLElement>(`.${MultiSelectChipsClass} > .${MultiSelectChipClass}`);

                if (chips.length === 0)
                    return false;

                domEvent.preventDefault();
                this.removeChosen(select, chips[chips.length - 1].getAttribute(SelectChipAttribute));
                return true;
            }
            default:
                return false;
        }
    }

    private markedOption(domEvent: KeyboardEvent): HTMLElement | null {
        const select = this.openSelect;

        if (domEvent.key !== "Enter" || select === null || !(domEvent.target instanceof HTMLInputElement) || !domEvent.target.classList.contains(SearchInputClass) || !select.contains(domEvent.target))
            return null;

        return candidateOptions(select).find(option => option.hasAttribute(ActiveAttribute)) ?? null;
    }

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

        if (field !== null && !typing)
            narrowToTerm(field);

        refreshEmptyState(select);

        const trigger = select.querySelector<HTMLElement>(`.${TriggerClass}`);
        const popup = select.querySelector<HTMLElement>(`.${SelectPopupClass}`);
        const list = select.querySelector<HTMLElement>(`.${SelectListClass}`) ?? popup;
        const token = select.getAttribute(SelectPlacementAttribute);

        if (trigger === null || popup === null || list === null)
            return;

        const listId = ensureElementId(list, SelectListIdPrefix);

        if (entry === null)
            trigger.setAttribute("aria-controls", listId);

        field?.setAttribute("aria-controls", listId);

        const opened = this.popups.open({
            owner: select,
            popup,
            anchor: trigger,
            placement: { placement: token !== null && isAnchoredPopupPlacement(token) ? token : "bottom-start", minAnchorWidth: true },
            openers: entry !== null ? [entry] : field === null ? [trigger] : [trigger, field],
            namedBy: entry ?? trigger,
            namedPart: list,
            returnFocus: () => entry ?? trigger
        });

        if (!opened)
            return;

        if (field === null) {
            initializePopupFocus(select, start);
            return;
        }

        if (entry === null)
            initializeSearchPopup(select, field, start, typing);
        else
            initializeEntryPopup(select, start);

        holdHeightAbove(popup);
    }

    private close(): void {
        this.popups.close();
    }

    private choose(select: HTMLElement, option: HTMLElement): void {
        const key = option.getAttribute(ComponentKeyAttribute);

        if (key === null || isItemDisabled(option) || isFixed(select))
            return;

        if (isMultiple(select)) {
            const next = toggleChosenKey(parseChosenKeys(select.getAttribute(SelectedKeysAttribute)), key, parseMaxChosen(select.getAttribute(SelectMaxAttribute)));

            markActiveOption(select, option, isPointerLast());

            if (next !== null)
                this.writeChosen(select, next);

            const entry = entryOf(select);

            if (entry !== null && entry.value.length > 0) {
                entry.value = "";
                this.releaseRefusal(select);
                this.suggest(select, entry);
            }

            return;
        }

        this.writeSingleValue(select, key);
    }

    private writeSingleValue(select: HTMLElement, key: string): void {
        if (select.getAttribute(SelectValueAttribute) === key) {
            this.close();
            return;
        }

        select.setAttribute(SelectValueAttribute, key);
        this.sync(select);

        const valueInput = select.querySelector<HTMLInputElement>(`.${SelectValueInputClass}`);

        if (valueInput !== null) {
            valueInput.value = key;
            valueInput.dispatchEvent(new Event("change", { bubbles: true }));
        }

        this.close();
    }

    private removeChosen(select: HTMLElement, key: string | null): void {
        const next = key === null ? null : removeChosenKey(parseChosenKeys(select.getAttribute(SelectedKeysAttribute)), key);

        if (next === null)
            return;

        const focusWasOnChip = document.activeElement instanceof HTMLElement && document.activeElement.closest(`.${MultiSelectChipClass}`) !== null;

        this.writeChosen(select, next);

        if (focusWasOnChip || document.activeElement === document.body)
            controlOf(select)?.focus();
    }

    private writeChosen(select: HTMLElement, keys: readonly string[]): void {
        if (keys.length === 0)
            select.removeAttribute(SelectedKeysAttribute);
        else
            select.setAttribute(SelectedKeysAttribute, JSON.stringify(keys));

        this.sync(select);
        this.popups.reposition(select);
        select.querySelector<HTMLInputElement>(`.${SelectValueInputClass}`)?.dispatchEvent(new Event("change", { bubbles: true }));
    }

    private clearValue(select: HTMLElement): void {
        if (isMultiple(select)) {
            if (select.hasAttribute(SelectedKeysAttribute))
                this.writeChosen(select, []);

            return;
        }

        if (!select.hasAttribute(SelectValueAttribute))
            return;

        select.removeAttribute(SelectValueAttribute);
        this.sync(select);

        const valueInput = select.querySelector<HTMLInputElement>(`.${SelectValueInputClass}`);

        if (valueInput !== null) {
            valueInput.value = "";
            valueInput.dispatchEvent(new Event("change", { bubbles: true }));
        }

        resetSearchField(select, true);
    }
}
