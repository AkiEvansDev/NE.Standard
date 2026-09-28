import {
    BindingAttributePrefix, ComponentContextAttribute, ComponentIdAttribute, ComponentKeyAttribute, ComponentParameterCountAttribute,
    ensureElementId, SelectedKeysAttribute
} from "../addressing/dom-attributes";
import { clientStrings } from "../runtime/client-strings";
import { isAnchoredPopupPlacement, placeAnchoredPopup, releaseAnchoredPopup } from "./anchored-popup";
import { isChoiceFull, parseChosenKeys, parseMaxChosen, removeChosenKey, toggleChosenKey } from "./multi-select-keys";
import { PopupDismissal } from "./popup-dismissal";
import { ownDescendants } from "./own-descendants";
import { restoreFocusTo } from "./popup-focus";
import { applyRovingTabIndex, resolveRovingTarget } from "./roving-focus";
import { clearOptionsFilter, refreshEmptyState } from "./search-input-engine";

const SelectValueAttribute = "data-ui-select-value";
// Where the list opens when the author said so; below from the start edge otherwise.
const SelectPlacementAttribute = "data-ui-select-placement";
const SelectClass = "ui-select";
const OpenClass = "ui-select--open";
const TriggerClass = "ui-select__trigger";
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
// What `Enabled = false` leaves on an option, on the item template's own root rather than the option wrapper.
const DisabledClass = "ui-disabled";
// Which option the arrows have reached; marked outright, because `:focus` says nothing once the window is not focused.
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

// What the observer below watches: never an attribute this engine writes itself (aria-selected, the active mark, tabindex, the
// popup's placement), since answering its own writes is a loop and a sync on every scroll frame.
const ObservedAttributes = [SelectValueAttribute, SelectedKeysAttribute, MaxAttribute, "class", ComponentKeyAttribute];

/** A read-only search keeps its text field, a read-only multi-select its field and a read-only select a disabled trigger; none offers a list or changes. */
function isReadOnly(select: HTMLElement | null): boolean {
    const trigger = select?.querySelector(`.${TriggerClass}`);

    return select?.querySelector<HTMLInputElement>(`.${SearchInputClass}`)?.readOnly === true
        || trigger?.getAttribute("aria-readonly") === "true"
        || trigger?.matches(":disabled") === true;
}

