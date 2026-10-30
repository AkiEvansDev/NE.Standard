using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Contents;

/// <summary>
/// A standalone icon glyph, rendered by name from the registered icon font/set.
/// </summary>
[UIComponentPropertyDefault(nameof(IVisualComponent.HorizontalAlignment), nameof(DefaultAlignment))]
[UIComponentPropertyDefault(nameof(IVisualComponent.VerticalAlignment), nameof(DefaultAlignment))]
[UIComponentPropertyBlock(typeof(ITooltipComponent))]
public abstract partial class IconComponent<T>(string? id = null) : VisualComponentBase<T>(id), ITooltipComponent
    where T : IconComponent<T>, IUIComponentDefinition
{
    private static readonly UIResponsive<UIAlignment> DefaultAlignment = UIAlignment.Center;
    private static readonly UIThemeColor DefaultColor = UIThemeColor.FromStyle(UIColorStyle.Default);

    /// <summary>
    /// Gets or sets the icon rendered, by name from the registered icon font/set.
    /// </summary>
    [UIComponentProperty(DefaultValue = null)]
    public string? Icon { get; set; }

    /// <summary>
    /// Gets or sets the icon's colour; unset resolves to <c>color: inherit</c>, so it follows whatever it's drawn in.
    /// </summary>
    [UIComponentProperty(DefaultValueMember = nameof(DefaultColor))]
    public UIThemeColor? Color { get; set; }

    /// <summary>
    /// Gets or sets the icon's size — Small, Medium, or Large; default Medium.
    /// </summary>
    [UIComponentProperty(DefaultValue = UISize.Medium)]
    public UISize? Size { get; set; }

    /// <summary>
    /// Gets or sets the shape an icon is drawn in — <see cref="UIShape.Circle"/> cuts a picture round, for a person's avatar, and
    /// stands a glyph on a faint disc of its colour twice its size, for a status's mark.
    /// </summary>
    [UIComponentProperty(DefaultValue = null)]
    public UIShape? Shape { get; set; }

    /// <summary>
    /// Gets or sets the glyph a picture shows while it has no picture — a round one (<see cref="Shape"/> Circle) none given or one that
    /// fails, any other one that fails; unset, <c>UIGlyphs.Person</c> on a round one and <c>UIGlyphs.Image</c> on any other.
    /// </summary>
    [UIComponentProperty(DefaultValue = null)]
    public string? IconFallback { get; set; }
}

/// <summary>
/// A standalone icon glyph, rendered by name from the registered icon font/set.
/// </summary>
public sealed class IconComponent(string? id = null) : IconComponent<IconComponent>(id), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.icon";
}
