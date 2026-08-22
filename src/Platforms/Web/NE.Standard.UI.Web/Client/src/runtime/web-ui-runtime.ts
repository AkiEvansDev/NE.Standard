import { AddressResolver } from "../addressing/address-resolver";
import { DomRegistry } from "../addressing/dom-registry";
import { EventRegistration } from "../events/event-descriptor";
import { EventPipeline } from "../events/event-pipeline";
import { InteractionEngine } from "../interactions/interaction-engine";
import { InteractionEvaluator } from "../interactions/interaction-evaluator";
import { InteractionIndex } from "../interactions/interaction-index";
import { FlyoutInteractionEngine } from "../interactions/flyout-interaction-engine";
import { FileInputEngine } from "../interactions/file-input-engine";
import { ImageFallbackEngine } from "../interactions/image-fallback-engine";
import { RadioGroupSyncEngine } from "../interactions/radio-group-sync-engine";
import { SelectInteractionEngine } from "../interactions/select-interaction-engine";
import { SearchInputEngine } from "../interactions/search-input-engine";
import { RangeValueEngine } from "../interactions/range-value-engine";
import { NumberInputEngine } from "../interactions/number-input-engine";
import { TemporalPickerEngine } from "../interactions/temporal-picker-engine";
import { ContextMenuEngine } from "../interactions/context-menu-engine";
import { MenuEngine } from "../interactions/menu-engine";
import { MenuGroupEngine } from "../interactions/menu-group-engine";
import { TabsEngine } from "../interactions/tabs-engine";
import { BreadcrumbsEngine } from "../interactions/breadcrumbs-engine";
import { TabsViewEngine } from "../interactions/tabs-view-engine";
import { TimeSegmentEngine } from "../interactions/time-segment-engine";
import { ScrollAnchorEngine } from "../interactions/scroll-anchor-engine";
import { ItemsRuleWatcher } from "../items/items-rule-watcher";
import { ItemsWindowEngine } from "../items/items-window-engine";
import { ItemsVirtualizationEngine } from "../items/items-virtualization-engine";
import { ItemsTemplateRegistry } from "../items/items-template-registry";
import { ItemsTemplateRenderer } from "../items/items-template-renderer";
import { MetadataIndex, ServerChangeSet } from "../metadata/metadata-index";
import { readWebUIMetadata } from "../metadata/metadata-reader";
import { CommandDispatcher } from "../transport/command-dispatcher";
import { PropertyStateStore } from "../state/property-state-store";
import { SignalRTransport } from "../transport/signalr-transport";
import { ValueChangeDispatcher } from "../transport/value-change-dispatcher";
import { DomOperationRegistration } from "../updates/dom-operation-registry";
import { EffectRegistration, EffectRegistry } from "../effects/effect-registry";
import { DialogEngine } from "../interactions/dialog-engine";
import { NotificationEngine } from "../interactions/notification-engine";
import { PropertyPatchEngine } from "../updates/property-patch-engine";
import { ReactiveSourceRegistry } from "../updates/reactive-source-registry";
import { UpdateProcessor } from "../updates/update-processor";
import { ValidationEngine } from "../interactions/validation-engine";
import { ValueBindingEngine } from "../updates/value-binding-engine";
import { ExtensionRegistry } from "../extensions/extension-registry";
import { ValueConverterRegistration } from "../extensions/converters";
import { exposeGlobalApi } from "./global-api";
import { logDebug, logError, logWarn } from "./logger";
import { WebUIRuntimeOptions } from "./runtime-options";

const DefaultTabIdStorageKey = "ne.standard.ui.tabId";

export class WebUIRuntime {
    public readonly tabId: string;

    private readonly root: ParentNode;
    private readonly metadata = new MetadataIndex(readWebUIMetadata());
    private readonly dom: DomRegistry;
    private readonly transport: SignalRTransport;
    private readonly dispatcher: CommandDispatcher;
    private readonly updateProcessor: UpdateProcessor;
    private readonly eventPipeline: EventPipeline;
    private readonly extensions: ExtensionRegistry;
    private readonly dialogs: DialogEngine;
    private readonly windows: ItemsWindowEngine;
    private readonly virtualization: ItemsVirtualizationEngine;
    private readonly notifications: NotificationEngine;
    private readonly effects: EffectRegistry;

