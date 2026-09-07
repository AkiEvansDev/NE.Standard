// Classic head script, imports nothing: applies the stored boot patches to elements as the parser produces them, before the first paint.

(() => {
    const KeyPrefix = "ne.ui:";
    const KeySuffix = ":boot";
    const NameAttribute = "data-ui-name";

    type BootPatch = {
        readonly selector?: string;
        readonly attributes?: Readonly<Record<string, string | null>>;
        readonly styles?: Readonly<Record<string, string>>;
    };

    const patchesByName = new Map<string, readonly BootPatch[]>();

    try {
        for (let index = 0; index < localStorage.length; index++) {
            const key = localStorage.key(index);

            if (key === null || !key.startsWith(KeyPrefix) || !key.endsWith(KeySuffix))
                continue;

            const name = key.slice(KeyPrefix.length, key.length - KeySuffix.length);

            try {
                const stored = JSON.parse(localStorage.getItem(key) ?? "{}") as Record<string, BootPatch>;

                patchesByName.set(name, Object.values(stored));
            }
            catch {
                // Unreadable entry; the runtime drops it on its next write.
            }
        }
    }
    catch {
        // No storage: nothing was ever kept, so the server's shape is right.
        return;
    }

    if (patchesByName.size === 0)
        return;

    function isAllowedAttributeName(name: string): boolean {
        return name.startsWith("data-") || name.startsWith("aria-") || name === "class" || name === "hidden";
    }

    const done = new WeakSet<Element>();
    const pending = new Set<Element>();

    /** Applies the element's patches; answers whether every target was there to take them. */
    function apply(element: Element): boolean {
        const patches = patchesByName.get(element.getAttribute(NameAttribute) ?? "");

        if (patches === undefined)
            return true;

        let complete = true;

        for (const patch of patches) {
            const target = patch.selector === undefined ? element : element.querySelector(patch.selector);

            if (target === null) {
                complete = false;
                continue;
            }

            // A patch is the viewer's own past write read back out of storage, but the parser still trusts it sight unseen —
            // the same allowlist a compromised or hand-edited entry cannot widen: `data-`/`aria-` plus the two bare names an
            // engine ever passes, and only the custom properties every engine's boot patch is actually made of.
            for (const [name, value] of Object.entries(patch.attributes ?? {})) {
                if (!isAllowedAttributeName(name))
                    continue;

                if (value === null)
                    target.removeAttribute(name);
                else if (target.getAttribute(name) !== value)
                    target.setAttribute(name, value);
            }

            if (target instanceof HTMLElement) {
                for (const [property, value] of Object.entries(patch.styles ?? {})) {
                    if (property.startsWith("--"))
                        target.style.setProperty(property, value);
                }
            }
        }

        return complete;
    }

    function visit(root: Element): void {
        const candidates = root.hasAttribute(NameAttribute) ? [root, ...root.querySelectorAll(`[${NameAttribute}]`)] : root.querySelectorAll(`[${NameAttribute}]`);

        for (const element of candidates) {
            if (done.has(element))
                continue;

            if (apply(element))
                done.add(element);
            else
                pending.add(element);
        }
    }

    function retryPending(): void {
        for (const element of pending) {
            if (apply(element)) {
                pending.delete(element);
                done.add(element);
            }
        }
    }

    const observer = new MutationObserver(records => {
        for (const record of records) {
            for (const node of record.addedNodes) {
                if (node instanceof Element)
                    visit(node);
            }
        }

        retryPending();
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });

    document.addEventListener("DOMContentLoaded", () => {
        visit(document.documentElement);
        retryPending();
        observer.disconnect();
    });
})();
