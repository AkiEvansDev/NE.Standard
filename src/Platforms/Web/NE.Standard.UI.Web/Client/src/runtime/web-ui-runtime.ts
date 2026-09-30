import { AddressResolver } from "../addressing/address-resolver";
import { DomRegistry, readComponentId } from "../addressing/dom-registry";
import { ClientWords, clientStrings, forEachSubtree, marksMoment } from "./client-strings";
import { holdsMoment } from "./words";
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
import { FieldBoxPressEngine } from "../interactions/field-box-press-engine";
import { FieldKeysEngine } from "../interactions/field-keys-engine";
import { ImageFallbackEngine } from "../interactions/image-fallback-engine";
import { RadioGroupSyncEngine } from "../interactions/radio-group-sync-engine";
import { SelectInteractionEngine } from "../interactions/select-interaction-engine";
import { SearchInputEngine } from "../interactions/search-input-engine";
import { DebouncedCommitEngine } from "../interactions/debounced-commit-engine";
import { sizesFieldsToContent, TextAreaGrowEngine } from "../interactions/text-area-grow-engine";
import { RangeValueEngine } from "../interactions/range-value-engine";
import { NumberInputEngine } from "../interactions/number-input-engine";
import { ItemMoveEvent, ItemsReorderEngine } from "../interactions/items-reorder-engine";
import { TemporalPickerEngine } from "../interactions/temporal-picker-engine";
import { ThemeSwitcherEngine } from "../interactions/theme-switcher-engine";
import { LanguageSwitcherEngine } from "../interactions/language-switcher-engine";
import { ContextMenuEngine } from "../interactions/context-menu-engine";
import { MenuEngine } from "../interactions/menu-engine";
import { MenuGroupEngine } from "../interactions/menu-group-engine";
import { MenuSearchEngine } from "../interactions/menu-search-engine";
import { SideDrawerEngine } from "../interactions/side-drawer-engine";
import { CollapsibleEngine } from "../interactions/collapsible-engine";
import { GridSplitterEngine } from "../interactions/grid-splitter-engine";
import { SplitButtonEngine } from "../interactions/split-button-engine";
import { ButtonGroupEngine } from "../interactions/button-group-engine";
import { AccordionEngine } from "../interactions/accordion-engine";
import { TabsEngine } from "../interactions/tabs-engine";
import { CommandBarEngine } from "../interactions/command-bar-engine";
import { BreadcrumbsEngine } from "../interactions/breadcrumbs-engine";
import { ColorInputEngine } from "../interactions/color-input-engine";
import { TableColumns, TableColumnsEngine } from "../interactions/table-columns-engine";
import { TreeEngine } from "../interactions/tree-engine";
import { TabMenuEntryEvent, TabsViewEngine } from "../interactions/tabs-view-engine";
import { TextFoldEngine } from "../interactions/text-fold-engine";
import { TimeSegmentEngine } from "../interactions/time-segment-engine";
import { TimestampEngine } from "../interactions/timestamp-engine";
import { ScrollAnchorEngine } from "../interactions/scroll-anchor-engine";
import { SurfacePressEngine } from "../interactions/surface-press-engine";
import { ScrollGroupEngine } from "../interactions/scroll-group-engine";
import { PressRippleEngine } from "../interactions/press-ripple-engine";
import { startRefusals } from "../interactions/refusal-engine";
import { ComponentIdAttribute, ComponentSelector, cssAttributeValue, pluginDomNames, PressRippleAttribute } from "../addressing/dom-attributes";
import { endsWithDynamicParameters } from "../addressing/dynamic-parameters";
import { startTooltips, Tooltips, tooltips } from "../interactions/tooltip-engine";
import { InlineRenames, openInlineRename } from "../interactions/inline-rename";
import { Popups, popups } from "../interactions/popup-service";
import { rovingFocus } from "../interactions/roving-focus";
import { componentStates } from "../interactions/interactive-state";
import { wheel } from "../interactions/wheel-notches";
import { createItemRows, ItemRows } from "../items/item-rows";
import { ItemsRuleWatcher } from "../items/items-rule-watcher";
import { ItemsWindowEngine, ItemWindows } from "../items/items-window-engine";
import { ItemsSelectionEngine } from "../interactions/items-selection-engine";
import { ItemsVirtualizationEngine } from "../items/items-virtualization-engine";
import { ItemsTemplateRegistry } from "../items/items-template-registry";
import { ItemsTemplateRenderer } from "../items/items-template-renderer";
import {
    ClientEffectKinds, DiscardFormClientEffect, MetadataIndex, ServerChangeSet, SetLanguageClientEffect, SetThemeColorsClientEffect, WebUIAttachRequest, WebUIAttachResult,
    getIdValue
} from "../metadata/metadata-index";
import { applyThemeColors } from "../rendering/theme-colors";
import { readWebUIMetadata } from "../metadata/metadata-reader";
import { paintsMoment, readHydration } from "./web-hydration";
import { AttachOutcome, attachWithRetryAsync, LeftToReconnect } from "../transport/attach-retry";
import { readTimeZone } from "../transport/reader-time-zone";
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
import { FieldValidation, ValidationEngine } from "../interactions/validation-engine";
import { ValueBindingEngine } from "../updates/value-binding-engine";
import { ExtensionRegistry } from "../extensions/extension-registry";
import { MenuRowDecorator } from "../items/menu-row-decorator";
import { RowGripDecorator } from "../items/row-grip";
import { observeSize } from "../interactions/element-size";
import { applyIconValue } from "../rendering/icon-value";
import { writeBadgeCount } from "../rendering/web-dom-converters";
import { numberFormatting } from "../rendering/number-format";
import { temporalFormatting } from "../rendering/temporal-format";
import { applyPageCultures } from "../rendering/page-culture";
import { asBrowserReads, isImageSource } from "../rendering/url-safety";
import { ClientStore } from "../state/client-store";
import { CollectionSinkRegistration } from "../updates/collection-sinks";
import { ValueConverterRegistration } from "../extensions/converters";
import { resolveValueHolder, ValueReaderRegistration, ValueReading } from "../extensions/value-readers";
import { nameOfPackageEngine, startEngine } from "./engine-start";
import { exposeGlobalApi } from "./global-api";
import { formatMilliseconds, logDebug, logElapsed, logError, logWarn } from "./logger";
import { WebUIRuntimeOptions } from "./runtime-options";

