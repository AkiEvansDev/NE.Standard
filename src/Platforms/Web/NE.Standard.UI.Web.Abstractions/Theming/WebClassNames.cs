using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Web.Abstractions.Theming;

public static class WebClassNames
{
    /// <summary>On a component's root while its <c>Enabled</c> is false.</summary>
    public const string Disabled = "ui-disabled";

    /// <summary>On a component's root while it is <c>Loading</c>.</summary>
    public const string Loading = "ui-loading";

    /// <summary>On an input's root while its <c>IsReadOnly</c> is true, whatever its own control carries for the browser.</summary>
    public const string ReadOnly = "ui-readonly";

    /// <summary>On the root of a component laying its children or options in even columns (<c>ItemMinWidth</c>).</summary>
    public const string EvenColumns = "ui-even-columns";

    /// <summary>A component standing level with captioned fields' boxes beside it (<c>AlignWithFieldBoxes</c>).</summary>
    public const string FieldAligned = "ui-field-aligned";

    /// <summary>
    /// On reading words — a Text's or a Paragraph's body, a validation message, a package's rendered document: what the reader may select
    /// where nothing around it is a row, a menu or a control (<c>TextSelectable</c> decides where set).
    /// </summary>
    public const string ContentText = "ui-content-text";

    // The classes below are read by the client too (dom-attributes.ts); WebClassNamesSyncTests holds the two spellings to one.

    /// <summary>A button's root, and the root of every control drawn as one: a menu entry, a tab's caption, a breadcrumb, an action, a switcher.</summary>
    public const string Button = "ui-button";

    /// <summary>A card's header band, which <see cref="CardHeaderEmpty"/> marks while its text shows nothing (<c>card-header.ts</c>).</summary>
    public const string CardHeader = "ui-card__header";

    public const string CardHeaderEmpty = "ui-card__header--empty";

    /// <summary>A timestamp's root, a <c>&lt;time&gt;</c> naming its instant, which the boot script and <c>timestamp-engine.ts</c> write in the reader's zone.</summary>
    public const string Timestamp = "ui-timestamp";

    /// <summary>The part of a timestamp holding its text.</summary>
    public const string TimestampText = "ui-timestamp__text";

    /// <summary>A file shown as a tile — a file tile's root, an image input shelf's square for a file that is no picture — and its parts (<c>file-tile.ts</c>).</summary>
    public const string FileTile = "ui-file-tile";

    public const string FileTileGlyph = "ui-file-tile__glyph";

    public const string FileTileName = "ui-file-tile__name";

    public const string FileTileSize = "ui-file-tile__size";

    /// <summary>A select's root, a multi-select's and a search's: the field whose list the reader picks from.</summary>
    public const string Select = "ui-select";

    /// <summary>The part of a select's field a press opens its list from.</summary>
    public const string SelectTrigger = "ui-select__trigger";

    /// <summary>A text input's root.</summary>
    public const string TextInput = "ui-text-input";

    /// <summary>A text's description line, which a copy of the text takes as its words (<c>shown-text.ts</c>).</summary>
    public const string TextDescription = "ui-text__description";

    /// <summary>On a field's root while its validation is an error.</summary>
    public const string Invalid = "ui-invalid";

    /// <summary>A field's icon before its text, which the select engine draws the chosen option after.</summary>
    public const string InputAffixIconPrefix = "ui-input__affix-icon--prefix";

    /// <summary>On a part a flag hides — a chevron an action or an expander does not show.</summary>
    public const string Hidden = "ui-hidden";

    /// <summary>A menu's root.</summary>
    public const string Menu = "ui-menu";

    /// <summary>On a menu's root drawn as a navigation rail (<c>UIMenuDisplay.Rail</c>).</summary>
    public const string MenuRail = "ui-menu--rail";

    /// <summary>On a menu's root standing in another's group, as its submenu.</summary>
    public const string MenuNested = "ui-menu--nested";

    /// <summary>A menu entry's root.</summary>
    public const string MenuItem = "ui-menu-item";

    /// <summary>On a check entry of a menu while it is on.</summary>
    public const string MenuItemChecked = "ui-menu-item--checked";

    /// <summary>On a menu entry while it is the current one.</summary>
    public const string MenuItemSelected = "ui-menu-item--selected";

    /// <summary>A table's row.</summary>
    public const string TableRow = "ui-table__row";

    /// <summary>A table's box: the element that scrolls, holding its header and its rows.</summary>
    public const string TableScroll = "ui-table__scroll";

    /// <summary>A table's header row.</summary>
    public const string TableHeader = "ui-table__header";

