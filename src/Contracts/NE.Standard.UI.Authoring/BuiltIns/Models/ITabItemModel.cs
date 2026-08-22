namespace NE.Standard.UI.Authoring.BuiltIns.Models;

/// <summary>
/// Represents one tab of a tabs view: the caption's content plus where the tab sits and whether it closes.
/// </summary>
/// <remarks>
/// Extends <see cref="ITextBaseModel"/> rather than <see cref="ITextModel"/> for the same reason a menu entry
/// does: a caption has an icon, a title and a badge, but no second line.
/// </remarks>
public interface ITabItemModel : ITextBaseModel
{
    /// <summary>
    /// Gets where this tab sits in the strip, ascending.
    /// </summary>
    /// <remarks>
    /// The strip is sorted on this rather than on the collection's own order, so a drag never has to reorder
    /// the controller's collection — it writes one number back. The value is a <see cref="double"/> so a tab
    /// dropped between two others takes the midpoint and no other tab has to be renumbered; a controller that
    /// wants tidy integers is free to renumber afterwards.
    /// </remarks>
    double? Order { get; }

    /// <summary>
    /// Gets whether this tab shows a close button.
    /// </summary>
    bool? Closable { get; }
}
