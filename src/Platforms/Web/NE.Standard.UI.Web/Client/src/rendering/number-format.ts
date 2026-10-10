// Not Intl: it must render as the server's `WebNumberFormat` does, from .NET's pack, so a cell and a message read the same number.
// `.ts` on the value import, `import type` on the rest: `node --test` resolves files literally.
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

// A digit that makes the rounded number other than zero, which alone lets a negative value keep its sign.
const NonZeroDigit = /[1-9]/;

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

/** Formats a number by a .NET format of the shared subset (`N`, `F`, `C`, `P`, `D`), or plainly; throws outside it, as the server does. */
export function formatNumber(value: number, format: string | null | undefined, culture: NumberCulturePack): string {
    if (!Number.isFinite(value))
        return String(value);

    const spec = parseFormat(format);

    if (spec === null)
        return plain(value, culture);

    const abs = Math.abs(value);

    switch (spec.kind) {
        case "N": {
            const text = grouped(abs, 0, spec.precision ?? culture.decimalDigits, culture.groupSizes, culture.groupSeparator, culture.decimalSeparator);

            return isNegative(value, text) ? applyPattern(NumberNegativePatterns[culture.negativePattern] ?? "-n", text, "", culture.negativeSign) : text;
        }
        case "F": {
            const text = grouped(abs, 0, spec.precision ?? culture.decimalDigits, [], "", culture.decimalSeparator);

            return isNegative(value, text) ? culture.negativeSign + text : text;
        }
        case "D": {
            const text = rounded(abs, 0, 0).integer.padStart(spec.precision ?? 1, "0");

            return isNegative(value, text) ? culture.negativeSign + text : text;
        }
        case "C": {
            const text = grouped(abs, 0, spec.precision ?? culture.currencyDecimalDigits, culture.currencyGroupSizes, culture.currencyGroupSeparator, culture.currencyDecimalSeparator);
            const pattern = isNegative(value, text) ? CurrencyNegativePatterns[culture.currencyNegativePattern] ?? "-$n" : CurrencyPositivePatterns[culture.currencyPositivePattern] ?? "$n";

            return applyPattern(pattern, text, culture.currencySymbol, culture.negativeSign);
        }
        case "P": {
            // A hundredfold by moving the point, not by multiplying, which lands a binary step off (0.285 × 100 is 28.499…).
            const text = grouped(abs, 2, spec.precision ?? culture.percentDecimalDigits, culture.percentGroupSizes, culture.percentGroupSeparator, culture.percentDecimalSeparator);
            const pattern = isNegative(value, text) ? PercentNegativePatterns[culture.percentNegativePattern] ?? "-n %" : PercentPositivePatterns[culture.percentPositivePattern] ?? "n %";

            return applyPattern(pattern, text, culture.percentSymbol, culture.negativeSign);
        }
        default:
            return plain(value, culture);
    }
}

/** Whether the formatted digits take the sign: a negative value that rounds to zero is written as zero, as .NET writes it. */
function isNegative(value: number, digits: string): boolean {
    return value < 0 && NonZeroDigit.test(digits);
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

/** The value as it is — no grouping, the shortest digits that round-trip, never an exponent — in the culture's separator and sign. */
function plain(value: number, culture: NumberCulturePack): string {
    const { integer, fraction } = writtenOut(Math.abs(value), 0);
    const text = fraction.length === 0 ? integer : `${integer}${culture.decimalSeparator}${fraction}`;

    return value < 0 ? culture.negativeSign + text : text;
}

function grouped(abs: number, shift: number, digits: number, sizes: readonly number[], groupSeparator: string, decimalSeparator: string): string {
    const { integer, fraction } = rounded(abs, shift, digits);

    return digits === 0 ? group(integer, sizes, groupSeparator) : `${group(integer, sizes, groupSeparator)}${decimalSeparator}${fraction}`;
}

/**
 * The value times ten to `shift`, to `digits` places, rounded half away from zero as .NET rounds a formatted decimal. Worked on the
 * digits the value is written with, not on the double: the server's decimal is those digits, and a double's arithmetic rounds a
 * fourteen-digit integer part's cents away or turns 1e21 into an exponent.
 */
function rounded(abs: number, shift: number, digits: number): { readonly integer: string; readonly fraction: string } {
    const { integer, fraction } = writtenOut(abs, shift);
    const kept = integer + fraction.slice(0, digits).padEnd(digits, "0");
    const up = fraction.length > digits && fraction[digits] >= "5";
    const all = up ? incremented(kept) : kept;
    const point = all.length - digits;

    return { integer: all.slice(0, point), fraction: all.slice(point) };
}

/** The value's shortest round-trip digits written out in full, the point moved `shift` places right: no exponent, no leading zeros. */
function writtenOut(abs: number, shift: number): { readonly integer: string; readonly fraction: string } {
    const [mantissa, exponent = "0"] = String(abs).split("e");
    const [whole, part = ""] = mantissa.split(".");
    const digits = `${whole}${part}`.replace(/^0+/, "");
    // Where the point stands among the digits once the leading zeros are gone.
    const point = whole.length + Number(exponent) + shift - (whole.length + part.length - digits.length);

    if (digits.length === 0)
        return { integer: "0", fraction: "" };

    if (point <= 0)
        return { integer: "0", fraction: `${"0".repeat(-point)}${digits}` };

    if (point >= digits.length)
        return { integer: digits + "0".repeat(point - digits.length), fraction: "" };

    return { integer: digits.slice(0, point), fraction: digits.slice(point) };
}

/** A string of decimal digits plus one. */
function incremented(digits: string): string {
    let index = digits.length - 1;

    while (index >= 0 && digits[index] === "9")
        index--;

    const carried = "0".repeat(digits.length - 1 - index);

    return index < 0 ? `1${carried}` : `${digits.slice(0, index)}${String(Number(digits[index]) + 1)}${carried}`;
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

// What `double.TryParse(text, NumberStyles.Float, CultureInfo.InvariantCulture)` reads: .NET's own blanks either side (not `\s`,
// which takes a no-break space, U+2028 and a byte-order mark), a sign, digits with one point, an exponent.
const InvariantNumberText = /^[\t\n\v\f\r ]*[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?[\t\n\v\f\r ]*$/;

/** The number a text writes as the server's invariant reading takes it; null for any other text — a hex, a grouping, `Infinity` — or one past a double. */
function parseInvariantNumber(text: string): number | null {
    if (!InvariantNumberText.test(text))
        return null;

    const value = Number(text);

    return Number.isFinite(value) ? value : null;
}

/** What a package's engine formats with, off the plugin context: the pack off an element, the number by a format, and a text read as one. */
export const numberFormatting = {
    readCulture: readNumberCulture,
    format: formatNumber,
    parseInvariant: parseInvariantNumber
} as const;
