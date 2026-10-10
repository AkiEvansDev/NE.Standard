// The arithmetic of a multi-select's value: the chosen keys in the order they were chosen, each once, never more than the field
// takes, and the tags a free-text entry makes of what is typed. Pure, so `node --test` pins it; the select engine reads and writes
// the attributes and the entry around it.

/** The chosen keys an attribute holds: text keys only, each once, in the order they were chosen; anything unreadable is none. */
export function parseChosenKeys(text: string | null): string[] {
    if (text === null || text.length === 0)
        return [];

    let parsed: unknown;

    try {
        parsed = JSON.parse(text);
    } catch {
        return [];
    }

    if (!Array.isArray(parsed))
        return [];

    // A set, not a search of the list: a table's chosen rows run to thousands.
    const keys = new Set<string>();

    for (const key of parsed) {
        if (typeof key === "string" && key.length > 0)
            keys.add(key);
    }

    return [...keys];
}

/** How many keys the field takes at most, or null for any number: a whole number of one or more, anything else no limit. */
export function parseMaxChosen(text: string | null): number | null {
    if (text === null)
        return null;

    const max = Number(text);

    return Number.isInteger(max) && max > 0 ? max : null;
}

/** Whether the field holds as many keys as it takes. */
export function isChoiceFull(keys: readonly string[], max: number | null): boolean {
    return max !== null && keys.length >= max;
}

/** The keys with one toggled: taken out when chosen, added last when not — or null when the field is full and cannot take it. */
export function toggleChosenKey(keys: readonly string[], key: string, max: number | null): string[] | null {
    if (keys.includes(key))
        return keys.filter(chosen => chosen !== key);

    return isChoiceFull(keys, max) ? null : [...keys, key];
}

/** The keys without one of them, or null when it was not chosen. */
export function removeChosenKey(keys: readonly string[], key: string): string[] | null {
    return keys.includes(key) ? keys.filter(chosen => chosen !== key) : null;
}

// What ends a tag typed or pasted: a comma — an input method's full-width one too — or a line break.
const TagSeparator = /[,\uFF0C\r\n]/;

/** Whether a text holds a separator, so a paste of it is several tags rather than one entry's text. */
export function holdsTagSeparator(text: string): boolean {
    return TagSeparator.test(text);
}

/** The tags a text holds, each trimmed and the empty ones dropped: what Enter or a paste makes chips of. */
export function splitTags(text: string): string[] {
    return text.split(TagSeparator).map(tag => tag.trim()).filter(tag => tag.length > 0);
}

/** What typing a separator leaves: the tags before the last one, and the text after it, still being typed, as it stands. */
export function takeTypedTags(text: string): { readonly tags: string[]; readonly rest: string } {
    const parts = text.split(TagSeparator);
    const rest = parts.pop() ?? "";

    return { tags: parts.map(tag => tag.trim()).filter(tag => tag.length > 0), rest };
}

/** A tag typed: its text as typed, and the key it is chosen by — an option's whose words it names, else the text itself. */
export type TypedTag = {
    readonly text: string;
    readonly key: string;
};

/** Typed tags taken into the keys: the keys after them, the texts left over as typed, and why the first of those was refused. */
export type EnteredTags<TReason> = {
    readonly keys: string[];
    readonly refused: string[];
    readonly reason: TReason | null;
};

/**
 * The keys with typed tags added last, in order, each once — one already chosen is passed over. A tag past the cap is left over with
 * `full` as the reason, one `judge` refuses with what it answered, judged against the keys as they stand when its turn comes.
 */
export function enterTags<TReason>(keys: readonly string[], tags: readonly TypedTag[], max: number | null, full: TReason, judge: (current: readonly string[], next: readonly string[]) => TReason | null): EnteredTags<TReason> {
    let entered = [...keys];
    const refused: string[] = [];
    let reason: TReason | null = null;

    for (const tag of tags) {
        if (entered.includes(tag.key))
            continue;

        const next = [...entered, tag.key];
        const refusal = isChoiceFull(entered, max) ? full : judge(entered, next);

        if (refusal !== null) {
            refused.push(tag.text);
            reason ??= refusal;
            continue;
        }

        entered = next;
    }

    return { keys: entered, refused, reason };
}
