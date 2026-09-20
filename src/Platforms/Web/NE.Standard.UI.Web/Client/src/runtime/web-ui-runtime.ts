import { AddressResolver } from "../addressing/address-resolver";
import { DomRegistry, readComponentId } from "../addressing/dom-registry";
import { ClientStrings, clientStrings } from "./client-strings";
import { EventRegistration } from "../events/event-descriptor";
import { EventPipeline } from "../events/event-pipeline";
import { InteractionEngine } from "../interactions/interaction-engine";
import { InteractionEvaluator } from "../interactions/interaction-evaluator";
import { InteractionIndex } from "../interactions/interaction-index";
import { FlyoutInteractionEngine } from "../interactions/flyout-interaction-engine";
import { FileInputEngine } from "../interactions/file-input-engine";
import { FileUploads, fileUploads } from "../interactions/file-upload";
import { ItemSelection, itemSelection } from "../interactions/row-selection";
import { ImageInputEngine } from "../interactions/image-input-engine";
import { KeyValueActionEngine } from "../interactions/key-value-action-engine";
import { ToggleButtonEngine } from "../interactions/toggle-button-engine";
import { FieldKeysEngine } from "../interactions/field-keys-engine";
import { ImageFallbackEngine } from "../interactions/image-fallback-engine";
import { RadioGroupSyncEngine } from "../interactions/radio-group-sync-engine";
import { SelectInteractionEngine } from "../interactions/select-interaction-engine";
import { SearchInputEngine } from "../interactions/search-input-engine";
import { DebouncedCommitEngine } from "../interactions/debounced-commit-engine";
import { RangeValueEngine } from "../interactions/range-value-engine";
import { NumberInputEngine } from "../interactions/number-input-engine";
import { TemporalPickerEngine } from "../interactions/temporal-picker-engine";
import { ThemeSwitcherEngine } from "../interactions/theme-switcher-engine";
import { ContextMenuEngine } from "../interactions/context-menu-engine";
import { MenuEngine } from "../interactions/menu-engine";
import { MenuGroupEngine } from "../interactions/menu-group-engine";
import { CollapsibleEngine } from "../interactions/collapsible-engine";
import { GridSplitterEngine } from "../interactions/grid-splitter-engine";
import { SplitButtonEngine } from "../interactions/split-button-engine";
import { ButtonGroupEngine } from "../interactions/button-group-engine";
import { AccordionEngine } from "../interactions/accordion-engine";
import { TabsEngine } from "../interactions/tabs-engine";
import { BreadcrumbsEngine } from "../interactions/breadcrumbs-engine";
import { ColorInputEngine } from "../interactions/color-input-engine";
import { TableColumns, TableColumnsEngine } from "../interactions/table-columns-engine";
import { TreeEngine } from "../interactions/tree-engine";
import { TabsViewEngine } from "../interactions/tabs-view-engine";
import { TextFoldEngine } from "../interactions/text-fold-engine";
import { TimeSegmentEngine } from "../interactions/time-segment-engine";
import { ScrollAnchorEngine } from "../interactions/scroll-anchor-engine";
import { ScrollGroupEngine } from "../interactions/scroll-group-engine";
import { PressRippleEngine } from "../interactions/press-ripple-engine";
import { ComponentSelector, PressRippleAttribute } from "../addressing/dom-attributes";
import { startTooltips, Tooltips, tooltips } from "../interactions/tooltip-engine";
import { InlineRenames, openInlineRename } from "../interactions/inline-rename";
import { Popups, popups } from "../interactions/popup-service";
import { rovingFocus } from "../interactions/roving-focus";
import { createItemRows, ItemRows } from "../items/item-rows";
import { ItemsRuleWatcher } from "../items/items-rule-watcher";
import { ItemsWindowEngine, ItemWindows } from "../items/items-window-engine";
import { ItemsSelectionEngine } from "../interactions/items-selection-engine";
import { ItemsVirtualizationEngine } from "../items/items-virtualization-engine";
import { ItemsTemplateRegistry } from "../items/items-template-registry";
import { ItemsTemplateRenderer } from "../items/items-template-renderer";
import { ClientEffectKinds, DiscardFormClientEffect, MetadataIndex, ServerChangeSet, WebUIAttachRequest, WebUIAttachResult, getIdValue } from "../metadata/metadata-index";
import { readWebUIMetadata } from "../metadata/metadata-reader";
import { readHydration } from "./web-hydration";
import { CommandDispatcher } from "../transport/command-dispatcher";
import { PropertyStateStore } from "../state/property-state-store";
import { SignalRTransport } from "../transport/signalr-transport";
import { ValueChangeDispatcher } from "../transport/value-change-dispatcher";
import { fetchStagedValuesAsync, hasStagedValues } from "../transport/value-staging";
import { DomOperationRegistration } from "../updates/dom-operation-registry";
import { EffectRegistration, EffectRegistry } from "../effects/effect-registry";
import { DialogEngine } from "../interactions/dialog-engine";
import { observeComponents } from "../interactions/dom-mutations";
import { NotificationEngine } from "../interactions/notification-engine";
import { PropertyPatchEngine } from "../updates/property-patch-engine";
import { ReactiveSourceRegistry } from "../updates/reactive-source-registry";
import { UpdateProcessor } from "../updates/update-processor";
import { ValidationEngine } from "../interactions/validation-engine";
import { ValueBindingEngine } from "../updates/value-binding-engine";
import { ExtensionRegistry } from "../extensions/extension-registry";
import { MenuRowDecorator } from "../items/menu-row-decorator";
import { observeSize } from "../interactions/element-size";
import { applyIconValue } from "../rendering/icon-value";
import { writeBadgeCount } from "../rendering/web-dom-converters";
import { numberFormatting } from "../rendering/number-format";
import { temporalFormatting } from "../rendering/temporal-format";
import { ClientStore } from "../state/client-store";
import { CollectionSinkRegistration } from "../updates/collection-sinks";
import { ValueConverterRegistration } from "../extensions/converters";
import { ValueReaderRegistration, ValueReading } from "../extensions/value-readers";
import { exposeGlobalApi } from "./global-api";
import { logDebug, logError, logWarn } from "./logger";
import { WebUIRuntimeOptions } from "./runtime-options";

