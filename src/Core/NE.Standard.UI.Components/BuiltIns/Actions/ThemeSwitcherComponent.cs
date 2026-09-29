using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Actions;

/// <summary>
/// A button that switches the page between the light and dark theme, and wears the theme it offers.
/// </summary>
/// <remarks>Both glyphs render; the platform shows the one matching the current theme, since the shell is cached across themes.</remarks>
[UIComponentPropertyBlock(typeof(ISurfaceComponent))]
[UIComponentPropertyBlock(typeof(IBorderedComponent))]
[UIComponentPropertyBlock(typeof(ITooltipComponent))]
[UIComponentPropertyBlock(typeof(ISwitcherComponent))]
public abstract partial class ThemeSwitcherComponent<T> : VisualComponentBase<T>, ISurfaceComponent, IBorderedComponent, ITooltipComponent, ISwitcherComponent
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
}

/// <summary>
/// A button that switches the page between the light and dark theme, and wears the theme it offers.
/// </summary>
public sealed class ThemeSwitcherComponent(string? id = null) : ThemeSwitcherComponent<ThemeSwitcherComponent>(id), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.theme-switcher";
}
