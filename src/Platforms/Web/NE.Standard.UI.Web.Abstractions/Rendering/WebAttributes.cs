namespace NE.Standard.UI.Web.Abstractions.Rendering;

/// <summary>
/// Every <c>data-ui-*</c> attribute both halves of the platform read or write; a renderer writes one through
/// the constant, never as a literal.
/// </summary>
public static class WebAttributes
{
    /// <summary>A badge's text shown, "compact" while it fits a circle; the client writes it too for a count the page computes itself.</summary>
    public const string BadgeText = "data-ui-badge-text";

    /// <summary>A badge's text given at all, blank included: an empty text is a badge with nothing to say, which a menu's icon corner draws as a dot.</summary>
    public const string BadgeSet = "data-ui-badge-set";

    /// <summary>
    /// On a text body's component root while its title, its description, its icon, its badge's icon or its badge's text shows
    /// (<c>TextContentRendererBase</c>, <c>BadgeRenderer</c>): one element says what the body shows, so a host lays out by it alone.
    /// </summary>
    public const string TextTitle = "data-ui-text-title";

    public const string TextDescription = "data-ui-text-description";

    public const string TextIcon = "data-ui-text-icon";

    // Two marks, not one both badge properties assert: the client's tally of one mark knows nothing of the first paint, so clearing
    // one of the two the first paint wrote would take the mark off.
    public const string TextBadgeIcon = "data-ui-text-badge-icon";

    public const string TextBadgeText = "data-ui-text-badge-text";

    /// <summary>On the element inline markup was written into while it holds a fold (<c>[caption]{text}</c>), which then wraps.</summary>
    public const string Folds = "data-ui-folds";

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

    public const string ColorNoPalette = "data-ui-color-no-palette";

    public const string ColorNoPicker = "data-ui-color-no-picker";

    public const string ColorOpacity = "data-ui-color-opacity";

    public const string ColorPane = "data-ui-color-pane";

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

    /// <summary>On a context menu's owner, or a part of it naming one of its menus: the action bar's alignment above it (<c>SetActionBar</c>).</summary>
    public const string ActionBar = "data-ui-action-bar";

    /// <summary>On an action bar's host: its "more" opens the menu without the entries the bar shows (<c>ActionBarRepeatInMore</c> off).</summary>
    public const string ActionBarRest = "data-ui-action-bar-rest";

    /// <summary>On a menu entry: it also stands in its owner's action bar (<c>InActionBar</c>).</summary>
    public const string InActionBar = "data-ui-in-action-bar";

    public const string Dialog = "data-ui-dialog";

    public const string DialogBackdrop = "data-ui-dialog-backdrop";

    public const string DialogCloseBackdrop = "data-ui-dialog-close-backdrop";

    public const string DialogCloseEscape = "data-ui-dialog-close-escape";

    public const string DialogModal = "data-ui-dialog-modal";

    /// <summary>The edge a dialog shown as a sheet stands against; a bottom sheet the viewer may dismiss is swiped down.</summary>
    public const string DialogPlacement = "data-ui-dialog-placement";

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

    /// <summary>A link's address, kept while the link is disabled or loading and has no <c>href</c> to open from the browser's own menu.</summary>
    public const string Href = "data-ui-href";

    /// <summary>The shell's root element, which the page's content sits in.</summary>
    public const string Root = "data-ui-root";

    /// <summary>
    /// On the shell's root when the page stands in for the one asked for (a sign-in, not-found or error page at the address
    /// that led there): the route and parameters it was rendered for, which the runtime attaches to instead of the address.
    /// </summary>
    public const string Navigation = "data-ui-navigation";

    /// <summary>The script element that carries the render metadata.</summary>
    public const string Metadata = "data-ui-metadata";

    public const string FallbackSrc = "data-ui-fallback-src";

    public const string FileMaxSize = "data-ui-file-max-size";

    public const string FilePick = "data-ui-file-pick";

    /// <summary>On a file or image input: the component id whose dropped and pasted files the input takes (<c>DropTargetId</c>).</summary>
    public const string FileDropTargetId = "data-ui-file-drop-target-id";

    public const string PressRipple = "data-ui-press-ripple";

    /// <summary>On <c>&lt;html&gt;</c>: the framework's service worker's address, where the application turned system notifications on.</summary>
    public const string ServiceWorker = "data-ui-service-worker";

