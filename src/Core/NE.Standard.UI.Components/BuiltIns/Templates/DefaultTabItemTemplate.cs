using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Navigation;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Binding;

namespace NE.Standard.UI.Components.BuiltIns.Templates;

/// <summary>
/// The built-in template rendering an <see cref="ITabItemModel"/> as a tab.
/// </summary>
/// <remarks>Only the tab is bound — its caption, order and pin; the page is whatever the author put in it.</remarks>
public abstract class DefaultTabItemTemplate<TTemplate> : TabItemComponent<TTemplate>
    where TTemplate : DefaultTabItemTemplate<TTemplate>, IUIComponentDefinition
{
    /// <summary>
    /// Initializes a new tab template, optionally binding its caption to the item at <paramref name="itemPath"/>.
    /// </summary>
    protected DefaultTabItemTemplate(string? itemPath = null, bool binds = false) : base()
    {
        if (!string.IsNullOrWhiteSpace(itemPath))
            _ = BindContext(itemPath, UIBindingScope.Relative);

        if (!binds)
            return;

        _ = ConfigureDefaultCaption(caption => _ = caption.BindTextBase());

        _ = Bind(VisibilityProperty, nameof(ITextBaseModel.Visibility), UIBindingScope.Relative);
        _ = Bind(EnabledProperty, nameof(ITextBaseModel.Enabled), UIBindingScope.Relative);
        _ = this.BindItemAbilities();

        // What the strip writes back — a rename, a drop, a pin: the raw Bind takes each property's own default mode, two-way.
        _ = Bind(RenamedTitleProperty, nameof(ITextBaseModel.Title), UIBindingScope.Relative);
        _ = Bind(OrderProperty, nameof(ITabItemModel.Order), UIBindingScope.Relative);
        _ = Bind(PinnedProperty, nameof(ITabItemModel.Pinned), UIBindingScope.Relative);
    }
}

/// <summary>
/// The built-in template rendering an <see cref="ITabItemModel"/> as a tab.
/// </summary>
public sealed class DefaultTabItemTemplate(string? itemPath = null, bool binds = false) : DefaultTabItemTemplate<DefaultTabItemTemplate>(itemPath, binds), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.default.tab-item.template";
}
