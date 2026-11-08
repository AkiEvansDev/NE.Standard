// DOM queries, option decoration, trigger cloning, popup focus initialization, and multi-select chip rendering for `SelectInteractionEngine`.

// `.ts` on the value imports, and types imported as types: `node --test` loads this module as it is.
import {
    ActiveAttribute, BadgeClass, BadgeIconAttribute, BadgeIconClass, BadgeSelectClass, BadgeSetAttribute, BadgeTitleAttribute,
    BadgeTitleClass, BadgeVariantInfoClass, BindingAttributePrefix, ClearableAttribute, ComponentContextAttribute,
    ComponentIdAttribute, ComponentKeyAttribute, ComponentParameterCountAttribute, ensureElementId, HiddenClass,
    IconClass, InputAffixIconPrefixClass, ListKeyboardAttribute, ListTriggerClass as TriggerClass,
    MultiSelectButtonClass, MultiSelectChipClass, MultiSelectChipLabelClass, MultiSelectChipRemoveClass, MultiSelectChipsClass,
    MultiSelectClass, MultiSelectEntryClass, PointerFocusAttribute, PopupPlacementAttribute, SearchClass,
    SearchInputClass, SelectActionClass, SelectChipAttribute, SelectChipsAttribute, SelectClass, SelectContentAttribute,
    SelectedKeysAttribute, SelectFreeTextAttribute, SelectListClass, SelectMaxAttribute, SelectOpenClass, SelectOptionClass,
    SelectOptionIdPrefix, SelectPlaceholderClass, SelectPopupClass, SelectTriggerContentClass, SelectValueAttribute,
    SelectValueInputClass, SplitButtonMainClass, TextBadgeClass, TextBadgeTitleAttribute, TextTypeOverlineClass, ValueBindingAttribute
} from "../addressing/dom-attributes.ts";
import { clientStrings } from "../rendering/client-strings.ts";
import { writeBadgeCount, writeBadgeWords } from "../rendering/web-dom-converters.ts";
import { isInert, isItemDisabled, isReadOnly } from "./interactive-state.ts";
import { isPlainKey } from "./keyboard-shortcut.ts";
import { isChoiceFull, parseChosenKeys, parseMaxChosen } from "./multi-select-keys.ts";
import { ownDescendants } from "./own-descendants.ts";
import { focusAsLastInput, isPointerLast, isTouchLast, markPointerFocus } from "./popup-focus.ts";
import { removePressWaves } from "./press-wave.ts";
import { applyRovingTabIndex, moveRovingFocus } from "./roving-focus.ts";
import { resolveRowTarget } from "./row-cursor.ts";
import { clearAskedTerm, narrowToTerm, refreshEmptyState } from "./search-input-engine.ts";
import { entryWords } from "./search-terms.ts";

// What BadgeRenderer.RenderBadge falls back to for an item that says nothing: an Info style, an overline's words.
const BlankBadgeClasses = `${BadgeVariantInfoClass} ${TextTypeOverlineClass}`;

export const ObservedAttributes = [SelectValueAttribute, SelectedKeysAttribute, SelectMaxAttribute];
export const OptionAttributes = ["class", ComponentKeyAttribute];
// The multi-select's badges variant copies its options' badges into its chips, a badge's colour patched inline: a badge's variant is
// heard there too, and only a badge's, since the engine writes an option's own (a narrowed list hides by it).
export const BadgeOptionAttributes = [...OptionAttributes, "style"];

export const SelectHostSelector = `.${SelectClass}, .${MultiSelectButtonClass}`;
export const SelectTriggerSelector = `.${TriggerClass}, .${MultiSelectButtonClass} > .${SplitButtonMainClass}`;

function isSelectHost(element: Element): boolean {
    return element.classList.contains(SelectClass) || element.classList.contains(MultiSelectButtonClass);
}

