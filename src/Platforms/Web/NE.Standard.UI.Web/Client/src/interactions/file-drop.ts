// A file dropped on a field is chosen as a picked one is: one listener set marks the host under the file and hands the drop over
// filtered by `accept`, which the browser does not do for drops. A stray file is refused, or the browser opens it over the page.

type FileDropTarget = {
    /** The component the mark goes on and the files go to. */
    readonly host: HTMLElement;
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

/** How long a leave with no destination waits for the dragover that would prove the file is still over the page. */
const LeaveGrace = 120;

/** The mark's value on a host the drag carries nothing for: the stylesheet reads it and answers in the colour of a refusal. */
const RefusedMark = "refused";

type DropState = {
    /** The hosts wearing the mark: normally one at a time; the set also clears a host the browser never reported a leave for. */
    readonly marked: Set<HTMLElement>;
    /** The pending unmark a destination-less leave armed, or zero. */
    leaving: number;
};

/** Whether the page already refuses a file dropped outside every host. */
let straysRefused = false;

/** Wires the drag events on the root for the hosts `resolveTarget` recognises. */
export function attachFileDrop(options: FileDropOptions): void {
    const state: DropState = { marked: new Set<HTMLElement>(), leaving: 0 };

    refuseStrayFileDrops();

    for (const type of ["dragenter", "dragover", "dragleave", "drop"])
        options.root.addEventListener(type, domEvent => handleDrag(options, state, domEvent), true);

    // The drag ended anywhere — dropped elsewhere, let go outside the window, cancelled.
    options.root.addEventListener("dragend", () => unmarkAll(options, state.marked), true);
    window.addEventListener("blur", () => unmarkAll(options, state.marked));
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
            unmarkAll(options, marked);

        return;
    }

    const { host } = target;

    if (target.refused === true) {
        refuse(domEvent);

        if (domEvent.type !== "dragleave")
            unmarkAll(options, marked);

        return;
    }

    if (domEvent.type === "dragleave") {
        // A hop into a child is not a leave; one with no destination is such a hop, undone by the next dragover, or the file leaving the window.
        if (!(domEvent.relatedTarget instanceof Node))
            state.leaving = window.setTimeout(() => unmarkAll(options, marked), LeaveGrace);
        else if (!host.contains(domEvent.relatedTarget))
            unmark(options, marked, host);

        return;
    }

    domEvent.preventDefault();

    if (domEvent.type !== "drop") {
        // Refused while still in the air, so the "no drop" cursor shows it rather than a green light that hands over nothing.
        const refused = refusesDrag(target.accept, domEvent.dataTransfer);

        if (domEvent.dataTransfer !== null)
            domEvent.dataTransfer.dropEffect = refused ? "none" : "copy";

        for (const other of marked) {
            if (other !== host)
                unmark(options, marked, other);
        }

        marked.add(host);
        host.setAttribute(options.draggingAttribute, refused ? RefusedMark : "");
        return;
    }

    unmarkAll(options, marked);

    const files = [...domEvent.dataTransfer?.files ?? []].filter(file => acceptsFile(target.accept, file));

    if (files.length === 0)
        return;

    options.onFiles(host, target.multiple ? files : [files[0]]);
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
    const rules = accept.split(",").map(entry => entry.trim().toLowerCase()).filter(entry => entry.length > 0);

    // A drag exposes each file's type, never its name.
    if (transfer === null || rules.length === 0 || rules.some(rule => rule.startsWith(".")))
        return false;

    const types = [...transfer.items].filter(item => item.kind === "file").map(item => item.type.toLowerCase());

    if (types.length === 0)
        return false;

    return !types.some(type => rules.some(rule => rule.endsWith("/*") ? type.startsWith(rule.slice(0, -1)) : type === rule));
}

function unmark(options: FileDropOptions, marked: Set<HTMLElement>, host: HTMLElement): void {
    marked.delete(host);
    host.removeAttribute(options.draggingAttribute);
}

function unmarkAll(options: FileDropOptions, marked: Set<HTMLElement>): void {
    for (const host of marked)
        unmark(options, marked, host);
}

/** Whether a dropped file matches the native picker's `accept`: a MIME family, a MIME type, or an extension. */
function acceptsFile(accept: string, file: File): boolean {
    if (accept.trim().length === 0)
        return true;

    const name = file.name.toLowerCase();
    const type = file.type.toLowerCase();

    return accept.split(",").some(entry => {
        const rule = entry.trim().toLowerCase();

        if (rule.length === 0)
            return false;

        if (rule.startsWith("."))
            return name.endsWith(rule);

        return rule.endsWith("/*") ? type.startsWith(rule.slice(0, -1)) : type === rule;
    });
}