    /// <summary>On <c>&lt;html&gt;</c>: the application's own worker imports the framework's, so the page waits for it instead of registering.</summary>
    public const string ServiceWorkerImported = "data-ui-service-worker-imported";

    public const string FlyoutNoBackdropClose = "data-ui-flyout-no-backdrop-close";

    public const string FlyoutNoEscapeClose = "data-ui-flyout-no-escape-close";

    /// <summary>
    /// On a focusable layer that takes the keyboard back from a field in it as Enter or Escape leaves the field (a canvas, a panel
    /// over it), as a dialog's surface and a flyout's panel do.
    /// </summary>
    public const string FocusHolder = "data-ui-focus-holder";

    public const string FormId = "data-ui-form-id";

    /// <summary>The hidden holder of the page's <c>FormId</c> forms (<see cref="WebForms"/>), beside the root rather than in it.</summary>
    public const string FormsHolder = "data-ui-forms";

    public const string Group = "data-ui-group";

    public const string HostMode = "data-ui-host-mode";

    /// <summary>On an items host that does not scroll itself: the element the rows are seen through is its parent, which the engines read the scroll of.</summary>
    public const string HostViewport = "data-ui-host-viewport";

    public const string GroupHeader = "data-ui-group-header";

    /// <summary>On a group header: the key of the row it is drawn from, which its components stand in as a row's stand in its key.</summary>
    public const string GroupAnchor = "data-ui-group-anchor";

    public const string GroupTemplate = "data-ui-group-template";

    public const string Icon = "data-ui-icon";

    public const string Id = "data-ui-id";

    /// <summary>An image input's picture, the URL its Value holds; the engine paints it unless a local preview stands in.</summary>
    public const string ImageSource = "data-ui-image-source";

    /// <summary>
    /// A key-value row while it is being edited: its value is the input and its action the save/cancel pair.
    /// </summary>
    public const string RowEditing = "data-ui-row-editing";

    /// <summary>
    /// An item's row whose template root — its child, or its grandchild through a wrapper — renders disabled or loading: the row answers
    /// no pointer. The client keeps it as the root's state changes (<c>row-idle.ts</c>).
    /// </summary>
    public const string RowIdle = "data-ui-row-idle";

    /// <summary>On a breadcrumbs step's wrapper: the tiers its step is collapsed in — <c>base sm md xl xxl</c> — where the wrapper goes too.</summary>
    public const string StepCollapsed = "data-ui-step-collapsed";

    /// <summary>
    /// On a breadcrumbs step's wrapper: the tiers in which no shown step follows it, where it draws no separator. The client keeps both
    /// marks as steps come, go and change Visibility (<c>breadcrumbs-engine.ts</c>).
    /// </summary>
    public const string StepEnd = "data-ui-step-end";

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

    /// <summary>
    /// On an element whose number and temporal culture packs are the page's: a language switch writes them again from the words
    /// table, and what formats by them draws again — a number field, a grid's cells.
    /// </summary>
    public const string PageCulture = "data-ui-page-culture";

    /// <summary>On a pager's root: the compiled id of the host whose pages it turns (<c>PagerComponent.Target</c>).</summary>
    public const string PagerTarget = "data-ui-pager-target";

    /// <summary>On a pager's button: the page it turns to — <c>first</c>, <c>previous</c>, <c>next</c>, <c>last</c>, or a page's number.</summary>
    public const string PagerPage = "data-ui-pager-page";

    /// <summary>On a pager's page-size choice: the rows a page holds with it.</summary>
    public const string PagerSize = "data-ui-pager-size";

    /// <summary>On a number input's root: the author's display format (a .NET numeric format such as <c>N2</c>) the client writes the value in.</summary>
    public const string NumberFormat = "data-ui-number-format";

    public const string Key = "data-ui-key";

    /// <summary>On an item's row: the item refuses to be chosen, dragged, removed or renamed (<c>IItemAbilitiesModel</c>).</summary>
    public const string Unselectable = "data-ui-unselectable";
    public const string Undraggable = "data-ui-undraggable";
    public const string Unremovable = "data-ui-unremovable";
    public const string Unrenamable = "data-ui-unrenamable";

    /// <summary>On a component, an item's row or a host with rows: the context menu inside is not opened (<c>ShowContextMenu</c>, <c>CanShowContextMenu</c>).</summary>
    public const string NoContextMenu = "data-ui-no-context-menu";

