// A number's CLDR cardinal plural category for a language — the rules of CLDR 48 for en, de, es, fr, ru, uk, pl and zh; any
// other language is "other". Twin of the server's UIPluralRules, both pinned by eng/Tests/Shared/plural-corpus.json.

export type PluralCategory = "zero" | "one" | "two" | "few" | "many" | "other";

/** The plural category of `number` in `language`, by its lower-cased primary subtag (`ru-RU` is `ru`, `zh-Hans` is `zh`). */
export function selectPlural(language: string | null | undefined, number: number): PluralCategory {
    if (!Number.isFinite(number))
        return "other";

    const n = Math.abs(number);
    const i = Math.trunc(n);
    const v = visibleFractionDigits(n);

    switch (primarySubtag(language)) {
        case "en":
        case "de":
            return i === 1 && v === 0 ? "one" : "other";
        case "es":
            return n === 1 ? "one" : isMillions(i, v) ? "many" : "other";
        case "fr":
            return i === 0 || i === 1 ? "one" : isMillions(i, v) ? "many" : "other";
        case "ru":
        case "uk":
            return selectEastSlavic(i, v);
        case "pl":
            return selectPolish(i, v);
        default:
            return "other";
    }
}

/** The operand v: how many fraction digits the number's shortest text shows (`1.5` one, `1.0` none, `1e-7` seven). */
function visibleFractionDigits(value: number): number {
    if (Number.isInteger(value))
        return 0;

    const text = String(value);
    const exponentAt = text.indexOf("e");
    const mantissa = exponentAt < 0 ? text : text.slice(0, exponentAt);
    const exponent = exponentAt < 0 ? 0 : Number(text.slice(exponentAt + 1));
    const dot = mantissa.indexOf(".");
    const fraction = dot < 0 ? 0 : mantissa.length - dot - 1;

    return Math.max(0, fraction - exponent);
}

function primarySubtag(language: string | null | undefined): string {
    if (language === null || language === undefined || language.trim().length === 0)
        return "";

    return language.split(/[-_]/, 1)[0].toLowerCase();
}

// CLDR's "e = 0 and i != 0 and i % 1000000 = 0 and v = 0"; a number here never carries a compact exponent.
function isMillions(i: number, v: number): boolean {
    return v === 0 && i !== 0 && i % 1000000 === 0;
}

function selectEastSlavic(i: number, v: number): PluralCategory {
    if (v !== 0)
        return "other";

    const i10 = i % 10;
    const i100 = i % 100;

    if (i10 === 1 && i100 !== 11)
        return "one";

    return i10 >= 2 && i10 <= 4 && !(i100 >= 12 && i100 <= 14) ? "few" : "many";
}

function selectPolish(i: number, v: number): PluralCategory {
    if (v !== 0)
        return "other";

    if (i === 1)
        return "one";

    const i10 = i % 10;
    const i100 = i % 100;

    return i10 >= 2 && i10 <= 4 && !(i100 >= 12 && i100 <= 14) ? "few" : "many";
}