    /// <summary>The handle on a column's edge a resizable table's column is widened by.</summary>
    public const string TableResizer = "ui-table__resizer";

    /// <summary>An image component's box, which takes its size, shape and corners and holds the round one's fallback glyph.</summary>
    public const string Image = "ui-image";

    /// <summary>The picture in an image's box, which the client gives the framework's stand-in when its source fails.</summary>
    public const string ImagePicture = "ui-image__picture";

    /// <summary>A tree's root.</summary>
    public const string Tree = "ui-tree";

    /// <summary>A tree's node row.</summary>
    public const string TreeRow = "ui-tree__row";

    /// <summary>A tree node's face inside its row, which carries the node's facts.</summary>
    public const string TreeNode = "ui-tree-node";

    /// <summary>The grip a row of a draggable items view or table is dragged by (<c>DragHandle</c>).</summary>
    public const string RowGrip = "ui-row__grip";

    /// <summary>A dialog's card, inside its backdrop.</summary>
    public const string DialogSurface = "ui-dialog__surface";

    /// <summary>A flyout's popup content.</summary>
    public const string FlyoutContent = "ui-flyout__content";

    /// <summary>The accordion classes the client finds elements by too.</summary>
    public const string Accordion = "ui-accordion";

    /// <summary>The action classes the client finds elements by too.</summary>
    public const string Action = "ui-action";

    /// <summary>The badge classes the client finds elements by too.</summary>
    public const string Badge = "ui-badge";

    public const string BadgeColored = "ui-badge--colored";

    public const string BadgeIcon = "ui-badge__icon";

    public const string BadgeTitle = "ui-badge__title";

    /// <summary>The badge select classes the client finds elements by too.</summary>
    public const string BadgeSelect = "ui-badge-select";

    /// <summary>The breadcrumb classes the client finds elements by too.</summary>
    public const string Breadcrumb = "ui-breadcrumb";

    /// <summary>The breadcrumbs classes the client finds elements by too.</summary>
    public const string Breadcrumbs = "ui-breadcrumbs";

    public const string BreadcrumbsItem = "ui-breadcrumbs__item";

    /// <summary>The button classes the client finds elements by too.</summary>
    public const string ButtonContent = "ui-button__content";

    /// <summary>The button group classes the client finds elements by too.</summary>
    public const string ButtonGroup = "ui-button-group";

    public const string ButtonGroupItem = "ui-button-group__item";

    /// <summary>The calendar classes the client finds elements by too.</summary>
    public const string Calendar = "ui-calendar";

    public const string CalendarBody = "ui-calendar__body";

    /// <summary>The card classes the client finds elements by too.</summary>
    public const string Card = "ui-card";

    /// <summary>The checkbox classes the client finds elements by too.</summary>
    public const string Checkbox = "ui-checkbox";

    public const string CheckboxBox = "ui-checkbox__box";

    public const string CheckboxInput = "ui-checkbox__input";

    /// <summary>The collapsible classes the client finds elements by too.</summary>
    public const string Collapsible = "ui-collapsible";

    public const string CollapsibleBar = "ui-collapsible__bar";

    public const string CollapsibleBarContent = "ui-collapsible__bar-content";

    public const string CollapsibleContent = "ui-collapsible__content";

    /// <summary>The color input classes the client finds elements by too.</summary>
    public const string ColorInput = "ui-color-input";

    public const string ColorInputHueThumb = "ui-color-input__hue-thumb";

    public const string ColorInputPopup = "ui-color-input__popup";

    public const string ColorInputRow = "ui-color-input__row";

    public const string ColorInputSquareThumb = "ui-color-input__square-thumb";

    public const string ColorInputText = "ui-color-input__text";

    public const string ColorInputValueInput = "ui-color-input__value-input";

    /// <summary>The command bar classes the client finds elements by too.</summary>
    public const string CommandBar = "ui-command-bar";

    public const string CommandBarHost = "ui-command-bar__host";

    public const string CommandBarOverflow = "ui-command-bar__overflow";

    public const string CommandBarItem = "ui-command-bar__item";

    /// <summary>The container classes the client finds elements by too.</summary>
    public const string Container = "ui-container";

    /// <summary>The dialog classes the client finds elements by too.</summary>
    public const string Dialog = "ui-dialog";

    public const string DialogBackdrop = "ui-dialog__backdrop";

    /// <summary>The expander classes the client finds elements by too.</summary>
    public const string ExpanderHeader = "ui-expander__header";

    /// <summary>The field classes the client finds elements by too.</summary>
    public const string Field = "ui-field";