    /// <summary>
    /// On an element inside a row: a double click there is the element's own (a cell that opens its editor), not the row's open, and a
    /// control in it (a grid's chevron) never stands for the row the keyboard presses.
    /// </summary>
    public const string NoRowOpen = "data-ui-no-row-open";

    /// <summary>On a host with rows whose choosing is something of its own — a grid's checkboxes: a click on a row chooses nothing, the keyboard still does.</summary>
    public const string NoRowSelect = "data-ui-no-row-select";

    /// <summary>The inline image input's text for the controller's picture, read by image-input-engine.ts.</summary>
    public const string ImageCaption = "data-ui-image-caption";

    /// <summary>On an image input's root: the frame a chosen picture is cropped to before it uploads, <c>square</c> or <c>circle</c>.</summary>
    public const string ImageCrop = "data-ui-image-crop";

    /// <summary>On an image input's root beside <see cref="ImageCrop"/>: the side, in pixels, the cropped picture is written at.</summary>
    public const string ImageCropSize = "data-ui-image-crop-size";

    /// <summary>
    /// On a surface whose background picture is blurred: it draws the blur's layer and isolates its stacking
    /// (<c>mixins/surface-image.less</c>), and a popup inside it is lifted into the top layer (<c>anchored-popup.ts</c>).
    /// </summary>
    public const string SurfaceImageBlur = "data-ui-surface-image-blur";

    public const string MenuGroup = "data-ui-menu-group";

    public const string MenuItemKind = "data-ui-menu-item-kind";

    public const string MenuOpen = "data-ui-menu-open";

    /// <summary>
    /// On a group wrapper holding the current entry, its own or one below: a folded group wears the mark of a current page inside. The
    /// client keeps it as an entry's Selected changes and as rows come and go (<c>menu-current.ts</c>).
    /// </summary>
    public const string MenuHoldsCurrent = "data-ui-menu-holds-current";

    /// <summary>
    /// On a menu's host where an entry of its own carries an icon: an entry without one keeps the icon's room, so the words line up. The
    /// client keeps it as an entry's icon changes and as rows come and go (<c>menu-icons.ts</c>).
    /// </summary>
    public const string MenuIcons = "data-ui-menu-icons";

    /// <summary>On a menu row whose entry is a caption or a rule: along a bar it takes its own width, not an entry's.</summary>
    public const string MenuPassiveRow = "data-ui-menu-passive";

    /// <summary>On a menu entry showing its chord at its end; <c>shortcut-engine.ts</c> keeps it as it writes the words.</summary>
    public const string MenuItemShortcut = "data-ui-menu-item-shortcut";

    /// <summary>
    /// On a right-click menu's host or a split button's list whose menu has a Surface: that surface (<c>background</c>, <c>raised</c>,
    /// <c>tinted</c>), which names the popup's ground. The client keeps it as the Surface changes (<c>menu-surface.ts</c>).
    /// </summary>
    public const string MenuSurface = "data-ui-menu-surface";

    /// <summary>
    /// On a button or a menu entry: the key chord that presses it, read by the page's shortcut registry (<c>shortcut-engine.ts</c>).
    /// </summary>
    public const string Shortcut = "data-ui-shortcut";

    /// <summary>On a range slider: the least distance between its two handles, which neither passes (range-value-engine.ts).</summary>
    public const string SliderMinDistance = "data-ui-slider-min-distance";

    /// <summary>On a group wrapper whose entry is a select: its choices fly out beside it whatever the menu's fold (menu-group-engine.ts).</summary>
    public const string MenuSelect = "data-ui-menu-select";

    /// <summary>On a menu with a search beside its switch, which menu-search-engine.ts narrows the entries by.</summary>
    public const string MenuSearch = "data-ui-menu-search";

    /// <summary>On the button that opens a side as a drawer, naming the side's region; and on the root while one is open (side-drawer-engine.ts).</summary>
    public const string DrawerToggle = "data-ui-drawer-toggle";

    /// <summary>The id a side's region carries where it is a drawer, which the buttons opening it name in <c>aria-controls</c>.</summary>
    public static string DrawerId(string side)
        => "ui-" + side;

    /// <summary>On each band of the page — header, sides, content, footer — naming it; a side's drawer is found by it.</summary>
    public const string Region = "data-ui-region";
    public const string DrawerOpen = "data-ui-drawer-open";

