namespace NE.Standard.UI.Web.Abstractions.Rendering;

/// <summary>
/// Every <c>data-ui-*</c> attribute both halves of the platform read or write; a renderer writes one through
/// the constant, never as a literal.
/// </summary>
public static class WebAttributes
{
    /// <summary>A badge's text shown, "compact" while it fits a circle; the client writes it too for a count the page computes itself.</summary>
    public const string BadgeText = "data-ui-badge-text";

    /// <summary>The prefix a bound property's attribute carries; the rest is the property name in kebab-case.</summary>
    public const string BindingPrefix = "data-ui-bind-";

    /// <summary>
    /// The prefix on the element holding a property's validation target (<c>ValidationInto</c>); the rest is the property name
    /// in kebab-case. Without it, a patch lands on the root.
    /// </summary>
    public const string IntoPrefix = "data-ui-into-";

    public const string BindValue = "data-ui-bind-value";

    public const string Clear = "data-ui-clear";

    public const string CollapseToggle = "data-ui-collapse-toggle";

    public const string Collapsed = "data-ui-collapsed";

    public const string ColorChannel = "data-ui-color-channel";

    public const string ColorFactor = "data-ui-color-factor";

    public const string ColorFormat = "data-ui-color-format";

    public const string ColorHex = "data-ui-color-hex";

    public const string ColorHue = "data-ui-color-hue";

    public const string ColorName = "data-ui-color-name";

    public const string ColorOpacity = "data-ui-color-opacity";

    public const string ColorPalette = "data-ui-color-palette";

    public const string ColorPane = "data-ui-color-pane";

    public const string ColorPicker = "data-ui-color-picker";

    public const string ColorReadonly = "data-ui-color-readonly";

    /// <summary>A container's track bounds for a splitter's clamp: <c>index:min:max</c> per bounded track.</summary>
    public const string ColumnLimits = "data-ui-column-limits";

    public const string ColorSquare = "data-ui-color-square";

    public const string ColorTab = "data-ui-color-tab";

    public const string ColorToggle = "data-ui-color-toggle";

    public const string ColorVariant = "data-ui-color-variant";

    public const string Context = "data-ui-context";

    public const string ContextMenu = "data-ui-context-menu";

    public const string ContextMenuOwner = "data-ui-context-menu-owner";

    /// <summary>On a part inside a menu's owner: the name of the owner's menu a right press there opens, rather than its unnamed one.</summary>
    public const string ContextMenuUse = "data-ui-context-menu-use";

    public const string Dialog = "data-ui-dialog";

    public const string DialogBackdrop = "data-ui-dialog-backdrop";

    public const string DialogCloseBackdrop = "data-ui-dialog-close-backdrop";

    public const string DialogCloseEscape = "data-ui-dialog-close-escape";

    public const string DialogModal = "data-ui-dialog-modal";

    public const string EmptyPlaceholder = "data-ui-empty-placeholder";

    public const string EmptyTemplate = "data-ui-empty-template";

    /// <summary>An element no event crosses outward: a component above it never takes an event raised inside it.</summary>
    public const string EventBoundary = "data-ui-event-boundary";

    /// <summary>The attribute that says "not me, keep walking" for one event; the client's twin is <c>eventSuppressAttribute</c>.</summary>
    public static string EventSuppress(string eventName)
        => $"data-ui-no-{eventName}";

    /// <summary>The script element that carries the page's words.</summary>
    public const string Strings = "data-ui-strings";

    /// <summary>The script element that carries the hydration payload.</summary>
    public const string Hydration = "data-ui-hydration";

    /// <summary>The script element that carries the render metadata.</summary>
    public const string Metadata = "data-ui-metadata";

    public const string FallbackSrc = "data-ui-fallback-src";

    public const string FileMaxSize = "data-ui-file-max-size";

    public const string FilePick = "data-ui-file-pick";

    public const string PressRipple = "data-ui-press-ripple";

    public const string FlyoutNoBackdropClose = "data-ui-flyout-no-backdrop-close";

    public const string FlyoutNoEscapeClose = "data-ui-flyout-no-escape-close";

    public const string FormId = "data-ui-form-id";

