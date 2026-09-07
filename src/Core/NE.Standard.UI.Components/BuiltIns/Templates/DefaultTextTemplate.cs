using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Templates;

/// <summary>
/// The built-in template rendering an <see cref="ITextModel"/>'s bound icon, title, description and badge as text.
/// </summary>
/// <remarks>Its row styling is only what a bound <c>null</c> falls back to; an item that says something still wins.</remarks>
[UIComponentPropertyBlock(typeof(IItemAbilitiesComponent))]
public abstract partial class DefaultTextTemplate<TTemplate> : TextComponent<TTemplate>, IItemAbilitiesComponent
    where TTemplate : DefaultTextTemplate<TTemplate>, IUIComponentDefinition
{
    /// <summary>
    /// Initializes a new text template, optionally binding its content to the item at <paramref name="itemPath"/>.
    /// </summary>
    protected DefaultTextTemplate(string? itemPath = null, bool binds = true) : base()
    {
        IconColor = UIThemeColor.FromStyle(UIColorStyle.Primary);
        TitleType = UITextAppearance.Body;
        TitleColor = UIThemeColor.FromStyle(UIColorStyle.OnBackground);
        BadgePlacement = UITextBadgePlacement.Trailing;
        // A row's badge stands for the row, not for its title's line.
        BadgeAlignment = UITextBadgeAlignment.Content;
        DescriptionType = UITextAppearance.Caption;
        DescriptionColor = UIThemeColor.FromStyle(UIColorStyle.OnSurface);
        // A row is pointed at, not read out of: selecting its text fights the click that chooses it.
        Selectable = false;

        if (!string.IsNullOrWhiteSpace(itemPath))
            _ = BindContext(itemPath, UIBindingScope.Relative);

        if (binds)
        {
            _ = this.BindText();

            _ = Bind(VisibilityProperty, nameof(ITextModel.Visibility), UIBindingScope.Relative);
            _ = Bind(EnabledProperty, nameof(ITextModel.Enabled), UIBindingScope.Relative);
            _ = this.BindItemAbilities();
        }
    }
}

/// <summary>
/// The built-in template rendering an <see cref="ITextModel"/>'s bound icon, title, description and badge as text.
/// </summary>
public sealed class DefaultTextTemplate(string? itemPath = null, bool binds = false) : DefaultTextTemplate<DefaultTextTemplate>(itemPath, binds), IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.default.text.template";
}
