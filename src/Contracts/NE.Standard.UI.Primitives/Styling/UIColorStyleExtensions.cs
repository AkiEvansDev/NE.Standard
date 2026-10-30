namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// Provides the rules a tone carries beyond its colour.
/// </summary>
public static class UIColorStyleExtensions
{
    /// <summary>
    /// Whether a tone calls for a screen reader at once, as an alert: Warning and Danger, on a message, a page's outcome and a toast alike.
    /// </summary>
    public static bool IsUrgent(this UIColorStyle tone)
        => tone is UIColorStyle.Warning or UIColorStyle.Danger;
}
