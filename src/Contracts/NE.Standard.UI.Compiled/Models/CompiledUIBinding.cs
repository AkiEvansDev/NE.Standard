using System;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Primitives.Binding;

namespace NE.Standard.UI.Compiled.Models;

/// <summary>
/// Defines the kind of compiled binding target.
/// </summary>
public enum CompiledUIBindingKind
{
    ComponentProperty = 0,
    ComponentCollection = 1
}

/// <summary>
/// Represents a compiled binding from a source template to a component target.
/// </summary>
public sealed class CompiledUIBinding
{
    /// <summary>
    /// Gets the compiled binding id.
    /// </summary>
    public required UIBindingId Id { get; init; }

    /// <summary>
    /// Gets the binding target kind.
    /// </summary>
    public required CompiledUIBindingKind Kind { get; init; }

    /// <summary>
    /// Gets the target component property address.
    /// </summary>
    public required UIPropertyAddress Address { get; init; }

    /// <summary>
    /// Gets the source id used by the binding.
    /// </summary>
    public required UIBindingSourceId SourceId { get; init; }

    /// <summary>
    /// Gets the source path template id used by the binding.
    /// </summary>
    public required UIBindingTemplateId TemplateId { get; init; }

    /// <summary>
    /// Gets the binding data flow mode.
    /// </summary>
    public required UIBindingMode Mode { get; init; }

    /// <summary>
    /// Gets fixed and dynamic parameters used to materialize the source path template.
    /// </summary>
    public CompiledUIBindingParameter[] Parameters { get; init; } = [];

    /// <summary>
    /// Gets component ids that provide dynamic binding parameters, in parameter order.
    /// </summary>
    public UIComponentId[] DynamicParameterComponentIds { get; init; } = [];

    /// <summary>
    /// Gets the CLR type the target property declares, for a <see cref="CompiledUIBindingKind.ComponentProperty"/>
    /// binding; <see langword="null"/> for context and collection bindings, which have no scalar target.
    /// </summary>
    /// <remarks>
    /// Not serialized: the compiled view is rebuilt per process, and the client gets <c>WebRenderBindingMetadata</c> instead.
    /// </remarks>
    public Type? TargetValueType { get; init; }

    /// <summary>
    /// Gets the value used when the binding's own value is <see langword="null"/>: the component's authored value,
    /// or its registered default.
    /// </summary>
    public object? TargetFallbackValue { get; init; }
}
