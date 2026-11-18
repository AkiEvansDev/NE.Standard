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

    /// <summary>Computes cell placements and reordered grid tracks at <paramref name="tier"/>, preserving tracks on <see cref="UIPanePlace.KeepsSize"/> runs.</summary>
    /// <remarks>
    /// A contiguous run of places along an axis whose panes all originate in that run and include a <see cref="UIPanePlace.KeepsSize"/>
    /// pane reorders each pane's authored tracks to match <c>pane-container-engine.ts</c>; elsewhere each pane takes its target place's
    /// size (including axes sized by splitters when <paramref name="columnsCarry"/> or <paramref name="rowsCarry"/> is <see langword="false"/>).
    /// </remarks>
    public static UIPaneArrangement Arrange(IReadOnlyList<UIPanePlace> places, IReadOnlyList<string> standing, UIResponsiveTier tier, int columns, int rows, bool columnsCarry, bool rowsCarry)
    {
        ArgumentNullException.ThrowIfNull(places);
        ArgumentNullException.ThrowIfNull(standing);

        UIGridPlacement[] cells = new UIGridPlacement[places.Count];

        for (var i = 0; i < cells.Length; i++)
            cells[i] = places[i].Placement.Resolve(tier);

        IReadOnlyList<int>? columnOrder = columnsCarry ? Carry(places, standing, cells, columns, true) : null;
        IReadOnlyList<int>? rowOrder = rowsCarry ? Carry(places, standing, cells, rows, false) : null;

        return new UIPaneArrangement(cells, columnOrder, rowOrder);
    }

    /// <summary>Lays each run along one axis again (<see cref="Arrange"/>); the tracks' authored indices in their new order, or null where none moved.</summary>
    private static int[]? Carry(IReadOnlyList<UIPanePlace> places, IReadOnlyList<string> standing, UIGridPlacement[] cells, int count, bool columns)
    {
        UIGridPlacement[] authored = [.. cells];
        Dictionary<string, int> home = new(places.Count, StringComparer.Ordinal);
        var seen = new bool[cells.Length];
        int[]? order = null;

        for (var i = 0; i < places.Count; i++)
            home[places[i].Name] = i;

        for (var first = 0; first < authored.Length; first++)
        {
            if (seen[first])
                continue;

            // A band: the places with the same cells across the axis, in the order they stand along it.
            List<int> band = [];

            for (var i = first; i < authored.Length; i++)
            {
                if (!seen[i] && Across(authored[i], columns) == Across(authored[first], columns))
                {
                    seen[i] = true;
                    band.Add(i);
                }
            }

            band.Sort((a, b) => Along(authored[a], columns).Start.CompareTo(Along(authored[b], columns).Start));

            var start = 0;

            for (var i = 1; i <= band.Count; i++)
            {
                if (i < band.Count && Along(authored[band[i]], columns).Start == End(authored[band[i - 1]], columns))
                    continue;

                if (i - start > 1)
                    order = CarryRun(band.GetRange(start, i - start), places, standing, home, authored, cells, count, columns, order);

                start = i;
            }
        }

        return order;
    }

    /// <summary>One run laid again with each pane's own tracks, where every pane in it comes from it and one keeps its size.</summary>
    private static int[]? CarryRun(List<int> run, IReadOnlyList<UIPanePlace> places, IReadOnlyList<string> standing, Dictionary<string, int> home, UIGridPlacement[] authored, UIGridPlacement[] cells, int count, bool columns, int[]? order)
    {
        var homes = new int[run.Count];
        var keeps = false;
        var moved = false;

        for (var i = 0; i < run.Count; i++)
        {
            if (!home.TryGetValue(standing[run[i]], out var from) || !run.Contains(from))
                return order;

            homes[i] = from;
            keeps |= places[from].KeepsSize;
            moved |= from != run[i];
        }

        var runStart = Along(authored[run[0]], columns).Start;
        var runEnd = End(authored[run[^1]], columns);

        if (!keeps || !moved || runEnd - 1 > count || CutsIntoRun(run, authored, columns, runStart, runEnd))
            return order;

        order ??= Identity(count);

        var offset = runStart;

        for (var i = 0; i < run.Count; i++)
        {
            (var homeStart, var span) = Along(authored[homes[i]], columns);

            for (var j = 0; j < span; j++)
                order[offset - 1 + j] = homeStart - 1 + j;

            cells[run[i]] = columns ? authored[run[i]] with { Column = offset, ColumnSpan = span } : authored[run[i]] with { Row = offset, RowSpan = span };
            offset += span;
        }

        return order;
    }

    /// <summary>Whether a place outside the run stands in part of its tracks: a new order would resize it.</summary>
    private static bool CutsIntoRun(List<int> run, UIGridPlacement[] authored, bool columns, int runStart, int runEnd)
    {
        for (var i = 0; i < authored.Length; i++)
        {
            if (run.Contains(i))
                continue;

            var start = Along(authored[i], columns).Start;
            var end = End(authored[i], columns);

            if (start < runEnd && end > runStart && (start > runStart || end < runEnd))
                return true;
        }

        return false;
    }

    private static (int Start, int Span) Along(UIGridPlacement cells, bool columns)
        => columns ? (cells.Column, cells.ColumnSpan) : (cells.Row, cells.RowSpan);

    private static (int Start, int Span) Across(UIGridPlacement cells, bool columns)
        => columns ? (cells.Row, cells.RowSpan) : (cells.Column, cells.ColumnSpan);

    /// <summary>The first track past the cells along the axis.</summary>
    private static int End(UIGridPlacement cells, bool columns)
    {
        (var start, var span) = Along(cells, columns);

        return start + span;
    }

    private static int[] Identity(int count)
    {
        var order = new int[count];

        for (var i = 0; i < count; i++)
            order[i] = i;

        return order;
    }
}
