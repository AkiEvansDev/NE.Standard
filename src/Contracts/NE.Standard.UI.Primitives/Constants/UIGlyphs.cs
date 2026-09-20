namespace NE.Standard.UI.Primitives.Constants;

/// <summary>
/// The framework's own <c>ne-</c>-prefixed glyphs — its chrome's marks plus the few standard icons a package's chrome needs — served on every page with no icon pack installed.
/// </summary>
public static class UIGlyphs
{
    /// <summary>The prefix every glyph of the core's face carries, so its names never meet a pack's.</summary>
    public const string Prefix = "ne-";

    public const string ChevronDown = "ne-chevron-down";
    public const string ChevronUp = "ne-chevron-up";
    public const string ChevronLeft = "ne-chevron-left";
    public const string ChevronRight = "ne-chevron-right";
    public const string Close = "ne-close";
    public const string MoreHorizontal = "ne-more-horizontal";
    public const string MoreVertical = "ne-more-vertical";
    public const string Edit = "ne-edit";
    public const string Person = "ne-person";
    public const string Image = "ne-image";

    /// <summary>The pin filled: a pinned thing. <see cref="PinOutlined"/> is the offer to pin, <see cref="PinOff"/> the offer to unpin.</summary>
    public const string Pin = "ne-pin";
    public const string PinOutlined = "ne-pin-outlined";
    public const string PinOff = "ne-pin-off";
    public const string Check = "ne-check";
    public const string Calendar = "ne-calendar";
    public const string Menu = "ne-menu";
    public const string LightMode = "ne-light-mode";
    public const string DarkMode = "ne-dark-mode";
    public const string Colorize = "ne-colorize";
    public const string ArrowUp = "ne-arrow-up";
    public const string ArrowDown = "ne-arrow-down";

    /// <summary>The two ways a column may go: what a column sorted neither way shows, beside <see cref="ArrowUp"/> and <see cref="ArrowDown"/>.</summary>
    public const string Sort = "ne-sort";
    public const string FirstPage = "ne-first-page";
    public const string LastPage = "ne-last-page";
    public const string Filter = "ne-filter";
    public const string Columns = "ne-columns";
    public const string Add = "ne-add";
    public const string Search = "ne-search";
    public const string Delete = "ne-delete";

    /// <summary>A minus, the pair of <see cref="Add"/>: a zoom bar's step down, a list's take-away.</summary>
    public const string Remove = "ne-remove";

    /// <summary>Fit to the screen: a canvas brought back to show the whole of what it holds.</summary>
    public const string Fit = "ne-fit";

    /// <summary>One occurrence rewritten; <see cref="ReplaceAll"/> is the same done to every one of them.</summary>
    public const string Replace = "ne-replace";
    public const string ReplaceAll = "ne-replace-all";
}
