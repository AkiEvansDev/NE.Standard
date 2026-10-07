import { ThemeAttribute, VisibilityTierAttributes } from "../addressing/dom-attributes";
import { DomRegistry } from "../addressing/dom-registry";
import { ValueReaderRegistry, resolveValueHolder, toDomString } from "../extensions/value-readers";
import { DialogEngine } from "../interactions/dialog-engine";
import { copySelection } from "../interactions/legacy-commands";
import { firstFocusable, FocusableSelector } from "../interactions/popup-focus";
import { NotificationEngine, offeredAction } from "../interactions/notification-engine";
import { dispatchOpenPicker } from "../interactions/picker-events";
import { showSystemNotification, SystemNotificationServices, whenOnScreen } from "../interactions/system-notifications";
import { holdAtEnd, isEndAnchored, letGoOfEnd } from "../interactions/scroll-anchor-engine";
import { itemsHostOf, letGoOfRow, revealItem } from "../items/item-reveal";
import { hostOfScrollTarget, viewportOf } from "../items/items-viewport";
import {
    AddressClientEffect,
    AnnounceClientEffect,
    ClientEffect,
    ClientEffectKindValue,
    CopyToClipboardClientEffect,
    DialogClientEffect,
    DownloadFileClientEffect,
    NotificationClientEffect,
    ScrollClientEffect,
    SystemNotificationClientEffect,
    ScrollToClientEffect,
    ScrollToItemClientEffect,
    SetThemeClientEffect,
    TargetedClientEffect,
    getAnnouncePoliteness,
    getClientEffectKind,
    getIdValue,
    getScrollAxis,
    getScrollPosition,
    getScrollToBehavior,
    getScrollToBlock,
    getThemeMode
} from "../metadata/metadata-index.ts";
import { prefersReducedMotion } from "../rendering/motion";
import { isLocalRoute, isSafeLink } from "../rendering/url-safety";
import { clientStrings } from "../runtime/client-strings";
import { logError, logWarn } from "../runtime/logger";
import { isAuthorText, isPhrase } from "../runtime/words.ts";
import { applyInsertText } from "./insert-text.ts";
import { buildNavigationUrl } from "./navigation-url";
import { resolveScroller } from "./scroller.ts";

export type EffectContext = {
    readonly effect: ClientEffect;
    readonly dom: DomRegistry;
    // The row an interaction ran for, innermost key last; none for a command's effect.
    readonly row?: readonly unknown[];
};

export type EffectRegistryOptions = {
    readonly dialogs?: DialogEngine;
    readonly notifications?: NotificationEngine;
    // Runs the command the server offered a notification's action for, answering whether it ran; left out, a notification shows no action.
    readonly runAction?: (id: string) => Promise<boolean>;
    // Reads the value a copy effect names a component for; left out where nothing on the page holds one.
    readonly valueReaders?: ValueReaderRegistry;
    // How the chosen theme reaches the session; left out where there is no connection to report it on.
    readonly reportTheme?: (mode: ThemeName) => void;
    // How a local address is left for; left out, at once — the page's leave guard asks first while its work is unsaved.
    readonly navigate?: (url: string) => void;
    // Where the page's state is written into its address; left out where the page keeps no history of its own.
    readonly address?: AddressWriter;
    // Tells the runtime the page's state may have changed — a notification permission just answered; left out where none is told.
    readonly clientStateChanged?: () => void;
    // The tab's id, which a system notification's click finds its page by.
    readonly windowId?: string;
    // How the browser shows a system notification; left out, the page's own.
    readonly systemNotifications?: SystemNotificationServices;
};

/** What an address effect writes through: the route stays, the query is rewritten in place or as a new entry. */
export type AddressWriter = {
    replace(parameters: Record<string, unknown> | null): void;
    push(parameters: Record<string, unknown> | null): void;
};

/** What the document declares, which has a third value the enum does not: no preference. */
export type ThemeName = "light" | "dark" | "auto";

export type EffectHandler = (context: EffectContext) => void;

export type EffectRegistration = {
    readonly kind: ClientEffectKindValue;
    readonly handler: EffectHandler;
};

