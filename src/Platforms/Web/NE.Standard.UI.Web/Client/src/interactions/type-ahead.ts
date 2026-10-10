// Type-ahead over a list, as a native list's: the characters typed with no pause between them make one prefix, and the list's
// current entry moves to the first entry whose words begin with it; the same letter typed again walks the entries it begins.
// Words are folded by the one matching rule (`search-terms.ts`), so case and accents aside in the page's language.

import { isComposing } from "./keyboard-shortcut.ts";
import { foldWords } from "./search-terms.ts";

/** A pause this long ends the prefix: the next character starts a new one. */
const PauseMilliseconds = 500;

export type TypeAheadRequest<T> = {
    /** The list typed into: another list starts a prefix of its own. */
    readonly owner: object;
    readonly character: string;
    /** The entries the key may move to, in order, the ones it must pass already left out. */
    readonly entries: readonly T[];
    readonly current: T | null;
    readonly words: (entry: T) => string;
    /** Whose language folds the words. */
    readonly context: Element;
};

export class TypeAhead {
    private owner: object | null = null;
    private typed = "";
    private last = Number.NEGATIVE_INFINITY;
    private readonly now: () => number;

    public constructor(now: () => number = () => performance.now()) {
        this.now = now;
    }

    /** The entry a typed character moves to, or null where none begins with the prefix — which still grows until the pause. */
    public next<T>(request: TypeAheadRequest<T>): T | null {
        const time = this.now();

        if (request.owner !== this.owner || time - this.last > PauseMilliseconds)
            this.typed = "";

        this.owner = request.owner;
        this.last = time;
        this.typed += foldWords(request.character, request.context);

        const characters = Array.from(this.typed);
        // One letter, or the same one again: the next entry it begins, past the current one, rather than one beginning with "aa".
        const cycling = characters.every(character => character === characters[0]);
        const prefix = cycling ? characters[0] : this.typed;
        const count = request.entries.length;
        const at = request.current === null ? -1 : request.entries.indexOf(request.current);
        // A longer prefix may still be the current entry's own: it is tried first.
        const start = cycling ? at + 1 : Math.max(at, 0);

        for (let step = 0; step < count; step++) {
            const entry = request.entries[(start + step) % count];

            if (foldWords(request.words(entry), request.context).trimStart().startsWith(prefix))
                return entry;
        }

        return null;
    }
}

/** The character a key types for a type-ahead, or null: a named key, a space, a chord, or a key composing a character types none. */
export function typeAheadCharacter(domEvent: KeyboardEvent): string | null {
    if (isComposing(domEvent) || domEvent.metaKey || Array.from(domEvent.key).length !== 1 || !/\S/u.test(domEvent.key))
        return null;

    // AltGr arrives as Ctrl and Alt together on Windows, and types a letter all the same.
    if ((domEvent.ctrlKey || domEvent.altKey) && !domEvent.getModifierState("AltGraph"))
        return null;

    return domEvent.key;
}
