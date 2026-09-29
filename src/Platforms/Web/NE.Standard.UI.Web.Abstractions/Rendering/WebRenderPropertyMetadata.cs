using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Identity;

namespace NE.Standard.UI.Web.Abstractions.Rendering;

/// <summary>A rendered property as the client addresses it: its component and its definition's id.</summary>
public sealed class WebRenderPropertyMetadata
{
    /// <summary>Gets the component whose instances carry the property.</summary>
    public required UIComponentId ComponentId { get; init; }

    /// <summary>Gets the property definition's id, as the page's metadata names it.</summary>
    public required string PropertyId { get; init; }

    /// <summary>Gets the components whose row keys complete the property's address; empty outside any row.</summary>
    public IReadOnlyList<UIComponentId> DynamicParameterComponentIds { get; init; } = [];

    /// <summary>
    /// Gets whether the property is translatable but this instance shows it as written (<c>AsContent</c>) — a value a package's
    /// client sets there is content too, never a key the page looks up.
    /// </summary>
    public bool Content { get; init; }

    /// <summary>Refuses a property with no component or id.</summary>
    public void Validate()
    {
        if (ComponentId.IsEmpty)
            throw new InvalidOperationException("Property component id is required.");

        ArgumentException.ThrowIfNullOrWhiteSpace(PropertyId);
        ArgumentNullException.ThrowIfNull(DynamicParameterComponentIds);
    }
}