const DefaultWindowIdStorageKey = "ne.standard.ui.windowId";

// An attach that throws is retried this many times before giving up, waiting this long before each retry.
const AttachRetryDelaysMilliseconds = [500, 1000, 2000];

type EngineContext = {
    readonly root: ParentNode;
    readonly dom: DomRegistry;
    readonly propertyPatchEngine: PropertyPatchEngine;
    readonly effects: EffectRegistry;
};

/** Icons as a package draws them on elements it builds itself: an icon value written the way a renderer writes it. */
export type Icons = {
    apply(element: Element, value: unknown): void;
};

/** Badges a package counts on itself, on a badge a renderer drew: the count written as the renderer would have written it. */
export type Badges = {
    writeCount(badge: Element, count: number): void;
};

/**
 * What a package's engine starts from: the same services a built-in engine gets, plus what it can't import from its own
 * bundle — the page's words, the observer shapes, the dialogs, the store, and the engines reached by name.
 */
export type PluginEngineContext = EngineContext & {
    readonly strings: ClientStrings;
    readonly observeComponents: typeof observeComponents;
    readonly observeSize: typeof observeSize;
    readonly dialogs: DialogEngine;
    readonly store: ClientStore;
    readonly numbers: typeof numberFormatting;
    readonly temporal: typeof temporalFormatting;
    readonly icons: Icons;
    readonly badges: Badges;
    readonly values: ValueReading;
    readonly properties: PropertyWriting;
    readonly windows: ItemWindows;
    readonly tooltips: Tooltips;
    readonly renames: InlineRenames;
    readonly tables: TableColumns;
    readonly rows: ItemRows;
    readonly uploads: FileUploads;
    readonly selection: ItemSelection;
    readonly popups: Popups;
    readonly roving: typeof rovingFocus;
};

export type PluginEngine = (context: PluginEngineContext) => unknown;

/** A core component's property set from a package's client the way a push sets it, where its renderer exposed the property. */
export type PropertyWriting = {
    set(element: Element, propertyName: string, value: unknown): boolean;
};