    public const string Group = "data-ui-group";

    public const string HostMode = "data-ui-host-mode";

    /// <summary>On an items host that does not scroll itself: the element the rows are seen through is its parent, which the engines read the scroll of.</summary>
    public const string HostViewport = "data-ui-host-viewport";

    public const string GroupHeader = "data-ui-group-header";

    public const string GroupTemplate = "data-ui-group-template";

    public const string Icon = "data-ui-icon";

    public const string Id = "data-ui-id";

    /// <summary>An image input's picture, the URL its Value holds; the engine paints it unless a local preview stands in.</summary>
    public const string ImageSource = "data-ui-image-source";

    public const string ImageReadonly = "data-ui-image-readonly";

    /// <summary>
    /// A key-value row while it is being edited: its value is the input and its action the save/cancel pair.
    /// </summary>
    public const string RowEditing = "data-ui-row-editing";

    public const string InputDebounce = "data-ui-input-debounce";

    public const string Selection = "data-ui-selection";
    public const string Selected = "data-ui-selected";
    public const string SelectedKey = "data-ui-selected-key";
    public const string SelectedKeys = "data-ui-selected-keys";

    public const string ItemsHost = "data-ui-items-host";

    /// <summary>On a component's root: its bound collection goes to the client sink of this kind as values, not into an items host as rows.</summary>
    public const string CollectionSink = "data-ui-collection-sink";

    /// <summary>On an items component's query element: the viewer's filter and sort terms as JSON, the same text pushed and chosen.</summary>
    public const string ItemsQuery = "data-ui-items-query";

    /// <summary>The number culture pack as JSON; an engine formats by the nearest one above the element.</summary>
    public const string NumberCulture = "data-ui-number-culture";

    public const string Key = "data-ui-key";

    /// <summary>On an item's row: the item refuses to be chosen, dragged, removed or renamed (<c>IItemAbilitiesModel</c>).</summary>
    public const string Unselectable = "data-ui-unselectable";
    public const string Undraggable = "data-ui-undraggable";
    public const string Unremovable = "data-ui-unremovable";
    public const string Unrenamable = "data-ui-unrenamable";

    /// <summary>On a component, an item's row or a host with rows: the context menu inside is not opened (<c>ShowContextMenu</c>, <c>CanShowContextMenu</c>).</summary>
    public const string NoContextMenu = "data-ui-no-context-menu";

    /// <summary>On an element inside a row: a double click there is the element's own (a cell that opens its editor), not the row's open.</summary>
    public const string NoRowOpen = "data-ui-no-row-open";

    /// <summary>On a host with rows whose choosing is something of its own — a grid's checkboxes: a click on a row chooses nothing, the keyboard still does.</summary>
    public const string NoRowSelect = "data-ui-no-row-select";

    /// <summary>The inline image input's text for the controller's picture, read by image-input-engine.ts.</summary>
    public const string ImageCaption = "data-ui-image-caption";

    public const string MenuGroup = "data-ui-menu-group";

    public const string MenuItemKind = "data-ui-menu-item-kind";

    public const string MenuOpen = "data-ui-menu-open";

    public const string MenuShortcut = "data-ui-menu-shortcut";

    /// <summary>On a group wrapper whose entry is a select: its choices fly out beside it whatever the menu's fold (menu-group-engine.ts).</summary>
    public const string MenuSelect = "data-ui-menu-select";

    public const string Name = "data-ui-name";

    public const string NumberMax = "data-ui-number-max";

    public const string NumberMin = "data-ui-number-min";

    public const string NumberNoDecimals = "data-ui-number-no-decimals";

    public const string NumberNoNegative = "data-ui-number-no-negative";

    public const string NumberNoThousands = "data-ui-number-no-thousands";

    public const string NumberStep = "data-ui-number-step";

    public const string NumberStepDirection = "data-ui-number-step-direction";

    public const string NumberTrimZeros = "data-ui-number-trim-zeros";

    public const string Pc = "data-ui-pc";

    public const string RadioBindValueId = "data-ui-radio-bind-value-id";

    public const string RadioDisabled = "data-ui-radio-disabled";

    public const string RadioGroupName = "data-ui-radio-group-name";

