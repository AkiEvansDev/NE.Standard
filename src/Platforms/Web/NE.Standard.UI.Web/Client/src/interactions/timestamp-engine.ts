// A timestamp written in the reader's zone in the page's patterns, and a relative one kept current as time passes.

import { componentParts } from "../addressing/dom-registry";
import { formatTimestamp, readInstant, readTimestampFormat, RelativeRefreshMilliseconds } from "../rendering/timestamp-format";
import { clientStrings } from "../runtime/client-strings";
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
    // Running only while a relative timestamp is on the page.
    private timer: number | null = null;

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

            if (text === null || (relativeOnly && format !== "relative"))
                continue;

            const written = instant === null ? "" : formatTimestamp(instant, format, words, now);

            // Written only when it changes: a relative text read again every few seconds mostly reads the same.
            if (text.textContent !== written)
                text.textContent = written;

            relative ||= format === "relative" && instant !== null;
        }

        if (relative && this.timer === null)
            this.timer = window.setInterval(() => this.refreshRelative(), RelativeRefreshMilliseconds);
    }

    /** Writes every relative timestamp again, and stops once none is left on the page. */
    private refreshRelative(): void {
        const stamps = [...this.root.querySelectorAll<HTMLElement>(`.${RootClass}[${FormatAttribute}="relative"]`)];

        if (stamps.length === 0 && this.timer !== null) {
            window.clearInterval(this.timer);
            this.timer = null;
            return;
        }

        this.apply(stamps);
    }
}
