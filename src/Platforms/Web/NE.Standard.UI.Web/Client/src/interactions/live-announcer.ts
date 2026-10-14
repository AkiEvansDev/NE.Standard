// What a controller says to a screen reader and shows nothing of (AnnounceEffect): two visually hidden live regions beside the
// notification host, a polite one and an assertive one, which the notification engine owns and puts up with its host. An engine's own
// words (a keyboard move, a pane lifted) go through the same regions (`announce`).

// `.ts` on the value imports: `node --test` loads this module as it is.
import { clientStrings } from "../runtime/client-strings.ts";
import type { AuthorText, Phrase } from "../runtime/words.ts";

const AnnouncerClass = "ui-announcer";

// Long enough for a reader to reach the words in its queue; gone after it, so reading the page later does not meet them.
const HoldMs = 7000;

export type Politeness = "polite" | "assertive";

// The page's announcer, which the engines speak through: the notification host's, else one put up on the body at the first words.
let pageAnnouncer: LiveAnnouncer | null = null;

/** Speaks words through the page's announcer, as `LiveAnnouncer.announce` does. */
export function announce(message: string | Phrase | AuthorText, politeness: Politeness = "polite"): void {
    (pageAnnouncer ?? putUpAnnouncer(document.body)).announce(message, politeness);
}

/** Puts the page's announcer up in a container, the notification host's: the one every engine's words go through. */
export function putUpAnnouncer(container: ParentNode): LiveAnnouncer {
    pageAnnouncer = new LiveAnnouncer(container);

    return pageAnnouncer;
}

/** Says where a thing the keyboard moved now stands, 1-based, in the one word every keyboard move uses. */
export function announceMoved(index: number, count: number): void {
    announce({ key: "ui.move.done", args: { index, count } });
}

export class LiveAnnouncer {
    private readonly container: ParentNode;
    private readonly regions = new Map<Politeness, HTMLElement>();

    public constructor(container: ParentNode) {
        this.container = container;

        // Up before the first words, as the notification host is: a live region inserted along with its words is not reliably read.
        this.ensureRegion("polite");
        this.ensureRegion("assertive");
    }

    /** Speaks the words: a phrase or an author's text through the page's words, marked; a plain string as written. */
    public announce(message: string | Phrase | AuthorText, politeness: Politeness = "polite"): HTMLElement {
        const line = document.createElement("div");

        if (typeof message === "string")
            line.textContent = message;
        else
            clientStrings.writeValue(line, null, message);

        // A line of its own each time rather than the region's text rewritten: the same words twice running are spoken twice.
        this.ensureRegion(politeness).append(line);
        setTimeout(() => line.remove(), HoldMs);

        return line;
    }

    private ensureRegion(politeness: Politeness): HTMLElement {
        const held = this.regions.get(politeness);

        if (held !== undefined && held.isConnected)
            return held;

        const selector = `.${AnnouncerClass}[aria-live="${politeness}"]`;
        const existing = this.container.querySelector<HTMLElement>(selector);
        const region = existing ?? document.createElement("div");

        if (existing === null) {
            region.className = AnnouncerClass;
            region.setAttribute("aria-live", politeness);
            this.container.append(region);
        }

        this.regions.set(politeness, region);

        return region;
    }
}
