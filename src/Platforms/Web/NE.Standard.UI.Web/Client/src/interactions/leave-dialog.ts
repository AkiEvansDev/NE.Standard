import { clientStrings } from "../runtime/client-strings";
import { DialogEngine } from "./dialog-engine";
import { buildPageDialog, PageDialogParts } from "./page-dialog";

// The framework's own "Leave without saving?": a page dialog (page-dialog.ts) the dialog engine closes on Escape or the backdrop.

const LeaveDialogKey = "ui-leave";
const Parts = new PageDialogParts("data-ui-leave-part");

// The centred panel's cap a view's dialog takes when it names no width (`WebViewRenderer.CenteredDialogWidthCap`).
const CenteredDialogWidthCap = "560px";

// Built once and kept: a page that took it off the body gets it back.
let leaveDialog: HTMLElement | null = null;

// The leave the open dialog asks about, and the engine that opened it: Leave runs it, and Stay, Escape and the backdrop never do.
let pending: { readonly dialogs: DialogEngine; readonly leave: () => void } | null = null;

/** Asks the reader whether to leave: Leave runs `leave`, Stay (first, where the focus lands) keeps the page. */
export function showLeaveDialog(dialogs: DialogEngine, leave: () => void): void {
    leaveDialog ??= buildDialog();

    const dialog = leaveDialog;

    if (!dialog.isConnected)
        document.body.append(dialog);

    // Written at every opening, so a language switched since shows in its words.
    setText(dialog, "title", clientStrings.text("ui.leave.title"));
    setText(dialog, "message", clientStrings.text("ui.leave.message"));
    setText(dialog, "stay", clientStrings.text("ui.leave.stay"));
    setText(dialog, "leave", clientStrings.text("ui.leave.confirm"));

    pending = { dialogs, leave };
    dialogs.open(LeaveDialogKey);
}

function buildDialog(): HTMLElement {
    const { dialog, surface } = buildPageDialog({
        key: LeaveDialogKey,
        className: "ui-leave-dialog",
        role: "alertdialog",
        labelledBy: "ui-leave-title",
        describedBy: "ui-leave-message",
        closesOnEscapeAndBackdrop: true
    });

    surface.style.setProperty("--ui-max-width-sm", CenteredDialogWidthCap);

    const title = Parts.element("h2", "ui-leave-dialog__title ui-text-type--subtitle", "title");
    const message = Parts.element("p", "ui-leave-dialog__message ui-text-type--body", "message");

    title.id = "ui-leave-title";
    message.id = "ui-leave-message";

    // Stay first: the dialog's first control takes the focus, and Enter on it keeps the reader's work.
    surface.append(title, message, Parts.actions(Parts.button("ui-button--outline", "stay"), Parts.button("ui-button--danger", "leave")));

    dialog.addEventListener("click", domEvent => {
        const choice = Parts.pressed(domEvent);

        if (choice !== "stay" && choice !== "leave")
            return;

        const asked = pending;

        pending = null;
        asked?.dialogs.close(LeaveDialogKey);

        if (choice === "leave")
            asked?.leave();
    });

    return dialog;
}

function setText(dialog: HTMLElement, part: string, words: string): void {
    const target = Parts.find(dialog, part);

    if (target !== null && target.textContent !== words)
        target.textContent = words;
}
