namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// Defines what a bar draws between two groups of its items.
/// </summary>
public enum UIGroupSeparator
{
    /// <summary>
    /// Nothing: the groups run into each other.
    /// </summary>
    None = 0,

    /// <summary>
    /// A step of air wider than the spacing between items.
    /// </summary>
    Gap = 1,

    /// <summary>
    /// A hairline across the bar.
    /// </summary>
    Rule = 2,
}