    /// <summary>The field box classes the client finds elements by too.</summary>
    public const string FieldBox = "ui-field-box";

    /// <summary>The file input classes the client finds elements by too.</summary>
    public const string FileInput = "ui-file-input";

    /// <summary>The flyout classes the client finds elements by too.</summary>
    public const string Flyout = "ui-flyout";

    public const string FlyoutOpen = "ui-flyout--open";

    public const string FlyoutAnchor = "ui-flyout__anchor";

    /// <summary>The grid splitter classes the client finds elements by too.</summary>
    public const string GridSplitter = "ui-grid-splitter";

    /// <summary>The icon classes the client finds elements by too.</summary>
    public const string Icon = "ui-icon";

    public const string IconImage = "ui-icon--image";

    public const string IconMask = "ui-icon--mask";

    /// <summary>The icon stand in classes the client finds elements by too.</summary>
    public const string IconStandIn = "ui-icon-stand-in";

    /// <summary>The image input classes the client finds elements by too.</summary>
    public const string ImageInput = "ui-image-input";

    public const string ImageInputMultiple = "ui-image-input--multiple";

    /// <summary>The items view classes the client finds elements by too.</summary>
    public const string ItemsView = "ui-items-view";

    public const string ItemsViewHost = "ui-items-view__host";

    public const string ItemsViewItem = "ui-items-view__item";

    /// <summary>The key value action classes the client finds elements by too.</summary>
    public const string KeyValueAction = "ui-key-value-action";

    public const string KeyValueActionEditable = "ui-key-value-action--editable";

    public const string KeyValueActionAction = "ui-key-value-action__action";

    public const string KeyValueActionEditAction = "ui-key-value-action__edit-action";

    public const string KeyValueActionRow = "ui-key-value-action__row";

    public const string KeyValueActionValue = "ui-key-value-action__value";

    public const string KeyValueActionValueInput = "ui-key-value-action__value-input";

    /// <summary>The language switcher classes the client finds elements by too.</summary>
    public const string LanguageSwitcherChoice = "ui-language-switcher__choice";

    public const string LanguageSwitcherLabelText = "ui-language-switcher__label-text";

    public const string LanguageSwitcherLabelTextCurrent = "ui-language-switcher__label-text--current";

    public const string LanguageSwitcherLabelTextPage = "ui-language-switcher__label-text--page";

    public const string LanguageSwitcherMenu = "ui-language-switcher__menu";

    public const string LanguageSwitcherTrigger = "ui-language-switcher__trigger";

    /// <summary>The menu classes the client finds elements by too.</summary>
    public const string MenuHost = "ui-menu__host";

    public const string MenuItemWrapper = "ui-menu__item";

    public const string MenuSubmenu = "ui-menu__submenu";

    /// <summary>The menu item classes the client finds elements by too.</summary>
    public const string MenuItemShortcut = "ui-menu-item__shortcut";

    public const string MenuItemValue = "ui-menu-item__value";

    /// <summary>The multi select classes the client finds elements by too.</summary>
    public const string MultiSelect = "ui-multi-select";

    public const string MultiSelectCheckboxes = "ui-multi-select--checkboxes";

    public const string MultiSelectCheck = "ui-multi-select__check";

    public const string MultiSelectChip = "ui-multi-select__chip";

    public const string MultiSelectChipLabel = "ui-multi-select__chip-label";

    public const string MultiSelectChipRemove = "ui-multi-select__chip-remove";

    public const string MultiSelectChips = "ui-multi-select__chips";

    public const string MultiSelectEntry = "ui-multi-select__entry";

    /// <summary>The number input classes the client finds elements by too.</summary>
    public const string NumberInput = "ui-number-input";

    /// <summary>The pager classes the client finds elements by too.</summary>
    public const string Pager = "ui-pager";

    public const string PagerButton = "ui-pager__button";

    public const string PagerPages = "ui-pager__pages";

    public const string PagerRange = "ui-pager__range";

    public const string PagerSize = "ui-pager__size";

    public const string PagerSizeChoice = "ui-pager__size-choice";

    public const string PagerSizeLabel = "ui-pager__size-label";

    public const string PagerSizeTrigger = "ui-pager__size-trigger";

    public const string PagerSizes = "ui-pager__sizes";

    /// <summary>The pane container classes the client finds elements by too.</summary>
    public const string PaneContainer = "ui-pane-container";

    public const string PaneContainerGrip = "ui-pane-container__grip";

    public const string PaneContainerPane = "ui-pane-container__pane";

