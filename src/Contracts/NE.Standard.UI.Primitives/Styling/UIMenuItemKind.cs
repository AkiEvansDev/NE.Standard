namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// Defines what one entry of a menu is: a selectable item, a section header, a separator, an option with a check mark, or a
/// setting whose choices open beside it.
/// </summary>
public enum UIMenuItemKind
{
    /// <summary>
    /// A selectable entry: icon, title, and either a URL or a command.
    /// </summary>
    Item = 0,

    /// <summary>
    /// A caption introducing the entries below it. Not selectable.
    /// </summary>
    Header = 1,

    /// <summary>
    /// A rule between entries. Carries no content.
    /// </summary>
    Separator = 2,

    /// <summary>
    /// An option that is on or off: a check mark at the entry's end says which. The click is the entry's command; the
    /// controller flips <c>Checked</c>.
    /// </summary>
    Check = 3,

    /// <summary>
    /// A setting: its current <c>Value</c> at the entry's end, and its nested entries — the choices — opening beside it on click,
    /// whatever the menu's fold.
    /// </summary>
    Select = 4,
}
