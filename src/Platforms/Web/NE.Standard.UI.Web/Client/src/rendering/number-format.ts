// Deliberately not Intl: this must render identically to the server's `WebNumberFormat`, over the same format subset, from the
// pack .NET wrote — so a grid's cell and a controller's message read the same number. `.ts` on the value import and `import type`
// on the rest: `node --test` runs this module and resolves files literally.
import { NumberCultureAttribute } from "../addressing/dom-attributes.ts";

/** What `WebNumberCulturePack` carries: .NET's `NumberFormatInfo`, the parts a formatted number reads. */
export type NumberCulturePack = {
    readonly decimalSeparator: string;
    readonly groupSeparator: string;
    /** The digits per group from the right; the last size repeats, and a last size of zero leaves the rest ungrouped. */
    readonly groupSizes: readonly number[];
    readonly negativeSign: string;
    /** .NET's `NumberNegativePattern`, 0 to 4. */
    readonly negativePattern: number;
    readonly decimalDigits: number;
    readonly currencySymbol: string;
    readonly currencyDecimalSeparator: string;
    readonly currencyGroupSeparator: string;
    readonly currencyGroupSizes: readonly number[];
    readonly currencyDecimalDigits: number;
    /** .NET's `CurrencyPositivePattern`, 0 to 3. */
    readonly currencyPositivePattern: number;
    /** .NET's `CurrencyNegativePattern`, 0 to 16. */
    readonly currencyNegativePattern: number;
    readonly percentSymbol: string;
    readonly percentDecimalSeparator: string;
    readonly percentGroupSeparator: string;
    readonly percentGroupSizes: readonly number[];
    readonly percentDecimalDigits: number;
    /** .NET's `PercentPositivePattern`, 0 to 3. */
    readonly percentPositivePattern: number;
    /** .NET's `PercentNegativePattern`, 0 to 11. */
    readonly percentNegativePattern: number;
};

/** .NET's invariant culture: what an element with no pack above it formats by. */
export const InvariantNumberCulture: NumberCulturePack = {
    decimalSeparator: ".",
    groupSeparator: ",",
    groupSizes: [3],
    negativeSign: "-",
    negativePattern: 1,
    decimalDigits: 2,
    currencySymbol: "¤",
    currencyDecimalSeparator: ".",
    currencyGroupSeparator: ",",
    currencyGroupSizes: [3],
    currencyDecimalDigits: 2,
    currencyPositivePattern: 0,
    currencyNegativePattern: 0,
    percentSymbol: "%",
    percentDecimalSeparator: ".",
    percentGroupSeparator: ",",
    percentGroupSizes: [3],
    percentDecimalDigits: 2,
    percentPositivePattern: 0,
    percentNegativePattern: 0
};

// The patterns as .NET tables them: `n` the number, `$` or `%` the symbol, `-` the negative sign, a space itself.
const NumberNegativePatterns = ["(n)", "-n", "- n", "n-", "n -"] as const;
const CurrencyPositivePatterns = ["$n", "n$", "$ n", "n $"] as const;
const CurrencyNegativePatterns = [
    "($n)", "-$n", "$-n", "$n-", "(n$)", "-n$", "n-$", "n$-", "-n $", "-$ n", "n $-", "$ n-", "$ -n", "n- $", "($ n)", "(n $)", "$- n"
] as const;
const PercentPositivePatterns = ["n %", "n%", "%n", "% n"] as const;
const PercentNegativePatterns = ["-n %", "-n%", "-%n", "%-n", "%n-", "n-%", "n%-", "-% n", "n %-", "% n-", "% -n", "n- %"] as const;

/** The pack off the nearest element carrying one, the invariant culture with none; a pack missing a field keeps the invariant one. */
export function readNumberCulture(element: Element): NumberCulturePack {
    const text = element.closest(`[${NumberCultureAttribute}]`)?.getAttribute(NumberCultureAttribute) ?? null;

    if (text === null)
        return InvariantNumberCulture;

    try {
        return { ...InvariantNumberCulture, ...(JSON.parse(text) as Partial<NumberCulturePack>) };
    }
    catch {
        return InvariantNumberCulture;
    }
}

/**
 * Formats a number by a standard .NET format of the shared subset — `N`, `F`, `C`, `P` or `D`, an optional precision after it —
 * or, with no format, as the value is with the culture's separator and sign. A format outside the subset throws, as the server does.
 */
