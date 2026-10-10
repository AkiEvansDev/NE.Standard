// A control a composite takes out of the Tab order for a while — a control of a row the cursor is not on, a toolbar's control the
// keyboard is not on — keeps the tabindex it had, given back as the composite puts it in again: one mark, so a composite never reads
// another's -1, or its own, as the control's own.

// `.ts` on the value import: `node --test` loads this module as it is.
import { TabOutAttribute } from "../addressing/dom-attributes.ts";

/** Takes a control out of the Tab order, focusable still, keeping the tabindex it had; nothing for one already out. */
export function takeOutOfTabOrder(control: HTMLElement): void {
    if (control.hasAttribute(TabOutAttribute))
        return;

    control.setAttribute(TabOutAttribute, control.getAttribute("tabindex") ?? "");
    control.setAttribute("tabindex", "-1");
}

/** Gives a control taken out the tabindex it had; nothing for one never taken out. */
export function bringBackToTabOrder(control: HTMLElement): void {
    const had = control.getAttribute(TabOutAttribute);

    if (had === null)
        return;

    control.removeAttribute(TabOutAttribute);

    if (had.length === 0)
        control.removeAttribute("tabindex");
    else
        control.setAttribute("tabindex", had);
}

/** Whether a control is a Tab stop of its own, or one a composite took out for now: what a composite's walk counts among its stops. */
export function isOwnTabStop(control: HTMLElement): boolean {
    return control.tabIndex >= 0 || control.hasAttribute(TabOutAttribute);
}
