import {
    ComponentSelector, OverlayScrollbarsAttribute, pluginDomNames, PressRippleAttribute
} from "../addressing/dom-attributes";
import { DomRegistry, ownDescendants, readComponentId } from "../addressing/dom-registry";
import { EffectRegistry } from "../effects/effect-registry";
import { EventRegistration } from "../events/event-descriptor";
import { EventPipeline } from "../events/event-pipeline";
import { ValueReading } from "../extensions/value-readers";
import { AccordionEngine } from "../interactions/accordion-engine";
import { ActionBarEngine } from "../interactions/action-bar-engine";
import { BreadcrumbsEngine } from "../interactions/breadcrumbs-engine";
import { ButtonGroupEngine } from "../interactions/button-group-engine";
import { pluginShortcutWords } from "../interactions/caret-fields";
import { CollapsibleEngine } from "../interactions/collapsible-engine";
import { ColorInputEngine } from "../interactions/color-input-engine";
import { CommandBarEngine } from "../interactions/command-bar-engine";
import { CommitGate } from "../interactions/commit-gate";
import { clearLaterMenus, ContextMenuEngine, setLaterMenus } from "../interactions/context-menu-engine";
import { DebouncedCommitEngine } from "../interactions/debounced-commit-engine";
import { DialogEngine } from "../interactions/dialog-engine";
import { observeComponents } from "../interactions/dom-mutations";
import { observeSize } from "../interactions/element-size";
import { FieldBoxPressEngine } from "../interactions/field-box-press-engine";
import { FieldEnterEvent, FieldKeysEngine } from "../interactions/field-keys-engine";
import { FileInputEngine } from "../interactions/file-input-engine";
import { FileTileEngine } from "../interactions/file-tile-engine";
import { createFileUploads, FileUploads } from "../interactions/file-upload";
import { FlyoutInteractionEngine } from "../interactions/flyout-interaction-engine";
import { GridSplitterEngine } from "../interactions/grid-splitter-engine";
import { ImageFallbackEngine } from "../interactions/image-fallback-engine";
import { ImageInputEngine } from "../interactions/image-input-engine";
import { InlineRenames, openInlineRename } from "../interactions/inline-rename";
import { InteractionEngine } from "../interactions/interaction-engine";
import { InteractionIndex } from "../interactions/interaction-index";
import { componentStates } from "../interactions/interactive-state";
import { DropEventPrefix, ItemDragEngine, itemDropEvent } from "../interactions/item-drag-engine";
import { itemMoveEvent, ItemsReorderEngine } from "../interactions/items-reorder-engine";
import { ItemsSelectionEngine } from "../interactions/items-selection-engine";
import type { HeldRows } from "../interactions/items-selection-engine";
import { KeyValueActionEngine } from "../interactions/key-value-action-engine";
import { LanguageSwitcherEngine } from "../interactions/language-switcher-engine";
import { MenuEngine } from "../interactions/menu-engine";
import { MenuGroupEngine } from "../interactions/menu-group-engine";
import { MenuSearchEngine } from "../interactions/menu-search-engine";
import { MultiSelectCheckboxesEngine } from "../interactions/multi-select-checkboxes-engine";
import { NumberInputEngine } from "../interactions/number-input-engine";
import { OverlayScrollbarEngine } from "../interactions/overlay-scrollbar-engine";
import { PagerEngine } from "../interactions/pager-engine";
import { PaneContainerEngine } from "../interactions/pane-container-engine";
import { pluginFocus } from "../interactions/popup-focus";
import { pluginTypeAhead } from "../interactions/popup-list";
import { createPopups, Popups } from "../interactions/popup-service";
import { PressRippleEngine } from "../interactions/press-ripple-engine";
import { RadioGroupSyncEngine } from "../interactions/radio-group-sync-engine";
import { RangeValueEngine } from "../interactions/range-value-engine";
import { startRefusals } from "../interactions/refusal-engine";
import { rovingFocus } from "../interactions/roving-focus";
import { ItemSelection, itemSelection } from "../interactions/row-selection";
import { ScreenKeyboardEngine } from "../interactions/screen-keyboard";
import { ScrollAnchorEngine } from "../interactions/scroll-anchor-engine";
import { ScrollGroupEngine } from "../interactions/scroll-group-engine";
import { SearchEvent, SearchInputEngine } from "../interactions/search-input-engine";
import { SelectInteractionEngine } from "../interactions/select-interaction-engine";
import { ShortcutEngine, viewShortcutsOf } from "../interactions/shortcut-engine";
import { SideDrawerEngine } from "../interactions/side-drawer-engine";
import { SplitButtonEngine } from "../interactions/split-button-engine";
import { StepsEngine } from "../interactions/steps-engine";
import { SurfacePressEngine } from "../interactions/surface-press-engine";
import { TableColumns, TableColumnsEngine } from "../interactions/table-columns-engine";
import { TabsEngine } from "../interactions/tabs-engine";
import { ItemMenuEntryEvent, tabPinEvent, TabsViewEngine } from "../interactions/tabs-view-engine";
import { TemporalPickerEngine } from "../interactions/temporal-picker-engine";
import { sizesFieldsToContent, TextAreaGrowEngine } from "../interactions/text-area-grow-engine";
import { TextFoldEngine } from "../interactions/text-fold-engine";
import { TextSelectionEngine } from "../interactions/text-selection-engine";
import { TextTriggerEngine, TriggerClickEvent, TriggerSearchEvent, TriggerSelectEvent } from "../interactions/text-trigger-engine";
import { ThemeSwitcherEngine } from "../interactions/theme-switcher-engine";
import { TimeSegmentEngine } from "../interactions/time-segment-engine";
import { TimestampEngine } from "../interactions/timestamp-engine";
import { ToggleButtonEngine } from "../interactions/toggle-button-engine";
import { startTooltips, Tooltips, tooltips } from "../interactions/tooltip-engine";
import { TreeEngine, TreeUnfoldEvent } from "../interactions/tree-engine";
import { uploadsInFlight } from "../interactions/uploads-in-flight";
import { EntryValidation, FieldValidation, RuleJudging, ShownValueValidation, ValidationEngine } from "../interactions/validation-engine";
import { isRefusedValue } from "../interactions/validation-words";
import { wheel } from "../interactions/wheel-notches";
import { WindowFootEngine } from "../interactions/window-foot";
import { setComponentItems } from "../items/component-items-writer";
import { createItemRows, ItemRows } from "../items/item-rows";
import { compareItems, itemMatchesFilters } from "../items/items-filter-sort";
import { ItemsRuleWatcher } from "../items/items-rule-watcher";
import { ItemsTemplateRegistry } from "../items/items-template-registry";
import { ItemsTemplateRenderer } from "../items/items-template-renderer";
import { ItemsVirtualizationEngine } from "../items/items-virtualization-engine";
import { ItemsWindowEngine, ItemWindows } from "../items/items-window-engine";
import { RowMenus } from "../items/row-menus";
import { VisibleKeyEngine } from "../items/visible-key-engine";
import { logWarn } from "../metadata/logger";
import { MetadataIndex } from "../metadata/metadata-index";
import { clientStrings, ClientWords } from "../rendering/client-strings";
import { applyIconValue } from "../rendering/icon-value";
import { numberFormatting } from "../rendering/number-format";
import { seriesColors } from "../rendering/series-colors";
import { temporalFormatting } from "../rendering/temporal-format";
import { TierClassEngine } from "../rendering/tier-class";
import { asBrowserReads, isExternalLink, isImageSource, isSafeLink } from "../rendering/url-safety";
import { writeBadgeCount } from "../rendering/web-dom-converters";
import { ClientStore } from "../state/client-store";
import { PropertyStateStore } from "../state/property-state-store";
import { CommandDispatcher } from "../transport/command-dispatcher";
import { SignalRTransport } from "../transport/signalr-transport";
import { DomOperationRegistry } from "../updates/dom-operation-registry";
import { PropertyPatchEngine } from "../updates/property-patch-engine";
import { ReactiveSourceRegistry } from "../updates/reactive-source-registry";
import { UpdateProcessor } from "../updates/update-processor";
import { ValueBindingEngine } from "../updates/value-binding-engine";
import { registerRuntimeCleanup } from "./cleanup-scope";
import { EngineDisposable, startEngine } from "./engine-start";
import { ExtensionRegistry } from "./extension-registry";
import { FailureNotice } from "./failure-notice";

