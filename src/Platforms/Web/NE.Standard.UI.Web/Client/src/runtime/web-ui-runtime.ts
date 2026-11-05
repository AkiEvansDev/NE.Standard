import { AddressResolver } from "../addressing/address-resolver";
import { DomRegistry } from "../addressing/dom-registry";
import { AddressHistory } from "../effects/address-history";
import { EffectRegistration, EffectRegistry } from "../effects/effect-registry";
import { EventRegistration } from "../events/event-descriptor";
import { EventPipeline } from "../events/event-pipeline";
import { ValueConverterRegistration } from "../extensions/converters";
import { resolveValueHolder, ValueReaderRegistration } from "../extensions/value-readers";
import { commitWaiting } from "../interactions/debounced-commit-engine";
import { DialogEngine } from "../interactions/dialog-engine";
import { stopObservedSizes } from "../interactions/element-size";
import { InteractionIndex } from "../interactions/interaction-index";
import { LeaveGuard } from "../interactions/leave-guard";
import { NavigationProgress } from "../interactions/navigation-progress";
import { NotificationEngine } from "../interactions/notification-engine";
import { NumberInputEngine } from "../interactions/number-input-engine";
import { clearPopupComponents, setPopupComponents } from "../interactions/owned-popup";
import { registerChoosableKeysReader } from "../interactions/row-selection";
import { TableColumnsEngine } from "../interactions/table-columns-engine";
import { ValidationEngine } from "../interactions/validation-engine";
import { CheckboxRowDecorator } from "../items/checkbox-row-decorator";
import { ItemsRuleWatcher } from "../items/items-rule-watcher";
import { ItemsVirtualizationEngine } from "../items/items-virtualization-engine";
import { ItemsWindowEngine } from "../items/items-window-engine";
import { MenuRowDecorator } from "../items/menu-row-decorator";
import { RadioRowDecorator } from "../items/radio-row-decorator";
import { RowGripDecorator } from "../items/row-grip";
import { RowMenus } from "../items/row-menus";
import { formatMilliseconds, logDebug, logElapsed, logError, logWarn } from "../metadata/logger";
import { ClientEffectKinds, MetadataIndex, ServerChangeSet, WebUIAttachRequest } from "../metadata/metadata-index";
import { clientStrings, WordsAsker } from "../rendering/client-strings";
import { releaseRegions } from "../rendering/region-hold";
import { holdsMoment, holdsPageWritten } from "../rendering/words";
import { ClientStateReporter } from "../state/client-state";
import { PropertyStateStore } from "../state/property-state-store";
import { pageSessionKey } from "../state/session-key";
import { attachWithRetryAsync, LeftToReconnect } from "../transport/attach-retry";
import { CommandDispatcher } from "../transport/command-dispatcher";
import { SignalRTransport } from "../transport/signalr-transport";
import { ValueChangeDispatcher } from "../transport/value-change-dispatcher";
import { fetchStagedValuesAsync, hasStagedValues } from "../transport/value-staging";
import { CollectionSinkRegistration } from "../updates/collection-sinks";
import { DomOperationRegistration } from "../updates/dom-operation-registry";
import { ensureFormOwners } from "../updates/form-owner";
import { PropertyPatchEngine } from "../updates/property-patch-engine";
import { ReactiveSourceRegistry } from "../updates/reactive-source-registry";
import { UpdateProcessor } from "../updates/update-processor";
import { ValueBindingEngine } from "../updates/value-binding-engine";
import type { UnsavedValue } from "../updates/value-binding-engine";
import { CleanupScope } from "./cleanup-scope";
import {
    createEventPipelineAndWindows, createItemsSubsystems, createPluginEngineContext, EngineContext, PluginEngine,
    PluginEngineContext, startCoreComponentEngines
} from "./component-engines";
import { ConnectionWatch } from "./connection-watch";
import { nameOfPackageEngine, startEngine } from "./engine-start";
import { ExtensionRegistry } from "./extension-registry";
import { FailureNotice } from "./failure-notice";
import { exposeGlobalApi, unexposeGlobalApi } from "./global-api";
import { readWebUIMetadata } from "./metadata-reader";
import { forgetReload, sessionMemory } from "./reload-guard";
import { WebUIRuntimeOptions } from "./runtime-options";
import {
    applyStagedOrImmediateChanges, buildAttachRequest, contentRegion, createFailureNotice, createInteractionEngine,
    createLeaveGuardOptions, createRuntimeEffectRegistry, createValueBindingEngine, delay, documentParsedAsync,
    followInPlaceUrl, holdInboundQueue, holdsPaintedPageWritten, registerRuntimeEffects, reloadForFreshRuntimeVerdict,
    reloadForViewVerdict, revisitRuntimeUrl, rewritePageWords, showConnectionLostNotification, showFromStart,
    switchRuntimeLanguageAsync, wireTransportCallbacks
} from "./runtime-words";
import { StashedPage, UnsavedStash } from "./unsaved-stash";
import { readHydration } from "./web-hydration";
import { getOrCreateWindowId } from "./window-id";