export function isSelectTrigger(element: Element): boolean {
    return element.classList.contains(TriggerClass) || (element.classList.contains(SplitButtonMainClass) && element.parentElement?.classList.contains(MultiSelectButtonClass) === true);
}

export function triggerOf(select: HTMLElement): HTMLElement | null {
    return select.querySelector<HTMLElement>(SelectTriggerSelector);
}

/** A read-only select, search or multi-select keeps its field focusable and readable, and offers no list and no change. */
export function isFixed(select: HTMLElement | null): boolean {
    return select === null || isReadOnly(select) || isInert(select);
}

export function isMultiple(select: HTMLElement): boolean {
    return select.classList.contains(MultiSelectClass);
}

function isSearch(select: HTMLElement): boolean {
    return select.classList.contains(SearchClass);
}

/** A search's text field, at the top of its list: before the options in the markup, so never one drawn inside an option. */
export function searchFieldOf(select: HTMLElement): HTMLInputElement | null {
    return isSearch(select) ? select.querySelector<HTMLInputElement>(`.${SearchInputClass}`) : null;
}

/** A free-text multi-select's entry, in its own field's box: never one drawn inside an option. */
export function entryOf(select: HTMLElement): HTMLInputElement | null {
    return select.hasAttribute(SelectFreeTextAttribute) ? select.querySelector<HTMLInputElement>(`:scope > .${TriggerClass} .${MultiSelectEntryClass}`) : null;
}

/** The text field that holds the keyboard while the list is open — a search's, a free-text entry — whose list's mark is an attribute. */
export function typedFieldOf(select: HTMLElement): HTMLInputElement | null {
    return searchFieldOf(select) ?? entryOf(select);
}

/** Where the field's keyboard stands when it is closed: a free-text entry, else the trigger. */
export function controlOf(select: HTMLElement): HTMLElement | null {
    return entryOf(select) ?? triggerOf(select);
}

/** The free-text entry an event happened in and its multi-select, or null for any other target. */
export function entryTarget(domEvent: Event): { entry: HTMLInputElement; select: HTMLElement } | null {
    const entry = domEvent.target instanceof HTMLInputElement && domEvent.target.classList.contains(MultiSelectEntryClass) ? domEvent.target : null;
    const select = entry?.closest<HTMLElement>(`.${SelectClass}`) ?? null;

    return entry === null || select === null ? null : { entry, select };
}

/** This select's own options: a select rendered inside an option's template keeps its list to itself. */
export function optionsOf(select: HTMLElement): HTMLElement[] {
    return ownDescendants(select, `.${SelectPopupClass} .${SelectOptionClass}`, SelectHostSelector);
}

/** The open list's current option: the focused one, else — a search keeps the focus in its field — the marked one. */
export function currentOption(select: HTMLElement): HTMLElement | null {
    const options = optionsOf(select).filter(option => !isItemDisabled(option));

    return options.find(option => option === document.activeElement) ?? options.find(option => option.hasAttribute(ActiveAttribute)) ?? null;
}

/** Marks each of the select's lists whose current option is the keyboard's, not the pointer's; written only when it changes. */
export function markListKeyboard(select: HTMLElement): void {
    for (const list of ownDescendants(select, `.${SelectListClass}`, SelectHostSelector)) {
        const keyboard = list.querySelector(`:scope > .${SelectOptionClass}[${ActiveAttribute}]:not([${PointerFocusAttribute}])`) !== null;

        if (list.hasAttribute(ListKeyboardAttribute) !== keyboard)
            list.toggleAttribute(ListKeyboardAttribute, keyboard);
    }
}

/** Marks the option Enter would choose, where the arrows or the pointer put it; `pointer` when the pointer did. */
export function markActiveOption(select: HTMLElement, active: HTMLElement | null, pointer = false): void {
    for (const option of optionsOf(select)) {
        if (option === active)
            option.setAttribute(ActiveAttribute, "");
        else if (option.hasAttribute(ActiveAttribute))
            option.removeAttribute(ActiveAttribute);

        markPointerFocus(option, option === active && pointer);
    }

    markListKeyboard(select);

    // The option a screen reader reads as current while a search's field or an entry keeps the keyboard.
    const field = typedFieldOf(select);

    if (field === null)
        return;

    if (active === null)
        field.removeAttribute("aria-activedescendant");
    else
        field.setAttribute("aria-activedescendant", ensureElementId(active, SelectOptionIdPrefix));
}

