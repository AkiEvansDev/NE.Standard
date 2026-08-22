using System;
using NE.Standard.UI.Abstractions.Styling.Theme;

namespace NE.Standard.UI.Application;

/// <summary>
/// Provides fluent configuration for application theme tokens.
/// </summary>
public sealed class UIApplicationThemeBuilder
{
    private UITheme _theme = UIThemeDefaults.Default;

    // The token types are sealed records with init-only members, so handing out or storing an instance
    // cannot leak mutability — no defensive copying is needed anywhere in this builder.
    internal UITheme Build()
    {
        _theme.Validate();

        return _theme;
    }

    /// <summary>
    /// Replaces the complete application theme.
    /// </summary>
    public UIApplicationThemeBuilder UseTheme(UITheme theme)
    {
        ArgumentNullException.ThrowIfNull(theme);

        theme.Validate();
        _theme = theme;

        return this;
    }

    /// <summary>
    /// Replaces the light palette.
    /// </summary>
    public UIApplicationThemeBuilder UseLightPalette(UIColorPalette palette)
    {
        ArgumentNullException.ThrowIfNull(palette);

        palette.Validate();
        _theme = _theme with { Light = palette };

        return this;
    }

    /// <summary>
    /// Replaces the dark palette.
    /// </summary>
    public UIApplicationThemeBuilder UseDarkPalette(UIColorPalette palette)
    {
        ArgumentNullException.ThrowIfNull(palette);

        palette.Validate();
        _theme = _theme with { Dark = palette };

        return this;
    }

    /// <summary>
    /// Configures the light palette.
    /// </summary>
    public UIApplicationThemeBuilder ConfigureLightPalette(Func<UIColorPalette, UIColorPalette> configure)
    {
        ArgumentNullException.ThrowIfNull(configure);

        UIColorPalette palette = configure(_theme.Light);
        ArgumentNullException.ThrowIfNull(palette);

        return UseLightPalette(palette);
    }

    /// <summary>
    /// Configures the dark palette.
    /// </summary>
    public UIApplicationThemeBuilder ConfigureDarkPalette(Func<UIColorPalette, UIColorPalette> configure)
    {
        ArgumentNullException.ThrowIfNull(configure);

        UIColorPalette palette = configure(_theme.Dark);
        ArgumentNullException.ThrowIfNull(palette);

        return UseDarkPalette(palette);
    }

    /// <summary>
    /// Replaces typography tokens shared by light and dark modes.
    /// </summary>
    public UIApplicationThemeBuilder UseTypography(UITypography typography)
    {
        ArgumentNullException.ThrowIfNull(typography);

        typography.Validate();
        _theme = _theme with { Typography = typography };

        return this;
    }

    /// <summary>
    /// Configures typography tokens shared by light and dark modes.
    /// </summary>
    public UIApplicationThemeBuilder ConfigureTypography(Func<UITypography, UITypography> configure)
    {
        ArgumentNullException.ThrowIfNull(configure);

        UITypography typography = configure(_theme.Typography);
        ArgumentNullException.ThrowIfNull(typography);

        return UseTypography(typography);
    }

    /// <summary>
    /// Replaces shape tokens shared by light and dark modes.
    /// </summary>
    public UIApplicationThemeBuilder UseShape(UIShape shape)
    {
        ArgumentNullException.ThrowIfNull(shape);

        shape.Validate();
        _theme = _theme with { Shape = shape };

        return this;
    }

    /// <summary>
    /// Configures shape tokens shared by light and dark modes.
    /// </summary>
    public UIApplicationThemeBuilder ConfigureShape(Func<UIShape, UIShape> configure)
    {
        ArgumentNullException.ThrowIfNull(configure);

        UIShape shape = configure(_theme.Shape);
        ArgumentNullException.ThrowIfNull(shape);

        return UseShape(shape);
    }
}
