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

    /// <summary>
    /// The keys of the rows the host stands in, outermost first — a list inside every row of another is one host per row, and each
    /// has values of its own.
    /// </summary>
    public IReadOnlyList<object?> DynamicParameters { get; init; } = [];

    public required IReadOnlyList<WebRenderItemValue> Items { get; init; }

    public void Validate()
    {
        if (ComponentId.IsEmpty)
            throw new InvalidOperationException("Item values component id must not be empty.");

        ArgumentNullException.ThrowIfNull(Items);
        ArgumentNullException.ThrowIfNull(DynamicParameters);

        for (var i = 0; i < Items.Count; i++)
            Items[i].Validate();
    }
}