export function initializePopupFocus(select: HTMLElement, start: HTMLElement | null): void {
    const options = candidateOptions(select);

    if (options.length === 0)
        return;

    const selected = start ?? options.find(option => option.getAttribute("aria-selected") === "true");

    // Opened by a press on a list with no value: no option current until an arrow, which enters at the near end. The trigger
    // keeps the keyboard (a press on some systems does not focus it).
    if (selected === undefined && isPointerLast()) {
        applyRovingTabIndex(options, null);
        markActiveOption(select, null);
        keepFieldFocus(select);
        return;
    }

    const target = selected ?? options[0];

    applyRovingTabIndex(options, target);
    markActiveOption(select, target, isPointerLast());
    scrollIntoList(select, target);
    focusAsLastInput(target);
}

/**
 * A search opens with the keyboard in its field and the kept term selected, so typing replaces it — but not after a finger's
 * tap, which leaves the focus on the closed field rather than raise the on-screen keyboard unasked. Current is its chosen option,
 * else, opened by a key, the first the term leaves; the arrows move that mark, never the focus, so no option is a tab stop and
 * Tab leaves the field for what follows the search.
 */
export function initializeSearchPopup(select: HTMLElement, field: HTMLInputElement, start: HTMLElement | null, typing: boolean): void {
    const options = optionsOf(select);
    const shown = candidateOptions(select);
    const freeText = select.hasAttribute(SelectFreeTextAttribute);
    const value = select.getAttribute(SelectValueAttribute);

    if (freeText && !typing && field.value.length === 0 && value !== null && value.length > 0 && !options.some(option => option.getAttribute(ComponentKeyAttribute) === value))
        field.value = value;

    const chosen = typing ? undefined : start ?? shown.find(option => option.getAttribute("aria-selected") === "true");
    const target = chosen ?? (typing || freeText || isPointerLast() ? null : shown[0] ?? null);

    applyRovingTabIndex(options, null);
    markActiveOption(select, target, isPointerLast());

    if (target !== null)
        scrollIntoList(select, target);

    if (isTouchLast())
        return;

    focusAsLastInput(field);
    field.select();
}

export function initializeEntryPopup(select: HTMLElement, start: HTMLElement | null): void {
    applyRovingTabIndex(optionsOf(select), null);
    markActiveOption(select, start);

    if (start !== null)
        scrollIntoList(select, start);
}

// Only what can be chosen, and without the wrap: a list has a top and a bottom. A page key moves by the list's height, as a row's.
export function moveCurrentOption(select: HTMLElement, key: string): void {
    const options = optionsOf(select).filter(option => !isItemDisabled(option));
    const next = resolveRowTarget(key, options, currentOption(select), "vertical");

    if (next === null)
        return;

    if (typedFieldOf(select) !== null)
        scrollIntoList(select, next);
    else
        moveRovingFocus(options, next);

    markActiveOption(select, next);
}