// Every engine that needs only the root and the shared services, started in this order; the order matters in one place, and that place says so.
const ComponentEngines: readonly ((context: EngineContext) => unknown)[] = [
    ({ root }) => new FileInputEngine({ root }),
    ({ root }) => new ImageInputEngine({ root }),
    ({ root, dom, propertyPatchEngine }) => new KeyValueActionEngine({ root, dom, propertyPatchEngine }),
    // After every engine with its own Enter or Escape, so theirs is the one that runs on a key they take.
    ({ root }) => new FieldKeysEngine({ root }),
    ({ root }) => new ImageFallbackEngine({ root }),
    ({ root }) => new RadioGroupSyncEngine({ root }),
    ({ root }) => new SelectInteractionEngine({ root }),
    ({ root }) => new SearchInputEngine({ root }),
    ({ root }) => new DebouncedCommitEngine({ root }),
    ({ root }) => new ItemsSelectionEngine({ root }),
    ({ root, propertyPatchEngine, dom }) => new RangeValueEngine({ root, propertyPatchEngine, dom }),
    ({ root, propertyPatchEngine }) => new NumberInputEngine({ root, propertyPatchEngine }),
    ({ root, propertyPatchEngine, dom }) => new ColorInputEngine({ root, propertyPatchEngine, dom }),
    ({ root, propertyPatchEngine }) => new TemporalPickerEngine({ root, propertyPatchEngine }),
    ({ root, effects, dom }) => new ThemeSwitcherEngine({ root, effects, dom }),
    ({ root, propertyPatchEngine }) => new TimeSegmentEngine({ root, propertyPatchEngine }),
    ({ root }) => new ContextMenuEngine({ root }),
    ({ root }) => new SplitButtonEngine({ root }),
    ({ root }) => new ToggleButtonEngine({ root }),
    ({ root }) => new ButtonGroupEngine({ root }),
    ({ root }) => new MenuEngine({ root }),
    // Before the group engine: it restores a menu's fold, and groups are opened against the shape that leaves.
    ({ root }) => new CollapsibleEngine({ root }),
    ({ root }) => new MenuGroupEngine({ root }),
    ({ root }) => new GridSplitterEngine({ root }),
    ({ root }) => new AccordionEngine({ root }),
    ({ root }) => new TabsEngine({ root }),
    ({ root, effects }) => new TabsViewEngine({ root, effects }),
    ({ root }) => new BreadcrumbsEngine({ root }),
    ({ root }) => new ScrollAnchorEngine({ root }),
    ({ root }) => new ScrollGroupEngine({ root }),
    ({ root }) => new FlyoutInteractionEngine({ root }),
    ({ root }) => new TextFoldEngine({ root }),
    ({ root }) => startTooltips(root),
    // A theme flag, not a per-page choice: off the flag, the whole engine never starts.
    ({ root }) => document.documentElement.hasAttribute(PressRippleAttribute) ? new PressRippleEngine({ root }) : undefined
];

export class WebUIRuntime {
    public readonly windowId: string;

    private readonly options: WebUIRuntimeOptions;
    private readonly root: ParentNode;
    private readonly metadata = new MetadataIndex(readWebUIMetadata());
    private readonly hydration = readHydration();
    private readonly dom: DomRegistry;
    private readonly transport: SignalRTransport;
    private readonly dispatcher: CommandDispatcher;
    private readonly updateProcessor: UpdateProcessor;
    private readonly eventPipeline: EventPipeline;
    private readonly extensions: ExtensionRegistry;
    private readonly engineContext: EngineContext;
    private readonly pluginContext: PluginEngineContext;
    private readonly dialogs: DialogEngine;
    private readonly windows: ItemsWindowEngine;
    private readonly tables: TableColumnsEngine;
    private readonly virtualization: ItemsVirtualizationEngine;
    private readonly notifications: NotificationEngine;
    private readonly effects: EffectRegistry;

    /** Public so a plugin's own Source-driven config can reuse this dispatch. */
    public readonly reactiveSources: ReactiveSourceRegistry;

    private attachTask: Promise<void> | null = null;

    // The change sets still waiting on a staged value, in order; null while every one has been applied.
    private inbound: Promise<void> | null = null;

    // A package's engine registered before hydration, started once it is done; null once the page is hydrated.
    private enginesAwaitingHydration: PluginEngine[] | null = [];

