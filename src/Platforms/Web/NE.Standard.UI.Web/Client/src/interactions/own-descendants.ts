// `.ts` on the value import: `node --test` loads this module as it is.
import { MenuControlEntrySelector, MenuRootClass } from "../addressing/dom-attributes.ts";
import { ownDescendants } from "../addressing/dom-registry.ts";

export { ownDescendants };

/** A menu's own control entries, a nested menu's left out: what its arrows walk and its opening lands on. */
export function ownMenuEntries(menu: HTMLElement): HTMLElement[] {
    return ownDescendants(menu, MenuControlEntrySelector, `.${MenuRootClass}`);
}
