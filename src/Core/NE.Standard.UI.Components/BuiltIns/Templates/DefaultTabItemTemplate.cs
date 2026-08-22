using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Navigation;
using NE.Standard.UI.Components.BuiltIns.Regions;
using NE.Standard.UI.Primitives.Binding;

namespace NE.Standard.UI.Components.BuiltIns.Templates;

/// <summary>
/// The built-in template rendering an <see cref="ITabItemModel"/> as a tab.
/// </summary>
/// <remarks>
/// Only the caption is bound here. The page is whatever the author put in it — the point of the control is
/// that a page is an ordinary component tree, rendered once per item.
/// </remarks>
public abstract class DefaultTabItemTemplate<TTemplate> : TabItemComponent<TTemplate>
    where TTemplate : DefaultTabItemTemplate<TTemplate>, IUIComponentDefinition
{
    /// <summary>
    /// Initializes a new tab template, optionally binding its caption to the item at <paramref name="itemPath"/>.
    /// </summary>
    protected DefaultTabItemTemplate(string? itemPath = null, bool binds = true) : base()
    {
        if (!string.IsNullOrWhiteSpace(itemPath))
            _ = BindContext(itemPath, UIBindingScope.Relative);

        if (!binds)
            return;

        _ = ConfigureDefaultCaption(caption => _ = caption
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

            .Bind(ButtonContentRegion.TooltipProperty, nameof(ITextBaseModel.Tooltip), UIBindingScope.Relative)
        );

        _ = Bind(VisibleProperty, nameof(ITextBaseModel.Visible), UIBindingScope.Relative);
        _ = Bind(EnabledProperty, nameof(ITextBaseModel.Enabled), UIBindingScope.Relative);
        _ = Bind(ClosableProperty, nameof(ITabItemModel.Closable), UIBindingScope.Relative);

        // Two-way, explicitly: the raw Bind takes OneWay whatever the property's own default is, and these two
        // exist to be written — a rename commits through the caption, a drag through the order.
        _ = Bind(CaptionTextProperty, nameof(ITextBaseModel.Title), UIBindingScope.Relative, UIBindingMode.TwoWay);
        _ = Bind(OrderProperty, nameof(ITabItemModel.Order), UIBindingScope.Relative, UIBindingMode.TwoWay);
    }
}

/// <summary>
/// The built-in template rendering an <see cref="ITabItemModel"/> as a tab.
/// </summary>
public sealed class DefaultTabItemTemplate(string? itemPath = null, bool binds = false) : DefaultTabItemTemplate<DefaultTabItemTemplate>(itemPath, binds), IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.default.tab-item.template";
}