export function handleChipNavigationKey(domEvent: KeyboardEvent, removeChosen: (select: HTMLElement, key: string | null) => void): boolean {
    const remove = domEvent.target instanceof HTMLElement && domEvent.target.classList.contains(MultiSelectChipRemoveClass) ? domEvent.target : null;
    const select = remove?.closest<HTMLElement>(`.${SelectClass}`) ?? null;

    if (remove === null || select === null || !isMultiple(select))
        return false;

    switch (domEvent.key) {
        case "ArrowLeft":
            return focusChip(domEvent, select, -1, remove);
        case "ArrowRight":
            return focusChip(domEvent, select, 1, remove);
        case "Backspace":
        case "Delete": {
            domEvent.preventDefault();

            if (isFixed(select))
                return true;

            const chips = chipsOf(select);
            const index = chips.findIndex(chip => chip.contains(remove));
            const neighbour = (chips[index + 1] ?? chips[index - 1])?.getAttribute(SelectChipAttribute) ?? null;

            removeChosen(select, chips[index]?.getAttribute(SelectChipAttribute) ?? null);

            const next = neighbour === null ? null : chipsOf(select).find(chip => chip.getAttribute(SelectChipAttribute) === neighbour) ?? null;

            if (next !== null)
                next.querySelector<HTMLElement>(`.${MultiSelectChipRemoveClass}`)?.focus();

            return true;
        }
        default:
            return false;
    }
}

export function resolveClearKeySelect(domEvent: KeyboardEvent, openSelect: HTMLElement | null): HTMLElement | null {
    if ((domEvent.key !== "Delete" && domEvent.key !== "Backspace") || !isPlainKey(domEvent) || !(domEvent.target instanceof HTMLElement))
        return null;

    const select = domEvent.target.closest<HTMLElement>(SelectHostSelector);

    if (select === null || select === openSelect || !select.hasAttribute(ClearableAttribute) || isFixed(select))
        return null;

    if (domEvent.target !== controlOf(select) || (domEvent.key === "Backspace" && isMultiple(select)) || (entryOf(select)?.value ?? "") !== "")
        return null;

    return select;
}

export function resolveClosedArrowStart(domEvent: KeyboardEvent, openSelect: HTMLElement | null): { select: HTMLElement; start: HTMLElement | null } | null {
    const trigger = domEvent.target instanceof HTMLElement && isSelectTrigger(domEvent.target) ? domEvent.target : null;
    const select = trigger?.closest<HTMLElement>(SelectHostSelector) ?? null;

    if (select === null || select === openSelect || isFixed(select))
        return null;

    const field = searchFieldOf(select);

    if (field !== null)
        narrowToTerm(field);

    const options = candidateOptions(select);
    const start = options.find(option => option.getAttribute("aria-selected") === "true") ?? (domEvent.key === "ArrowDown" ? options[0] : options[options.length - 1]) ?? null;

    return { select, start };
}

/** What an option reads as in a field: its title where it has one, else everything it draws. */
export function optionLabel(option: HTMLElement | null): string | null {
    return option === null ? null : entryWords(option);
}

function stripAddressingAttributes(element: Element): void {
    for (const node of [element, ...element.querySelectorAll("*")]) {
        node.removeAttribute(ComponentIdAttribute);
        node.removeAttribute(ComponentKeyAttribute);
        node.removeAttribute(ComponentParameterCountAttribute);
        node.removeAttribute(ComponentContextAttribute);

        for (const name of node.getAttributeNames()) {
            if (name.startsWith(BindingAttributePrefix))
                node.removeAttribute(name);
        }
    }
}

export function syncSingleSelect(select: HTMLElement, drawnKeys: WeakMap<HTMLElement, string>): void {
    const value = select.getAttribute(SelectValueAttribute);
    const hadValue = drawnKeys.has(select);

    decorateOptions(select);

    const selectedOption = value === null
        ? null
        : optionsOf(select).find(option => option.getAttribute(ComponentKeyAttribute) === value) ?? null;

    const drawn = renderTriggerContent(select, selectedOption, value, drawnKeys);
    const placeholder = select.querySelector<HTMLElement>(`.${SelectPlaceholderClass}`);

    if (placeholder !== null)
        placeholder.style.display = drawn ? "none" : "";

    for (const option of optionsOf(select))
        option.setAttribute("aria-selected", value !== null && option.getAttribute(ComponentKeyAttribute) === value ? "true" : "false");

    // Cleared as well as set: a value taken off from outside must leave the value input too, or the next read brings it back.
    const valueInput = select.querySelector<HTMLInputElement>(`.${SelectValueInputClass}`);

    if (valueInput !== null && valueInput.value !== (value ?? ""))
        valueInput.value = value ?? "";

    // A closed search cleared from the server drops its unbound filter text too, so reopening starts clean.
    if (hadValue && value === null && !select.classList.contains(SelectOpenClass)) {
        const searchField = select.querySelector<HTMLInputElement>(`.${SearchInputClass}`);

        if (searchField !== null && !searchField.hasAttribute(ValueBindingAttribute) && searchField.value.length > 0)
            resetSearchField(select, false);
    }

    // Last, because it reads the list this method has just finished putting in order.
    refreshEmptyState(select);
}

