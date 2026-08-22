using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Contents;

/// <summary>
/// A standalone icon glyph, rendered by name from the registered icon font/set.
/// </summary>
public abstract partial class IconComponent<T> : VisualComponentBase<T>
    where T : IconComponent<T>, IUIComponentDefinition
{
    private static readonly UIThemeColor DefaultColor = UIThemeColor.FromStyle(UIColorStyle.Default);

    /// <summary>
    /// Gets or sets the icon name to render.
    /// </summary>
    [Translatable]
    [UIComponentProperty(DefaultValue = null)]
    public string? Icon { get; set; }

    /// <summary>
    /// Gets or sets the icon's color.
    /// </summary>
    [UIComponentProperty(DefaultValueMember = nameof(DefaultColor))]
    public UIThemeColor? Color { get; set; }

    /// <summary>
    /// Gets or sets the icon's size.
    /// </summary>
    [UIComponentProperty(DefaultValue = UIIconSize.Medium)]
    public UIIconSize? Size { get; set; }

    /// <summary>
    /// Gets or sets the tooltip shown on hover.
    /// </summary>
    [Translatable]
    [UIComponentProperty(DefaultValue = null)]
    public string? Tooltip { get; set; }

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
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.icon";
}