export type EngineContext = {
    readonly root: ParentNode;
    readonly dom: DomRegistry;
    readonly propertyPatchEngine: PropertyPatchEngine;
    readonly effects: EffectRegistry;
    readonly validation: FieldValidation & EntryValidation & ShownValueValidation;
    readonly dialogs: DialogEngine;
    /** A virtualized host's rows past the drawn ones, as the row keyboard walks them. */
    readonly heldRows: HeldRows;
};

/** Icons as a package draws them on elements it builds itself: an icon value written the way a renderer writes it. */
export type Icons = {
    apply(element: Element, value: unknown): void;
};

/** Badges a package counts on itself, on a badge a renderer drew: the count written as the renderer would have written it. */
export type Badges = {
    writeCount(badge: Element, count: number): void;
};

/** Addresses judged by the framework's own rule, read as the browser reads them, so a package draws a picture or a link by no other. */
export type Urls = {
    isImageSource(address: string): boolean;
    asBrowserReads(address: string): string;
    isSafeLink(address: string): boolean;
    isExternalLink(address: string): boolean;
};

/** What a package's engine starts from: a built-in engine's services, plus what it cannot import from its own bundle. */
export type PluginEngineContext = EngineContext & {
    readonly strings: ClientWords;
    readonly observeComponents: typeof observeComponents;
    readonly observeSize: typeof observeSize;
    readonly ownDescendants: typeof ownDescendants;
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
    readonly typeAhead: typeof pluginTypeAhead;
    readonly focus: typeof pluginFocus;
    readonly states: typeof componentStates;
    readonly validation: FieldValidation & RuleJudging;
    readonly wheel: typeof wheel;
    readonly colors: typeof seriesColors;
    readonly shortcuts: typeof pluginShortcutWords;
    readonly names: typeof pluginDomNames;
};

