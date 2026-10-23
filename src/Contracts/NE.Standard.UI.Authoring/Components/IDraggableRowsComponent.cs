using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Authoring.Components;

/// <summary>
/// A host whose rows the reader moves among themselves — dragged, or by Alt+Up and Alt+Down — an items view and a table alike, by the
/// whole row or by a grip; the move raises the host's <c>move</c> event. Refused while a sort orders the rows, which would put the row
/// back.
/// </summary>
public interface IDraggableRowsComponent : IDraggableItemsComponent
{
    /// <summary>
    /// Gets the registered property key for <see cref="DragHandle"/>.
    /// </summary>
    static UIProperty DragHandleProperty { get; } = new(nameof(DragHandle));

    /// <summary>
    /// Gets the registered property key for <see cref="DragHandlePlacement"/>.
    /// </summary>
    static UIProperty DragHandlePlacementProperty { get; } = new(nameof(DragHandlePlacement));

    /// <summary>
    /// Gets or sets whether a <see cref="IDraggableItemsComponent.Draggable"/> row is dragged only by its grip (<see cref="DragHandlePlacement"/>); the rest of
    /// the row keeps its text selection and its presses, and the keyboard still moves rows by Alt+Up and Alt+Down. A table draws the
    /// grips in a narrow track of their own; a wrapped items view draws none, and its tiles drag whole.
    /// </summary>
    [UIComponentProperty(DefaultValue = false)]
    bool? DragHandle { get; set; }

    /// <summary>
    /// Gets or sets where a row's grip stands (<see cref="DragHandle"/>): at its end by default, or at its start — in a table, the
    /// grips' track past the last column or before the first, pinned with it where the first column is pinned.
    /// </summary>
    [UIComponentProperty(DefaultValue = UIDragHandlePlacement.End)]
    UIDragHandlePlacement? DragHandlePlacement { get; set; }
}

/// <summary>
/// Fluent shorthands over <see cref="IDraggableRowsComponent"/>, shared by every host whose rows move whatever else it derives from.
/// </summary>
public static class DraggableRowsComponentExtensions
{
    /// <summary>
    /// Drags a <c>Draggable</c> row only by a grip at <paramref name="placement"/> (<see cref="IDraggableRowsComponent.DragHandle"/>).
    /// </summary>
    public static T SetDragHandle<T>(this T component, UIDragHandlePlacement placement) where T : IDraggableRowsComponent
    {
        component.DragHandle = true;
        component.DragHandlePlacement = placement;
        return component;
    }
}
