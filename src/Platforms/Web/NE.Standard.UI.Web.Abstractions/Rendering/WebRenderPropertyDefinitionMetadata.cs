using System;
using System.Collections.Generic;

namespace NE.Standard.UI.Web.Abstractions.Rendering;

public sealed class WebRenderPropertyDefinitionMetadata
{
    public required string PropertyId { get; init; }

    public required string ComponentTypeKey { get; init; }

    public required string PropertyName { get; init; }

    public IReadOnlyList<WebDomOperation> Operations { get; init; } = [];

    public void Validate()
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(PropertyId);
        ArgumentException.ThrowIfNullOrWhiteSpace(ComponentTypeKey);
        ArgumentException.ThrowIfNullOrWhiteSpace(PropertyName);
        ArgumentNullException.ThrowIfNull(Operations);

        for (var i = 0; i < Operations.Count; i++)
            Operations[i].Validate();
    }
}
