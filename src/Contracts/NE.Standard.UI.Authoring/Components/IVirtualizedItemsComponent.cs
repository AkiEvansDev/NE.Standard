using NE.Standard.UI.Abstractions.Binding.Properties;

namespace NE.Standard.UI.Authoring.Components;

/// <summary>
/// Represents an items component that can lay out only the rows in view, leaving the rest of a collection it
/// already holds out of the layout.
/// </summary>
public interface IVirtualizedItemsComponent : IItemsComponent
{
    /// <summary>
    /// Gets the registered property key for <see cref="Virtualize"/>.
    /// </summary>
    static UIProperty VirtualizeProperty { get; } = new(nameof(Virtualize));

    /// <summary>
    /// Gets whether only the rows in view are laid out.
    /// </summary>
    bool? Virtualize { get; }
}