export type { Badges, Icons, PluginEngine, PluginEngineContext, PropertyWriting, Urls } from "./component-engines";

const DefaultWindowIdStorageKey = "ne.standard.ui.windowId";
const AttachRetryDelaysMilliseconds = [500, 1000, 2000];
const AttachRunsInARow = 3;

export class WebUIRuntime {
    public readonly windowId: string;

    private readonly options: WebUIRuntimeOptions;
    private readonly root: ParentNode;
    private culturesLanguage = document.documentElement.lang;
    private readonly metadata = new MetadataIndex(readWebUIMetadata());
    private readonly hydration = readHydration();
    private renderSequence = this.hydration?.sequence ?? null;
    private readonly rewriteMoments: () => void;
    private readonly rewritePageWritten: () => void;
    private readonly dom: DomRegistry;
    private readonly transport: SignalRTransport;
    private readonly dispatcher: CommandDispatcher;
    private readonly updateProcessor: UpdateProcessor;
    private readonly ruleWatcher: ItemsRuleWatcher;
    private readonly rowMenus: RowMenus;
    private readonly eventPipeline: EventPipeline;
    private readonly extensions: ExtensionRegistry;
    private readonly engineContext: EngineContext;
    private readonly pluginContext: PluginEngineContext;
    private readonly dialogs: DialogEngine;
    private readonly windows: ItemsWindowEngine;
    private readonly tables: TableColumnsEngine;
    private readonly virtualization: ItemsVirtualizationEngine;
    private readonly notifications: NotificationEngine;
    private readonly failures: FailureNotice;
    private readonly effects: EffectRegistry;
    private readonly leaveGuard: LeaveGuard;
    private readonly navigationProgress: NavigationProgress;
    private readonly sessionKey = pageSessionKey;
    private readonly address: AddressHistory;
    private readonly clientState: ClientStateReporter;
    private readonly cleanupScope = new CleanupScope();
    private readonly unsubscribeWordsChange: () => void;
    private readonly unsubscribeMomentTick: () => void;
    private readonly wordsAsker: WordsAsker;
    private disposed = false;

    /** Public so a plugin's own Source-driven config can reuse this dispatch. */
    public readonly reactiveSources: ReactiveSourceRegistry;

