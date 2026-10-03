namespace NE.Standard.UI.Primitives.Constants;

/// <summary>
/// Provides standard event names used by built-in UI components.
/// </summary>
public static class EventNames
{
    /// <summary>
    /// Fires before a click is dispatched, and can block it.
    /// </summary>
    public const string BeforeClick = "before-click";

    /// <summary>
    /// Fires when a component is clicked.
    /// </summary>
    public const string Click = "click";

    /// <summary>
    /// Fires after a click has been dispatched.
    /// </summary>
    public const string AfterClick = "after-click";

    /// <summary>
    /// Fires when a component's value changes.
    /// </summary>
    public const string Change = "change";

    /// <summary>
    /// Fires when a component gains focus.
    /// </summary>
    public const string Focus = "focus";

    /// <summary>
    /// Fires when a component loses focus.
    /// </summary>
    public const string Blur = "blur";

    /// <summary>
    /// Fires when the pointer starts hovering over a component.
    /// </summary>
    public const string HoverStart = "mouse-enter";

    /// <summary>
    /// Fires when the pointer stops hovering over a component.
    /// </summary>
    public const string HoverEnd = "mouse-leave";

    /// <summary>
    /// Fires when a component's toggled state changes.
    /// </summary>
    public const string Toggle = "toggle";

    /// <summary>
    /// Fires when a component expands.
    /// </summary>
    public const string Expand = "expand";

    /// <summary>
    /// Fires when a component collapses.
    /// </summary>
    public const string Collapse = "collapse";

    /// <summary>
    /// Fires when a component opens.
    /// </summary>
    public const string Open = "open";

    /// <summary>
    /// Fires when a component closes.
    /// </summary>
    public const string Close = "close";

    /// <summary>
    /// Fires when a search query is submitted.
    /// </summary>
    public const string Search = "search";

    /// <summary>
    /// Fires on Enter in a one-line field, once the value it holds has reached the server; the field keeps the focus.
    /// </summary>
    public const string Enter = "enter";

    /// <summary>
    /// Fires when a label is renamed in place; distinct from <see cref="Change"/> because a component may commit more than
    /// one value that way, e.g. a tab's caption and position.
    /// </summary>
    public const string Rename = "rename";

    /// <summary>A tree node unfolded before its children are in the list; not <see cref="Expand"/>, which is a details element's toggle.</summary>
    public const string Unfold = "unfold";

    /// <summary>A tree node dropped on another after a drag; the node's <c>DropTarget</c> names where.</summary>
    public const string Move = "move";

    /// <summary>A tree node the viewer asked to remove with the Delete key.</summary>
    public const string Remove = "remove";

    /// <summary>An entry an application put into a tabs view's tab menu, carrying the entry's key and the tab's.</summary>
    public const string TabMenuEntry = "tab-menu-entry";

    /// <summary>
    /// What a view's own key chord (<c>UIViewBase.CreateShortcuts</c>) is raised as on the view's content, its chord after it:
    /// <c>shortcut:Ctrl+S</c>.
    /// </summary>
    public const string ShortcutPrefix = "shortcut:";
}