    public constructor(options: WebUIRuntimeOptions = {}) {
        this.options = options;
        this.root = options.root ?? document;
        this.windowId = getOrCreateWindowId(options.windowIdStorageKey ?? DefaultWindowIdStorageKey);
        this.dom = new DomRegistry(this.root);

        // Before any engine: the first thing one draws may already need a word.
        clientStrings.load(this.root);

        if (options.strings !== undefined)
            clientStrings.register(options.strings);

        this.extensions = new ExtensionRegistry(options.converters, options.eventDefinitions, options.domOperations, options.valueReaders);
        this.extensions.registerRowDecorator(MenuRowDecorator);
        const addressResolver = new AddressResolver(this.dom, this.metadata);
        const operations = this.extensions.operations;
        const propertyState = new PropertyStateStore();
        const propertyPatchEngine = new PropertyPatchEngine(addressResolver, operations, this.extensions, propertyState);
        this.reactiveSources = new ReactiveSourceRegistry(propertyPatchEngine);
        // Built before the interaction engine, whose own effects go through the same registry a command's do.
        this.dialogs = new DialogEngine({ root: this.root });
        this.notifications = new NotificationEngine({ root: this.root });
        this.effects = new EffectRegistry({
            dialogs: this.dialogs,
            notifications: this.notifications,
            valueReaders: this.extensions.valueReaders,
            // Nothing waits on this: the theme is already on screen, and the session only has to catch up.
            reportTheme: theme => void this.transport.setThemeAsync(theme).catch(error => logWarn("reporting the theme to the session failed.", error))
        });

        const interactionIndex = new InteractionIndex(this.metadata);

        // Wired below, once the value engine exists: an interaction's write reaches the server through the same engine a field's does.
        let valueBinding: ValueBindingEngine | undefined;

        const interactionEngine = new InteractionEngine(interactionIndex, propertyPatchEngine, new InteractionEvaluator(), {
            effects: this.effects,
            dom: this.dom,
            writeBack: (target, dynamicParameters, value) => {
                void valueBinding?.syncPropertyAsync(getIdValue(target.componentId), target.propertyId, dynamicParameters, value)
                    .catch(error => logWarn("writing an interaction's value back failed.", error));
            }
        });
        const itemsTemplates = new ItemsTemplateRegistry(this.dom);
        const itemsRenderer = new ItemsTemplateRenderer(this.metadata, itemsTemplates, this.extensions, operations, propertyState);

        this.virtualization = new ItemsVirtualizationEngine({
            root: this.root,
            metadata: this.metadata,
            templates: itemsTemplates,
            renderer: itemsRenderer,
            state: propertyState,
            dom: this.dom
        });

        this.updateProcessor = new UpdateProcessor(
            this.metadata,
            propertyPatchEngine,
            propertyState,
            itemsRenderer,
            itemsTemplates,
            this.dom,
            this.virtualization,
            this.extensions.collectionSinks
        );

        // Everything that can put a host out of step with its own rules goes through this one watcher.
        new ItemsRuleWatcher({
            root: this.root,
            metadata: this.metadata,
            templates: itemsTemplates,
            renderer: itemsRenderer,
            state: propertyState,
            propertyPatchEngine,
            reactiveSources: this.reactiveSources,
            valueReaders: this.extensions.valueReaders,
            virtualization: this.virtualization
        });

        this.transport = new SignalRTransport(this.windowId, options.signalR);
        this.dispatcher = new CommandDispatcher(this.transport);

        // Value sync is independent of the event pipeline: a component with both does two round-trips on one "change".
        const valueChangeDispatcher = new ValueChangeDispatcher(this.transport);
        valueBinding = new ValueBindingEngine({
            root: this.root,
            metadata: this.metadata,
            dom: this.dom,
            dispatcher: valueChangeDispatcher,
            applyChanges: changes => this.applyChanges(changes),
            valueReaders: this.extensions.valueReaders,
            recordSent: (reference, dynamicParameters, value) => propertyPatchEngine.recordSentValue(reference, dynamicParameters, value)
        });
        propertyPatchEngine.setHeldTargets(target => valueBinding?.isHeld(target) === true);

        // Here rather than with the registry's defaults: it needs the value engine, which is built after the registry.
        this.effects.register(ClientEffectKinds.DiscardForm, context => {
            const formId = (context.effect as DiscardFormClientEffect).formId;

            if (typeof formId !== "string" || formId.length === 0)
                return;

            for (const element of valueBinding?.releaseForm(formId) ?? [])
                propertyPatchEngine.restoreBoundValue(element, context.dom.resolveNearestComponent(element, () => true)?.dynamicParameters ?? []);
        });
        const validationEngine = new ValidationEngine({
            root: this.root,
            metadata: this.metadata,
            dom: this.dom,
            propertyPatchEngine,
            updateProcessor: this.updateProcessor,
            valueReaders: this.extensions.valueReaders
        });

        this.engineContext = { root: this.root, dom: this.dom, propertyPatchEngine, effects: this.effects };

        for (const start of ComponentEngines)
            start(this.engineContext);

        // Apart from the list: a tree's filter and sort run in its own walk, which needs the rules and the rows' values.
        new TreeEngine({ root: this.root, effects: this.effects, rules: { metadata: this.metadata, state: propertyState, renderer: itemsRenderer } });

        this.eventPipeline = new EventPipeline({
            root: this.root,
            metadata: this.metadata,
            dom: this.dom,
            dispatcher: this.dispatcher,
            applyChanges: changes => this.applyChanges(changes),
            afterEffects: () => this.windows.reconsider(),
            interactionEngine,
            eventCatalog: this.extensions.events,
            effects: this.effects,
            events: options.events,
            validationEngine,
            valueBinding
        });

        // Every event the compiled view declares, so `registerEvent` is only for events that appear in none.
        for (const eventName of new Set([...this.metadata.getEventNames(), ...interactionIndex.getSourceEventNames()]))
            this.eventPipeline.addEvent(eventName);

        // Held by name, since a package's chooser reaches it through the engine context.
        this.tables = new TableColumnsEngine({ root: this.root });

        // After the transport, since asking for a window is an invoke.
        this.windows = new ItemsWindowEngine({
            root: this.root,
            requestWindow: request => this.transport.requestItemWindowAsync(request),
            applyChanges: changes => this.applyChanges(changes)
        });

        // Once, for every package engine: the services are the engines and modules themselves, not a face built per start.
        this.pluginContext = {
            ...this.engineContext,
            strings: clientStrings,
            observeComponents,
            observeSize,
            dialogs: this.dialogs,
            store: new ClientStore(),
            numbers: numberFormatting,
            temporal: temporalFormatting,
            icons: { apply: applyIconValue },
            badges: { writeCount: writeBadgeCount },
            values: {
                read: element => this.extensions.valueReaders.readHeld(element),
                hold: element => valueBinding?.hold(element),
                release: element => {
                    if (valueBinding?.release(element) === true)
                        propertyPatchEngine.restoreBoundValue(element, this.dom.resolveNearestComponent(element, () => true)?.dynamicParameters ?? []);
                }
            },
            properties: {
                set: (element, propertyName, value) => {
                    // The element's own component by its markup, not the page's index: a package may set a part before it's on the page,
                    // or have drawn several from one template, each set alone.
                    const component = element.closest(ComponentSelector);
                    const reference = component === null ? undefined : this.metadata.getExposedProperty(readComponentId(component), propertyName);

                    if (component === null || reference === undefined) {
                        logWarn("a package set a property its component's renderer did not expose.", { propertyName });
                        return false;
                    }

                    return propertyPatchEngine.applyToComponent(component, reference, value);
                }
            },
            windows: this.windows,
            tooltips,
            renames: { open: openInlineRename },
            tables: this.tables,
            rows: createItemRows(itemsTemplates, itemsRenderer, this.virtualization),
            uploads: fileUploads,
            selection: itemSelection,
            popups,
            roving: rovingFocus
        };

        this.transport.onChanges(changes => this.applyChanges(changes));

        // The server strips effects from a client-invoked command's returned copy, so both channels cannot double-apply.
        this.transport.onCommandResult(result => {
            // The effects after the changes, a staged value among them: an effect acts on the page those changes produced.
            void Promise.resolve(this.applyChanges(result.changes)).then(() => {
                this.effects.applyAll(result.command?.effects, this.dom);

                // After the effects: a scroll effect can move a windowed viewport without raising a scroll event.
                this.windows.reconsider();
            });
        });
        // A controller-asked rebuild takes the same route a dropped connection does.
        this.updateProcessor.addFullResyncHandler(() => {
            void this.attachAsync().catch(error => logError("re-attaching after a full resync failed.", error));
        });
        this.transport.onReconnecting(error => {
            logWarn("SignalR reconnecting.", error);
        });
        // A failure here is logged once, by the transport's own onReconnected wrapper.
        this.transport.onReconnected(async () => {
            logDebug("SignalR reconnected. Reattaching runtime.");
            await this.attachAsync();
        });
        this.transport.onClosed(error => {
            if (error !== undefined)
                logError("SignalR connection closed.", error);
        });
    }

