import { BindingAttributePrefix, ComponentIdAttribute, ComponentKeyAttribute, ComponentParameterCountAttribute, cssAttributeValue } from "../addressing/dom-attributes";
import { placeAnchoredPopup, releaseAnchoredPopup } from "./anchored-popup";
import { clearOptionsFilter } from "./search-input-engine";

const SelectValueAttribute = "data-ui-select-value";
const SelectClass = "ui-select";
const OpenClass = "ui-select--open";
const TriggerClass = "ui-select__trigger";
const TriggerContentClass = "ui-select__trigger-content";
const PlaceholderClass = "ui-select__placeholder";
const PrefixIconClass = "ui-input__affix-icon--prefix";
const PopupClass = "ui-select__popup";
const OptionClass = "ui-select__option";
const ValueInputClass = "ui-select__value-input";
const ClearAttribute = "data-ui-select-clear";
const ClearClass = "ui-select__clear";
const SearchInputClass = "ui-search__input";
const TitleClass = "ui-text__title";

const PopupGap = 4;

export type SelectInteractionEngineOptions = {
    readonly root?: ParentNode;
};

const SelfWrittenAttributes = new Set(["aria-selected", "tabindex", "style"]);

function stripAddressingAttributes(element: Element): void {
    for (const node of [element, ...element.querySelectorAll("*")]) {
        node.removeAttribute(ComponentIdAttribute);
        node.removeAttribute(ComponentKeyAttribute);
        node.removeAttribute(ComponentParameterCountAttribute);
        node.removeAttribute("data-ui-context");

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
            const observer = new MutationObserver(mutations => {
                for (const mutation of mutations) {
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
        document.addEventListener("click", domEvent => this.handleOutsideClick(domEvent), true);
    }

    private sync(select: HTMLElement): void {
        const value = select.getAttribute(SelectValueAttribute);

        this.decorateOptions(select);

        const selectedOption = value === null
            ? null
            : select.querySelector<HTMLElement>(`.${PopupClass} .${OptionClass}[data-ui-key="${cssAttributeValue(value)}"]`);

        const matched = selectedOption !== null;
        const matchedLabel = selectedOption === null
            ? null
            : selectedOption.querySelector<HTMLElement>(`.${TitleClass}`)?.textContent ?? selectedOption.textContent;

        this.renderTriggerContent(select, selectedOption);

        // Search's trigger *is* its input, so the selected label has to be written into it — but never while
        // the user is typing in it, or their query is overwritten mid-word.
        const searchInput = select.querySelector<HTMLInputElement>(`.${SearchInputClass}`);

        if (searchInput !== null) {
            if (document.activeElement !== searchInput)
                searchInput.value = matchedLabel ?? "";

            // The query that narrowed the list is spent once a value is chosen; leaving it applied would hide
            // every other option the next time the popup opens.
            clearOptionsFilter(select);
        }

        const placeholder = select.querySelector<HTMLElement>(`.${PlaceholderClass}`);

        if (placeholder !== null)
            placeholder.style.display = matched ? "none" : "";

        for (const option of select.querySelectorAll<HTMLElement>(`.${OptionClass}`))
            option.setAttribute("aria-selected", value !== null && option.dataset.uiKey === value ? "true" : "false");

        const valueInput = select.querySelector<HTMLInputElement>(`.${ValueInputClass}`);

        if (valueInput !== null && value !== null)
            valueInput.value = value;

        const clear = select.querySelector<HTMLElement>(`.${ClearClass}`);

        if (clear !== null)
            clear.style.display = value !== null ? "inline-flex" : "none";
    }

    // The closed trigger shows the selected option through its full item template. It is cloned out of the
    // popup on demand rather than pre-rendered as hidden candidates: a client-rendered collection could never
    // produce copies that are not in any <template>, so the trigger would stay empty for a bound Options.
    private renderTriggerContent(select: HTMLElement, option: HTMLElement | null): void {
        const trigger = select.querySelector<HTMLElement>(`.${TriggerClass}`);

        if (trigger === null)
            return;

        let content = trigger.querySelector<HTMLElement>(`:scope > .${TriggerContentClass}`);

        if (option === null) {
            content?.remove();
            return;
        }

        if (content === null) {
            content = document.createElement("span");
            content.className = TriggerContentClass;

            // Before the placeholder and the chevron, which are the trigger's other children — but after the
            // prefix icon, which is furniture at the start of the field rather than part of the value.
            const prefixIcon = trigger.querySelector<HTMLElement>(`:scope > .${PrefixIconClass}`);

            if (prefixIcon === null)
                trigger.prepend(content);
            else
                prefixIcon.after(content);
        }

        content.style.display = "inline-flex";

        const clone = option.cloneNode(true) as HTMLElement;

        // Without this the copy is resolvable as the same component as the option it was cloned from, and a
        // live patch would land on whichever one the DOM walk reached first.
        stripAddressingAttributes(clone);
        content.replaceChildren(...clone.childNodes);
    }

    // role/tabindex cannot ride the item template's wrapper metadata the way a class can, so a client-cloned
    // option gets them stamped here — the same split RadioGroupComponentRenderer makes with its sync engine.
    private decorateOptions(select: HTMLElement): void {
        for (const option of select.querySelectorAll<HTMLElement>(`.${PopupClass} .${OptionClass}`)) {
            if (!option.hasAttribute("role"))
                option.setAttribute("role", "option");

            if (!option.hasAttribute("tabindex"))
                option.tabIndex = 0;
        }
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
                this.clearValue(clearSelect);
            }

            return;
        }

        const trigger = domEvent.target.closest<HTMLElement>(`.${TriggerClass}`);

        if (trigger !== null) {
            const select = trigger.closest<HTMLElement>(`.${SelectClass}`);

            // Search's trigger is a real text field: once its popup is open, a click inside it is the user
            // placing the caret, not asking to close.
            if (trigger.dataset.uiSelectTriggerMode === "input" && domEvent.target instanceof HTMLInputElement && select === this.openSelect)
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
        if (!(domEvent instanceof KeyboardEvent))
            return;

        if (domEvent.key === "Escape" && this.openSelect !== null) {
            domEvent.preventDefault();
            this.close();
            return;
        }

        if ((domEvent.key === "ArrowDown" || domEvent.key === "ArrowUp") && this.openSelect !== null) {
            domEvent.preventDefault();
            this.moveFocus(this.openSelect, domEvent.key === "ArrowDown" ? 1 : -1);
            return;
        }

        if (domEvent.key !== "Enter" && domEvent.key !== " ")
            return;

        if (!(domEvent.target instanceof Element))
            return;

        const option = domEvent.target.closest<HTMLElement>(`.${OptionClass}`);

        if (option === null)
            return;

        const select = option.closest<HTMLElement>(`.${SelectClass}`);

        if (select === null)
            return;

        domEvent.preventDefault();
        this.choose(select, option);
    }

    // composedPath, not contains: a handler that re-renders during the click detaches the clicked node, and
    // contains would then answer "outside" and close a popup the user is still working in.
    private handleOutsideClick(domEvent: Event): void {
        if (this.openSelect === null)
            return;

        if (domEvent.composedPath().includes(this.openSelect))
            return;

        this.close();
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
        select.querySelector<HTMLElement>(`.${TriggerClass}`)?.setAttribute("aria-expanded", "true");
        this.openSelect = select;
        this.initializeFocus(select);
    }

    private close(): void {
        if (this.openSelect === null)
            return;

        const select = this.openSelect;
        const focusWasInPopup = document.activeElement instanceof Node && select.contains(document.activeElement)
            && document.activeElement.classList.contains(OptionClass);

        select.classList.remove(OpenClass);
        select.querySelector<HTMLElement>(`.${TriggerClass}`)?.setAttribute("aria-expanded", "false");
        releaseAnchoredPopup(select.querySelector<HTMLElement>(`.${PopupClass}`));
        this.openSelect = null;

        if (focusWasInPopup)
            select.querySelector<HTMLElement>(`.${TriggerClass}`)?.focus();
    }

    /** Width-matched to the trigger, and flipped above it when the list has no room below. */
    private positionPopup(select: HTMLElement): void {
        const trigger = select.querySelector<HTMLElement>(`.${TriggerClass}`);
        const popup = select.querySelector<HTMLElement>(`.${PopupClass}`);

        if (trigger !== null && popup !== null)
            placeAnchoredPopup(trigger, popup, { placement: "bottom-start", gap: PopupGap, matchAnchorWidth: true });
    }

    private initializeFocus(select: HTMLElement): void {
        const options = [...select.querySelectorAll<HTMLElement>(`.${OptionClass}`)];

        if (options.length === 0)
            return;

        const selected = options.find(option => option.getAttribute("aria-selected") === "true");
        const target = selected ?? options[0];

        for (const option of options)
            option.tabIndex = option === target ? 0 : -1;

        target.focus();
    }

    private moveFocus(select: HTMLElement, direction: 1 | -1): void {
        const options = [...select.querySelectorAll<HTMLElement>(`.${OptionClass}`)];

        if (options.length === 0)
            return;

        const currentIndex = options.findIndex(option => option === document.activeElement);
        const nextIndex = Math.max(0, Math.min(options.length - 1, (currentIndex === -1 ? 0 : currentIndex) + direction));

        for (const option of options)
            option.tabIndex = -1;

        const next = options[nextIndex];
        next.tabIndex = 0;
        next.focus();
    }

    private choose(select: HTMLElement, option: HTMLElement): void {
        const key = option.dataset.uiKey;

        if (key === undefined)
            return;

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
        select.removeAttribute(SelectValueAttribute);
        this.sync(select);

        const valueInput = select.querySelector<HTMLInputElement>(`.${ValueInputClass}`);

        if (valueInput !== null) {
            valueInput.value = "";
            valueInput.dispatchEvent(new Event("change", { bubbles: true }));
        }
    }
}
