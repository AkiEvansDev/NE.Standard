using NE.Standard.UI.Abstractions.Identity;

namespace NE.Standard.UI.Compiled.Models;

/// <summary>
/// Defines the compiled action argument source kind.
/// </summary>
public enum CompiledUIActionArgumentKind
{
    Literal = 0,
    CurrentItemKey = 1,
    Binding = 2
}

/// <summary>
/// Represents a compiled argument passed to a UI command.
/// </summary>
public sealed class CompiledUIActionArgument
{
    /// <summary>
    /// Gets the command parameter name.
    /// </summary>
    public required string Name { get; init; }

    /// <summary>
    /// Gets how the argument value is resolved.
    /// </summary>
    public required CompiledUIActionArgumentKind Kind { get; init; }

    /// <summary>
    /// Gets the literal value for literal arguments.
    /// </summary>
    public object? Value { get; init; }

    /// <summary>
    /// Gets the binding source id for binding arguments.
    /// </summary>
    public UIBindingSourceId? SourceId { get; init; }

    /// <summary>
    /// Gets the binding template id for binding arguments.
    /// </summary>
    public UIBindingTemplateId? TemplateId { get; init; }

    /// <summary>
    /// Gets fixed and dynamic parameters used to materialize the binding template.
    /// </summary>
    public CompiledUIBindingParameter[] Parameters { get; init; } = [];

    /// <summary>
    /// Gets component ids that provide dynamic binding parameters, in parameter order.
    /// </summary>
    public UIComponentId[] DynamicParameterComponentIds { get; init; } = [];
}