export class EffectRegistry {
    private readonly handlers = new Map<string, EffectHandler>();
    private readonly dialogs: DialogEngine | undefined;
    private readonly notifications: NotificationEngine | undefined;
    private readonly runAction: ((id: string) => Promise<boolean>) | undefined;
    private readonly valueReaders: ValueReaderRegistry | undefined;
    private readonly reportTheme: ((mode: ThemeName) => void) | undefined;
    private readonly navigate: ((url: string) => void) | undefined;
    private readonly address: AddressWriter | undefined;
    private readonly clientStateChanged: (() => void) | undefined;
    private readonly windowId: string;
    private readonly systemNotifications: SystemNotificationServices | undefined;

    public constructor(options: EffectRegistryOptions = {}) {
        this.dialogs = options.dialogs;
        this.notifications = options.notifications;
        this.runAction = options.runAction;
        this.valueReaders = options.valueReaders;
        this.reportTheme = options.reportTheme;
        this.navigate = options.navigate;
        this.address = options.address;
        this.clientStateChanged = options.clientStateChanged;
        this.windowId = options.windowId ?? "";
        this.systemNotifications = options.systemNotifications;

        this.registerDefaults();
    }

    public register(kind: ClientEffectKindValue, handler: EffectHandler): void {
        this.handlers.set(getClientEffectKind(kind), handler);
    }

    public applyAll(effects: readonly ClientEffect[] | null | undefined, dom: DomRegistry): void {
        if (effects === null || effects === undefined)
            return;

        for (const effect of effects)
            this.apply({ effect, dom });
    }

    public apply(context: EffectContext): void {
        const kind = getClientEffectKind(context.effect?.kind);
        const handler = kind.length === 0 ? undefined : this.handlers.get(kind);

        if (handler === undefined) {
            logWarn("client effect kind is not supported.", { kind: context.effect?.kind, effect: context.effect });
            return;
        }

        // One effect that throws is logged and passed over, so the effects after it in the same answer still run.
        try {
            handler(context);
        }
        catch (error) {
            logError(`the ${kind} effect failed.`, { effect: context.effect, error });
        }
    }

