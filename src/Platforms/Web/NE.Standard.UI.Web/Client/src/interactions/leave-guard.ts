// `.ts` on the value imports and the metadata's types type-only, so `npm test` can load this module directly.
import { EventBoundaryAttribute } from "../addressing/dom-attributes.ts";
import type { ClientEffect } from "../metadata/metadata-index.ts";
import { isLocalRoute } from "../rendering/url-safety.ts";
import { logWarn } from "../runtime/logger.ts";

// Keeps the reader from leaving a page whose controller holds unsaved work (`HoldsUnsavedWork`). A leave the page starts itself — a
// press on one of its links, a NavigateEffect — asks the controller instead (`OnLeaveRequestedAsync`), whose answer runs as the
// leave's own; closing, reloading or going back asks the browser's own question, the only one a browser allows there. While values
// are still on their way, such a leave asks the controller behind them, whatever the flag: their write may set it.

/** What the guard reaches of the window: its address, how it leaves, and where presses and the unload are heard. */
type LeaveWindow = {
    readonly location: { readonly href: string; assign(url: string): void };
    addEventListener(type: string, listener: (domEvent: Event) => void): void;
    removeEventListener(type: string, listener: (domEvent: Event) => void): void;
};

export type LeaveGuardOptions = {
    readonly window: LeaveWindow;
    /** Asks the controller about leaving for `target`: the effects its answer runs, its changes applied already. */
    readonly ask: (target: string) => Promise<readonly ClientEffect[] | undefined>;
    /** Runs an answer's effects. */
    readonly apply: (effects: readonly ClientEffect[] | undefined) => void;
    /** Asks in the framework's own dialog; `leave` runs on its Leave, and nothing on Stay. */
    readonly confirm: (target: string, leave: () => void) => void;
    /** Whether the page has values the server has not answered yet: a field waiting out its pause, a value queued or on its way. */
    readonly pending: () => boolean;
    /** Commits what waits and resolves once every value given has its answer applied. */
    readonly settle: () => Promise<void>;
    /** Follows a leave the page goes through in place — to another runtime of its route — answering whether it took it; none unloads. */
    readonly follow?: (target: string) => boolean;
};

/** A press as the guard reads it: which button, which keys held, whether something took it already, and what it landed on. */
type Press = {
    readonly button: number;
    readonly ctrlKey: boolean;
    readonly metaKey: boolean;
    readonly shiftKey: boolean;
    readonly altKey: boolean;
    readonly defaultPrevented: boolean;
    // What was pressed, which the link is found up from.
    readonly target: (EventTarget & { closest?: (selector: string) => Element | null }) | null;
};

export class LeaveGuard {
    private readonly options: LeaveGuardOptions;
    private holds = false;

    // The page has held unsaved work once: from then on its values still on their way count too, for the browser's question.
    private guards = false;

    // A leave being decided — its values awaited, or the controller asked: a second press meanwhile is swallowed, not asked twice.
    private asking = false;

    // An answer's effects are running: a navigation among them is the controller's own decision, never asked about again.
    private deciding = false;

    // The page is on its way out by a decision already made: the browser's question would only ask it a second time.
    private released = false;

    // Decided as the browser asks, which waits for nothing: the flag, or a value not answered yet on a page that has guarded work.
    private readonly beforeUnload = (domEvent: Event): void => {
        if (this.holds || this.options.pending())
            domEvent.preventDefault();
    };

    public constructor(options: LeaveGuardOptions) {
        this.options = options;

        // Bubbling, on the window: a component that took the press for itself has said so by then (`defaultPrevented`).
        options.window.addEventListener("click", domEvent => this.handlePress(domEvent));

        // Back from the browser's page cache: the page is the reader's again, and so is the question.
        options.window.addEventListener("pageshow", domEvent => {
            if ((domEvent as Event & { persisted?: boolean }).persisted === true)
                this.rearm();
        });
    }

    /** Whether the page holds work its reader has not saved, as the controller last said. */
    public get holdsUnsavedWork(): boolean {
        return this.holds;
    }

    /**
     * Takes the controller's word. The browser's question listens from the first time the page holds unsaved work — never on a page
     * that has not, which is every page that guards nothing — and asks while the flag is on or a value is still on its way.
     */
    public set(holds: boolean): void {
        if (this.holds === holds)
            return;

        this.holds = holds;

        if (holds)
            this.guards = true;

        if (this.guards && !this.released)
            this.options.window.addEventListener("beforeunload", this.beforeUnload);
    }

    /** Whether a leave would be asked about now: the page holds unsaved work, or a value is still on its way, and nothing let go of it. */
    public get asks(): boolean {
        return !this.released && (this.holds || this.options.pending());
    }

