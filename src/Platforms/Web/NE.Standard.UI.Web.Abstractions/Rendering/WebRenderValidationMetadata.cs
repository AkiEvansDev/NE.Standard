using System;
using NE.Standard.UI.Primitives.Interaction;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Web.Abstractions.Rendering;

public sealed class WebRenderValidationMetadata
{
    public required WebRenderPropertyMetadata Target { get; init; }

    public required UIValidationTrigger Trigger { get; init; }

    public required UIComparisonOperator Operator { get; init; }

    public object? Value { get; init; }

    public required UIColorStyle Severity { get; init; }

    public required string Message { get; init; }

    public void Validate()
    {
        Target.Validate();
        ArgumentException.ThrowIfNullOrWhiteSpace(Message);
    }
}
