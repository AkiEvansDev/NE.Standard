using DemoApp.Controllers.Base;
using NE.Standard.UI.Components.Foundation;

namespace DemoApp.Views.Base;

/// <summary>
/// The option sections every component page shares, each bound to its preview in one call: the Standard rows, the text's own
/// content, its badge and its border.
/// </summary>
internal static class DemoBindings
{
    /// <summary>Binds the Standard section's rows (<see cref="StandardGroupContext"/>), which every preview carries.</summary>
    public static TComponent BindStandard<TComponent>(this VisualComponentBase<TComponent> component)
        where TComponent : VisualComponentBase<TComponent>, IUIComponentDefinition
        => component
            .BindVisibility<DemoStandardController>(static x => x.MainGroup.Visibility)
            .BindEnabled<DemoStandardController>(static x => x.MainGroup.Enabled)
            .BindHorizontalAlignment<DemoStandardController>(static x => x.MainGroup.HorizontalAlignment)
            .BindVerticalAlignment<DemoStandardController>(static x => x.MainGroup.VerticalAlignment)
            .BindMargin<DemoStandardController>(static x => x.MainGroup.Margin)
            .BindWidth<DemoStandardController>(static x => x.MainGroup.Width)
            .BindHeight<DemoStandardController>(static x => x.MainGroup.Height)
            .BindTheme<DemoStandardController>(static x => x.MainGroup.Theme)
            .BindLoading<DemoStandardController>(static x => x.MainGroup.Loading);

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

    /// <summary>Binds the compact caption (<see cref="TextLabelGroupContext"/>) to an input, choice, or action control.</summary>
    public static TComponent BindLabel<TComponent>(this VisualComponentBase<TComponent> component, string group, bool hasDescription = false)
        where TComponent : VisualComponentBase<TComponent>, ITextBaseComponent, IUIComponentDefinition
    {
        _ = component
            .Bind(ITextBaseComponent.TitleProperty, $"{group}.{nameof(TextLabelGroupContext.Title)}")
            .Bind(ITextBaseComponent.IconProperty, $"{group}.{nameof(TextLabelGroupContext.Icon)}")
            .Bind(ITextBaseComponent.BadgeTitleProperty, $"{group}.{nameof(TextLabelGroupContext.BadgeTitle)}")
            .Bind(ITooltipComponent.TooltipProperty, $"{group}.{nameof(TextLabelGroupContext.Tooltip)}");

        return hasDescription
            ? component.Bind(ITextComponent.DescriptionProperty, $"{group}.{nameof(TextLabelGroupContext.Description)}")
            : (TComponent)component;
    }

    /// <summary>Binds every badge property to a <see cref="TextBadgeGroupContext"/> named <paramref name="group"/>.</summary>
    public static TComponent BindBadge<TComponent>(this VisualComponentBase<TComponent> component, string group)
        where TComponent : VisualComponentBase<TComponent>, ITextBaseComponent, IUIComponentDefinition
        => component
            .Bind(ITextBaseComponent.BadgePlacementProperty, $"{group}.{nameof(TextBadgeGroupContext.BadgePlacement)}")
            .Bind(ITextBaseComponent.BadgeVariantProperty, $"{group}.{nameof(TextBadgeGroupContext.BadgeVariant)}")
            .Bind(ITextBaseComponent.BadgeColorProperty, $"{group}.{nameof(TextBadgeGroupContext.BadgeColor)}")
            .Bind(ITextBaseComponent.BadgeFillProperty, $"{group}.{nameof(TextBadgeGroupContext.BadgeFill)}")
            .Bind(ITextBaseComponent.BadgeIconProperty, $"{group}.{nameof(TextBadgeGroupContext.BadgeIcon)}")
            .Bind(ITextBaseComponent.BadgeIconColorProperty, $"{group}.{nameof(TextBadgeGroupContext.BadgeIconColor)}")
            .Bind(ITextBaseComponent.BadgeIconSizeProperty, $"{group}.{nameof(TextBadgeGroupContext.BadgeIconSize)}")
            .Bind(ITextBaseComponent.BadgeTitleProperty, $"{group}.{nameof(TextBadgeGroupContext.BadgeTitle)}")
            .Bind(ITextBaseComponent.BadgeTitleTypeProperty, $"{group}.{nameof(TextBadgeGroupContext.BadgeTitleType)}")
            .Bind(ITextBaseComponent.BadgeTooltipProperty, $"{group}.{nameof(TextBadgeGroupContext.BadgeTooltip)}")
            .Bind(ITextBaseComponent.BadgeTooltipPlacementProperty, $"{group}.{nameof(TextBadgeGroupContext.BadgeTooltipPlacement)}");

    /// <summary>Binds row selection mode, chosen key(s), and selection style to a <see cref="SelectionGroupContext"/> named <paramref name="group"/>.</summary>
    public static TComponent BindSelection<TComponent>(this VisualComponentBase<TComponent> component, string group)
        where TComponent : VisualComponentBase<TComponent>, ISelectableItemsComponent, ISelectionStyleComponent, IUIComponentDefinition
        => component
            .Bind(ISelectableItemsComponent.SelectionModeProperty, $"{group}.{nameof(SelectionGroupContext.SelectionMode)}")
            .Bind(ISelectedKeyComponent.SelectedKeyProperty, $"{group}.{nameof(SelectionGroupContext.SelectedKey)}")
            .Bind(ISelectableItemsComponent.SelectedKeysProperty, $"{group}.{nameof(SelectionGroupContext.SelectedKeys)}")
            .Bind(ISelectionStyleComponent.SelectionStyleProperty, $"{group}.{nameof(SelectionGroupContext.SelectionStyle)}");

    /// <summary>Binds row drag-reordering and grip placement to a <see cref="ReorderGroupContext"/> named <paramref name="group"/>.</summary>
    public static TComponent BindReorder<TComponent>(this VisualComponentBase<TComponent> component, string group)
        where TComponent : VisualComponentBase<TComponent>, IDraggableRowsComponent, IUIComponentDefinition
        => component
            .Bind(IDraggableItemsComponent.DraggableProperty, $"{group}.{nameof(ReorderGroupContext.Draggable)}")
            .Bind(IDraggableRowsComponent.DragHandleProperty, $"{group}.{nameof(ReorderGroupContext.DragHandle)}")
            .Bind(IDraggableRowsComponent.DragHandlePlacementProperty, $"{group}.{nameof(ReorderGroupContext.DragHandlePlacement)}");

    /// <summary>Binds the edge's colour, thickness and corners to a <see cref="BorderGroupContext"/> named <paramref name="group"/>.</summary>
    /// <remarks>No contract constraint: the selects and the search carry an edge without <see cref="IBorderedComponent"/>.</remarks>
    public static TComponent BindBorder<TComponent>(this VisualComponentBase<TComponent> component, string group)
        where TComponent : VisualComponentBase<TComponent>, IUIComponentDefinition
        => component
            .Bind(IBorderedComponent.BorderColorProperty, $"{group}.{nameof(BorderGroupContext.BorderColor)}")
            .Bind(IBorderedComponent.BorderThicknessProperty, $"{group}.{nameof(BorderGroupContext.BorderThickness)}")
            .Bind(IBorderedComponent.BorderRadiusProperty, $"{group}.{nameof(BorderGroupContext.BorderRadius)}");
}