    /// <summary>On what an open drawer dims the page under; a press on it closes the drawer.</summary>
    public const string DrawerBackdrop = "data-ui-drawer-backdrop";

    /// <summary>
    /// On a left side that is a rail alone (<c>UIMenuDisplay.Rail</c>): below the drawer breakpoint it is a bar along the page's
    /// bottom rather than a drawer, and its groups fly out upward (menu-group-engine.ts).
    /// </summary>
    public const string BottomBar = "data-ui-bottom-bar";

    /// <summary>
    /// On a left side that is a rail alone where the view keeps it a drawer (<c>UIViewOptions.RailBottomBar</c> off): below the drawer
    /// breakpoint its rail is drawn as a list (menu-group-engine.ts).
    /// </summary>
    public const string RailDrawer = "data-ui-rail-drawer";

    /// <summary>
    /// On the root where the content region's root fills the height, which keeps the regions' own scroll on a phone: the shell writes
    /// it from the first value, <c>content-fills.ts</c> as that root's <c>Height</c> changes.
    /// </summary>
    public const string ContentFills = "data-ui-content-fills";

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

    /// <summary>On a search's field whose list is the server's answer to <c>OnSearch</c>: the client narrows nothing and shows that answer.</summary>
    public const string SearchAnswered = "data-ui-search-answered";

    public const string SelectClear = "data-ui-select-clear";

    /// <summary>On a multi-select's chip: the key of the option it stands for.</summary>
    public const string SelectChip = "data-ui-select-chip";

    /// <summary>On a multi-select's chips host while a chip stands: the render's first paint, the client's after each change.</summary>
    public const string SelectChips = "data-ui-select-chips";

    /// <summary>On a multi-select's root: how many options it takes at most.</summary>
    public const string SelectMax = "data-ui-select-max";

    /// <summary>On a multi-select's root that takes the reader's own text as chips: its entry is the control the reader types in.</summary>
    public const string SelectFreeText = "data-ui-select-free-text";

    /// <summary>On a free-text multi-select whose first suggestion Enter takes: <c>first-suggestion</c>; absent, the typed text.</summary>
    public const string SelectTagEntry = "data-ui-select-tag-entry";

    public const string SelectContent = "data-ui-select-content";

    public const string SelectValue = "data-ui-select-value";

    /// <summary>On a select-shaped root whose list opens anywhere but below from the start edge: the placement's token.</summary>
    public const string SelectPlacement = "data-ui-select-placement";

    public const string SubmitFormId = "data-ui-submit-form-id";

    /// <summary>On a text area whose Enter presses its form's submit button, Shift+Enter breaking the line.</summary>
    public const string SubmitOnEnter = "data-ui-submit-on-enter";

    /// <summary>On a one-line field with <c>OnEnter</c>: Enter commits the value and raises <c>enter</c>, and the field keeps the focus.</summary>
    public const string RunsOnEnter = "data-ui-runs-on-enter";

    /// <summary>On a text field with <c>OnEscape</c>: Escape puts back its last committed value, leaves it and raises <c>escape</c>.</summary>
    public const string RunsOnEscape = "data-ui-runs-on-escape";

    /// <summary>A split button's mode — <c>split</c> or <c>menu</c> — which says whether the main part opens the menu too.</summary>
    public const string SplitMode = "data-ui-split-mode";

    /// <summary>On a split button whose menu opens anywhere but below from its end: the placement's token.</summary>
    public const string SplitPlacement = "data-ui-split-placement";

    /// <summary>The pixels a splitter moves per arrow press.</summary>
    public const string SplitterStep = "data-ui-splitter-step";

    /// <summary>On a table's header cell: the column's key, for the columns engine.</summary>
    public const string TableColumnKey = "data-ui-table-column-key";

    /// <summary>On a table's header cell: the viewport tier below which the column hides.</summary>
    public const string TableHideBelow = "data-ui-table-hide-below";

    /// <summary>On a table's header cell: the author starts the column hidden at every width, which the viewer's own word outranks.</summary>
    public const string TableStartsHidden = "data-ui-table-starts-hidden";

    /// <summary>
    /// On a table's root: the indices of the columns hidden now, which the stylesheet puts out of sight — the author's hidden ones at
    /// render, then the columns engine's reading of them, the tiers and the viewer's word.
    /// </summary>
    public const string TableHidden = "data-ui-table-hidden";

