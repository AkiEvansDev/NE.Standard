using System;

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
    /// Gets which regions run the page's full length: the header and footer across (the default), or the sides down.
    /// </summary>
    public UIShellLayout ShellLayout { get; init; }

    /// <summary>Gets whether the sides become drawers on a narrow screen; on unless the view turns it off.</summary>
    /// <remarks>
    /// Below the medium breakpoint the sides leave the page's columns and slide over the content, each opened by a button the header
    /// carries, so a phone gives the content its whole width. Off, the sides keep their columns at every width.
    /// </remarks>
    public bool SideDrawers { get; init; } = true;

    /// <summary>
    /// Gets which corner this view's notifications stack in.
    /// </summary>
    public UINotificationPlacement NotificationPlacement { get; init; } = UINotificationPlacement.Bottom;

    /// <summary>
    /// Gets the width, in pixels, every notification of this view takes whatever its message; a narrow screen narrows it further.
    /// </summary>
    public double NotificationWidth
    {
        get;
        init => field = double.IsFinite(value) && value > 0 ? value : throw new ArgumentOutOfRangeException(nameof(value), value, "A notification's width is a positive number of pixels.");
    } = 360;
}
