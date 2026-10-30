import type {
    AnnouncePolitenessName,
    ClientEffectKindName,
    ClientEffectKindValue,
    CollectionUpdateAction,
    CollectionUpdateActionName,
    IdValue,
    ScrollAxisName,
    ScrollPositionName,
    ScrollToBehaviorName,
    ScrollToBlockName,
    ServerUIUpdate,
    ThemeModeName,
    UIPropertyAddress,
    UIUpdateKindName,
    WebBindingMode,
    WebBindingModeName,
    WebDomOperationKind,
    WebInteractionActionKind,
    WebInteractionActionKindName,
    WebInteractionOperator,
    WebInteractionOperatorName,
    WebInteractionSourceKind,
    WebInteractionSourceKindName,
    WebItemsSortDirection,
    WebItemsSortDirectionName,
    WebRenderBindingMetadata,
    WebRenderBindingParameterKind,
    WebRenderBindingParameterKindName,
    WebRenderEventMetadata,
    WebRenderItemValue,
    WebRenderItemValuesMetadata,
    WebRenderItemsFilterSortMetadata,
    WebRenderItemsTemplateMetadata,
    WebRenderPropertyDefinitionMetadata,
    WebRenderPropertyReferenceMetadata,
    WebRenderValidationMessageTargetMetadata,
    WebRenderValidationMetadata,
    WebRenderWordMetadata,
    WebUIMetadata,
    WebValidationSeverity,
    WebValidationSeverityName,
    WebValidationTrigger,
    WebValidationTriggerName,
    WebValueCondition,
    WebValueConditionName
} from "./metadata-types.ts";

export type * from "./metadata-types.ts";

/** The built-in kinds by name, so a caller raising one does not spell it a second time. */
export const ClientEffectKinds = {
    Navigate: "Navigate",
    NavigateBack: "NavigateBack",
    Focus: "Focus",
    ScrollTo: "ScrollTo",
    ScrollToItem: "ScrollToItem",
    OpenDialog: "OpenDialog",
    CloseDialog: "CloseDialog",
    ShowNotification: "ShowNotification",
    Announce: "Announce",
    DownloadFile: "DownloadFile",
    Scroll: "Scroll",
    SetTheme: "SetTheme",
    SetThemeColors: "SetThemeColors",
    RenameItem: "RenameItem",
    CopyToClipboard: "CopyToClipboard",
    InsertText: "InsertText",
    DiscardForm: "DiscardForm",
    OpenPicker: "OpenPicker",
    SetLanguage: "SetLanguage",
    ConfirmLeave: "ConfirmLeave",
    ReplaceAddress: "ReplaceAddress",
    PushAddress: "PushAddress",
    RequestNotificationPermission: "RequestNotificationPermission",
    ShowSystemNotification: "ShowSystemNotification",
    ShowImage: "ShowImage",
    DevelopmentReport: "DevelopmentReport"
} as const satisfies Record<ClientEffectKindName, ClientEffectKindName>;

// One answer for a component with no rules: the lookups run on every keystroke and every pushed value.
const NoValidations: readonly WebRenderValidationMetadata[] = Object.freeze([]);

export class MetadataIndex {
    private readonly propertyDefinitionsById = new Map<string, WebRenderPropertyDefinitionMetadata>();
    private readonly bindingsById = new Map<number, WebRenderBindingMetadata>();
    private readonly bindingsByComponentAndPropertyId = new Map<string, WebRenderBindingMetadata>();
    private readonly bindingsByComponentAndPropertyName = new Map<string, WebRenderBindingMetadata>();
    private readonly eventsByComponentAndName = new Map<string, WebRenderEventMetadata>();
    private readonly eventNames = new Set<string>();
    private readonly eventComponentIdsByName = new Map<string, Set<number>>();
    private readonly itemsTemplatesByComponentId = new Map<number, WebRenderItemsTemplateMetadata>();
    private readonly itemsFilterSortByComponentId = new Map<number, WebRenderItemsFilterSortMetadata>();
    private readonly itemValuesByAddress = new Map<string, WebRenderItemValuesMetadata>();
    private readonly validationsByComponentId = new Map<number, WebRenderValidationMetadata[]>();
    private readonly validationsAgainstComponentId = new Map<number, WebRenderValidationMetadata[]>();
    private readonly validationTargetsByComponentId = new Map<number, WebRenderValidationMessageTargetMetadata>();
    private readonly exposedProperties = new Map<string, WebRenderPropertyReferenceMetadata>();

    // A plain field rather than a parameter property: node's type stripping refuses one, and the tests import this module.
    public readonly metadata: WebUIMetadata;

