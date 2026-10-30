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
[UIComponentPropertyDefault(nameof(ITextComponent.IconColor), nameof(DefaultIconColor))]
[UIComponentPropertyDefault(nameof(ITextComponent.TitleType), nameof(DefaultTitleType))]
[UIComponentPropertyDefault(nameof(ITextComponent.TitleColor), nameof(DefaultTitleColor))]
[UIComponentPropertyDefault(nameof(ITextComponent.BadgePlacement), nameof(DefaultBadgePlacement))]
[UIComponentPropertyDefault(nameof(ITextMarkAlignmentComponent.BadgeAlignment), nameof(DefaultBadgeAlignment))]
[UIComponentPropertyDefault(nameof(ITextComponent.DescriptionType), nameof(DefaultDescriptionType))]
[UIComponentPropertyDefault(nameof(ITextComponent.DescriptionColor), nameof(DefaultDescriptionColor))]
[UIComponentPropertyBlock(typeof(IItemAbilitiesComponent))]
public abstract partial class DefaultTextTemplate<TTemplate> : TextComponent<TTemplate>, IItemAbilitiesComponent
    where TTemplate : DefaultTextTemplate<TTemplate>, IUIComponentDefinition
{
    private static readonly UIThemeColor DefaultIconColor = UIThemeColor.Default;
    private static readonly UITextAppearance DefaultTitleType = UITextAppearance.Body;
    private static readonly UIThemeColor DefaultTitleColor = UIThemeColor.FromStyle(UIColorStyle.OnBackground);
    private const UITextBadgePlacement DefaultBadgePlacement = UITextBadgePlacement.Trailing;
    // A row's badge stands for the row, not for its title's line.
    private const UITextBadgeAlignment DefaultBadgeAlignment = UITextBadgeAlignment.Content;
    private static readonly UITextAppearance DefaultDescriptionType = UITextAppearance.Caption;
    private static readonly UIThemeColor DefaultDescriptionColor = UIThemeColor.FromStyle(UIColorStyle.OnSurface);

    /// <summary>
    /// Initializes a new text template, optionally binding its content to the item at <paramref name="itemPath"/>.
    /// </summary>
    protected DefaultTextTemplate(string? itemPath = null, bool binds = false) : base()
    {
        if (!string.IsNullOrWhiteSpace(itemPath))
            _ = BindContext(itemPath, UIBindingScope.Relative);

        if (binds)
        {
            _ = this.BindText();

            _ = this.BindItemState();
            _ = this.BindItemAbilities();
        }
    }
}

/// <summary>
/// The built-in template rendering an <see cref="ITextModel"/>'s bound icon, title, description and badge as text.
/// </summary>
public sealed class DefaultTextTemplate(string? itemPath = null, bool binds = false) : DefaultTextTemplate<DefaultTextTemplate>(itemPath, binds), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.default.text.template";
}