    /** Public so a plugin's own Source-driven config can reuse this dispatch instead of scanning changes itself. */
    public readonly reactiveSources: ReactiveSourceRegistry;

    private attachTask: Promise<void> | null = null;

    public constructor(private readonly options: WebUIRuntimeOptions = {}) {
        this.root = options.root ?? document;
        this.tabId = getOrCreateTabId(options.tabIdStorageKey ?? DefaultTabIdStorageKey);
        this.dom = new DomRegistry(this.root);
        this.virtualization = new ItemsVirtualizationEngine({ root: this.root });

        this.extensions = new ExtensionRegistry(options.converters, options.eventDefinitions, options.domOperations);
        const addressResolver = new AddressResolver(this.dom, this.metadata);
        const operations = this.extensions.operations;
        const propertyState = new PropertyStateStore();
        const propertyPatchEngine = new PropertyPatchEngine(addressResolver, operations, this.extensions, propertyState);
        this.reactiveSources = new ReactiveSourceRegistry(propertyPatchEngine);
        // Built before the interaction engine, which runs client effects of its own: an interaction that
        // scrolls or focuses goes through the same registry a command's effect does.
        this.dialogs = new DialogEngine({ root: this.root });
        this.notifications = new NotificationEngine({ root: this.root });
        this.effects = new EffectRegistry({ dialogs: this.dialogs, notifications: this.notifications });

        const interactionIndex = new InteractionIndex(this.metadata);
        const interactionEngine = new InteractionEngine(interactionIndex, propertyPatchEngine, new InteractionEvaluator(), {
            effects: this.effects,
            dom: this.dom
        });
        const itemsTemplates = new ItemsTemplateRegistry(this.dom);
        const itemsRenderer = new ItemsTemplateRenderer(this.metadata, itemsTemplates, this.extensions, operations, propertyState);

        this.updateProcessor = new UpdateProcessor(this.metadata, propertyPatchEngine, propertyState, itemsRenderer, itemsTemplates, this.dom);

        // Everything that can put a host out of step with its own rules — a patched item value, a rule Source on
        // another component — goes through this one watcher, so grouping, filtering and sorting all come back
        // in step the same way a collection change does. See ItemsRuleWatcher.
        new ItemsRuleWatcher({
            root: this.root,
            metadata: this.metadata,
            templates: itemsTemplates,
            renderer: itemsRenderer,
            state: propertyState,
            propertyPatchEngine,
            reactiveSources: this.reactiveSources
        });

        this.transport = new SignalRTransport(this.tabId, options.signalR);
        this.dispatcher = new CommandDispatcher(this.transport);

        // Value sync is independent of the event pipeline: a bound Value with no .OnChange still needs its own
        // listener, and a component with both does two independent round-trips on one "change".
        const valueChangeDispatcher = new ValueChangeDispatcher(this.transport);
        const valueBinding = new ValueBindingEngine({
            root: this.root,
            metadata: this.metadata,
            dom: this.dom,
            dispatcher: valueChangeDispatcher,
            updateProcessor: this.updateProcessor
        });
        const validationEngine = new ValidationEngine({
            root: this.root,
            metadata: this.metadata,
            dom: this.dom,
            propertyPatchEngine,
            updateProcessor: this.updateProcessor
        });

        new FileInputEngine({ root: this.root });
        new ImageFallbackEngine({ root: this.root });
        new RadioGroupSyncEngine({ root: this.root });
        new SelectInteractionEngine({ root: this.root });
        new SearchInputEngine({ root: this.root });
        new RangeValueEngine({ root: this.root, propertyPatchEngine, dom: this.dom });
        new NumberInputEngine({ root: this.root, propertyPatchEngine, dom: this.dom });
        new TemporalPickerEngine({ root: this.root, propertyPatchEngine, dom: this.dom });
        new TimeSegmentEngine({ root: this.root, propertyPatchEngine, dom: this.dom });
        new ContextMenuEngine({ root: this.root });
        new MenuEngine({ root: this.root });
        new MenuGroupEngine({ root: this.root });
        new TabsEngine({ root: this.root });
        new TabsViewEngine({ root: this.root });
        new BreadcrumbsEngine({ root: this.root });
        new ScrollAnchorEngine({ root: this.root });
        new FlyoutInteractionEngine({ root: this.root });

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

        // Every event name the compiled view actually declares is attached here, so Focus/Blur/HoverStart and
        // any other declared event work without a host page calling registerEvent first — that entry point is
        // for events a host wants that appear in no compiled view.
        for (const eventName of new Set([...this.metadata.getEventNames(), ...interactionIndex.getSourceEventNames()]))
            this.eventPipeline.addEvent(eventName);

        // Windowed hosts ask for what the viewer is looking at and place the spacers standing in for the rest.
        // Built after the transport, since asking is an invoke.
        this.windows = new ItemsWindowEngine({
            root: this.root,
            requestWindow: request => this.transport.requestItemWindowAsync(request),
            applyChanges: changes => this.applyChanges(changes)
        });

        this.transport.onChanges(changes => this.applyChanges(changes));

        // The server strips effects from a client-invoked command's returned copy after pushing them here, so
        // applying both channels cannot double-apply.
        this.transport.onCommandResult(result => {
            this.applyChanges(result.changes);
            this.effects.applyAll(result.command?.effects, this.dom);

            // After the effects, because a scroll effect is exactly what puts a windowed viewport where its
            // window is not — and it is the one move the engine cannot count on hearing as a scroll.
            this.windows.reconsider();
        });
        this.transport.onReconnecting(error => {
            logWarn("SignalR reconnecting.", error);
        });
        this.transport.onReconnected(async () => {
            logDebug("SignalR reconnected. Reattaching runtime.");
            await this.attachAsync();
        });
        this.transport.onClosed(error => {
            if (error !== undefined)
                logError("SignalR connection closed.", error);
        });
    }