    public constructor(metadata: WebUIMetadata) {
        this.metadata = metadata;

        for (const property of metadata.propertyDefinitions)
            this.addPropertyDefinition(property);

        for (const binding of metadata.bindings)
            this.addBinding(binding);

        for (const event of metadata.events)
            this.addEvent(event);

        for (const itemsTemplate of metadata.items)
            this.addItemsTemplate(itemsTemplate);

        for (const itemsFilterSort of metadata.itemsFilterSort)
            this.addItemsFilterSort(itemsFilterSort);

        for (const itemValues of metadata.itemValues ?? [])
            this.addItemValues(itemValues);

        for (const target of metadata.validationTargets ?? [])
            this.validationTargetsByComponentId.set(getIdValue(target.componentId), target);

        for (const property of metadata.exposedProperties ?? []) {
            const definition = this.getPropertyDefinition(property.propertyId);

            if (definition !== undefined)
                this.exposedProperties.set(`${getIdValue(property.componentId)}:${definition.propertyName}`, property);
        }

        for (const validation of metadata.validations)
            this.addValidation(validation);
    }

    public getPropertyDefinition(propertyId: string): WebRenderPropertyDefinitionMetadata | undefined {
        return this.propertyDefinitionsById.get(propertyId);
    }

    public getBindingById(bindingId: number): WebRenderBindingMetadata | undefined {
        return this.bindingsById.get(bindingId);
    }

    /** Whether a value written to the property is looked up as a key: translatable text its instance does not show as written. */
    public isTranslatable(reference: WebRenderPropertyReferenceMetadata): boolean {
        if (this.propertyDefinitionsById.get(reference.propertyId)?.translatable !== true || reference.content === true)
            return false;

        const binding = "bindingId" in reference
            ? reference as WebRenderBindingMetadata
            : this.getBindingByComponentAndPropertyId(getIdValue(reference.componentId), reference.propertyId);

        return binding?.content !== true;
    }

    /** The translatable values the page was rendered with, which a language switch writes again. */
    public getWords(): readonly WebRenderWordMetadata[] {
        return this.metadata.words ?? [];
    }

    /** Whether the compiled view registered any binding at all on this component. */
    public hasComponentBindings(componentId: number): boolean {
        for (const binding of this.metadata.bindings) {
            if (getIdValue(binding.componentId) === componentId)
                return true;
        }

        return false;
    }

    public getBindingByComponentAndPropertyId(componentId: number, propertyId: string): WebRenderBindingMetadata | undefined {
        return this.bindingsByComponentAndPropertyId.get(createComponentPropertyKey(componentId, propertyId));
    }

    public getBindingByComponentAndPropertyName(componentId: number, propertyName: string): WebRenderBindingMetadata | undefined {
        return this.bindingsByComponentAndPropertyName.get(createComponentPropertyKey(componentId, normalizePropertyName(propertyName)));
    }

    public getEvent(componentId: number, eventName: string): WebRenderEventMetadata | undefined {
        return this.eventsByComponentAndName.get(createComponentEventKey(componentId, eventName));
    }

    public hasServerEvent(eventName: string): boolean {
        return this.eventNames.has(normalizeEventName(eventName));
    }

    public getEventNames(): ReadonlySet<string> {
        return this.eventNames;
    }

    public hasServerEventForComponent(eventName: string, componentId: number): boolean {
        return this.eventComponentIdsByName.get(normalizeEventName(eventName))?.has(componentId) === true;
    }

    public getItemsTemplateMetadata(componentId: number): WebRenderItemsTemplateMetadata | undefined {
        return this.itemsTemplatesByComponentId.get(componentId);
    }

    public getItemsFilterSortMetadata(componentId: number): WebRenderItemsFilterSortMetadata | undefined {
        return this.itemsFilterSortByComponentId.get(componentId);
    }

    /** The values behind one server-rendered host, by its address: the component and the keys of the rows it stands in. */
    public getItemValues(componentId: number, dynamicParameters: readonly unknown[] = []): readonly WebRenderItemValue[] {
        return this.itemValuesByAddress.get(itemValuesKey(componentId, dynamicParameters))?.items ?? [];
    }

    public getValidationsForComponent(componentId: number): readonly WebRenderValidationMetadata[] {
        return this.validationsByComponentId.get(componentId) ?? NoValidations;
    }

    /** The rules of other fields that compare with this component's value, each naming the field it judges. */
    public getValidationsAgainst(componentId: number): readonly WebRenderValidationMetadata[] {
        return this.validationsAgainstComponentId.get(componentId) ?? NoValidations;
    }

    /** A property the component's renderer let a package's client set, by the component and the property's name. */
    public getExposedProperty(componentId: number, propertyName: string): WebRenderPropertyReferenceMetadata | undefined {
        return this.exposedProperties.get(`${componentId}:${propertyName}`);
    }

    /** Where this field sends its validation words, when it sends them somewhere other than itself. */
    public getValidationTarget(componentId: number): WebRenderValidationMessageTargetMetadata | undefined {
        return this.validationTargetsByComponentId.get(componentId);
    }

