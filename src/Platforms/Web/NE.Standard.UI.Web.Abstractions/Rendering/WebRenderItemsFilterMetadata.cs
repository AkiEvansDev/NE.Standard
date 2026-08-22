using System;
using NE.Standard.UI.Primitives.Interaction;

namespace NE.Standard.UI.Web.Abstractions.Rendering;

public sealed class WebRenderItemsFilterMetadata
{
    public required string ItemProperty { get; init; }

    public required UIComparisonOperator Operator { get; init; }

    public object? Value { get; init; }

    public WebRenderPropertyMetadata? Source { get; set; }

    public required UIComparisonOperator ActiveOperator { get; init; }

    public object? ActiveValue { get; init; }

    public void Validate()
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(ItemProperty);

        Source?.Validate();
    }
}
