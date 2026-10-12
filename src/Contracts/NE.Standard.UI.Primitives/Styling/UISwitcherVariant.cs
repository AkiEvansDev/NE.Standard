namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// How a page switcher (the theme's, the language's) is drawn: a button for a page's head, or a field for a settings form.
/// </summary>
public enum UISwitcherVariant
{
    /// <summary>A button: a press switches, or opens the list where there are more than two choices.</summary>
    Button = 0,

    /// <summary>
    /// A select-shaped field: its title over a box in the input family's appearance showing the current choice, a press opening the list.
    /// </summary>
    Field = 1
}
