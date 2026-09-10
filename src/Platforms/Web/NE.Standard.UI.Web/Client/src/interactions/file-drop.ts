// A file dragged onto a field is chosen the way a picked one is. One listener set for every host that takes a drop — the file
// input's row, the image input's surface: the host is marked while a file is over it, and the drop hands the files over, filtered
// the way the native picker's `accept` would have, since a drop is not filtered by the dialog.

export type FileDropTarget = {
    /** The component the mark goes on and the files go to. */
    readonly host: HTMLElement;
    /** The native picker's `accept`, which the drop honours; empty takes anything. */
    readonly accept: string;
    /** Whether more than one file is taken; otherwise the first. */
    readonly multiple: boolean;
};

export type FileDropOptions = {
    readonly root: ParentNode;
    /** The host the event's target belongs to, or null when the target takes no drop (another element, a read-only or disabled host). */
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
    /** The hosts wearing the mark: one at a time, since a file is over one place; the set is what takes it off a host the browser never
     * reported a leave for — a drag carried from one field straight onto the next left the first one marked. */
    readonly marked: Set<HTMLElement>;
    /** The pending unmark a destination-less leave armed, or zero. */
    leaving: number;
};

/** Wires the drag events on the root for the hosts `resolveTarget` recognises. */
export function attachFileDrop(options: FileDropOptions): void {
    const state: DropState = { marked: new Set<HTMLElement>(), leaving: 0 };

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

    // Not a file at all — dragging a tab, a row, a text selection — so this is nobody's drop to mark or prevent; a file over
    // something that is not a host takes the mark off whichever host had it.
    if (target === null || !(domEvent.dataTransfer?.types.includes("Files") ?? false)) {
        if (target === null && domEvent.type === "dragover")
            unmarkAll(options, marked);

        return;
    }

    const { host } = target;

    if (domEvent.type === "dragleave") {
        // Crossing into a child of the host is not leaving it. A leave with no destination is either such a hop — the next dragover
        // takes the unmark back — or the file leaving the window, which nothing else reports for a drag the page never started.
        if (!(domEvent.relatedTarget instanceof Node))
            state.leaving = window.setTimeout(() => unmarkAll(options, marked), LeaveGrace);
        else if (!host.contains(domEvent.relatedTarget))
            unmark(options, marked, host);

        return;
    }

    domEvent.preventDefault();

    if (domEvent.type !== "drop") {
        // A file the field would refuse anyway is refused while it is still in the air: the mark says so and the browser draws the
        // "no drop" cursor, so the reader is not told green and then handed nothing.
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

/**
 * Whether the target would refuse everything the drag carries. A drag exposes each file's type and never its name, so this answers
 * only where the rule is written in types: a rule with an extension in it, or a browser that withholds the types until the drop, read
 * as "cannot tell" and the drag is let through to be judged on arrival. A file whose type the browser does not know is decidable all
 * the same — a rule of types has nothing for it to match, and `acceptsFile` refuses it on the drop for the very same reason.
 */
function refusesDrag(accept: string, transfer: DataTransfer | null): boolean {
    const rules = accept.split(",").map(entry => entry.trim().toLowerCase()).filter(entry => entry.length > 0);

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
export function acceptsFile(accept: string, file: File): boolean {
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
