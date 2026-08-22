export type IdValue = number | { value: number };

export type WebUIMetadata = {
    readonly propertyDefinitions: readonly WebRenderPropertyDefinitionMetadata[];
    readonly bindings: readonly WebRenderBindingMetadata[];
    readonly events: readonly WebRenderEventMetadata[];
    readonly interactions: readonly WebRenderInteractionMetadata[];
    readonly validations: readonly WebRenderValidationMetadata[];
    readonly items: readonly WebRenderItemsTemplateMetadata[];
    readonly itemsFilterSort: readonly WebRenderItemsFilterSortMetadata[];
    readonly itemValues: readonly WebRenderItemValuesMetadata[];
};

export type WebRenderPropertyDefinitionMetadata = {
    readonly propertyId: string;
    readonly componentTypeKey: string;
    readonly propertyName: string;
    readonly operations: readonly WebDomOperation[];
};

export type WebRenderPropertyReferenceMetadata = {
    readonly componentId: IdValue;
    readonly propertyId: string;
    readonly dynamicParameterComponentIds?: readonly IdValue[];
};

export type WebRenderBindingMetadata = WebRenderPropertyReferenceMetadata & {
    readonly bindingId: IdValue;
    readonly kind: WebBindingKind;
    readonly mode: WebBindingMode;
    readonly itemTemplate?: string | null;
    readonly itemTemplateParameters?: readonly WebRenderBindingParameterMetadata[] | null;
};

export type WebRenderBindingParameterKindName = "Dynamic" | "Fixed" | "Scope";
export type WebRenderBindingParameterKind = WebRenderBindingParameterKindName | number;

export type WebRenderBindingParameterMetadata = {
    readonly kind: WebRenderBindingParameterKind;
    readonly componentId?: IdValue | null;
    readonly value?: unknown;
};

export type WebRenderItemsTemplateMetadata = {
    readonly componentId: IdValue;
    readonly templateKeyPropertyName?: string | null;
    readonly fallbackTemplateKeyPropertyName?: string | null;
    readonly itemWrapperElementName?: string | null;
    readonly itemWrapperClassName?: string | null;
    readonly composite?: WebRenderItemsCompositeMetadata | null;
};

export type WebRenderItemsCompositeMetadata = {
    readonly itemElementName: string;
    readonly itemClassName: string;
    readonly hostSlotVariantKey?: string | null;
    readonly slots: readonly WebRenderItemsCompositeSlotMetadata[];
};

export type WebRenderItemsCompositeSlotMetadata = {
    readonly variantKey: string;
    readonly wrapperElementName: string;
    readonly wrapperClassName: string;
};

export type WebItemsSortDirectionName = "Ascending" | "Descending";
export type WebItemsSortDirection = WebItemsSortDirectionName | number;

export type WebRenderItemsFilterMetadata = {
    readonly itemProperty: string;
    readonly operator: WebInteractionOperator;
    readonly value?: unknown;
    readonly source?: WebRenderPropertyReferenceMetadata | null;
    readonly activeOperator: WebInteractionOperator;
    readonly activeValue?: unknown;
};

export type WebRenderItemsSortMetadata = {
    readonly itemProperty: string;
    readonly direction: WebItemsSortDirection;
    readonly priority: number;
    readonly source?: WebRenderPropertyReferenceMetadata | null;
    readonly activeOperator: WebInteractionOperator;
    readonly activeValue?: unknown;
};

export type WebRenderItemsFilterSortMetadata = {
    readonly componentId: IdValue;
    readonly filters: readonly WebRenderItemsFilterMetadata[];
    readonly sorts: readonly WebRenderItemsSortMetadata[];
};

/** The values behind a server-rendered items host — the client never rendered them and holds no copy. */
export type WebRenderItemValuesMetadata = {
    readonly componentId: IdValue;
    readonly items: readonly WebRenderItemValue[];
};

export type WebRenderItemValue = {
    readonly key: string;
    readonly item: unknown;
};

export type WebBindingKindName =
    | "ComponentContext"
    | "ComponentProperty"
    | "ComponentCollection";
export type WebBindingKind = WebBindingKindName | number;

export type WebBindingModeName =
    | "OneWay"
    | "TwoWay"
    | "OneWayToSource"
    | "OnSubmit";
export type WebBindingMode = WebBindingModeName | number;

export type WebRenderEventMetadata = {
    readonly eventId: IdValue;
    readonly componentId: IdValue;
    readonly eventName: string;
    readonly dynamicParameterComponentIds?: readonly IdValue[];
};

export type WebRenderEventAddress = {
    readonly componentId: IdValue;
    readonly eventName: string;
};