    private attachTask: Promise<void> | null = null;
    private reattachRequested = false;
    private connectionLost = false;
    private reloading = false;
    private readonly connection: ConnectionWatch;
    private heldRuntime: string | null = null;
    private pageId = this.hydration?.pageId ?? null;
    private runtimeSearch = window.location.search;
    private inertContent: Element | null = null;
    private endSwitchProgress: (() => void) | null = null;
    private readonly settleValues: () => Promise<void>;
    private readonly unsaved = new UnsavedStash();
    private readonly readUnsaved: () => UnsavedValue[];
    private readonly restoreUnsaved: (values: readonly UnsavedValue[]) => number;
    private readonly holdTypedDuring: (apply: () => void) => void;
    private readonly discardDrafts: () => void;
    private current: Promise<void> = Promise.resolve();
    private currentPending = false;
    private markCurrent: () => void = () => { };
    private inbound: Promise<void> | null = null;
    private enginesAwaitingHydration: PluginEngine[] | null = [];
    private readonly engineDisposers: (() => void)[] = [];
    private languageSwitches = 0;
    private readonly numberInputs: NumberInputEngine | null = null;

    public constructor(options: WebUIRuntimeOptions = {}) {
        this.options = options;
        this.root = options.root ?? document;

        const leaveCleanupScope = this.cleanupScope.enter([this.root, window, document, document.documentElement, (window as { navigation?: unknown }).navigation]);

        try {
            this.navigationProgress = new NavigationProgress({ window });
            this.windowId = getOrCreateWindowId(options.windowIdStorageKey ?? DefaultWindowIdStorageKey, id => this.reloadAsOwnTab(id));
            this.dom = new DomRegistry(this.root);

            clientStrings.load(this.root);
            clientStrings.setLanguage(document.documentElement.lang);

            if (options.strings !== undefined)
                clientStrings.register(options.strings);

            this.gateInbound(this.hydration?.words === null || this.hydration?.words === undefined ? null : clientStrings.loadTableAsync(this.hydration.words.href));

            this.extensions = new ExtensionRegistry(options.converters, options.eventDefinitions, options.domOperations, options.valueReaders);
            this.extensions.registerRowDecorator(MenuRowDecorator);
            this.extensions.registerRowDecorator(RowGripDecorator);
            this.extensions.registerRowDecorator(RadioRowDecorator);
            this.extensions.registerRowDecorator(CheckboxRowDecorator);
            const addressResolver = new AddressResolver(this.dom, this.metadata);
            const operations = this.extensions.operations;
            const propertyState = new PropertyStateStore();
            const propertyPatchEngine = new PropertyPatchEngine(addressResolver, operations, this.extensions, propertyState);
            this.reactiveSources = new ReactiveSourceRegistry(propertyPatchEngine, { root: this.root, valueReaders: this.extensions.valueReaders, metadata: this.metadata });
            this.dialogs = new DialogEngine({
                root: this.root,
                dom: this.dom,
                discardForm: formId => this.effects.apply({ effect: { kind: ClientEffectKinds.DiscardForm, formId }, dom: this.dom })
            });
            setPopupComponents(this.dom);
            this.notifications = new NotificationEngine({ root: this.root, dom: this.dom });
            this.failures = createFailureNotice(this.notifications, () => this.connectionLost || this.transport.isReconnecting || this.transport.isReattaching);
            this.address = new AddressHistory({
                window,
                revisit: parameters => void this.navigateInPlaceAsync(parameters),
                switchRuntime: (search, previous) => this.revisitRuntime(search, previous),
                load: () => this.reload()
            });
            this.effects = createRuntimeEffectRegistry(this.windowId, this.address, this.dialogs, this.notifications, this.failures, this.extensions, () => this.eventPipeline, () => this.transport, () => this.leaveGuard, () => this.clientState);

            const interactionIndex = new InteractionIndex(this.metadata);
            let valueBinding: ValueBindingEngine | undefined;

            const interactionEngine = createInteractionEngine(this.root, this.metadata, this.dom, this.effects, this.extensions, propertyPatchEngine, interactionIndex, this.failures, () => valueBinding);
            const { itemsTemplates, itemsRenderer, rowMenus, virtualization, updateProcessor, ruleWatcher } = createItemsSubsystems(this.root, this.dom, this.metadata, this.extensions, operations, propertyState, propertyPatchEngine, this.reactiveSources);
            this.rowMenus = rowMenus;
            this.virtualization = virtualization;
            this.updateProcessor = updateProcessor;
            this.ruleWatcher = ruleWatcher;

            this.unsubscribeWordsChange = clientStrings.onChange(() => {
                this.culturesLanguage = rewritePageWords(this.root, this.dom, this.metadata, this.hydration, this.culturesLanguage, propertyPatchEngine, itemsRenderer);
            });
            this.rewriteMoments = () => {
                this.culturesLanguage = rewritePageWords(this.root, this.dom, this.metadata, this.hydration, this.culturesLanguage, propertyPatchEngine, itemsRenderer, holdsMoment);
            };
            this.unsubscribeMomentTick = clientStrings.onMomentTick(this.rewriteMoments);
            this.rewritePageWritten = () => {
                this.culturesLanguage = rewritePageWords(this.root, this.dom, this.metadata, this.hydration, this.culturesLanguage, propertyPatchEngine, itemsRenderer, holdsPageWritten);
            };

            this.transport = new SignalRTransport(this.windowId, (changes, before) => this.applyChanges(changes, before, this.heldRuntime), options.signalR);
            this.clientState = new ClientStateReporter({ report: state => this.transport.reportClientStateAsync(state) });
            this.dispatcher = new CommandDispatcher(this.transport);

            this.wordsAsker = (language, keys) => this.transport.translateAsync(language, keys);
            clientStrings.setAsker(this.wordsAsker);

            const valueChangeDispatcher = new ValueChangeDispatcher(this.transport, { whenCurrent: () => this.current });
            valueBinding = createValueBindingEngine(this.root, this.metadata, this.dom, valueChangeDispatcher, this.extensions, propertyPatchEngine, propertyState, this.ruleWatcher, this.failures, () => validationEngine);
            this.settleValues = async () => {
                commitWaiting();
                await valueChangeDispatcher.whenAnsweredAsync();
            };
            this.readUnsaved = () => valueBinding?.unsavedValues() ?? [];
            this.holdTypedDuring = apply => valueBinding === undefined ? apply() : valueBinding.holdTypedDuring(apply);
            this.restoreUnsaved = unsaved => valueBinding?.restoreUnsaved(unsaved, (element, bindingId, value) => propertyPatchEngine.writeBoundValue(element, value, bindingId)) ?? 0;

            this.leaveGuard = new LeaveGuard(createLeaveGuardOptions(this.navigationProgress, this.sessionKey, this.transport, this.effects, this.dom, this.dialogs, valueChangeDispatcher, valueBinding, () => this.windows, () => this.settleValues(), target => this.followInPlace(target)));
            this.updateProcessor.addPageHandler(update => this.leaveGuard.set(update.holdsUnsavedWork === true));

            const validationEngine = new ValidationEngine({
                root: this.root,
                metadata: this.metadata,
                dom: this.dom,
                propertyPatchEngine,
                updateProcessor: this.updateProcessor,
                valueReaders: this.extensions.valueReaders,
                readValue: element => this.readPluginValue(element)
            });
            this.discardDrafts = () => {
                for (const element of valueBinding?.releaseAll() ?? [])
                    propertyPatchEngine.restoreBoundValue(element, this.dom.resolveNearestComponent(element, () => true)?.dynamicParameters ?? []);

                validationEngine.discardAll();
            };

            registerRuntimeEffects(this.effects, this.transport, propertyPatchEngine, valueBinding, validationEngine, this.sessionKey, this.leaveGuard, (language, href) => this.switchLanguageAsync(language, href));

            this.engineContext = { root: this.root, dom: this.dom, propertyPatchEngine, effects: this.effects, validation: validationEngine, dialogs: this.dialogs, heldRows: this.virtualization };
            this.numberInputs = startCoreComponentEngines(this.engineContext, this.metadata, propertyState, itemsRenderer, this.virtualization, interactionEngine, this.engineDisposers);

            const { eventPipeline, tables, windows } = createEventPipelineAndWindows(this.root, this.metadata, this.dom, this.dispatcher, interactionEngine, interactionIndex, this.extensions, this.effects, options.events, validationEngine, valueBinding, this.transport, this.failures, this.updateProcessor, this.engineContext, this.rowMenus, this.virtualization, this.engineDisposers);
            this.eventPipeline = eventPipeline;
            this.tables = tables;
            this.windows = windows;

            this.pluginContext = createPluginEngineContext(this.engineContext, this.metadata, propertyPatchEngine, valueBinding, validationEngine, itemsTemplates, itemsRenderer, this.virtualization, this.windows, this.tables, element => this.readPluginValue(element));

            wireTransportCallbacks(this.transport, this.sessionKey, this.dispatcher, this.effects, this.dom, this.windows, this.updateProcessor, this.notifications, (changes, before, runtime) => this.applyChanges(changes, before, runtime), runtime => this.holdsRuntime(runtime), () => this.attachAsync(), () => this.awaitSnapshot(), reason => this.loseConnection(reason));
            this.connection = new ConnectionWatch({ root: document.documentElement, connection: { onReconnecting: handler => this.transport.onReconnecting(handler) }, notifications: this.notifications });
        }
        finally {
            leaveCleanupScope();
        }
    }

