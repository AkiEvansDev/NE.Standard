using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Binding;

namespace NE.Standard.UI.Authoring.Components;

/// <summary>
/// The root of an item's row saying what its host may do with the item, each unset by default: chosen, dragged, removed,
/// renamed, or have its menu opened.
/// </summary>
public interface IItemAbilitiesComponent : IVisualComponent
{
    /// <summary>
    /// Gets the registered property key for <see cref="CanSelect"/>.
    /// </summary>
    static UIProperty CanSelectProperty { get; } = new(nameof(CanSelect));

    /// <summary>
    /// Gets the registered property key for <see cref="CanDrag"/>.
    /// </summary>
    static UIProperty CanDragProperty { get; } = new(nameof(CanDrag));

    /// <summary>
    /// Gets the registered property key for <see cref="CanRemove"/>.
    /// </summary>
    static UIProperty CanRemoveProperty { get; } = new(nameof(CanRemove));

    /// <summary>
    /// Gets the registered property key for <see cref="CanRename"/>.
    /// </summary>
    static UIProperty CanRenameProperty { get; } = new(nameof(CanRename));

    /// <summary>
    /// Gets the registered property key for <see cref="CanShowContextMenu"/>.
    /// </summary>
    static UIProperty CanShowContextMenuProperty { get; } = new(nameof(CanShowContextMenu));

    /// <summary>
    /// Gets whether the row may be chosen; unset means it may.
    /// </summary>
    /// <remarks>
    /// False here or on the item (<c>IItemAbilitiesModel</c>), by a static value or a controller binding, the server refuses a choice
    /// that takes the row, as it does one that takes a disabled row. A guard against a stale or forged page, not the permission
    /// itself: who may choose belongs in the setter.
    /// </remarks>
    [UIComponentProperty(DefaultValue = null, DefaultBindingScope = UIBindingScope.Relative)]
    bool? CanSelect { get; }

    /// <summary>
    /// Gets whether the row may be dragged, where its host drags at all; unset means it may.
    /// </summary>
    /// <remarks>
    /// False here or on the item, the server refuses the row's <c>move</c> — a tab's too — and a tree node's <c>DropTarget</c>, as it
    /// refuses a choice of a row not to be chosen: a guard against a stale or forged page, not the permission itself, which belongs in
    /// the command. A drop on another host (<c>OnDrop</c>) is its command's to check.
    /// </remarks>
    [UIComponentProperty(DefaultValue = null, DefaultBindingScope = UIBindingScope.Relative)]
    bool? CanDrag { get; }

    /// <summary>
    /// Gets whether the row may be removed by the host's own gesture; unset means it may.
    /// </summary>
    /// <remarks>
    /// False here or on the item, the server refuses the row's <c>remove</c> — a guard against a stale or forged page, not the
    /// permission itself, which belongs in the command.
    /// </remarks>
    [UIComponentProperty(DefaultValue = null, DefaultBindingScope = UIBindingScope.Relative)]
    bool? CanRemove { get; }

    /// <summary>
    /// Gets whether the row may be renamed in place, where its host renames at all; unset means it may.
    /// </summary>
    /// <remarks>
    /// False here or on the item, the server refuses the row's <c>rename</c> and the title it writes back — a guard against a stale or
    /// forged page, not the permission itself, which belongs in the command or the setter.
    /// </remarks>
    [UIComponentProperty(DefaultValue = null, DefaultBindingScope = UIBindingScope.Relative)]
    bool? CanRename { get; }

    /// <summary>
    /// Gets whether a right-click on the row opens the menu its template carries; unset means it does.
    /// </summary>
    [UIComponentProperty(DefaultValue = null, DefaultBindingScope = UIBindingScope.Relative)]
    bool? CanShowContextMenu { get; }
}
