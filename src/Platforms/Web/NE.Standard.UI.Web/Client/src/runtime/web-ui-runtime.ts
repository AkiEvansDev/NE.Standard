import { AddressResolver } from "../addressing/address-resolver";
import { DomRegistry } from "../addressing/dom-registry";
import { ClientStrings, clientStrings } from "./client-strings";
import { EventRegistration } from "../events/event-descriptor";
import { EventPipeline } from "../events/event-pipeline";
import { InteractionEngine } from "../interactions/interaction-engine";
import { InteractionEvaluator } from "../interactions/interaction-evaluator";
import { InteractionIndex } from "../interactions/interaction-index";
import { FlyoutInteractionEngine } from "../interactions/flyout-interaction-engine";
import { FileInputEngine } from "../interactions/file-input-engine";
import { ImageInputEngine } from "../interactions/image-input-engine";
import { KeyValueActionEngine } from "../interactions/key-value-action-engine";
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
import { TableColumnsEngine } from "../interactions/table-columns-engine";
import { TreeEngine } from "../interactions/tree-engine";
import { TabsViewEngine } from "../interactions/tabs-view-engine";
import { TextFoldEngine } from "../interactions/text-fold-engine";
import { TimeSegmentEngine } from "../interactions/time-segment-engine";
import { ScrollAnchorEngine } from "../interactions/scroll-anchor-engine";
import { PressRippleEngine } from "../interactions/press-ripple-engine";
import { PressRippleAttribute } from "../addressing/dom-attributes";
import { startTooltips } from "../interactions/tooltip-engine";
import { ItemsRuleWatcher } from "../items/items-rule-watcher";
import { ItemsWindowEngine } from "../items/items-window-engine";
import { ItemsSelectionEngine } from "../interactions/items-selection-engine";
import { ItemsVirtualizationEngine } from "../items/items-virtualization-engine";
import { ItemsTemplateRegistry } from "../items/items-template-registry";
import { ItemsTemplateRenderer } from "../items/items-template-renderer";
import { MetadataIndex, ServerChangeSet, getIdValue } from "../metadata/metadata-index";
import { readWebUIMetadata } from "../metadata/metadata-reader";
import { readHydration } from "./web-hydration";
import { CommandDispatcher } from "../transport/command-dispatcher";
import { PropertyStateStore } from "../state/property-state-store";
import { SignalRTransport } from "../transport/signalr-transport";
import { ValueChangeDispatcher } from "../transport/value-change-dispatcher";
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
import { numberFormatting } from "../rendering/number-format";
import { ClientStore } from "../state/client-store";
import { CollectionSinkRegistration } from "../updates/collection-sinks";
import { ValueConverterRegistration } from "../extensions/converters";
import { ValueReaderRegistration } from "../extensions/value-readers";
import { exposeGlobalApi } from "./global-api";
import { logDebug, logError, logWarn } from "./logger";
import { WebUIRuntimeOptions } from "./runtime-options";

const DefaultWindowIdStorageKey = "ne.standard.ui.windowId";

type EngineContext = {
    readonly root: ParentNode;
    readonly dom: DomRegistry;
    readonly propertyPatchEngine: PropertyPatchEngine;
    readonly effects: EffectRegistry;
};

/**
 * What a package's engine starts from: the same services a built-in engine gets, plus what it cannot import from a bundle of
 * its own — the page's words, the two observer shapes, the dialogs and the store.
 */
export type PluginEngineContext = EngineContext & {
    readonly strings: ClientStrings;
    readonly observeComponents: typeof observeComponents;
    readonly observeSize: typeof observeSize;
    readonly dialogs: DialogEngine;
    readonly store: ClientStore;
    readonly numbers: typeof numberFormatting;
};

