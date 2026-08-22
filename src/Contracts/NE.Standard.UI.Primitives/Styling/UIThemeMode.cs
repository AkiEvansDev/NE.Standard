namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// Defines supported UI theme modes.
/// </summary>
public enum UIThemeMode
{
    /// <summary>
    /// Always uses the light theme.
    /// </summary>
    Light = 0,

    /// <summary>
    /// Always uses the dark theme.
    /// </summary>
    Dark = 1,

    /// <summary>
    /// Follows the platform/system theme preference.
    /// </summary>
    Auto = 2,
}
