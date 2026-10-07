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
    /// <remarks>
    /// As a view's left side a rail is the navigation rail on a wide screen and the bottom navigation bar on a phone: where the sides
    /// become drawers (<see cref="UIViewOptions.SideDrawers"/>, below the medium breakpoint), a left side that holds the rail and
    /// nothing else — the rail itself, or containers, stack or wrap panels, surfaces and scroll containers each holding only the next
    /// one down to it — is no drawer and gets no button: the rail lies along the page's bottom as a horizontal rail does, the boxes
    /// around it laid aside, the content and footer ending above it; its groups fly out upward, and the arrows across it walk it. A
    /// side holding anything more, a <see cref="List"/> menu, and a right side stay drawers. A view that turns
    /// <see cref="UIViewOptions.RailBottomBar"/> off keeps that side a drawer too, its rail drawn there as a list: icon beside title,
    /// its groups opening inline.
    /// </remarks>
    Rail = 1,
}