    /**
     * The page was rendered from another compile of its view, and the server refused it. Reloaded once: a page that comes back
     * with the same compile and is refused again (two servers of two builds) is left alone, logged.
     */
    private reloadForView(view: string): void {
        if (readReloadedView() === view) {
            logError("the page was rendered from another compile of its view, and a reload did not change that; giving up.", { view });
            return;
        }

        logWarn("the page was rendered from another compile of its view; reloading.", { view });
        rememberReloadedView(view);
        window.location.reload();
    }

    public get instanceId(): string | null {
        return this.transport.instanceId;
    }

    public async startAsync(): Promise<void> {
        exposeGlobalApi(this, this.options.handlerGlobalKey);

        // A package's module runs after this one and registers its converters, operations and sinks as it does; the browser has
        // run every module by DOMContentLoaded, so hydration waits rather than meeting a package half-registered.
        await documentParsedAsync();

        // Before the connection: the markup is already the finished page, and this takes the client's copy of it.
        this.hydrate();
        this.startEnginesAwaitingHydration();

        await this.transport.startAsync();
        await this.attachAsync();
    }

    /** Takes the client's copy of the values the page was rendered with, changing nothing the reader sees. */
    private hydrate(): void {
        if (this.hydration === null)
            return;

        this.dom.rebuild();

        // Before the change set: its reconcile keeps a row only if it can read what the row holds.
        this.updateProcessor.registerServerRenderedItems(this.hydration.changes);
        this.applyChanges(this.hydration.changes);
        this.updateProcessor.initializeItemsHosts();

        logDebug("runtime hydrated from the page.", { pageId: this.hydration.pageId });
    }

