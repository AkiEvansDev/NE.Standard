using DemoApp.Controllers.Base;
using NE.Standard.UI.Components.Foundation;

namespace DemoApp.Views.Base;

/// <summary>
/// The option sections every component page shares, each bound to its preview in one call: the Standard rows, the text's own
/// content, its badge and its border.
/// </summary>
internal static class DemoBindings
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);

    /// <summary>Binds the Standard section's rows (<see cref="StandardGroupContext"/>), which every preview carries.</summary>
    public static TComponent BindStandard<TComponent>(this VisualComponentBase<TComponent> component)
        where TComponent : VisualComponentBase<TComponent>, IUIComponentDefinition
        => component
            .BindVisibility($"{MainGroup}.{nameof(StandardGroupContext.Visibility)}")
            .BindEnabled($"{MainGroup}.{nameof(StandardGroupContext.Enabled)}")
            .BindHorizontalAlignment($"{MainGroup}.{nameof(StandardGroupContext.HorizontalAlignment)}")
            .BindVerticalAlignment($"{MainGroup}.{nameof(StandardGroupContext.VerticalAlignment)}")
            .BindMargin($"{MainGroup}.{nameof(StandardGroupContext.Margin)}")
            .BindWidth($"{MainGroup}.{nameof(StandardGroupContext.Width)}")
            .BindHeight($"{MainGroup}.{nameof(StandardGroupContext.Height)}")
            .BindTheme($"{MainGroup}.{nameof(StandardGroupContext.Theme)}")
            .BindLoading($"{MainGroup}.{nameof(StandardGroupContext.Loading)}");

    /// <summary>Binds the icon, the title and the tooltip to a <see cref="TextContentGroupContext"/> named <paramref name="group"/>.</summary>
    public static TComponent BindTextContent<TComponent>(this VisualComponentBase<TComponent> component, string group)
        where TComponent : VisualComponentBase<TComponent>, ITextBaseComponent, IUIComponentDefinition
        => component
            .Bind(ITextBaseComponent.IconProperty, $"{group}.{nameof(TextContentGroupContext.Icon)}")
            .Bind(ITextBaseComponent.IconColorProperty, $"{group}.{nameof(TextContentGroupContext.IconColor)}")
            .Bind(ITextBaseComponent.IconSizeProperty, $"{group}.{nameof(TextContentGroupContext.IconSize)}")
            .Bind(ITextBaseComponent.TitleProperty, $"{group}.{nameof(TextContentGroupContext.Title)}")
            .Bind(ITextBaseComponent.TitleTypeProperty, $"{group}.{nameof(TextContentGroupContext.TitleType)}")
            .Bind(ITextBaseComponent.TitleColorProperty, $"{group}.{nameof(TextContentGroupContext.TitleColor)}")
            .Bind(ITooltipComponent.TooltipProperty, $"{group}.{nameof(TextContentGroupContext.Tooltip)}")
            .Bind(ITooltipComponent.TooltipPlacementProperty, $"{group}.{nameof(TextContentGroupContext.TooltipPlacement)}");

    /// <summary>Binds every badge property to a <see cref="TextBadgeGroupContext"/> named <paramref name="group"/>.</summary>
    public static TComponent BindBadge<TComponent>(this VisualComponentBase<TComponent> component, string group)
        where TComponent : VisualComponentBase<TComponent>, ITextBaseComponent, IUIComponentDefinition
        => component
            .Bind(ITextBaseComponent.BadgePlacementProperty, $"{group}.{nameof(TextBadgeGroupContext.BadgePlacement)}")
            .Bind(ITextBaseComponent.BadgeStyleProperty, $"{group}.{nameof(TextBadgeGroupContext.BadgeStyle)}")
            .Bind(ITextBaseComponent.BadgeColorProperty, $"{group}.{nameof(TextBadgeGroupContext.BadgeColor)}")
            .Bind(ITextBaseComponent.BadgeFillProperty, $"{group}.{nameof(TextBadgeGroupContext.BadgeFill)}")
            .Bind(ITextBaseComponent.BadgeIconProperty, $"{group}.{nameof(TextBadgeGroupContext.BadgeIcon)}")
            .Bind(ITextBaseComponent.BadgeIconColorProperty, $"{group}.{nameof(TextBadgeGroupContext.BadgeIconColor)}")
            .Bind(ITextBaseComponent.BadgeIconSizeProperty, $"{group}.{nameof(TextBadgeGroupContext.BadgeIconSize)}")
            .Bind(ITextBaseComponent.BadgeTextProperty, $"{group}.{nameof(TextBadgeGroupContext.BadgeText)}")
            .Bind(ITextBaseComponent.BadgeTextTypeProperty, $"{group}.{nameof(TextBadgeGroupContext.BadgeTextType)}")
            .Bind(ITextBaseComponent.BadgeTooltipProperty, $"{group}.{nameof(TextBadgeGroupContext.BadgeTooltip)}")
            .Bind(ITextBaseComponent.BadgeTooltipPlacementProperty, $"{group}.{nameof(TextBadgeGroupContext.BadgeTooltipPlacement)}");

    /// <summary>Binds the edge's colour, thickness and corners to a <see cref="BorderGroupContext"/> named <paramref name="group"/>.</summary>
    /// <remarks>No contract constraint: the selects and the search carry an edge without <see cref="IBorderedComponent"/>.</remarks>
    public static TComponent BindBorder<TComponent>(this VisualComponentBase<TComponent> component, string group)
        where TComponent : VisualComponentBase<TComponent>, IUIComponentDefinition
        => component
            .Bind(IBorderedComponent.BorderColorProperty, $"{group}.{nameof(BorderGroupContext.BorderColor)}")
            .Bind(IBorderedComponent.BorderThicknessProperty, $"{group}.{nameof(BorderGroupContext.BorderThickness)}")
            .Bind(IBorderedComponent.BorderRadiusProperty, $"{group}.{nameof(BorderGroupContext.BorderRadius)}");
}
