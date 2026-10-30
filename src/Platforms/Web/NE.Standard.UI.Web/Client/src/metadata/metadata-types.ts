/** A key with the arguments its `{name}` slots take, as the server's UIPhrase travels: `{key, args?}`. */
export type Phrase = {
    readonly key: string;
    readonly args?: Readonly<Record<string, unknown>> | null;
};

/** An author's text standing where a phrase may (an argument, a value), as the server's `UIPhrase.Text` travels: `{text}`. */
export type AuthorText = {
    readonly text: string;
};

/** The browser's word for its notification permission, or `unsupported` where it shows no notifications. */
type NotificationPermissionName = "unsupported" | "default" | "granted" | "denied";

/** What the server holds of the page: UIClientState. */
export type ClientState = {
    readonly visible: boolean;
    readonly notificationPermission: NotificationPermissionName;
};

/** A compiled id, a bare number on the wire. */
export type IdValue = number;

export type WebUIMetadata = {
    readonly propertyDefinitions: readonly WebRenderPropertyDefinitionMetadata[];
    readonly bindings: readonly WebRenderBindingMetadata[];
    readonly events: readonly WebRenderEventMetadata[];
    readonly interactions: readonly WebRenderInteractionMetadata[];
    readonly validations: readonly WebRenderValidationMetadata[];
    readonly validationTargets?: readonly WebRenderValidationMessageTargetMetadata[];
    // The properties a package's client may set the way a push does: a part it keeps in step with its own state.
    readonly exposedProperties?: readonly WebRenderPropertyReferenceMetadata[];
    readonly items: readonly WebRenderItemsTemplateMetadata[];
    readonly itemsFilterSort: readonly WebRenderItemsFilterSortMetadata[];
    readonly itemValues?: readonly WebRenderItemValuesMetadata[];
    // The translatable values the page was rendered with rather than bound to, which a language switch writes again.
    readonly words?: readonly WebRenderWordMetadata[];
    // In development, what the view's compile warned of — a binding naming nothing — for the page's console.
    readonly compileWarnings?: readonly string[] | null;
};

/** A static translatable value by where it landed: its component, property and row keys, and its key — a string or a phrase. */
export type WebRenderWordMetadata = {
    readonly componentId: IdValue;
    readonly propertyId: string;
    // Absent for a value every instance shares, inside an item template included.
    readonly dynamicParameters?: readonly unknown[] | null;
    readonly key: unknown;
};

export type WebRenderPropertyDefinitionMetadata = {
    readonly propertyId: string;
    readonly componentTypeKey: string;
    readonly propertyName: string;
    readonly operations: readonly WebDomOperation[];
    // The value is localizable text, looked up in the page's words before it is written.
    readonly translatable?: boolean | null;
};

/** A field that writes its validation words into another component property instead of showing them itself. */
export type WebRenderValidationMessageTargetMetadata = {
    readonly componentId: IdValue;
    readonly message: WebRenderPropertyReferenceMetadata;
};

export type WebRenderPropertyReferenceMetadata = {
    readonly componentId: IdValue;
    readonly propertyId: string;
    readonly dynamicParameterComponentIds?: readonly IdValue[];
    /** The property is translatable but this instance shows it as written (`AsContent`): a value set there is never looked up. */
    readonly content?: boolean;
};

export type WebRenderBindingMetadata = WebRenderPropertyReferenceMetadata & {
    readonly bindingId: IdValue;
    // Absent means OneWay, which is what all but a handful of a page's bindings are.
    readonly mode?: WebBindingMode;
    readonly itemTemplate?: string | null;
    readonly itemTemplateParameters?: readonly WebRenderBindingParameterMetadata[] | null;
    // An item without the property is expected — a built-in template bound to whatever items it is given — and is not worth a warning.
    readonly optional?: boolean | null;
    // What the property falls back to when the item says nothing about it; only a row the client builds needs it.
    readonly fallbackValue?: unknown;
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
    readonly fallbackTemplateKey?: string | null;
    readonly itemWrapperElementName?: string | null;
    readonly itemWrapperClassName?: string | null;
    // The role the wrapper carries (an option, a list item), so a row the client builds reads as the server's do.
    readonly itemWrapperRole?: string | null;
    // Whether a row says whether it is chosen: a row the client builds starts unchosen, the selection engine marks the chosen.
    readonly announcesSelection?: boolean | null;
    readonly composite?: WebRenderItemsCompositeMetadata | null;
    // The decorator a row the client builds goes through after its template, by kind (`row-decorators.ts`).
    readonly rowDecorator?: string | null;
    // What the host's rows carry, dotted; sent to a page in development alone, which warns of a read of anything else.
    readonly itemPaths?: readonly string[] | null;
};

