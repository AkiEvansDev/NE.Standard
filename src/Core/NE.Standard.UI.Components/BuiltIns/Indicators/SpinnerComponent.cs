using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Localization;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Indicators;

/// <summary>
/// An indeterminate loading indicator, optionally shown alongside a title.
/// </summary>
/// <remarks>A status named by its title, by <c>AccessibleName</c> over it, or by the framework's "Loading" while it has neither.</remarks>
[UIComponentPropertyDefault(nameof(IVisualComponent.HorizontalAlignment), nameof(DefaultAlignment))]
[UIComponentPropertyDefault(nameof(IVisualComponent.VerticalAlignment), nameof(DefaultAlignment))]
[UIComponentPropertyBlock(typeof(IAccessibleNameComponent))]
public abstract partial class SpinnerComponent<T>(string? id = null) : VisualComponentBase<T>(id), IAccessibleNameComponent
    where T : SpinnerComponent<T>, IUIComponentDefinition
{
    private static readonly UIResponsive<UIAlignment> DefaultAlignment = UIAlignment.Center;
    private static readonly UIThemeColor DefaultColor = UIThemeColor.FromStyle(UIColorStyle.Default);
    private static readonly UIResponsive<UISize> DefaultSize = UISize.Medium;

    /// <summary>
    /// Gets or sets the words shown alongside the spinner.
    /// </summary>
    [Translatable]
    [UIComponentProperty(DefaultValue = null)]
    public UIPhrase? Title { get; set; }

    /// <summary>
    /// Gets or sets the spinner's size — Small, Medium, or Large, per breakpoint; default Medium.
    /// </summary>
    [UIComponentProperty(DefaultValueMember = nameof(DefaultSize))]
    public UIResponsive<UISize>? Size { get; set; }

    /// <summary>
    /// Gets or sets the spinner's colour; unset resolves to <c>color: inherit</c>, so it follows whatever it's drawn in.
    /// </summary>
    [UIComponentProperty(DefaultValueMember = nameof(DefaultColor))]
    public UIThemeColor? Color { get; set; }
}

/// <summary>
/// An indeterminate loading indicator, optionally shown alongside a title.
/// </summary>
public sealed class SpinnerComponent(string? id = null) : SpinnerComponent<SpinnerComponent>(id), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.spinner";
}