    /** A NavigateEffect's address, or an entry Back or Forward went to in place, local already: followed, or decided as a link's press is. */
    public navigate(url: string): void {
        if (this.deciding || !this.asks) {
            this.leave(url);
            return;
        }

        void this.decideAsync(url);
    }

    /** The framework's own question, a controller's answer or the page's own when the controller cannot be asked. */
    public confirm(target: string): void {
        this.options.confirm(target, () => this.leave(target));
    }

    /** Leaves for `url` by a decision already made: the browser is not asked again. */
    public leave(url: string): void {
        // Gone to in place, the page stays: its browser question stays with it.
        if (this.options.follow?.(url) === true)
            return;

        this.release();
        this.options.window.location.assign(url);
    }

    /** Takes the browser's question away for a leave the page decided itself: the runtime's own reload is one. */
    public release(): void {
        this.released = true;
        this.options.window.removeEventListener("beforeunload", this.beforeUnload);
    }

    private rearm(): void {
        this.released = false;

        if (this.guards)
            this.options.window.addEventListener("beforeunload", this.beforeUnload);
    }

    private handlePress(domEvent: Event): void {
        // A press in a link's own menu or action bar is no press of the link: the browser follows none either, an entry with no address
        // of its own handing its click to the anchor around it.
        if (pressesInsideLinksPart(domEvent as unknown as Press)) {
            domEvent.preventDefault();
            return;
        }

        if (this.released)
            return;

        const target = leaveTarget(domEvent as unknown as Press, this.options.window.location.href);

        if (target === null)
            return;

        // Nothing held and nothing on its way: followed at once, by the page where it goes there in place, else by the browser.
        if (!this.holds && !this.options.pending()) {
            if (this.options.follow?.(target) === true)
                domEvent.preventDefault();

            return;
        }

        domEvent.preventDefault();

        void this.decideAsync(target);
    }

    /**
     * Asks the controller, after the values still on their way where nothing is held yet: its answer is the navigation itself while
     * nothing is held, else what the controller does about the leave.
     */
    private async decideAsync(target: string): Promise<void> {
        if (this.asking)
            return;

        this.asking = true;

        let effects: readonly ClientEffect[] | undefined;

        try {
            // Not decided here once they are answered: a value's answer carries only its refusals, and the flag its write set reaches
            // the page in the runtime's own flush, after it. The leave asked behind them is answered on the flag as they left it.
            if (!this.holds)
                await this.options.settle();

            effects = await this.options.ask(target);
        }
        catch (error) {
            // The controller cannot answer — the connection is gone — and the reader still decides: the page asks in its own words.
            logWarn("the controller could not be asked about leaving the page; the page asks the reader itself.", error);
            this.confirm(target);
            return;
        }
        finally {
            this.asking = false;
        }

        this.deciding = true;

        try {
            this.options.apply(effects);
        }
        finally {
            this.deciding = false;
        }
    }
}

/**
 * The address a press leaves the page for, when it is a leave the page starts itself: a plain press of the main button with no key
 * held, on a link of this site that opens here — not in another tab or window, not a download, not a jump within the page.
 */
export function leaveTarget(press: Press, pageHref: string): string | null {
    if (press.defaultPrevented || press.button !== 0 || press.ctrlKey || press.metaKey || press.shiftKey || press.altKey)
        return null;

    const pressed = press.target;
    const link = typeof pressed?.closest === "function" ? pressed.closest("a[href]") : null;

    if (link === null || link.hasAttribute("download") || pressesInsideLinksPart(press))
        return null;

    const opens = link.getAttribute("target");

    if (opens !== null && opens !== "" && opens.toLowerCase() !== "_self")
        return null;

    let url: URL;
    let page: URL;

    try {
        page = new URL(pageHref);
        url = new URL(link.getAttribute("href") ?? "", page);
    }
    catch {
        return null;
    }

    // Another site, or a scheme with no origin of its own (`mailto:`, `javascript:`): not this page's leave to ask about.
    if (url.origin !== page.origin)
        return null;

    // A jump to a place on the same page unloads nothing.
    if (url.hash.length > 0 && url.pathname === page.pathname && url.search === page.search)
        return null;

    const address = `${url.pathname}${url.search}${url.hash}`;

    return isLocalRoute(address) ? address : null;
}

/**
 * Whether a press landed inside an event boundary a link holds — the card's own context menu, its action bar — which is that part's
 * press, never the link's. A link inside such a part (a menu entry with an address of its own) is the press's own link.
 */
function pressesInsideLinksPart(press: Press): boolean {
    const pressed = press.target;

    if (typeof pressed?.closest !== "function")
        return false;

    const link = pressed.closest("a[href]");
    const boundary = pressed.closest(`[${EventBoundaryAttribute}]`);

    return link !== null && boundary !== null && boundary !== link && link.contains(boundary);
}