export type WebRenderItemsCompositeMetadata = {
    readonly itemElementName: string;
    readonly itemClassName: string;
    readonly itemRole?: string | null;
    readonly hostSlotVariantKey?: string | null;
    readonly slots: readonly WebRenderItemsCompositeSlotMetadata[];
};

export type WebRenderItemsCompositeSlotMetadata = {
    readonly variantKey: string;
    readonly wrapperElementName: string;
    readonly wrapperClassName: string;
    readonly wrapperRole?: string | null;
    // The item property naming a typed variant of the slot (`{variantKey}:{value}`); the slot's own variant when it names none.
    readonly variantKeyPropertyName?: string | null;
    /** Attributes the wrapper carries, as the server's rows carry them. */
    readonly wrapperAttributes?: Readonly<Record<string, string>> | null;
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

/** The values behind a server-rendered items host, which the client holds no copy of. */
export type WebRenderItemValuesMetadata = {
    readonly componentId: IdValue;
    // The keys of the rows the host stands in, outermost first: a list inside every row of another has values per row.
    readonly dynamicParameters?: readonly unknown[] | null;
    readonly items: readonly WebRenderItemValue[];
};

export type WebRenderItemValue = {
    readonly key: string;
    readonly item: unknown;
};

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
    // Sent only as false, for a command whose press is never marked pending (`UICommandAttribute.ShowsPending`).
    readonly showsPending?: boolean;
};

