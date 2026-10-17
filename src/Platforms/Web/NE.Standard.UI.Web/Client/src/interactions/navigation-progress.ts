// A load the page starts itself — a press on a link of this site that leaves it, a NavigateEffect, a switch to another runtime of its
// route — keeps the old page drawn and live until the next has painted. A thin bar along the window's top says one is under way, once
// the wait outlasts a moment, so a quick load shows nothing. It goes when the page comes back from the browser's page cache, when the
// browser says the load was dropped, and past a ceiling: a load that turned into a download or was answered with no page tells the
// page nothing in a browser without the Navigation API.

// `.ts` on the value imports: `node --test` loads this module as it is.
import { leaveTarget } from "./leave-guard.ts";

/** How long a load may take unseen. */
const ShownAfterMilliseconds = 200;

/** How long the bar stands for a load no page has answered. */
const GivenUpAfterMilliseconds = 10_000;

const ProgressClass = "ui-navigation-progress";

/** What the bar reaches of the window: its address, where presses and the page's comings and goings are heard, and its timers. */
type ProgressWindow = {
    readonly location: { readonly href: string };
    addEventListener(type: string, listener: (domEvent: Event) => void): void;
    setTimeout(handler: () => void, timeout: number): number;
    clearTimeout(id: number): void;
    // Where the browser has it: its `navigateerror` says a load was dropped — a download, an answer with no content, Stop.
    readonly navigation?: { addEventListener(type: string, listener: () => void): void };
};

export type NavigationProgressOptions = {
    readonly window: ProgressWindow;
    readonly shownAfterMilliseconds?: number;
    readonly givenUpAfterMilliseconds?: number;
};

export class NavigationProgress {
    private readonly window: ProgressWindow;
    private readonly shownAfter: number;
    private readonly givenUpAfter: number;
    private bar: HTMLElement | null = null;
    private timer: number | null = null;

    // The wait under way: a later one takes its place, and a stop handed out for an earlier one ends nothing.
    private wait: object | null = null;

    public constructor(options: NavigationProgressOptions) {
        this.window = options.window;
        this.shownAfter = options.shownAfterMilliseconds ?? ShownAfterMilliseconds;
        this.givenUpAfter = options.givenUpAfterMilliseconds ?? GivenUpAfterMilliseconds;

        // Bubbling, on the window: a press the leave guard or the page took for itself has said so by then, or says so before the bar shows.
        this.window.addEventListener("click", domEvent => this.handlePress(domEvent));

        // Back from the browser's page cache: the load it was left for is over.
        this.window.addEventListener("pageshow", domEvent => {
            if ((domEvent as Event & { persisted?: boolean }).persisted === true)
                this.stop();
        });

        // Off before the old page's picture is taken for the fade across (`@view-transition`), which would show it over the new page.
        this.window.addEventListener("pageswap", () => this.stop());
        this.window.navigation?.addEventListener("navigateerror", () => this.stop());
    }

    private handlePress(domEvent: Event): void {
        if (leaveTarget(domEvent as unknown as Parameters<typeof leaveTarget>[0], this.window.location.href) !== null)
            this.start(domEvent);
    }

    /** Starts a wait for a page, `press` the link's press that began it: the bar shows once it outlasts a moment. Answers its own stop. */
    public start(press: Event | null = null): () => void {
        const wait = {};

        this.clearTimer();
        this.wait = wait;

        // One wait following another keeps a bar already shown: it would only blink.
        if (this.isShown)
            this.giveUpLater();
        else
            this.timer = this.window.setTimeout(() => this.show(press), this.shownAfter);

        return () => {
            if (this.wait === wait)
                this.stop();
        };
    }

    private clearTimer(): void {
        if (this.timer === null)
            return;

        this.window.clearTimeout(this.timer);
        this.timer = null;
    }

    private get isShown(): boolean {
        return this.bar?.isConnected === true;
    }

    private giveUpLater(): void {
        this.timer = this.window.setTimeout(() => this.stop(), this.givenUpAfter);
    }

    private show(press: Event | null): void {
        this.timer = null;

        // Taken after this listener heard it — a leave the guard asks about first, a page gone to in place: no load is under way.
        if (press?.defaultPrevented === true) {
            this.stop();
            return;
        }

        this.bar ??= createBar();
        document.body.append(this.bar);
        this.giveUpLater();
    }

    /** Ends whatever wait is under way, and the bar with it. */
    public stop(): void {
        this.wait = null;
        this.clearTimer();
        this.bar?.remove();
    }
}

/** A progress with no reading, as the core's own draws one, so it sweeps as one does and stands still under reduced motion. */
function createBar(): HTMLElement {
    const bar = document.createElement("div");
    const track = document.createElement("span");
    const fill = document.createElement("span");

    bar.className = `${ProgressClass} ui-progress ui-progress--linear`;
    // The browser says a load is under way itself; the bar is for the eye.
    bar.setAttribute("aria-hidden", "true");
    track.className = "ui-progress__track";
    fill.className = "ui-progress__fill";
    track.append(fill);
    bar.append(track);

    return bar;
}
