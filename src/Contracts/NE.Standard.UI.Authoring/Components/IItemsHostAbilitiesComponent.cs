using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Primitives.Annotations;

namespace NE.Standard.UI.Authoring.Components;

/// <summary>
/// The host's switches over what its own gestures do to an item — move it, rename it in place, remove it — a tree's and a tab strip's
/// alike; an item refuses each alone through its abilities (<see cref="IItemAbilitiesComponent"/>).
/// </summary>
public interface IItemsHostAbilitiesComponent : IDraggableItemsComponent
{
    /// <summary>
    /// Gets the registered property key for <see cref="Renamable"/>.
    /// </summary>
    static UIProperty RenamableProperty { get; } = new(nameof(Renamable));

    /// <summary>
    /// Gets the registered property key for <see cref="Removable"/>.
    /// </summary>
    static UIProperty RemovableProperty { get; } = new(nameof(Removable));

    /// <summary>
    /// Gets whether the host's own gesture renames an item's title in place — F2, and a tab's double click; an item that says
    /// <c>CanRename</c> false keeps its title. A rename the application asks for (an effect, a menu's entry) opens the field either way.
    /// </summary>
    [UIComponentProperty(DefaultValue = false)]
    bool? Renamable { get; }

    /// <summary>
    /// Gets whether the host's own gesture removes an item at all — a tree's Delete key, a tab's close; off, no tab shows a close and
    /// the strip reserves no room for one. An item refuses it alone with <c>CanRemove</c>.
    /// </summary>
    [UIComponentProperty(DefaultValue = true)]
    bool? Removable { get; }
}
