using System.Diagnostics;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Web.Abstractions.Theming;

public static class WebClassNames
{
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
            _ => throw new UnreachableException()
        };

    public static string IconSize(UIIconSize value)
        => value switch
        {
            UIIconSize.Small => "ui-icon-size--small",
            UIIconSize.Medium => "ui-icon-size--medium",
            UIIconSize.Large => "ui-icon-size--large",
            _ => throw new UnreachableException()
        };

    public static string TextType(UITextType value)
        => value switch
        {
            UITextType.Display => "ui-text-type--display",
            UITextType.Title => "ui-text-type--title",
            UITextType.Subtitle => "ui-text-type--subtitle",
            UITextType.Body => "ui-text-type--body",
            UITextType.Caption => "ui-text-type--caption",
            UITextType.Overline => "ui-text-type--overline",
            _ => throw new UnreachableException()
        };

    public static string TextAlignment(UITextAlignment value)
        => value switch
        {
            UITextAlignment.Start => "ui-text--align-start",
            UITextAlignment.Center => "ui-text--align-center",
            UITextAlignment.End => "ui-text--align-end",
            UITextAlignment.Justify => "ui-text--align-justify",
            _ => throw new UnreachableException()
        };

    public static string TextWrap(UITextWrapMode value)
        => value switch
        {
            UITextWrapMode.NoWrap => "ui-text--nowrap",
            UITextWrapMode.Wrap => "ui-text--wrap",
            UITextWrapMode.WrapEllipsis => "ui-text--wrap-ellipsis",
            _ => throw new UnreachableException()
        };

    public static string TextBadgePlacement(UITextBadgePlacement value)
        => value switch
        {
            UITextBadgePlacement.Inline => "ui-text__badge--inline",
            UITextBadgePlacement.Trailing => "ui-text__badge--trailing",
            _ => throw new UnreachableException()
        };

    public static string TextIconAlignment(UITextIconAlignment value)
        => value switch
        {
            UITextIconAlignment.Title => "ui-text--icon-title",
            UITextIconAlignment.Content => "ui-text--icon-content",
            _ => throw new UnreachableException()
        };

    public static string TextBadgeAlignment(UITextBadgeAlignment value)
        => value switch
        {
            UITextBadgeAlignment.Title => "ui-text--badge-title",
            UITextBadgeAlignment.Content => "ui-text--badge-content",
            _ => throw new UnreachableException()
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
            _ => throw new UnreachableException()
        };

    public static string Side(UISide value)
        => value switch
        {
            UISide.Left => "ui-side--left",
            UISide.Right => "ui-side--right",
            UISide.Top => "ui-side--top",
            UISide.Bottom => "ui-side--bottom",
            _ => throw new UnreachableException()
        };

    public static string GroupSeparator(UIGroupSeparator value)
        => value switch
        {
            UIGroupSeparator.None => "ui-command-bar--separator-none",
            UIGroupSeparator.Gap => "ui-command-bar--separator-gap",
            UIGroupSeparator.Rule => "ui-command-bar--separator-rule",
            _ => throw new UnreachableException()
        };

    public static string SurfaceStyle(UISurfaceStyle value)
        => value switch
        {
            UISurfaceStyle.Background => "ui-surface--background",
            UISurfaceStyle.Raised => "ui-surface--raised",
            UISurfaceStyle.Tinted => "ui-surface--tinted",
            _ => throw new UnreachableException()
        };

    public static string Orientation(UIOrientation value)
        => value switch
        {
            UIOrientation.Horizontal => "ui-orientation--horizontal",
            UIOrientation.Vertical => "ui-orientation--vertical",
            _ => throw new UnreachableException()
        };

    public static string ItemsViewLayout(UIItemsLayoutType value)
        => value switch
        {
            UIItemsLayoutType.Stack => "ui-items-view--stack",
            UIItemsLayoutType.Wrap => "ui-items-view--wrap",
            _ => throw new UnreachableException()
        };

    public static string ScrollX(UIScrollMode value)
        => value switch
        {
            UIScrollMode.Disabled => "ui-scroll-x--disabled",
            UIScrollMode.Auto => "ui-scroll-x--auto",
            UIScrollMode.Always => "ui-scroll-x--always",
            _ => throw new UnreachableException()
        };

    public static string ScrollY(UIScrollMode value)
        => value switch
        {
            UIScrollMode.Disabled => "ui-scroll-y--disabled",
            UIScrollMode.Auto => "ui-scroll-y--auto",
            UIScrollMode.Always => "ui-scroll-y--always",
            _ => throw new UnreachableException()
        };

    public static string ScrollSnap(UIScrollSnapMode value)
        => value switch
        {
            UIScrollSnapMode.Disabled => "ui-scroll-snap--disabled",
            UIScrollSnapMode.Proximity => "ui-scroll-snap--proximity",
            UIScrollSnapMode.Mandatory => "ui-scroll-snap--mandatory",
            _ => throw new UnreachableException()
        };

    public static string ButtonSize(UIButtonSize value)
        => value switch
        {
            UIButtonSize.Small => "ui-button--small",
            UIButtonSize.Medium => "ui-button--medium",
            UIButtonSize.Large => "ui-button--large",
            _ => throw new UnreachableException()
        };

    /// <summary>A button group's size, on the group rather than on its segments, which inherit it through the stylesheet.</summary>
    public static string ButtonGroupSize(UIButtonSize value)
        => value switch
        {
            UIButtonSize.Small => "ui-button-group--small",
            UIButtonSize.Medium => "ui-button-group--medium",
            UIButtonSize.Large => "ui-button-group--large",
            _ => throw new UnreachableException()
        };

    public static string InputAppearance(UIInputAppearance value)
        => value switch
        {
            UIInputAppearance.Filled => "ui-input--filled",
            UIInputAppearance.Outline => "ui-input--outline",
            UIInputAppearance.Underline => "ui-input--underline",
            UIInputAppearance.Ghost => "ui-input--ghost",
            _ => throw new UnreachableException()
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
            _ => throw new UnreachableException()
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
            _ => throw new UnreachableException()
        };

    /// <summary>The three shapes an image input takes, on its root.</summary>
    public static string ImageInputShape(UIImageInputShape value)
        => value switch
        {
            UIImageInputShape.Picture => "ui-image-input--picture",
            UIImageInputShape.Avatar => "ui-image-input--avatar",
            UIImageInputShape.Inline => "ui-image-input--inline",
            _ => throw new UnreachableException()
        };

    public static string ImageFit(UIImageFit value)
        => value switch
        {
            UIImageFit.Fill => "ui-image-fit--fill",
            UIImageFit.Contain => "ui-image-fit--contain",
            UIImageFit.Cover => "ui-image-fit--cover",
            UIImageFit.None => "ui-image-fit--none",
            _ => throw new UnreachableException()
        };

    public static string ProgressVariant(UIProgressVariant value)
        => value switch
        {
            UIProgressVariant.Linear => "ui-progress--linear",
            UIProgressVariant.Circular => "ui-progress--circular",
            _ => throw new UnreachableException()
        };

    public static string SearchSelectionMode(UISearchSelectionDisplayMode value)
        => value switch
        {
            UISearchSelectionDisplayMode.KeepSearchInput => "ui-search-mode--keep",
            UISearchSelectionDisplayMode.ReplaceWithSelectedItem => "ui-search-mode--replace",
            _ => throw new UnreachableException()
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
            _ => throw new UnreachableException()
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
            _ => throw new UnreachableException()
        };

    public static string FlyoutPlacement(UIPopupPlacement value)
        => "ui-flyout--" + PopupPlacement(value);
}
