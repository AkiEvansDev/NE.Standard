using System;

namespace NE.Standard.UI.Primitives.Constants;

/// <summary>
/// Provides standard region names used by built-in UI components.
/// </summary>
public static class RegionNames
{
    /// <summary>
    /// The header region of a component.
    /// </summary>
    public const string Header = "header";

    /// <summary>
    /// The control a header carries at its far edge, beside whatever the header itself says.
    /// </summary>
    public const string HeaderAction = "header-action";

    /// <summary>
    /// The main content region of a component.
    /// </summary>
    public const string Content = "content";

    /// <summary>
    /// The footer region of a component.
    /// </summary>
    public const string Footer = "footer";

    /// <summary>
    /// The left-side region of a component.
    /// </summary>
    public const string LeftSide = "left-side";

    /// <summary>
    /// The right-side region of a component.
    /// </summary>
    public const string RightSide = "right-side";

    /// <summary>
    /// The region a flyout-like component anchors itself to.
    /// </summary>
    public const string Anchor = "anchor";

    /// <summary>
    /// The list of commands a split button drops.
    /// </summary>
    public const string Menu = "menu";

    /// <summary>
    /// The control a field carries at the end of its row — a copy, a generate, a look-up, or a menu of them; the first of the
    /// field's trailing actions, the others named by <see cref="FieldAction"/>.
    /// </summary>
    public const string TrailingAction = "trailing-action";

    /// <summary>
    /// The control a field carries at the start of its row — an attach, a pick; the first of the field's leading actions, the
    /// others named by <see cref="FieldAction"/>.
    /// </summary>
    public const string LeadingAction = "leading-action";

    /// <summary>
    /// What a collapsible control carries beside its collapse toggle, in one row with it — a search, a title — seen only while open.
    /// </summary>
    public const string ToggleContent = "toggle-content";

    /// <summary>
    /// The menu a tabs view opens on a tab's caption: its own entries with the application's among them.
    /// </summary>
    public const string TabMenu = "tab-menu";

    /// <summary>
    /// The region of a field's action at <paramref name="index"/> on one side (<see cref="LeadingAction"/> or
    /// <see cref="TrailingAction"/>): the side's own name for the first, so a field with one action keeps it, then numbered from 2.
    /// </summary>
    public static string FieldAction(string side, int index)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(side);
        ArgumentOutOfRangeException.ThrowIfNegative(index);

        return index == 0 ? side : $"{side}-{index + 1}";
    }
}
