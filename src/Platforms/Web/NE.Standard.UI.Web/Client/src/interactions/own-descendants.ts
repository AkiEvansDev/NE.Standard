// `.ts` on the value import: `node --test` loads this module as it is.
import { MenuControlEntrySelector, MenuRootClass } from "../addressing/dom-attributes.ts";

/** The matching descendants that belong to this root rather than to one of the same kind nested inside it. */
export function ownDescendants(root: HTMLElement, selector: string, rootSelector: string): HTMLElement[] {
    const own: HTMLElement[] = [];

    for (const element of root.querySelectorAll<HTMLElement>(selector)) {
        if (element.closest(rootSelector) === root)
            own.push(element);
    }

    return own;
}

/** A menu's own control entries, a nested menu's left out: what its arrows walk and its opening lands on. */
export function ownMenuEntries(menu: HTMLElement): HTMLElement[] {
    return ownDescendants(menu, MenuControlEntrySelector, `.${MenuRootClass}`);
}
