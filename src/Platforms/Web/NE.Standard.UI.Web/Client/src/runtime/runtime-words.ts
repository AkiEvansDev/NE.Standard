import { ComponentIdAttribute, cssAttributeValue, NavigationAttribute, RegionAttribute, RootAttribute } from "../addressing/dom-attributes";
import { DomRegistry } from "../addressing/dom-registry";
import { endsWithDynamicParameters } from "../addressing/dynamic-parameters";
import { resolveHostMode } from "../addressing/items-host-mode";
import { AddressHistory, differsInIdentity, readQueryParameters } from "../effects/address-history";
import { EffectRegistry } from "../effects/effect-registry";
import { EventPipeline } from "../events/event-pipeline";
import { hasWaitingCommits } from "../interactions/debounced-commit-engine";
import { DialogEngine } from "../interactions/dialog-engine";
import { InteractionEngine } from "../interactions/interaction-engine";
import { InteractionEvaluator } from "../interactions/interaction-evaluator";
import { InteractionIndex } from "../interactions/interaction-index";
import { showLeaveDialog } from "../interactions/leave-dialog";
import { LeaveGuard, LeaveGuardOptions } from "../interactions/leave-guard";
import { NavigationProgress } from "../interactions/navigation-progress";
import { NotificationEngine } from "../interactions/notification-engine";
import { holdAtEnd, holdsOlderWindow, isEndAnchored } from "../interactions/scroll-anchor-engine";
import { browserNotifications, followClick } from "../interactions/system-notifications";
import { ValidationEngine } from "../interactions/validation-engine";
import { ItemsRuleWatcher } from "../items/items-rule-watcher";
import { ItemsTemplateRenderer } from "../items/items-template-renderer";
import { ItemsWindowEngine } from "../items/items-window-engine";
import { logDebug, logElapsed, logError, logWarn } from "../metadata/logger";
import {
    ClientEffectKinds, ConfirmLeaveClientEffect, DiscardFormClientEffect, getIdValue, MetadataIndex, ServerChangeSet,
    SetLanguageClientEffect, SetThemeColorsClientEffect, WebUIAttachRequest
} from "../metadata/metadata-index";
import { clientStrings, forEachSubtree, marksPageWritten } from "../rendering/client-strings";
import { applyPageCultures } from "../rendering/page-culture";
import { applyThemeColors } from "../rendering/theme-colors";
import { isLocalRoute } from "../rendering/url-safety";
import { holdsPageWritten } from "../rendering/words";
import { ClientStateReporter } from "../state/client-state";
import { PropertyStateStore } from "../state/property-state-store";
import { SessionKeyExchange, SessionKeyKind, startSessionKeys } from "../state/session-key";
import type { NotificationClick } from "../state/worker-messages";
import { CommandExpired, ConnectionDropped } from "../transport/attach-gate";
import { CommandDispatcher } from "../transport/command-dispatcher";
import { afterAppliedAsync } from "../transport/inbound-order";
import { readTimeZone } from "../transport/reader-time-zone";
import { SignalRTransport } from "../transport/signalr-transport";
import { ValueChangeDispatcher } from "../transport/value-change-dispatcher";
import { fetchStagedValuesAsync, hasStagedValues } from "../transport/value-staging";
import { ContentRegion } from "../updates/content-fills";
import { PropertyPatchEngine } from "../updates/property-patch-engine";
import { UpdateProcessor } from "../updates/update-processor";
import { ValueBindingEngine } from "../updates/value-binding-engine";
import { ExtensionRegistry } from "./extension-registry";
import { FailureNotice } from "./failure-notice";
import { decideReload, sessionMemory } from "./reload-guard";
import { startServiceWorker } from "./service-worker";
import { paintsPageWritten, WebHydrationPayload } from "./web-hydration";

