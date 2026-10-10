// A control of its own inside a row or a clickable surface: a press or key in it is the control's, never the row's or the surface's.
// One list for both, naming the framework's popups, field boxes and a row's grip beside native tags, since a select's option is a div,
// not a <select>; a clickable surface's wash and press stay off such a control by it (surface-press-engine.ts).

import { ActionBarClass, ListTriggerClass, NoRowOpenAttribute, PopupRoleSelector, RowGripClass } from "../addressing/dom-attributes.ts";

// The box a field draws around its input and its marks: `@ui-input-field-state` in styles/mixins/field.less, which a new field shape joins too.
export const FieldBoxSelector = `.ui-text-input__row, .ui-number-input__row, .ui-temporal-input__row, .ui-file-input__row, .ui-color-input__row, .${ListTriggerClass}, .ui-field-box`;

/** The native controls, a button-like element and an editable region: what every list of a part's own controls starts from. */
export const NativeControlSelector = "button, a, input, select, textarea, label, summary, [role='button'], [contenteditable=''], [contenteditable='true']";

export const ControlSelector = `${NativeControlSelector}, ${FieldBoxSelector}, ${PopupRoleSelector}, .${RowGripClass}`;

/** What presses like a button: the one kind of control a row may be as a whole. */
const PressableSelector = "button, a, summary, [role='button']";

/**
 * The one control a row is — a tile that is a button — or null for a row with none, with several, or with one that is not pressed (a
 * field). Its grip, a popup it holds (its right-click menu), that menu's action bar and a part that answers a press itself (a grid's
 * chevron or checkbox, `data-ui-no-row-open`) are not what the row is, nor is anything inside the control itself.
 */
export function soleControlOf(row: Element): HTMLElement | null {
    const controls: Element[] = [];

    for (const control of row.querySelectorAll(ControlSelector)) {
        if (control.classList.contains(RowGripClass) || !isOwnControlOf(row, control) || isOwnPress(row, control) || controls.some(outer => outer.contains(control)))
            continue;

        controls.push(control);

        if (controls.length > 1)
            return null;
    }

    const sole = controls[0];

    return sole instanceof HTMLElement && sole.matches(PressableSelector) ? sole : null;
}

/** The controls standing in the parts of a row that answer a press themselves (a grid's chevron, its checkbox): the row's keys reach them. */
export function ownPressControlsOf(row: Element): HTMLElement[] {
    const controls: HTMLElement[] = [];

    for (const control of row.querySelectorAll<HTMLElement>(NativeControlSelector)) {
        if (isOwnPress(row, control) && isOwnControlOf(row, control))
            controls.push(control);
    }

    return controls;
}

/** Whether the control stands in a part of the row that answers a press itself rather than standing for the row. */
function isOwnPress(row: Element, control: Element): boolean {
    const part = control.closest(`[${NoRowOpenAttribute}]`);

    return part !== null && part !== row && row.contains(part);
}

/**
 * Whether a control found inside a row or a surface is one of its own: not in a popup it holds (its right-click menu), nor in that
 * menu's action bar, which comes and goes with the pointer.
 */
export function isOwnControlOf(container: Element, control: Element): boolean {
    const popup = control.closest(PopupRoleSelector);

    return (popup === null || !container.contains(popup)) && control.closest(`.${ActionBarClass}`) === null;
}

/** The control of the row's own the event landed on, or null when the press or the key is the row's. */
export function ownControlOf(target: EventTarget | null, row: Element): Element | null {
    if (!(target instanceof Element))
        return null;

    const own = target.closest(ControlSelector);

    return own !== null && own !== row && row.contains(own) ? own : null;
}
