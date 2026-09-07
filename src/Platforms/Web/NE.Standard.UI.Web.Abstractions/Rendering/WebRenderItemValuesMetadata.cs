using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Identity;

namespace NE.Standard.UI.Web.Abstractions.Rendering;

/// <summary>
/// The item values behind a server-rendered items host, so client-side filtering, sorting and grouping can read them.
/// </summary>
public sealed class WebRenderItemValuesMetadata
{
    public required UIComponentId ComponentId { get; init; }

    public required IReadOnlyList<WebRenderItemValue> Items { get; init; }

    public void Validate()
    {
        if (ComponentId.IsEmpty)
            throw new InvalidOperationException("Item values component id must not be empty.");

        ArgumentNullException.ThrowIfNull(Items);

        for (var i = 0; i < Items.Count; i++)
            Items[i].Validate();
    }
}