    private awaitSnapshot(): void {
        if (this.currentPending)
            return;

        this.currentPending = true;
        this.current = new Promise<void>(resolve => {
            this.markCurrent = () => {
                this.currentPending = false;
                resolve();
            };
        });
    }

    private gateInbound(ready: Promise<unknown> | null): void {
        if (ready === null)
            return;

        const gate = ready.then(() => undefined, () => undefined);

        this.inbound = gate;
        void gate.then(() => {
            if (this.inbound === gate)
                this.inbound = null;
        });
    }

    private readPluginValue(element: Element): unknown {
        const holder = resolveValueHolder(element);

        return holder === null ? null : this.numberInputs?.readValue(holder) ?? this.extensions.valueReaders.readBound(holder);
    }

    private revisitRuntime(search: string, previous: string): boolean {
        return revisitRuntimeUrl(
            search,
            previous,
            this.hydration?.identity ?? [],
            this.heldRuntime,
            this.connectionLost,
            this.leaveGuard,
            this.address,
            () => void this.switchRuntimeAsync().catch(error => this.loseConnection(error))
        );
    }

    private followInPlace(url: string): boolean {
        return followInPlaceUrl(
            url,
            this.hydration?.identity ?? [],
            this.heldRuntime,
            this.connectionLost,
            this.address,
            () => void this.switchRuntimeAsync().catch(error => this.loseConnection(error))
        );
    }

