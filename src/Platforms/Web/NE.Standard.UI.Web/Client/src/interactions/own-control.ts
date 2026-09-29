// A control of a row's own: a press or key in it is the control's, never the row's. One list for every host with rows, naming the
// framework's popups and field boxes beside native tags, since a select's option is a div, not a <select>.

import { ListTriggerClass, PopupRoleSelector } from "../addressing/dom-attributes.ts";

// The box a field draws around its input and its marks: `@ui-input-field-state` in styles/mixins/field.less, which a new field shape joins too.
export const FieldBoxSelector = `.ui-text-input__row, .ui-number-input__row, .ui-temporal-input__row, .ui-file-input__row, .ui-color-input__row, .${ListTriggerClass}, .ui-field-box`;

const OwnControlSelector = `button, a, input, select, textarea, label, [contenteditable=''], [contenteditable='true'], ${FieldBoxSelector}, ${PopupRoleSelector}`;

/** The control of the row's own the event landed on, or null when the press or the key is the row's. */
export function ownControlOf(target: EventTarget | null, row: Element): Element | null {
    if (!(target instanceof Element))
        return null;

    const own = target.closest(OwnControlSelector);

    return own !== null && own !== row && row.contains(own) ? own : null;
}