/** Draws a multi-select's value: its chips in chosen order, the chosen options checked, the rest refused once it is full. */
export function syncMultipleSelect(select: HTMLElement): void {
    const keys = parseChosenKeys(select.getAttribute(SelectedKeysAttribute));
    const chosen = new Set(keys);
    const full = isChoiceFull(keys, parseMaxChosen(select.getAttribute(SelectMaxAttribute)));

    decorateOptions(select, option => full && !chosen.has(option.getAttribute(ComponentKeyAttribute) ?? ""));

    const options = optionsOf(select);
    const byKey = new Map(options.map(option => [option.getAttribute(ComponentKeyAttribute) ?? "", option]));
    const entry = entryOf(select);
    // A key no option has is a tag the reader typed, where the field takes free text; anywhere else, nothing to show.
    const shown = entry === null ? keys.filter(key => byKey.has(key)) : keys;

    if (select.classList.contains(MultiSelectButtonClass)) {
        syncButtonCountBadge(select, shown.length);
    }
    else {
        const badges = select.classList.contains(BadgeSelectClass);

        renderChips(select, shown.map(key => {
            const option = byKey.get(key) ?? null;
            const badge = badges ? optionBadge(option) : undefined;

            return { key, label: chipLabel(option, key, badge ?? null), badge };
        }));
    }

    if (entry !== null && entry.readOnly !== isFixed(select))
        entry.readOnly = isFixed(select);

    const placeholder = select.querySelector<HTMLElement>(`.${SelectPlaceholderClass}`);

    if (placeholder !== null)
        placeholder.style.display = shown.length > 0 ? "none" : "";

    for (const option of options)
        option.setAttribute("aria-selected", chosen.has(option.getAttribute(ComponentKeyAttribute) ?? "") ? "true" : "false");

    // The list the value binding reads, written as it stands: an empty field sends an empty list, not nothing.
    const valueInput = select.querySelector<HTMLInputElement>(`.${SelectValueInputClass}`);
    const text = JSON.stringify(keys);

    if (valueInput !== null && valueInput.getAttribute(SelectedKeysAttribute) !== text)
        valueInput.setAttribute(SelectedKeysAttribute, text);

    refreshEmptyState(select);
}

function syncButtonCountBadge(select: HTMLElement, count: number): void {
    const badge = triggerOf(select)?.querySelector<HTMLElement>(`.${TextBadgeClass}`) ?? null;
    const words = badge?.querySelector<HTMLElement>(`.${BadgeTitleClass}`) ?? null;

    if (badge === null || words === null || badge.hasAttribute(BadgeIconAttribute) || words.hasAttribute(`${BindingAttributePrefix}badge-title`))
        return;

    if (count > 0) {
        writeBadgeCount(badge, count);
        select.setAttribute(TextBadgeTitleAttribute, "");
        return;
    }

    words.textContent = "";
    badge.removeAttribute(BadgeTitleAttribute);
    badge.removeAttribute(BadgeSetAttribute);
    select.removeAttribute(TextBadgeTitleAttribute);
}

