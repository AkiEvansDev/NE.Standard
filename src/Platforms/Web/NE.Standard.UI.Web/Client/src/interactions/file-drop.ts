// A file dropped or pasted on a field is chosen as a picked one is: one listener set marks the host under the file and hands the
// drop over filtered by `accept`, which the browser does not do for drops. A stray file is refused, or the browser opens it over
// the page. A field with a drop target (`DropTargetId`) takes the files let go or pasted on that other component — a composer — too.

// `node --test` loads this module as it is (the image input's test): `.ts` on the value imports.
import { ComponentIdAttribute, cssAttributeValue, FileDropTargetIdAttribute } from "../addressing/dom-attributes.ts";

type FileDropTarget = {
    /** The component the files go to, and the mark while a file is over it. */
    readonly host: HTMLElement;
    /** Where the mark goes when it is another component than the host: the drop target the file is over. */
    readonly mark?: HTMLElement;
    /** The native picker's `accept`, which the drop honours; empty takes anything. */
    readonly accept: string;
    /** Whether more than one file is taken; otherwise the first. */
    readonly multiple: boolean;
    /** A host that takes no file now (read-only, disabled): the drop is refused in place, unmarked, rather than left to the browser. */
    readonly refused?: boolean;
};

export type FileDropOptions = {
    readonly root: ParentNode;
    /** The host the event's target belongs to, or null when the target is no host's. */
    readonly resolveTarget: (target: Element) => FileDropTarget | null;
    /** On the host while a file is over it. */
    readonly draggingAttribute: string;
    readonly onFiles: (host: HTMLElement, files: readonly File[]) => void;
};

/** On a drop target while a file is over it, as a field's own dragging attribute is on the field; the stylesheet reads it. */
const DropOverAttribute = "data-ui-file-drop-over";

/** How long a leave with no destination waits for the dragover that would prove the file is still over the page. */
const LeaveGrace = 120;

/** The mark's value on a host the drag carries nothing for: the stylesheet reads it and answers in the colour of a refusal. */
const RefusedMark = "refused";

type DropState = {
    /** The elements wearing a mark and the attribute each wears: normally one at a time; the map also clears one the browser never reported a leave for. */
    readonly marked: Map<HTMLElement, string>;
    /** The pending unmark a destination-less leave armed, or zero. */
    leaving: number;
};

/** Whether the page already refuses a file dropped outside every host. */
let straysRefused = false;

/** Wires the drag events and the paste on the root for the hosts `resolveTarget` recognises. */
export function attachFileDrop(options: FileDropOptions): void {
    const state: DropState = { marked: new Map<HTMLElement, string>(), leaving: 0 };

    refuseStrayFileDrops();

    for (const type of ["dragenter", "dragover", "dragleave", "drop"])
        options.root.addEventListener(type, domEvent => handleDrag(options, state, domEvent), true);

    // The drag ended anywhere — dropped elsewhere, let go outside the window, cancelled.
    options.root.addEventListener("dragend", () => unmarkAll(state.marked), true);
    window.addEventListener("blur", () => unmarkAll(state.marked));

    options.root.addEventListener("paste", domEvent => handlePaste(options, domEvent), true);
}

function handleDrag(options: FileDropOptions, state: DropState, domEvent: Event): void {
    if (!(domEvent instanceof DragEvent) || !(domEvent.target instanceof Element))
        return;

    const marked = state.marked;

    // Anything but a leave proves the file is still over the page, so the leave that armed an unmark is taken back.
    if (domEvent.type !== "dragleave" && state.leaving !== 0) {
        window.clearTimeout(state.leaving);
        state.leaving = 0;
    }

    const target = options.resolveTarget(domEvent.target);

    // Not a file (a tab, a row, a selection) is nobody's drop; a file over a non-host element clears whichever host was marked.
    if (target === null || !(domEvent.dataTransfer?.types.includes("Files") ?? false)) {
        if (target === null && domEvent.type === "dragover")
            unmarkAll(marked);

        return;
    }

    const mark = target.mark ?? target.host;

    if (target.refused === true) {
        refuse(domEvent);

        if (domEvent.type !== "dragleave")
            unmarkAll(marked);

        return;
    }

    if (domEvent.type === "dragleave") {
        // A hop into a child is not a leave; one with no destination is such a hop, undone by the next dragover, or the file leaving the window.
        if (!(domEvent.relatedTarget instanceof Node))
            state.leaving = window.setTimeout(() => unmarkAll(marked), LeaveGrace);
        else if (!mark.contains(domEvent.relatedTarget))
            unmark(marked, mark);

        return;
    }

    domEvent.preventDefault();

    if (domEvent.type !== "drop") {
        // Refused while still in the air, so the "no drop" cursor shows it rather than a green light that hands over nothing.
        const refused = refusesDrag(target.accept, domEvent.dataTransfer);

        if (domEvent.dataTransfer !== null)
            domEvent.dataTransfer.dropEffect = refused ? "none" : "copy";

        for (const other of marked.keys()) {
            if (other !== mark)
                unmark(marked, other);
        }

        const attribute = target.mark === undefined ? options.draggingAttribute : DropOverAttribute;

        marked.set(mark, attribute);
        mark.setAttribute(attribute, refused ? RefusedMark : "");
        return;
    }

    unmarkAll(marked);

    const files = [...domEvent.dataTransfer?.files ?? []].filter(file => acceptsFile(target.accept, file));

    if (files.length === 0)
        return;

    options.onFiles(target.host, target.multiple ? files : [files[0]]);
}

