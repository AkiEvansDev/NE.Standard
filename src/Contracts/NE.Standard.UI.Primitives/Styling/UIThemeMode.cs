namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// The two themes a surface can be forced into. <see langword="null"/> means "inherit" on a component and
/// "follow the platform" on a session.
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
}
