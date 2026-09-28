using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Interaction;

namespace NE.Standard.UI.Components.BuiltIns.Navigation;

/// <summary>
/// The tabs view's own tab menu: the keys of its built-in entries, and the keys its entry event carries.
/// </summary>
/// <remarks>An application's entry keys must not start with <see cref="Prefix"/>: those are the strip's to run.</remarks>
public static class UITabMenu
{
    /// <summary>The prefix every built-in entry's key carries.</summary>
    public const string Prefix = "tabs:";

    /// <summary>The name of the context menu the strip renders, which a tab's caption opens.</summary>
    public const string Name = "tab";

    /// <summary>Opens the caption's rename field, as a double click does, whether or not the strip is <c>Renamable</c>.</summary>
    public const string Rename = "tabs:rename";

    /// <summary>Pins the tab and moves it to the end of the pinned ones.</summary>
    public const string Pin = "tabs:pin";

    /// <summary>Unpins the tab and moves it to the head of the unpinned ones.</summary>
    public const string Unpin = "tabs:unpin";

    /// <summary>Does what the tab's own close does: raises its remove event.</summary>
    public const string Close = "tabs:close";

    /// <summary>Does what the tab's own close does, worded and coloured as a deletion.</summary>
    public const string Delete = "tabs:delete";

    /// <summary>The rule under Rename and Pin.</summary>
    public const string Separator = "tabs:separator";

    /// <summary>The rule between the application's entries and the remove entry, there only when the application added some.</summary>
    public const string RemoveSeparator = "tabs:separator-remove";

    /// <summary>The application's entry that was clicked, by its id: the first key of <c>EventNames.TabMenuEntry</c>.</summary>
    public static KeyValuePair<string, UIActionArgument> Entry(string name)
        => UIAction.ArgEventKey(name, 0);

    /// <summary>The key of the tab the menu was opened on: the second key of <c>EventNames.TabMenuEntry</c>.</summary>
    public static KeyValuePair<string, UIActionArgument> Tab(string name)
        => UIAction.ArgEventKey(name, 1);
}