/** A picture pasted on a host — a screenshot, a copied file — is chosen as a dropped one is. */
function handlePaste(options: FileDropOptions, domEvent: Event): void {
    if (!(domEvent instanceof ClipboardEvent) || !(domEvent.target instanceof Element))
        return;

    const transfer = domEvent.clipboardData;

    if (transfer === null || transfer.files.length === 0)
        return;

    // Words go to the field they are pasted in: a copy out of a document carries a picture of the words beside them.
    if (transfer.getData("text/plain").trim().length > 0)
        return;

    const target = options.resolveTarget(domEvent.target);

    if (target === null || target.refused === true)
        return;

    const files = [...transfer.files].filter(file => acceptsFile(target.accept, file));

    if (files.length === 0)
        return;

    domEvent.preventDefault();
    options.onFiles(target.host, target.multiple ? files : [files[0]]);
}

/**
 * The field whose drop target holds `target` — the nearest such component — and that component, or null where none names one; a
 * field inside the component comes before one elsewhere, so a row's input takes its own row's drops.
 */
export function findDropTargetField(root: ParentNode, target: Element, fieldSelector: string): { readonly field: HTMLElement; readonly component: HTMLElement } | null {
    for (let component = target.closest<HTMLElement>(`[${ComponentIdAttribute}]`); component !== null; component = component.parentElement?.closest<HTMLElement>(`[${ComponentIdAttribute}]`) ?? null) {
        const id = component.getAttribute(ComponentIdAttribute) ?? "";
        const fields = [...root.querySelectorAll<HTMLElement>(`${fieldSelector}[${FileDropTargetIdAttribute}="${cssAttributeValue(id)}"]`)];

        if (fields.length > 0)
            return { field: fields.find(field => component.contains(field)) ?? fields[0], component };
    }

    return null;
}

/** Refuses a file over the page that no host took, on the window after every listener, so a package's own drop target gets it first. */
function refuseStrayFileDrops(): void {
    if (straysRefused)
        return;

    straysRefused = true;

    for (const type of ["dragover", "drop"]) {
        window.addEventListener(type, domEvent => {
            if (domEvent instanceof DragEvent && !domEvent.defaultPrevented && (domEvent.dataTransfer?.types.includes("Files") ?? false))
                refuse(domEvent);
        });
    }
}

/** Takes the drop from the browser and shows the "no drop" cursor. */
function refuse(domEvent: DragEvent): void {
    if (domEvent.type === "dragleave")
        return;

    domEvent.preventDefault();

    if (domEvent.dataTransfer !== null)
        domEvent.dataTransfer.dropEffect = "none";
}

/** Whether the target would refuse everything the drag carries; an extension rule is let through, to be judged on the drop. */
function refusesDrag(accept: string, transfer: DataTransfer | null): boolean {
    const rules = acceptRules(accept);

    // A drag exposes each file's type, never its name.
    if (transfer === null || rules.length === 0 || rules.some(rule => rule.startsWith(".")))
        return false;

    const types = [...transfer.items].filter(item => item.kind === "file").map(item => item.type.toLowerCase());

    if (types.length === 0)
        return false;

    return !types.some(type => rules.some(rule => matchesType(rule, type)));
}

/** The native picker's `accept` as its rules, each trimmed and lower-cased; none takes anything. */
function acceptRules(accept: string): string[] {
    return accept.split(",").map(entry => entry.trim().toLowerCase()).filter(entry => entry.length > 0);
}

/** Whether a MIME type answers a type rule: a family (`image/*`) or the type itself. */
function matchesType(rule: string, type: string): boolean {
    return rule.endsWith("/*") ? type.startsWith(rule.slice(0, -1)) : type === rule;
}

function unmark(marked: Map<HTMLElement, string>, element: HTMLElement): void {
    const attribute = marked.get(element);

    marked.delete(element);

    if (attribute !== undefined)
        element.removeAttribute(attribute);
}

function unmarkAll(marked: Map<HTMLElement, string>): void {
    for (const element of [...marked.keys()])
        unmark(marked, element);
}

/** Whether a dropped file matches the native picker's `accept`: a MIME family, a MIME type, or an extension. */
export function acceptsFile(accept: string, file: File): boolean {
    const rules = acceptRules(accept);

    if (rules.length === 0)
        return true;

    const name = file.name.toLowerCase();
    const type = file.type.toLowerCase();

    return rules.some(rule => rule.startsWith(".") ? name.endsWith(rule) : matchesType(rule, type));
}
