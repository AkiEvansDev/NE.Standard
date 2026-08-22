// Deliberately not Intl: the server derives the pack from a CultureInfo and formats the same way, and a
// value has to render identically whether it came from the initial render or from a live patch. Only the
// documented token subset is supported — TemporalFormatSyncTests keeps it aligned with WebTemporalFormat.

export type TemporalCulturePack = {
    readonly monthNames: readonly string[];
    /** Languages that decline month names use these when a day number precedes the month. */
    readonly monthGenitiveNames: readonly string[];
    readonly abbreviatedMonthNames: readonly string[];
    readonly dayNames: readonly string[];
    readonly abbreviatedDayNames: readonly string[];
    readonly amDesignator: string;
    readonly pmDesignator: string;
};

export const TemporalTokens = [
    "MMMM", "dddd", "yyyy", "MMM", "ddd", "dd", "MM", "yy", "HH", "hh", "mm", "ss", "tt", "d", "M", "H", "h", "m", "s"
] as const;

export function formatTemporal(value: Date, format: string | null | undefined, culture: TemporalCulturePack): string {
    if (format === null || format === undefined || format.trim().length === 0)
        return `${pad(value.getFullYear(), 4)}-${pad(value.getMonth() + 1, 2)}-${pad(value.getDate(), 2)} ${pad(value.getHours(), 2)}:${pad(value.getMinutes(), 2)}:${pad(value.getSeconds(), 2)}`;

    let result = "";
    const genitiveMonth = hasDayNumberToken(format);

    for (let index = 0; index < format.length;) {
        const token = matchTemporalToken(format, index);

        if (token === null) {
            result += format[index];
            index++;
            continue;
        }

        result += render(token, value, culture, genitiveMonth);
        index += token.length;
    }

    return result;
}

function hasDayNumberToken(format: string): boolean {
    for (let index = 0; index < format.length;) {
        const token = matchTemporalToken(format, index);

        if (token === null) {
            index++;
            continue;
        }

        if (token === "d" || token === "dd")
            return true;

        index += token.length;
    }

    return false;
}

export function matchTemporalToken(format: string, index: number): string | null {
    for (const token of TemporalTokens) {
        if (format.startsWith(token, index))
            return token;
    }

    return null;
}

function render(token: string, value: Date, culture: TemporalCulturePack, genitiveMonth: boolean): string {
    const hour = value.getHours();
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;

    switch (token) {
        case "yyyy": return pad(value.getFullYear(), 4);
        case "yy": return pad(value.getFullYear() % 100, 2);
        case "MMMM": return genitiveMonth ? culture.monthGenitiveNames[value.getMonth()] : culture.monthNames[value.getMonth()];
        case "MMM": return culture.abbreviatedMonthNames[value.getMonth()];
        case "MM": return pad(value.getMonth() + 1, 2);
        case "M": return String(value.getMonth() + 1);
        case "dddd": return culture.dayNames[value.getDay()];
        case "ddd": return culture.abbreviatedDayNames[value.getDay()];
        case "dd": return pad(value.getDate(), 2);
        case "d": return String(value.getDate());
        case "HH": return pad(hour, 2);
        case "H": return String(hour);
        case "hh": return pad(hour12, 2);
        case "h": return String(hour12);
        case "mm": return pad(value.getMinutes(), 2);
        case "m": return String(value.getMinutes());
        case "ss": return pad(value.getSeconds(), 2);
        case "s": return String(value.getSeconds());
        case "tt": return hour < 12 ? culture.amDesignator : culture.pmDesignator;
        default: return token;
    }
}

function pad(value: number, length: number): string {
    return String(value).padStart(length, "0");
}
