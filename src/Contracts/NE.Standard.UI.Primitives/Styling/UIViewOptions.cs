namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// The choices a view makes about its own shell rather than about any component in it.
/// </summary>
/// <remarks>
/// Deliberately not properties on components: nothing in the tree owns whether the header stays put while the
/// page scrolls, or which corner a toast appears in — those belong to the page as a whole, and a component
/// that tried to own them would have to be the only one of its kind on the view.
/// </remarks>
public sealed record UIViewOptions
{
    /// <summary>The options a view that declares none is compiled with.</summary>
    public static UIViewOptions Default { get; } = new();

    /// <summary>
    /// Gets whether the header region stays at the top of the viewport while the page scrolls under it.
    /// </summary>
    public bool StickyHeader { get; init; }

    /// <summary>
    /// Gets which corner this view's notifications stack in.
    /// </summary>
    public UINotificationPlacement NotificationPlacement { get; init; } = UINotificationPlacement.Bottom;
}