    public const string PaneContainerPlace = "ui-pane-container__place";

    /// <summary>The progress classes the client finds elements by too.</summary>
    public const string Progress = "ui-progress";

    public const string ProgressFill = "ui-progress__fill";

    public const string ProgressTrack = "ui-progress__track";

    /// <summary>The radio group classes the client finds elements by too.</summary>
    public const string RadioGroup = "ui-radio-group";

    public const string RadioGroupDot = "ui-radio-group__dot";

    public const string RadioGroupInput = "ui-radio-group__input";

    public const string RadioGroupItem = "ui-radio-group__item";

    /// <summary>The search classes the client finds elements by too.</summary>
    public const string Search = "ui-search";

    public const string SearchInput = "ui-search__input";

    public const string SearchField = "ui-search__field";

    /// <summary>The select classes the client finds elements by too.</summary>
    public const string SelectList = "ui-select__list";

    public const string SelectOption = "ui-select__option";

    public const string SelectPlaceholder = "ui-select__placeholder";

    public const string SelectPopup = "ui-select__popup";

    public const string SelectTriggerContent = "ui-select__trigger-content";

    public const string SelectValueInput = "ui-select__value-input";

    /// <summary>The slider classes the client finds elements by too.</summary>
    public const string Slider = "ui-slider";

    public const string SliderRange = "ui-slider--range";

    public const string SliderBubble = "ui-slider__bubble";

    public const string SliderInput = "ui-slider__input";

    public const string SliderInputEnd = "ui-slider__input--end";

    public const string SliderThumbAnchor = "ui-slider__thumb-anchor";

    public const string SliderTrack = "ui-slider__track";

    public const string SliderValue = "ui-slider__value";

    /// <summary>The split button classes the client finds elements by too.</summary>
    public const string SplitButton = "ui-split-button";

    public const string SplitButtonMain = "ui-split-button__main";

    public const string SplitButtonMenu = "ui-split-button__menu";

    public const string SplitButtonToggle = "ui-split-button__toggle";

    /// <summary>The steps classes the client finds elements by too.</summary>
    public const string Steps = "ui-steps";

    public const string StepsItem = "ui-steps__item";

    /// <summary>The surface classes the client finds elements by too.</summary>
    public const string Surface = "ui-surface";

    public const string SurfaceClickable = "ui-surface--clickable";

    /// <summary>The tab caption classes the client finds elements by too.</summary>
    public const string TabCaption = "ui-tab-caption";

    /// <summary>A strip's overflow button, which the client finds the tabs it hides by.</summary>
    public const string TabOverflow = "ui-tab-overflow";

    public const string TabCaptionSelected = "ui-tab-caption--selected";

    /// <summary>The tab item classes the client finds elements by too.</summary>
    public const string TabItem = "ui-tab-item";

    public const string TabItemSelected = "ui-tab-item--selected";

    public const string TabItemCaption = "ui-tab-item__caption";

    public const string TabItemClose = "ui-tab-item__close";

    public const string TabItemLabel = "ui-tab-item__label";

    public const string TabItemPage = "ui-tab-item__page";

    public const string TabItemPin = "ui-tab-item__pin";

    /// <summary>The table classes the client finds elements by too.</summary>
    public const string Table = "ui-table";

    public const string TableNoHeader = "ui-table--no-header";

    public const string TableReorderable = "ui-table--reorderable";

    public const string TableHeaderCell = "ui-table__header-cell";

    public const string TableHost = "ui-table__host";

    /// <summary>The tabs classes the client finds elements by too.</summary>
    public const string Tabs = "ui-tabs";

    public const string TabsNoOverflow = "ui-tabs--no-overflow";

    public const string TabsBand = "ui-tabs__band";

    public const string TabsStrip = "ui-tabs__strip";

    /// <summary>The tabs view classes the client finds elements by too.</summary>
    public const string TabsView = "ui-tabs-view";

    public const string TabsViewNoOverflow = "ui-tabs-view--no-overflow";

    public const string TabsViewTablist = "ui-tabs-view__tablist";

    /// <summary>The temporal input classes the client finds elements by too.</summary>
    public const string TemporalInput = "ui-temporal-input";

    /// <summary>The text classes the client finds elements by too.</summary>
    public const string TextMaxLines = "ui-text--max-lines";

    public const string TextBody = "ui-text__body";

    public const string TextCode = "ui-text__code";

    public const string TextFold = "ui-text__fold";

    public const string TextFoldContent = "ui-text__fold-content";

    public const string TextFoldToggle = "ui-text__fold-toggle";