export type PluginEngine = (context: PluginEngineContext) => EngineDisposable | void;

/** A core component's property set from a package's client the way a push sets it, where its renderer exposed the property. */
export type PropertyWriting = {
    set(element: Element, propertyName: string, value: unknown): boolean;
};

// Engines needing only the root and the shared services, named for the console if one throws; where their order matters, it says so.
const ComponentEngines: readonly (readonly [name: string, start: (context: EngineContext) => unknown])[] = [
    ["refusal", ({ root }) => startRefusals(root)],
    ["file input", ({ root, validation }) => new FileInputEngine({ root, validation })],
    ["image input", ({ root, validation, propertyPatchEngine, dialogs }) => new ImageInputEngine({ root, validation, propertyPatchEngine, dialogs })],
    ["key value action", ({ root, dom, propertyPatchEngine, validation }) => new KeyValueActionEngine({ root, dom, propertyPatchEngine, validation })],
    // Listens in the capture phase ahead of FieldKeysEngine so trigger keys claim Enter, Tab, Backspace and Delete first.
    ["text trigger", ({ root, propertyPatchEngine }) => new TextTriggerEngine({ root, propertyPatchEngine })],
    ["field keys", ({ root, propertyPatchEngine }) => new FieldKeysEngine({ root, propertyPatchEngine })],
    ["field box press", ({ root }) => new FieldBoxPressEngine({ root })],
    // Ahead of the engines reading a class it sets (an orientation, a size, a list's layout), so they read the width's.
    ["tier classes", ({ root }) => new TierClassEngine({ root })],
    ["image fallback", ({ root }) => new ImageFallbackEngine({ root })],
    ["radio group sync", ({ root }) => new RadioGroupSyncEngine({ root })],
    ["multi-select checkboxes", ({ root }) => new MultiSelectCheckboxesEngine({ root })],
    ["select interaction", ({ root, validation }) => new SelectInteractionEngine({ root, validation })],
    ["search input", ({ root }) => new SearchInputEngine({ root })],
    ["debounced commit", ({ root }) => new DebouncedCommitEngine({ root })],
    // Only where the stylesheet cannot size a growing text area to its text on its own.
    ["text area grow", ({ root, propertyPatchEngine }) => sizesFieldsToContent() ? undefined : new TextAreaGrowEngine({ root, propertyPatchEngine })],
    ["items selection", ({ root, heldRows }) => new ItemsSelectionEngine({ root, rows: heldRows })],
    ["range value", ({ root, propertyPatchEngine }) => new RangeValueEngine({ root, propertyPatchEngine })],
    ["color input", ({ root, propertyPatchEngine }) => new ColorInputEngine({ root, propertyPatchEngine })],
    ["temporal picker", ({ root, propertyPatchEngine, validation }) => new TemporalPickerEngine({ root, propertyPatchEngine, validation })],
    ["theme switcher", ({ root, effects, dom }) => new ThemeSwitcherEngine({ root, effects, dom })],
    ["language switcher", ({ root, effects, dom }) => new LanguageSwitcherEngine({ root, effects, dom })],
    ["time segment", ({ root, propertyPatchEngine }) => new TimeSegmentEngine({ root, propertyPatchEngine })],
    ["timestamp", ({ root, propertyPatchEngine }) => new TimestampEngine({ root, propertyPatchEngine })],
    ["file tile", ({ root, propertyPatchEngine }) => new FileTileEngine({ root, propertyPatchEngine })],
    ["context menu", ({ root, dom }) => new ContextMenuEngine({ root, dom })],
    ["split button", ({ root }) => new SplitButtonEngine({ root })],
    ["toggle button", ({ root }) => new ToggleButtonEngine({ root })],
    ["button group", ({ root }) => new ButtonGroupEngine({ root })],
    ["menu", ({ root }) => new MenuEngine({ root })],
    ["action bar", ({ root, dom }) => new ActionBarEngine({ root, dom })],
    // Before the group engine: it restores a menu's fold, and groups are opened against the shape that leaves.
    ["collapsible", ({ root }) => new CollapsibleEngine({ root })],
    ["menu group", ({ root }) => new MenuGroupEngine({ root })],
    ["menu search", ({ root }) => new MenuSearchEngine({ root })],
    ["side drawer", ({ root }) => new SideDrawerEngine({ root })],
    ["screen keyboard", () => new ScreenKeyboardEngine()],
    ["window foot", ({ root }) => new WindowFootEngine({ root })],
    ["grid splitter", ({ root }) => new GridSplitterEngine({ root })],
    ["pane container", ({ root }) => new PaneContainerEngine({ root })],
    ["accordion", ({ root }) => new AccordionEngine({ root })],
    ["tabs", ({ root }) => new TabsEngine({ root })],
    ["tabs view", ({ root, effects, propertyPatchEngine }) => new TabsViewEngine({ root, effects, propertyPatchEngine })],
    ["command bar", ({ root }) => new CommandBarEngine({ root })],
    ["breadcrumbs", ({ root }) => new BreadcrumbsEngine({ root })],
    ["steps", ({ root }) => new StepsEngine({ root })],
    ["scroll anchor", ({ root }) => new ScrollAnchorEngine({ root })],
    ["visible keys", ({ root }) => new VisibleKeyEngine({ root })],
    ["surface press", ({ root }) => new SurfacePressEngine({ root })],
    ["text selection", ({ root }) => new TextSelectionEngine({ root })],
    ["scroll group", ({ root }) => new ScrollGroupEngine({ root })],
    ["flyout interaction", ({ root }) => new FlyoutInteractionEngine({ root })],
    ["text fold", ({ root }) => new TextFoldEngine({ root })],
    ["tooltip", ({ root }) => startTooltips(root)]
];

