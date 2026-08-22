using NE.Standard.UI.Abstractions.Identity;

namespace NE.Standard.UI.Compiled.Models;

/// <summary>
/// Represents a compiled component node in the component graph.
/// </summary>
public sealed class UIComponentNode
{
    /// <summary>
    /// Gets the authoring-time component id.
    /// </summary>
    public required string AuthoringId { get; init; }

    /// <summary>
    /// Gets whether <see cref="AuthoringId"/> was written by the author rather than generated.
    /// </summary>
    public bool HasAuthoredId { get; init; }

    /// <summary>
    /// Gets the component type key.
    /// </summary>
    public required string TypeKey { get; init; }

    /// <summary>
    /// Gets the compiled component id.
    /// </summary>
    public required UIComponentId ComponentId { get; init; }

    /// <summary>
    /// Gets the compiled context id for the component.
    /// </summary>
    public required UIContextId ContextId { get; init; }

    /// <summary>
    /// Gets the parent component id, when the component has a parent.
    /// </summary>
    public UIComponentId? ParentId { get; init; }

    /// <summary>
    /// Gets the number of context parameters defined by this component scope.
    /// </summary>
    public int ContextParameterCount { get; init; }

    /// <summary>
    /// Gets whether this component contributes a dynamic context parameter.
    /// </summary>
    public bool DefinesContextParameter { get; init; }

    /// <summary>
    /// Gets slots owned by the component.
    /// </summary>
    public UIComponentSlot[] Slots { get; init; } = [];

    /// <summary>
    /// Gets direct child component ids.
    /// </summary>
    public UIComponentId[] Children { get; init; } = [];
}