    private startEnginesAwaitingHydration(): void {
        const engines = this.enginesAwaitingHydration ?? [];

        this.enginesAwaitingHydration = null;

        for (const start of engines)
            start(this.pluginContext);
    }

    public addEvent<TEvent extends Event = Event>(name: string, registration: Omit<EventRegistration<TEvent>, "name"> = {}): void {
        this.eventPipeline.addEvent(name, registration);
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

    /**
     * Starts a package's engine after every built-in one, on the same root and services. Registered before hydration (which waits
     * for the module), but started after, since an engine reads the page as hydrated.
     */
    public addEngine(start: PluginEngine): void {
        if (this.enginesAwaitingHydration !== null) {
            this.enginesAwaitingHydration.push(start);
            return;
        }

        start(this.pluginContext);
    }

    /**
     * Every change set goes through here. One naming a value staged beside the hub waits for it to be fetched, and every set
     * after it waits in turn, so the page takes them in order; the rest apply at once, as always.
     */
    private applyChanges(changes: ServerChangeSet | undefined): void | Promise<void> {
        if (this.inbound === null && !hasStagedValues(changes)) {
            this.applyNow(changes);
            return;
        }

        const applied = (this.inbound ?? Promise.resolve())
            .then(() => fetchStagedValuesAsync(changes))
            .then(resolved => this.applyNow(resolved))
            .catch(error => {
                // A value that could not be fetched leaves the page behind the server: it attaches again, as after a dropped connection.
                logError("a staged value could not be fetched; the page attaches again.", error);
                void this.attachAsync().catch(attachError => logError("re-attaching after a lost staged value failed.", attachError));
            });

        this.inbound = applied;
        void applied.then(() => {
            if (this.inbound === applied)
                this.inbound = null;
        });

        return applied;
    }

    // A window that moved leaves its spacers standing for the wrong count.
    private applyNow(changes: ServerChangeSet | undefined): void {
        this.updateProcessor.applyChangeSet(changes);
        this.windows.sync();
    }

    private async attachAsync(): Promise<void> {
        if (this.attachTask !== null)
            return this.attachTask;

        this.attachTask = this.attachCoreAsync();

        try {
            await this.attachTask;
        }
        finally {
            this.attachTask = null;
        }
    }

    private async attachCoreAsync(): Promise<void> {
        const result = await this.attachWithRetryAsync();

        if (result === null)
            return;

        if (result.reload === true) {
            this.reloadForView(this.hydration?.view ?? "");
            return;
        }

        forgetReloadedView();
        this.dom.rebuild();
        this.updateProcessor.registerServerRenderedItems(result.initialChanges);
        await this.applyChanges(result.initialChanges);
        this.updateProcessor.initializeItemsHosts();
        this.windows.start();

        logDebug("runtime attached.", {
            windowId: this.windowId,
            instanceId: this.instanceId
        });
    }

    /**
     * Retries a failed attach a few times with a growing backoff, so a hub call that throws without dropping the socket
     * doesn't need a page reload to recover. `null` after the last attempt means every retry failed; a later reconnect starts its own run.
     */
    private async attachWithRetryAsync(): Promise<WebUIAttachResult | null> {
        const request: WebUIAttachRequest = {
            clientWindowId: this.windowId,
            route: window.location.pathname,
            // Presenting the runtime the render prepared claims it rather than building a second one.
            pageId: this.hydration?.pageId ?? null,
            view: this.hydration?.view ?? null,
            parameters: readQueryParameters(window.location.search)
        };

        for (let attempt = 0; ; attempt++) {
            try {
                return await this.transport.attachAsync(request);
            }
            catch (error) {
                if (attempt >= AttachRetryDelaysMilliseconds.length) {
                    logError("attaching the runtime failed after retrying; giving up until the next reconnect.", error);
                    return null;
                }

                logWarn("attaching the runtime failed; retrying.", { attempt: attempt + 1, error });
                await delay(AttachRetryDelaysMilliseconds[attempt]);
            }
        }
    }
}

export async function startWebUIAsync(options: WebUIRuntimeOptions = {}): Promise<WebUIRuntime> {
    const runtime = new WebUIRuntime(options);

    await runtime.startAsync();

    return runtime;
}

/** Waits out one of `AttachRetryDelaysMilliseconds` between two retries of a failed attach. */
function delay(milliseconds: number): Promise<void> {
    return new Promise(resolve => window.setTimeout(resolve, milliseconds));
}

/** Resolves once the document is parsed and its deferred and module scripts have run: at once if DOMContentLoaded has already fired. */
function documentParsedAsync(): Promise<void> {
    const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;

    if (document.readyState === "complete" || (navigation !== undefined && navigation.domContentLoadedEventStart > 0))
        return Promise.resolve();

    return new Promise(resolve => document.addEventListener("DOMContentLoaded", () => resolve(), { once: true }));
}

/** The tab's own id, kept across reloads; best-effort, since neither sessionStorage nor crypto.randomUUID is guaranteed. */
function getOrCreateWindowId(storageKey: string): string {
    let storage: Storage | null = null;

    try {
        storage = window.sessionStorage;
    }
    catch (error) {
        logWarn("session storage is unavailable, so this tab is new on every load.", error);
    }

    try {
        const existing = storage?.getItem(storageKey);

        if (existing !== undefined && existing !== null && existing.length > 0)
            return existing;
    }
    catch (error) {
        logWarn("reading the tab id failed.", error);
    }

    const value = createWindowId();

    try {
        storage?.setItem(storageKey, value);
    }
    catch (error) {
        logWarn("storing the tab id failed.", error);
    }

    return value;
}

function createWindowId(): string {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function")
        return crypto.randomUUID();

    // Not a UUID: the id only has to be unique among this browser's open tabs.
    const random = typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function"
        ? [...crypto.getRandomValues(new Uint8Array(16))].map(byte => byte.toString(16).padStart(2, "0")).join("")
        : Math.random().toString(16).slice(2).padEnd(16, "0");

    return `tab-${random}-${performance.now().toString(36).replace(".", "")}`;
}

function readQueryParameters(search: string): Record<string, unknown> | null {
    const parameters = new URLSearchParams(search);

    if ([...parameters.keys()].length === 0)
        return null;

    const result: Record<string, unknown> = {};

    parameters.forEach((value, key) => {
        if (Object.prototype.hasOwnProperty.call(result, key)) {
            const existing = result[key];

            result[key] = Array.isArray(existing) ? [...existing, value] : [existing, value];
            return;
        }

        result[key] = value;
    });

    return result;
}

// Which compile the page last reloaded for, kept across that reload and cleared by the attach that succeeds after it.
const ReloadedViewKey = "ne-standard-ui:reloaded-view";

function readReloadedView(): string | null {
    try {
        return sessionStorage.getItem(ReloadedViewKey);
    }
    catch {
        return null;
    }
}

function rememberReloadedView(view: string): void {
    try {
        sessionStorage.setItem(ReloadedViewKey, view);
    }
    catch {
        // No session storage (a locked-down browser): the guard against a reload loop is lost, the reload itself is not.
    }
}

function forgetReloadedView(): void {
    try {
        sessionStorage.removeItem(ReloadedViewKey);
    }
    catch {
        // Nothing was remembered where nothing can be.
    }
}
