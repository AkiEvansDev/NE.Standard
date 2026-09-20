using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Binding;

namespace NE.Standard.UI.Components.Foundation;

/// <summary>
/// The two text contracts, bound to a component in one call each.
/// </summary>
/// <remarks><c>Visible</c> and <c>Enabled</c> are not here: they belong to the component rather than to its text.</remarks>
public static class DefaultTemplateBindings
{
    /// <summary>
    /// Binds every <see cref="IItemAbilitiesModel"/> flag relative to the bound item, so a flag flipped on a live item reaches its row.
    /// </summary>
    public static TComponent BindItemAbilities<TComponent>(this VisualComponentBase<TComponent> component)
        where TComponent : VisualComponentBase<TComponent>, IItemAbilitiesComponent, IUIComponentDefinition
        => component
            .Bind(IItemAbilitiesComponent.CanSelectProperty, nameof(IItemAbilitiesModel.CanSelect), UIBindingScope.Relative, optional: true)
            .Bind(IItemAbilitiesComponent.CanDragProperty, nameof(IItemAbilitiesModel.CanDrag), UIBindingScope.Relative, optional: true)
            .Bind(IItemAbilitiesComponent.CanRemoveProperty, nameof(IItemAbilitiesModel.CanRemove), UIBindingScope.Relative, optional: true)
            .Bind(IItemAbilitiesComponent.CanRenameProperty, nameof(IItemAbilitiesModel.CanRename), UIBindingScope.Relative, optional: true)
            .Bind(IItemAbilitiesComponent.CanShowContextMenuProperty, nameof(IItemAbilitiesModel.CanShowContextMenu), UIBindingScope.Relative, optional: true);

    /// <summary>
    /// Binds every <see cref="ITextBaseModel"/> property — icon, title and badge — relative to the bound item.
    /// </summary>
    public static TComponent BindTextBase<TComponent>(this VisualComponentBase<TComponent> component)
        where TComponent : VisualComponentBase<TComponent>, ITextBaseComponent, IUIComponentDefinition
        => component
            .Bind(ITextBaseComponent.IconProperty, nameof(ITextBaseModel.Icon), UIBindingScope.Relative, optional: true)
            .Bind(ITextBaseComponent.IconColorProperty, nameof(ITextBaseModel.IconColor), UIBindingScope.Relative, optional: true)
            .Bind(ITextBaseComponent.IconSizeProperty, nameof(ITextBaseModel.IconSize), UIBindingScope.Relative, optional: true)

            .Bind(ITextBaseComponent.TitleProperty, nameof(ITextBaseModel.Title), UIBindingScope.Relative, optional: true)
            .Bind(ITextBaseComponent.TitleTypeProperty, nameof(ITextBaseModel.TitleType), UIBindingScope.Relative, optional: true)
            .Bind(ITextBaseComponent.TitleColorProperty, nameof(ITextBaseModel.TitleColor), UIBindingScope.Relative, optional: true)

            .Bind(ITextBaseComponent.BadgePlacementProperty, nameof(ITextBaseModel.BadgePlacement), UIBindingScope.Relative, optional: true)
            .Bind(ITextBaseComponent.BadgeStyleProperty, nameof(IBadgeModel.BadgeStyle), UIBindingScope.Relative, optional: true)
            .Bind(ITextBaseComponent.BadgeColorProperty, nameof(IBadgeModel.BadgeColor), UIBindingScope.Relative, optional: true)
            .Bind(ITextBaseComponent.BadgeIconProperty, nameof(IBadgeModel.BadgeIcon), UIBindingScope.Relative, optional: true)
            .Bind(ITextBaseComponent.BadgeIconColorProperty, nameof(IBadgeModel.BadgeIconColor), UIBindingScope.Relative, optional: true)
            .Bind(ITextBaseComponent.BadgeIconSizeProperty, nameof(IBadgeModel.BadgeIconSize), UIBindingScope.Relative, optional: true)
            .Bind(ITextBaseComponent.BadgeTextProperty, nameof(IBadgeModel.BadgeText), UIBindingScope.Relative, optional: true)
            .Bind(ITextBaseComponent.BadgeTextTypeProperty, nameof(IBadgeModel.BadgeTextType), UIBindingScope.Relative, optional: true)
            .Bind(ITextBaseComponent.BadgeTooltipProperty, nameof(IBadgeModel.BadgeTooltip), UIBindingScope.Relative, optional: true)
            .Bind(ITextBaseComponent.BadgeTooltipPlacementProperty, nameof(IBadgeModel.BadgeTooltipPlacement), UIBindingScope.Relative, optional: true)

            .Bind(ITooltipComponent.TooltipProperty, nameof(ITooltipModel.Tooltip), UIBindingScope.Relative, optional: true)
            .Bind(ITooltipComponent.TooltipPlacementProperty, nameof(ITooltipModel.TooltipPlacement), UIBindingScope.Relative, optional: true);

    /// <summary>
    /// Binds what <see cref="ITextModel"/> adds on top of <see cref="BindTextBase"/> — the description and its layout.
    /// </summary>
    public static TComponent BindText<TComponent>(this VisualComponentBase<TComponent> component)
        where TComponent : VisualComponentBase<TComponent>, ITextComponent, IUIComponentDefinition
        => component
            .BindTextBase()
            .Bind(ITextComponent.DescriptionProperty, nameof(ITextModel.Description), UIBindingScope.Relative, optional: true)
            .Bind(ITextComponent.DescriptionTypeProperty, nameof(ITextModel.DescriptionType), UIBindingScope.Relative, optional: true)
            .Bind(ITextComponent.DescriptionColorProperty, nameof(ITextModel.DescriptionColor), UIBindingScope.Relative, optional: true)

            .Bind(ITextComponent.TextAlignmentProperty, nameof(ITextModel.TextAlignment), UIBindingScope.Relative, optional: true)

            .Bind(ITextBaseComponent.SelectableProperty, nameof(ITextModel.Selectable), UIBindingScope.Relative, optional: true);
}
