const RadioValueAttribute = "data-ui-radio-value";
const RadioInputClass = "ui-radio-group__input";
const RadioDotClass = "ui-radio-group__dot";
const RadioGroupClass = "ui-radio-group";
const ItemWrapperClass = "ui-radio-group__item";
const GroupNameAttribute = "data-ui-radio-group-name";
const BindValueIdAttribute = "data-ui-radio-bind-value-id";
const DisabledAttribute = "data-ui-radio-disabled";

export type RadioGroupSyncEngineOptions = {
    readonly root?: ParentNode;
};

export class RadioGroupSyncEngine {
    private readonly root: ParentNode;

    public constructor(options: RadioGroupSyncEngineOptions = {}) {
        this.root = options.root ?? document;

        for (const group of this.root.querySelectorAll<HTMLElement>(`[${RadioValueAttribute}]`))
            this.sync(group);

        if (!(this.root instanceof Node))
            return;

        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                if (mutation.type === "attributes" && mutation.target instanceof HTMLElement) {
                    this.sync(mutation.target);
                    continue;
                }

                for (const node of mutation.addedNodes) {
                    if (node instanceof HTMLElement)
                        this.decorateAddedItems(node);
                }
            }
        });

        observer.observe(this.root, { attributes: true, attributeFilter: [RadioValueAttribute], childList: true, subtree: true });
    }

    private sync(group: HTMLElement): void {
        const value = group.getAttribute(RadioValueAttribute);

        if (value === null)
            return;

        for (const radio of group.querySelectorAll<HTMLInputElement>(`.${RadioInputClass}`))
            radio.checked = radio.value === value;
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

        if (group.hasAttribute(DisabledAttribute))
            input.disabled = true;

        const dot = document.createElement("span");

        dot.className = RadioDotClass;

        wrapper.prepend(input, dot);
        this.sync(group);
    }
}
