using System.Collections.Generic;

namespace NE.Standard.UI.Abstractions.Binding;

/// <summary>
/// Represents a UI component that can participate in binding compilation and runtime updates.
/// </summary>
public interface IBindableComponent : IBindableItem
{
    /// <summary>
    /// Gets the component type key used to resolve registered property metadata.
    /// </summary>
    string TypeKey { get; }

    /// <summary>
    /// Gets the binding that provides the component data context.
    /// </summary>
    UIBinding? Context { get; }
}

/// <summary>
/// Represents a bindable component that exposes an items source.
/// </summary>
public interface IBindableItemsComponent : IBindableComponent
{
    /// <summary>
    /// Gets the component items.
    /// </summary>
    IReadOnlyList<object?> Items { get; }
}
