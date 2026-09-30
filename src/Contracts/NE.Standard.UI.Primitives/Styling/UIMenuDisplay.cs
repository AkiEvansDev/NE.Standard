namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// Defines how a menu lays out its entries: icon and title side by side, or a narrow rail of icons with a short label under each.
/// </summary>
public enum UIMenuDisplay
{
    /// <summary>
    /// Each entry is a row, its icon beside its title; the menu may fold to its icons alone.
    /// </summary>
    List = 0,

    /// <summary>
    /// A narrow column, each entry its icon over a one-line label, its badge on the icon's corner; it never folds, and its groups
    /// fly out beside it as a folded menu's do.
    /// </summary>
    Rail = 1,
}
