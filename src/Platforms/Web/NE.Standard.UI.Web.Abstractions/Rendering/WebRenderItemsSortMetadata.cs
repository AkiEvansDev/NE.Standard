using System;
using NE.Standard.UI.Primitives.Interaction;
using NE.Standard.UI.Primitives.Items;

namespace NE.Standard.UI.Web.Abstractions.Rendering;

public sealed class WebRenderItemsSortMetadata
{
    public required string ItemProperty { get; init; }

    public required UIItemsSortDirection Direction { get; init; }

    public required int Priority { get; init; }

    public WebRenderPropertyMetadata? Source { get; set; }

    public required UIComparisonOperator ActiveOperator { get; init; }

    public object? ActiveValue { get; init; }

    public void Validate()
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(ItemProperty);

        Source?.Validate();
    }
}