function renderTriggerContent(select: HTMLElement, option: HTMLElement | null, value: string | null, drawnKeys: WeakMap<HTMLElement, string>): boolean {
    const trigger = select.querySelector<HTMLElement>(`.${TriggerClass}`);

    if (trigger === null)
        return option !== null;

    let content = trigger.querySelector<HTMLElement>(`:scope > .${SelectTriggerContentClass}`);
    const serverKey = content?.getAttribute(SelectContentAttribute) ?? null;

    if (content !== null && serverKey !== null) {
        content.removeAttribute(SelectContentAttribute);
        drawnKeys.set(select, serverKey);
    }

    if (option === null) {
        if (content !== null && value !== null && isSearch(select) && drawnKeys.get(select) === value)
            return true;

        if (value !== null && value.length > 0 && select.hasAttribute(SelectFreeTextAttribute)) {
            drawnKeys.set(select, value);
            content = ensureTriggerContent(trigger, content);
            content.textContent = value;
            return true;
        }

        content?.remove();
        drawnKeys.delete(select);
        return false;
    }

    const optionKey = option.getAttribute(ComponentKeyAttribute);

    if (optionKey === null)
        drawnKeys.delete(select);
    else
        drawnKeys.set(select, optionKey);

    if (content !== null && optionKey !== null && serverKey === optionKey)
        return true;

    content = ensureTriggerContent(trigger, content);

    const clone = option.cloneNode(true) as HTMLElement;

    stripAddressingAttributes(clone);
    removePressWaves(clone);
    content.replaceChildren(...clone.childNodes);

    return true;
}

function decorateOptions(select: HTMLElement, refused: (option: HTMLElement) => boolean = () => false): void {
    for (const option of optionsOf(select)) {
        if (!option.hasAttribute("role"))
            option.setAttribute("role", "option");

        const disabled = isItemDisabled(option);
        const flag = disabled || refused(option) ? "true" : "false";

        if (option.getAttribute("aria-disabled") !== flag)
            option.setAttribute("aria-disabled", flag);

        if (disabled ? option.tabIndex !== -1 : !option.hasAttribute("tabindex"))
            option.tabIndex = -1;
    }
}

function ensureTriggerContent(trigger: HTMLElement, existing: HTMLElement | null): HTMLElement {
    let content = existing;

    if (content === null) {
        content = document.createElement("span");
        content.className = SelectTriggerContentClass;

        const prefixIcon = trigger.querySelector<HTMLElement>(`:scope > .${InputAffixIconPrefixClass}`);

        if (prefixIcon === null)
            trigger.prepend(content);
        else
            prefixIcon.after(content);
    }

    content.style.display = "inline-flex";
    return content;
}

export function keepFieldFocus(select: HTMLElement): void {
    const trigger = triggerOf(select);
    const target = controlOf(select);

    if (trigger !== null && target !== null && !trigger.contains(document.activeElement))
        focusAsLastInput(target);
}

export function candidateOptions(select: HTMLElement): HTMLElement[] {
    return optionsOf(select).filter(option => isShown(option) && !isItemDisabled(option) && !isInert(option));
}

function isShown(option: HTMLElement): boolean {
    return option.style.display !== "none" && !option.classList.contains(HiddenClass);
}

export function scrollIntoList(select: HTMLElement, option: HTMLElement): void {
    const list = select.querySelector<HTMLElement>(`.${SelectListClass}`);

    if (list === null)
        return;

    const box = list.getBoundingClientRect();
    const own = option.getBoundingClientRect();
    const style = getComputedStyle(list);
    const inside = box.top + (Number.parseFloat(style.borderTopWidth) || 0);
    const top = inside + (Number.parseFloat(style.paddingTop) || 0);
    const bottom = inside + list.clientHeight - (Number.parseFloat(style.paddingBottom) || 0);

    if (own.top < top)
        list.scrollTop -= top - own.top;
    else if (own.bottom > bottom)
        list.scrollTop += own.bottom - bottom;
}

function chipsOf(select: HTMLElement): HTMLElement[] {
    return [...select.querySelectorAll<HTMLElement>(`.${MultiSelectChipsClass} > .${MultiSelectChipClass}`)];
}