    public get instanceId(): string | null {
        return this.transport.instanceId;
    }

    public async startAsync(): Promise<void> {
        exposeGlobalApi(this, this.options.handlerGlobalKey);
        await this.transport.startAsync();
        await this.attachAsync();
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

    // Every change set goes through here, because a window that moved leaves the spacers standing for the
    // wrong number of items until they are placed again.
    private applyChanges(changes: ServerChangeSet | undefined): void {
        this.updateProcessor.applyChangeSet(changes);
        this.windows.sync();
        this.virtualization.sync();
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
            clientTabId: this.tabId,
            route: window.location.pathname,
            parameters: readQueryParameters(window.location.search)
        });

        this.dom.rebuild();
        this.applyChanges(result.initialChanges);
        this.updateProcessor.initializeItemsHosts();
        this.windows.start();
        this.virtualization.sync();

        logDebug("runtime attached.", {
            tabId: this.tabId,
            instanceId: this.instanceId
        });
    }
}

export async function startWebUIAsync(options: WebUIRuntimeOptions = {}): Promise<WebUIRuntime> {
    const runtime = new WebUIRuntime(options);

    await runtime.startAsync();

    return runtime;
}

/**
 * The tab's own id, kept across reloads so a reattach finds the runtime this tab already had.
 *
 * Everything here is best-effort, because none of it is guaranteed to exist: `sessionStorage` throws outright
 * where site data is blocked, and `crypto.randomUUID` is absent outside a secure context — an application
 * served over plain http on a LAN address is the ordinary case, and the runtime used to fail to start there at
 * all. A tab that cannot remember its id gets a fresh one per load, which costs it a new runtime and nothing
 * else.
 */
function getOrCreateTabId(storageKey: string): string {
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

    const value = createTabId();

    try {
        storage?.setItem(storageKey, value);
    }
    catch (error) {
        logWarn("storing the tab id failed.", error);
    }

    return value;
}

function createTabId(): string {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function")
        return crypto.randomUUID();

    // Not a UUID and does not need to be: the id only has to be unique among this browser's open tabs, and it
    // is paired with a session id the client never chooses.
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
