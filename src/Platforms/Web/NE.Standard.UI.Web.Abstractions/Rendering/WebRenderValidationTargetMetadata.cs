using System;
using NE.Standard.UI.Abstractions.Identity;

namespace NE.Standard.UI.Web.Abstractions.Rendering;

/// <summary>
/// Where one field's validation words go when they do not go on the field: another component's property.
/// </summary>
/// <remarks>
/// Carried per field rather than per rule, since a field with no client rules can still have a controller's refusal to place.
/// </remarks>
public sealed class WebRenderValidationTargetMetadata
{
    /// <summary>The field whose message this is.</summary>
    public required UIComponentId ComponentId { get; init; }

    /// <summary>The component property the words are written to.</summary>
    public required WebRenderPropertyMetadata Message { get; init; }

    /// <summary>Refuses a target with no field or no message property.</summary>
    public void Validate()
    {
        if (ComponentId.IsEmpty)
            throw new InvalidOperationException("Validation target component id is required.");

        Message.Validate();
    }
}
