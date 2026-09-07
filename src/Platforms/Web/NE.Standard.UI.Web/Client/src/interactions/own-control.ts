// A control of a row's own: a press on it is the control's and never the row's, and a key typed into it is its own. One list for
// every host with rows, and it names the framework's own popups as well as the native tags — a select's option is a div, not a
// <select>, and a click on it must choose the option, not the row it sits in.

/** The roles a field-opened popup wears — a select's list, a menu, a dialog — shared by every host that must yield keys to one. */
export const PopupRoleSelector = "[role='listbox'], [role='menu'], [role='dialog']";

export const OwnControlSelector = `button, a, input, select, textarea, label, [contenteditable=''], [contenteditable='true'], ${PopupRoleSelector}`;

/** The control of the row's own the event landed on, or null when the press or the key is the row's. */
export function ownControlOf(target: EventTarget | null, row: Element): Element | null {
    if (!(target instanceof Element))
        return null;

    const own = target.closest(OwnControlSelector);

    return own !== null && own !== row && row.contains(own) ? own : null;
}
