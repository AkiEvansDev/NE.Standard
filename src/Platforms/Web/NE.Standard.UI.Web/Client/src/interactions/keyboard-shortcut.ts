// Parsing and matching an authored shortcut string ("Ctrl+Shift+P"), by physical key rather than by the character the layout produces.

export type KeyboardShortcut = {
    readonly code: string;
    readonly ctrl: boolean;
    readonly shift: boolean;
    readonly alt: boolean;
    readonly meta: boolean;
};

/** The shortcut an authored string describes, or null when it names no key. */
export function parseShortcut(value: string | null | undefined): KeyboardShortcut | null {
    const parts = (value ?? "").split("+").map(part => part.trim()).filter(part => part.length > 0);

    if (parts.length === 0)
        return null;

    let ctrl = false;
    let shift = false;
    let alt = false;
    let meta = false;
    let code: string | null = null;

    for (const part of parts) {
        switch (part.toLowerCase()) {
            case "ctrl":
            case "control":
                ctrl = true;
                break;

            case "shift":
                shift = true;
                break;

            case "alt":
            case "option":
                alt = true;
                break;

            case "meta":
            case "cmd":
            case "command":
            case "win":
                meta = true;
                break;

            default:
                // The last non-modifier wins rather than the first, so a malformed "S+Ctrl" still names S.
                code = resolveCode(part);
                break;
        }
    }

    return code === null ? null : { code, ctrl, shift, alt, meta };
}

/** Whether a key event is this shortcut: modifiers match exactly, but an authored Ctrl also answers to Cmd on a Mac. */
export function matchesShortcut(shortcut: KeyboardShortcut, domEvent: KeyboardEvent, isMac: boolean = isMacPlatform()): boolean {
    if (domEvent.code !== shortcut.code || domEvent.shiftKey !== shortcut.shift || domEvent.altKey !== shortcut.alt)
        return false;

    // Ctrl is not a Mac's own modifier; `isMac` is a parameter rather than read here, so the rule stays testable.
    if (shortcut.ctrl && !shortcut.meta && isMac)
        return domEvent.ctrlKey !== domEvent.metaKey;

    return domEvent.ctrlKey === shortcut.ctrl && domEvent.metaKey === shortcut.meta;
}

/**
 * The chord in the reader's platform's words, as a menu entry's end and a control's tooltip write it: `Ctrl+Shift+S`, and on macOS
 * `⇧⌘S` — an authored Ctrl is ⌘ there, as `matchesShortcut` reads it, and the modifiers stand in Apple's order with no separator.
 */
export function formatShortcut(shortcut: KeyboardShortcut, isMac: boolean = isMacPlatform()): string {
    const key = keyLabel(shortcut.code, isMac);

    if (!isMac) {
        return [
            shortcut.ctrl ? "Ctrl" : "",
            shortcut.alt ? "Alt" : "",
            shortcut.shift ? "Shift" : "",
            shortcut.meta ? "Meta" : "",
            key
        ].filter(part => part.length > 0).join("+");
    }

    // Ctrl alone is ⌘; written beside Meta it is the Control key itself.
    const control = shortcut.ctrl && shortcut.meta;
    const command = shortcut.meta || shortcut.ctrl;

    return `${control ? "⌃" : ""}${shortcut.alt ? "⌥" : ""}${shortcut.shift ? "⇧" : ""}${command ? "⌘" : ""}${key}`;
}

/** A physical key as a reader names it: the letter or the sign it carries, else its name, or the Mac's own glyph for it. */
function keyLabel(code: string, isMac: boolean): string {
    if (/^Key[A-Z]$/.test(code))
        return code.slice(3);

    if (/^Digit[0-9]$/.test(code))
        return code.slice(5);

    return (isMac ? MacKeyLabels[code] : undefined) ?? KeyLabels[code] ?? code;
}

const KeyLabels: Record<string, string> = {
    Comma: ",",
    Period: ".",
    Slash: "/",
    Backslash: "\\",
    Semicolon: ";",
    Quote: "'",
    BracketLeft: "[",
    BracketRight: "]",
    Minus: "-",
    Equal: "=",
    Backquote: "`",
    Escape: "Esc",
    ArrowUp: "Up",
    ArrowDown: "Down",
    ArrowLeft: "Left",
    ArrowRight: "Right"
};

const MacKeyLabels: Record<string, string> = {
    Delete: "⌦",
    Backspace: "⌫",
    Enter: "↩",
    Escape: "⎋",
    Tab: "⇥",
    Home: "↖",
    End: "↘",
    PageUp: "⇞",
    PageDown: "⇟",
    ArrowUp: "↑",
    ArrowDown: "↓",
    ArrowLeft: "←",
    ArrowRight: "→"
};

let macPlatform: boolean | null = null;

/** Detected once per page from `userAgentData` where it exists, else `navigator.platform`. */
function isMacPlatform(): boolean {
    if (macPlatform === null)
        macPlatform = detectMacPlatform();

    return macPlatform;
}

function detectMacPlatform(): boolean {
    if (typeof navigator === "undefined")
        return false;

    const uaDataPlatform = (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform;

    return /mac/i.test(uaDataPlatform ?? navigator.platform ?? "");
}

/** An authored chord in the reader's platform's words, for a package that keys its own control and names the chord in its tooltip. */
export const shortcutWords = {
    words(chord: string): string | null {
        const shortcut = parseShortcut(chord);

        return shortcut === null ? null : formatShortcut(shortcut);
    }
};

/** The canonical form two authored strings are compared by, so "ctrl+s" and "Ctrl+S" collide. */
export function shortcutKey(shortcut: KeyboardShortcut): string {
    return [
        shortcut.ctrl ? "ctrl" : "",
        shortcut.shift ? "shift" : "",
        shortcut.alt ? "alt" : "",
        shortcut.meta ? "meta" : "",
        shortcut.code
    ].filter(part => part.length > 0).join("+");
}

/** A key name as authored, mapped to the physical code the browser reports for it. */
function resolveCode(name: string): string | null {
    if (name.length === 1) {
        const character = name.toUpperCase();

        if (character >= "A" && character <= "Z")
            return `Key${character}`;

        if (character >= "0" && character <= "9")
            return `Digit${character}`;

        return NamedCodes[character] ?? null;
    }

    const normalized = name.length === 0 ? "" : name[0].toUpperCase() + name.slice(1).toLowerCase();

    if (/^F([1-9]|1[0-9]|2[0-4])$/.test(normalized.toUpperCase()))
        return normalized.toUpperCase();

    return NamedCodes[normalized] ?? null;
}

const NamedCodes: Record<string, string> = {
    ",": "Comma",
    ".": "Period",
    "/": "Slash",
    "\\": "Backslash",
    ";": "Semicolon",
    "'": "Quote",
    "[": "BracketLeft",
    "]": "BracketRight",
    "-": "Minus",
    "=": "Equal",
    "`": "Backquote",
    Delete: "Delete",
    Backspace: "Backspace",
    Enter: "Enter",
    Escape: "Escape",
    Esc: "Escape",
    Space: "Space",
    Tab: "Tab",
    Insert: "Insert",
    Home: "Home",
    End: "End",
    Pageup: "PageUp",
    Pagedown: "PageDown",
    Up: "ArrowUp",
    Down: "ArrowDown",
    Left: "ArrowLeft",
    Right: "ArrowRight",
    Arrowup: "ArrowUp",
    Arrowdown: "ArrowDown",
    Arrowleft: "ArrowLeft",
    Arrowright: "ArrowRight"
};