export function startCoreComponentEngines(
    engineContext: EngineContext,
    metadata: MetadataIndex,
    propertyState: PropertyStateStore,
    itemsRenderer: ItemsTemplateRenderer,
    virtualization: ItemsVirtualizationEngine,
    interactionEngine: InteractionEngine,
    engineDisposers: (() => void)[]
): NumberInputEngine | null {
    let numberInputs: NumberInputEngine | null = null;
    const record = (dispose: (() => void) | null): void => {
        if (dispose !== null)
            engineDisposers.push(dispose);
    };

    // Ahead of NumberInputEngine and ComponentEngines: its window capture listeners snapshot and gate a field's invariant value
    // before NumberInputEngine rewrites the field's text for the change event or any root listener hears it.
    record(startEngine("commit gate", ({ root, propertyPatchEngine }) => new CommitGate({
        root,
        propertyPatchEngine,
        readValue: field => numberInputs?.readValue(field) ?? field.value
    }), engineContext));

    // Ahead of ComponentEngines: its window focusin listener writes edit text before FieldKeysEngine snapshots the field, and the
    // plugin surface reads a number field's invariant value off this engine.
    record(startEngine("number input", ({ root, propertyPatchEngine }) => {
        numberInputs = new NumberInputEngine({ root, propertyPatchEngine });
        return numberInputs;
    }, engineContext));

    for (const [name, start] of ComponentEngines)
        record(startEngine(name, start, engineContext));

    // Apart from the list: a tree's filter and sort run in its own walk, which needs the rules and the rows' values.
    record(startEngine("tree", ({ root, effects, propertyPatchEngine }) => new TreeEngine({ root, effects, propertyPatchEngine, rules: { metadata, state: propertyState, renderer: itemsRenderer, compareItems, itemMatchesFilters } }), engineContext));

    // Apart from the list: whether a sort orders a host is the rules', and a virtualized host's order its values'.
    record(startEngine("items reorder", ({ root }) => new ItemsReorderEngine({ root, services: { metadata, state: propertyState, keysOf: host => virtualization.keysOf(host) } }), engineContext));

    // A theme flag, not a per-page choice: off the flag, a press draws nothing and a finger held for a context menu shows the wash
    // alone. Apart from the list: a row answers a press where its click is the view's, which the metadata knows.
    record(startEngine("press ripple", ({ root }) => new PressRippleEngine({
        root,
        clicks: component => metadata.hasServerEventForComponent("click", readComponentId(component)) || interactionEngine.hasEventForComponent("click", readComponentId(component)),
        waves: document.documentElement.hasAttribute(PressRippleAttribute)
    }), engineContext));

    // A theme flag too, and only where a pointer hovers: a touch screen draws no bar at all (core/scrollbar.less).
    record(startEngine("overlay scrollbars", () => document.documentElement.hasAttribute(OverlayScrollbarsAttribute)
        ? new OverlayScrollbarEngine()
        : undefined, engineContext));

    return numberInputs;
}

