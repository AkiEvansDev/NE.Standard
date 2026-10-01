// A moment in words — a phrase's argument — written as a timestamp writes its own: in the reader's zone in the table's patterns, a
// relative one by `Intl` and kept current by the words' ticks; where no page writes it, as the server does.

import assert from "node:assert/strict";
import test from "node:test";

import { ClientWords, marksMoment } from "../src/runtime/client-strings.ts";
import type { WordsTable } from "../src/runtime/client-strings.ts";
import { InvariantTemporalCulture } from "../src/rendering/temporal-format.ts";
import type { TemporalLanguage } from "../src/rendering/temporal-format.ts";
import { formatTimestamp } from "../src/rendering/timestamp-format.ts";
import type { TimestampFormat } from "../src/rendering/timestamp-format.ts";
import { formatWords, holdsMoment, isMoment, isPhrase, translateKey, writeCanonicalMoment } from "../src/runtime/words.ts";
import type { WordLookup } from "../src/runtime/words.ts";

const Instant = Date.UTC(2026, 8, 30, 14, 5, 0);
const Written = "2026-09-30T14:05:00.000Z";

const Russian: TemporalLanguage = { ...InvariantTemporalCulture, amDesignator: "", pmDesignator: "", date: "dd.MM.yyyy", shortTime: "H:mm", longTime: "H:mm:ss" };

function tableOf(language: string, words: Record<string, string>, temporal?: TemporalLanguage): WordsTable {
    return { language, complete: true, prefixes: [], words, temporal };
}

test("only an object of an instant in the wire's shape and a timestamp's format is a moment", () => {
    assert.equal(isMoment({ moment: Written }), true);
    assert.equal(isMoment({ moment: Written, format: "relative" }), true);
    assert.equal(isMoment({ moment: Written, format: "relative-date" }), true);
    assert.equal(isMoment({ moment: Written, format: "long" }), false);
    assert.equal(isMoment({ moment: Written, key: "a" }), false);
    assert.equal(isMoment({ moment: "30.09.2026" }), false);
    assert.equal(isMoment({ moment: Instant }), false);
    assert.equal(isMoment(Written), false);
    assert.equal(isPhrase({ moment: Written }), false, "a moment is never a phrase");
});

test("a moment is found anywhere in a value: a phrase's argument, a nested phrase's, a mark's", () => {
    assert.equal(holdsMoment({ key: "home.sent", args: { at: { moment: Written } } }), true);
    assert.equal(holdsMoment(["home.hit", { when: { key: "home.sent", args: { at: { moment: Written, format: "date" } } } }]), true);
    assert.equal(holdsMoment({ key: "home.sent", args: { at: Written } }), false);
    assert.equal(holdsMoment("home.sent"), false);
    assert.equal(holdsMoment(null), false);
});

test("where no page writes it a moment reads as the server writes it: UTC in the canonical patterns", () => {
    assert.equal(writeCanonicalMoment(Instant, "date-time"), "2026-09-30 14:05 UTC");
    assert.equal(writeCanonicalMoment(Instant, "date"), "2026-09-30");
    assert.equal(writeCanonicalMoment(Instant, "time"), "14:05 UTC");
    assert.equal(writeCanonicalMoment(Instant, "relative"), "2026-09-30 14:05 UTC");
    assert.equal(writeCanonicalMoment(Instant, "relative-date"), "2026-09-30");
    assert.equal(formatWords("Sent {at}", { at: { moment: Written } }), "Sent 2026-09-30 14:05 UTC");
});

test("a table's moment writer is handed every moment, a nested phrase's too, with its instant and format", () => {
    const written: [number, TimestampFormat][] = [];
    const words: WordLookup = {
        language: "en",
        prefixes: [],
        lookup: key => ({ "home.sent": "Sent {at}", "home.hit": "{when} ({day})" } as Record<string, string>)[key],
        writeMoment: (instant, format) => {
            written.push([instant, format]);
            return `<${format}>`;
        }
    };

    assert.equal(translateKey(words, "home.hit", { when: { key: "home.sent", args: { at: { moment: Written, format: "relative" } } }, day: { moment: Written, format: "date" } }), "Sent <relative> (<date>)");
    assert.deepEqual(written, [[Instant, "relative"], [Instant, "date"]]);
});

