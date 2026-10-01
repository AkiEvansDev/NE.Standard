// A control of its own inside a row or a clickable surface: a press or key in it is the control's, never the row's or the surface's.
// One list for both, naming the framework's popups, field boxes and a row's grip beside native tags, since a select's option is a div,
// not a <select>; `@ui-surface-inner-control` in ui-surface.less is its twin (surface-controls.test.ts).

import { ActionBarClass, ListTriggerClass, PopupRoleSelector, RowGripClass } from "../addressing/dom-attributes.ts";

// The box a field draws around its input and its marks: `@ui-input-field-state` in styles/mixins/field.less, which a new field shape joins too.
export const FieldBoxSelector = `.ui-text-input__row, .ui-number-input__row, .ui-temporal-input__row, .ui-file-input__row, .ui-color-input__row, .${ListTriggerClass}, .ui-field-box`;

export const ControlSelector = `button, a, input, select, textarea, label, summary, [role='button'], [contenteditable=''], [contenteditable='true'], ${FieldBoxSelector}, ${PopupRoleSelector}, .${RowGripClass}`;

/** What presses like a button: the one kind of control a row may be as a whole. */
const PressableSelector = "button, a, summary, [role='button']";

/**
 * The one control a row is — a tile that is a button — or null for a row with none, with several, or with one that is not pressed (a
 * field). Its grip, a popup it holds (its right-click menu) and that menu's action bar are not what the row is, nor is anything inside
 * the control itself.
 */
export function soleControlOf(row: Element): HTMLElement | null {
    const controls: Element[] = [];

    for (const control of row.querySelectorAll(ControlSelector)) {
        const popup = control.closest(PopupRoleSelector);

        if (control.classList.contains(RowGripClass) || (popup !== null && row.contains(popup)) || control.closest(`.${ActionBarClass}`) !== null || controls.some(outer => outer.contains(control)))
            continue;

        controls.push(control);

        if (controls.length > 1)
            return null;
    }

    const sole = controls[0];

    return sole instanceof HTMLElement && sole.matches(PressableSelector) ? sole : null;
}

/** The control of the row's own the event landed on, or null when the press or the key is the row's. */
export function ownControlOf(target: EventTarget | null, row: Element): Element | null {
    if (!(target instanceof Element))
        return null;

    const own = target.closest(ControlSelector);

    return own !== null && own !== row && row.contains(own) ? own : null;
}
