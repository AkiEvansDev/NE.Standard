using NE.Standard.UI.Abstractions.Identity;

namespace NE.Standard.UI.Compiled.Models;

/// <summary>
/// Defines the kind of data source used by compiled bindings.
/// </summary>
public enum CompiledUIBindingSourceKind
{
    Controller = 0,
    ComponentItems = 1
}

/// <summary>
/// Represents a compiled binding source.
/// </summary>
public sealed class CompiledUIBindingSource
{
    /// <summary>
    /// Gets the compiled binding source id.
    /// </summary>
    public required UIBindingSourceId Id { get; init; }

    /// <summary>
    /// Gets the binding source kind.
    /// </summary>
    public required CompiledUIBindingSourceKind Kind { get; init; }

    /// <summary>
    /// Gets the component id for component-scoped sources.
    /// </summary>
    public UIComponentId? ComponentId { get; init; }

    /// <summary>
    /// Gets the items property name for component-items sources.
    /// </summary>
    public string? ItemsProperty { get; init; }
}
