namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// Defines what a component does with the room it was given: fills it, keeps it empty, or gives it back.
/// </summary>
public enum UIVisibility
{
    /// <summary>
    /// Drawn, and taking part in everything: layout, hit-testing, focus and assistive technology.
    /// </summary>
    Visible = 0,

    /// <summary>
    /// Not drawn, but still holding its place — the layout around it does not move.
    /// </summary>
    Hidden = 1,

    /// <summary>
    /// Gone from the layout as well: everything after it closes the gap.
    /// </summary>
    Collapsed = 2
}
