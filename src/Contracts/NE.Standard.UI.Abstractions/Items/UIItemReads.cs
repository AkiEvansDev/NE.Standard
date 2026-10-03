using System;
using System.Collections.Generic;

namespace NE.Standard.UI.Abstractions.Items;

/// <summary>
/// What the page reads off a host's rows beyond what its templates, rules and keys read — named item paths, or the whole item —
/// so each row carries it.
/// </summary>
public sealed class UIItemReads
{
    /// <summary>
    /// Creates the reads of the given dotted item paths (<c>Items.Id</c> reads the keys of a nested list).
    /// </summary>
    public UIItemReads(IReadOnlyList<string> paths)
    {
        ArgumentNullException.ThrowIfNull(paths);

        for (var i = 0; i < paths.Count; i++)
            ArgumentException.ThrowIfNullOrWhiteSpace(paths[i]);

        Paths = [.. paths];
    }

    private UIItemReads()
    {
        IsWhole = true;
        Paths = [];
    }

    /// <summary>
    /// Gets the reads of a page that reads a row's item raw, past what the compile can see: the item travels whole.
    /// </summary>
    public static UIItemReads Whole { get; } = new();

    /// <summary>
    /// Gets whether the item travels whole.
    /// </summary>
    public bool IsWhole { get; }

    /// <summary>
    /// Gets the dotted item paths read, empty for <see cref="Whole"/>.
    /// </summary>
    public string[] Paths { get; }
}