    /// <summary>On a table header's resize handle and on every cell: the 0-based column it belongs to.</summary>
    public const string TableColumn = "data-ui-table-column";

    /// <summary>On the header cell of a column the control owns: the viewer neither sizes it nor moves it.</summary>
    public const string TableFixed = "data-ui-table-fixed";

    public const string TabCaption = "data-ui-tab-caption";

    /// <summary>On a tree node's root: the key of the node above it.</summary>
    public const string TreeParent = "data-ui-tree-parent";

    /// <summary>On a tree node's root: the node has children even when none are in the list.</summary>
    public const string TreeChildren = "data-ui-tree-children";

    /// <summary>On a tree node's root: <c>true</c> for a folder a drag drops onto even while empty, <c>false</c> for a node that takes none.</summary>
    public const string TreeFolder = "data-ui-tree-folder";

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

    /// <summary>
    /// On an items view's or a table's root: its rows may be dragged to another place among them, or moved by Alt with an arrow along
    /// the way they lie.
    /// </summary>
    public const string RowsDraggable = "data-ui-rows-draggable";

    /// <summary>On an items view's, a table's or a tree's root: a row's removal raises a command, so the Delete key raises it.</summary>
    public const string RowsRemove = "data-ui-rows-remove";

    /// <summary>On an items view's or a table's root: a row is dragged only by its grip (<c>DragHandle</c>), at whichever edge it stands.</summary>
    public const string RowsDragHandle = "data-ui-rows-drag-handle";

    /// <summary>On a drag source's root (<c>DragKind</c>): the kind its rows are offered as, dragged or cut out of it.</summary>
    public const string DragKind = "data-ui-drag-kind";

    /// <summary>On a drag source's root: what a drop may do with its rows, <c>move</c>, <c>copy</c> or both, space-separated.</summary>
    public const string DragEffects = "data-ui-drag-effects";

    /// <summary>On a drag source's root: the id the view gave it, which a drop names as its source; absent for a host given none.</summary>
    public const string DragSource = "data-ui-drag-source";

    /// <summary>On a part inside a row that is not the row's to lift — a grid's open detail: a press there never drags the row.</summary>
    public const string NoRowDrag = "data-ui-no-row-drag";

    /// <summary>On a tree's root: a double click renames rather than opens.</summary>
    public const string TreeRenameOnDoubleClick = "data-ui-tree-rename-dblclick";

    /// <summary>On a tree's root: the Delete key raises nothing, whatever a node says.</summary>
    public const string TreeUnremovable = "data-ui-tree-unremovable";

    public const string TabKey = "data-ui-tab-key";

    /// <summary>On a pinned tab's root: the strip draws its pin, hides its close and refuses to drag it.</summary>
    public const string TabPinned = "data-ui-tab-pinned";

    public const string TabPage = "data-ui-tab-page";

    public const string TabsRenamable = "data-ui-tabs-renamable";

    /// <summary>On a tabs view's root: its tabs may be reordered by dragging.</summary>
    public const string TabsDraggable = "data-ui-tabs-draggable";

    /// <summary>On a tabs view's root: the built-in entries its tab menu offers, as space-separated tokens — <c>rename pin delete</c>.</summary>
    public const string TabsMenu = "data-ui-tabs-menu";

    /// <summary>On a tabs view's root: a tab's close raises a command, so its tab menu may offer the remove entry.</summary>
    public const string TabsRemoves = "data-ui-tabs-removes";

    /// <summary>On a tabs view's root: its tabs cannot be closed at all: no caption shows a close, and the strip keeps no room for one.</summary>
    public const string TabsUnremovable = "data-ui-tabs-unremovable";

    /// <summary>On a tabs view's root while none of its tabs can be closed: the strip keeps no room for a close (<c>tabs-view-engine.ts</c> keeps it).</summary>
    public const string TabsNoneRemovable = "data-ui-tabs-none-removable";

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

    /// <summary>A day input's marked days, each <c>yyyy-MM-dd</c>, separated by spaces.</summary>
    public const string TemporalMarkedDays = "data-ui-temporal-marked-days";

    /// <summary>On a day input that offers only its marked days: every other day is disabled.</summary>
    public const string TemporalMarkedOnly = "data-ui-temporal-marked-only";

    public const string TemporalMax = "data-ui-temporal-max";

    public const string TemporalMin = "data-ui-temporal-min";

