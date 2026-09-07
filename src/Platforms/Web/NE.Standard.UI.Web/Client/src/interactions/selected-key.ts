export type SelectedKeyOptions = {
    /** The attribute on the root that holds the current key. */
    readonly attribute: string;
    /** The generic binding attribute `RenderProperty` emits for the two-way property. */
    readonly bindingAttribute: string;
    /** What follows the key changing — marking the current caption, showing its page. */
    readonly apply: (root: HTMLElement) => void;
};

/** Moves a strip's selected key: writes it, applies it, and raises "change" where the property is bound. */
export function writeSelectedKey(root: HTMLElement, key: string, options: SelectedKeyOptions): void {
    if (key.length === 0 || root.getAttribute(options.attribute) === key)
        return;

    root.setAttribute(options.attribute, key);
    options.apply(root);

    if (root.hasAttribute(options.bindingAttribute))
        root.dispatchEvent(new Event("change", { bubbles: true }));
}
