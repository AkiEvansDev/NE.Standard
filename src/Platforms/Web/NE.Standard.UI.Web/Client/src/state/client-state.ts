// What the page reports of itself to its runtime: whether it is on screen, and what the browser lets it show. Carried by every
// attach and sent again as either changes, so the server knows which of a reader's pages is looked at and which may notify.

import type { ClientState } from "../metadata/metadata-types.ts";

export type { ClientState } from "../metadata/metadata-types.ts";

/** The browser's parts the state is read from; a test stands in for them. */
export type ClientStateSource = {
    readonly visibilityState: () => DocumentVisibilityState;
    readonly notificationPermission: () => NotificationPermission | undefined;
};

const BrowserSource: ClientStateSource = {
    visibilityState: () => document.visibilityState,
    notificationPermission: browserNotificationPermission
};

/** Whether a page is on screen: anything but hidden, focus not counted — an unfocused window is usually still read. */
export function isOnScreen(visibilityState: DocumentVisibilityState): boolean {
    return visibilityState !== "hidden";
}

/** What the browser lets the page show, or none where it shows no notifications. */
export function browserNotificationPermission(): NotificationPermission | undefined {
    // A page that is not secure (plain http but for localhost) shows none, though Chromium names it `denied` there: a reader told to
    // unblock it in the settings would find nothing to unblock.
    return typeof Notification === "undefined" || !window.isSecureContext ? undefined : Notification.permission;
}

// How long a burst of changes — a window switched away and straight back — settles before it is reported, once.
const SettleMilliseconds = 200;

/** What the page is now. */
export function readClientState(source: ClientStateSource = BrowserSource): ClientState {
    return {
        visible: isOnScreen(source.visibilityState()),
        notificationPermission: source.notificationPermission() ?? "unsupported"
    };
}

export type ClientStateReporterOptions = {
    /** Sends a changed state to the runtime. */
    readonly report: (state: ClientState) => Promise<void>;
    readonly source?: ClientStateSource;
    readonly settleMilliseconds?: number;
};

/**
 * Sends the page's state as it changes, once a burst of changes settles and only where it differs from what the server holds: what
 * the last attach carried, or the last report. Before the first attach nothing is sent — the attach carries it.
 */
export class ClientStateReporter {
    private readonly report: (state: ClientState) => Promise<void>;
    private readonly source: ClientStateSource;
    private readonly settleMilliseconds: number;
    private held: ClientState | null = null;
    private timer: ReturnType<typeof setTimeout> | undefined;
    private readonly onChanged = (): void => this.changed();
    private permissionStatus: { removeEventListener(type: string, listener: () => void): void } | null = null;
    private started = false;
    private disposed = false;

    public constructor(options: ClientStateReporterOptions) {
        this.report = options.report;
        this.source = options.source ?? BrowserSource;
        this.settleMilliseconds = options.settleMilliseconds ?? SettleMilliseconds;
    }

    /** The state an attach carries, read now: what the server holds once it is answered. */
    public forAttach(): ClientState {
        clearTimeout(this.timer);
        this.held = readClientState(this.source);

        return this.held;
    }

    /** Something may have changed: reported once it settles. */
    public changed(): void {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => this.send(), this.settleMilliseconds);
    }

    /** Listens for the page going on or off screen and for the permission changing in the browser's settings. */
    public start(): void {
        if (this.started || this.disposed)
            return;

        this.started = true;
        document.addEventListener("visibilitychange", this.onChanged);

        // Not every browser tells a page its permission changed; those that do not are read again at the next attach or prompt.
        navigator.permissions?.query({ name: "notifications" })
            .then(status => {
                if (this.disposed)
                    return;

                this.permissionStatus = status;
                status.addEventListener("change", this.onChanged);
            })
            .catch(() => undefined);
    }

    public dispose(): void {
        if (this.disposed)
            return;

        this.disposed = true;
        clearTimeout(this.timer);

        if (this.started)
            document.removeEventListener("visibilitychange", this.onChanged);

        this.permissionStatus?.removeEventListener("change", this.onChanged);
        this.permissionStatus = null;
    }

    private send(): void {
        const held = this.held;

        if (held === null)
            return;

        const state = readClientState(this.source);

        if (state.visible === held.visible && state.notificationPermission === held.notificationPermission)
            return;

        this.held = state;

        // A report lost with its connection is carried by the attach that follows.
        this.report(state).catch(() => undefined);
    }
}
