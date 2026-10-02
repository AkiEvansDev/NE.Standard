namespace NE.Standard.UI.Authoring.BuiltIns.Models;

/// <summary>One node of a tree, given as a flat list in walking order.</summary>
/// <remarks>A rename writes the new <c>Title</c> back through the two-way binding at once; the controller judges it on <c>rename</c>.</remarks>
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
    /// Gets whether the node is a folder, the only kind a drag drops onto: unset for a node holding children, <see langword="true"/>
    /// for one even while empty, <see langword="false"/> for one that takes no drop. Unlike <see cref="HasChildren"/>, it asks the
    /// controller for nothing.
    /// </summary>
    bool? IsFolder { get; }

    /// <summary>
    /// Gets whether the node starts unfolded; the viewer's own fold takes over from there.
    /// </summary>
    bool? Expanded { get; }

    /// <summary>
    /// Gets the key of the folder this one was moved into, empty for the tree's top level; written by a move, read on <c>move</c>, whose
    /// event value is the place among that folder's nodes.
    /// </summary>
    string? DropTarget { get; }
}