    private async switchRuntimeAsync(): Promise<void> {
        this.endSwitchProgress = this.navigationProgress.start();

        try {
            await this.settleValues();
        }
        catch (error) {
            logWarn("the values still on their way did not settle before the page went to another runtime.", error);
        }

        this.dialogs.closeAll();
        this.dispatcher.release(new Error("the page went to another runtime of its route before the command answered."));
        this.transport.holdCalls();

        const content = contentRegion();

        if (content !== null && !content.hasAttribute("inert")) {
            content.setAttribute("inert", "");
            this.inertContent = content;
        }

        await this.attachAsync();
    }

    private async navigateInPlaceAsync(parameters: Record<string, unknown> | null): Promise<void> {
        try {
            const result = await this.transport.navigateInPlaceAsync(parameters);

            this.effects.applyAll(result.command?.effects, this.dom);
            this.windows.reconsider();
        }
        catch (error) {
            logWarn("telling the page's controller about the history entry failed.", error);
        }
    }

    private async switchLanguageAsync(language: string, stored: string | null): Promise<void> {
        await switchRuntimeLanguageAsync(this.transport, language, stored, () => {
            const switchNumber = ++this.languageSwitches;

            return { switchNumber, isCurrent: () => switchNumber === this.languageSwitches };
        });
    }