    public const string RadioValue = "data-ui-radio-value";

    public const string RowLimits = "data-ui-row-limits";

    public const string ScrollAnchor = "data-ui-scroll-anchor";
    /// <summary>On a component root: the scroll group it scrolls with.</summary>
    public const string ScrollGroup = "data-ui-scroll-group";
    /// <summary>On the element a component scrolls, when that is not its root and not an items host's viewport.</summary>
    public const string ScrollViewport = "data-ui-scroll-viewport";
    /// <summary>On an element whose children are the source's lines in order, the first child line 1 — a code field's text.</summary>
    public const string ScrollLines = "data-ui-scroll-lines";
    /// <summary>On an element drawn from a source line: the line's number, from 1 — a Markdown display's block.</summary>
    public const string SourceLine = "data-ui-source-line";

    public const string SearchDebounce = "data-ui-search-debounce";

    public const string SearchManual = "data-ui-search-manual";

    public const string SearchMinLength = "data-ui-search-min-length";

    public const string SelectClear = "data-ui-select-clear";

    /// <summary>On a select-shaped trigger that is a text field: a click in it places the caret rather than closing the list.</summary>
    public const string SelectTriggerMode = "data-ui-select-trigger-mode";

    public const string SelectContent = "data-ui-select-content";

    public const string SelectValue = "data-ui-select-value";

    /// <summary>On a select-shaped root whose list opens anywhere but below from the start edge: the placement's token.</summary>
    public const string SelectPlacement = "data-ui-select-placement";

    public const string SubmitFormId = "data-ui-submit-form-id";

    /// <summary>A split button's mode — <c>split</c> or <c>menu</c> — which says whether the main part opens the menu too.</summary>
    public const string SplitMode = "data-ui-split-mode";

    /// <summary>The pixels a splitter moves per arrow press.</summary>
    public const string SplitterStep = "data-ui-splitter-step";

    /// <summary>On a table's header cell: the column's key, for the columns engine.</summary>
    public const string TableColumnKey = "data-ui-table-column-key";

    /// <summary>On a table's header cell: the viewport tier below which the column hides.</summary>
    public const string TableHideBelow = "data-ui-table-hide-below";

    /// <summary>On a table header's resize handle and on every cell: the 0-based column it belongs to.</summary>
    public const string TableColumn = "data-ui-table-column";

    /// <summary>On the header cell of a column the control owns: the viewer neither sizes it nor moves it.</summary>
    public const string TableFixed = "data-ui-table-fixed";

    public const string TabCaption = "data-ui-tab-caption";

    /// <summary>On a tree node's root: the key of the node above it.</summary>
    public const string TreeParent = "data-ui-tree-parent";

    /// <summary>On a tree node's root: the node has children even when none are in the list.</summary>
    public const string TreeChildren = "data-ui-tree-children";

    /// <summary>On a tree node's root: the node starts unfolded.</summary>
    public const string TreeExpanded = "data-ui-tree-expanded";

    /// <summary>On a tree node's root: the title a rename wrote back.</summary>
    public const string TreeTitle = "data-ui-tree-title";

    /// <summary>On a tree's root: its nodes may be renamed in place.</summary>
    public const string TreeRenamable = "data-ui-tree-renamable";

    /// <summary>On a tree's row: the node was unfolded and its children are being asked for.</summary>
    public const string TreeLoading = "data-ui-tree-loading";

    /// <summary>On a tree node's text: the key of the node it was dropped on.</summary>
    public const string TreeDropTarget = "data-ui-tree-drop-target";

    /// <summary>On a tree's root: its nodes may be dragged onto one another.</summary>
    public const string TreeDraggable = "data-ui-tree-draggable";

    /// <summary>On a tree's root: a double click renames rather than opens.</summary>
    public const string TreeRenameOnDoubleClick = "data-ui-tree-rename-dblclick";

    /// <summary>On a tree's root: the Delete key raises nothing, whatever a node says.</summary>
    public const string TreeUnremovable = "data-ui-tree-unremovable";

    public const string TabKey = "data-ui-tab-key";

    public const string TabOrder = "data-ui-tab-order";

