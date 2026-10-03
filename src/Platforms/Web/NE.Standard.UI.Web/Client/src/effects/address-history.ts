import { withParameters } from "./navigation-url.ts";

/** The parts of a window the page's address is kept through. */
export type AddressWindow = {
    readonly location: { readonly pathname: string; readonly search: string };
    readonly history: {
        replaceState(data: unknown, unused: string, url: string): void;
        pushState(data: unknown, unused: string, url: string): void;
    };
    addEventListener(type: "popstate", listener: () => void): void;
};

export type AddressHistoryOptions = {
    readonly window: AddressWindow;
    // The reader went back or forward to another entry of this page's route: its controller hears the entry's parameters.
    readonly revisit: (parameters: Record<string, unknown> | null) => void;
    // The reader went back or forward to an entry of another route, which only a page load shows.
    readonly load: () => void;
};

/**
 * The page's state in its address: a `ReplaceAddress` or `PushAddress` effect rewrites the query while the route stays — no page
 * load, no new runtime, nothing the leave guard asks about — and Back or Forward to an entry of the same route is told to the
 * controller instead of reloading the page.
 */
export class AddressHistory {
    private readonly window: AddressWindow;
    private readonly revisit: (parameters: Record<string, unknown> | null) => void;
    private readonly load: () => void;

    // The route the page was loaded at; a query written here keeps it.
    private readonly route: string;

    // The query the page shows now, so an entry that differs only by its fragment moves nothing.
    private search: string;

    public constructor(options: AddressHistoryOptions) {
        this.window = options.window;
        this.revisit = options.revisit;
        this.load = options.load;
        this.route = options.window.location.pathname;
        this.search = options.window.location.search;

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

    private write(url: string, push: boolean): void {
        if (push)
            this.window.history.pushState(null, "", url);
        else
            this.window.history.replaceState(null, "", url);

        this.search = this.window.location.search;
    }

    private onPopState(): void {
        const location = this.window.location;

        if (location.pathname !== this.route) {
            this.load();
            return;
        }

        if (location.search === this.search)
            return;

        this.search = location.search;
        this.revisit(readQueryParameters(location.search));
    }
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
