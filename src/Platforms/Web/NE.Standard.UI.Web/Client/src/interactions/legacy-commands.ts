// `document.execCommand` is deprecated, but "copy" has no replacement for a host that is not a secure context. Reached through
// a type of its own, so the deprecation is stated once here rather than struck through at every call.

type LegacyCommands = {
    execCommand(commandId: "copy"): boolean;
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
