// `document.execCommand` is deprecated, but "copy" has no replacement for a host that is not a secure context, and "insertText" none
// for an edit that lands in a field's own undo. Reached through a type of its own, so the deprecation is stated once here rather
// than struck through at every call.

type LegacyCommands = {
    execCommand(commandId: "copy"): boolean;
    execCommand(commandId: "insertText", showUI: boolean, value: string): boolean;
};

const commands = document as unknown as LegacyCommands;

/** Copies the document's current selection; false when the browser refuses. */
export function copySelection(): boolean {
    try {
        return commands.execCommand("copy");
    }
    catch {
        return false;
    }
}

/** Types `text` over the focused field's selection, as the reader's own edit; false when the browser refuses or has no command. */
export function insertTextAsTyped(text: string): boolean {
    try {
        return typeof commands.execCommand === "function" && commands.execCommand("insertText", false, text);
    }
    catch {
        return false;
    }
}