    /// <summary>On a pinned tab's root: the strip draws its pin, hides its close and refuses to drag it.</summary>
    public const string TabPinned = "data-ui-tab-pinned";

    public const string TabPage = "data-ui-tab-page";

    public const string TabsRenamable = "data-ui-tabs-renamable";

    /// <summary>On a tabs view's root: its tabs may be reordered by dragging.</summary>
    public const string TabsDraggable = "data-ui-tabs-draggable";

    /// <summary>On a tabs view's root: its tabs cannot be closed at all: no caption shows a close, and the strip keeps no room for one.</summary>
    public const string TabsUnremovable = "data-ui-tabs-unremovable";

    public const string TabsSelected = "data-ui-tabs-selected";

    public const string Template = "data-ui-template";

    public const string TemporalAm = "data-ui-temporal-am";

    /// <summary>The temporal culture pack as JSON; an engine formats a date by the nearest one above the element.</summary>
    public const string TemporalCulture = "data-ui-temporal-culture";

    public const string TemporalDaynames = "data-ui-temporal-daynames";

    /// <summary>On a temporal input editing a period; on the second of its two fields, which holds the period's end.</summary>
    public const string TemporalRange = "data-ui-temporal-range";

    public const string TemporalEnd = "data-ui-temporal-end";

    public const string TemporalDefaultFormat = "data-ui-temporal-default-format";

    public const string TemporalFirstDay = "data-ui-temporal-first-day";

    public const string TemporalFormat = "data-ui-temporal-format";

    public const string TemporalMax = "data-ui-temporal-max";

    public const string TemporalMin = "data-ui-temporal-min";

    public const string TemporalMode = "data-ui-temporal-mode";

    public const string TemporalMonths = "data-ui-temporal-months";

    public const string TemporalMonthsGenitive = "data-ui-temporal-months-genitive";

    public const string TemporalMonthsShort = "data-ui-temporal-months-short";

    public const string TemporalPm = "data-ui-temporal-pm";

    public const string TemporalReadonly = "data-ui-temporal-readonly";

    public const string TemporalStep = "data-ui-temporal-step";

    public const string TemporalStepDirection = "data-ui-temporal-step-direction";

    public const string TemporalStepUnit = "data-ui-temporal-step-unit";

    public const string TemporalToggle = "data-ui-temporal-toggle";

    public const string TemporalWeekdays = "data-ui-temporal-weekdays";

    public const string Theme = "data-ui-theme";

    /// <summary>The hook the theme switcher's engine finds its button by; a class would be styling.</summary>
    public const string ThemeSwitcher = "data-ui-theme-switcher";

    public const string Tooltip = "data-ui-tooltip";

    public const string TooltipPlacement = "data-ui-tooltip-placement";

    public const string TrimInput = "data-ui-trim-input";

    public const string ValidationMessage = "data-ui-validation-message";

    /// <summary>Marks the one element a component keeps its value on, where that is not the element the reader starts from.</summary>
    public const string ValueHolder = "data-ui-value-holder";

    /// <summary>Names the reader that reads a written value off this element; the names are <see cref="WebValueKinds"/>.</summary>
    public const string ValueKind = "data-ui-value-kind";

    public const string Visibility = "data-ui-visibility";

    public const string VisibilityMd = "data-ui-visibility-md";

    public const string VisibilitySm = "data-ui-visibility-sm";

    public const string VisibilityXl = "data-ui-visibility-xl";

    public const string VisibilityXxl = "data-ui-visibility-xxl";

    public const string WindowMoreAfter = "data-ui-window-more-after";

    public const string WindowMoreBefore = "data-ui-window-more-before";

    public const string WindowOffset = "data-ui-window-offset";

    public const string WindowSize = "data-ui-window-size";

    /// <summary>On a windowed host: what the source computed over every item the query leaves, by property, as JSON.</summary>
    public const string WindowAggregates = "data-ui-window-aggregates";

    /// <summary>On a windowed host whose window is a page: the scroll asks for nothing, and a package's pager asks for a window by offset.</summary>
    public const string WindowPaged = "data-ui-window-paged";

    public const string WindowTotal = "data-ui-window-total";

}
