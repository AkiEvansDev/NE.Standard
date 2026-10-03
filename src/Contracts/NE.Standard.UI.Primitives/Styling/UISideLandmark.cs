namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// Defines what a side of the page is to a screen reader's list of landmarks (<see cref="UIViewOptions.LeftSideLandmark"/>).
/// </summary>
public enum UISideLandmark
{
    /// <summary>
    /// Read from the side: the page's navigation where it holds a menu and nothing else, else a complementary side.
    /// </summary>
    Auto = 0,

    /// <summary>
    /// The page's navigation, whatever the side holds.
    /// </summary>
    Navigation = 1,

    /// <summary>
    /// A complementary side, whatever it holds: a menu there filters or acts rather than goes somewhere.
    /// </summary>
    Complementary = 2,
}
