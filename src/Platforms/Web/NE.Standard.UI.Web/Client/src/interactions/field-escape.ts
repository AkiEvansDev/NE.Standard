// A field whose Escape is its own cancel (`TextInputComponent.OnEscape`, `TextAreaComponent.OnEscape`), told apart wherever Escape is
// shared: the field keys engine runs the cancel, and a dialog or a popup leaves the key to it. Apart from the engine, so the dialog and
// the popups need nothing of its imports.

// `.ts` on the value imports: `node --test` loads this module as it is.
import { isInert } from "./interactive-state.ts";

const RunsOnEscapeAttribute = "data-ui-runs-on-escape";

/** Whether a key landed in a field whose Escape is its own cancel; a read-only or inert one keeps Escape's ordinary leave. */
export function isCancellingField(target: EventTarget | null): target is HTMLInputElement | HTMLTextAreaElement {
    return target instanceof Element
        && target.hasAttribute(RunsOnEscapeAttribute)
        && (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)
        && !target.readOnly
        && !isInert(target);
}
