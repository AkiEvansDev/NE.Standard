// The browser's own form a field with a FormId joins (`form="ui-form-<id>"`), so a password manager and autofill read each form
// apart. The shell writes a hidden form per FormId the view names; this points a field whose FormId is bound at its form, making
// the form where the page has none. Nothing here submits or validates: the framework's form is still `data-ui-form-id`.

import { cssAttributeValue, FormsHolderAttribute } from "../addressing/dom-attributes.ts";

/** The operation's kind, as `WebForms.OwnerOperationKind` spells it on the server. */
export const FormOwnerOperationKind = "form-owner";

const FormElementIdPrefix = "ui-form-";

/** The id of the hidden form `formId` stands for, as `WebForms.ElementId` writes it: an id holds no whitespace, so each is `_`. */
export function formElementId(formId: string): string {
    return FormElementIdPrefix + formId.replace(/[ \t\n\f\r]/g, "_");
}

/** Points `target` at the form of `formId`, made where the page has none; with no FormId it stands in the page's form again. */
export function writeFormOwner(target: Element, formId: unknown): void {
    if (typeof formId !== "string" || formId.trim().length === 0) {
        if (target.hasAttribute("form"))
            target.removeAttribute("form");

        return;
    }

    const id = formElementId(formId);

    ensureForm(id);

    if (target.getAttribute("form") !== id)
        target.setAttribute("form", id);
}

/**
 * Makes the forms the fields under `scope` point at and the page does not hold: a FormId bound to the controller, which the server
 * rendered with its value but could not know when it wrote the forms.
 */
export function ensureFormOwners(scope: ParentNode): void {
    for (const field of scope.querySelectorAll("[form]")) {
        const id = field.getAttribute("form");

        if (id !== null && id.startsWith(FormElementIdPrefix))
            ensureForm(id);
    }
}

function ensureForm(id: string): void {
    const holder = formsHolder();

    if (holder.querySelector(`form[id="${cssAttributeValue(id)}"]`) !== null)
        return;

    // As the shell writes one: a submission is a no-op of `dialog`, never a navigation, and the browser's own checks stay off.
    const form = document.createElement("form");

    form.setAttribute("id", id);
    form.setAttribute("method", "dialog");
    form.setAttribute("novalidate", "");
    holder.appendChild(form);
}

function formsHolder(): Element {
    const holder = document.body.querySelector(`[${FormsHolderAttribute}]`);

    if (holder !== null)
        return holder;

    // Beside the root, as the shell writes it: a form may not stand inside the root's form.
    const created = document.createElement("div");

    created.setAttribute(FormsHolderAttribute, "");
    created.setAttribute("hidden", "");

    return document.body.appendChild(created);
}