export function registerRuntimeEffects(
    effects: EffectRegistry,
    transport: SignalRTransport,
    propertyPatchEngine: PropertyPatchEngine,
    valueBinding: ValueBindingEngine | undefined,
    validationEngine: ValidationEngine,
    sessionKey: SessionKeyExchange,
    leaveGuard: LeaveGuard,
    switchLanguage: (language: string, href: string | null) => Promise<void>
): void {
    let themeColorChanges = 0;

    effects.register(ClientEffectKinds.SetLanguage, context => {
        const effect = context.effect as SetLanguageClientEffect;
        const language = effect.language;

        if (typeof language !== "string" || language.trim().length === 0) {
            logWarn("set language effect carries no language.", context.effect);
            return;
        }

        const href = typeof effect.href === "string" && effect.href.length > 0 ? effect.href : null;

        void switchLanguage(language, href).catch(error => logWarn("switching the page's language failed.", error));
    });

    effects.register(ClientEffectKinds.SetThemeColors, context => {
        const effect = context.effect as SetThemeColorsClientEffect;
        const change = ++themeColorChanges;

        if (typeof effect.css === "string") {
            applyThemeColors(document.head, effect.css);
            return;
        }

        void transport.setThemeColorsAsync(effect.colors ?? null)
            .then(css => {
                if (change === themeColorChanges)
                    applyThemeColors(document.head, css);
            })
            .catch(error => logWarn("applying the reader's colours failed.", error));
    });

    effects.register(ClientEffectKinds.DiscardForm, context => {
        const formId = (context.effect as DiscardFormClientEffect).formId;

        if (typeof formId !== "string" || formId.length === 0)
            return;

        for (const element of valueBinding?.releaseForm(formId) ?? [])
            propertyPatchEngine.restoreBoundValue(element, context.dom.resolveNearestComponent(element, () => true)?.dynamicParameters ?? []);

        validationEngine.discardForm(formId);
    });

    effects.register(SessionKeyKind, context => sessionKey.start(context.effect["token"]));
    effects.register(ClientEffectKinds.ConfirmLeave, context => {
        const target = (context.effect as ConfirmLeaveClientEffect).target;

        if (!isLocalRoute(target)) {
            logWarn("confirm leave effect names no address of this site; nothing asked.", context.effect);
            return;
        }

        leaveGuard.confirm(target as string);
    });
}

export function showConnectionLostNotification(notifications: NotificationEngine, onReload: () => void): void {
    notifications.show({
        message: clientStrings.text("ui.connection.lost"),
        tone: "danger",
        sticky: true,
        connection: true,
        action: {
            title: clientStrings.text("ui.connection.reload"),
            run: onReload
        }
    });
}

export function buildAttachRequest(
    windowId: string,
    search: string,
    runtimeSearch: string,
    heldRuntime: string | null,
    pageId: string | null,
    renderSequence: number | null,
    hydration: WebHydrationPayload | null,
    clientState: ClientStateReporter
): WebUIAttachRequest {
    const standIn = readStandInNavigation();
    const switchRuntime = standIn === null && heldRuntime !== null && differsInIdentity(search, runtimeSearch, hydration?.identity ?? []);

    return {
        clientWindowId: windowId,
        route: standIn?.route ?? window.location.pathname,
        pageId: switchRuntime ? null : pageId,
        view: hydration?.view ?? null,
        since: renderSequence,
        runtime: heldRuntime,
        parameters: standIn !== null ? standIn.parameters : readQueryParameters(search),
        timeZone: readTimeZone(),
        clientState: clientState.forAttach(),
        switchRuntime
    };
}

/**
 * Writes the page's words again in the table's language — marks, rendered values, sent values, built rows — then the title and
 * lang; with `only`, only the words holding what it reads — a moment, or any value the page writes itself.
 */
