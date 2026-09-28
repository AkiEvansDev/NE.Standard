using System;

namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// The built-in entries a tabs view's tab menu offers, combined; <see cref="Close"/> and <see cref="Delete"/> are the two forms
/// of its one remove entry and are never chosen together.
/// </summary>
[Flags]
public enum UITabMenuEntries
{
    /// <summary>No built-in entry: the menu holds only the application's own.</summary>
    None = 0,

    /// <summary>Opens the caption's rename field.</summary>
    Rename = 1,

    /// <summary>Pin or Unpin, by the tab's pinned state.</summary>
    Pin = 2,

    /// <summary>The remove entry as a neutral Close: what the tab's own cross does.</summary>
    Close = 4,

    /// <summary>The remove entry as a destructive Delete, drawn in the danger colour: what the tab's own cross does.</summary>
    Delete = 8,
}
