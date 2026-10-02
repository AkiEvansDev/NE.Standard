// A dialog the page builds itself, since no view declares it — the leave question, the image crop — in the markup and the
// stylesheet a declared one wears, so the dialog engine opens it, traps the focus in it and gives the focus back.

// `node --test` loads this module as it is (the image input's test): `.ts` on the value imports.
import { DialogSurfaceClass } from "../addressing/dom-attributes.ts";
import { BackdropAttribute, CloseOnBackdropAttribute, CloseOnEscapeAttribute, DialogAttribute, ModalAttribute } from "./open-dialogs.ts";

export type PageDialogOptions = {
    readonly key: string;
    /** The dialog's own class, beside `ui-dialog`. */
    readonly className: string;
    /** A class of its own on the surface, beside the framework's. */
    readonly surfaceClassName?: string;
    readonly role: "dialog" | "alertdialog";
    readonly labelledBy: string;
    readonly describedBy?: string;
    /** Whether the dialog engine closes it on Escape and a backdrop press; a dialog that answers both itself takes neither. */
    readonly closesOnEscapeAndBackdrop: boolean;
};

export type PageDialog = {
    readonly dialog: HTMLElement;
    readonly surface: HTMLElement;
};

/** A hidden modal dialog with its backdrop and surface, not yet on the page; the caller fills the surface and appends it. */
export function buildPageDialog(options: PageDialogOptions): PageDialog {
    const dialog = document.createElement("div");

    dialog.className = `ui-dialog ${options.className}`;
    dialog.setAttribute(DialogAttribute, options.key);
    dialog.setAttribute(ModalAttribute, "");

    if (options.closesOnEscapeAndBackdrop) {
        dialog.setAttribute(CloseOnEscapeAttribute, "");
        dialog.setAttribute(CloseOnBackdropAttribute, "");
    }

    dialog.setAttribute("hidden", "");

    const backdrop = document.createElement("div");

    backdrop.className = "ui-dialog__backdrop";
    backdrop.setAttribute(BackdropAttribute, "");

    const surface = document.createElement("div");

    surface.className = options.surfaceClassName === undefined ? DialogSurfaceClass : `${DialogSurfaceClass} ${options.surfaceClassName}`;
    surface.setAttribute("role", options.role);
    surface.setAttribute("tabindex", "-1");
    surface.setAttribute("aria-modal", "true");
    surface.setAttribute("aria-labelledby", options.labelledBy);

    if (options.describedBy !== undefined)
        surface.setAttribute("aria-describedby", options.describedBy);

    dialog.append(backdrop, surface);

    return { dialog, surface };
}

/** The parts of one page dialog, named by its own attribute so a press is read back as the part it landed on. */
export class PageDialogParts {
    private readonly partAttribute: string;

    public constructor(partAttribute: string) {
        this.partAttribute = partAttribute;
    }

    public element(tagName: string, className: string, part?: string): HTMLElement {
        const created = document.createElement(tagName);

        created.className = className;

        if (part !== undefined)
            created.setAttribute(this.partAttribute, part);

        return created;
    }

    /** One of the dialog's answers, a framework button in the look given. */
    public button(look: string, part: string): HTMLButtonElement {
        const pressable = this.element("button", `ui-button ${look}`, part) as HTMLButtonElement;

        pressable.type = "button";

        return pressable;
    }

    /** The answers' row, at the dialog's end. */
    public actions(...buttons: HTMLButtonElement[]): HTMLElement {
        const actions = this.element("div", "ui-dialog__actions");

        actions.append(...buttons);

        return actions;
    }

    public find(dialog: HTMLElement, part: string): HTMLElement | null {
        return dialog.querySelector<HTMLElement>(`[${this.partAttribute}="${part}"]`);
    }

    /** The part a press landed in, or null. */
    public pressed(domEvent: Event): string | null {
        return domEvent.target instanceof Element ? domEvent.target.closest(`[${this.partAttribute}]`)?.getAttribute(this.partAttribute) ?? null : null;
    }
}