    public const string TextHeader = "ui-text__header";

    public const string TextIconInline = "ui-text__icon-inline";

    public const string TextLink = "ui-text__link";

    public const string TextTitle = "ui-text__title";

    /// <summary>The text area classes the client finds elements by too.</summary>
    public const string TextAreaGrow = "ui-text-area--grow";

    /// <summary>The theme switcher classes the client finds elements by too.</summary>
    public const string ThemeSwitcherChoice = "ui-theme-switcher__choice";

    public const string ThemeSwitcherMenu = "ui-theme-switcher__menu";

    /// <summary>The tree classes the client finds elements by too.</summary>
    public const string TreeNodeWrapper = "ui-tree__node";

    public const string TreeRowFolded = "ui-tree__row--folded";

    /// <summary>The tree node classes the client finds elements by too.</summary>
    public const string TreeNodeText = "ui-tree-node__text";

    public const string TreeNodeToggle = "ui-tree-node__toggle";

    /// <summary>The validation classes the client finds elements by too.</summary>
    public const string ValidationInfo = "ui-validation--info";

    public const string ValidationWarning = "ui-validation--warning";

    public static string Color(UIColorStyle value)
        => value switch
        {
            UIColorStyle.Default => "ui-color--default",
            UIColorStyle.Primary => "ui-color--primary",
            UIColorStyle.Accent => "ui-color--accent",
            UIColorStyle.Background => "ui-color--background",
            UIColorStyle.Surface => "ui-color--surface",
            UIColorStyle.OnPrimary => "ui-color--on-primary",
            UIColorStyle.OnAccent => "ui-color--on-accent",
            UIColorStyle.OnBackground => "ui-color--on-background",
            UIColorStyle.OnSurface => "ui-color--on-surface",
            UIColorStyle.Info => "ui-color--info",
            UIColorStyle.Warning => "ui-color--warning",
            UIColorStyle.Success => "ui-color--success",
            UIColorStyle.Danger => "ui-color--danger",
            UIColorStyle.OnInfo => "ui-color--on-info",
            UIColorStyle.OnWarning => "ui-color--on-warning",
            UIColorStyle.OnSuccess => "ui-color--on-success",
            UIColorStyle.OnDanger => "ui-color--on-danger",
            UIColorStyle.Muted => "ui-color--muted",
            UIColorStyle.Selected => "ui-color--selected",
            UIColorStyle.FocusRing => "ui-color--focus-ring",
            UIColorStyle.Border => "ui-color--border",
            UIColorStyle.Shadow => "ui-color--shadow",
            UIColorStyle.Overlay => "ui-color--overlay",
            UIColorStyle.Mark => "ui-color--mark",
            _ => string.Empty
        };

    public static string IconSize(UISize value)
        => value switch
        {
            UISize.Small => "ui-icon-size--small",
            UISize.Medium => "ui-icon-size--medium",
            UISize.Large => "ui-icon-size--large",
            _ => string.Empty
        };

    public static string IconShape(UIShape value)
        => value == UIShape.Circle ? "ui-icon--circle" : string.Empty;

    public static string TextType(UITextType value)
        => value switch
        {
            UITextType.Display => "ui-text-type--display",
            UITextType.Title => "ui-text-type--title",
            UITextType.Subtitle => "ui-text-type--subtitle",
            UITextType.Body => "ui-text-type--body",
            UITextType.Caption => "ui-text-type--caption",
            UITextType.Overline => "ui-text-type--overline",
            _ => string.Empty
        };

    public static string TextAlignment(UITextAlignment value)
        => value switch
        {
            UITextAlignment.Start => "ui-text--align-start",
            UITextAlignment.Center => "ui-text--align-center",
            UITextAlignment.End => "ui-text--align-end",
            UITextAlignment.Justify => "ui-text--align-justify",
            _ => string.Empty
        };

    public static string TextWrap(UITextWrapMode value)
        => value switch
        {
            UITextWrapMode.NoWrap => "ui-text--nowrap",
            UITextWrapMode.Wrap => "ui-text--wrap",
            _ => string.Empty
        };

    /// <summary>A button's label alignment on the button, beside <see cref="TextAlignment"/> on the label.</summary>
    public static string ButtonAlignment(UITextAlignment value)
        => value switch
        {
            UITextAlignment.Start => "ui-button--align-start",
            UITextAlignment.Center => "ui-button--align-center",
            UITextAlignment.End => "ui-button--align-end",
            UITextAlignment.Justify => "ui-button--align-justify",
            _ => string.Empty
        };

