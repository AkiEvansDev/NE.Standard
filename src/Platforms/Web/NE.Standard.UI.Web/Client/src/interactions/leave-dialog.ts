import { clientStrings } from "../runtime/client-strings";
import { DialogEngine } from "./dialog-engine";
import { DialogAttribute, ModalAttribute } from "./open-dialogs";

// The framework's own "Leave without saving?": a dialog the page builds itself, since no view declares it, in the markup and the
// stylesheet a declared one wears, so the dialog engine opens it, traps the focus in it and closes it on Escape or the backdrop.

const LeaveDialogKey = "ui-leave";
const PartAttribute = "data-ui-leave-part";

// The centred panel's cap a view's dialog takes when it names no width (`WebViewRenderer.CenteredDialogWidthCap`).
const CenteredDialogWidthCap = "560px";

// The leave the open dialog asks about: Leave runs it, and Stay, Escape and the backdrop never do.
let pendingLeave: (() => void) | null = null;

/** Asks the reader whether to leave: Leave runs `leave`, Stay (first, where the focus lands) keeps the page. */
export function showLeaveDialog(dialogs: DialogEngine, leave: () => void): void {
    const dialog = document.querySelector<HTMLElement>(`[${DialogAttribute}="${LeaveDialogKey}"]`) ?? buildDialog(dialogs);

    // Written at every opening, so a language switched since shows in its words.
    setText(dialog, "title", clientStrings.text("ui.leave.title"));
    setText(dialog, "message", clientStrings.text("ui.leave.message"));
    setText(dialog, "stay", clientStrings.text("ui.leave.stay"));
    setText(dialog, "leave", clientStrings.text("ui.leave.confirm"));

    pendingLeave = leave;
    dialogs.open(LeaveDialogKey);
}

function buildDialog(dialogs: DialogEngine): HTMLElement {
    const dialog = element("div", "ui-dialog ui-leave-dialog");

    dialog.setAttribute(DialogAttribute, LeaveDialogKey);
    dialog.setAttribute(ModalAttribute, "");
    dialog.setAttribute("data-ui-dialog-close-escape", "");
    dialog.setAttribute("data-ui-dialog-close-backdrop", "");
    dialog.setAttribute("hidden", "");

    const backdrop = element("div", "ui-dialog__backdrop");

    backdrop.setAttribute("data-ui-dialog-backdrop", "");

    const surface = element("div", "ui-dialog__surface");

    surface.setAttribute("role", "alertdialog");
    surface.setAttribute("tabindex", "-1");
    surface.setAttribute("aria-modal", "true");
    surface.setAttribute("aria-labelledby", "ui-leave-title");
    surface.setAttribute("aria-describedby", "ui-leave-message");
    surface.style.setProperty("--ui-max-width-sm", CenteredDialogWidthCap);

    const title = element("h2", "ui-leave-dialog__title ui-text-type--subtitle", "title");
    const message = element("p", "ui-leave-dialog__message ui-text-type--body", "message");

    title.id = "ui-leave-title";
    message.id = "ui-leave-message";

    // Stay first: the dialog's first control takes the focus, and Enter on it keeps the reader's work.
    const actions = element("div", "ui-leave-dialog__actions");

    actions.append(button("ui-button--outline", "stay"), button("ui-button--danger", "leave"));
    surface.append(title, message, actions);
    dialog.append(backdrop, surface);

    dialog.addEventListener("click", domEvent => {
        const choice = domEvent.target instanceof Element ? domEvent.target.closest(`[${PartAttribute}]`)?.getAttribute(PartAttribute) : null;

        if (choice !== "stay" && choice !== "leave")
            return;

        const leave = pendingLeave;

        pendingLeave = null;
        dialogs.close(LeaveDialogKey);

        if (choice === "leave")
            leave?.();
    });

    document.body.append(dialog);

    return dialog;
}

function button(look: string, choice: string): HTMLButtonElement {
    const pressable = element("button", `ui-button ${look}`, choice) as HTMLButtonElement;

    pressable.type = "button";

    return pressable;
}

function element(tagName: string, className: string, part?: string): HTMLElement {
    const created = document.createElement(tagName);

    created.className = className;

    if (part !== undefined)
        created.setAttribute(PartAttribute, part);

    return created;
}

function setText(dialog: HTMLElement, part: string, words: string): void {
    const target = dialog.querySelector(`[${PartAttribute}="${part}"]`);

    if (target !== null && target.textContent !== words)
        target.textContent = words;
}