    private registerDefaults(): void {
        this.register("Navigate", context => {
            const url = buildNavigationUrl(context.effect);

            if (url === null) {
                logWarn("navigate effect carries no route.", context.effect);
                return;
            }

            // A route of this site, never an address elsewhere: a return address read off a query string reaches here as it is.
            if (!isLocalRoute(url)) {
                logWarn("navigate effect names no route of this site; not followed.", context.effect);
                return;
            }

            // A full page load, not a client-side route swap: the runtime store assumes one route per connection id.
            if (this.navigate !== undefined)
                this.navigate(url);
            else
                window.location.assign(url);
        });

        // No page load and no leave: the route stays, its query is the page's state (address-history.ts).
        this.register("ReplaceAddress", context => {
            this.writeAddress(context, (address, parameters) => address.replace(parameters));
        });

        this.register("PushAddress", context => {
            this.writeAddress(context, (address, parameters) => address.push(parameters));
        });

        // On the document element: the theme is the page's, not a component's.
        this.register("SetTheme", context => {
            const effect = context.effect as SetThemeClientEffect;
            const mode = getThemeMode(effect.mode);
            const theme: ThemeName = mode === "Unknown" ? "auto" : mode.toLowerCase() as ThemeName;

            if (document.documentElement.getAttribute(ThemeAttribute) !== theme)
                document.documentElement.setAttribute(ThemeAttribute, theme);

            // Reported whether or not the attribute moved: the session can still remember the other theme. Not where the server
            // pushed it for a session that holds it already: a report would write it again and reach the session's pages once more.
            if (effect.stored !== true)
                this.reportTheme?.(theme);
        });

        this.register("Focus", context => {
            const element = resolveTarget(context);

            if (element === null)
                return;

            focusElement(element);
        });

        this.register("ScrollTo", context => {
            const element = resolveTarget(context);

            if (element === null)
                return;

            const effect = context.effect as ScrollToClientEffect;
            const behavior = getScrollToBehavior(effect.behavior);
            const block = getScrollToBlock(effect.block);

            element.scrollIntoView({
                behavior: scrollBehavior(behavior),
                block: block === "Unknown" ? "nearest" : (block.toLowerCase() as ScrollLogicalPosition)
            });
        });

        // A row by its item's key in the window the command's changes left, which are on the page before any effect runs.
        this.register("ScrollToItem", context => {
            const element = resolveTarget(context);

            if (element === null)
                return;

            const effect = context.effect as ScrollToItemClientEffect;
            const host = itemsHostOf(element);

            if (host === null || typeof effect.key !== "string" || effect.key.length === 0) {
                logWarn("scroll to item effect names no items host or no key.", context.effect);
                return;
            }

            const block = getScrollToBlock(effect.block);

            // The row is where the reader is sent: a list held at its end lets go of the end.
            letGoOfEnd(viewportOf(host));

            if (!revealItem(host, effect.key, block === "Unknown" ? "Start" : block, scrollBehavior(getScrollToBehavior(effect.behavior))))
                logWarn("scroll to item effect names a row the host has not drawn.", context.effect);
        });

        // Scrolls a container, where ScrollTo brings a component into view.
        this.register("Scroll", context => {
            const element = resolveTarget(context);

            if (element === null)
                return;

            const effect = context.effect as ScrollClientEffect;
            const vertical = getScrollAxis(effect.axis) !== "Horizontal";
            const scroller = resolveScroller(element, vertical);

            // Nothing in reach could ever scroll; a box that could, but shows all it holds, takes the scroll as a no-op.
            if (scroller === null) {
                logWarn("scroll effect target has no scrollable element.", context.effect);
                return;
            }

            const page = vertical ? scroller.clientHeight : scroller.clientWidth;
            const max = (vertical ? scroller.scrollHeight : scroller.scrollWidth) - page;
            const current = vertical ? scroller.scrollTop : scroller.scrollLeft;
            const position = getScrollPosition(effect.position);

            let next: number;

            switch (position) {
                case "Start": next = 0; break;
                case "End": next = max; break;
                case "Offset": next = effect.offset ?? 0; break;
                case "PageBack": next = current - page; break;
                case "PageForward": next = current + page; break;
                default:
                    logWarn("scroll effect carries an unsupported position.", context.effect);
                    return;
            }

            next = Math.max(0, Math.min(max, next));

            const behavior = scrollBehavior(getScrollToBehavior(effect.behavior));
            const scrolledHost = hostOfScrollTarget(scroller);

            // A scroll asked for moves the list from a row a jump held in view.
            if (scrolledHost !== null)
                letGoOfRow(scrolledHost);

            // An end-anchored list asked to its end stays there while the window it reads there arrives and lays out.
            if (vertical && position === "End" && isEndAnchored(scroller))
                holdAtEnd(scroller);

            scroller.scrollTo(vertical ? { top: next, behavior } : { left: next, behavior });
        });

        // The three drive the same attributes a bound Visibility property does, every tier, so an effect and a later binding do not fight.
        this.register("Show", context => {
            applyVisibility(resolveTarget(context), null);
        });

        this.register("Hide", context => {
            applyVisibility(resolveTarget(context), "hidden");
        });

        this.register("Collapse", context => {
            applyVisibility(resolveTarget(context), "collapsed");
        });

        // Best effort: the clipboard API wants a secure context and a focused document, so a refusal falls back to the selection command.
        this.register("CopyToClipboard", context => {
            const text = resolveClipboardText(context, this.valueReaders);

            if (text === null)
                return;

            void copyText(text).catch(error => logWarn("copy to clipboard failed.", error));
        });

        this.register("InsertText", context => {
            const element = resolveTarget(context);

            if (element !== null)
                applyInsertText(context.effect, element, context.row ?? []);
        });

        // Opened in this task: a browser shows a chooser only inside the reader's own gesture, which an interaction's effect still is.
        this.register("OpenPicker", context => {
            const element = resolveTarget(context);

            if (element !== null && !dispatchOpenPicker(element))
                logWarn("open picker effect names no file or image input.", context.effect);
        });

        this.register("OpenDialog", context => {
            this.applyDialogEffect(context, "OpenDialog", (dialogs, key) => dialogs.open(key));
        });

        this.register("CloseDialog", context => {
            this.applyDialogEffect(context, "CloseDialog", (dialogs, key) => dialogs.close(key));
        });

        // An anchor with `download`, not a fetch: the browser then owns saving the file and its progress.
        this.register("DownloadFile", context => {
            const effect = context.effect as DownloadFileClientEffect;

            if (effect.requestPath === undefined || effect.requestPath.length === 0) {
                logWarn("download effect carries no path.", context.effect);
                return;
            }

            // Any address an application serves a file from, another host's included, but never a script to run.
            if (!isSafeLink(effect.requestPath)) {
                logWarn("download effect refused: the path's scheme is not one a link may carry.", context.effect);
                return;
            }

            const anchor = document.createElement("a");

            anchor.href = effect.requestPath;
            anchor.download = effect.fileName ?? "";
            anchor.style.display = "none";

            document.body.appendChild(anchor);
            anchor.click();
            anchor.remove();
        });

        this.register("ShowNotification", context => {
            const effect = context.effect as NotificationClientEffect;

            if (!isPhrase(effect.message) && !isAuthorText(effect.message)) {
                logWarn("show notification effect carries no message.", context.effect);
                return;
            }

            if (this.notifications === undefined) {
                logWarn("show notification effect arrived but no notification engine is wired up.", effect.message);
                return;
            }

            this.notifications.show({
                message: effect.message,
                severity: effect.severity,
                durationMs: typeof effect.durationMs === "number" ? effect.durationMs : undefined,
                action: this.runAction === undefined ? undefined : offeredAction(effect.action, this.runAction)
            });
        });

        this.register("RequestNotificationPermission", () => {
            // A browser without notifications has nothing to ask: the page already reports them unsupported.
            if (typeof Notification === "undefined")
                return;

            // Asked here, in the press the effect runs in: a browser shows no prompt raised outside the reader's own gesture.
            Notification.requestPermission()
                .then(() => this.clientStateChanged?.())
                .catch((error: unknown) => logWarn("asking for the notification permission failed.", error));
        });

        this.register("ShowSystemNotification", context => this.showSystemNotification(context.effect));

        this.register("Announce", context => {
            const effect = context.effect as AnnounceClientEffect;

            if (!isPhrase(effect.message) && !isAuthorText(effect.message)) {
                logWarn("announce effect carries no message.", context.effect);
                return;
            }

            if (this.notifications === undefined) {
                logWarn("announce effect arrived but no notification engine is wired up.", effect.message);
                return;
            }

            this.notifications.announce(effect.message, getAnnouncePoliteness(effect.politeness) === "Assertive" ? "assertive" : "polite");
        });
    }