export function rewritePageWords(
    root: ParentNode,
    dom: DomRegistry,
    metadata: MetadataIndex,
    hydration: WebHydrationPayload | null,
    culturesLanguage: string,
    propertyPatchEngine: PropertyPatchEngine,
    itemsRenderer: ItemsTemplateRenderer,
    only?: (value: unknown) => boolean
): string {
    const started = performance.now();
    let nextCulturesLanguage = culturesLanguage;

    // A package may have put parts on the page meanwhile (a grid's open detail) that the index has not seen.
    dom.invalidate();

    // First: the packs are what a number field and a package's cells draw again by, as they hear the change.
    if (clientStrings.language !== nextCulturesLanguage) {
        nextCulturesLanguage = clientStrings.language;
        forEachSubtree(root, subtree => applyPageCultures(subtree, clientStrings.number, clientStrings.temporal));
    }

    // Later over earlier: a row's own words last.
    clientStrings.rewriteMarks(root, only);
    rewriteStaticWords(root, dom, metadata, propertyPatchEngine, only);
    propertyPatchEngine.rewriteWords(only);
    itemsRenderer.rewriteRowWords(root, only);

    const title = hydration?.title ?? null;

    if (title !== null && (only === undefined || only(title))) {
        const words = String(clientStrings.resolve(title, true));

        if (document.title !== words)
            document.title = words;
    }

    if (clientStrings.language.length > 0 && document.documentElement.lang !== clientStrings.language)
        document.documentElement.lang = clientStrings.language;

    logElapsed(only === undefined ? "page's words written again" : "page's written values written again", started, { language: clientStrings.language });
    return nextCulturesLanguage;
}

/** The values the page was rendered with — only those `only` names, where given — on every instance and inside the templates rows are built from. */
function rewriteStaticWords(
    root: ParentNode,
    dom: DomRegistry,
    metadata: MetadataIndex,
    propertyPatchEngine: PropertyPatchEngine,
    only?: (value: unknown) => boolean
): void {
    const words = only === undefined ? metadata.getWords() : metadata.getWords().filter(word => only(word.key));

    if (words.length === 0)
        return;

    const templates: ParentNode[] = [];

    forEachSubtree(root, subtree => {
        if (subtree !== root)
            templates.push(subtree);
    });

    for (const word of words) {
        const componentId = getIdValue(word.componentId);
        const reference = { componentId, propertyId: word.propertyId };
        const parameters = word.dynamicParameters ?? [];

        for (const component of findWordInstances(dom, componentId, parameters))
            propertyPatchEngine.rewriteStatic(component, reference, word.key);

        for (const template of templates) {
            for (const component of template.querySelectorAll(`[${ComponentIdAttribute}="${cssAttributeValue(componentId)}"]`)) {
                if (endsWithDynamicParameters(component, parameters))
                    propertyPatchEngine.rewriteStatic(component, reference, word.key);
            }
        }
    }
}

/** The instances a recorded word belongs to: every copy for one without row keys, else those whose rows end with its keys. */
function findWordInstances(dom: DomRegistry, componentId: number, parameters: readonly unknown[]): Element[] {
    // A word with no row keys is every copy's: a package's clones of the component as well as the one the server drew.
    if (parameters.length === 0)
        return dom.findEveryComponent(componentId);

    const exact = dom.findAllComponents(componentId, parameters);

    if (exact.length > 0)
        return exact;

    // A word inside a template names only its inner rows' keys (a cell editor's option): it is that option in every row's copy.
    return dom.findAllComponents(componentId, []).filter(component => endsWithDynamicParameters(component, parameters));
}

/** Whether the render painted a value the page writes itself in words: in a mark, a rendered value, a row the server drew or the title. */
export function holdsPaintedPageWritten(root: ParentNode, hydration: WebHydrationPayload | null, metadata: MetadataIndex): boolean {
    return marksPageWritten(root)
        || paintsPageWritten(hydration)
        || metadata.getWords().some(word => holdsPageWritten(word.key))
        || holdsPageWritten(metadata.metadata.itemValues);
}

