// A timestamp written in the reader's zone in the page's patterns, and a relative one — a relative day too — kept current as time passes.

import { componentParts } from "../addressing/dom-registry";
import { asHeading, formatTimestamp, isRelativeFormat, nearDay, readInstant, readTimestampFormat } from "../rendering/timestamp-format";
import type { TimestampFormat } from "../rendering/timestamp-format";
import { clientStrings } from "../runtime/client-strings";
import { needRelativeTicks } from "../runtime/relative-clock";
import { PropertyPatchEngine } from "../updates/property-patch-engine";
import { observeComponents } from "./dom-mutations";

const RootClass = "ui-timestamp";
const TextClass = "ui-timestamp__text";
const FormatAttribute = "data-ui-timestamp-format";
const InstantAttribute = "datetime";

export type TimestampEngineOptions = {
    readonly root?: ParentNode;
    readonly propertyPatchEngine?: PropertyPatchEngine;
};

export class TimestampEngine {
    private readonly root: ParentNode;

    public constructor(options: TimestampEngineOptions = {}) {
        this.root = options.root ?? document;

        // The server's text stands until the table's patterns arrive, since it is written in them: then only the time moves.
        this.apply(this.root.querySelectorAll<HTMLElement>(`.${RootClass}`), clientStrings.temporal === null);
        clientStrings.onTable(() => this.apply(this.root.querySelectorAll<HTMLElement>(`.${RootClass}`)));

        // The components the patch landed on, not every one the id addresses: a package's clone of a template is patched alone.
        options.propertyPatchEngine?.addValueChangeHandler(change => this.apply(componentParts(change.components, `.${RootClass}`)));

        // A patched instant, and a timestamp that arrives in a built row; its own text is not a change to answer.
        observeComponents(this.root, `.${RootClass}`, {
            childList: true,
            attributeFilter: [InstantAttribute],
            relevant: mutation => mutation.type === "attributes" || !(mutation.target instanceof Element && mutation.target.closest(`.${RootClass}`) !== null)
        }, stamps => this.apply(stamps));
    }

    /** Writes each stamp's text; `relativeOnly` leaves a day or a time as painted, until the table's patterns are here. */
    private apply(stamps: Iterable<HTMLElement>, relativeOnly = false): void {
        // The table's language, which a switch changes before the page's `lang` is written again.
        const words = { temporal: clientStrings.temporal, language: clientStrings.language || document.documentElement.lang };
        const now = Date.now();
        let relative = false;

        for (const stamp of stamps) {
            const format = readTimestampFormat(stamp.getAttribute(FormatAttribute));
            const instant = readInstant(stamp.getAttribute(InstantAttribute));
            const text = stamp.querySelector<HTMLElement>(`.${TextClass}`);

            if (text === null || (relativeOnly && !needsNoPatterns(format, instant, now)))
                continue;

            const formatted = instant === null ? "" : formatTimestamp(instant, format, words, now);
            // A day's name standing alone heads what follows it: "Today", where a moment in a sentence says "today".
            const written = format === "relative-date" ? asHeading(formatted, words.language) : formatted;

            // Written only when it changes: a relative text read again every few seconds mostly reads the same.
            if (text.textContent !== written)
                text.textContent = written;

            relative ||= isRelativeFormat(format) && instant !== null;
        }

        // On the page's one relative clock, which a relative moment in words ticks by too.
        if (relative)
            needRelativeTicks(this.refreshRelative);
    }

    /** Writes every relative timestamp again; answers whether one is left on the page, which keeps the ticks coming. */
    private readonly refreshRelative = (): boolean => {
        const stamps = [...this.root.querySelectorAll<HTMLElement>(`.${RootClass}:is([${FormatAttribute}="relative"], [${FormatAttribute}="relative-date"])`)];

        if (stamps.length === 0)
            return false;

        this.apply(stamps);
        return true;
    };
}

/** Whether a stamp's text needs no table's patterns: a relative one, and a relative day that is a word of its own ("today"). */
function needsNoPatterns(format: TimestampFormat, instant: number | null, now: number): boolean {
    return format === "relative" || (format === "relative-date" && instant !== null && nearDay(instant, now) !== null);
}