export function focusChip(domEvent: KeyboardEvent, select: HTMLElement, step: -1 | 1, from: HTMLElement | null = null): boolean {
    const chips = chipsOf(select);

    if (chips.length === 0)
        return false;

    const index = from === null ? chips.length : chips.findIndex(chip => chip.contains(from));
    const target = chips[index + step]?.querySelector<HTMLElement>(`.${MultiSelectChipRemoveClass}`) ?? (step === 1 ? controlOf(select) : null);

    domEvent.preventDefault();

    if (target === null)
        return true;

    target.focus();

    if (target instanceof HTMLInputElement)
        target.setSelectionRange(0, 0);

    return true;
}

export function isBoxAroundEntry(target: Element): boolean {
    if (target.closest(`.${SelectActionClass}`) !== null)
        return false;

    const select = target.closest(`.${TriggerClass}`)?.closest<HTMLElement>(`.${SelectClass}`) ?? null;

    return select !== null && entryOf(select) !== null && !target.classList.contains(MultiSelectEntryClass);
}

export function optionKeyNamed(select: HTMLElement, text: string): string | null {
    const wanted = text.trim().toLocaleLowerCase();

    for (const option of optionsOf(select)) {
        const key = option.getAttribute(ComponentKeyAttribute);

        if (key !== null && !isItemDisabled(option) && (key.toLocaleLowerCase() === wanted || optionLabel(option)?.trim().toLocaleLowerCase() === wanted))
            return key;
    }

    return null;
}

/** Whether `key` is the exact `Id` of a disabled option in `select`, which the server write-gate also refuses. */
export function isDisabledOptionKey(select: HTMLElement, key: string): boolean {
    return optionsOf(select).some(option => option.getAttribute(ComponentKeyAttribute) === key && isItemDisabled(option));
}

/** Clears `select`'s popup search input, resets client narrowing, and notifies a bound query when `notifyBound` is true. */
export function resetSearchField(select: HTMLElement, notifyBound: boolean): void {
    const searchField = select.querySelector<HTMLInputElement>(`.${SearchInputClass}`);

    if (searchField === null)
        return;

    const hadText = searchField.value.length > 0;

    searchField.value = "";
    clearAskedTerm(searchField);
    narrowToTerm(searchField);

    if (notifyBound && hadText && searchField.hasAttribute(ValueBindingAttribute))
        searchField.dispatchEvent(new Event("change", { bubbles: true }));
}

function optionBadge(option: HTMLElement | null): HTMLElement | null {
    return option?.querySelector<HTMLElement>(`.${TextBadgeClass}`) ?? null;
}

function chipLabel(option: HTMLElement | null, key: string, badge: HTMLElement | null = null): string {
    const words = badge?.hasAttribute(BadgeTitleAttribute) === true ? badge.querySelector(`.${BadgeTitleClass}`)?.textContent ?? null : null;
    const label = (words ?? optionLabel(option))?.trim() ?? "";

    return label.length > 0 ? label : key;
}

type ChipDraft = { readonly key: string; readonly label: string; readonly badge?: HTMLElement | null };

function renderChips(select: HTMLElement, chips: readonly ChipDraft[]): void {
    const host = select.querySelector<HTMLElement>(`.${MultiSelectChipsClass}`);

    if (host === null)
        return;

    if (host.hasAttribute(SelectChipsAttribute) !== chips.length > 0)
        host.toggleAttribute(SelectChipsAttribute, chips.length > 0);

    const existing = [...host.querySelectorAll<HTMLElement>(`:scope > .${MultiSelectChipClass}`)];
    const unchanged = existing.length === chips.length && existing.every((chip, index) =>
        chip.getAttribute(SelectChipAttribute) === chips[index].key
        && chip.querySelector(`.${MultiSelectChipLabelClass}`)?.textContent === chips[index].label
        && (chips[index].badge === undefined || badgeLook(chip) === badgeLook(chips[index].badge ?? createBlankBadge()))
    );

    if (unchanged)
        return;

    for (const chip of existing)
        chip.remove();

    host.prepend(...chips.map(createChip));
}

