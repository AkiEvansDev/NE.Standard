using System;
using NE.Standard.UI.Primitives.Interaction;
using NE.Standard.UI.Primitives.Localization;

namespace NE.Standard.UI.Web.Abstractions.Rendering;

public sealed class WebRenderValidationMetadata
{
    public required WebRenderPropertyMetadata Target { get; init; }

    public required UIValidationTrigger Trigger { get; init; }

    public required UIComparisonOperator Operator { get; init; }

    public object? Value { get; init; }

    public required UIValidationSeverity Severity { get; init; }

    public required UIPhrase Message { get; init; }

    public void Validate()
    {
        Target.Validate();
        ArgumentNullException.ThrowIfNull(Message);
    }
}
