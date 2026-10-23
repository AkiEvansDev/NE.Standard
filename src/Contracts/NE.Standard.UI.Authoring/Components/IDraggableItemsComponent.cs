using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Primitives.Annotations;

namespace NE.Standard.UI.Authoring.Components;

/// <summary>
/// A host whose items the reader moves — dragged, or by Alt with an arrow — a list's and a table's rows, a tree's nodes, a strip's
/// tabs; the move raises the host's <c>move</c>.
/// </summary>
public interface IDraggableItemsComponent : IVisualComponent
{
    /// <summary>
    /// Gets the registered property key for <see cref="Draggable"/>.
    /// </summary>
    static UIProperty DraggableProperty { get; } = new(nameof(Draggable));

    /// <summary>
    /// Gets whether an item that does not refuse it (<c>CanDrag</c>) can be dragged to another place, or moved one place by Alt with an
    /// arrow; the move raises <c>move</c>, and the server refuses the move of an item that says <c>CanDrag</c> false.
    /// </summary>
    [UIComponentProperty(DefaultValue = false)]
    bool? Draggable { get; }
}
