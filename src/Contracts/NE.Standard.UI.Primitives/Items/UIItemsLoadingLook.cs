namespace NE.Standard.UI.Primitives.Items;

/// <summary>
/// What a windowed items view shows while it reads rows it does not have yet (<c>ItemsViewComponent.LoadingLook</c>).
/// </summary>
public enum UIItemsLoadingLook
{
    /// <summary>
    /// Grey bars in the rows' shape stand where the rows will land, shimmering while they are read: a list of rows alike.
    /// </summary>
    Skeleton = 0,

    /// <summary>
    /// No rows stand in: a small ring at the edge the rows come in at, over the rows in view and moving none — a conversation, whose
    /// messages differ in height and side, read from its end.
    /// </summary>
    Indicator = 1
}