export type PluginEngine = (context: PluginEngineContext) => unknown;

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
    ({ root, propertyPatchEngine, dom }) => new NumberInputEngine({ root, propertyPatchEngine, dom }),
    ({ root, propertyPatchEngine, dom }) => new ColorInputEngine({ root, propertyPatchEngine, dom }),
    ({ root, propertyPatchEngine, dom }) => new TemporalPickerEngine({ root, propertyPatchEngine, dom }),
    ({ root, effects, dom }) => new ThemeSwitcherEngine({ root, effects, dom }),
    ({ root, propertyPatchEngine, dom }) => new TimeSegmentEngine({ root, propertyPatchEngine, dom }),
    ({ root }) => new ContextMenuEngine({ root }),
    ({ root }) => new SplitButtonEngine({ root }),
    ({ root }) => new ButtonGroupEngine({ root }),
    ({ root }) => new MenuEngine({ root }),
    // Before the group engine: it restores a menu's fold, and groups are opened against the shape that leaves.
    ({ root }) => new CollapsibleEngine({ root }),
    ({ root }) => new MenuGroupEngine({ root }),
    ({ root }) => new GridSplitterEngine({ root }),
    ({ root }) => new TableColumnsEngine({ root }),
    ({ root }) => new AccordionEngine({ root }),
    ({ root }) => new TabsEngine({ root }),
    ({ root, effects }) => new TabsViewEngine({ root, effects }),
    ({ root, effects }) => new TreeEngine({ root, effects }),
    ({ root }) => new BreadcrumbsEngine({ root }),
    ({ root }) => new ScrollAnchorEngine({ root }),
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
    private readonly dialogs: DialogEngine;
    private readonly windows: ItemsWindowEngine;
    private readonly virtualization: ItemsVirtualizationEngine;
    private readonly notifications: NotificationEngine;
    private readonly effects: EffectRegistry;

    /** Public so a plugin's own Source-driven config can reuse this dispatch. */
    public readonly reactiveSources: ReactiveSourceRegistry;

    private attachTask: Promise<void> | null = null;

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
            valueReaders: this.extensions.valueReaders
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

        // After the transport, since asking for a window is an invoke.
        this.windows = new ItemsWindowEngine({
            root: this.root,
            requestWindow: request => this.transport.requestItemWindowAsync(request),
            applyChanges: changes => this.applyChanges(changes)
        });

        this.transport.onChanges(changes => this.applyChanges(changes));

        // The server strips effects from a client-invoked command's returned copy, so both channels cannot double-apply.
        this.transport.onCommandResult(result => {
            this.applyChanges(result.changes);
            this.effects.applyAll(result.command?.effects, this.dom);

            // After the effects: a scroll effect can move a windowed viewport without raising a scroll event.
            this.windows.reconsider();
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
     * The page was rendered from another compile of its view — the code changed under it — and the server refused it. Reloaded once:
     * a page that comes back with the same compile and is refused again (two servers of two builds) is left alone, with the reason logged.
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

        // Before the connection: the markup is already the finished page, and this takes the client's copy of it.
        this.hydrate();

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

    /** Starts a package's engine after every built-in one, on the same root and services. */
    public addEngine(start: PluginEngine): void {
        start({
            ...this.engineContext,
            strings: clientStrings,
            observeComponents,
            observeSize,
            dialogs: this.dialogs,
            store: new ClientStore(),
            numbers: numberFormatting
        });
    }

    // Every change set goes through here: a window that moved leaves its spacers standing for the wrong count.
    private applyChanges(changes: ServerChangeSet | undefined): void {
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
        const result = await this.transport.attachAsync({
            clientWindowId: this.windowId,
            route: window.location.pathname,
            // Presenting the runtime the render prepared claims it rather than building a second one.
            pageId: this.hydration?.pageId ?? null,
            view: this.hydration?.view ?? null,
            parameters: readQueryParameters(window.location.search)
        });

        if (result.reload === true) {
            this.reloadForView(this.hydration?.view ?? "");
            return;
        }

        forgetReloadedView();
        this.dom.rebuild();
        this.updateProcessor.registerServerRenderedItems(result.initialChanges);
        this.applyChanges(result.initialChanges);
        this.updateProcessor.initializeItemsHosts();
        this.windows.start();

        logDebug("runtime attached.", {
            windowId: this.windowId,
            instanceId: this.instanceId
        });
    }
}

export async function startWebUIAsync(options: WebUIRuntimeOptions = {}): Promise<WebUIRuntime> {
    const runtime = new WebUIRuntime(options);

    await runtime.startAsync();

    return runtime;
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
