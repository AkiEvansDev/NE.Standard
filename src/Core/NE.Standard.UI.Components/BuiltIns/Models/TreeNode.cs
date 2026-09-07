using System;
using System.Collections.Generic;
using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Primitives.Annotations;

namespace NE.Standard.UI.Components.BuiltIns.Models;

/// <summary>
/// A data model for one node of a tree — a text item with the key of the node above it — for lists bound to <see cref="ITreeNodeModel"/>.
/// </summary>
public partial class TreeNode : TextBaseItem, ITreeNodeModel
{
    /// <inheritdoc />
    [RecursiveMember]
    public partial string? ParentId { get; set; }

    /// <inheritdoc />
    [RecursiveMember]
    public partial string? Kind { get; set; }

    /// <inheritdoc />
    [RecursiveMember]
    public partial bool? HasChildren { get; set; }

    /// <inheritdoc />
    [RecursiveMember]
    public partial bool? Expanded { get; set; }

    /// <inheritdoc />
    [RecursiveMember]
    public partial string? DropTarget { get; set; }

    /// <summary>
    /// Writes a nested structure out as the flat list a tree takes: each node, then its children, with <see cref="ParentId"/> set on
    /// the way down. <paramref name="toNode"/> makes the node, <paramref name="children"/> names what sits under a source.
    /// </summary>
    public static IReadOnlyList<TreeNode> Flatten<TSource>(IEnumerable<TSource> roots, Func<TSource, IEnumerable<TSource>?> children, Func<TSource, TreeNode> toNode)
    {
        ArgumentNullException.ThrowIfNull(roots);
        ArgumentNullException.ThrowIfNull(children);
        ArgumentNullException.ThrowIfNull(toNode);

        List<TreeNode> nodes = [];

        AppendSubtree(roots, null, children, toNode, nodes);

        return nodes;
    }

    private static void AppendSubtree<TSource>(IEnumerable<TSource> sources, string? parentId, Func<TSource, IEnumerable<TSource>?> children, Func<TSource, TreeNode> toNode, List<TreeNode> nodes)
    {
        foreach (TSource source in sources)
        {
            TreeNode node = toNode(source);

            node.ParentId = parentId;
            nodes.Add(node);

            IEnumerable<TSource>? below = children(source);

            if (below is not null)
                AppendSubtree(below, node.Id, children, toNode, nodes);
        }
    }
}
