// A timestamp written in the reader's zone in the page's patterns, and a relative one — a relative day too — kept current as time passes.

// `.ts` on the value imports, and types imported as types: `node --test` loads this module as it is.
import { TimestampClass, TimestampFormatAttribute, TimestampTextClass } from "../addressing/dom-attributes.ts";
import { componentParts } from "../addressing/dom-registry.ts";
import { isRelativeFormat, nearDay, readInstant, readTimestampFormat, timestampText } from "../rendering/timestamp-format.ts";
import type { TimestampFormat } from "../rendering/timestamp-format.ts";
import { clientStrings } from "../runtime/client-strings.ts";
import { needRelativeTicks } from "../runtime/relative-clock.ts";
import type { PropertyPatchEngine } from "../updates/property-patch-engine.ts";
import { observeComponents } from "./dom-mutations.ts";

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
        this.apply(this.root.querySelectorAll<HTMLElement>(`.${TimestampClass}`), clientStrings.temporal === null);
        clientStrings.onTable(() => this.apply(this.root.querySelectorAll<HTMLElement>(`.${TimestampClass}`)));

        // The components the patch landed on, not every one the id addresses: a package's clone of a template is patched alone.
        options.propertyPatchEngine?.addValueChangeHandler(change => this.apply(componentParts(change.components, `.${TimestampClass}`)));

        // A patched instant, and a timestamp that arrives in a built row; its own text is not a change to answer.
        observeComponents(this.root, `.${TimestampClass}`, {
            childList: true,
            addedOnly: true,
            attributeFilter: [InstantAttribute],
            relevant: mutation => mutation.type === "attributes" || !(mutation.target instanceof Element && mutation.target.closest(`.${TimestampClass}`) !== null)
        }, stamps => this.apply(stamps));
    }

    /** Writes each stamp's text; `relativeOnly` leaves a day or a time as painted, until the table's patterns are here. */
    private apply(stamps: Iterable<HTMLElement>, relativeOnly = false): void {
        // The table's language, which a switch changes before the page's `lang` is written again.
        const words = { temporal: clientStrings.temporal, language: clientStrings.language || document.documentElement.lang };
        const now = Date.now();
        let relative = false;

        for (const stamp of stamps) {
            const format = readTimestampFormat(stamp.getAttribute(TimestampFormatAttribute));
            const instant = readInstant(stamp.getAttribute(InstantAttribute));
            const text = stamp.querySelector<HTMLElement>(`.${TimestampTextClass}`);

            if (text === null || (relativeOnly && !needsNoPatterns(format, instant, now)))
                continue;

            const written = instant === null ? "" : timestampText(instant, format, words, now);

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
        const stamps = [...this.root.querySelectorAll<HTMLElement>(`.${TimestampClass}:is([${TimestampFormatAttribute}="relative"], [${TimestampFormatAttribute}="relative-date"])`)];

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
