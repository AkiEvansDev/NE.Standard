using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Primitives.Binding;

namespace NE.Standard.UI.Web.Abstractions.Rendering;

public sealed class WebRenderBindingMetadata
{
    public required UIBindingId BindingId { get; init; }

    public required CompiledUIBindingKind Kind { get; init; }

    public required UIComponentId ComponentId { get; init; }

    public required string PropertyId { get; init; }

    public required UIBindingMode Mode { get; init; }

    public IReadOnlyList<UIComponentId> DynamicParameterComponentIds { get; init; } = [];

    /// <summary>
    /// Gets the recursive path template used to read a value off the current item, when the binding's source is a component-items collection.
    /// </summary>
    public string? ItemTemplate { get; init; }

    /// <summary>
    /// Gets the parameters used to materialize <see cref="ItemTemplate"/>, when the binding's source is a component-items collection.
    /// </summary>
    public IReadOnlyList<WebRenderBindingParameterMetadata>? ItemTemplateParameters { get; init; }

    public void Validate()
    {
        if (BindingId.IsEmpty)
            throw new InvalidOperationException("Binding id is required.");

        if (ComponentId.IsEmpty)
            throw new InvalidOperationException("Binding component id is required.");

        ArgumentException.ThrowIfNullOrWhiteSpace(PropertyId);
        ArgumentNullException.ThrowIfNull(DynamicParameterComponentIds);

        if (ItemTemplateParameters is not null)
        {
            for (var i = 0; i < ItemTemplateParameters.Count; i++)
                ItemTemplateParameters[i].Validate();
        }
    }
}