export type WebRenderInteractionMetadata = {
    readonly sourceKind: WebInteractionSourceKind;
    readonly actionKind?: WebInteractionActionKind;
    readonly source?: WebRenderPropertyReferenceMetadata | null;
    readonly sourceEvent?: WebRenderEventAddress | null;
    readonly target?: WebRenderPropertyReferenceMetadata | null;
    readonly effect?: ClientEffect | null;
    readonly operator: WebInteractionOperator;
    readonly value?: unknown;
    readonly trueValue?: unknown;
    readonly falseValue?: unknown;
};

export type WebInteractionSourceKindName = "Property" | "Event";
export type WebInteractionSourceKind = WebInteractionSourceKindName | number;

export type WebInteractionActionKindName = "SetProperty" | "Effect";
export type WebInteractionActionKind = WebInteractionActionKindName | number;

export type WebInteractionOperatorName =
    | "Required"
    | "Equal"
    | "NotEqual"
    | "Greater"
    | "GreaterOrEqual"
    | "Less"
    | "LessOrEqual"
    | "Like"
    | "LikeIgnoreCase"
    | "In"
    | "Regex";
export type WebInteractionOperator = WebInteractionOperatorName | number;

export type WebRenderValidationTargetMetadata = {
    readonly componentId: IdValue;
    readonly propertyId: string;
};

export type WebValidationTriggerName = "Change" | "Blur" | "Submit";
export type WebValidationTrigger = WebValidationTriggerName | number;

export type WebColorStyleName =
    | "Default" | "Primary" | "Accent" | "Background" | "Surface"
    | "OnPrimary" | "OnAccent" | "OnBackground" | "OnSurface"
    | "Info" | "Warning" | "Success" | "Danger"
    | "OnInfo" | "OnWarning" | "OnSuccess" | "OnDanger"
    | "Muted"
    | "Selected" | "FocusRing" | "Border" | "Shadow" | "Overlay";
export type WebColorStyle = WebColorStyleName | number;

export type WebRenderValidationMetadata = {
    readonly target: WebRenderValidationTargetMetadata;
    readonly trigger: WebValidationTrigger;
    readonly operator: WebInteractionOperator;
    readonly value?: unknown;
    readonly severity: WebColorStyle;
    readonly message: string;
};

export type WebDomOperation = {
    readonly kind: WebDomOperationKind;
    readonly target?: string | null;
    readonly name?: string | null;
    readonly converter?: string | null;
    readonly condition?: WebValueCondition | null;
};

export type WebDomOperationKindName =
    | "Text"
    | "Attribute"
    | "RemoveAttribute"
    | "ToggleAttribute"
    | "Class"
    | "ToggleClass"
    | "Style"
    | "Data"
    | "Property";
export type WebDomOperationKind = WebDomOperationKindName | number;

export type WebValueConditionName =
    | "None"
    | "HasValue"
    | "HasText"
    | "IsTrue"
    | "IsFalse";
export type WebValueCondition = WebValueConditionName | number;

export type UIComponentAddress = {
    readonly id: IdValue;
    readonly dynamicParameters?: readonly unknown[];
};

export type UIPropertyAddress = {
    readonly component: UIComponentAddress;
    readonly property: {
        readonly name: string;
    };
};

export type ServerChangeSet = {
    readonly updates?: readonly ServerUIUpdate[];
};

export type UIUpdateKindName =
    | "Value"
    | "ContextRebuild"
    | "CollectionChange"
    | "FullResync"
    | "Validation";

export type UIUpdateKindValue = UIUpdateKindName | number;

export type SerializedIdValue = {
    readonly value: number;
};

export type ServerUIUpdate =
    | ServerValueUIUpdate
    | ServerContextRebuildUIUpdate
    | ServerCollectionChangeUIUpdate
    | ServerFullResyncUIUpdate
    | ServerValidationUIUpdate
    | UnknownServerUIUpdate;

export type ServerValueUIUpdate = {
    readonly kind: UIUpdateKindValue;
    readonly address: UIPropertyAddress;
    readonly value?: unknown;
};

export type ServerValidationUIUpdate = {
    readonly kind: UIUpdateKindValue;
    readonly address: UIPropertyAddress;
    readonly message?: string | null;
    readonly severity?: WebColorStyle;
};

export type ServerContextRebuildUIUpdate = {
    readonly kind: UIUpdateKindValue;
    readonly component: UIComponentAddress;
    readonly context?: unknown;
};

export type CollectionUpdateActionName =
    | "Insert"
    | "Remove"
    | "Move"
    | "Replace"
    | "Reset";
export type CollectionUpdateAction = CollectionUpdateActionName | number;

