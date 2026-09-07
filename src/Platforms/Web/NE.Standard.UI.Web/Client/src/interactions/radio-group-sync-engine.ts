import { ownDescendants } from "./own-descendants";

const RadioValueAttribute = "data-ui-radio-value";
const RadioInputClass = "ui-radio-group__input";
const RadioDotClass = "ui-radio-group__dot";
const RadioGroupClass = "ui-radio-group";
const ItemWrapperClass = "ui-radio-group__item";
const GroupNameAttribute = "data-ui-radio-group-name";
const BindValueIdAttribute = "data-ui-radio-bind-value-id";
const DisabledAttribute = "data-ui-radio-disabled";
const DisabledClass = "ui-disabled";

export type RadioGroupSyncEngineOptions = {
    readonly root?: ParentNode;
};

export class RadioGroupSyncEngine {
    private readonly root: ParentNode;

    /** Tells the copies of one group apart — see `claimGroupName`. */
    private renamed = 0;

    public constructor(options: RadioGroupSyncEngineOptions = {}) {
        this.root = options.root ?? document;

        for (const group of this.root.querySelectorAll<HTMLElement>(`.${RadioGroupClass}`))
            this.claimGroupName(group);

        for (const group of this.root.querySelectorAll<HTMLElement>(`[${RadioValueAttribute}]`))
            this.sync(group);

        if (!(this.root instanceof Node))
            return;

        // Hand-rolled rather than observeComponents: an attribute and an added node call for different work, and only the record says which.
        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                if (mutation.type === "attributes" && mutation.target instanceof HTMLElement) {
                    // A class change is an option's Enabled moving: the group it belongs to re-reads its options.
                    this.sync(mutation.attributeName === "class" ? mutation.target.closest<HTMLElement>(`.${RadioGroupClass}`) : mutation.target);
                    continue;
                }

                for (const node of mutation.addedNodes) {
                    if (!(node instanceof HTMLElement))
                        continue;

                    // Groups first: an item takes its name from the group it lands in.
                    this.decorateAddedGroups(node);
                    this.decorateAddedItems(node);
                }
            }
        });

        observer.observe(this.root, { attributes: true, attributeFilter: [RadioValueAttribute, "class"], childList: true, subtree: true });
    }

    private decorateAddedGroups(node: HTMLElement): void {
        const groups = node.classList.contains(RadioGroupClass)
            ? [node]
            : [...node.querySelectorAll<HTMLElement>(`.${RadioGroupClass}`)];

        for (const group of groups)
            this.claimGroupName(group);
    }

    /** One rendered group, one name: a copy that finds its name taken renames itself and its radios. */
    private claimGroupName(group: HTMLElement): void {
        const name = group.getAttribute(GroupNameAttribute);

        if (name === null)
            return;

        let taken = false;

        for (const other of this.root.querySelectorAll<HTMLElement>(`.${RadioGroupClass}`)) {
            if (other !== group && other.getAttribute(GroupNameAttribute) === name) {
                taken = true;
                break;
            }
        }

        if (!taken)
            return;

        const unique = `${name}-${++this.renamed}`;

        group.setAttribute(GroupNameAttribute, unique);

        for (const radio of ownDescendants(group, `.${RadioInputClass}`, `.${RadioGroupClass}`) as HTMLInputElement[])
            radio.name = unique;

        // The browser unchecked the group that held the shared name, so every group re-reads its own value.
        for (const other of this.root.querySelectorAll<HTMLElement>(`[${RadioValueAttribute}]`))
            this.sync(other);
    }

    private sync(group: HTMLElement | null): void {
        const value = group?.getAttribute(RadioValueAttribute);

        if (group === null || value === null || value === undefined)
            return;

        const groupDisabled = group.hasAttribute(DisabledAttribute);

        for (const radio of ownDescendants(group, `.${RadioInputClass}`, `.${RadioGroupClass}`) as HTMLInputElement[]) {
            radio.checked = radio.value === value;

            // The native radio sits beside the item template, so the template's own `inert` never reaches it.
            const disabled = groupDisabled || isOptionDisabled(radio);

            if (radio.disabled !== disabled)
                radio.disabled = disabled;
        }
    }

    private decorateAddedItems(node: HTMLElement): void {
        const wrappers = node.classList.contains(ItemWrapperClass)
            ? [node]
            : [...node.querySelectorAll<HTMLElement>(`.${ItemWrapperClass}`)];

        for (const wrapper of wrappers)
            this.decorateItem(wrapper);
    }

    private decorateItem(wrapper: HTMLElement): void {
        if (wrapper.querySelector(`.${RadioInputClass}`) !== null)
            return;

        const group = wrapper.closest<HTMLElement>(`.${RadioGroupClass}`);
        const groupName = group?.getAttribute(GroupNameAttribute);

        if (group === null || group === undefined || groupName === null || groupName === undefined)
            return;

        const input = document.createElement("input");

        input.className = RadioInputClass;
        input.type = "radio";
        input.name = groupName;

        const optionId = wrapper.dataset.uiKey;

        if (optionId !== undefined)
            input.value = optionId;

        const bindValueId = group.getAttribute(BindValueIdAttribute);

        if (bindValueId !== null)
            input.setAttribute("data-ui-bind-value", bindValueId);

        const dot = document.createElement("span");

        dot.className = RadioDotClass;

        wrapper.prepend(input, dot);
        this.sync(group);
    }
}

/** Whether the option this radio stands for is disabled. */
function isOptionDisabled(radio: HTMLInputElement): boolean {
    const wrapper = radio.closest<HTMLElement>(`.${ItemWrapperClass}`);

    return wrapper !== null && (wrapper.classList.contains(DisabledClass) || wrapper.querySelector(`:scope > .${DisabledClass}`) !== null);
}
