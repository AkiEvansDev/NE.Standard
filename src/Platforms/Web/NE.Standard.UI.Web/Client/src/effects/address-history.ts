import { withParameters } from "./navigation-url.ts";

// Where an entry's number is kept in its history state.
const EntryKey = "neEntry";

/** The parts of a window the page's address is kept through. */
export type AddressWindow = {
    readonly location: { readonly pathname: string; readonly search: string; readonly origin?: string };
    // The Navigation API, where the browser has it: its entries are this site's alone, so it knows whether one stands behind.
    readonly navigation?: { readonly canGoBack: boolean };
    // Where the page was loaded from, which says the same where there is no Navigation API.
    readonly document?: { readonly referrer: string };
    readonly history: {
        readonly state: unknown;
        replaceState(data: unknown, unused: string, url?: string): void;
        pushState(data: unknown, unused: string, url: string): void;
        go(delta: number): void;
    };
    addEventListener(type: "popstate", listener: () => void): void;
};

export type AddressHistoryOptions = {
    readonly window: AddressWindow;
    // The reader went back or forward to another entry of this page's route: its controller hears the entry's parameters.
    readonly revisit: (parameters: Record<string, unknown> | null) => void;
    // An entry whose query names another runtime of this route than `previous`, the one the page stood on: the page goes to it in
    // place, answering whether it did.
    readonly switchRuntime: (search: string, previous: string) => boolean;
    // The reader went back or forward to an entry of another route, which only a page load shows.
    readonly load: () => void;
};

/**
 * The page's state in its address: a `ReplaceAddress` or `PushAddress` effect rewrites the query while the route stays — no page
 * load, no new runtime, nothing the leave guard asks about — and Back or Forward to an entry of the same route is told to the
 * controller instead of reloading the page, or goes to the entry's runtime where it names another.
 */
export class AddressHistory {
    private readonly window: AddressWindow;
    private readonly revisit: (parameters: Record<string, unknown> | null) => void;
    private readonly switchRuntime: (search: string, previous: string) => boolean;
    private readonly load: () => void;

    // The route the page was loaded at; a query written here keeps it.
    private readonly route: string;

    // The query the page shows now, so an entry that differs only by its fragment moves nothing.
    private search: string;

    // The entry the page stands on, numbered in its history state, so Back or Forward says how many entries it went.
    private entry: number;

    // The last Back or Forward to another entry of the route: how far it went (unknown for an entry this page never numbered) and the
    // query it left, so it can be undone.
    private lastStep: { readonly step: number | null; readonly previous: string } | null = null;

    // The step back an undone Back or Forward takes, which the page does not act on.
    private undoing = false;

    public constructor(options: AddressHistoryOptions) {
        this.window = options.window;
        this.revisit = options.revisit;
        this.switchRuntime = options.switchRuntime;
        this.load = options.load;
        this.route = options.window.location.pathname;
        this.search = options.window.location.search;
        this.entry = readEntry(options.window.history.state) ?? 0;

        // The entry the page was loaded on, numbered where it is not yet; its address stays as it is.
        if (readEntry(options.window.history.state) === null)
            options.window.history.replaceState({ [EntryKey]: this.entry }, "");

        options.window.addEventListener("popstate", () => this.onPopState());
    }

    /** Rewrites the current entry's query from `parameters`. */
    public replace(parameters: Record<string, unknown> | null): void {
        this.write(withParameters(this.route, parameters), false);
    }

    /** Adds an entry whose query is `parameters`; the address the page already shows adds none, so Back never lands where it stands. */
    public push(parameters: Record<string, unknown> | null): void {
        const url = withParameters(this.route, parameters);
        const location = this.window.location;

        this.write(url, url !== `${location.pathname}${location.search}`);
    }

