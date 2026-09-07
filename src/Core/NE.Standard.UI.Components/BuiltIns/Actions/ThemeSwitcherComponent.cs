using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Actions;

/// <summary>
/// A button that switches the page between the light and dark theme, and wears the theme it offers.
/// </summary>
/// <remarks>Both glyphs are rendered and <c>:root[data-ui-theme]</c> picks one, because the shell is cached across themes.</remarks>
[UIComponentPropertyBlock(typeof(ISurfaceComponent))]
[UIComponentPropertyBlock(typeof(IBorderedComponent))]
[UIComponentPropertyBlock(typeof(ITooltipComponent))]
public abstract partial class ThemeSwitcherComponent<T> : VisualComponentBase<T>, ISurfaceComponent, IBorderedComponent, ITooltipComponent
    where T : ThemeSwitcherComponent<T>, IUIComponentDefinition
{
    /// <summary>
    /// Initializes the switcher centred, as a button.
    /// </summary>
    protected ThemeSwitcherComponent(string? id = null) : base(id)
    {
        HorizontalAlignment = UIAlignment.Center;
        VerticalAlignment = UIAlignment.Center;
    }

    /// <summary>
    /// Gets or sets the glyph shown while the page is dark — the one that offers the light theme.
    /// </summary>
    [UIComponentProperty]
    public string? LightIcon { get; set; }

    /// <summary>
    /// Gets or sets the glyph shown while the page is light — the one that offers the dark theme.
    /// </summary>
    [UIComponentProperty]
    public string? DarkIcon { get; set; }

    /// <summary>
    /// Gets or sets the size both glyphs are drawn at.
    /// </summary>
    [UIComponentProperty]
    public UIIconSize? IconSize { get; set; }

    /// <summary>
    /// Gets or sets the button style.
    /// </summary>
    [UIComponentProperty(DefaultValue = UIButtonType.Ghost)]
    public UIButtonType? Type { get; set; }

    /// <summary>
    /// Gets or sets the button size — the box the glyph sits in.
    /// </summary>
    [UIComponentProperty(DefaultValue = UIButtonSize.Medium)]
    public UIButtonSize? Size { get; set; }
}

/// <summary>
/// A button that switches the page between the light and dark theme, and wears the theme it offers.
/// </summary>
public sealed class ThemeSwitcherComponent(string? id = null) : ThemeSwitcherComponent<ThemeSwitcherComponent>(id), IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.theme-switcher";
}
