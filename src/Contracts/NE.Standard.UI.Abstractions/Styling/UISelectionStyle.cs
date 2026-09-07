using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Abstractions.Styling;

/// <summary>
/// What a chosen item looks like: its ground, its ink, and a mark on one edge; any unset part keeps the control's own default.
/// </summary>
/// <remarks>
/// Reaches the stylesheet as four custom properties (<c>--ui-selected-*</c>), so a custom look and the built-in ones share one rule set.
/// </remarks>
public readonly record struct UISelectionStyle(UIThemeColor? Background, UIThemeColor? Foreground, UISelectionMark? Mark, UIThemeColor? MarkColor, bool? Bold = null)
{
    /// <summary>
    /// A chosen item that says so only by its ground.
    /// </summary>
    public static UISelectionStyle Ground(UIThemeColor background)
        => new(background, null, UISelectionMark.None, null);

    /// <summary>
    /// A chosen item that says so by a line on one edge, in the given colour or the theme's primary.
    /// </summary>
    public static UISelectionStyle Marked(UISelectionMark mark, UIThemeColor? markColor = null)
        => new(null, null, mark, markColor);
}
