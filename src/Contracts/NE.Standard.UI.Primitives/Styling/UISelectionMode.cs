namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// Defines how many of a list's items the viewer can have chosen at once.
/// </summary>
public enum UISelectionMode
{
    /// <summary>
    /// None: the rows are not chosen by clicking them.
    /// </summary>
    None = 0,

    /// <summary>
    /// One at a time — choosing a row lets the previous one go.
    /// </summary>
    One = 1,

    /// <summary>
    /// Any number — a click toggles the row it lands on.
    /// </summary>
    Many = 2,
}