test("the page's words write a moment in the reader's zone in the table's patterns, as a timestamp is written", () => {
    const strings = new ClientWords();

    strings.useTable(tableOf("ru", { "home.sent": "Отправлено {at}" }, Russian));

    assert.equal(strings.translate("home.sent", { at: { moment: Written } }), `Отправлено ${formatTimestamp(Instant, "date-time", { temporal: Russian, language: "ru" }, Instant)}`);
    assert.equal(strings.translate("home.sent", { at: { moment: Written, format: "time" } }), `Отправлено ${formatTimestamp(Instant, "time", { temporal: Russian, language: "ru" }, Instant)}`);
});

test("a relative moment starts the ticks, which go on while each writes one again and stop after one that writes none", t => {
    t.mock.timers.enable({ apis: ["setInterval"] });

    const strings = new ClientWords();
    let ticks = 0;
    let stillRelative = true;

    strings.useTable(tableOf("en", { "home.sent": "Sent {at}" }));
    strings.onMomentTick(() => {
        ticks++;

        if (stillRelative)
            strings.translate("home.sent", { at: { moment: new Date(Date.now()).toISOString(), format: "relative" } });
    });

    strings.translate("home.sent", { at: { moment: Written } });
    t.mock.timers.tick(60_000);
    assert.equal(ticks, 0, "a day and a time never tick");

    strings.translate("home.sent", { at: { moment: Written, format: "relative" } });
    t.mock.timers.tick(15_000);
    t.mock.timers.tick(15_000);
    assert.equal(ticks, 2);

    stillRelative = false;
    t.mock.timers.tick(15_000);
    t.mock.timers.tick(15_000);
    t.mock.timers.tick(60_000);
    assert.equal(ticks, 3, "the tick that wrote none is the last");
});

test("the moments' pass writes again only the marks holding a moment", () => {
    const strings = new ClientWords();
    const sent = new MarkedElement({ "#text": ["home.sent", { at: { moment: Written, format: "date" } }] });
    const title = new MarkedElement({ "#text": ["home.title"] });
    const root = new MarkedRoot([sent, title]);

    strings.useTable(tableOf("en", { "home.sent": "Sent {at}", "home.title": "Home" }));
    strings.rewriteMarks(root as unknown as ParentNode, true);

    assert.equal(sent.textContent, `Sent ${formatTimestamp(Instant, "date", { temporal: null, language: "en" }, Instant)}`);
    assert.equal(title.textContent, "", "a mark without a moment is left for a switch");
    assert.equal(marksMoment(root as unknown as ParentNode), true);
    assert.equal(marksMoment(new MarkedRoot([title]) as unknown as ParentNode), false);
});

class MarkedElement {
    public textContent = "";
    private readonly attributes = new Map<string, string>();

    public constructor(marks: Record<string, unknown>) {
        this.attributes.set("data-ui-words", JSON.stringify(marks));
    }

    public getAttribute(name: string): string | null {
        return this.attributes.get(name) ?? null;
    }

    public setAttribute(name: string, value: string): void {
        this.attributes.set(name, value);
    }
}

/** Answers `[data-ui-words]` and `[data-ui-words*='…']`, as the moments' pass asks; no templates. */
class MarkedRoot {
    private readonly elements: readonly MarkedElement[];

    public constructor(elements: readonly MarkedElement[]) {
        this.elements = elements;
    }

    public querySelectorAll(selector: string): readonly unknown[] {
        if (selector === "template")
            return [];

        const contains = /\*='([^']*)'\]$/.exec(selector)?.[1];

        return this.elements.filter(element => contains === undefined || (element.getAttribute("data-ui-words") ?? "").includes(contains));
    }

    public querySelector(selector: string): unknown {
        return this.querySelectorAll(selector)[0] ?? null;
    }
}
