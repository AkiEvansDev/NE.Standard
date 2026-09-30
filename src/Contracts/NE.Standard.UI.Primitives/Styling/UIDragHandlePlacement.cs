namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// Where the grip a row is dragged by stands along the row (<c>DragHandle</c>).
/// </summary>
public enum UIDragHandlePlacement
{
    /// <summary>
    /// At the row's end: after its content, past a table's last column.
    /// </summary>
    End = 0,

    /// <summary>
    /// At the row's start: before its content, before a table's first column, and pinned with it where the first column is.
    /// </summary>
    Start = 1,
}
