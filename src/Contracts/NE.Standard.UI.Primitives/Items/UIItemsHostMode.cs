namespace NE.Standard.UI.Primitives.Items;

/// <summary>
/// How an items host holds its rows.
/// </summary>
public enum UIItemsHostMode
{
    /// <summary>
    /// Every row is in the document.
    /// </summary>
    Plain = 0,

    /// <summary>
    /// The client holds every item's value and keeps only the rows in view in the document.
    /// </summary>
    Virtualized = 1,

    /// <summary>
    /// The items come from a source on the controller, one window at a time.
    /// </summary>
    Windowed = 2
}
