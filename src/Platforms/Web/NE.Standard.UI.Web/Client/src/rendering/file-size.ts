// A file's size as a reader reads one, the one way the page writes it — a file tile's, which the boot script writes before the first
// paint, an upload refusal's limit, a size standing in words (the server's UIFileSize) — and as the server paints one in words before
// the page writes it, which the boot script finds to write it again.

/** Past the byte, the steps a size is written in, each 1024 of the one before, as a file manager counts. */
const SizeUnits = ["kilobyte", "megabyte", "gigabyte"] as const;

/** The same steps as the server's first paint writes them: the browser's own English for them. */
const PaintedUnits = ["kB", "MB", "GB"] as const;

/** A size in bytes as a reader reads one — "1 MB", "1,5 МБ" — in the page's language, by the browser's own unit words. */
export function formatFileSize(bytes: number, language: string): string {
    let value = bytes;
    let unit = "byte";

    for (const next of SizeUnits) {
        if (value < 1024)
            break;

        value /= 1024;
        unit = next;
    }

    return sizeFormatter(language, unit).format(value);
}

// One formatter per language and unit: a list of tiles, or a page's words written again at a switch, would build one per size.
const SizeFormatters = new Map<string, Intl.NumberFormat>();

function sizeFormatter(language: string, unit: string): Intl.NumberFormat {
    const key = `${language}|${unit}`;
    let formatter = SizeFormatters.get(key);

    if (formatter === undefined) {
        formatter = createSizeFormatter(language, unit);
        SizeFormatters.set(key, formatter);
    }

    return formatter;
}

function createSizeFormatter(language: string, unit: string): Intl.NumberFormat {
    // "512 bytes", not the short form's "512 byte".
    const options: Intl.NumberFormatOptions = { style: "unit", unit, unitDisplay: unit === "byte" ? "long" : "short", maximumFractionDigits: 1 };

    try {
        return new Intl.NumberFormat(language.length > 0 ? language : undefined, options);
    }
    catch {
        // A language tag the browser does not know: its own language's words, rather than none at all.
        return new Intl.NumberFormat(undefined, options);
    }
}

/** A file tile's size as its fact on the root names it (`data-ui-file-size`), in `language`; empty where the fact names no size. */
export function tileSizeText(fact: string | null, language: string): string {
    const bytes = Number(fact ?? Number.NaN);

    return Number.isFinite(bytes) && bytes >= 0 ? formatFileSize(bytes, language) : "";
}

/**
 * A size as the server paints it before the page writes it — `UIFileSize.ToString`, which is what `formatFileSize` writes in English:
 * "1 byte", "45 bytes", "1.5 kB", "1,024 kB". Written here by hand, not by `Intl`, so the boot script finds the server's text whatever
 * the browser's English; both pinned by eng/Tests/Shared/file-size-corpus.json.
 */
export function serverFileSizePaint(bytes: number): string {
    if (bytes < 1024)
        return bytes === 1 ? "1 byte" : `${grouped(bytes)} bytes`;

    let value = bytes;
    let unit = -1;

    // The unit by the size before it is rounded: dividing by 1024 is exact, as on the server.
    while (unit < PaintedUnits.length - 1 && value >= 1024) {
        value /= 1024;
        unit++;
    }

    // Tenths, a half rounded up: the quotient is exact, and so is ten times it below 2^53.
    const tenths = Math.round(value * 10);
    const whole = Math.floor(tenths / 10);
    const tenth = tenths % 10;

    return `${grouped(whole)}${tenth === 0 ? "" : `.${tenth}`} ${PaintedUnits[unit]}`;
}

function grouped(value: number): string {
    return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