export type ServerCollectionItemChange = {
    readonly index?: number | null;
    readonly key?: string | null;
    readonly oldKey?: string | null;
    readonly item?: unknown;
};

export type ServerCollectionMoveChange = {
    readonly oldIndex?: number | null;
    readonly newIndex?: number | null;
    readonly key?: string | null;
};

export type ServerCollectionChangeUIUpdate = {
    readonly kind: UIUpdateKindValue;
    readonly action: CollectionUpdateAction;
    readonly component: UIComponentAddress;
    readonly items?: readonly ServerCollectionItemChange[];
    readonly moves?: readonly ServerCollectionMoveChange[];
};

export type ServerFullResyncUIUpdate = {
    readonly kind: UIUpdateKindValue;
};

export type UnknownServerUIUpdate = {
    readonly kind: UIUpdateKindValue;
    readonly [key: string]: unknown;
};

export type UICommandRequest = {
    readonly eventId: SerializedIdValue;
    readonly dynamicParameters: readonly unknown[];
};

export type UICommandExecutionResult = {
    readonly command?: UICommandResult;
    readonly changes?: ServerChangeSet;
};

export type UICommandResult = {
    readonly success?: boolean;
    readonly message?: string | null;
    readonly effects?: readonly ClientEffect[];
    readonly [key: string]: unknown;
};

export type ClientEffectKindName =
    | "Navigate"
    | "Focus"
    | "ScrollTo"
    | "Show"
    | "Hide"
    | "OpenDialog"
    | "CloseDialog"
    | "ShowNotification"
    | "DownloadFile"
    | "Scroll";

export type ClientEffectKindValue = ClientEffectKindName | number;

export type ScrollToBehaviorName = "Auto" | "Smooth";

export type ScrollToBlockName = "Start" | "Center" | "End" | "Nearest";

export type ScrollPositionName = "Start" | "End" | "Offset" | "PageBack" | "PageForward";

export type ScrollAxisName = "Horizontal" | "Vertical";

export type ClientEffectTarget = {
    readonly id?: IdValue;
    readonly dynamicParameters?: readonly unknown[];
};

export type ClientEffect = {
    readonly kind: ClientEffectKindValue;
    readonly [key: string]: unknown;
};

export type TargetedClientEffect = ClientEffect & {
    readonly target?: ClientEffectTarget;
};

export type NavigateClientEffect = ClientEffect & {
    readonly request?: {
        readonly route?: string;
        readonly parameters?: Record<string, unknown> | null;
    };
};

export type ScrollToClientEffect = TargetedClientEffect & {
    readonly behavior?: ScrollToBehaviorName | number;
    readonly block?: ScrollToBlockName | number;
};

export type ScrollClientEffect = TargetedClientEffect & {
    readonly position?: ScrollPositionName | number;
    readonly axis?: ScrollAxisName | number;
    readonly offset?: number;
    readonly behavior?: ScrollToBehaviorName | number;
};

export type DownloadFileClientEffect = ClientEffect & {
    readonly requestPath?: string;
    readonly fileName?: string;
};

export type DialogClientEffect = ClientEffect & {
    readonly dialogKey?: string;
};

export type NotificationClientEffect = ClientEffect & {
    readonly message?: string;
    readonly severity?: string | number;
};

export type WebUIItemWindowRequest = {
    readonly componentId: number;
    readonly dynamicParameters: readonly unknown[];
    readonly anchor: ItemAnchorName;
    readonly offset?: number;
    readonly key?: string;
    readonly count: number;
    readonly extend: boolean;
};

export type ItemAnchorName = "Start" | "End" | "Offset" | "Before" | "After";

export type WebUIAttachRequest = {
    readonly clientTabId: string;
    readonly route: string;
    readonly parameters: Record<string, unknown> | null;
};

export type WebUIAttachResult = {
    readonly initialChanges?: ServerChangeSet;
};

export type WebUIValueChangeRequest = {
    readonly componentId: number;
    readonly propertyName: string;
    readonly dynamicParameters: readonly unknown[];
    readonly value?: unknown;
};