function isMultiple(select: HTMLElement): boolean {
    return select.classList.contains(MultiClass);
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
    private openSelect: HTMLElement | null = null;
    // The value each select was last synced at, so the search's filter is spent only when the value itself moves.
    private readonly syncedValues = new WeakMap<HTMLElement, string | null>();

    public constructor(options: SelectInteractionEngineOptions = {}) {
        this.root = options.root ?? document;

        for (const select of this.root.querySelectorAll<HTMLElement>(`.${SelectClass}`))
            this.sync(select);

        if (this.root instanceof Node) {
            // Hand-rolled rather than observeComponents: an arriving select, its value attribute and a popup change each name the
            // select differently, and only the record says which. Each select syncs once per batch, however many records name it.
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
        this.root.addEventListener("focusout", domEvent => this.handleFocusOut(domEvent), true);

        new PopupDismissal({
            openPopups: () => this.openSelect === null || !this.openSelect.isConnected ? [] : [this.openSelect],
            close: () => this.close()
        });
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

        // Search's trigger is its input, so the label is written into it — never over a term being typed, and only in the mode
        // that asked for it (KeepSearchInput), since a value arriving while unfocused would otherwise wipe a term just typed. A
        // focused but empty field is no term either — the keyboard reached it before the value did — so the label lands selected there too.
        const searchInput = select.querySelector<HTMLInputElement>(`.${SearchInputClass}`);

        if (searchInput !== null) {
            const focused = document.activeElement === searchInput;

            if (select.classList.contains(ReplaceModeClass) && (!focused || searchInput.value.length === 0)) {
                searchInput.value = matchedLabel ?? "";

                if (focused)
                    searchInput.select();
            }

            // The query that narrowed the list is spent once a value is chosen — only then: a sync for anything else (an option
            // patched, a record the list's own filtering raised) must leave the reader's narrowing standing.
            if (this.syncedValues.has(select) && this.syncedValues.get(select) !== value)
                clearOptionsFilter(select);
        }

        this.syncedValues.set(select, value);

        const placeholder = select.querySelector<HTMLElement>(`.${PlaceholderClass}`);

        if (placeholder !== null)
            placeholder.style.display = matched ? "none" : "";

        for (const option of optionsOf(select))
            option.setAttribute("aria-selected", value !== null && option.dataset.uiKey === value ? "true" : "false");

        // Cleared as well as set: a value taken off the root from outside — a push to an unbound select, a package emptying its
        // field — must leave the element the value is read from, or the next read brings back what the select no longer shows.
        const valueInput = select.querySelector<HTMLInputElement>(`.${ValueInputClass}`);

        if (valueInput !== null && valueInput.value !== (value ?? ""))
            valueInput.value = value ?? "";

        // Last, because it reads the list this method has just finished putting in order.
        refreshEmptyState(select);
    }

    /**
     * A multi-select's value drawn: a chip per chosen key that names an option, in the order they were chosen, a check on each
     * chosen option, and — once the field holds as many as it takes — the other options refused.
     */
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

    /**
     * The wrapper metadata carries no tab index, and a role only where the renderer names one (the multi-select does, the select and
     * the search do not), so a client-built option gets them here; aria-disabled follows the live Enabled, and a full
     * multi-select's `refused` options, which stay in reach of the arrows.
     */
    private decorateOptions(select: HTMLElement, refused: (option: HTMLElement) => boolean = () => false): void {
        for (const option of optionsOf(select)) {
            if (!option.hasAttribute("role"))
                option.setAttribute("role", "option");

            const disabled = isOptionDisabled(option);

            // Re-read on every sync rather than only when missing: `Enabled` is bound and moves.
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

    /** Focus leaving the select by the keyboard takes the list with it; a null destination is the window losing focus, not leaving. */
    private handleFocusOut(domEvent: Event): void {
        const select = this.openSelect;

        if (select === null || !(domEvent instanceof FocusEvent) || !(domEvent.target instanceof Node) || !select.contains(domEvent.target))
            return;

        const next = domEvent.relatedTarget;

        if (next instanceof Node && !select.contains(next))
            this.close();
    }

    /**
     * The keyboard arriving in a search that shows its choice rather than a query: the chosen text is written into the field and
     * selected, so typing replaces it at once. The stylesheet shows the input only while it's focused; the list opens on the
     * first keystroke, as for anything else typed here.
     */
    private handleSearchFocus(domEvent: Event): void {
        if (!(domEvent.target instanceof HTMLInputElement) || !domEvent.target.classList.contains(SearchInputClass))
            return;

        const input = domEvent.target;
        const select = input.closest<HTMLElement>(`.${SelectClass}`);

        if (select === null || select === this.openSelect || input.readOnly || !select.classList.contains(ReplaceModeClass))
            return;

        const value = select.getAttribute(SelectValueAttribute);

        if (value === null)
            return;

        // The label rather than whatever query was last typed and left: a term nobody chose from is spent when the field is left.
        input.value = optionLabel(optionsOf(select).find(option => option.getAttribute(ComponentKeyAttribute) === value) ?? null) ?? input.value;
        input.select();
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

                if (!isReadOnly(removeSelect))
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

                if (!isReadOnly(clearSelect))
                    this.clearValue(clearSelect);
            }

            return;
        }

        const trigger = domEvent.target.closest<HTMLElement>(`.${TriggerClass}`);

        if (trigger !== null) {
            const select = trigger.closest<HTMLElement>(`.${SelectClass}`);

            // A read-only search keeps its text readable and offers no list; a read-only select's trigger is disabled and never gets here.
            if (isReadOnly(select))
                return;

            // Search's trigger is a real text field: with the popup open, a click in it places the caret.
            if (trigger.getAttribute(TriggerModeAttribute) === "input" && domEvent.target instanceof HTMLInputElement && select === this.openSelect)
                return;

            domEvent.preventDefault();
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

    private handleKeydown(domEvent: Event): void {
        if (!(domEvent instanceof KeyboardEvent) || domEvent.defaultPrevented)
            return;

        // A row redrawn while its select was open took the select away; the arrows are the page's again.
        if (this.openSelect !== null && !this.openSelect.isConnected)
            this.close();

        // Only a key inside the open select: the arrows of a field focus has since reached are that field's.
        if ((domEvent.key === "ArrowDown" || domEvent.key === "ArrowUp") && this.openSelect !== null && domEvent.target instanceof Node && this.openSelect.contains(domEvent.target)) {
            domEvent.preventDefault();
            this.moveFocus(this.openSelect, domEvent.key === "ArrowDown" ? 1 : -1);
            return;
        }

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

    /**
     * A multi-select's field is a focusable box, not a button, so it opens on the keys a button takes and on the arrows; with no
     * text to delete, Backspace takes out the last chip. Answers whether the key was the field's.
     */
    private handleMultipleTriggerKey(domEvent: KeyboardEvent): boolean {
        const trigger = domEvent.target instanceof HTMLElement && domEvent.target.classList.contains(TriggerClass) ? domEvent.target : null;
        const select = trigger?.closest<HTMLElement>(`.${SelectClass}`) ?? null;

        if (select === null || !isMultiple(select) || isReadOnly(select))
            return false;

        switch (domEvent.key) {
            case "Enter":
            case " ":
                domEvent.preventDefault();
                this.toggle(select);
                return true;
            case "ArrowDown":
            case "ArrowUp":
                domEvent.preventDefault();

                if (this.openSelect !== select)
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

    /**
     * A search keeps focus in its field: the arrows only move the mark, and Enter from the field chooses the marked option while
     * the query still shows it. Space is a character of the query there, never a choice.
     */
    private markedOption(domEvent: KeyboardEvent): HTMLElement | null {
        const select = this.openSelect;

        if (domEvent.key !== "Enter" || select === null || !(domEvent.target instanceof HTMLInputElement) || !domEvent.target.classList.contains(SearchInputClass) || !select.contains(domEvent.target))
            return null;

        return optionsOf(select).find(option => option.hasAttribute(ActiveAttribute) && !isOptionDisabled(option) && option.style.display !== "none") ?? null;
    }

    /** `typing`: the list opens on a keystroke whose query the search engine is about to apply, so no old filter is taken off. */
    private toggle(select: HTMLElement | null, typing = false): void {
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

        select.classList.add(OpenClass);
        this.positionPopup(select);
        this.describeTrigger(select, true);
        this.openSelect = select;
        this.initializeFocus(select);
    }

    /** What the trigger says about the list it opens: that it is open, and which list it is. */
    private describeTrigger(select: HTMLElement, open: boolean): void {
        const trigger = select.querySelector<HTMLElement>(`.${TriggerClass}`);
        const popup = select.querySelector<HTMLElement>(`.${PopupClass}`);

        if (trigger === null)
            return;

        trigger.setAttribute("aria-expanded", open ? "true" : "false");

        if (popup !== null)
            trigger.setAttribute("aria-controls", ensureElementId(popup, "ui-select-popup"));
    }

    private close(): void {
        if (this.openSelect === null)
            return;

        const select = this.openSelect;
        const popup = select.querySelector<HTMLElement>(`.${PopupClass}`);

        // Before the popup hides: hiding it drops focus on the body, and then there is nothing to bring back.
        if (popup !== null)
            restoreFocusTo(select.querySelector<HTMLElement>(`.${TriggerClass}`), popup);

        select.classList.remove(OpenClass);
        this.markActive(select, null);
        this.describeTrigger(select, false);
        releaseAnchoredPopup(popup);
        this.openSelect = null;
    }

    /** At least the trigger's width, on the side the author named, and flipped to the other side when the list has no room there. */
    private positionPopup(select: HTMLElement): void {
        const trigger = select.querySelector<HTMLElement>(`.${TriggerClass}`);
        const popup = select.querySelector<HTMLElement>(`.${PopupClass}`);
        const token = select.getAttribute(SelectPlacementAttribute);
        const placement = token !== null && isAnchoredPopupPlacement(token) ? token : "bottom-start";

        if (trigger !== null && popup !== null)
            placeAnchoredPopup(trigger, popup, { placement, gap: PopupGap, minAnchorWidth: true });
    }

    private initializeFocus(select: HTMLElement): void {
        const options = optionsOf(select).filter(option => !isOptionDisabled(option));

        if (options.length === 0)
            return;

        const selected = options.find(option => option.getAttribute("aria-selected") === "true");
        const target = selected ?? options[0];

        applyRovingTabIndex(options, target);

        this.markActive(select, target);

        // Search keeps focus in its field: the roving tab stop above still lets ArrowDown step into the list.
        const trigger = select.querySelector<HTMLElement>(`.${TriggerClass}`);

        if (trigger?.getAttribute(TriggerModeAttribute) === "input") {
            const input = select.querySelector<HTMLInputElement>(`.${SearchInputClass}`);

            if (input !== null && document.activeElement !== input)
                input.focus();

            return;
        }

        target.focus();
    }

    // Only what can be chosen, and without the wrap: a list has a top and a bottom.
    private moveFocus(select: HTMLElement, direction: 1 | -1): void {
        const options = optionsOf(select).filter(option => !isOptionDisabled(option));

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

    /** The one option the arrows are on, so the viewer can see what Enter would choose. */
    private markActive(select: HTMLElement, active: HTMLElement | null): void {
        for (const option of optionsOf(select)) {
            if (option === active)
                option.setAttribute(ActiveAttribute, "");
            else if (option.hasAttribute(ActiveAttribute))
                option.removeAttribute(ActiveAttribute);
        }
    }

    private choose(select: HTMLElement, option: HTMLElement): void {
        const key = option.dataset.uiKey;

        // The one place both the click and the keyboard come through, so refusing here refuses everywhere.
        if (key === undefined || isOptionDisabled(option))
            return;

        // A multi-select toggles the option and keeps the list open for the next one.
        if (isMultiple(select)) {
            const next = toggleChosenKey(parseChosenKeys(select.getAttribute(SelectedKeysAttribute)), key, parseMaxChosen(select.getAttribute(MaxAttribute)));

            this.markActive(select, option);

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
        if (this.openSelect === select)
            this.positionPopup(select);

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

/** What a chip says: the option's words as a field shows them, or its key where the option shows none. */
function chipLabel(option: HTMLElement | null, key: string): string {
    const label = optionLabel(option)?.trim() ?? "";

    return label.length > 0 ? label : key;
}

/**
 * A multi-select's chips, rebuilt only when the chosen options or their words changed, so the ones the server drew stay and a sync
 * for anything else leaves the field alone; the placeholder stays last.
 */
function renderChips(select: HTMLElement, chips: readonly { readonly key: string; readonly label: string }[]): void {
    const host = select.querySelector<HTMLElement>(`.${ChipsClass}`);

    if (host === null)
        return;

    const existing = [...host.querySelectorAll<HTMLElement>(`:scope > .${ChipClass}`)];
    const unchanged = existing.length === chips.length && existing.every((chip, index) =>
        chip.getAttribute(ChipAttribute) === chips[index].key && chip.querySelector(`.${ChipLabelClass}`)?.textContent === chips[index].label
    );

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
    remove.setAttribute("aria-label", clientStrings.format("ui.select.remove", { label }));

    chip.append(text, remove);
    return chip;
}

// Disabled sits on the item template's root, which is the option wrapper's own child.
function isOptionDisabled(option: HTMLElement): boolean {
    return option.classList.contains(DisabledClass)
        || option.querySelector(`:scope > .${DisabledClass}`) !== null;
}

/** Adds the selects a record calls to be synced: one arriving whole, one whose value moved, one whose popup changed. */
function collectMutatedSelects(mutation: MutationRecord, selects: Set<HTMLElement>): void {
    // A select that arrives whole (a row the client built) had its value written before it joined the document, so no attribute
    // record will ever come for it: synced on arrival.
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
