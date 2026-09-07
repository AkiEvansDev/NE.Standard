namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// The choices a view makes about its own shell rather than about any component in it.
/// </summary>
public sealed record UIViewOptions
{
    /// <summary>The options a view that declares none is compiled with.</summary>
    public static UIViewOptions Default { get; } = new();

    /// <summary>
    /// Gets whether the header region stays at the top of the viewport while the page scrolls under it.
    /// </summary>
    public bool StickyHeader { get; init; }

    /// <summary>
    /// Gets whether the page keeps the viewport's height, so the header and sides stand and only the content region scrolls.
    /// </summary>
    public bool ScrollContentOnly { get; init; }

    /// <summary>
    /// Gets which corner this view's notifications stack in.
    /// </summary>
    public UINotificationPlacement NotificationPlacement { get; init; } = UINotificationPlacement.Bottom;
}