    /**
     * The browser's Back where the entry behind this one is of this site, answering whether it was: what it lands on is followed as
     * any Back is — told to the controller, gone to in place, loaded, the reader with unsaved work asked first.
     */
    public back(): boolean {
        if (!this.hasEntryBehind())
            return false;

        this.window.history.go(-1);
        return true;
    }

    /**
     * Whether the entry behind this one is of this site: the Navigation API's word where the browser has it, else an entry this route
     * wrote or a page of this site the tab came from. Limit: without the API, a tab a page of this site opened names it as its referrer
     * and has no entry behind, so the step goes nowhere.
     */
    private hasEntryBehind(): boolean {
        const navigation = this.window.navigation;

        if (navigation !== undefined)
            return navigation.canGoBack;

        if (this.entry > 0)
            return true;

        const referrer = this.window.document?.referrer ?? "";
        const origin = this.window.location.origin;

        return origin !== undefined && referrer.startsWith(`${origin}/`);
    }

    /** Adds the entry of another runtime of this route the page went to in place, where a link to it would have loaded it. */
    public enter(url: string): void {
        this.write(url, true);
    }

    /**
     * Undoes the Back or Forward just taken, so the address is again the entry the page shows: the reader holding unsaved work is
     * asked first, and a leave they go on with is followed as a link's.
     */
    public stepBack(): void {
        const last = this.lastStep;

        this.lastStep = null;

        if (last === null)
            return;

        if (last.step !== null && last.step !== 0) {
            this.undoing = true;
            this.window.history.go(-last.step);
            return;
        }

        // An entry this page never numbered: how far it went is unknown, so the address the page shows is added instead.
        this.write(`${this.route}${last.previous}`, true);
    }

    private write(url: string, push: boolean): void {
        if (push) {
            this.entry++;
            this.window.history.pushState({ [EntryKey]: this.entry }, "", url);
        }
        else {
            this.window.history.replaceState({ [EntryKey]: this.entry }, "", url);
        }

        this.search = this.window.location.search;
    }

    private onPopState(): void {
        const location = this.window.location;
        const entry = readEntry(this.window.history.state);
        const step = entry === null ? null : entry - this.entry;

        this.entry = entry ?? this.entry;

        if (this.undoing) {
            this.undoing = false;
            this.search = location.search;
            return;
        }

        if (location.pathname !== this.route) {
            this.load();
            return;
        }

        if (location.search === this.search)
            return;

        const previous = this.search;

        this.search = location.search;
        this.lastStep = { step, previous };

        if (!this.switchRuntime(location.search, previous))
            this.revisit(readQueryParameters(location.search));
    }
}

/** The number an entry's history state carries, or none for an entry this page did not write. */
function readEntry(state: unknown): number | null {
    if (typeof state !== "object" || state === null)
        return null;

    const entry = (state as Record<string, unknown>)[EntryKey];

    return typeof entry === "number" ? entry : null;
}

/**
 * Whether two queries name different runtimes of a route keyed by `identity`: a parameter of it with other values, in order, as the
 * server keys them — a value given more than once is the list of them, one not given is none.
 */
export function differsInIdentity(search: string, other: string, identity: readonly string[]): boolean {
    if (identity.length === 0)
        return false;

    const parameters = new URLSearchParams(search);
    const others = new URLSearchParams(other);

    return identity.some(name => parameters.getAll(name).join(",") !== others.getAll(name).join(","));
}

/** A query as the route's parameters: a key given more than once is an array of its values, in order; no key is none. */
export function readQueryParameters(search: string): Record<string, unknown> | null {
    const parameters = new URLSearchParams(search);

    if ([...parameters.keys()].length === 0)
        return null;

    const result: Record<string, unknown> = {};

    parameters.forEach((value, key) => {
        if (Object.hasOwn(result, key)) {
            const existing = result[key];

            result[key] = Array.isArray(existing) ? [...(existing as unknown[]), value] : [existing, value];
            return;
        }

        result[key] = value;
    });

    return result;
}