    private writeAddress(context: EffectContext, write: (address: AddressWriter, parameters: Record<string, unknown> | null) => void): void {
        const parameters = (context.effect as AddressClientEffect).parameters;

        if (this.address === undefined) {
            logWarn(`${context.effect.kind} effect arrived but no address history is wired up.`, context.effect);
            return;
        }

        write(this.address, typeof parameters === "object" ? parameters : null);
    }

    private applyDialogEffect(context: EffectContext, kind: string, apply: (dialogs: DialogEngine, key: string) => boolean): void {
        const key = (context.effect as DialogClientEffect).dialogKey;

        if (key === undefined || key.length === 0) {
            logWarn(`${kind} effect carries no dialog key.`, context.effect);
            return;
        }

        if (this.dialogs === undefined) {
            logWarn(`${kind} effect arrived but no dialog engine is wired up.`, key);
            return;
        }

        apply(this.dialogs, key);
    }

    /**
     * Shows the system's notification where the page is off screen (or always, where it asks) and the browser lets it; anywhere
     * else, its fallback toast — held until the page is on screen, since one raised off screen would pass unread.
     */
    private showSystemNotification(effect: SystemNotificationClientEffect): void {
        const title = effect.title;

        if (!isPhrase(title) && !isAuthorText(title)) {
            logWarn("system notification effect carries no title.", effect);
            return;
        }

        const body = isPhrase(effect.body) || isAuthorText(effect.body) ? effect.body : undefined;
        const toast = (): void => {
            if (effect.fallback === "None" || this.notifications === undefined)
                return;

            const notifications = this.notifications;
            const action = this.runAction === undefined ? undefined : offeredAction(effect.action, this.runAction);

            whenOnScreen(() => notifications.show(body === undefined ? { message: title, action } : { title, message: body, action }));
        };

        if (effect.when !== "Always" && document.visibilityState !== "hidden") {
            toast();
            return;
        }

        const action = typeof effect.action?.id === "string" ? effect.action.id : undefined;
        const runAction = this.runAction;

        void showSystemNotification({
            title: wordsOf(title),
            body: body === undefined ? undefined : wordsOf(body),
            tag: effect.tag ?? "",
            icon: typeof effect.icon === "string" && isLocalRoute(effect.icon) ? effect.icon : applicationIcon(),
            silent: effect.silent === true,
            requireInteraction: effect.requireInteraction === true,
            // Only a path of this site: a notification is no way to open another.
            address: typeof effect.address === "string" && isLocalRoute(effect.address) ? effect.address : ownAddress(),
            windowId: this.windowId,
            action
        }, () => {
            if (action !== undefined && runAction !== undefined)
                void runAction(action);
        }, this.systemNotifications).then(shown => {
            if (!shown)
                toast();
        });
    }
}

