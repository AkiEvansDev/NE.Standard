using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Contents;

/// <summary>
/// A standalone icon glyph, rendered by name from the registered icon font/set.
/// </summary>
[UIComponentPropertyBlock(typeof(ITooltipComponent))]
public abstract partial class IconComponent<T> : VisualComponentBase<T>, ITooltipComponent
    where T : IconComponent<T>, IUIComponentDefinition
{
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
    [UIComponentProperty(DefaultValue = UIIconSize.Medium)]
    public UIIconSize? Size { get; set; }

    /// <summary>
    /// Gets or sets the shape an icon that is a picture is drawn in — <see cref="UIIconShape.Circle"/> for a person's avatar; a
    /// glyph keeps its own.
    /// </summary>
    [UIComponentProperty(DefaultValue = null)]
    public UIIconShape? Shape { get; set; }

    protected IconComponent(string? id = null) : base(id)
    {
        HorizontalAlignment = UIAlignment.Center;
        VerticalAlignment = UIAlignment.Center;
    }
}

/// <summary>
/// A standalone icon glyph, rendered by name from the registered icon font/set.
/// </summary>
public sealed class IconComponent(string? id = null) : IconComponent<IconComponent>(id), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.icon";
}
