using System;
using System.Collections.Generic;

namespace NE.Standard.UI.Abstractions.Styling;

/// <summary>
/// A pane container's layout: its panes' names in the order of their places, joined by commas (<c>chat,tasks,tree</c>).
/// </summary>
public static class UIPaneLayout
{
    /// <summary>The character a layout joins the names with.</summary>
    public const char Separator = ',';

    /// <summary>
    /// Which pane stands at each place: the name the layout gives that place where it names a pane not placed already, and the places
    /// left open, by a name it does not know or one it gave twice, filled with the panes it left out in the order they were added.
    /// </summary>
    /// <remarks>A layout kept from before a pane was renamed or added still places the rest where the viewer left them.</remarks>
    public static string[] Resolve(IReadOnlyList<UIPanePlace> places, string? layout)
    {
        ArgumentNullException.ThrowIfNull(places);

        var names = new string[places.Count];
        HashSet<string> known = new(places.Count, StringComparer.Ordinal);
        HashSet<string> placed = new(places.Count, StringComparer.Ordinal);

        foreach (UIPanePlace place in places)
            _ = known.Add(place.Name);

        if (!string.IsNullOrEmpty(layout))
        {
            var given = layout.Split(Separator, StringSplitOptions.TrimEntries);

            for (var i = 0; i < names.Length && i < given.Length; i++)
            {
                if (known.Contains(given[i]) && placed.Add(given[i]))
                    names[i] = given[i];
            }
        }

        var next = 0;

        for (var i = 0; i < names.Length; i++)
        {
            if (names[i] is not null)
                continue;

            while (!placed.Add(places[next].Name))
                next++;

            names[i] = places[next].Name;
        }

        return names;
    }

    /// <summary>The layout that places the named panes in this order.</summary>
    public static string Format(IEnumerable<string> names)
        => string.Join(Separator, names);
}
