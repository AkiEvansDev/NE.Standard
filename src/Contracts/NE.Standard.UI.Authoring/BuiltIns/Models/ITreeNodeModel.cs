namespace NE.Standard.UI.Authoring.BuiltIns.Models;

/// <summary>
/// One node of a tree: a text item naming the node above it, in a flat list in walking order. A rename writes the new
/// <c>Title</c> back through the node's two-way binding, so the node shows it at once; the controller judges it on <c>rename</c>.
/// </summary>
public interface ITreeNodeModel : ITextBaseModel
{
    /// <summary>
    /// Gets the key of the node this one sits under, or <see langword="null"/> at the root.
    /// </summary>
    string? ParentId { get; }

    /// <summary>
    /// Gets the kind naming the node template variant that draws this node, or <see langword="null"/> for the default.
    /// </summary>
    string? Kind { get; }

    /// <summary>
    /// Gets whether the node has children even when none are in the list yet; the first unfold asks the controller for them.
    /// </summary>
    bool? HasChildren { get; }

    /// <summary>
    /// Gets whether the node starts unfolded; the viewer's own fold takes over from there.
    /// </summary>
    bool? Expanded { get; }

    /// <summary>
    /// Gets the key of the node this one was dropped on, empty for the tree's ground; written by a drop, read on <c>move</c>.
    /// </summary>
    string? DropTarget { get; }
}