    private loseConnection(reason: unknown): void {
        if (this.connectionLost)
            return;

        this.connectionLost = true;
        logError("the connection to the server is lost; the page offers a reload.", reason);
        this.connection.lost();
        this.endSwitchProgress?.();
        this.endSwitchProgress = null;

        const lost = new Error("the connection to the server is lost; reload the page.", { cause: reason });

        this.transport.close(lost);
        this.dispatcher.release(lost);
        this.stashUnsaved();
        this.markCurrent();
        showConnectionLostNotification(this.notifications, () => {
            this.stashUnsaved();
            this.leaveGuard.release();
            this.reload();
        });
    }

    private stashUnsaved(): void {
        this.unsaved.save(this.stashedPage(), this.readUnsaved());
    }

    private stashedPage(): StashedPage {
        return { windowId: this.windowId, address: `${window.location.pathname}${window.location.search}`, view: this.hydration?.view ?? null };
    }

    private reloadForView(view: string): void {
        reloadForViewVerdict(view, error => this.loseConnection(error), () => {
            this.stashUnsaved();
            this.leaveGuard.release();
            this.reload();
        });
    }

    private reloadAsOwnTab(id: string): void {
        logWarn("another live tab holds this tab's id; reloading under one of its own.", { id });
        this.leaveGuard.release();
        this.reload();
    }

    private reloadForFreshRuntime(view: string): void {
        reloadForFreshRuntimeVerdict(view, error => this.loseConnection(error), () => {
            this.stashUnsaved();
            this.leaveGuard.release();
            this.reload();
        });
    }

    private reload(): void {
        this.reloading = true;
        this.sessionKey.load(() => window.location.reload());
    }

    public get instanceId(): string | null {
        return this.transport.instanceId;
    }

    public async startAsync(): Promise<void> {
        exposeGlobalApi(this, this.options.handlerGlobalKey);

        for (const warning of this.metadata.metadata.compileWarnings ?? [])
            logWarn(`the view compiled with a warning: ${warning}`);

        ensureFormOwners(this.root);

        if (document.readyState === "loading")
            await documentParsedAsync();

        const connected = this.connectAsync();

        this.hydrate();
        this.startEnginesAwaitingHydration();
        releaseRegions(this.root);
        this.clientState.start();

        if (!await connected)
            return;

        await this.attachAsync();

        if (this.connectionLost || this.reloading)
            return;

        logDebug(`page live ${formatMilliseconds(performance.now())} after the navigation started.`);
        this.putBackUnsaved();
    }

    private putBackUnsaved(): void {
        const restored = this.restoreUnsaved(this.unsaved.take(this.stashedPage()));

        if (restored > 0)
            logDebug(`${restored} unsaved value(s) carried over the reload were put back.`);
    }

    private async connectAsync(): Promise<boolean> {
        try {
            const connecting = performance.now();

            await this.transport.startAsync();
            logElapsed("SignalR connection opened", connecting);

            return true;
        }
        catch (error) {
            this.loseConnection(error);
            return false;
        }
    }

    private hydrate(): void {
        if (this.hydration === null)
            return;

        const started = performance.now();
        const changes = this.hydration.changes;

        this.dom.rebuild();
        this.updateProcessor.registerServerRenderedItems(changes);
        void this.applyChanges(changes);
        this.updateProcessor.initializeItemsHosts();

        if (holdsPaintedPageWritten(this.root, this.hydration, this.metadata))
            this.rewritePageWritten();

        logElapsed("runtime hydrated from the page", started, { pageId: this.hydration.pageId, updates: changes?.updates?.length ?? 0 });
    }

