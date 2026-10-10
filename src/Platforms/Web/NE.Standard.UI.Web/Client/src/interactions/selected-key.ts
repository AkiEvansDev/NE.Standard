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

/**
 * The tab a strip shows, of its shown tabs: the selected key where one carries it, else the first one's — a stale or missing key and a
 * hidden tab alike, as the server's first paint decides it — or null where no tab is shown.
 */
export function resolveShownKey<T>(shown: readonly T[], selected: string, keyOf: (tab: T) => string): string | null {
    if (shown.length === 0)
        return null;

    return shown.some(tab => keyOf(tab) === selected) ? selected : keyOf(shown[0]);
}
