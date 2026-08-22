using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Compiled.Models;

namespace NE.Standard.UI.Web.Abstractions.Rendering;

public sealed class WebRenderEventMetadata
{
    public required UIEventId EventId { get; init; }

    public required CompiledUIEventAddress Address { get; init; }

    public IReadOnlyList<UIComponentId> DynamicParameterComponentIds { get; init; } = [];

    public void Validate()
    {
        if (EventId.IsEmpty)
            throw new InvalidOperationException("Event id is required.");

        if (Address.ComponentId.IsEmpty)
            throw new InvalidOperationException("Event component id is required.");

        ArgumentException.ThrowIfNullOrWhiteSpace(Address.EventName);
        ArgumentNullException.ThrowIfNull(DynamicParameterComponentIds);
    }
}