    /// <summary>A badge's placement on the text body that holds it, whose layout rules read it.</summary>
    public static string TextBadgePlacementHost(UITextBadgePlacement value)
        => value switch
        {
            UITextBadgePlacement.Inline => "ui-text--badge-inline",
            UITextBadgePlacement.Trailing => "ui-text--badge-trailing",
            _ => string.Empty
        };

    /// <summary>A description's role on the text body that holds it, beside <see cref="TextType"/> on the description.</summary>
    public static string TextDescriptionType(UITextType value)
        => value switch
        {
            UITextType.Display => "ui-text--description-display",
            UITextType.Title => "ui-text--description-title",
            UITextType.Subtitle => "ui-text--description-subtitle",
            UITextType.Body => "ui-text--description-body",
            UITextType.Caption => "ui-text--description-caption",
            UITextType.Overline => "ui-text--description-overline",
            _ => string.Empty
        };

    public static string TextIconAlignment(UITextIconAlignment value)
        => value switch
        {
            UITextIconAlignment.Title => "ui-text--icon-title",
            UITextIconAlignment.Content => "ui-text--icon-content",
            _ => string.Empty
        };

    public static string TextBadgeAlignment(UITextBadgeAlignment value)
        => value switch
        {
            UITextBadgeAlignment.Title => "ui-text--badge-title",
            UITextBadgeAlignment.Content => "ui-text--badge-content",
            _ => string.Empty
        };

    public static string BadgeVariant(UIBadgeVariant value)
        => value switch
        {
            UIBadgeVariant.Primary => "ui-badge-variant--primary",
            UIBadgeVariant.Accent => "ui-badge-variant--accent",
            UIBadgeVariant.Info => "ui-badge-variant--info",
            UIBadgeVariant.Warning => "ui-badge-variant--warning",
            UIBadgeVariant.Success => "ui-badge-variant--success",
            UIBadgeVariant.Danger => "ui-badge-variant--danger",
            UIBadgeVariant.Surface => "ui-badge-variant--surface",
            UIBadgeVariant.Plain => "ui-badge-variant--plain",
            _ => string.Empty
        };

    public static string BadgeFill(UIBadgeFill value)
        => value switch
        {
            UIBadgeFill.Filled => "ui-badge-fill--filled",
            UIBadgeFill.Tinted => "ui-badge-fill--tinted",
            UIBadgeFill.Outline => "ui-badge-fill--outline",
            _ => string.Empty
        };

    public static string Side(UISide value)
        => value switch
        {
            UISide.Left => "ui-side--left",
            UISide.Right => "ui-side--right",
            UISide.Top => "ui-side--top",
            UISide.Bottom => "ui-side--bottom",
            _ => string.Empty
        };

    public static string GroupSeparator(UIGroupSeparator value)
        => value switch
        {
            UIGroupSeparator.None => "ui-command-bar--separator-none",
            UIGroupSeparator.Gap => "ui-command-bar--separator-gap",
            UIGroupSeparator.Rule => "ui-command-bar--separator-rule",
            _ => string.Empty
        };

    private const string BorderEdgePrefix = "ui-border--";

    /// <summary>
    /// The edge a thickness draws, which the stylesheet cannot read off its border's tiers: <c>ui-border--none</c> for nothing on every
    /// side (a component that draws no edge of its own), <c>ui-border--left</c>, <c>--top</c>, <c>--right</c> or <c>--bottom</c> for a
    /// stroke on that side alone; empty for any other edge.
    /// </summary>
    public static string BorderEdge(UIThickness value)
        => EdgeOf(value) is { } edge ? BorderEdgePrefix + edge : string.Empty;

    /// <summary>The edge a responsive thickness draws at every breakpoint it sets; empty where two tiers differ.</summary>
    public static string BorderEdge(UIResponsive<UIThickness> value)
    {
        string? edge = null;

        for (UIResponsiveTier tier = UIResponsiveTier.Base; tier <= UIResponsiveTier.Xxl; tier++)
        {
            if (value.Get(tier) is not UIThickness thickness)
                continue;

            if (EdgeOf(thickness) is not { } tierEdge || (edge is not null && edge != tierEdge))
                return string.Empty;

            edge = tierEdge;
        }

        return BorderEdgePrefix + (edge ?? "none");
    }

    private static string? EdgeOf(UIThickness value)
        => value switch
        {
            { Left: 0, Top: 0, Right: 0, Bottom: 0 } => "none",
            { Top: 0, Right: 0, Bottom: 0 } => "left",
            { Left: 0, Right: 0, Bottom: 0 } => "top",
            { Left: 0, Top: 0, Bottom: 0 } => "right",
            { Left: 0, Top: 0, Right: 0 } => "bottom",
            _ => null
        };