const DefaultWindowIdStorageKey = "ne.standard.ui.windowId";

// An attach that throws is retried this many times before giving up, waiting this long before each retry.
const AttachRetryDelaysMilliseconds = [500, 1000, 2000];

// How many attaches may run back to back, each asked for while the one before it ran, before the page is given up as lost.
const AttachRunsInARow = 3;

type EngineContext = {
    readonly root: ParentNode;
    readonly dom: DomRegistry;
    readonly propertyPatchEngine: PropertyPatchEngine;
    readonly effects: EffectRegistry;
    readonly validation: FieldValidation;
};

/** Icons as a package draws them on elements it builds itself: an icon value written the way a renderer writes it. */
export type Icons = {
    apply(element: Element, value: unknown): void;
};

/** Badges a package counts on itself, on a badge a renderer drew: the count written as the renderer would have written it. */
export type Badges = {
    writeCount(badge: Element, count: number): void;
};

/** Addresses judged by the framework's own rule, read as the browser reads them, so a package draws a picture from no other. */
export type Urls = {
    isImageSource(address: string): boolean;
    asBrowserReads(address: string): string;
};

/** What a package's engine starts from: a built-in engine's services, plus what it cannot import from its own bundle. */
export type PluginEngineContext = EngineContext & {
    readonly strings: ClientWords;
    readonly observeComponents: typeof observeComponents;
    readonly observeSize: typeof observeSize;
    readonly dialogs: DialogEngine;
    readonly store: ClientStore;
    readonly numbers: typeof numberFormatting;
    readonly temporal: typeof temporalFormatting;
    readonly icons: Icons;
    readonly badges: Badges;
    readonly urls: Urls;
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
    readonly states: typeof componentStates;
    readonly validation: FieldValidation;
    readonly wheel: typeof wheel;
    readonly names: typeof pluginDomNames;
};

export type PluginEngine = (context: PluginEngineContext) => unknown;

/** A core component's property set from a package's client the way a push sets it, where its renderer exposed the property. */
export type PropertyWriting = {
    set(element: Element, propertyName: string, value: unknown): boolean;
};