export function formatNumber(value: number, format: string | null | undefined, culture: NumberCulturePack): string {
    if (!Number.isFinite(value))
        return String(value);

    const spec = parseFormat(format);

    if (spec === null)
        return plain(value, culture);

    const negative = value < 0;
    const abs = Math.abs(value);

    switch (spec.kind) {
        case "N": {
            const text = grouped(abs, spec.precision ?? culture.decimalDigits, culture.groupSizes, culture.groupSeparator, culture.decimalSeparator);

            return negative ? applyPattern(NumberNegativePatterns[culture.negativePattern] ?? "-n", text, "", culture.negativeSign) : text;
        }
        case "F": {
            const text = grouped(abs, spec.precision ?? culture.decimalDigits, [], "", culture.decimalSeparator);

            return negative ? culture.negativeSign + text : text;
        }
        case "D": {
            const text = String(roundHalfAwayFromZero(abs, 0)).padStart(spec.precision ?? 1, "0");

            return negative ? culture.negativeSign + text : text;
        }
        case "C": {
            const text = grouped(abs, spec.precision ?? culture.currencyDecimalDigits, culture.currencyGroupSizes, culture.currencyGroupSeparator, culture.currencyDecimalSeparator);
            const pattern = negative ? CurrencyNegativePatterns[culture.currencyNegativePattern] ?? "-$n" : CurrencyPositivePatterns[culture.currencyPositivePattern] ?? "$n";

            return applyPattern(pattern, text, culture.currencySymbol, culture.negativeSign);
        }
        case "P": {
            const text = grouped(abs * 100, spec.precision ?? culture.percentDecimalDigits, culture.percentGroupSizes, culture.percentGroupSeparator, culture.percentDecimalSeparator);
            const pattern = negative ? PercentNegativePatterns[culture.percentNegativePattern] ?? "-n %" : PercentPositivePatterns[culture.percentPositivePattern] ?? "n %";

            return applyPattern(pattern, text, culture.percentSymbol, culture.negativeSign);
        }
        default:
            return plain(value, culture);
    }
}

type FormatSpec = { readonly kind: "N" | "F" | "C" | "P" | "D"; readonly precision: number | null };

function parseFormat(format: string | null | undefined): FormatSpec | null {
    if (format === null || format === undefined || format.trim().length === 0)
        return null;

    const match = /^([NFCPDnfcpd])(\d{0,2})$/.exec(format.trim());

    if (match === null)
        throw new Error(`Number format '${format}' is outside the shared subset (N, F, C, P, D, with an optional precision).`);

    return { kind: match[1].toUpperCase() as FormatSpec["kind"], precision: match[2].length === 0 ? null : Number(match[2]) };
}

/** The value as it is — no grouping, the shortest digits that round-trip — in the culture's separator and sign. */
function plain(value: number, culture: NumberCulturePack): string {
    const text = String(Math.abs(value)).replace(".", culture.decimalSeparator);

    return value < 0 ? culture.negativeSign + text : text;
}

function grouped(abs: number, digits: number, sizes: readonly number[], groupSeparator: string, decimalSeparator: string): string {
    const scaled = String(roundHalfAwayFromZero(abs, digits)).padStart(digits + 1, "0");
    const integer = scaled.slice(0, scaled.length - digits);
    const fraction = scaled.slice(scaled.length - digits);

    return digits === 0 ? group(integer, sizes, groupSeparator) : `${group(integer, sizes, groupSeparator)}${decimalSeparator}${fraction}`;
}

/** The value times ten to the digits, rounded half away from zero as .NET rounds a formatted decimal; the precision cut absorbs a binary tie. */
function roundHalfAwayFromZero(abs: number, digits: number): number {
    return Math.round(Number((abs * 10 ** digits).toPrecision(15)));
}

function group(integer: string, sizes: readonly number[], separator: string): string {
    if (sizes.length === 0 || separator.length === 0)
        return integer;

    const parts: string[] = [];
    let end = integer.length;
    let index = 0;

    while (end > 0) {
        const size = sizes[Math.min(index, sizes.length - 1)];

        if (size <= 0) {
            parts.unshift(integer.slice(0, end));
            break;
        }

        const start = Math.max(0, end - size);

        parts.unshift(integer.slice(start, end));
        end = start;
        index++;
    }

    return parts.join(separator);
}

function applyPattern(pattern: string, number: string, symbol: string, negativeSign: string): string {
    let result = "";

    for (const token of pattern) {
        if (token === "n")
            result += number;
        else if (token === "$" || token === "%")
            result += symbol;
        else if (token === "-")
            result += negativeSign;
        else
            result += token;
    }

    return result;
}

/** What a package's engine formats with, off the plugin context: the pack off an element, and the number by a format. */
export const numberFormatting = {
    readCulture: readNumberCulture,
    format: formatNumber
} as const;
