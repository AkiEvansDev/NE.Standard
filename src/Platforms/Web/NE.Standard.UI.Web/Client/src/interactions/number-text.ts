// A number field's three texts: the invariant one the value travels as, the one the viewer edits, and the one shown at rest.
// Pure, so `node --test` runs it: `.ts` on the value import, `import type` on the rest.
import { formatNumber } from "../rendering/number-format.ts";
import type { NumberCulturePack } from "../rendering/number-format.ts";

/** How the field shows its value at rest. */
export type NumberTextOptions = {
    /** The author's DisplayFormat: a .NET standard numeric format of the shared subset, or null for the value as typed. */
    readonly format: string | null;
    /** Whether the integer part is grouped; false leaves every group separator out, the format's included. */
    readonly thousands: boolean;
};

// The canonical shape an invariant text is kept in: a sign, digits, and a fraction after a point.
const InvariantShape = /^-?(\d+(\.\d*)?|\.\d+)$/;

/** What the field shows at rest; a text that is not a number is shown as it is, and an unreadable format falls back to none. */
export function displayNumberText(invariant: string, culture: NumberCulturePack, options: NumberTextOptions): string {
    if (!InvariantShape.test(invariant))
        return invariant;

    const shown = options.thousands ? culture : ungrouped(culture);
    const value = Number(invariant);

    if (options.format !== null && options.format.trim().length > 0) {
        try {
            return formatNumber(value, options.format, shown);
        }
        catch {
            // A format outside the shared subset is the server's to refuse; the field still shows its number.
        }
    }

    // No format: the decimals the value has, no more and no fewer, so a typed 1.50 reads back as 1.50.
    const fraction = invariant.includes(".") ? invariant.length - invariant.indexOf(".") - 1 : 0;

    return formatNumber(value, `${options.thousands ? "N" : "F"}${Math.min(fraction, 99)}`, shown);
}

/** What the viewer edits: the culture's decimal separator and a plain minus, nothing grouped, no symbol; a percent as it shows. */
export function editNumberText(invariant: string, culture: NumberCulturePack, format: string | null): string {
    if (!InvariantShape.test(invariant))
        return invariant;

    // 25 is what a reader who saw "25 %" types, not 0.25.
    return (isPercent(format) ? shiftDecimal(invariant, 2) : invariant).replace(".", culture.decimalSeparator);
}

/** The invariant text a shown or typed text stands for — symbols and group separators read past — or null when it is no number. */
export function parseNumberText(text: string, culture: NumberCulturePack, format: string | null): string | null {
    let rest = text.trim();

    if (rest.length === 0)
        return "";

    let negative = false;

    if (rest.startsWith("(") && rest.endsWith(")")) {
        negative = true;
        rest = rest.slice(1, -1);
    }

    const percent = isPercent(format) || (culture.percentSymbol.length > 0 && rest.includes(culture.percentSymbol));

    for (const symbol of [culture.currencySymbol, culture.percentSymbol])
        rest = symbol.length === 0 ? rest : rest.split(symbol).join("");

    for (const sign of new Set([culture.negativeSign, "-", "−"])) {
        if (sign.length > 0 && rest.includes(sign)) {
            negative = true;
            rest = rest.split(sign).join("");
        }
    }

    const decimal = culture.decimalSeparator;
    const [whole, ...fractions] = decimal.length === 0 ? [rest] : rest.split(decimal);

    if (fractions.length > 1)
        return null;

    // Whatever else stands between the digits of the whole part is a group separator, a space-like one included.
    const digits = whole.replace(/[\s  ]/g, "").split(culture.groupSeparator).join("").split(culture.currencyGroupSeparator).join("");
    const fraction = fractions.length === 0 ? null : fractions[0].replace(/[\s  ]/g, "");
    const invariant = fraction === null ? digits : `${digits}.${fraction}`;

    if (!InvariantShape.test(invariant))
        return null;

    const scaled = percent ? shiftDecimal(invariant, -2) : invariant;

    return negative && Number(scaled) !== 0 ? `-${scaled}` : scaled;
}

/** Keeps what can be part of a number as it is typed — digits, one decimal separator, a leading minus — and where the caret lands. */
export function sanitizeNumberText(raw: string, cursor: number, culture: NumberCulturePack, allowDecimals: boolean, allowNegative: boolean): { readonly value: string; readonly cursor: number } {
    const minus = new Set(["-", "−", culture.negativeSign]);
    let value = "";
    let newCursor = 0;
    let seenDecimal = false;

    for (let i = 0; i < raw.length; i++) {
        const character = raw[i];
        let keep = false;

        if (character >= "0" && character <= "9")
            keep = true;
        else if (minus.has(character) && allowNegative && value.length === 0)
            keep = true;
        else if (character === culture.decimalSeparator && allowDecimals && !seenDecimal) {
            keep = true;
            seenDecimal = true;
        }

        if (keep)
            value += minus.has(character) ? "-" : character;

        if (i < cursor && keep)
            newCursor++;
    }

    return { value, cursor: newCursor };
}

/** The trailing zeros of the fraction gone, and the point with them when nothing is left after it. */
export function trimTrailingZeros(invariant: string): string {
    if (!invariant.includes("."))
        return invariant;

    return invariant.replace(/0+$/, "").replace(/\.$/, "");
}

function isPercent(format: string | null): boolean {
    return /^\s*[pP]\d{0,2}\s*$/.test(format ?? "");
}

/** The culture with every group separator taken out, for a field that shows no thousands. */
function ungrouped(culture: NumberCulturePack): NumberCulturePack {
    return { ...culture, groupSeparator: "", currencyGroupSeparator: "", percentGroupSeparator: "" };
}

/** Moves the decimal point `places` to the right (left when negative) on the text itself, so no binary rounding creeps in. */
function shiftDecimal(invariant: string, places: number): string {
    const negative = invariant.startsWith("-");
    const unsigned = negative ? invariant.slice(1) : invariant;
    const point = unsigned.indexOf(".");
    const digits = unsigned.replace(".", "");
    let position = (point < 0 ? unsigned.length : point) + places;
    let padded = digits;

    if (position <= 0) {
        padded = "0".repeat(1 - position) + padded;
        position = 1;
    }

    if (position > padded.length)
        padded = padded + "0".repeat(position - padded.length);

    const whole = padded.slice(0, position).replace(/^0+(?=\d)/, "");
    const fraction = padded.slice(position).replace(/0+$/, "");
    const shifted = fraction.length === 0 ? whole : `${whole}.${fraction}`;

    return negative ? `-${shifted}` : shifted;
}