    private addPropertyDefinition(property: WebRenderPropertyDefinitionMetadata): void {
        if (property.propertyId.trim().length === 0)
            return;

        this.propertyDefinitionsById.set(property.propertyId, property);
    }

    private addBinding(binding: WebRenderBindingMetadata): void {
        const componentId = getIdValue(binding.componentId);
        const property = this.getPropertyDefinition(binding.propertyId);

        if (componentId <= 0 || property === undefined)
            return;

        const bindingId = getIdValue(binding.bindingId);

        if (bindingId > 0)
            this.bindingsById.set(bindingId, binding);

        this.bindingsByComponentAndPropertyId.set(createComponentPropertyKey(componentId, binding.propertyId), binding);
        this.bindingsByComponentAndPropertyName.set(createComponentPropertyKey(componentId, property.propertyName), binding);
    }

    private addEvent(event: WebRenderEventMetadata): void {
        const eventName = normalizeEventName(event.eventName);
        const componentId = getIdValue(event.componentId);

        if (eventName.length === 0 || componentId <= 0)
            return;

        this.eventsByComponentAndName.set(createComponentEventKey(componentId, eventName), event);
        this.eventNames.add(eventName);

        let componentIds = this.eventComponentIdsByName.get(eventName);

        if (componentIds === undefined) {
            componentIds = new Set<number>();
            this.eventComponentIdsByName.set(eventName, componentIds);
        }

        componentIds.add(componentId);
    }

    private addItemsTemplate(itemsTemplate: WebRenderItemsTemplateMetadata): void {
        const componentId = getIdValue(itemsTemplate.componentId);

        if (componentId <= 0)
            return;

        this.itemsTemplatesByComponentId.set(componentId, itemsTemplate);
    }

    private addItemsFilterSort(itemsFilterSort: WebRenderItemsFilterSortMetadata): void {
        const componentId = getIdValue(itemsFilterSort.componentId);

        if (componentId <= 0)
            return;

        this.itemsFilterSortByComponentId.set(componentId, itemsFilterSort);
    }

    private addItemValues(itemValues: WebRenderItemValuesMetadata): void {
        const componentId = getIdValue(itemValues.componentId);

        if (componentId > 0)
            this.itemValuesByAddress.set(itemValuesKey(componentId, itemValues.dynamicParameters ?? []), itemValues);
    }

    private addValidation(validation: WebRenderValidationMetadata): void {
        const componentId = getIdValue(validation.target?.componentId);

        if (componentId <= 0)
            return;

        addGrouped(this.validationsByComponentId, componentId, validation);

        const sourceId = getIdValue(validation.valueSource?.componentId);

        if (sourceId > 0)
            addGrouped(this.validationsAgainstComponentId, sourceId, validation);
    }
}

/** Adds a rule to the list its key holds, starting the list where there is none. */
function addGrouped(groups: Map<number, WebRenderValidationMetadata[]>, key: number, validation: WebRenderValidationMetadata): void {
    const group = groups.get(key);

    if (group === undefined)
        groups.set(key, [validation]);
    else
        group.push(validation);
}

function resolveEnumName<TName extends string>(value: TName | number | null | undefined, names: readonly TName[]): TName | "Unknown" {
    if (typeof value === "number")
        return names[value] ?? "Unknown";

    return value !== null && value !== undefined && (names as readonly string[]).includes(value) ? value : "Unknown";
}

export function getBindingParameterKind(value: WebRenderBindingParameterKind | null | undefined): WebRenderBindingParameterKindName | "Unknown" {
    return resolveEnumName(value, ["Dynamic", "Fixed", "Scope"] as const);
}

export function getBindingMode(value: WebBindingMode | null | undefined): WebBindingModeName | "Unknown" {
    // A binding that says nothing is OneWay: the server leaves the default off the wire.
    if (value === null || value === undefined)
        return "OneWay";

    return resolveEnumName(value, ["OneWay", "TwoWay", "OneWayToSource", "OnSubmit"] as const);
}

export function getInteractionSourceKind(value: WebInteractionSourceKind | null | undefined): WebInteractionSourceKindName | "Unknown" {
    return resolveEnumName(value, ["Property", "Event"] as const);
}

export function getInteractionActionKind(value: WebInteractionActionKind | null | undefined): WebInteractionActionKindName | "Unknown" {
    // An interaction that names no action is a property assignment.
    return value === null || value === undefined
        ? "SetProperty"
        : resolveEnumName(value, ["SetProperty", "Effect", "CopyValue"] as const);
}

export function getInteractionOperator(value: WebInteractionOperator | null | undefined): WebInteractionOperatorName | "Unknown" {
    return resolveEnumName(value, ["Required", "Equal", "NotEqual", "Greater", "GreaterOrEqual", "Less", "LessOrEqual", "Like", "In", "Regex", "LikeIgnoreCase", "RegexEach"] as const);
}