function registerBuiltInPipelineEvents(
    eventPipeline: EventPipeline,
    metadata: MetadataIndex,
    interactionIndex: InteractionIndex,
    updateProcessor: UpdateProcessor,
    engineContext: EngineContext,
    rowMenus: RowMenus,
    virtualization: ItemsVirtualizationEngine,
    windows: ItemsWindowEngine,
    engineDisposers: (() => void)[]
): void {
    // Every event the compiled view declares, attached bare; a package's `registerEvent` for one of them may attach it its own way.
    for (const eventName of new Set([...metadata.getEventNames(), ...interactionIndex.getSourceEventNames()]))
        eventPipeline.addEvent(eventName);

    // After them, since each is added bare: the tab menu's entry names its own keys, the entry and the tab, as a package's event does.
    eventPipeline.addEvent(ItemMenuEntryEvent.name, ItemMenuEntryEvent.registration);
    // A row's move carries the index it takes after its keys, the row standing there until the answer; a tab's strip, which
    // the drag already reordered, and a tab pinned take the order their data holds once answered.
    const resort = (host: Element): void => updateProcessor.resortHost(host);
    const itemMove = itemMoveEvent({ ahead: (host, key, index) => updateProcessor.moves.ahead(host, key, index), settle: move => updateProcessor.moves.settle(move), resort });
    eventPipeline.addEvent(itemMove.name, itemMove.registration);
    const tabPin = tabPinEvent(resort);
    eventPipeline.addEvent(tabPin.name, tabPin.registration);
    // A lazy folder's unfold settled, whatever came of it: a fold and an unfold ask again.
    eventPipeline.addEvent(TreeUnfoldEvent.name, TreeUnfoldEvent.registration);
    // Items of a kind dropped or pasted on a component taking it carry the drop after its keys; rows moved ahead wait for the answer.
    const itemDrop = itemDropEvent(updateProcessor.transfers);

    for (const eventName of metadata.getEventNames()) {
        if (eventName.startsWith(DropEventPrefix))
            eventPipeline.addEvent(eventName, itemDrop);
    }
    // A field's Enter waits for the value it committed, so the command reads what was typed.
    eventPipeline.addEvent(FieldEnterEvent.name, FieldEnterEvent.registration);
    // A search's query waits for its answer, its field's glyph a ring past a moment.
    eventPipeline.addEvent(SearchEvent.name, SearchEvent.registration);
    eventPipeline.addEvent(TriggerSearchEvent.name, TriggerSearchEvent.registration);
    eventPipeline.addEvent(TriggerSelectEvent.name, TriggerSelectEvent.registration);
    eventPipeline.addEvent(TriggerClickEvent.name, TriggerClickEvent.registration);

    const record = (dispose: (() => void) | null): void => {
        if (dispose !== null)
            engineDisposers.push(dispose);
    };

    // After the pipeline, whose events the view's own chords are, and after every engine's keydown, so one that took the key wins.
    record(startEngine("shortcuts", ({ root, dom }) => new ShortcutEngine({
        root,
        viewShortcuts: viewShortcutsOf(metadata.metadata),
        componentOf: componentId => dom.findComponent(componentId, []),
        laterChords: rowMenus
    }), engineContext));
    // After the chords, so a view's own Ctrl+C or Ctrl+V is heard first; a drag between hosts lands where the view takes its kind.
    record(startEngine("item drag", ({ root, dom }) => new ItemDragEngine({
        root,
        targetOf: (element, kind) => {
            const target = dom.resolveNearestComponent(element, componentId => metadata.hasServerEventForComponent(DropEventPrefix + kind, componentId))?.element ?? null;

            return target instanceof HTMLElement ? target : null;
        },
        keysOf: host => virtualization.keysOf(host)
    }), engineContext));

    // After the window engine, which it asks for a page; its Page keys are heard on the window, ahead of the row cursor's.
    record(startEngine("pager", ({ root, dom }) => new PagerEngine({ root, dom, windows }), engineContext));
}

