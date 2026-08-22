namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// Defines how a selected search item is displayed in the search input.
/// </summary>
public enum UISearchSelectionDisplayMode
{
    /// <summary>
    /// Keeps the user's typed search text in the input after a selection is made.
    /// </summary>
    KeepSearchInput = 0,

    /// <summary>
    /// Replaces the input's text with the selected item's display value.
    /// </summary>
    ReplaceWithSelectedItem = 1,
}
