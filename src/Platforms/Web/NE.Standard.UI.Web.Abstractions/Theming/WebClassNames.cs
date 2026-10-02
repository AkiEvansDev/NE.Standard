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

    /// <summary>On a wrap panel's root when it lays its children in even columns (<c>ItemMinWidth</c>).</summary>
    public const string WrapPanelColumns = "ui-wrap-panel--columns";

    /// <summary>
    /// On reading words — a Text's or a Paragraph's body, a validation message, a package's rendered document: what the reader may select
    /// where nothing around it is a row, a menu or a control (<c>TextSelectable</c> decides where set).
    /// </summary>
    public const string ContentText = "ui-content-text";

    // The classes below are read by the client too (dom-attributes.ts); WebClassNamesSyncTests holds the two spellings to one.

    /// <summary>A button's root, and the root of every control drawn as one: a menu entry, a tab's caption, a breadcrumb, an action, a switcher.</summary>
    public const string Button = "ui-button";

    /// <summary>A select's root, a multi-select's and a search's: the field whose list the reader picks from.</summary>
    public const string Select = "ui-select";

    /// <summary>The part of a select's field a press opens its list from.</summary>
    public const string SelectTrigger = "ui-select__trigger";

    /// <summary>A text input's root.</summary>
    public const string TextInput = "ui-text-input";

    /// <summary>On a field's root while its validation is an error.</summary>
    public const string Invalid = "ui-invalid";

    /// <summary>On a part a flag hides — a chevron an action or an expander does not show.</summary>
    public const string Hidden = "ui-hidden";

    /// <summary>A menu's root.</summary>
    public const string Menu = "ui-menu";

    /// <summary>On a menu's root drawn as a navigation rail (<c>UIMenuDisplay.Rail</c>).</summary>
    public const string MenuRail = "ui-menu--rail";

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

    /// <summary>A tree's root.</summary>
    public const string Tree = "ui-tree";

    /// <summary>A tree's node row.</summary>
    public const string TreeRow = "ui-tree__row";

    /// <summary>The grip a row of a draggable items view or table is dragged by (<c>DragHandle</c>).</summary>
    public const string RowGrip = "ui-row__grip";

    /// <summary>A dialog's card, inside its backdrop.</summary>
    public const string DialogSurface = "ui-dialog__surface";

    /// <summary>A flyout's popup content.</summary>
    public const string FlyoutContent = "ui-flyout__content";

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
            _ => string.Empty
        };

    public static string IconSize(UIIconSize value)
        => value switch
        {
            UIIconSize.Small => "ui-icon-size--small",
            UIIconSize.Medium => "ui-icon-size--medium",
            UIIconSize.Large => "ui-icon-size--large",
            _ => string.Empty
        };

    public static string IconShape(UIIconShape value)
        => value == UIIconShape.Circle ? "ui-icon--circle" : string.Empty;

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

    public static string TextBadgePlacement(UITextBadgePlacement value)
        => value switch
        {
            UITextBadgePlacement.Inline => "ui-text__badge--inline",
            UITextBadgePlacement.Trailing => "ui-text__badge--trailing",
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

    public static string BadgeStyle(UIBadgeType value)
        => value switch
        {
            UIBadgeType.Primary => "ui-badge-style--primary",
            UIBadgeType.Accent => "ui-badge-style--accent",
            UIBadgeType.Info => "ui-badge-style--info",
            UIBadgeType.Warning => "ui-badge-style--warning",
            UIBadgeType.Success => "ui-badge-style--success",
            UIBadgeType.Danger => "ui-badge-style--danger",
            UIBadgeType.Surface => "ui-badge-style--surface",
            UIBadgeType.Plain => "ui-badge-style--plain",
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

    /// <summary>
    /// <c>ui-border--none</c> for a thickness of nothing on every side — a component that draws no edge of its own, which the
    /// stylesheet cannot read off the inline <c>border-width</c>; empty otherwise.
    /// </summary>
    public static string BorderNone(UIThickness value)
        => value is { Left: 0, Top: 0, Right: 0, Bottom: 0 } ? "ui-border--none" : string.Empty;

    public static string SurfaceStyle(UISurfaceStyle value)
        => value switch
        {
            UISurfaceStyle.Background => "ui-surface--background",
            UISurfaceStyle.Raised => "ui-surface--raised",
            UISurfaceStyle.Tinted => "ui-surface--tinted",
            _ => string.Empty
        };

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

    public static string ButtonSize(UIButtonSize value)
        => value switch
        {
            UIButtonSize.Small => "ui-button--small",
            UIButtonSize.Medium => "ui-button--medium",
            UIButtonSize.Large => "ui-button--large",
            _ => string.Empty
        };

    /// <summary>A button group's size, on the group rather than on its segments, which inherit it through the stylesheet.</summary>
    public static string ButtonGroupSize(UIButtonSize value)
        => value switch
        {
            UIButtonSize.Small => "ui-button-group--small",
            UIButtonSize.Medium => "ui-button-group--medium",
            UIButtonSize.Large => "ui-button-group--large",
            _ => string.Empty
        };

    /// <summary>A rail's size, on the menu, whose entries and bottom bar follow it through the stylesheet.</summary>
    public static string MenuRailSize(UIButtonSize value)
        => value switch
        {
            UIButtonSize.Small => "ui-menu--small",
            UIButtonSize.Medium => "ui-menu--medium",
            UIButtonSize.Large => "ui-menu--large",
            _ => string.Empty
        };

    /// <summary>The search field's look in its open list (<c>SearchComponent.SearchFieldAppearance</c>).</summary>
    public static string SearchFieldAppearance(UIInputAppearance value)
        => value switch
        {
            UIInputAppearance.Filled => "ui-search__field--filled",
            UIInputAppearance.Outline => "ui-search__field--outline",
            UIInputAppearance.Underline => "ui-search__field--underline",
            UIInputAppearance.Ghost => "ui-search__field--ghost",
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

    public static string InputSize(UIInputSize value)
        => value switch
        {
            UIInputSize.Small => "ui-input--small",
            UIInputSize.Medium => "ui-input--medium",
            UIInputSize.Large => "ui-input--large",
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

    public static string ButtonClass(UIButtonType type)
        => type switch
        {
            UIButtonType.Primary => "ui-button--primary",
            UIButtonType.Accent => "ui-button--accent",
            UIButtonType.Danger => "ui-button--danger",
            UIButtonType.Outline => "ui-button--outline",
            UIButtonType.Ghost => "ui-button--ghost",
            UIButtonType.Link => "ui-button--link",
            UIButtonType.Surface => "ui-button--surface",
            _ => string.Empty
        };

    /// <summary>The four shapes an image input takes, on its root.</summary>
    public static string ImageInputShape(UIImageInputShape value)
        => value switch
        {
            UIImageInputShape.Picture => "ui-image-input--picture",
            UIImageInputShape.Avatar => "ui-image-input--avatar",
            UIImageInputShape.Inline => "ui-image-input--inline",
            UIImageInputShape.Shelf => "ui-image-input--shelf",
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

    public static string ImageShape(UIImageShape value)
        => value == UIImageShape.Circle ? "ui-image--circle" : string.Empty;

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