    private startEnginesAwaitingHydration(): void {
        const engines = this.enginesAwaitingHydration ?? [];

        this.enginesAwaitingHydration = null;

        for (const start of engines)
            this.startPackageEngine(start);
    }

    public addEvent<TEvent extends Event = Event>(name: string, registration: Omit<EventRegistration<TEvent>, "name"> = {}): void {
        this.eventPipeline.addEvent(name, registration, true);
    }

    public addConverter(registration: ValueConverterRegistration): void {
        this.extensions.registerConverter(registration);
    }

    public addDomOperation(registration: DomOperationRegistration): void {
        this.extensions.registerDomOperation(registration);
    }

    public addEffect(registration: EffectRegistration): void {
        this.effects.register(registration.kind, registration.handler);
    }

    public addValueReader(registration: ValueReaderRegistration): void {
        this.extensions.registerValueReader(registration);
    }

    public addCollectionSink(registration: CollectionSinkRegistration): void {
        this.extensions.registerCollectionSink(registration);
    }

    public addStrings(words: Readonly<Record<string, string>>): void {
        clientStrings.register(words);
    }

    public addEngine(start: PluginEngine): void {
        if (this.enginesAwaitingHydration !== null) {
            this.enginesAwaitingHydration.push(start);
            return;
        }

        this.startPackageEngine(start);
    }

    public dispose(): void {
        if (this.disposed)
            return;

        this.disposed = true;
        this.enginesAwaitingHydration = [];
        unexposeGlobalApi(this, this.options.handlerGlobalKey);

        for (const dispose of this.engineDisposers.splice(0).reverse())
            dispose();

        stopObservedSizes(this.root);
        registerChoosableKeysReader(this.root, undefined);
        clearPopupComponents(this.dom);
        this.unsubscribeWordsChange();
        this.unsubscribeMomentTick();
        clientStrings.clearAsker(this.wordsAsker);
        this.windows.dispose();
        this.dialogs.closeAll();
        this.leaveGuard.release();
        this.navigationProgress.stop();
        this.releaseInertContent();
        this.connection.dispose();
        this.clientState.dispose();
        this.dispatcher.release(new Error("the runtime was disposed."));
        this.transport.dispose();
        this.markCurrent();
        this.cleanupScope.dispose();
    }

    private startPackageEngine(start: PluginEngine): void {
        const dispose = startEngine(nameOfPackageEngine(start), start, this.pluginContext);

        if (dispose !== null)
            this.engineDisposers.push(dispose);
    }

    private applyChanges(changes: ServerChangeSet | undefined, before?: () => void, from?: string | null): void | Promise<void> {
        return applyStagedOrImmediateChanges(
            changes,
            before,
            from,
            this.inbound,
            (next, expected) => this.setInbound(next, expected),
            this.transport.instanceId,
            runtime => this.holdsRuntime(runtime),
            answered => this.applyAnswered(answered),
            this.ruleWatcher,
            () => this.attachAsync()
        );
    }

    private setInbound(next: Promise<void> | null, expected?: Promise<void>): void {
        if (expected === undefined || this.inbound === expected)
            this.inbound = next;
    }

    private applyAnswered(changes: ServerChangeSet | undefined | null): void {
        let applied: ServerChangeSet | undefined | null = null;

        try {
            if (changes !== null) {
                this.applyNow(changes);
                applied = changes;
            }
        }
        finally {
            this.ruleWatcher.followAnswered(applied);
        }
    }

    private holdsRuntime(from: string | null | undefined): boolean {
        return from === undefined || from === null || this.heldRuntime === null || from === this.heldRuntime;
    }

    private applyNow(changes: ServerChangeSet | undefined): void {
        this.windows.noteShownRows();
        this.windows.sync(this.updateProcessor.applyChangeSet(changes));
    }

