using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Authoring.Components;

/// <summary>
/// A host whose rows the reader moves among themselves — dragged, or by Alt+Up and Alt+Down — an items view and a table alike; the
/// move raises the host's <c>move</c> event.
/// </summary>
public interface IDraggableRowsComponent : IVisualComponent
{
    /// <summary>
    /// Gets the registered property key for <see cref="Draggable"/>.
    /// </summary>
    static UIProperty DraggableProperty { get; } = new(nameof(Draggable));

    /// <summary>
    /// Gets the registered property key for <see cref="DragHandle"/>.
    /// </summary>
    static UIProperty DragHandleProperty { get; } = new(nameof(DragHandle));

    /// <summary>
    /// Gets the registered property key for <see cref="DragHandlePlacement"/>.
    /// </summary>
    static UIProperty DragHandlePlacementProperty { get; } = new(nameof(DragHandlePlacement));

    /// <summary>
    /// Gets whether a row whose item does not refuse it (<c>CanDrag</c>) can be moved to another place among the rows.
    /// </summary>
    bool? Draggable { get; }

    /// <summary>
    /// Gets whether a <see cref="Draggable"/> row is dragged only by its grip; the keyboard still moves it.
    /// </summary>
    bool? DragHandle { get; }

    /// <summary>
    /// Gets where a row's grip stands (<see cref="DragHandle"/>): at its end by default, or at its start.
    /// </summary>
    UIDragHandlePlacement? DragHandlePlacement { get; }
}