    private const string SurfaceStylePrefix = "ui-surface--";

    public static string SurfaceStyle(UISurfaceStyle value)
        => value switch
        {
            UISurfaceStyle.Background => $"{SurfaceStylePrefix}background",
            UISurfaceStyle.Surface => $"{SurfaceStylePrefix}surface",
            UISurfaceStyle.Tinted => $"{SurfaceStylePrefix}tinted",
            _ => string.Empty
        };

    /// <summary>A surface's word, as its class ends: what a popup a menu fills is marked with (<c>WebAttributes.MenuSurface</c>).</summary>
    public static string SurfaceStyleToken(UISurfaceStyle value)
        => SurfaceStyle(value) is { Length: > 0 } className ? className[SurfaceStylePrefix.Length..] : string.Empty;

    public static string Orientation(UIOrientation value)
        => value switch
        {
            UIOrientation.Horizontal => "ui-orientation--horizontal",
            UIOrientation.Vertical => "ui-orientation--vertical",
            _ => string.Empty
        };

    public static string DragHandlePlacement(UIDragHandlePlacement value)
        => value switch
        {
            UIDragHandlePlacement.Start => "ui-drag-handle--start",
            UIDragHandlePlacement.End => "ui-drag-handle--end",
            _ => string.Empty
        };

    public static string ItemsViewLayout(UIItemsLayoutType value)
        => value switch
        {
            UIItemsLayoutType.Stack => "ui-items-view--stack",
            UIItemsLayoutType.Wrap => "ui-items-view--wrap",
            _ => string.Empty
        };

    public static string ScrollX(UIScrollMode value)
        => value switch
        {
            UIScrollMode.Disabled => "ui-scroll-x--disabled",
            UIScrollMode.Auto => "ui-scroll-x--auto",
            UIScrollMode.Always => "ui-scroll-x--always",
            _ => string.Empty
        };

    public static string ScrollY(UIScrollMode value)
        => value switch
        {
            UIScrollMode.Disabled => "ui-scroll-y--disabled",
            UIScrollMode.Auto => "ui-scroll-y--auto",
            UIScrollMode.Always => "ui-scroll-y--always",
            _ => string.Empty
        };

    public static string ScrollSnap(UIScrollSnapMode value)
        => value switch
        {
            UIScrollSnapMode.Disabled => "ui-scroll-snap--disabled",
            UIScrollSnapMode.Proximity => "ui-scroll-snap--proximity",
            UIScrollSnapMode.Mandatory => "ui-scroll-snap--mandatory",
            _ => string.Empty
        };

    public static string ButtonSize(UISize value)
        => value switch
        {
            UISize.Small => "ui-button--small",
            UISize.Medium => "ui-button--medium",
            UISize.Large => "ui-button--large",
            _ => string.Empty
        };

    /// <summary>A button group's size, on the group rather than on its segments, which inherit it through the stylesheet.</summary>
    public static string ButtonGroupSize(UISize value)
        => value switch
        {
            UISize.Small => "ui-button-group--small",
            UISize.Medium => "ui-button-group--medium",
            UISize.Large => "ui-button-group--large",
            _ => string.Empty
        };

    /// <summary>A rail's size, on the menu, whose entries and bottom bar follow it through the stylesheet.</summary>
    public static string MenuRailSize(UISize value)
        => value switch
        {
            UISize.Small => "ui-menu--small",
            UISize.Medium => "ui-menu--medium",
            UISize.Large => "ui-menu--large",
            _ => string.Empty
        };

    public static string InputAppearance(UIInputAppearance value)
        => value switch
        {
            UIInputAppearance.Filled => "ui-input--filled",
            UIInputAppearance.Outline => "ui-input--outline",
            UIInputAppearance.Underline => "ui-input--underline",
            UIInputAppearance.Ghost => "ui-input--ghost",
            _ => string.Empty
        };

    public static string InputSize(UISize value)
        => value switch
        {
            UISize.Small => "ui-input--small",
            UISize.Medium => "ui-input--medium",
            UISize.Large => "ui-input--large",
            _ => string.Empty
        };

    public static string TextInputType(UITextInputType value)
        => value switch
        {
            UITextInputType.Text => "text",
            UITextInputType.Email => "email",
            UITextInputType.Password => "password",
            UITextInputType.Search => "search",
            UITextInputType.Tel => "tel",
            UITextInputType.Url => "url",
            _ => string.Empty
        };

