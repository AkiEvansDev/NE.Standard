using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Primitives.Annotations;

namespace NE.Standard.UI.Authoring.Components;

/// <summary>
/// The host's switches over what its own gestures do to an item — move it, rename it in place, remove it — a tree's and a tab strip's
/// alike; an item refuses each alone through its abilities (<see cref="IItemAbilitiesComponent"/>).
/// </summary>
public interface IItemsHostAbilitiesComponent : IDraggableItemsComponent, IRenamableItemsComponent
{
    /// <summary>
    /// Gets the registered property key for <see cref="IRenamableItemsComponent.Renamable"/>.
    /// </summary>
    static new UIProperty RenamableProperty => IRenamableItemsComponent.RenamableProperty;

    /// <summary>
    /// Gets the registered property key for <see cref="Removable"/>.
    /// </summary>
    static UIProperty RemovableProperty { get; } = new(nameof(Removable));

    /// <summary>
    /// Gets whether the host's own gesture removes an item at all — a tree's Delete key, a tab's close; off, no tab shows a close and
    /// the strip reserves no room for one. An item refuses it alone with <c>CanRemove</c>.
    /// </summary>
    [UIComponentProperty(DefaultValue = true)]
    bool? Removable { get; }
}
