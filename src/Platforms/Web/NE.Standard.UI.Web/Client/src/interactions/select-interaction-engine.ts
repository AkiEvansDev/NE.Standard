import {
    BindingAttributePrefix, ComponentContextAttribute, ComponentIdAttribute, ComponentKeyAttribute, ComponentParameterCountAttribute,
    ensureElementId
} from "../addressing/dom-attributes";
import { isAnchoredPopupPlacement, placeAnchoredPopup, releaseAnchoredPopup } from "./anchored-popup";
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

const PopupGap = 4;

export type SelectInteractionEngineOptions = {
    readonly root?: ParentNode;
};

// What this engine writes onto its own DOM: reacting to these in the observer below is an infinite loop.
const SelfWrittenAttributes = new Set(["aria-selected", "aria-disabled", ActiveAttribute, "tabindex", "style"]);

function isReadOnly(select: HTMLElement | null): boolean {
    return select?.querySelector<HTMLInputElement>(`.${SearchInputClass}`)?.readOnly === true;
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

    public constructor(options: SelectInteractionEngineOptions = {}) {
        this.root = options.root ?? document;

        for (const select of this.root.querySelectorAll<HTMLElement>(`.${SelectClass}`))
            this.sync(select);

        if (this.root instanceof Node) {
            // Hand-rolled rather than observeComponents: an arriving select, its value attribute and a popup change each call for
            // different work, and the engine's own writes are skipped by name, which only the record carries.
            const observer = new MutationObserver(mutations => {
                for (const mutation of mutations) {
                    // A select that arrives whole (a row the client built) had its value written before it joined the document, so
                    // no attribute record will ever come for it: synced on arrival.
                    if (mutation.type === "childList") {
                        for (const added of mutation.addedNodes) {
                            if (!(added instanceof HTMLElement))
                                continue;

                            if (added.classList.contains(SelectClass))
                                this.sync(added);

                            for (const select of added.querySelectorAll<HTMLElement>(`.${SelectClass}`))
                                this.sync(select);
                        }
                    }

                    if (mutation.type === "attributes" && mutation.attributeName === SelectValueAttribute) {
                        if (mutation.target instanceof HTMLElement)
                            this.sync(mutation.target);

                        continue;
                    }

                    if (mutation.type === "attributes" && SelfWrittenAttributes.has(mutation.attributeName ?? ""))
                        continue;

                    const target = mutation.target instanceof HTMLElement ? mutation.target : mutation.target.parentElement;
                    const select = target?.closest(`.${PopupClass}`)?.closest<HTMLElement>(`.${SelectClass}`);

                    if (select !== null && select !== undefined)
                        this.sync(select);
                }
            });

            observer.observe(this.root, { attributes: true, childList: true, characterData: true, subtree: true });
        }

        this.root.addEventListener("click", domEvent => this.handleClick(domEvent), true);
        this.root.addEventListener("keydown", domEvent => this.handleKeydown(domEvent), true);
        // Typing is asking to search, and asking to search is asking to see the answers.
        this.root.addEventListener("input", domEvent => this.handleSearchInput(domEvent), true);
        this.root.addEventListener("focusin", domEvent => this.handleSearchFocus(domEvent), true);

        new PopupDismissal({
            openPopups: () => this.openSelect === null ? [] : [this.openSelect],
            close: () => this.close()
        });
    }

    private sync(select: HTMLElement): void {
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

            // The query that narrowed the list is spent once a value is chosen.
            clearOptionsFilter(select);
        }

        const placeholder = select.querySelector<HTMLElement>(`.${PlaceholderClass}`);

        if (placeholder !== null)
            placeholder.style.display = matched ? "none" : "";

        for (const option of optionsOf(select))
            option.setAttribute("aria-selected", value !== null && option.dataset.uiKey === value ? "true" : "false");

        const valueInput = select.querySelector<HTMLInputElement>(`.${ValueInputClass}`);

        if (valueInput !== null && value !== null)
            valueInput.value = value;

        // Last, because it reads the list this method has just finished putting in order.
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

    // role/tabindex cannot ride the item template's wrapper metadata, so a client-cloned option gets them stamped here; aria-disabled follows the live Enabled.
    private decorateOptions(select: HTMLElement): void {
        for (const option of optionsOf(select)) {
            if (!option.hasAttribute("role"))
                option.setAttribute("role", "option");

            const disabled = isOptionDisabled(option);

            // Re-read on every sync rather than only when missing: `Enabled` is bound and moves.
            const flag = disabled ? "true" : "false";

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

        this.toggle(select);
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

        if ((domEvent.key === "ArrowDown" || domEvent.key === "ArrowUp") && this.openSelect !== null) {
            domEvent.preventDefault();
            this.moveFocus(this.openSelect, domEvent.key === "ArrowDown" ? 1 : -1);
            return;
        }

        if (domEvent.isComposing || (domEvent.key !== "Enter" && domEvent.key !== " "))
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
     * A search keeps focus in its field: the arrows only move the mark, and Enter from the field chooses the marked option while
     * the query still shows it. Space is a character of the query there, never a choice.
     */
    private markedOption(domEvent: KeyboardEvent): HTMLElement | null {
        const select = this.openSelect;

        if (domEvent.key !== "Enter" || select === null || !(domEvent.target instanceof HTMLInputElement) || !domEvent.target.classList.contains(SearchInputClass) || !select.contains(domEvent.target))
            return null;

        return optionsOf(select).find(option => option.hasAttribute(ActiveAttribute) && !isOptionDisabled(option) && option.style.display !== "none") ?? null;
    }

    private toggle(select: HTMLElement | null): void {
        if (select === null)
            return;

        if (this.openSelect === select) {
            this.close();
            return;
        }

        this.close();
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

    private clearValue(select: HTMLElement): void {
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

// Disabled sits on the item template's root, which is the option wrapper's own child.
function isOptionDisabled(option: HTMLElement): boolean {
    return option.classList.contains(DisabledClass)
        || option.querySelector(`:scope > .${DisabledClass}`) !== null;
}
