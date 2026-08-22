using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Authoring.BuiltIns.Models;

/// <summary>
/// Represents one entry of a menu: an item, a section caption or a separator, with an optional nested list.
/// </summary>
/// <remarks>
/// Extends <see cref="ITextBaseModel"/> rather than <see cref="ITextModel"/>: an entry has an icon, a title
/// and a badge, but no second line — a menu that needs one is a list of <c>ActionComponent</c> rows, not a
/// menu.
/// </remarks>
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
    /// Gets whether this entry's sub-entries start out open. Meaningless on an entry with none.
    /// </summary>
    /// <remarks>
    /// The author's opening position, not a live state: which group is open afterwards is the viewer's, and
    /// the client keeps it in the browser. Setting it matters because it is the only way the group can be
    /// open in the HTML the server writes — opened afterwards, the entries below it visibly move.
    /// </remarks>
    bool? Expanded { get; }

    /// <summary>
    /// Gets the key combination that fires this entry, written as <c>Ctrl+Shift+P</c>.
    /// </summary>
    /// <remarks>
    /// The text is shown muted on the entry's trailing edge and matched by <em>physical key</em>, so it keeps
    /// working on a non-Latin layout. Two entries claiming one combination make it fire nothing — there is no
    /// principled way to pick between them. A context menu's entries render the text but claim nothing: the
    /// menu lives in a row template, so every row would claim the same combination.
    /// </remarks>
    string? Shortcut { get; }

    /// <summary>
    /// Gets the nested entries, empty for a leaf.
    /// </summary>
    /// <remarks>
    /// One level, and rendered by the menu itself rather than by the item template: an entry that carries any
    /// of these is a group, drawn with its sub-entries under it and opened by its own click. A second level
    /// would need a third, and a navigation menu three deep is a different component.
    /// </remarks>
    /// <remarks>
    /// Rendered on the server only, so a menu whose entries are <em>bound</em> shows none of these — the
    /// client builds a bound collection from the item template, and the template has no sub-entries in it.
    /// See <c>docs/PLAN.md</c> §2.
    /// </remarks>
    /// <remarks>
    /// <see cref="IEnumerable{T}"/> rather than a list, because the concrete model holds a
    /// <c>RecursiveCollection</c> — an <c>IList</c>, which is invariant and could not satisfy a
    /// <c>IReadOnlyList</c> of the interface without copying on every read.
    /// </remarks>
    IEnumerable<IMenuItemModel> Items { get; }
}
