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

        this.claimGroupNames([...this.root.querySelectorAll<HTMLElement>(`.${RadioGroupClass}`)]);

        for (const group of this.root.querySelectorAll<HTMLElement>(`.${RadioGroupClass}`))
            this.sync(group);

        if (!(this.root instanceof Node))
            return;

        // Hand-rolled rather than observeComponents: an attribute and an added node call for different work, and only the record says which.
        const observer = new MutationObserver(mutations => {
            const added: HTMLElement[] = [];

            for (const mutation of mutations) {
                if (mutation.type === "attributes" && mutation.target instanceof HTMLElement) {
                    // A class change is an option's Enabled moving: the group it belongs to re-reads its options.
                    this.sync(mutation.target.closest<HTMLElement>(`.${RadioGroupClass}`));
                    continue;
                }

                for (const node of mutation.addedNodes) {
                    if (node instanceof HTMLElement)
                        added.push(node);
                }
            }

            // Groups first, all of a batch at once, since claiming a name reads every group on the page: an item takes its name
            // from the group it lands in.
            this.claimGroupNames(added.flatMap(groupsIn));

            for (const node of added)
                this.decorateAddedItems(node);
        });

        observer.observe(this.root, { attributes: true, attributeFilter: [RadioValueAttribute, DisabledAttribute, "class"], childList: true, subtree: true });
    }

    /**
     * One rendered group, one name: each candidate that finds its name held by another group renames itself and its radios; the
     * last holder keeps the name. The page's names are counted once, so a template's many copies cost one pass, not one each.
     */
    private claimGroupNames(candidates: readonly HTMLElement[]): void {
        if (candidates.length === 0)
            return;

        const holders = new Map<string, number>();

        for (const group of this.root.querySelectorAll<HTMLElement>(`.${RadioGroupClass}`)) {
            const name = group.getAttribute(GroupNameAttribute);

            if (name !== null)
                holders.set(name, (holders.get(name) ?? 0) + 1);
        }

        const shared = new Set<string>();

        for (const group of candidates) {
            const name = group.getAttribute(GroupNameAttribute);
            const count = name === null ? 0 : holders.get(name) ?? 0;

            if (name === null || count < 2)
                continue;

            holders.set(name, count - 1);
            shared.add(name);

            const unique = `${name}-${++this.renamed}`;

            group.setAttribute(GroupNameAttribute, unique);

            for (const radio of ownDescendants(group, `.${RadioInputClass}`, `.${RadioGroupClass}`) as HTMLInputElement[])
                radio.name = unique;

            this.sync(group);
        }

        if (shared.size === 0)
            return;

        // The browser unchecked the group left holding a shared name, so it re-reads its own value too.
        for (const group of this.root.querySelectorAll<HTMLElement>(`.${RadioGroupClass}`)) {
            if (shared.has(group.getAttribute(GroupNameAttribute) ?? ""))
                this.sync(group);
        }
    }

    private sync(group: HTMLElement | null): void {
        if (group === null)
            return;

        // No value is a group with nothing chosen, not one to skip: its radios still take the read-only mark.
        const value = group.getAttribute(RadioValueAttribute);

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

/** The node itself when it is a group, and the groups under it. */
function groupsIn(node: HTMLElement): HTMLElement[] {
    return node.classList.contains(RadioGroupClass) ? [node] : [...node.querySelectorAll<HTMLElement>(`.${RadioGroupClass}`)];
}

/** Whether the option this radio stands for is disabled. */
function isOptionDisabled(radio: HTMLInputElement): boolean {
    const wrapper = radio.closest<HTMLElement>(`.${ItemWrapperClass}`);

    return wrapper !== null && (wrapper.classList.contains(DisabledClass) || wrapper.querySelector(`:scope > .${DisabledClass}`) !== null);
}
