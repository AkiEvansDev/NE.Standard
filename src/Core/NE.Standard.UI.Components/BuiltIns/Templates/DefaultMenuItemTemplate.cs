using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Navigation;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Binding;

namespace NE.Standard.UI.Components.BuiltIns.Templates;

/// <summary>
/// The built-in template rendering an <see cref="IMenuItemModel"/> as a menu entry.
/// </summary>
/// <remarks>An entry has no second line, so nothing from <see cref="ITextModel"/> is bound here.</remarks>
public abstract class DefaultMenuItemTemplate<TTemplate> : MenuItemComponent<TTemplate>
    where TTemplate : DefaultMenuItemTemplate<TTemplate>, IUIComponentDefinition
{
    /// <summary>
    /// Initializes a new menu entry template, optionally binding its label to the item at <paramref name="itemPath"/>.
    /// </summary>
    protected DefaultMenuItemTemplate(string? itemPath = null, bool binds = true) : base()
    {
        if (!string.IsNullOrWhiteSpace(itemPath))
            _ = BindContext(itemPath, UIBindingScope.Relative);

        if (binds)
        {
            _ = this.BindTextBase();

            _ = Bind(VisibilityProperty, nameof(ITextBaseModel.Visibility), UIBindingScope.Relative);
            _ = Bind(EnabledProperty, nameof(ITextBaseModel.Enabled), UIBindingScope.Relative);

            // Kind is not bound: the menu picks this variant by it, so the variant sets it statically.
            _ = Bind(UrlProperty, nameof(IMenuItemModel.Url), UIBindingScope.Relative);
            _ = Bind(SelectedProperty, nameof(IMenuItemModel.Selected), UIBindingScope.Relative);
            _ = Bind(ShortcutProperty, nameof(IMenuItemModel.Shortcut), UIBindingScope.Relative);
            _ = Bind(CheckedProperty, nameof(IMenuItemModel.Checked), UIBindingScope.Relative);
            _ = Bind(ValueProperty, nameof(IMenuItemModel.Value), UIBindingScope.Relative);
        }
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
