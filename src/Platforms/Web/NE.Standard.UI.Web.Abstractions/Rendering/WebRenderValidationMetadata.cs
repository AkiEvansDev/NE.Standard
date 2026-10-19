using System;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Primitives.Interaction;
using NE.Standard.UI.Primitives.Localization;

namespace NE.Standard.UI.Web.Abstractions.Rendering;

public sealed class WebRenderValidationMetadata
{
    public required WebRenderPropertyMetadata Target { get; init; }

    public required UIValidationTrigger Trigger { get; init; }

    public required UIComparisonOperator Operator { get; init; }

    public object? Value { get; init; }

    /// <summary>Gets the field whose value the rule compares with in place of <see cref="Value"/>; the page reads its value holder.</summary>
    public UIComponentId? ValueSource { get; init; }

    public required UIValidationSeverity Severity { get; init; }

    public required UIPhrase Message { get; init; }

    public void Validate()
    {
        Target.Validate();
        ArgumentNullException.ThrowIfNull(Message);
    }
}
