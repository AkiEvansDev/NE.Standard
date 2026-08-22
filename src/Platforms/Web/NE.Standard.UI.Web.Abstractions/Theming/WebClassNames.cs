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

    public static string ButtonContentBadgePlacement(UITextBadgePlacement value)
        => value switch
        {
            UITextBadgePlacement.Inline => "ui-button-content__badge--inline",
            UITextBadgePlacement.Trailing => "ui-button-content__badge--trailing",
            _ => throw new UnreachableException()
        };

    public static string ButtonContentTextAlignment(UITextAlignment value)
        => value switch
        {
            UITextAlignment.Start => "ui-button-content--align-start",
            UITextAlignment.Center => "ui-button-content--align-center",
            UITextAlignment.End => "ui-button-content--align-end",
            UITextAlignment.Justify => "ui-button-content--align-justify",
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

    public static string SkeletonVariant(UISkeletonVariant value)
        => value switch
        {
            UISkeletonVariant.Text => "ui-preview-text",
            UISkeletonVariant.Card => "ui-preview-card",
            UISkeletonVariant.Circle => "ui-preview-circle",
            _ => throw new UnreachableException()
        };

    public static string InputAppearance(UIInputAppearance value)
        => value switch
        {
            UIInputAppearance.Filled => "ui-input--filled",
            UIInputAppearance.Underline => "ui-input--underline",
            _ => throw new UnreachableException()
        };

    public static string InputBadgePlacement(UITextBadgePlacement value)
        => value switch
        {
            UITextBadgePlacement.Inline => "ui-input__badge--inline",
            UITextBadgePlacement.Trailing => "ui-input__badge--trailing",
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
            _ => throw new UnreachableException()
        };

    public static string ImageFit(UIImageFit value)
        => value switch
        {
            UIImageFit.Default => "ui-image-fit--default",
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

    public static string FlyoutPlacement(UIFlyoutPlacement value)
        => value switch
        {
            UIFlyoutPlacement.BottomStart => "ui-flyout--bottom-start",
            UIFlyoutPlacement.Bottom => "ui-flyout--bottom",
            UIFlyoutPlacement.BottomEnd => "ui-flyout--bottom-end",
            UIFlyoutPlacement.TopStart => "ui-flyout--top-start",
            UIFlyoutPlacement.Top => "ui-flyout--top",
            UIFlyoutPlacement.TopEnd => "ui-flyout--top-end",
            UIFlyoutPlacement.LeftStart => "ui-flyout--left-start",
            UIFlyoutPlacement.Left => "ui-flyout--left",
            UIFlyoutPlacement.LeftEnd => "ui-flyout--left-end",
            UIFlyoutPlacement.RightStart => "ui-flyout--right-start",
            UIFlyoutPlacement.Right => "ui-flyout--right",
            UIFlyoutPlacement.RightEnd => "ui-flyout--right-end",
            _ => throw new UnreachableException()
        };
}