    public const string TemporalMode = "data-ui-temporal-mode";

    public const string TemporalMonths = "data-ui-temporal-months";

    public const string TemporalMonthsGenitive = "data-ui-temporal-months-genitive";

    public const string TemporalMonthsShort = "data-ui-temporal-months-short";

    /// <summary>On a temporal input whose culture is the page's: a language switch writes its names and default format again.</summary>
    public const string TemporalPageCulture = "data-ui-temporal-page-culture";

    public const string TemporalPm = "data-ui-temporal-pm";

    public const string TemporalStep = "data-ui-temporal-step";

    public const string TemporalStepDirection = "data-ui-temporal-step-direction";

    public const string TemporalStepUnit = "data-ui-temporal-step-unit";

    public const string TemporalToggle = "data-ui-temporal-toggle";

    public const string TemporalWeekdays = "data-ui-temporal-weekdays";

    /// <summary>On a timestamp: how the page writes its instant — <c>date-time</c>, <c>date</c>, <c>time</c> or <c>relative</c>.</summary>
    public const string TimestampFormat = "data-ui-timestamp-format";

    public const string Theme = "data-ui-theme";

    /// <summary>On the <c>style</c> in the head that holds the reader's own colours (<c>WebThemeCssBuilder.BuildColors</c>), after the theme's.</summary>
    public const string ThemeColors = "data-ui-theme-colors";

    /// <summary>The hook the theme switcher's engine finds its button by; a class would be styling.</summary>
    public const string ThemeSwitcher = "data-ui-theme-switcher";

    public const string Tooltip = "data-ui-tooltip";

    public const string TooltipPlacement = "data-ui-tooltip-placement";

    /// <summary>On a control whose tooltip is all it has to say (a caption's badge): a press shows the tooltip, and the next press hides it.</summary>
    public const string TooltipPress = "data-ui-tooltip-press";

    /// <summary>On a text area that grows with its text up to its most rows; the stylesheet's, and the engine's where the browser cannot size a field to its content.</summary>
    public const string TextAreaGrow = "data-ui-text-area-grow";

    public const string TrimInput = "data-ui-trim-input";

    public const string ValidationMessage = "data-ui-validation-message";

    /// <summary>Marks the one element a component keeps its value on, where that is not the element the reader starts from.</summary>
    public const string ValueHolder = "data-ui-value-holder";

    /// <summary>On the field holding a period's end (<c>EndValue</c>), not its <c>Value</c>: a temporal input's second field, a range slider's end handle.</summary>
    public const string ValueEnd = "data-ui-value-end";

    /// <summary>Names the reader that reads a written value off this element; the names are <see cref="WebValueKinds"/>.</summary>
    public const string ValueKind = "data-ui-value-kind";

    public const string Visibility = "data-ui-visibility";

    public const string VisibilityMd = "data-ui-visibility-md";

    public const string VisibilitySm = "data-ui-visibility-sm";

    public const string VisibilityXl = "data-ui-visibility-xl";

    public const string VisibilityXxl = "data-ui-visibility-xxl";

    public const string WindowMoreAfter = "data-ui-window-more-after";

    public const string WindowMoreBefore = "data-ui-window-more-before";

    /// <summary>On a windowed host: the group of the item just before the window, which the window's first row is headed against.</summary>
    public const string WindowGroupBefore = "data-ui-window-group-before";

    public const string WindowOffset = "data-ui-window-offset";

    public const string WindowSize = "data-ui-window-size";

    /// <summary>On a windowed host: what the source computed over every item the query leaves, by property, as JSON.</summary>
    public const string WindowAggregates = "data-ui-window-aggregates";

    /// <summary>On a windowed host whose window is a page (<c>Paging</c>): the scroll asks for nothing, and a pager asks for a window by offset.</summary>
    public const string WindowPaged = "data-ui-window-paged";

    public const string WindowTotal = "data-ui-window-total";

    /// <summary>An element's chrome words with their keys (<c>WebWords</c>, <c>strings.write</c>), which a language switch writes again.</summary>
    public const string Words = "data-ui-words";

    /// <summary>The hook the language switcher's engine finds its button by; a class would be styling.</summary>
    public const string LanguageSwitcher = "data-ui-language-switcher";

    /// <summary>On a language switcher's choice: the language it switches to.</summary>
    public const string Language = "data-ui-language";
}
