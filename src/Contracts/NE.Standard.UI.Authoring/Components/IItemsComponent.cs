using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Items;

namespace NE.Standard.UI.Authoring.Components;

/// <summary>
/// Represents a templated component that renders a collection of items.
/// </summary>
public interface IItemsComponent : ITemplatedComponent, IBindableItemsComponent
{
    /// <summary>
    /// Gets the registered property key for <see cref="IBindableItemsComponent.Items"/>.
    /// </summary>
    static UIProperty ItemsProperty { get; } = new(nameof(Items));

    /// <summary>
    /// Gets the registered property key for <see cref="ItemsView"/>.
    /// </summary>
    static UIProperty ItemsViewProperty { get; } = new(nameof(ItemsView));

    /// <summary>
    /// Gets filtering and sorting rules applied to the items collection.
    /// </summary>
    UIItemsView? ItemsView { get; }

    /// <summary>
    /// Gets whether the component has one or more items.
    /// </summary>
    bool HasItems { get; }
}
