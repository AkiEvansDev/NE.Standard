using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Data;
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

    static UIProperty QueryProperty { get; } = new(nameof(Query));

    /// <summary>
    /// Gets filtering and sorting rules applied to the items collection.
    /// </summary>
    UIItemsView? ItemsView { get; }

    /// <summary>
    /// Gets the terms the viewer set after the view compiled — a header's sort, a filter row — applied beside the authored rules; bound
    /// both ways, so a windowed source is asked with them and a controller can set them.
    /// </summary>
    UIItemsQuery? Query { get; }

    /// <summary>
    /// Gets whether the bound <c>Items</c> collection currently holds at least one row.
    /// </summary>
    bool HasItems { get; }
}