/** The page's content region, which going to another runtime of the route redraws; the sides stay the reader's. */
export function contentRegion(): HTMLElement | null {
    return document.querySelector<HTMLElement>(`[${RegionAttribute}="${ContentRegion}"]`);
}

/**
 * The document and the content as a page load shows them: every scroller in the content at its start, or at its end where it is
 * anchored there, held at it as a page's first look holds it — a windowed host whose window stops short of the source's end placed
 * after by its engine. A side keeps where its reader left it.
 */
export function showFromStart(content: HTMLElement | null): void {
    document.scrollingElement?.scrollTo({ top: 0, left: 0, behavior: "instant" });

    if (content === null)
        return;

    for (const scroller of [content, ...content.querySelectorAll<HTMLElement>("*")]) {
        // A windowed feed at the source's end is held there too: left at its top, its engine places only a window that starts past
        // the source's first row, and a padding or a row drawn after the switch would leave it wherever the race put it.
        if (isEndAnchored(scroller) && !(resolveHostMode(scroller) === "windowed" && holdsOlderWindow(scroller))) {
            holdAtEnd(scroller);
            scroller.scrollTo({ top: scroller.scrollHeight, left: 0, behavior: "instant" });
        }
        else if (scroller.scrollTop !== 0 || scroller.scrollLeft !== 0) {
            scroller.scrollTo({ top: 0, left: 0, behavior: "instant" });
        }
    }
}

/** Waits out one of `AttachRetryDelaysMilliseconds` between two retries of a failed attach. */
export function delay(milliseconds: number): Promise<void> {
    return new Promise(resolve => window.setTimeout(resolve, milliseconds));
}

/** Resolves once the document is parsed and its deferred and module scripts have run: at once if DOMContentLoaded has already fired. */
export function documentParsedAsync(): Promise<void> {
    const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;

    if (document.readyState === "complete" || (navigation !== undefined && navigation.domContentLoadedEventStart > 0))
        return Promise.resolve();

    return new Promise(resolve => document.addEventListener("DOMContentLoaded", () => resolve(), { once: true }));
}

/** The navigation a page standing in for another was rendered for, off the shell's root; null on a page that is what was asked for. */
function readStandInNavigation(): { route: string; parameters: Record<string, unknown> | null } | null {
    const text = document.querySelector(`[${RootAttribute}]`)?.getAttribute(NavigationAttribute);

    if (text === null || text === undefined)
        return null;

    try {
        const parsed = JSON.parse(text) as { route?: unknown; parameters?: unknown };

        return typeof parsed.route === "string"
            ? { route: parsed.route, parameters: typeof parsed.parameters === "object" ? parsed.parameters as Record<string, unknown> | null : null }
            : null;
    }
    catch {
        return null;
    }
}

export function createFailureNotice(
    notifications: NotificationEngine,
    isLostOrReconnecting: () => boolean
): FailureNotice {
    return new FailureNotice({
        show: () => notifications.show({ message: { key: "ui.command.failed" }, tone: "warning" }),
        saidElsewhere: error => error instanceof CommandExpired || error instanceof ConnectionDropped || isLostOrReconnecting()
    });
}

export function createRuntimeEffectRegistry(
    windowId: string,
    address: AddressHistory,
    dialogs: DialogEngine,
    notifications: NotificationEngine,
    failures: FailureNotice,
    extensions: ExtensionRegistry,
    getPipeline: () => EventPipeline,
    getTransport: () => SignalRTransport,
    getLeaveGuard: () => LeaveGuard,
    getClientState: () => ClientStateReporter
): EffectRegistry {
    const runAction = (id: string): Promise<boolean> => getPipeline().dispatchCommandAsync({ eventId: 0, action: id, dynamicParameters: [] })
        .catch((error: unknown) => {
            logWarn("running a notification's action failed.", error);
            failures.say(error);
            return false;
        });
    const followNotificationClick = (click: NotificationClick): void => followClick(click, url => getLeaveGuard().navigate(url), id => void runAction(id));
    const worker = startServiceWorker(document.documentElement, windowId, followNotificationClick);

    return new EffectRegistry({
        address,
        dialogs,
        notifications,
        runAction,
        valueReaders: extensions.valueReaders,
        reportTheme: theme => void getTransport().setThemeAsync(theme).catch(error => logWarn("reporting the theme to the session failed.", error)),
        navigate: url => getLeaveGuard().navigate(url),
        clientStateChanged: () => getClientState().changed(),
        windowId,
        followNotificationClick,
        systemNotifications: browserNotifications(worker)
    });
}

