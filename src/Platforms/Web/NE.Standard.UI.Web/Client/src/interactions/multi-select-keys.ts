// The arithmetic of a multi-select's value: the chosen keys in the order they were chosen, each once, never more than the field
// takes. Pure, so `node --test` pins it; the select engine reads and writes the attributes around it.

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

    const keys: string[] = [];

    for (const key of parsed) {
        if (typeof key === "string" && key.length > 0 && !keys.includes(key))
            keys.push(key);
    }

    return keys;
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