// Engines needing only the root and the shared services, named for the console if one throws; where their order matters, it says so.
const ComponentEngines: readonly (readonly [name: string, start: (context: EngineContext) => unknown])[] = [
    ["refusal", ({ root }) => startRefusals(root)],
    ["file input", ({ root, validation }) => new FileInputEngine({ root, validation })],
    ["image input", ({ root, validation, propertyPatchEngine }) => new ImageInputEngine({ root, validation, propertyPatchEngine })],
    ["key value action", ({ root, dom, propertyPatchEngine }) => new KeyValueActionEngine({ root, dom, propertyPatchEngine })],
    // Listens in the bubble phase, and every engine with its own Enter or Escape in the capture phase, so theirs runs first.
    ["field keys", ({ root }) => new FieldKeysEngine({ root })],
    ["field box press", ({ root }) => new FieldBoxPressEngine({ root })],
    ["image fallback", ({ root }) => new ImageFallbackEngine({ root })],
    ["radio group sync", ({ root }) => new RadioGroupSyncEngine({ root })],
    ["select interaction", ({ root }) => new SelectInteractionEngine({ root })],
    ["search input", ({ root }) => new SearchInputEngine({ root })],
    ["debounced commit", ({ root }) => new DebouncedCommitEngine({ root })],
    // Only where the stylesheet cannot size a growing text area to its text on its own.
    ["text area grow", ({ root, propertyPatchEngine }) => sizesFieldsToContent() ? undefined : new TextAreaGrowEngine({ root, propertyPatchEngine })],
    ["items selection", ({ root }) => new ItemsSelectionEngine({ root })],
    ["range value", ({ root, propertyPatchEngine, dom }) => new RangeValueEngine({ root, propertyPatchEngine, dom })],
    ["color input", ({ root, propertyPatchEngine, dom }) => new ColorInputEngine({ root, propertyPatchEngine, dom })],
    ["temporal picker", ({ root, propertyPatchEngine }) => new TemporalPickerEngine({ root, propertyPatchEngine })],
    ["theme switcher", ({ root, effects, dom }) => new ThemeSwitcherEngine({ root, effects, dom })],
    ["language switcher", ({ root, effects, dom }) => new LanguageSwitcherEngine({ root, effects, dom })],
    ["time segment", ({ root, propertyPatchEngine }) => new TimeSegmentEngine({ root, propertyPatchEngine })],
    ["timestamp", ({ root, propertyPatchEngine }) => new TimestampEngine({ root, propertyPatchEngine })],
    ["context menu", ({ root }) => new ContextMenuEngine({ root })],
    ["split button", ({ root }) => new SplitButtonEngine({ root })],
    ["toggle button", ({ root }) => new ToggleButtonEngine({ root })],
    ["button group", ({ root }) => new ButtonGroupEngine({ root })],
    ["menu", ({ root }) => new MenuEngine({ root })],
    // Before the group engine: it restores a menu's fold, and groups are opened against the shape that leaves.
    ["collapsible", ({ root }) => new CollapsibleEngine({ root })],
    ["menu group", ({ root }) => new MenuGroupEngine({ root })],
    ["menu search", ({ root }) => new MenuSearchEngine({ root })],
    ["side drawer", ({ root }) => new SideDrawerEngine({ root })],
    ["grid splitter", ({ root }) => new GridSplitterEngine({ root })],
    ["accordion", ({ root }) => new AccordionEngine({ root })],
    ["tabs", ({ root }) => new TabsEngine({ root })],
    ["tabs view", ({ root, effects }) => new TabsViewEngine({ root, effects })],
    ["command bar", ({ root }) => new CommandBarEngine({ root })],
    ["breadcrumbs", ({ root }) => new BreadcrumbsEngine({ root })],
    ["scroll anchor", ({ root }) => new ScrollAnchorEngine({ root })],
    ["surface press", ({ root }) => new SurfacePressEngine({ root })],
    ["scroll group", ({ root }) => new ScrollGroupEngine({ root })],
    ["flyout interaction", ({ root }) => new FlyoutInteractionEngine({ root })],
    ["text fold", ({ root }) => new TextFoldEngine({ root })],
    ["tooltip", ({ root }) => startTooltips(root)],
    // A theme flag, not a per-page choice: off the flag, the whole engine never starts.
    ["press ripple", ({ root }) => document.documentElement.hasAttribute(PressRippleAttribute) ? new PressRippleEngine({ root }) : undefined]
];

export class WebUIRuntime {
    public readonly windowId: string;

