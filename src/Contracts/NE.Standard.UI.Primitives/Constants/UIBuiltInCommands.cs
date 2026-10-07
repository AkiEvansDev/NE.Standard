using System;

namespace NE.Standard.UI.Primitives.Constants;

/// <summary>
/// Commands the framework runs itself, raised by a page's events as a controller's are; the <c>ui:</c> prefix is reserved for them.
/// </summary>
public static class UIBuiltInCommands
{
    /// <summary>
    /// Puts a tab at the place it was dropped in its strip, writing the orders the strip sorts on; refused for a tab that may not be
    /// dragged.
    /// </summary>
    public const string MoveTab = "ui:move-tab";

    /// <summary>
    /// Puts a tab just pinned or unpinned at the edge of the pinned tabs, writing the orders the strip sorts on.
    /// </summary>
    public const string PlaceTab = "ui:place-tab";

    /// <summary>The argument a built-in command reads its item's key from.</summary>
    public const string KeyArgument = "id";

    /// <summary>The argument a built-in command reads the place it puts its item at from.</summary>
    public const string IndexArgument = "index";

    private const string Prefix = "ui:";

    /// <summary>Whether a command is the framework's own rather than a controller's.</summary>
    public static bool IsBuiltIn(string command)
        => command.StartsWith(Prefix, StringComparison.Ordinal);
}