export function createPluginEngineContext(
    engineContext: EngineContext,
    metadata: MetadataIndex,
    propertyPatchEngine: PropertyPatchEngine,
    valueBinding: ValueBindingEngine | undefined,
    validationEngine: ValidationEngine,
    itemsTemplates: ItemsTemplateRegistry,
    itemsRenderer: ItemsTemplateRenderer,
    virtualization: ItemsVirtualizationEngine,
    windows: ItemsWindowEngine,
    tables: TableColumnsEngine,
    readPluginValue: (element: Element) => unknown
): PluginEngineContext {
    return {
        ...engineContext,
        strings: clientStrings,
        observeComponents,
        observeSize,
        ownDescendants,
        store: new ClientStore(),
        numbers: numberFormatting,
        temporal: temporalFormatting,
        icons: { apply: applyIconValue },
        badges: { writeCount: writeBadgeCount },
        urls: { isImageSource, asBrowserReads, isSafeLink, isExternalLink },
        values: {
            read: element => readPluginValue(element),
            hold: element => valueBinding?.hold(element),
            release: element => {
                if (valueBinding?.release(element) === true)
                    propertyPatchEngine.restoreBoundValue(element, engineContext.dom.resolveNearestComponent(element, () => true)?.dynamicParameters ?? []);
            },
            write: (element, value) => propertyPatchEngine.writeBoundValue(element, value),
            whenSettled: async element => {
                // Keyed by the component a value is sent from, as a command raised by the same edit waits on it.
                const component = engineContext.dom.resolveNearestComponent(element, () => true)?.element ?? element;

                await valueBinding?.whenSettled(component);
            },
            isRefused: element => isRefusedValue(element, field => readPluginValue(field))
        },
        properties: {
            set: (element, propertyName, value) => {
                // By markup, not the page's index: a part may be set before it is on the page, or drawn several times from one template.
                const component = element.closest(ComponentSelector);

                if (component !== null && propertyName === "Items" && Array.isArray(value) && setComponentItems(component, value, metadata, itemsTemplates, itemsRenderer))
                    return true;

                const reference = component === null ? undefined : metadata.getExposedProperty(readComponentId(component), propertyName);

                if (component === null || reference === undefined) {
                    logWarn("a package set a property its component's renderer did not expose.", { propertyName });
                    return false;
                }

                return propertyPatchEngine.applyToComponent(component, reference, value);
            }
        },
        windows,
        tooltips,
        renames: { open: openInlineRename },
        tables,
        rows: createItemRows(itemsTemplates, itemsRenderer, virtualization),
        uploads: createFileUploads(validationEngine, uploadsInFlight),
        selection: itemSelection,
        popups: createPopups(engineContext.dom),
        roving: rovingFocus,
        typeAhead: pluginTypeAhead,
        focus: pluginFocus,
        states: componentStates,
        validation: validationEngine,
        wheel,
        colors: seriesColors,
        shortcuts: pluginShortcutWords,
        names: pluginDomNames
    };
}