export type WebUIChangeSetRequest = {
    readonly updates: readonly WebUIValueChangeRequest[];
};

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
    private readonly itemValuesByComponentId = new Map<number, WebRenderItemValuesMetadata>();
    private readonly validationsByComponentId = new Map<number, WebRenderValidationMetadata[]>();

    public constructor(public readonly metadata: WebUIMetadata) {
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

        for (const validation of metadata.validations)
            this.addValidation(validation);
    }

    public getPropertyDefinition(propertyId: string): WebRenderPropertyDefinitionMetadata | undefined {
        return this.propertyDefinitionsById.get(propertyId);
    }

    public getBindingById(bindingId: number): WebRenderBindingMetadata | undefined {
        return this.bindingsById.get(bindingId);
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

    public getItemValues(componentId: number): readonly WebRenderItemValue[] {
        return this.itemValuesByComponentId.get(componentId)?.items ?? [];
    }

    public getValidationsForComponent(componentId: number): readonly WebRenderValidationMetadata[] {
        return this.validationsByComponentId.get(componentId) ?? [];
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
            this.itemValuesByComponentId.set(componentId, itemValues);
    }

    private addValidation(validation: WebRenderValidationMetadata): void {
        const componentId = getIdValue(validation.target?.componentId);

        if (componentId <= 0)
            return;

        let rules = this.validationsByComponentId.get(componentId);

        if (rules === undefined) {
            rules = [];
            this.validationsByComponentId.set(componentId, rules);
        }

        rules.push(validation);
    }
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
    return resolveEnumName(value, ["OneWay", "TwoWay", "OneWayToSource", "OnSubmit"] as const);
}

export function getInteractionSourceKind(value: WebInteractionSourceKind | null | undefined): WebInteractionSourceKindName | "Unknown" {
    return resolveEnumName(value, ["Property", "Event"] as const);
}

export function getInteractionActionKind(value: WebInteractionActionKind | null | undefined): WebInteractionActionKindName | "Unknown" {
    // An interaction that names no action at all is the property assignment every interaction used to be.
    return value === null || value === undefined
        ? "SetProperty"
        : resolveEnumName(value, ["SetProperty", "Effect"] as const);
}

export function getInteractionOperator(value: WebInteractionOperator | null | undefined): WebInteractionOperatorName | "Unknown" {
    return resolveEnumName(value, ["Required", "Equal", "NotEqual", "Greater", "GreaterOrEqual", "Less", "LessOrEqual", "Like", "In", "Regex", "LikeIgnoreCase"] as const);
}

export function getItemsSortDirection(value: WebItemsSortDirection | null | undefined): WebItemsSortDirectionName | "Unknown" {
    return resolveEnumName(value, ["Ascending", "Descending"] as const);
}

export function getValidationTrigger(value: WebValidationTrigger | null | undefined): WebValidationTriggerName | "Unknown" {
    return resolveEnumName(value, ["Change", "Blur", "Submit"] as const);
}

export function getDomOperationKind(value: WebDomOperationKind | null | undefined): WebDomOperationKindName | "Unknown" {
    return resolveEnumName(value, ["Text", "Attribute", "RemoveAttribute", "ToggleAttribute", "Class", "ToggleClass", "Style", "Data", "Property"] as const);
}

export function getValueCondition(value: WebValueCondition | null | undefined): WebValueConditionName | "Unknown" {
    return resolveEnumName(value, ["None", "HasValue", "HasText", "IsTrue", "IsFalse"] as const);
}

export function getCollectionUpdateAction(value: CollectionUpdateAction | null | undefined): CollectionUpdateActionName | "Unknown" {
    return resolveEnumName(value, ["Insert", "Remove", "Move", "Replace", "Reset"] as const);
}

export function getIdValue(value: IdValue | null | undefined): number {
    if (typeof value === "number")
        return value;

    return value?.value ?? 0;
}

export function getUpdateKind(update: ServerUIUpdate): UIUpdateKindName | "Unknown" {
    return resolveEnumName(update.kind, ["Value", "ContextRebuild", "CollectionChange", "FullResync", "Validation"] as const);
}

export function getClientEffectKind(value: ClientEffectKindValue | null | undefined): ClientEffectKindName | "Unknown" {
    return resolveEnumName(value, ["Navigate", "Focus", "ScrollTo", "Show", "Hide", "OpenDialog", "CloseDialog", "ShowNotification", "DownloadFile", "Scroll"] as const);
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

export function getScrollAxis(value: ScrollAxisName | number | null | undefined): ScrollAxisName | "Unknown" {
    return resolveEnumName(value, ["Horizontal", "Vertical"] as const);
}

export function toSerializedIdValue(value: IdValue | null | undefined): SerializedIdValue {
    return {
        value: getIdValue(value)
    };
}

export function normalizeEventName(value: string | null | undefined): string {
    return value?.trim().toLowerCase() ?? "";
}

export function normalizePropertyName(value: string | null | undefined): string {
    return value?.trim() ?? "";
}

export function createComponentPropertyKey(componentId: number, propertyKey: string): string {
    return `${componentId}:${normalizePropertyName(propertyKey)}`;
}

function createComponentEventKey(componentId: number, eventName: string): string {
    return `${componentId}:${normalizeEventName(eventName)}`;
}
