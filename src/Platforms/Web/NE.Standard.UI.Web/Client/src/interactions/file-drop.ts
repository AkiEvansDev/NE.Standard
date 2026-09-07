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

/** Wires the four drag events on the root for the hosts `resolveTarget` recognises. */
export function attachFileDrop(options: FileDropOptions): void {
    for (const type of ["dragenter", "dragover", "dragleave", "drop"])
        options.root.addEventListener(type, domEvent => handleDrag(options, domEvent), true);
}

function handleDrag(options: FileDropOptions, domEvent: Event): void {
    if (!(domEvent instanceof DragEvent) || !(domEvent.target instanceof Element))
        return;

    const target = options.resolveTarget(domEvent.target);

    // Not a file at all — dragging a tab, a row, a text selection — so this is nobody's drop to mark or prevent.
    if (target === null || !(domEvent.dataTransfer?.types.includes("Files") ?? false))
        return;

    const { host } = target;

    if (domEvent.type === "dragleave") {
        // Crossing into a child of the host is not leaving it.
        if (!(domEvent.relatedTarget instanceof Node && host.contains(domEvent.relatedTarget)))
            host.removeAttribute(options.draggingAttribute);

        return;
    }

    domEvent.preventDefault();

    if (domEvent.type !== "drop") {
        if (domEvent.dataTransfer !== null)
            domEvent.dataTransfer.dropEffect = "copy";

        host.setAttribute(options.draggingAttribute, "");
        return;
    }

    host.removeAttribute(options.draggingAttribute);

    const files = [...domEvent.dataTransfer?.files ?? []].filter(file => acceptsFile(target.accept, file));

    if (files.length === 0)
        return;

    options.onFiles(host, target.multiple ? files : [files[0]]);
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