    private readonly options: WebUIRuntimeOptions;
    private readonly root: ParentNode;
    // The language the page's culture packs were last written in: the render's, until a switch writes them again.
    private culturesLanguage = document.documentElement.lang;
    private readonly metadata = new MetadataIndex(readWebUIMetadata());
    private readonly hydration = readHydration();
    // Writes again the page's words that hold a moment, which the page writes in the reader's zone.
    private readonly rewriteMoments: () => void;
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

    // An attach asked for while one runs: that one may have started before the reason did, so it runs again once it ends.
    private reattachRequested = false;

    private connectionLost = false;

    // The change sets still waiting on a staged value, in order; null while every one has been applied.
    private inbound: Promise<void> | null = null;

    // A package's engine registered before hydration, started once it is done; null once the page is hydrated.
    private enginesAwaitingHydration: PluginEngine[] | null = [];

    // Bumped by every language switch, so one that began later wins over one still waiting on the server.
    private languageSwitches = 0;

    // Counts the colour changes asked for, so an answer arriving after a later one's is dropped.
    private themeColorChanges = 0;

    // Null only when its start threw: a number field is then read as the text it shows.
    private numberInputs: NumberInputEngine | null = null;

    public constructor(options: WebUIRuntimeOptions = {}) {
        this.options = options;
        this.root = options.root ?? document;
        this.windowId = getOrCreateWindowId(options.windowIdStorageKey ?? DefaultWindowIdStorageKey);
        this.dom = new DomRegistry(this.root);

        // Before any engine: the first thing one draws may already need a word.
        clientStrings.load(this.root);
        clientStrings.setLanguage(document.documentElement.lang);

        if (options.strings !== undefined)
            clientStrings.register(options.strings);

        // Every change set, the hydration's first, waits for the table, so a value arrives in its words rather than as its key.
        this.gateInbound(this.hydration?.words === null || this.hydration?.words === undefined ? null : clientStrings.loadTableAsync(this.hydration.words.href));

        this.extensions = new ExtensionRegistry(options.converters, options.eventDefinitions, options.domOperations, options.valueReaders);
        this.extensions.registerRowDecorator(MenuRowDecorator);
        this.extensions.registerRowDecorator(RowGripDecorator);
        const addressResolver = new AddressResolver(this.dom, this.metadata);
        const operations = this.extensions.operations;
        const propertyState = new PropertyStateStore();
        const propertyPatchEngine = new PropertyPatchEngine(addressResolver, operations, this.extensions, propertyState);
        this.reactiveSources = new ReactiveSourceRegistry(propertyPatchEngine, { root: this.root, valueReaders: this.extensions.valueReaders });
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
            root: this.root,
            effects: this.effects,
            dom: this.dom,
            metadata: this.metadata,
            valueReaders: this.extensions.valueReaders,
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

        // First among the listeners, before any engine's: the page's words are written again before a package hears the change.
        clientStrings.onChange(() => this.rewriteWords(propertyPatchEngine, itemsRenderer));

        // A relative moment in words is kept current as a relative timestamp is.
        this.rewriteMoments = () => this.rewriteWords(propertyPatchEngine, itemsRenderer, true);
        clientStrings.onMomentTick(this.rewriteMoments);

        // Everything that can put a host out of step with its own rules goes through this one watcher.
        new ItemsRuleWatcher({
            root: this.root,
            metadata: this.metadata,
            templates: itemsTemplates,
            renderer: itemsRenderer,
            state: propertyState,
            propertyPatchEngine,
            reactiveSources: this.reactiveSources,
            virtualization: this.virtualization
        });

        // Every answer's changes come through here in the order the messages arrived, pushes' too (inbound-order.ts).
        this.transport = new SignalRTransport(this.windowId, (changes, before) => this.applyChanges(changes, before), options.signalR);
        this.dispatcher = new CommandDispatcher(this.transport);

        // A key the table lacks is asked about once per language — a translator that cannot list every word, or a missing word reported.
        clientStrings.setAsker((language, keys) => this.transport.translateAsync(language, keys));

        // Raised on the page, it asks the server where the words are, which stores the language on the session; pushed, it names them.
        this.effects.register(ClientEffectKinds.SetLanguage, context => {
            const effect = context.effect as SetLanguageClientEffect;
            const language = effect.language;

            if (typeof language !== "string" || language.trim().length === 0) {
                logWarn("set language effect carries no language.", context.effect);
                return;
            }

            const href = typeof effect.href === "string" && effect.href.length > 0 ? effect.href : null;

            void this.switchLanguageAsync(language, href).catch(error => logWarn("switching the page's language failed.", error));
        });

        // Raised or pushed alike, the session is told the colours and answers the stylesheet they make: the one a render of it carries.
        this.effects.register(ClientEffectKinds.SetThemeColors, context => {
            const effect = context.effect as SetThemeColorsClientEffect;
            const change = ++this.themeColorChanges;

            // Pushed for a session that holds them already, the stylesheet comes named: telling the session would write them again.
            if (typeof effect.css === "string") {
                applyThemeColors(document.head, effect.css);
                return;
            }

            void this.transport.setThemeColorsAsync(effect.colors ?? null)
                .then(css => {
                    if (change === this.themeColorChanges)
                        applyThemeColors(document.head, css);
                })
                .catch(error => logWarn("applying the reader's colours failed.", error));
        });

        // Value sync is independent of the event pipeline: a component with both does two round-trips on one "change".
        const valueChangeDispatcher = new ValueChangeDispatcher(this.transport);
        valueBinding = new ValueBindingEngine({
            root: this.root,
            metadata: this.metadata,
            dom: this.dom,
            dispatcher: valueChangeDispatcher,
            valueReaders: this.extensions.valueReaders,
            recordSent: (reference, dynamicParameters, value) => propertyPatchEngine.recordValue(reference, dynamicParameters, value)
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

        this.engineContext = { root: this.root, dom: this.dom, propertyPatchEngine, effects: this.effects, validation: validationEngine };

        for (const [name, start] of ComponentEngines)
            startEngine(name, start, this.engineContext);

        // Apart from the list: the plugin surface reads a number field's invariant value off this engine.
        startEngine("number input", ({ root, propertyPatchEngine }) => {
            this.numberInputs = new NumberInputEngine({ root, propertyPatchEngine });
        }, this.engineContext);

        // Apart from the list: a tree's filter and sort run in its own walk, which needs the rules and the rows' values.
        startEngine("tree", ({ root, effects }) => new TreeEngine({ root, effects, rules: { metadata: this.metadata, state: propertyState, renderer: itemsRenderer } }), this.engineContext);

        // Apart from the list: whether a sort orders a host is the rules', and a virtualized host's order its values'.
        startEngine("items reorder", ({ root }) => new ItemsReorderEngine({ root, services: { metadata: this.metadata, state: propertyState, keysOf: host => this.virtualization.keysOf(host) } }), this.engineContext);

        this.eventPipeline = new EventPipeline({
            root: this.root,
            metadata: this.metadata,
            dom: this.dom,
            dispatcher: this.dispatcher,
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

        // After them, since each is added bare: the tab menu's entry names its own keys, the entry and the tab, as a package's event does.
        this.eventPipeline.addEvent(TabMenuEntryEvent.name, TabMenuEntryEvent.registration);
        // A row's move carries the index it takes after its keys; a tree's carries none and keeps its chain.
        this.eventPipeline.addEvent(ItemMoveEvent.name, ItemMoveEvent.registration);

        // Held by name, since a package's chooser reaches it through the engine context.
        this.tables = new TableColumnsEngine({ root: this.root });

        // After the transport, since asking for a window is an invoke.
        this.windows = new ItemsWindowEngine({
            root: this.root,
            requestWindow: request => this.transport.requestItemWindowAsync(request)
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
            urls: { isImageSource, asBrowserReads },
            values: {
                read: element => this.readPluginValue(element),
                hold: element => valueBinding?.hold(element),
                release: element => {
                    if (valueBinding?.release(element) === true)
                        propertyPatchEngine.restoreBoundValue(element, this.dom.resolveNearestComponent(element, () => true)?.dynamicParameters ?? []);
                },
                write: (element, value) => propertyPatchEngine.writeBoundValue(element, value)
            },
            properties: {
                set: (element, propertyName, value) => {
                    // By markup, not the page's index: a part may be set before it is on the page, or drawn several times from one template.
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
            roving: rovingFocus,
            states: componentStates,
            validation: validationEngine,
            wheel,
            names: pluginDomNames
        };

        this.transport.onChanges(changes => void this.applyChanges(changes));

        // An invoke's returned copy carries no effects, so nothing applies twice; a background command's pushed result settles its dispatch.
        this.transport.onCommandResult(result => {
            // Applied here in arrival order: through the dispatch they would land behind a later push. The dispatch settles without them.
            const { changes, ...rest } = result;

            // The effects after the changes, a staged value among them: an effect acts on the page those changes produced.
            void Promise.resolve(this.applyChanges(changes)).then(() => {
                if (this.dispatcher.settle(rest))
                    return;

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

            // A result still to come would be pushed to the connection that just dropped, which the new one never hears.
            this.dispatcher.release(new Error("the connection to the server dropped before the command answered.", { cause: error }));
        });
        // A failure here is logged once, by the transport's own onReconnected wrapper.
        this.transport.onReconnected(async () => {
            logDebug("SignalR reconnected. Reattaching runtime.");
            await this.attachAsync();
        });
        // Once the automatic reconnect has given up, or the connection was stopped: either way it does not come back.
        this.transport.onClosed(error => this.loseConnection(error ?? new Error("the connection to the server closed.")));
    }

    /** Holds every change set until `ready` settles — the page's words — and lets them through once it has, failed or not. */
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

    /** A value as a package reads it: what the binding would send, so a number field answers its invariant text, not its culture's. */
    private readPluginValue(element: Element): unknown {
        const holder = resolveValueHolder(element);

        if (holder === null)
            return null;

        return this.numberInputs?.readValue(holder) ?? this.extensions.valueReaders.read(holder);
    }

    /** Switches the page's language in place: the session told unless the server named the words, the table fetched, every word rewritten. */
    private async switchLanguageAsync(language: string, stored: string | null): Promise<void> {
        // Weighed against the switch under way, not against the language still shown.
        if (language === clientStrings.requestedLanguage)
            return;

        const switchNumber = ++this.languageSwitches;
        let href = stored;
        let target = language;

        clientStrings.setRequested(language);

        try {
            if (href === null) {
                try {
                    const answer = await this.transport.setLanguageAsync(language);

                    href = answer.href;
                    target = answer.language;
                }
                catch (error) {
                    // The page still switches for as long as it lives; the next page renders in the session's language.
                    logWarn("the session was not told the page's language.", { language, error });
                }
            }

            // A later switch wins, one back to the language shown included, which fetches nothing.
            if (switchNumber !== this.languageSwitches || target === clientStrings.language || !await clientStrings.switchToAsync(target, href))
                return;

            clientStrings.notifyChanged();
        }
        finally {
            if (switchNumber === this.languageSwitches)
                clientStrings.setRequested(null);
        }
    }

    /**
     * Writes the page's words again in the table's language — marks, rendered values, sent values, built rows — then the title and
     * lang; with `momentsOnly`, only the words holding a moment.
     */
    private rewriteWords(propertyPatchEngine: PropertyPatchEngine, itemsRenderer: ItemsTemplateRenderer, momentsOnly = false): void {
        const started = performance.now();

        // A package may have put parts on the page meanwhile (a grid's open detail) that the index has not seen.
        this.dom.invalidate();

        // First: the packs are what a number field and a package's cells draw again by, as they hear the change.
        if (clientStrings.language !== this.culturesLanguage) {
            this.culturesLanguage = clientStrings.language;
            forEachSubtree(this.root, subtree => applyPageCultures(subtree, clientStrings.number, clientStrings.temporal));
        }

        const only = momentsOnly ? holdsMoment : undefined;

        // Later over earlier: a row's own words last.
        clientStrings.rewriteMarks(this.root, momentsOnly);
        this.rewriteStaticWords(propertyPatchEngine, only);
        propertyPatchEngine.rewriteWords(only);
        itemsRenderer.rewriteRowWords(this.root, only);

        const title = this.hydration?.title ?? null;

        if (title !== null && (only === undefined || only(title))) {
            const words = String(clientStrings.resolve(title, true));

            if (document.title !== words)
                document.title = words;
        }

        if (clientStrings.language.length > 0 && document.documentElement.lang !== clientStrings.language)
            document.documentElement.lang = clientStrings.language;

        logElapsed(momentsOnly ? "page's moments written again" : "page's words written again", started, { language: clientStrings.language });
    }

    /** The values the page was rendered with — only those `only` names, where given — on every instance and inside the templates rows are built from. */
    private rewriteStaticWords(propertyPatchEngine: PropertyPatchEngine, only?: (value: unknown) => boolean): void {
        const words = only === undefined ? this.metadata.getWords() : this.metadata.getWords().filter(word => only(word.key));

        if (words.length === 0)
            return;

        const templates: ParentNode[] = [];

        forEachSubtree(this.root, subtree => {
            if (subtree !== this.root)
                templates.push(subtree);
        });

        for (const word of words) {
            const componentId = getIdValue(word.componentId);
            const reference = { componentId, propertyId: word.propertyId };
            const parameters = word.dynamicParameters ?? [];

            for (const component of this.findWordInstances(componentId, parameters))
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
    private findWordInstances(componentId: number, parameters: readonly unknown[]): Element[] {
        // A word with no row keys is every copy's: a package's clones of the component as well as the one the server drew.
        if (parameters.length === 0)
            return this.dom.findEveryComponent(componentId);

        const exact = this.dom.findAllComponents(componentId, parameters);

        if (exact.length > 0)
            return exact;

        // A word inside a template names only its inner rows' keys (a cell editor's option): it is that option in every row's copy.
        return this.dom.findAllComponents(componentId, []).filter(component => endsWithDynamicParameters(component, parameters));
    }

    /** The connection is gone for good: calls fail at once and a reload is offered, as the page never reconnects itself; said once. */
    private loseConnection(reason: unknown): void {
        if (this.connectionLost)
            return;

        this.connectionLost = true;
        logError("the connection to the server is lost; the page offers a reload.", reason);

        const lost = new Error("the connection to the server is lost; reload the page.", { cause: reason });

        this.transport.close(lost);
        this.dispatcher.release(lost);
        this.notifications.show({
            message: clientStrings.text("ui.connection.lost"),
            severity: "danger",
            sticky: true,
            action: { label: clientStrings.text("ui.connection.reload"), run: () => window.location.reload() }
        });
    }

    /** Reloads a page rendered from another compile of its view, once: refused again (two servers of two builds), it is left, logged. */
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

        // A package's module registers as it runs, after this one; every module has run by DOMContentLoaded, so hydration waits for it.
        await documentParsedAsync();

        // Opened while the page hydrates: the hydration waits for the page's words, and the connection need not wait for either.
        const connected = this.connectAsync();

        // Before the attach: the markup is already the finished page, and this takes the client's copy of it.
        await this.hydrateAsync();
        this.startEnginesAwaitingHydration();

        if (!await connected)
            return;

        await this.attachAsync();

        // performance.now() counts from the navigation's start, so this is how long the reader waited for a page that answers.
        if (!this.connectionLost)
            logDebug(`page live ${formatMilliseconds(performance.now())} after the navigation started.`);
    }

    /** Opens the connection; the automatic reconnect covers a connection that was open, and one that never opened is lost from the start. */
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

    /** Takes the client's copy of the values the page was rendered with, changing nothing the reader sees. */
    private async hydrateAsync(): Promise<void> {
        if (this.hydration === null)
            return;

        const started = performance.now();
        const changes = this.hydration.changes;

        this.dom.rebuild();

        // Before the change set: its reconcile keeps a row only if it can read what the row holds.
        this.updateProcessor.registerServerRenderedItems(changes);
        await this.applyChanges(changes);
        this.updateProcessor.initializeItemsHosts();

        // The server could paint a moment in words only in UTC; the page writes it in the reader's zone, as it does a timestamp.
        if (this.holdsPaintedMoment())
            this.rewriteMoments();

        logElapsed("runtime hydrated from the page", started, { pageId: this.hydration.pageId, updates: changes?.updates?.length ?? 0 });
    }

    /** Whether the render painted a moment in words: in a mark, a rendered value, a row the server drew or the title. */
    private holdsPaintedMoment(): boolean {
        return marksMoment(this.root)
            || paintsMoment(this.hydration)
            || this.metadata.getWords().some(word => holdsMoment(word.key))
            || holdsMoment(this.metadata.metadata.itemValues);
    }

    private startEnginesAwaitingHydration(): void {
        const engines = this.enginesAwaitingHydration ?? [];

        this.enginesAwaitingHydration = null;

        for (const start of engines)
            startEngine(nameOfPackageEngine(start), start, this.pluginContext);
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

    /** Starts a package's engine after every built-in one; one registered before hydration starts after it, reading the page hydrated. */
    public addEngine(start: PluginEngine): void {
        if (this.enginesAwaitingHydration !== null) {
            this.enginesAwaitingHydration.push(start);
            return;
        }

        startEngine(nameOfPackageEngine(start), start, this.pluginContext);
    }

    /**
     * Applies a change set; one naming a value staged beside the hub waits for its fetch, and every later set waits in turn, in order.
     * `before` runs in the set's turn: a value's answer lets its field go only once what arrived ahead of it (an attach's snapshot) is in.
     */
    private applyChanges(changes: ServerChangeSet | undefined, before?: () => void): void | Promise<void> {
        if (this.inbound === null && !hasStagedValues(changes)) {
            before?.();
            this.applyNow(changes);
            return;
        }

        const applied = (this.inbound ?? Promise.resolve())
            .then(() => {
                before?.();

                return fetchStagedValuesAsync(changes);
            })
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

    // Bounded: an attach whose own initial changes keep failing asks for another every time, and would otherwise never stop.
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

    /** Whether the runtime ended attached; false when the attach gave up or the page is reloading. */
    private async attachCoreAsync(): Promise<boolean> {
        if (this.connectionLost)
            return false;

        // What followed the attach's snapshot may be pushed before the answer lands: every change set from here waits for the snapshot.
        const hold = this.holdInbound();
        const started = performance.now();

        try {
            const result = await this.attachWithRetryAsync();
            const answered = performance.now();

            if (result === null) {
                this.loseConnection(new Error("attaching the runtime failed after retrying."));
                return false;
            }

            // The connection dropped again meanwhile: its reconnect attaches, and the page is not given up.
            if (result === LeftToReconnect)
                return false;

            if (result.reload === true) {
                this.reloadForView(this.hydration?.view ?? "");
                return false;
            }

            forgetReloadedView();
            this.dom.rebuild();
            this.updateProcessor.registerServerRenderedItems(result.initialChanges);

            // Behind whatever was already queued, and applied here rather than through the queue the hold closes.
            await hold.previous;
            await this.applyAttachChangesAsync(result.initialChanges);

            this.updateProcessor.initializeItemsHosts();
            this.windows.start();

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

    /** Closes the inbound queue until `release`: change sets arriving meanwhile wait; `previous` is what was queued before. */
    private holdInbound(): { readonly previous: Promise<void>; readonly release: () => void } {
        const previous = this.inbound ?? Promise.resolve();
        let release: () => void = () => { };
        const held = new Promise<void>(resolve => {
            release = resolve;
        });
        const chained = previous.then(() => held);

        this.inbound = chained;
        void chained.then(() => {
            if (this.inbound === chained)
                this.inbound = null;
        });

        return { previous, release };
    }

    /** The snapshot's changes, a staged value among them fetched first; one that cannot be fetched asks for another attach. */
    private async applyAttachChangesAsync(changes: ServerChangeSet | undefined): Promise<void> {
        try {
            this.applyNow(hasStagedValues(changes) ? await fetchStagedValuesAsync(changes) : changes);
        }
        catch (error) {
            logError("a staged value of the attach could not be fetched; the page attaches again.", error);
            this.reattachRequested = true;
        }
    }

    /** Retries a failed attach with a growing backoff, so a hub call throwing on a live socket needs no reload; null once all failed. */
    private async attachWithRetryAsync(): Promise<AttachOutcome<WebUIAttachResult>> {
        // A page standing in for the one asked for (a sign-in or error page at the address that led there) attaches as itself.
        const standIn = readStandInNavigation();
        const request: WebUIAttachRequest = {
            clientWindowId: this.windowId,
            route: standIn?.route ?? window.location.pathname,
            // Presenting the runtime the render prepared claims it rather than building a second one.
            pageId: this.hydration?.pageId ?? null,
            view: this.hydration?.view ?? null,
            parameters: standIn !== null ? standIn.parameters : readQueryParameters(window.location.search),
            timeZone: readTimeZone()
        };

        return await attachWithRetryAsync(() => this.transport.attachAsync(request), () => this.transport.isReconnecting, AttachRetryDelaysMilliseconds, delay);
    }
}

export async function startWebUIAsync(options: WebUIRuntimeOptions = {}): Promise<WebUIRuntime> {
    const started = performance.now();
    const runtime = new WebUIRuntime(options);

    // Reading the page's metadata and starting every engine: the whole of what the client does before it looks at the page.
    logElapsed("runtime built", started);

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

/** The navigation a page standing in for another was rendered for, off the shell's root; null on a page that is what was asked for. */
function readStandInNavigation(): { route: string; parameters: Record<string, unknown> | null } | null {
    const text = document.querySelector("[data-ui-root]")?.getAttribute("data-ui-navigation");

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

function readQueryParameters(search: string): Record<string, unknown> | null {
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
