// `.ts` on the value imports: `node --test` loads this module as it is.
import { motion, prefersReducedMotion } from "../rendering/motion.ts";
import { toColorToken } from "../rendering/web-dom-converters.ts";
import type { NotificationActionModel } from "../metadata/metadata-index.ts";
import { clientStrings } from "../runtime/client-strings.ts";
import { logWarn } from "../runtime/logger.ts";
import { isAuthorText, isPhrase } from "../runtime/words.ts";
import type { AuthorText, Phrase } from "../runtime/words.ts";
import { LiveAnnouncer } from "./live-announcer.ts";
import type { Politeness } from "./live-announcer.ts";
import { bottomBarTop } from "./anchored-popup.ts";
import { liveFocusReturn, restoreFocusTo } from "./popup-focus.ts";

const HostClass = "ui-notification-host";
const NotificationClass = "ui-notification";
const LeavingClass = "ui-notification--leaving";
const MessageClass = "ui-notification__message";
const TitleClass = "ui-notification__title";
const ActionClass = "ui-notification__action";
const CloseClass = "ui-notification__close";

const DefaultDurationMs = 5000;

// A toast carrying an action stands longer by default: the reader reads the message before they reach its button (an Undo).
const DefaultActionDurationMs = 8000;

const ConnectionClass = "ui-notification--connection";

// How far the host stands off the window's bottom: a phone's bottom bar's height, read by `liftAboveBottomBar`.
const LiftProperty = "--ui-notification-lift";

// The severities that carry an accent bar; anything else takes the default border colour.
const AccentedSeverities = new Set(["info", "success", "warning", "danger", "primary", "accent"]);

export type NotificationEngineOptions = {
    readonly root?: ParentNode;
    readonly durationMs?: number;
};

export type NotificationRequest = {
    // A phrase or an author's text is written through the words, marked, so a language switch rewrites an open toast; a plain
    // string is the page's own words already and is shown as written.
    readonly message: string | Phrase | AuthorText;
    // A line over the message, written as it is: a system notification's title, shown here as its fallback.
    readonly title?: Phrase | AuthorText;
    readonly severity?: unknown;
    // Stays until the reader closes it: for a state that is still true after a moment, not an event that happened.
    readonly sticky?: boolean;
    // How long a toast that is not sticky stands, which is its action's window; absent is the engine's default, longer with an action.
    readonly durationMs?: number;
    readonly action?: NotificationAction;
    // The page's own connection notice: on a phone it stands at the bottom, where the thumb is, whatever corner the view asked for.
    readonly connection?: boolean;
};

/**
 * A button under the message that does the one thing the notice asks for, its words written as the message's are; `run` may answer
 * whether the server took it, and one answered false (refused, a busy command among them) is left to press again.
 */
type NotificationAction = {
    readonly label: string | Phrase | AuthorText;
    readonly run: () => void | Promise<boolean>;
};

export class NotificationEngine {
    private readonly root: ParentNode;
    private readonly durationMs: number;
    private host: HTMLElement | null = null;
    private readonly announcer: LiveAnnouncer;

    // Where the keyboard stood before it came into each toast: a toast closed with the focus in it gives it back there.
    private readonly focusOrigins = new WeakMap<HTMLElement, HTMLElement>();

    public constructor(options: NotificationEngineOptions = {}) {
        this.root = options.root ?? document;
        this.durationMs = options.durationMs ?? DefaultDurationMs;

        // Up before the first toast: the host is the live region, and one inserted along with its words is not reliably read.
        this.ensureHost();
        this.announcer = new LiveAnnouncer(this.root instanceof Document ? this.root.body : this.root);
    }

    /** Speaks words to a screen reader and shows nothing (AnnounceEffect), through the hidden live regions beside the host. */
    public announce(message: NotificationRequest["message"], politeness?: Politeness): HTMLElement {
        return this.announcer.announce(message, politeness);
    }

