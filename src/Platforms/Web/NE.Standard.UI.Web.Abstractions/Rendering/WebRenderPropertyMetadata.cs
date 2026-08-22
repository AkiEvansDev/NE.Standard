using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Identity;

namespace NE.Standard.UI.Web.Abstractions.Rendering;

public sealed class WebRenderPropertyMetadata
{
    public required UIComponentId ComponentId { get; init; }

    public required string PropertyId { get; init; }

    public IReadOnlyList<UIComponentId> DynamicParameterComponentIds { get; init; } = [];

    public void Validate()
    {
        if (ComponentId.IsEmpty)
            throw new InvalidOperationException("Property component id is required.");

        ArgumentException.ThrowIfNullOrWhiteSpace(PropertyId);
        ArgumentNullException.ThrowIfNull(DynamicParameterComponentIds);
    }
}