export function getItemsSortDirection(value: WebItemsSortDirection | null | undefined): WebItemsSortDirectionName | "Unknown" {
    return resolveEnumName(value, ["Ascending", "Descending"] as const);
}

export function getValidationTrigger(value: WebValidationTrigger | null | undefined): WebValidationTriggerName | "Unknown" {
    return resolveEnumName(value, ["Change", "Blur", "Submit"] as const);
}

export function getValidationSeverity(value: WebValidationSeverity | null | undefined): WebValidationSeverityName | "Unknown" {
    return resolveEnumName(value, ["Error", "Warning", "Info"] as const);
}

/** The kind's name: a built-in one from its number, or a string as it came — a package's kind is only ever its name. */
export function getDomOperationKind(value: WebDomOperationKind | null | undefined): string {
    if (typeof value === "string")
        return value;

    return resolveEnumName(value, ["Text", "Attribute", "RemoveAttribute", "ToggleAttribute", "Class", "ToggleClass", "Style", "Data", "Property", "Markup"] as const);
}

export function getValueCondition(value: WebValueCondition | null | undefined): WebValueConditionName | "Unknown" {
    return resolveEnumName(value, ["None", "HasValue", "HasText", "IsTrue", "IsFalse", "DrawsIcon"] as const);
}

export function getCollectionUpdateAction(value: CollectionUpdateAction | null | undefined): CollectionUpdateActionName | "Unknown" {
    return resolveEnumName(value, ["Insert", "Remove", "Move", "Replace", "Reset"] as const);
}

/** The number behind an id the server may have left out: 0, the empty id, when it did. */
export function getIdValue(value: IdValue | null | undefined): number {
    return value ?? 0;
}

/**
 * Dynamic parameters — the keys of the rows a component stands in — as one text to key a map by. Each key as text, as the DOM holds it:
 * a key the server sends as a number and the same key read off the DOM as digits name one row.
 */
export function rowKeysText(dynamicParameters: readonly unknown[]): string {
    return JSON.stringify(dynamicParameters.map(parameter => String(parameter ?? "")));
}

/** The name behind a property key, however the server wrote it. */
export function getPropertyKeyName(value: UIPropertyAddress["property"] | null | undefined): string {
    return typeof value === "string" ? value : "";
}

export function getUpdateKind(update: ServerUIUpdate): UIUpdateKindName | "Unknown" {
    return resolveEnumName(update.kind, ["Value", "CollectionChange", "FullResync", "Validation", "Page"] as const);
}

/** The key a handler is registered and looked up under, as written: folding unknown kinds together would collide them. */
export function getClientEffectKind(value: ClientEffectKindValue | null | undefined): string {
    return typeof value === "string" ? value.trim() : "";
}

export function getScrollToBehavior(value: ScrollToBehaviorName | number | null | undefined): ScrollToBehaviorName | "Unknown" {
    return resolveEnumName(value, ["Auto", "Smooth"] as const);
}

export function getScrollToBlock(value: ScrollToBlockName | number | null | undefined): ScrollToBlockName | "Unknown" {
    return resolveEnumName(value, ["Start", "Center", "End", "Nearest"] as const);
}

export function getScrollPosition(value: ScrollPositionName | number | null | undefined): ScrollPositionName | "Unknown" {
    return resolveEnumName(value, ["Start", "End", "Offset", "PageBack", "PageForward"] as const);
}

export function getThemeMode(value: ThemeModeName | number | null | undefined): ThemeModeName | "Unknown" {
    return resolveEnumName(value, ["Light", "Dark"] as const);
}

export function getScrollAxis(value: ScrollAxisName | number | null | undefined): ScrollAxisName | "Unknown" {
    return resolveEnumName(value, ["Horizontal", "Vertical"] as const);
}

export function getAnnouncePoliteness(value: AnnouncePolitenessName | number | null | undefined): AnnouncePolitenessName | "Unknown" {
    return resolveEnumName(value, ["Polite", "Assertive"] as const);
}

export function normalizeEventName(value: string | null | undefined): string {
    return value?.trim().toLowerCase() ?? "";
}

function normalizePropertyName(value: string | null | undefined): string {
    return value?.trim() ?? "";
}

function createComponentPropertyKey(componentId: number, propertyKey: string): string {
    return `${componentId}:${normalizePropertyName(propertyKey)}`;
}

function createComponentEventKey(componentId: number, eventName: string): string {
    return `${componentId}:${normalizeEventName(eventName)}`;
}

function itemValuesKey(componentId: number, dynamicParameters: readonly unknown[]): string {
    return `${componentId}:${rowKeysText(dynamicParameters)}`;
}