type WebRenderEventAddress = {
    readonly componentId: IdValue;
    readonly eventName: string;
    // A row's own interaction: the key of the row whose event alone fires it — a menu entry's press, in place of its command.
    readonly rowKey?: string | null;
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

export type WebInteractionActionKindName = "SetProperty" | "Effect" | "CopyValue";
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
    | "In"
    | "Regex"
    | "LikeIgnoreCase"
    | "RegexEach";
export type WebInteractionOperator = WebInteractionOperatorName | number;

type WebRenderValidationTargetMetadata = {
    readonly componentId: IdValue;
    readonly propertyId: string;
};

export type WebValidationTriggerName = "Change" | "Blur" | "Submit";
export type WebValidationTrigger = WebValidationTriggerName | number;

export type WebValidationSeverityName = "Error" | "Warning" | "Info";
export type WebValidationSeverity = WebValidationSeverityName | number;

export type WebRenderValidationMetadata = {
    readonly target: WebRenderValidationTargetMetadata;
    readonly trigger: WebValidationTrigger;
    readonly operator: WebInteractionOperator;
    readonly value?: unknown;
    // The field compared with in place of `value`, read as its value holder: the judged field's row's, else the one in no row.
    readonly valueSource?: { readonly componentId: IdValue } | null;
    readonly severity: WebValidationSeverity;
    // The author's text (`{text}`) or a phrase (`{key, args}`), resolved in the page's language when the rule fails.
    readonly message: AuthorText | Phrase;
};

export type WebDomOperation = {
    readonly kind: WebDomOperationKind;
    readonly target?: string | null;
    readonly name?: string | null;
    readonly converter?: string | null;
    readonly condition?: WebValueCondition | null;
    // What a toggled attribute is written with; absent, the value itself.
    readonly value?: string | null;
    // The target is a part only some instances render; an instance without it is not worth a warning.
    readonly optional?: boolean | null;
    // The converter decides a null value too, rather than null removing the attribute before it is asked.
    readonly convertsNull?: boolean | null;
};

type WebDomOperationKindName =
    | "Text"
    | "Attribute"
    | "RemoveAttribute"
    | "ToggleAttribute"
    | "Class"
    | "ToggleClass"
    | "Style"
    | "Data"
    | "Property"
    | "Markup";
/** A built-in kind by name or number, or the name a package registered its own under. */
export type WebDomOperationKind = WebDomOperationKindName | number | (string & {});

export type WebValueConditionName =
    | "None"
    | "HasValue"
    | "HasText"
    | "IsTrue"
    | "IsFalse"
    // An icon value that draws: a glyph name with a letter or digit, or a picture the page may load (`toIconClassName`).
    | "DrawsIcon";
export type WebValueCondition = WebValueConditionName | number;

type UIComponentAddress = {
    readonly id: IdValue;
    readonly dynamicParameters?: readonly unknown[];
};

export type UIPropertyAddress = {
    readonly component: UIComponentAddress;
    readonly property: string;
};

export type ServerChangeSet = {
    readonly updates?: readonly ServerUIUpdate[];
};

export type UIUpdateKindName =
    | "Value"
    | "CollectionChange"
    | "FullResync"
    | "Validation"
    | "Page";

type UIUpdateKindValue = UIUpdateKindName | number;

export type ServerUIUpdate =
    | ServerValueUIUpdate
    | ServerCollectionChangeUIUpdate
    | ServerFullResyncUIUpdate
    | ServerValidationUIUpdate
    | ServerPageUIUpdate
    | UnknownServerUIUpdate;

export type ServerValueUIUpdate = {
    readonly kind: UIUpdateKindValue;
    readonly address: UIPropertyAddress;
    readonly value?: unknown;
    /** The token of a value staged beside the hub, fetched before the change set is applied; the value comes that way instead. */
    readonly valueToken?: string;
    /** Words read off an item marked content: shown as written, never looked up — at this push or a later switch. */
    readonly content?: boolean;
};

export type ServerValidationUIUpdate = {
    readonly kind: UIUpdateKindValue;
    readonly address: UIPropertyAddress;
    /** The author's text or a key as a plain string, or a phrase. */
    readonly message?: string | Phrase | null;
    readonly severity?: WebValidationSeverity;
    /** The input's own refusal words marked content (`AsContent`): shown as written, never looked up. */
    readonly content?: boolean;
};

/** What the page as a whole holds: whether its controller says it holds work its reader has not saved. */
export type ServerPageUIUpdate = {
    readonly kind: UIUpdateKindValue;
    readonly holdsUnsavedWork?: boolean;
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
    /** A remove that is a window's trim: the rows leave the page, not the source. */
    readonly trimmed?: boolean;
};

type ServerFullResyncUIUpdate = {
    readonly kind: UIUpdateKindValue;
};

type UnknownServerUIUpdate = {
    readonly kind: UIUpdateKindValue;
    readonly [key: string]: unknown;
};

export type UICommandRequest = {
    // Zero where the request runs an offered action in place of an event.
    readonly eventId: IdValue;
    // The id of an action the server offered the page (a notification's), run once.
    readonly action?: string;
    readonly dynamicParameters: readonly unknown[];
    // The keys staged beside the hub, in place of `dynamicParameters`, where they are too large for it (docs/VALUES.md §2).
    readonly dynamicParametersToken?: string;
    // Echoed on a background command's pushed result; the dispatcher gives one to every request it sends.
    readonly requestId?: number;
};

export type UICommandExecutionResult = {
    readonly command?: UICommandResult;
    readonly changes?: ServerChangeSet;
    // A background command answers only that it was accepted, and pushes its result carrying the request's id.
    readonly accepted?: boolean;
    // The server turned the command away before it ran (busy, not allowed, no longer offered), rather than running it and failing.
    readonly refused?: boolean;
    readonly requestId?: number;
};

type UICommandResult = {
    readonly success?: boolean;
    readonly error?: string | null;
    readonly effects?: readonly ClientEffect[];
    readonly [key: string]: unknown;
};

export type ClientEffectKindName =
    | "Navigate"
    | "NavigateBack"
    | "Focus"
    | "ScrollTo"
    | "ScrollToItem"
    | "OpenDialog"
    | "CloseDialog"
    | "ShowNotification"
    | "Announce"
    | "DownloadFile"
    | "Scroll"
    | "SetTheme"
    | "SetThemeColors"
    | "RenameItem"
    | "CopyToClipboard"
    | "InsertText"
    | "DiscardForm"
    | "OpenPicker"
    | "SetLanguage"
    | "ConfirmLeave"
    | "ReplaceAddress"
    | "PushAddress"
    | "RequestNotificationPermission"
    | "ShowSystemNotification"
    | "ShowImage"
    | "DevelopmentReport";

// Open, not a closed set: a package may name its own kind; the union above is the built-in vocabulary.
export type ClientEffectKindValue = ClientEffectKindName | (string & {});

export type ScrollToBehaviorName = "Auto" | "Smooth";

export type ScrollToBlockName = "Start" | "Center" | "End" | "Nearest";

export type ScrollPositionName = "Start" | "End" | "Offset" | "PageBack" | "PageForward";

export type ScrollAxisName = "Horizontal" | "Vertical";

type ClientEffectTarget = {
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

/** The browser's Back where the entry behind is of this site, else the address of this site it names. */
export type NavigateBackClientEffect = ClientEffect & {
    readonly fallback?: string;
};

/** Writes the page's query from its parameters while the route stays: in place (`ReplaceAddress`) or as a new entry (`PushAddress`). */
export type AddressClientEffect = ClientEffect & {
    readonly parameters?: Record<string, unknown> | null;
};

/** Opens the inline rename field on one item of a host that renames its items in place (a tree, a tabs view), named by its key. */
export type RenameItemClientEffect = TargetedClientEffect & {
    readonly key?: string;
};

/** Copies a literal, or the value the addressed component holds when the effect runs. */
export type CopyToClipboardClientEffect = TargetedClientEffect & {
    readonly text?: string | null;
};

/** Puts a literal, or the key of the row whose press raised it, into the addressed field at its caret. */
export type InsertTextClientEffect = TargetedClientEffect & {
    readonly text?: string | null;
    readonly itemKey?: boolean;
};

export type ScrollToClientEffect = TargetedClientEffect & {
    readonly behavior?: ScrollToBehaviorName | number;
    readonly block?: ScrollToBlockName | number;
};

/** Brings the row of an items host whose item has `key` into view, its group header with it, and holds it there until the reader scrolls. */
export type ScrollToItemClientEffect = TargetedClientEffect & {
    readonly key?: string;
    readonly block?: ScrollToBlockName | number;
    readonly behavior?: ScrollToBehaviorName | number;
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

/** Lets go of the edits a form's `OnSubmit` fields hold, so they show the server's values again. */
export type DiscardFormClientEffect = ClientEffect & {
    readonly formId?: string;
};

/** Asks in the framework's own dialog whether to leave a page holding unsaved work for its target. */
export type ConfirmLeaveClientEffect = ClientEffect & {
    readonly target?: string;
};

export type DialogClientEffect = ClientEffect & {
    readonly dialogKey?: string;
    /** A close that is the viewer's own (an × in the dialog), raising the dialog's close as Escape does. */
    readonly raisesClose?: boolean;
};

export type ThemeModeName = "Light" | "Dark";

/** Switches the page to a language in place, and — raised on the page — tells the session. */
export type SetLanguageClientEffect = ClientEffect & {
    readonly language?: string;
    // Where the words are, named by the server on a switch it pushed for a session that already holds the language.
    readonly href?: string | null;
};

export type SetThemeClientEffect = ClientEffect & {
    // Absent is the third answer and not a member of the enum: no preference means follow the platform.
    readonly mode?: ThemeModeName | number | null;
    // Set by the server on a switch it pushed for a session that already holds the theme: the page does not report it back.
    readonly stored?: boolean;
};

/** The reader's own colours as the server wrote them (`UIThemeColorsJsonConverter`): handed back to the session as they came. */
export type ThemeColorsModel = {
    readonly lightPrimary?: string;
    readonly lightAccent?: string;
    readonly darkPrimary?: string;
    readonly darkAccent?: string;
};

export type SetThemeColorsClientEffect = ClientEffect & {
    // Absent is the application's palette.
    readonly colors?: ThemeColorsModel | null;
    // The stylesheet they make, named by the server on a switch it pushed for a session that already holds them; empty for none.
    readonly css?: string | null;
};

export type NotificationClientEffect = ClientEffect & {
    /** The words: a key with its arguments, or the author's text looked up by the plain rule. */
    readonly message?: Phrase | AuthorText;
    // The `UIColorStyle` it is drawn in, by name or number: a Warning's or a Danger's is said as an alert.
    readonly tone?: string | number;
    // How long it stands, which is its action's window; absent is the page's default.
    readonly durationMs?: number;
    readonly action?: NotificationActionModel;
};

/** A notification of the system's: ShowSystemNotificationEffect. */
export type SystemNotificationClientEffect = ClientEffect & {
    readonly title?: Phrase | AuthorText;
    readonly body?: Phrase | AuthorText;
    readonly tag?: string;
    readonly icon?: string;
    readonly address?: string;
    // The words of the fallback toast's button that leads to the address; none for the framework's "Open".
    readonly addressTitle?: Phrase | AuthorText;
    readonly silent?: boolean;
    readonly requireInteraction?: boolean;
    // The command a click runs, offered for one press; its words are the fallback toast's button.
    readonly action?: NotificationActionModel;
    readonly when?: "WhenHidden" | "Always";
    readonly fallback?: "Toast" | "None";
};

/** A notification's one button: its words, its look, and the id of the command the server offered for one press; no id, no button. */
export type NotificationActionModel = {
    readonly title?: Phrase | AuthorText;
    readonly id?: string;
    readonly variant?: string | number;
};

/** One picture a lightbox shows: its address, and the words under it and for a screen reader. */
type LightboxImageModel = {
    readonly source?: string;
    readonly caption?: Phrase | AuthorText;
    readonly altText?: Phrase | AuthorText;
};

/** Shows pictures full size over the page: the ones given, or read off the target component — with its other drawn rows' where `rows`. */
export type ShowImageClientEffect = TargetedClientEffect & {
    readonly images?: readonly LightboxImageModel[];
    readonly startIndex?: number;
    readonly rows?: boolean;
};

/** An author's mistake the runtime found, in Development: written to the console, never shown. */
export type DevelopmentReportClientEffect = ClientEffect & {
    readonly message?: string;
};

export type AnnouncePolitenessName = "Polite" | "Assertive";

/** Words a screen reader speaks and the page shows nothing of. */
export type AnnounceClientEffect = ClientEffect & {
    /** The words: a key with its arguments, or the author's text looked up by the plain rule. */
    readonly message?: Phrase | AuthorText;
    readonly politeness?: AnnouncePolitenessName | number;
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
    readonly clientWindowId: string;
    readonly route: string;
    /** The runtime the shell render prepared for this page, when it prepared one. */
    readonly pageId: string | null;
    /** The compile the page was rendered from, for the server to refuse a page of another. */
    readonly view: string | null;
    /** Where the prepared runtime stood when the render read it, on the page's first attach: only what moved past it is sent. */
    readonly since: number | null;
    /** The runtime the page's last attach was answered with, on any attach after its first; null on the first. */
    readonly runtime: string | null;
    readonly parameters: Record<string, unknown> | null;
    /** The IANA zone the browser runs in, kept on the session; null where the browser names none. */
    readonly timeZone: string | null;
    /** What the page is now: on screen or not, and what the browser lets it show. */
    readonly clientState: ClientState;
    /** The page goes to another runtime of its route, the one its address now names, leaving the one it holds. */
    readonly switchRuntime: boolean;
};

export type WebUIAttachResult = {
    readonly initialChanges?: ServerChangeSet;
    /** The page was rendered from another compile of its view, or under a session the server no longer holds: reload rather than apply. */
    readonly reload?: boolean;
    /** The runtime the page attached to, which its later attaches present. */
    readonly runtime?: string;
    /** The runtime the page held is gone (a restart, an eviction, a retention run out): what it shows belongs to nothing, so it reloads. */
    readonly fresh?: boolean;
    /** How long the server keeps the runtime after the page's connection drops, which the reconnect tries for; none where it does not say. */
    readonly retentionMilliseconds?: number;
};

export type WebUIValueChangeRequest = {
    readonly componentId: number;
    readonly propertyName: string;
    readonly dynamicParameters: readonly unknown[];
    readonly value?: unknown;
    /** The token of a value staged beside the hub, sent instead of `value` when the value is large. */
    readonly valueToken?: string;
};

export type WebUIChangeSetRequest = {
    readonly updates: readonly WebUIValueChangeRequest[];
};
