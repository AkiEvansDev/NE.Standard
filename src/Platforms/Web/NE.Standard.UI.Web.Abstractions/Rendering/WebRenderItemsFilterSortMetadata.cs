using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Identity;

namespace NE.Standard.UI.Web.Abstractions.Rendering;

public sealed class WebRenderItemsFilterSortMetadata
{
    public required UIComponentId ComponentId { get; init; }

    public IReadOnlyList<WebRenderItemsFilterMetadata> Filters { get; init; } = [];

    public IReadOnlyList<WebRenderItemsSortMetadata> Sorts { get; init; } = [];

    public void Validate()
    {
        if (ComponentId.IsEmpty)
            throw new InvalidOperationException("Items filter/sort component id must not be empty.");

        for (var i = 0; i < Filters.Count; i++)
            Filters[i].Validate();

        for (var i = 0; i < Sorts.Count; i++)
            Sorts[i].Validate();
    }
}
