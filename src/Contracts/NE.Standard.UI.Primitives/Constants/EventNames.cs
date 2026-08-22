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
    /// Fires when a label is renamed in place.
    /// </summary>
    /// <remarks>
    /// Its own name rather than <see cref="Change"/>: a component may commit more than one value that way —
    /// a tab commits both its caption and its position — and a rename handler must not fire for the others.
    /// </remarks>
    public const string Rename = "rename";
}
