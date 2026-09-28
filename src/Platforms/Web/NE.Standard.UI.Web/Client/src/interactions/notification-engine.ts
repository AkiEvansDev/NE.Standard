import { toColorToken } from "../rendering/web-dom-converters";
import { clientStrings } from "../runtime/client-strings";

const HostClass = "ui-notification-host";
const NotificationClass = "ui-notification";
const LeavingClass = "ui-notification--leaving";
const MessageClass = "ui-notification__message";
const ActionClass = "ui-notification__action";
const CloseClass = "ui-notification__close";

const DefaultDurationMs = 5000;
const LeaveDurationMs = 160;

// The severities that carry an accent bar; anything else takes the default border colour.
const AccentedSeverities = new Set(["info", "success", "warning", "danger", "primary", "accent"]);

export type NotificationEngineOptions = {
    readonly root?: ParentNode;
    readonly durationMs?: number;
};

export type NotificationRequest = {
    readonly message: string;
    readonly severity?: unknown;
    // Stays until the reader closes it: for a state that is still true after a moment, not an event that happened.
    readonly sticky?: boolean;
    readonly action?: NotificationAction;
};

/** A button beside the message that does the one thing the notice asks for. */
type NotificationAction = {
    readonly label: string;
    readonly run: () => void;
};

export class NotificationEngine {
    private readonly root: ParentNode;
    private readonly durationMs: number;
    private host: HTMLElement | null = null;

    public constructor(options: NotificationEngineOptions = {}) {
        this.root = options.root ?? document;
        this.durationMs = options.durationMs ?? DefaultDurationMs;

        // Up before the first toast: the host is the live region polite toasts are announced through, and a region inserted along
        // with its words is not reliably read.
        this.ensureHost();
    }

    public show(request: NotificationRequest): HTMLElement {
        const severity = toColorToken(request.severity);
        const element = document.createElement("div");

        element.className = AccentedSeverities.has(severity)
            ? `${NotificationClass} ${NotificationClass}--${severity}`
            : NotificationClass;

        // Only Danger interrupts a screen reader, as an alert, which is announced as it arrives; anything else is spoken politely by
        // the host's live region.
        if (severity === "danger")
            element.setAttribute("role", "alert");

        const message = document.createElement("span");

        message.className = MessageClass;
        message.textContent = request.message;
        element.append(message);

        if (request.action !== undefined)
            element.append(createAction(request.action));

        const close = document.createElement("button");

        close.type = "button";
        close.className = CloseClass;
        close.setAttribute("aria-label", clientStrings.text("ui.notification.close"));
        close.addEventListener("click", () => this.dismiss(element));

        element.append(close);
        this.ensureHost().append(element);

        if (request.sticky === true)
            return element;

        // Auto-dismiss pauses while hovered or while the keyboard is on one of its buttons, so a toast cannot vanish out from under
        // someone reading it, nor take the focus down with it.
        let hovered = false;
        let focused = false;
        let timer = window.setTimeout(() => this.dismiss(element), this.durationMs);

        const pause = (): void => window.clearTimeout(timer);
        const resume = (): void => {
            if (hovered || focused)
                return;

            window.clearTimeout(timer);
            timer = window.setTimeout(() => this.dismiss(element), this.durationMs);
        };

        element.addEventListener("mouseenter", () => {
            hovered = true;
            pause();
        });
        element.addEventListener("mouseleave", () => {
            hovered = false;
            resume();
        });
        element.addEventListener("focusin", () => {
            focused = true;
            pause();
        });
        element.addEventListener("focusout", domEvent => {
            if (domEvent.relatedTarget instanceof Node && element.contains(domEvent.relatedTarget))
                return;

            focused = false;
            resume();
        });

        return element;
    }

    public dismiss(element: HTMLElement): void {
        if (!element.isConnected || element.classList.contains(LeavingClass))
            return;

        element.classList.add(LeavingClass);

        window.setTimeout(() => element.remove(), LeaveDurationMs);
    }

    private ensureHost(): HTMLElement {
        if (this.host !== null && this.host.isConnected)
            return this.host;

        const container = this.root instanceof Document ? this.root.body : this.root;
        const existing = container.querySelector<HTMLElement>(`.${HostClass}`);

        const host = existing ?? document.createElement("div");

        host.classList.add(HostClass);
        host.setAttribute("role", "status");
        host.setAttribute("aria-live", "polite");

        // Kept after its last toast, empty and click-through, since it has to stand in the page before the next one's words arrive.
        if (existing === null)
            container.append(host);

        this.host = host;

        return host;
    }
}

function createAction(action: NotificationAction): HTMLButtonElement {
    const button = document.createElement("button");

    button.type = "button";
    button.className = `${ActionClass} ui-button ui-button--primary ui-button--small`;
    button.textContent = action.label;
    button.addEventListener("click", () => action.run());

    return button;
}