/** A phrase or the author's text as the page shows it now, for a place no language switch rewrites. */
function wordsOf(value: unknown): string {
    if (isPhrase(value))
        return clientStrings.translate(value.key, value.args);

    return isAuthorText(value) ? clientStrings.resolveText(value.text) : "";
}

/** The page's own icon, which a system notification shows where it names none; none for the shell's empty one, a `data:` stand-in. */
function applicationIcon(): string | undefined {
    const icon = document.querySelector<HTMLLinkElement>("link[rel~='icon']")?.href;

    return icon === undefined || icon.startsWith("data:") ? undefined : icon;
}

/** Where the page stands: what a system notification's click brings back where the page is gone. */
function ownAddress(): string {
    return window.location.pathname + window.location.search + window.location.hash;
}

function applyVisibility(target: Element | null, value: string | null): void {
    if (target === null)
        return;

    for (const attribute of VisibilityTierAttributes) {
        if (value === null)
            target.removeAttribute(attribute);
        else
            target.setAttribute(attribute, value);
    }
}

function resolveTarget(context: EffectContext): Element | null {
    const target = (context.effect as TargetedClientEffect).target;

    if (target === undefined || target.id === undefined) {
        // An empty target is a serialization failure, not a missing element.
        logWarn("targeted client effect carries no resolved component address.", context.effect);
        return null;
    }

    const element = context.dom.findComponent(getIdValue(target.id), target.dynamicParameters ?? []);

    if (element === null)
        logWarn("client effect target was not found in the DOM.", context.effect);

    return element;
}

/** Smooth only where the reader has not asked for less motion: a scroll a script asks for is smooth whatever the setting says. */
function scrollBehavior(behavior: string): ScrollBehavior {
    return behavior === "Smooth" && !prefersReducedMotion() ? "smooth" : "auto";
}

function focusElement(element: Element): void {
    if (element instanceof HTMLElement && (element.tabIndex >= 0 || element.matches(FocusableSelector))) {
        element.focus();
        return;
    }

    // A component root is usually a plain div; focus the first thing inside it the keyboard can stand on.
    const focusable = firstFocusable(element);

    if (focusable !== null) {
        focusable.focus();
        return;
    }

    logWarn("focus effect target has nothing focusable.", element);
}

function resolveClipboardText(context: EffectContext, valueReaders: ValueReaderRegistry | undefined): string | null {
    const effect = context.effect as CopyToClipboardClientEffect;

    if (typeof effect.text === "string")
        return effect.text;

    const element = resolveTarget(context);

    if (element === null)
        return null;

    if (valueReaders === undefined) {
        logWarn("copy to clipboard effect names a component but no value reader is wired up.", context.effect);
        return null;
    }

    if (resolveValueHolder(element) === null) {
        logWarn("copy to clipboard effect target holds no value.", context.effect);
        return null;
    }

    return toDomString(valueReaders.readHeld(element));
}

async function copyText(text: string): Promise<void> {
    if (navigator.clipboard !== undefined) {
        try {
            await navigator.clipboard.writeText(text);
            return;
        }
        catch {
            // Refused: the selection command below still works while the gesture that raised the effect is recent.
        }
    }

    if (!copyBySelection(text))
        throw new Error("neither the clipboard API nor the selection command took the text.");
}

function copyBySelection(text: string): boolean {
    const holder = document.createElement("textarea");

    holder.value = text;
    holder.setAttribute("readonly", "");
    holder.style.position = "fixed";
    holder.style.opacity = "0";

    document.body.appendChild(holder);
    holder.select();

    try {
        return copySelection();
    }
    finally {
        holder.remove();
    }
}
