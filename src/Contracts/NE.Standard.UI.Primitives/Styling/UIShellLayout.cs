namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// Defines which of a view's regions run the page's full length: the header and footer across, or the sides down.
/// </summary>
public enum UIShellLayout
{
    /// <summary>
    /// The header and footer run the page's full width; the sides stand between them, beside the content.
    /// </summary>
    FullWidthBands = 0,

    /// <summary>
    /// The sides run the page's full height; the header and footer stand between them, over and under the content.
    /// </summary>
    FullHeightSides = 1,
}