export function createValueBindingEngine(
    root: ParentNode,
    metadata: MetadataIndex,
    dom: DomRegistry,
    dispatcher: ValueChangeDispatcher,
    extensions: ExtensionRegistry,
    propertyPatchEngine: PropertyPatchEngine,
    propertyState: PropertyStateStore,
    ruleWatcher: ItemsRuleWatcher,
    failures: FailureNotice,
    getValidation: () => ValidationEngine
): ValueBindingEngine {
    const valueBinding = new ValueBindingEngine({
        root,
        metadata,
        dom,
        dispatcher,
        valueReaders: extensions.valueReaders,
        recordSent: (reference, dynamicParameters, value) => {
            const change = propertyPatchEngine.recordValue(reference, dynamicParameters, value);

            if (change !== null)
                ruleWatcher.awaitAnswer(change);
        },
        refuses: element => getValidation().refusesBounds(element),
        readRecorded: (reference, dynamicParameters) => propertyState.has(reference, dynamicParameters) ? propertyState.get(reference, dynamicParameters) : undefined,
        markConflict: (component, conflicting) => getValidation().markConflict(component, conflicting),
        failed: error => failures.say(error)
    });
    propertyPatchEngine.setHeldTargets(valueBinding);

    return valueBinding;
}

export function wireTransportCallbacks(
    transport: SignalRTransport,
    sessionKey: SessionKeyExchange,
    dispatcher: CommandDispatcher,
    effects: EffectRegistry,
    dom: DomRegistry,
    windows: ItemsWindowEngine,
    updateProcessor: UpdateProcessor,
    notifications: NotificationEngine,
    applyChanges: (changes: ServerChangeSet | undefined, before?: () => void, from?: string | null) => void | Promise<void>,
    holdsRuntime: (from: string | null | undefined) => boolean,
    attachAsync: () => Promise<void>,
    awaitSnapshot: () => void,
    loseConnection: (reason: unknown) => void
): void {
    transport.onChanges((changes, runtime) => void applyChanges(changes, undefined, runtime));
    transport.onCommandResult((result, runtime) => {
        startSessionKeys(sessionKey, result.command?.effects);
        const { changes, ...rest } = result;

        void afterAppliedAsync(() => applyChanges(changes, undefined, runtime), () => {
            if (!holdsRuntime(runtime) || dispatcher.settle(rest))
                return;

            effects.applyAll(result.command?.effects, dom);
            windows.reconsider();
        }).catch(error => logError("a pushed command result could not be applied.", error));
    });
    updateProcessor.addFullResyncHandler(() => {
        void attachAsync().catch(error => logError("re-attaching after a full resync failed.", error));
    });
    transport.onReconnecting(error => {
        logWarn("SignalR reconnecting.", error);
        awaitSnapshot();
        dispatcher.release(new Error("the connection to the server dropped before the command answered.", { cause: error }));
    });
    transport.onReconnected(async () => {
        logDebug("SignalR reconnected. Reattaching runtime.");
        await attachAsync();
    });
    transport.onClosed(error => loseConnection(error ?? new Error("the connection to the server closed.")));
    transport.onCommandExpired(() => notifications.show({ message: clientStrings.text("ui.command.expired"), tone: "warning" }));
}