    public show(request: NotificationRequest): HTMLElement {
        const severity = toColorToken(request.severity);
        const element = document.createElement("div");

        element.className = AccentedSeverities.has(severity)
            ? `${NotificationClass} ${NotificationClass}--${severity}`
            : NotificationClass;
        element.classList.toggle(ConnectionClass, request.connection === true);

        // Only Danger interrupts a screen reader, as an alert; the rest is spoken politely by the host's live region.
        if (severity === "danger")
            element.setAttribute("role", "alert");

        const message = document.createElement("span");

        message.className = MessageClass;

        if (request.title !== undefined) {
            const title = document.createElement("span");

            title.className = TitleClass;
            clientStrings.writeValue(title, null, request.title);
            element.append(title);
        }

        if (typeof request.message === "string")
            message.textContent = request.message;
        else
            clientStrings.writeValue(message, null, request.message);

        element.append(message);

        const close = document.createElement("button");

        close.type = "button";
        close.className = CloseClass;
        // Marked, so a language switched while the toast stays says the close in the new one.
        clientStrings.write(close, "aria-label", "ui.notification.close");
        close.addEventListener("click", () => this.dismiss(element));

        element.append(close);

        // After the cross: the action is drawn on a line of its own under the message, and Tab reads the toast as it is drawn.
        // A passing toast is done once its action went through; a sticky one is a state still true, and stays.
        if (request.action !== undefined)
            element.append(createAction(request.action, request.sticky === true ? null : () => this.dismiss(element)));

        const host = this.ensureHost();

        liftAboveBottomBar(host);
        host.append(element);

        element.addEventListener("focusin", domEvent => {
            const from = domEvent.relatedTarget;

            if (from instanceof HTMLElement && !element.contains(from))
                this.focusOrigins.set(element, from);
        });

        if (request.sticky === true)
            return element;

        // Paused while hovered or holding the keyboard, so a toast neither vanishes under a reader nor takes the focus down with it.
        const duration = request.durationMs !== undefined && request.durationMs > 0
            ? request.durationMs
            : request.action !== undefined ? DefaultActionDurationMs : this.durationMs;
        let hovered = false;
        let focused = false;
        let timer = window.setTimeout(() => this.dismiss(element), duration);

        const pause = (): void => window.clearTimeout(timer);
        const resume = (): void => {
            if (hovered || focused)
                return;

            window.clearTimeout(timer);
            timer = window.setTimeout(() => this.dismiss(element), duration);
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

    /** Fades the toast (the stylesheet's leaving animation), then closes the gap it leaves, so the stack slides rather than jumps. */
    public dismiss(element: HTMLElement): void {
        if (!element.isConnected || element.classList.contains(LeavingClass))
            return;

        element.classList.add(LeavingClass);
        this.returnFocus(element);

        if (prefersReducedMotion() || typeof element.animate !== "function") {
            element.remove();
            return;
        }

        window.setTimeout(() => collapse(element), motion.fast);
    }

    /** Gives the keyboard back as a toast holding it goes — to where it came from, else the next toast — never to the body. */
    private returnFocus(element: HTMLElement): void {
        if (!element.contains(document.activeElement))
            return;

        const next = [...element.parentElement?.children ?? []].find(other => other !== element && !other.classList.contains(LeavingClass));
        const target = liveFocusReturn(this.focusOrigins.get(element), this.root) ?? next?.querySelector<HTMLElement>(`.${CloseClass}`) ?? null;

        restoreFocusTo(target, element);
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

/**
 * Stands the stack above a phone's bottom bar, which a toast at the page's bottom covered, its Undo over the bar's entries; read as
 * each toast comes, since the bar steps aside while the on-screen keyboard is up.
 */
function liftAboveBottomBar(host: HTMLElement): void {
    const lift = window.innerHeight - bottomBarTop(window.innerHeight);

    if (lift > 0)
        host.style.setProperty(LiftProperty, `${Math.round(lift)}px`);
    else
        host.style.removeProperty(LiftProperty);
}

/** Slides a faded toast's height, padding, edge and gap to its neighbour down to nothing, then removes it. */
function collapse(element: HTMLElement): void {
    if (!element.isConnected)
        return;

    const style = getComputedStyle(element);
    const gap = element.parentElement === null ? 0 : parseFloat(getComputedStyle(element.parentElement).rowGap) || 0;

    element.style.overflow = "hidden";

    // Measured and slid, as the collapsible's fold is: an auto height is not a length CSS can interpolate.
    const animation = element.animate([
        { height: style.height, paddingTop: style.paddingTop, paddingBottom: style.paddingBottom, borderTopWidth: style.borderTopWidth, borderBottomWidth: style.borderBottomWidth, marginTop: "0px" },
        { height: "0px", paddingTop: "0px", paddingBottom: "0px", borderTopWidth: "0px", borderBottomWidth: "0px", marginTop: `${-gap}px` }
    ], { duration: motion.fast, easing: motion.exit, fill: "forwards" });

    const remove = (): void => element.remove();

    void animation.finished.then(remove, remove);
}

/**
 * The action's button; with `done`, run once and then done — a second press while the toast fades would ask for what the first
 * already did — and without it, pressed as often as the reader likes. An action that answers is done once the server took it, run
 * or failed: refused (a busy command), it can be pressed again while the toast stands, its window the undo's.
 */
function createAction(action: NotificationAction, done: (() => void) | null): HTMLButtonElement {
    const button = document.createElement("button");
    let spent = false;

    button.type = "button";
    button.className = `${ActionClass} ui-button ui-button--primary ui-button--small`;

    if (typeof action.label === "string")
        button.textContent = action.label;
    else
        clientStrings.writeValue(button, null, action.label);

    button.addEventListener("click", () => {
        if (spent)
            return;

        const ran = action.run();

        if (done === null)
            return;

        spent = true;

        if (ran === undefined) {
            done();
            return;
        }

        void ran.then(took => {
            if (took)
                done();
            else
                spent = false;
        }, (error: unknown) => {
            spent = false;
            logWarn("a notification's action failed.", error);
        });
    });

    return button;
}

/**
 * The button a notification effect's action asks for, pressing it running what the server offered under its id; none where the
 * server offered nothing — a command it could not offer is logged there, and the message still shows, without the button.
 */
export function offeredAction(model: NotificationActionModel | null | undefined, runAction: (id: string) => Promise<boolean>): NotificationAction | undefined {
    if (model === null || model === undefined || typeof model.id !== "string" || model.id.length === 0)
        return undefined;

    if (!isPhrase(model.label) && !isAuthorText(model.label)) {
        logWarn("a notification's action carries no words.", model);
        return undefined;
    }

    const id = model.id;

    return { label: model.label, run: () => runAction(id) };
}
