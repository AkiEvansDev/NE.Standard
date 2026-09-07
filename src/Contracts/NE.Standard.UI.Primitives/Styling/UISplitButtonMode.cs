namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// Which part of a split button opens its menu.
/// </summary>
public enum UISplitButtonMode
{
    /// <summary>
    /// The main part runs the button's own command; the end part opens the menu.
    /// </summary>
    Split = 0,

    /// <summary>
    /// The whole button opens the menu — a menu button; the button's own click command is not used.
    /// </summary>
    Menu = 1
}