export async function switchRuntimeLanguageAsync(
    transport: SignalRTransport,
    language: string,
    stored: string | null,
    nextSwitch: () => { readonly switchNumber: number; readonly isCurrent: () => boolean }
): Promise<void> {
    if (language === clientStrings.requestedLanguage)
        return;

    const { isCurrent } = nextSwitch();
    let href = stored;
    let target = language;

    clientStrings.setRequested(language);

    try {
        if (href === null) {
            try {
                const answer = await transport.setLanguageAsync(language);

                href = answer.href;
                target = answer.language;
            }
            catch (error) {
                logWarn("the session was not told the page's language.", { language, error });
            }
        }

        if (!isCurrent() || target === clientStrings.language || !await clientStrings.switchToAsync(target, href))
            return;

        clientStrings.notifyChanged();
    }
    finally {
        if (isCurrent())
            clientStrings.setRequested(null);
    }
}

export function applyStagedOrImmediateChanges(
    changes: ServerChangeSet | undefined,
    before: (() => void) | undefined,
    from: string | null | undefined,
    currentInbound: Promise<void> | null,
    setInbound: (next: Promise<void> | null, expected?: Promise<void>) => void,
    instanceId: string | null,
    holdsRuntime: (from: string | null | undefined) => boolean,
    applyAnswered: (changes: ServerChangeSet | undefined | null) => void,
    ruleWatcher: ItemsRuleWatcher,
    attachAsync: () => Promise<void>
): void | Promise<void> {
    if (currentInbound === null && !hasStagedValues(changes)) {
        before?.();
        applyAnswered(holdsRuntime(from) ? changes : null);

        return;
    }

    const applied = (currentInbound ?? Promise.resolve())
        .then(async () => {
            before?.();
            applyAnswered(holdsRuntime(from) ? await fetchStagedValuesAsync(changes, instanceId) : null);
        })
        .catch(error => {
            ruleWatcher.followAnswered(null);
            logError("a staged value could not be fetched; the page attaches again.", error);
            void attachAsync().catch(attachError => logError("re-attaching after a lost staged value failed.", attachError));
        });

    setInbound(applied);
    void applied.then(() => {
        setInbound(null, applied);
    });

    return applied;
}

export function holdInboundQueue(
    currentInbound: Promise<void> | null,
    setInbound: (next: Promise<void> | null, expected?: Promise<void>) => void
): { readonly previous: Promise<void>; readonly release: () => void } {
    const previous = currentInbound ?? Promise.resolve();
    let release: () => void = () => { };
    const held = new Promise<void>(resolve => {
        release = resolve;
    });
    const chained = previous.then(() => held);

    setInbound(chained);
    void chained.then(() => {
        setInbound(null, chained);
    });

    return { previous, release };
}

export function revisitRuntimeUrl(
    search: string,
    previous: string,
    identity: readonly string[],
    heldRuntime: string | null,
    connectionLost: boolean,
    leaveGuard: LeaveGuard,
    address: AddressHistory,
    switchRuntime: () => void
): boolean {
    if (!switchesToIdentity(window.location.pathname, search, previous, identity, heldRuntime, connectionLost))
        return false;

    if (leaveGuard.asks) {
        const target = `${window.location.pathname}${search}${window.location.hash}`;

        address.stepBack();
        leaveGuard.navigate(target);

        return true;
    }

    switchRuntime();

    return true;
}

export function followInPlaceUrl(
    url: string,
    identity: readonly string[],
    heldRuntime: string | null,
    connectionLost: boolean,
    address: AddressHistory,
    switchRuntime: () => void
): boolean {
    let target: URL;

    try {
        target = new URL(url, window.location.href);
    }
    catch {
        return false;
    }

    if (target.origin !== window.location.origin || !switchesToIdentity(target.pathname, target.search, window.location.search, identity, heldRuntime, connectionLost))
        return false;

    address.enter(`${target.pathname}${target.search}${target.hash}`);
    switchRuntime();

    return true;
}