function createChip(draft: ChipDraft): HTMLElement {
    const remove = document.createElement("button");
    const chip = draft.badge === undefined ? createWordsChip(draft.label) : createBadgeChip(draft.label, draft.badge);

    chip.classList.add(MultiSelectChipClass);
    chip.setAttribute(SelectChipAttribute, draft.key);

    remove.className = MultiSelectChipRemoveClass;
    remove.type = "button";
    remove.tabIndex = -1;
    clientStrings.write(remove, "aria-label", "ui.select.remove", { label: draft.label });

    chip.append(remove);
    return chip;
}

function createWordsChip(label: string): HTMLElement {
    const chip = document.createElement("span");
    const text = document.createElement("span");

    text.className = MultiSelectChipLabelClass;
    text.textContent = label;

    chip.append(text);
    return chip;
}

function createBadgeChip(label: string, badge: HTMLElement | null): HTMLElement {
    const chip = badge === null ? createBlankBadge() : badge.cloneNode(true) as HTMLElement;

    stripAddressingAttributes(chip);
    chip.classList.remove(TextBadgeClass);

    const text = chip.querySelector<HTMLElement>(`:scope > .${BadgeTitleClass}`);

    text?.classList.add(MultiSelectChipLabelClass);

    if (text !== null && !chip.hasAttribute(BadgeTitleAttribute))
        writeBadgeWords(chip, label);

    return chip;
}

function createBlankBadge(): HTMLElement {
    const badge = document.createElement("span");
    const icon = document.createElement("span");
    const text = document.createElement("span");

    badge.className = `${BadgeClass} ${BlankBadgeClasses}`;
    icon.className = `${BadgeIconClass} ${IconClass}`;
    text.className = `${BadgeTitleClass} ${TextTypeOverlineClass}`;

    badge.append(icon, text);
    return badge;
}

function badgeLook(badge: HTMLElement): string {
    const icon = badge.querySelector(`:scope > .${BadgeIconClass}`);

    return `${lookOf(badge)}|${icon === null ? "" : lookOf(icon)}`;
}

function lookOf(element: Element): string {
    const classes = [...element.classList].filter(name => name !== MultiSelectChipClass && name !== TextBadgeClass).sort().join(" ");

    return `${classes};${element.getAttribute("style") ?? ""};${element.hasAttribute(BadgeIconAttribute)}`;
}

export function collectMutatedSelects(mutation: MutationRecord, selects: Set<HTMLElement>): void {
    if (mutation.type === "childList") {
        for (const added of mutation.addedNodes) {
            if (!(added instanceof HTMLElement))
                continue;

            if (isSelectHost(added))
                selects.add(added);

            for (const select of added.querySelectorAll<HTMLElement>(SelectHostSelector))
                selects.add(select);
        }
    }

    if (mutation.type === "attributes" && (mutation.attributeName === SelectValueAttribute || mutation.attributeName === SelectedKeysAttribute || mutation.attributeName === SelectMaxAttribute)) {
        if (mutation.target instanceof HTMLElement && isSelectHost(mutation.target))
            selects.add(mutation.target);

        return;
    }

    const target = mutation.target instanceof HTMLElement ? mutation.target : mutation.target.parentElement;

    if (mutation.attributeName === "style" && target?.classList.contains(BadgeClass) !== true)
        return;

    const select = target?.closest(`.${SelectPopupClass}`)?.closest<HTMLElement>(SelectHostSelector);

    if (select !== null && select !== undefined)
        selects.add(select);
}

export function holdHeightAbove(popup: HTMLElement): void {
    if (popup.getAttribute(PopupPlacementAttribute)?.startsWith("top") === true)
        popup.style.minHeight = `${popup.offsetHeight}px`;
}
