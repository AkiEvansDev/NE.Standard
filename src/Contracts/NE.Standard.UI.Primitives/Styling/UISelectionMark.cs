namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// Defines the edge a chosen item draws its mark on — the line a tab has under it, a sidebar entry has
/// beside it — or that it draws none.
/// </summary>
public enum UISelectionMark
{
    /// <summary>
    /// No mark: the ground and the ink say it.
    /// </summary>
    None = 0,

    /// <summary>
    /// A line down the left edge.
    /// </summary>
    Left = 1,

    /// <summary>
    /// A line down the right edge.
    /// </summary>
    Right = 2,

    /// <summary>
    /// A line along the top edge.
    /// </summary>
    Top = 3,

    /// <summary>
    /// A line along the bottom edge.
    /// </summary>
    Bottom = 4,
}