function switchesToIdentity(
    pathname: string,
    search: string,
    from: string,
    identity: readonly string[],
    heldRuntime: string | null,
    connectionLost: boolean
): boolean {
    return identity.length > 0
        && heldRuntime !== null
        && !connectionLost
        && pathname === window.location.pathname
        && readStandInNavigation() === null
        && differsInIdentity(search, from, identity);
}

export function reloadForViewVerdict(
    view: string,
    loseConnection: (error: Error) => void,
    stashAndReload: () => void
): void {
    const verdict = decideReload(view, navigator.cookieEnabled, sessionMemory());

    if (verdict === "no-cookie") {
        loseConnection(new Error(`the server asked for a reload of view '${view}', and this browser keeps no cookie the reload could write.`));
        return;
    }

    if (verdict === "asked-again") {
        loseConnection(new Error(`the server asked for a reload of view '${view}' again after one (another compile of the view, or a session cookie the browser does not keep).`));
        return;
    }

    logWarn("the server asked for a reload (another compile of the view, or a session it no longer holds); reloading.", { view });
    stashAndReload();
}

export function reloadForFreshRuntimeVerdict(
    view: string,
    loseConnection: (error: Error) => void,
    stashAndReload: () => void
): void {
    if (decideReload(view, navigator.cookieEnabled, sessionMemory()) !== "reload") {
        loseConnection(new Error("the server holds a new runtime for this page again after a reload for one."));
        return;
    }

    logWarn("the page's runtime is gone and the server built a new one; reloading.", { view });
    stashAndReload();
}

export function createInteractionEngine(
    root: ParentNode,
    metadata: MetadataIndex,
    dom: DomRegistry,
    effects: EffectRegistry,
    extensions: ExtensionRegistry,
    propertyPatchEngine: PropertyPatchEngine,
    interactionIndex: InteractionIndex,
    failures: FailureNotice,
    getValueBinding: () => ValueBindingEngine | undefined
): InteractionEngine {
    return new InteractionEngine(interactionIndex, propertyPatchEngine, new InteractionEvaluator(), {
        root,
        effects,
        dom,
        metadata,
        valueReaders: extensions.valueReaders,
        writeBack: (target, dynamicParameters, value) => {
            void getValueBinding()?.syncPropertyAsync(getIdValue(target.componentId), target.propertyId, dynamicParameters, value)
                .catch(error => {
                    logWarn("writing an interaction's value back failed.", error);
                    failures.say(error);
                });
        }
    });
}

export function createLeaveGuardOptions(
    navigationProgress: NavigationProgress,
    sessionKey: SessionKeyExchange,
    transport: SignalRTransport,
    effects: EffectRegistry,
    dom: DomRegistry,
    dialogs: DialogEngine,
    valueChangeDispatcher: ValueChangeDispatcher,
    valueBinding: ValueBindingEngine | undefined,
    getWindows: () => ItemsWindowEngine,
    settleValues: () => Promise<void>,
    followInPlace: (url: string) => boolean
): LeaveGuardOptions {
    return {
        window: {
            location: {
                get href(): string {
                    return window.location.href;
                },
                assign: url => {
                    navigationProgress.start();
                    sessionKey.load(() => window.location.assign(url));
                }
            },
            addEventListener: (type, listener) => window.addEventListener(type, listener),
            removeEventListener: (type, listener) => window.removeEventListener(type, listener)
        },
        ask: async target => {
            await valueBinding?.whenSent();

            return (await transport.requestLeaveAsync(target)).command?.effects;
        },
        apply: answeredEffects => {
            effects.applyAll(answeredEffects, dom);
            getWindows().reconsider();
        },
        confirm: (_target, leave) => showLeaveDialog(dialogs, leave),
        pending: () => hasWaitingCommits() || valueChangeDispatcher.isBusy,
        settle: settleValues,
        follow: followInPlace
    };
}