    private async attachAsync(): Promise<void> {
        if (this.attachTask !== null) {
            this.reattachRequested = true;
            return this.attachTask;
        }

        this.attachTask = this.attachRepeatedlyAsync();

        try {
            await this.attachTask;
        }
        finally {
            this.attachTask = null;
        }
    }

    private async attachRepeatedlyAsync(): Promise<void> {
        for (let run = 1; ; run++) {
            this.reattachRequested = false;

            if (!await this.attachCoreAsync() || !this.reattachRequested)
                return;

            if (run >= AttachRunsInARow) {
                this.loseConnection(new Error("the page fell behind the server on every attach."));
                return;
            }
        }
    }

    private async attachCoreAsync(): Promise<boolean> {
        if (this.connectionLost)
            return false;

        const search = window.location.search;
        const request = this.createAttachRequest(search);
        const hold = this.holdInbound();
        const started = performance.now();

        try {
            const result = await attachWithRetryAsync(() => this.transport.attachAsync(request), () => this.transport.isReconnecting, AttachRetryDelaysMilliseconds, delay);
            const answered = performance.now();

            if (result === null) {
                this.loseConnection(new Error("attaching the runtime failed after retrying."));
                return false;
            }

            if (result === LeftToReconnect)
                return false;

            if (result.reload === true) {
                this.reloadForView(this.hydration?.view ?? "");
                return false;
            }

            if (result.fresh === true) {
                this.reloadForFreshRuntime(this.hydration?.view ?? "");
                return false;
            }

            forgetReload(sessionMemory());
            this.heldRuntime = result.runtime ?? null;
            this.runtimeSearch = search;
            this.dom.rebuild();
            this.updateProcessor.registerServerRenderedItems(result.initialChanges);

            await hold.previous;

            const content = contentRegion();

            if (request.switchRuntime) {
                this.pageId = null;
                this.discardDrafts();

                if (content !== null)
                    this.windows.forget(content);
            }

            this.leaveGuard.set(false);
            await this.applyAttachChangesAsync(result.initialChanges);
            this.markCurrent();

            this.updateProcessor.initializeItemsHosts();

            if (request.switchRuntime)
                showFromStart(content);

            this.releaseInertContent();
            this.windows.start();
            this.connection.reconnected();

            logElapsed("runtime attached", started, {
                windowId: this.windowId,
                instanceId: this.instanceId,
                answered: formatMilliseconds(answered - started),
                updates: result.initialChanges?.updates?.length ?? 0
            });

            return true;
        }
        finally {
            hold.release();
        }
    }

    private createAttachRequest(search: string): WebUIAttachRequest {
        const request = buildAttachRequest(this.windowId, search, this.runtimeSearch, this.heldRuntime, this.pageId, this.renderSequence, this.hydration, this.clientState);
        this.renderSequence = null;

        return request;
    }

    private holdInbound(): { readonly previous: Promise<void>; readonly release: () => void } {
        return holdInboundQueue(this.inbound, (next, expected) => this.setInbound(next, expected));
    }

    private async applyAttachChangesAsync(changes: ServerChangeSet | undefined): Promise<void> {
        try {
            const snapshot = hasStagedValues(changes) ? await fetchStagedValuesAsync(changes, this.transport.instanceId) : changes;

            this.releaseInertContent();
            this.holdTypedDuring(() => this.applyNow(snapshot));
        }
        catch (error) {
            logError("a staged value of the attach could not be fetched; the page attaches again.", error);
            this.reattachRequested = true;
        }
    }

    private releaseInertContent(): void {
        this.inertContent?.removeAttribute("inert");
        this.inertContent = null;
        this.endSwitchProgress?.();
        this.endSwitchProgress = null;
    }
}

export async function startWebUIAsync(options: WebUIRuntimeOptions = {}): Promise<WebUIRuntime> {
    const started = performance.now();
    const runtime = new WebUIRuntime(options);

    logElapsed("runtime built", started);

    await runtime.startAsync();

    return runtime;
}
