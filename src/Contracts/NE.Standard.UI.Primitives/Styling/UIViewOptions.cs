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
    /// <remarks>
    /// From the medium breakpoint up: narrower, the document scrolls, so a phone's browser can fold its toolbar away, the header still
    /// sticky — unless the content's root fills the height, whose regions keep their own scroll.
    /// </remarks>
    public bool ScrollContentOnly { get; init; }

    /// <summary>
    /// Gets which regions run the page's full length: the header and footer across (the default), or the sides down.
    /// </summary>
    public UIShellLayout ShellLayout { get; init; }

    /// <summary>Gets below which width the sides become drawers: below the medium breakpoint unless the view says otherwise.</summary>
    /// <remarks>
    /// There the sides leave the page's columns and slide over the content, each opened by a button the header carries, so the content
    /// takes the page's whole width; a left side that is a rail alone is a bar along the page's bottom instead
    /// (<see cref="UIMenuDisplay.Rail"/>), unless <see cref="RailBottomBar"/> is off. An open drawer covers its button, so a sidebar
    /// menu's fold switch lying there puts the drawer away rather than fold the menu. From the medium breakpoint up the reader may pin a
    /// drawer, which then stands in its column until unpinned — by a sidebar menu's pin (<c>MenuComponent.DrawerPin</c>) or the page's
    /// own button (<c>ButtonComponent.PinsDrawer</c>). <see cref="UISideDrawers.Never"/> keeps the sides in their columns at every width.
    /// </remarks>
    public UISideDrawers SideDrawers { get; init; }

    /// <summary>
    /// Gets whether the left side's open drawer dims the page and closes on a press beside it; on unless the view turns it off.
    /// </summary>
    /// <remarks>
    /// Off, the page beside the open drawer stays as it is and keeps working — a setting changed in the drawer, a button pressed beside
    /// it — and the drawer goes by its switch, its opener or Escape.
    /// </remarks>
    public bool LeftDrawerModal { get; init; } = true;

    /// <summary>Gets whether the right side's open drawer dims the page and closes on a press beside it, as <see cref="LeftDrawerModal"/> says.</summary>
    public bool RightDrawerModal { get; init; } = true;

    /// <summary>
    /// Gets whether a left side that is a rail alone becomes the page's bottom bar where the sides are drawers; on unless the view
    /// turns it off.
    /// </summary>
    /// <remarks>
    /// Off, that side is a drawer as any other, opened by the header's button, and the rail is drawn in it as a list — each entry its
    /// icon beside its title, its groups opening inline — so a page whose bottom is its own (a chat's composer) keeps it. Where the
    /// sides are columns the rail stands in its column either way; nothing under <see cref="UISideDrawers.Never"/>.
    /// </remarks>
    public bool RailBottomBar { get; init; } = true;

    /// <summary>Gets what the left side is to a screen reader's list of landmarks; read from the side unless the view says.</summary>
    /// <remarks>
    /// The header is the banner, the content the main region and the footer the content information whatever they hold; a side is the
    /// page's navigation where it holds a menu and nothing else (in plain boxes, as a rail alone is found), and complementary otherwise.
    /// </remarks>
    public UISideLandmark LeftSideLandmark { get; init; }

    /// <summary>Gets what the right side is to a screen reader's list of landmarks, as <see cref="LeftSideLandmark"/> says.</summary>
    public UISideLandmark RightSideLandmark { get; init; }

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
    } = 400;
}
