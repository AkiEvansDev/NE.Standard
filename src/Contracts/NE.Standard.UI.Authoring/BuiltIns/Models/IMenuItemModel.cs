using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Authoring.BuiltIns.Models;

/// <summary>
/// Represents one entry of a menu: an item, a section caption, a separator, a check or a select, with an optional nested list.
/// </summary>
public interface IMenuItemModel : ITextBaseModel
{
    /// <summary>
    /// Gets what this entry is. <see langword="null"/> reads as <see cref="UIMenuItemKind.Item"/>.
    /// </summary>
    UIMenuItemKind? Kind { get; }

    /// <summary>
    /// Gets the route this entry navigates to. An entry may carry a URL, a click command, or both.
    /// </summary>
    [SuppressMessage("Design", "CA1056:URI-like properties should not be strings", Justification = "The value is only ever written verbatim into an href attribute; a Uri type would require additional rendering/converter plumbing with no benefit here.")]
    string? Url { get; }

    /// <summary>
    /// Gets whether this entry is the current one.
    /// </summary>
    bool? Selected { get; }

    /// <summary>
    /// Gets whether this entry's sub-entries start out open; meaningless on an entry with none. This is the
    /// initial position only — the live state afterwards is kept client-side.
    /// </summary>
    bool? Expanded { get; }

    /// <summary>
    /// Gets the key combination that fires this entry, written as <c>Ctrl+Shift+P</c> and matched by physical
    /// key so it keeps working on a non-Latin layout.
    /// </summary>
    string? Shortcut { get; }

    /// <summary>
    /// Gets whether a <see cref="UIMenuItemKind.Check"/> entry is on.
    /// </summary>
    bool? Checked { get; }

    /// <summary>
    /// Gets what a <see cref="UIMenuItemKind.Select"/> entry currently says at its end — the chosen option's name, as the
    /// controller words it.
    /// </summary>
    string? Value { get; }

    /// <summary>
    /// Gets the nested entries, empty for a leaf; for a <see cref="UIMenuItemKind.Select"/> entry, its choices.
    /// </summary>
    IEnumerable<IMenuItemModel> Items { get; }
}
