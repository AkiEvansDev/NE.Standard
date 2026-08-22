namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// Defines what one entry of a menu is, so a single collection can carry entries, section captions and
/// rules — which is what a menu and a context menu both need, and what a separate model per kind would
/// have made impossible to express in one bound list.
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
}