export function createItemsSubsystems(
    root: ParentNode,
    dom: DomRegistry,
    metadata: MetadataIndex,
    extensions: ExtensionRegistry,
    operations: DomOperationRegistry,
    propertyState: PropertyStateStore,
    propertyPatchEngine: PropertyPatchEngine,
    reactiveSources: ReactiveSourceRegistry
): {
    readonly itemsTemplates: ItemsTemplateRegistry;
    readonly itemsRenderer: ItemsTemplateRenderer;
    readonly rowMenus: RowMenus;
    readonly virtualization: ItemsVirtualizationEngine;
    readonly updateProcessor: UpdateProcessor;
    readonly ruleWatcher: ItemsRuleWatcher;
} {
    const itemsTemplates = new ItemsTemplateRegistry(dom);
    const itemsRenderer = new ItemsTemplateRenderer(metadata, itemsTemplates, extensions, operations, propertyState);
    let updateProcessor: UpdateProcessor;
    const rowMenus = new RowMenus({
        root,
        render: (template, owner) => itemsRenderer.renderPart(template, owner),
        drawn: menu => updateProcessor.fillDrawnPart(menu),
        heldRows: visit => updateProcessor.forEachHeldRow(visit)
    });

    rowMenus.scan();
    const drawRowMenu = (owner: HTMLElement): HTMLElement | null => rowMenus.draw(owner);

    setLaterMenus(drawRowMenu);
    registerRuntimeCleanup(() => clearLaterMenus(drawRowMenu));

    const virtualization = new ItemsVirtualizationEngine({
        root,
        metadata,
        templates: itemsTemplates,
        renderer: itemsRenderer,
        state: propertyState,
        dom
    });

    updateProcessor = new UpdateProcessor(
        metadata,
        propertyPatchEngine,
        propertyState,
        itemsRenderer,
        itemsTemplates,
        dom,
        virtualization,
        extensions.collectionSinks,
        rowMenus
    );

    const ruleWatcher = new ItemsRuleWatcher({
        root,
        metadata,
        templates: itemsTemplates,
        renderer: itemsRenderer,
        state: propertyState,
        propertyPatchEngine,
        reactiveSources,
        virtualization
    });

    return { itemsTemplates, itemsRenderer, rowMenus, virtualization, updateProcessor, ruleWatcher };
}

export function createEventPipelineAndWindows(
    root: ParentNode,
    metadata: MetadataIndex,
    dom: DomRegistry,
    dispatcher: CommandDispatcher,
    interactionEngine: InteractionEngine,
    interactionIndex: InteractionIndex,
    extensions: ExtensionRegistry,
    effects: EffectRegistry,
    events: Iterable<EventRegistration> | undefined,
    validationEngine: ValidationEngine,
    valueBinding: ValueBindingEngine | undefined,
    transport: SignalRTransport,
    failures: FailureNotice,
    updateProcessor: UpdateProcessor,
    engineContext: EngineContext,
    rowMenus: RowMenus,
    virtualization: ItemsVirtualizationEngine,
    engineDisposers: (() => void)[]
): {
    readonly eventPipeline: EventPipeline;
    readonly tables: TableColumnsEngine;
    readonly windows: ItemsWindowEngine;
} {
    let windows: ItemsWindowEngine;
    const eventPipeline = new EventPipeline({
        root,
        metadata,
        dom,
        dispatcher,
        afterEffects: () => windows.reconsider(),
        interactionEngine,
        eventCatalog: extensions.events,
        effects,
        events,
        validationEngine,
        valueBinding,
        uploads: uploadsInFlight,
        isReattaching: () => transport.isReattaching,
        failed: error => failures.say(error)
    });

    const tables = new TableColumnsEngine({ root });
    windows = new ItemsWindowEngine({
        root,
        requestWindow: request => transport.requestItemWindowAsync(request),
        failed: error => failures.say(error)
    });
    updateProcessor.addWindowRefillHandler(host => windows.refilled(host));

    registerBuiltInPipelineEvents(eventPipeline, metadata, interactionIndex, updateProcessor, engineContext, rowMenus, virtualization, windows, engineDisposers);

    return { eventPipeline, tables, windows };
}

