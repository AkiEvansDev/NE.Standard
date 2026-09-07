using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Binding;

namespace NE.Standard.UI.Authoring.Components;

/// <summary>
/// The root of an item's row saying what its host may do with the item: chosen, dragged, removed, renamed, its menu opened. Each
/// is unset by default, which lets it; the built-in row templates bind them to the item's <c>IItemAbilitiesModel</c>, and a
/// bound flag reaches the row live, the way any bound property does.
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
    [UIComponentProperty(DefaultValue = null, DefaultBindingScope = UIBindingScope.Relative)]
    bool? CanSelect { get; }

    /// <summary>
    /// Gets whether the row may be dragged, where its host drags at all; unset means it may.
    /// </summary>
    [UIComponentProperty(DefaultValue = null, DefaultBindingScope = UIBindingScope.Relative)]
    bool? CanDrag { get; }

    /// <summary>
    /// Gets whether the row may be removed by the host's own gesture; unset means it may.
    /// </summary>
    [UIComponentProperty(DefaultValue = null, DefaultBindingScope = UIBindingScope.Relative)]
    bool? CanRemove { get; }

    /// <summary>
    /// Gets whether the row may be renamed in place, where its host renames at all; unset means it may.
    /// </summary>
    [UIComponentProperty(DefaultValue = null, DefaultBindingScope = UIBindingScope.Relative)]
    bool? CanRename { get; }

    /// <summary>
    /// Gets whether a right-click on the row opens the menu its template carries; unset means it does.
    /// </summary>
    [UIComponentProperty(DefaultValue = null, DefaultBindingScope = UIBindingScope.Relative)]
    bool? CanShowContextMenu { get; }
}
