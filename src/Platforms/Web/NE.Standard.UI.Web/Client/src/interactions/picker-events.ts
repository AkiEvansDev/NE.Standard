// A file field's chooser opened from elsewhere (`OpenPickerEffect`): the effect fires one event on the field, and the field's engine
// opens its native picker — in the same task, so the browser still counts the reader's press that raised the effect.

// `node --test` loads this module as it is (the file inputs' test): `.ts` on the value imports.
import { isInert, isReadOnly } from "./interactive-state.ts";

export const OpenPickerEventName = "ui-open-picker";

/** Asks the field to open its chooser; answers whether a file or image input heard the ask, whether or not it could open now. */
export function dispatchOpenPicker(field: Element): boolean {
    return !field.dispatchEvent(new Event(OpenPickerEventName, { bubbles: true, cancelable: true }));
}

/** What a field's engine says about its own fields when asked to open a chooser. */
export type PickerField = {
    /** The field's root, which the ask is fired on. */
    readonly rootSelector: string;
    /** The hidden native picker inside it. */
    readonly nativeSelector: string;
    /** The part whose own press opens the picker, refused as that press would be: a loading surface, a disabled row. */
    readonly pressed: (root: HTMLElement) => Element | null;
};

/** Answers an ask fired on one of the field's roots: heard even when refused, so the effect does not report a wrong target. */
export function answerOpenPicker(domEvent: Event, field: PickerField): void {
    if (!(domEvent.target instanceof Element))
        return;

    const root = domEvent.target.closest<HTMLElement>(field.rootSelector);

    if (root === null)
        return;

    domEvent.preventDefault();

    const native = root.querySelector<HTMLInputElement>(field.nativeSelector);
    const pressed = field.pressed(root);

    if (native === null || native.disabled || pressed === null || isReadOnly(root) || isInert(pressed))
        return;

    native.click();
}