    /// <summary>A field's on-screen keyboard as its <c>inputmode</c> token.</summary>
    public static string InputMode(UIInputMode value)
        => value switch
        {
            UIInputMode.Text => "text",
            UIInputMode.Numeric => "numeric",
            UIInputMode.Decimal => "decimal",
            UIInputMode.Tel => "tel",
            UIInputMode.Email => "email",
            UIInputMode.Url => "url",
            UIInputMode.Search => "search",
            _ => string.Empty
        };

    public static string ButtonVariant(UIButtonVariant variant)
        => variant switch
        {
            UIButtonVariant.Primary => "ui-button--primary",
            UIButtonVariant.Accent => "ui-button--accent",
            UIButtonVariant.Danger => "ui-button--danger",
            UIButtonVariant.Outline => "ui-button--outline",
            UIButtonVariant.Ghost => "ui-button--ghost",
            UIButtonVariant.Link => "ui-button--link",
            UIButtonVariant.Surface => "ui-button--surface",
            _ => string.Empty
        };

    /// <summary>The three looks an image input is drawn as, on its root.</summary>
    public static string ImageInputVariant(UIImageInputVariant value)
        => value switch
        {
            UIImageInputVariant.Picture => "ui-image-input--picture",
            UIImageInputVariant.Avatar => "ui-image-input--avatar",
            UIImageInputVariant.Inline => "ui-image-input--inline",
            _ => string.Empty
        };

    public static string ImageFit(UIImageFit value)
        => value switch
        {
            UIImageFit.Fill => "ui-image-fit--fill",
            UIImageFit.Contain => "ui-image-fit--contain",
            UIImageFit.Cover => "ui-image-fit--cover",
            UIImageFit.None => "ui-image-fit--none",
            _ => string.Empty
        };

    /// <summary>An expander's modifier: <c>ui-expander--quiet</c> for the quiet fold, nothing for the card.</summary>
    public static string ExpanderVariant(UIExpanderVariant value)
        => value == UIExpanderVariant.Quiet ? "ui-expander--quiet" : string.Empty;

    public static string ImageShape(UIShape value)
        => value == UIShape.Circle ? "ui-image--circle" : string.Empty;

    public static string ProgressVariant(UIProgressVariant value)
        => value switch
        {
            UIProgressVariant.Linear => "ui-progress--linear",
            UIProgressVariant.Circular => "ui-progress--circular",
            _ => string.Empty
        };

    /// <summary>
    /// The token a visibility is written as; <c>Visible</c> writes nothing, since the attribute's absence already means visible.
    /// </summary>
    public static string Visibility(UIVisibility value)
        => value switch
        {
            UIVisibility.Visible => "visible",
            UIVisibility.Hidden => "hidden",
            UIVisibility.Collapsed => "collapsed",
            _ => string.Empty
        };

    /// <summary>
    /// The token a placement is written as, and the one <c>anchored-popup.ts</c> reads.
    /// </summary>
    public static string PopupPlacement(UIPopupPlacement value)
        => value switch
        {
            UIPopupPlacement.BottomStart => "bottom-start",
            UIPopupPlacement.Bottom => "bottom",
            UIPopupPlacement.BottomEnd => "bottom-end",
            UIPopupPlacement.TopStart => "top-start",
            UIPopupPlacement.Top => "top",
            UIPopupPlacement.TopEnd => "top-end",
            UIPopupPlacement.LeftStart => "left-start",
            UIPopupPlacement.Left => "left",
            UIPopupPlacement.LeftEnd => "left-end",
            UIPopupPlacement.RightStart => "right-start",
            UIPopupPlacement.Right => "right",
            UIPopupPlacement.RightEnd => "right-end",
            _ => string.Empty
        };

    public static string FlyoutPlacement(UIPopupPlacement value)
        => "ui-flyout--" + PopupPlacement(value);

    /// <summary>A tab menu's chosen entries as the space-separated tokens <c>data-ui-tabs-menu</c> carries, in flag order; empty for none.</summary>
    public static string TabMenuEntries(UITabMenuEntries value)
    {
        List<string> tokens = new(4);

        if (value.HasFlag(UITabMenuEntries.Rename))
            tokens.Add("rename");

        if (value.HasFlag(UITabMenuEntries.Pin))
            tokens.Add("pin");

        if (value.HasFlag(UITabMenuEntries.Close))
            tokens.Add("close");

        if (value.HasFlag(UITabMenuEntries.Delete))
            tokens.Add("delete");

        return string.Join(' ', tokens);
    }
}
