using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Binding;

namespace NE.Standard.UI.Components.BuiltIns.Templates;

/// <summary>
/// The built-in template rendering an <see cref="IButtonModel"/>'s bound icon, title, description and badge as a button.
/// </summary>
public abstract class DefaultButtonTemplate<TTemplate> : ButtonComponent<TTemplate>
    where TTemplate : DefaultButtonTemplate<TTemplate>, IUIComponentDefinition
{
    /// <summary>
    /// Initializes a new button template, optionally binding its label to the item at <paramref name="itemPath"/>.
    /// </summary>
    protected DefaultButtonTemplate(string? itemPath = null, bool binds = false) : base()
    {
        if (!string.IsNullOrWhiteSpace(itemPath))
            _ = BindContext(itemPath, UIBindingScope.Relative);

        if (binds)
        {
            _ = this.BindText();

            _ = this.BindItemState();

            // Safe to bind unconditionally: every item this template renders is IButtonModel-shaped.
            _ = Bind(TypeProperty, nameof(IButtonModel.Type), UIBindingScope.Relative, optional: true);
            _ = Bind(SizeProperty, nameof(IButtonModel.Size), UIBindingScope.Relative, optional: true);
        }
    }
}

/// <summary>
/// The built-in template rendering an <see cref="IButtonModel"/>'s bound icon, title, description and badge as a button.
/// </summary>
public sealed class DefaultButtonTemplate(string? itemPath = null, bool binds = false) : DefaultButtonTemplate<DefaultButtonTemplate>(itemPath, binds), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.default.button.template";
}
