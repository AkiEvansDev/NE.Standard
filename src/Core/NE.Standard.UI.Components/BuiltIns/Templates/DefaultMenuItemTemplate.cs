using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Navigation;
using NE.Standard.UI.Components.BuiltIns.Regions;
using NE.Standard.UI.Primitives.Binding;

namespace NE.Standard.UI.Components.BuiltIns.Templates;

/// <summary>
/// The built-in template rendering an <see cref="IMenuItemModel"/> as a menu entry.
/// </summary>
/// <remarks>
/// Only <see cref="ITextBaseModel"/>'s properties plus the three <see cref="IMenuItemModel"/> adds — an entry
/// has no second line, so nothing from <see cref="ITextModel"/> is bound here.
/// </remarks>
public abstract class DefaultMenuItemTemplate<TTemplate> : MenuItemComponent<TTemplate>
    where TTemplate : DefaultMenuItemTemplate<TTemplate>, IUIComponentDefinition
{
    /// <summary>
    /// Initializes a new menu entry template, optionally binding its content to the item at <paramref name="itemPath"/>.
    /// </summary>
    protected DefaultMenuItemTemplate(string? itemPath = null, bool binds = true) : base()
    {
        if (!string.IsNullOrWhiteSpace(itemPath))
            _ = BindContext(itemPath, UIBindingScope.Relative);

        ButtonContentRegion content = new();

        if (binds)
        {
            _ = content
                .Bind(ButtonContentRegion.IconProperty, nameof(ITextBaseModel.Icon), UIBindingScope.Relative)
                .Bind(ButtonContentRegion.IconColorProperty, nameof(ITextBaseModel.IconColor), UIBindingScope.Relative)
                .Bind(ButtonContentRegion.IconSizeProperty, nameof(ITextBaseModel.IconSize), UIBindingScope.Relative)

                .Bind(ButtonContentRegion.TitleProperty, nameof(ITextBaseModel.Title), UIBindingScope.Relative)
                .Bind(ButtonContentRegion.TitleTypeProperty, nameof(ITextBaseModel.TitleType), UIBindingScope.Relative)
                .Bind(ButtonContentRegion.TitleColorProperty, nameof(ITextBaseModel.TitleColor), UIBindingScope.Relative)

                .Bind(ButtonContentRegion.BadgePlacementProperty, nameof(ITextBaseModel.BadgePlacement), UIBindingScope.Relative)
                .Bind(ButtonContentRegion.BadgeStyleProperty, nameof(ITextBaseModel.BadgeStyle), UIBindingScope.Relative)
                .Bind(ButtonContentRegion.BadgeIconProperty, nameof(ITextBaseModel.BadgeIcon), UIBindingScope.Relative)
                .Bind(ButtonContentRegion.BadgeTextProperty, nameof(ITextBaseModel.BadgeText), UIBindingScope.Relative)

                .Bind(ButtonContentRegion.TooltipProperty, nameof(ITextBaseModel.Tooltip), UIBindingScope.Relative);

            _ = Bind(VisibleProperty, nameof(ITextBaseModel.Visible), UIBindingScope.Relative);
            _ = Bind(EnabledProperty, nameof(ITextBaseModel.Enabled), UIBindingScope.Relative);

            // Kind is not bound: the menu picks this template variant *by* the item's Kind, so the variant
            // already carries it and sets it statically. See MenuItemComponent.Kind.
            _ = Bind(UrlProperty, nameof(IMenuItemModel.Url), UIBindingScope.Relative);
            _ = Bind(SelectedProperty, nameof(IMenuItemModel.Selected), UIBindingScope.Relative);
            _ = Bind(ShortcutProperty, nameof(IMenuItemModel.Shortcut), UIBindingScope.Relative);
        }

        _ = SetContent(content);
    }
}

/// <summary>
/// The built-in template rendering an <see cref="IMenuItemModel"/> as a menu entry.
/// </summary>
public sealed class DefaultMenuItemTemplate(string? itemPath = null, bool binds = false) : DefaultMenuItemTemplate<DefaultMenuItemTemplate>(itemPath, binds), IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.default.menu-item.template";
}
