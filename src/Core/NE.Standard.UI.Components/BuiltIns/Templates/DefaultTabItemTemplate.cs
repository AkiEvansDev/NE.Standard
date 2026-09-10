using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Navigation;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Binding;

namespace NE.Standard.UI.Components.BuiltIns.Templates;

/// <summary>
/// The built-in template rendering an <see cref="ITabItemModel"/> as a tab.
/// </summary>
/// <remarks>Only the caption is bound; the page is whatever the author put in it.</remarks>
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

        _ = ConfigureDefaultCaption(caption => _ = caption.BindTextBase());

        _ = Bind(VisibilityProperty, nameof(ITextBaseModel.Visibility), UIBindingScope.Relative);
        _ = Bind(EnabledProperty, nameof(ITextBaseModel.Enabled), UIBindingScope.Relative);
        _ = Bind(PinnedProperty, nameof(ITabItemModel.Pinned), UIBindingScope.Relative);
        _ = this.BindItemAbilities();

        // Two-way explicitly: the raw Bind takes OneWay whatever the property's own default is.
        _ = Bind(RenamedTitleProperty, nameof(ITextBaseModel.Title), UIBindingScope.Relative, UIBindingMode.TwoWay);
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
