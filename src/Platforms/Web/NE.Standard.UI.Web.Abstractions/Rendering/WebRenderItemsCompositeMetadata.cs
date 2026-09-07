using System;
using System.Collections.Generic;

namespace NE.Standard.UI.Web.Abstractions.Rendering;

/// <summary>
/// Describes an item composed of several named template-variant slots at once, rather than a single per-item template chosen by key.
/// </summary>
public sealed class WebRenderItemsCompositeMetadata
{
    /// <summary>
    /// The class applied to the created item element.
    /// </summary>
    public required string ItemClassName { get; init; }

    /// <summary>
    /// The template-variant key stamped as the item element's compiled identity instead of a node of its own; null with no host variant.
    /// </summary>
    public string? HostSlotVariantKey { get; init; }

    public string ItemElementName { get; init; } = "div";

    /// <summary>The ARIA role the item element carries (a table's <c>row</c>); null for none.</summary>
    public string? ItemRole { get; init; }

    public required IReadOnlyList<WebRenderItemsCompositeSlotMetadata> Slots { get; init; }

    public void Validate()
    {
        if (string.IsNullOrWhiteSpace(ItemClassName))
            throw new InvalidOperationException("Composite item class name must not be empty.");

        if (string.IsNullOrWhiteSpace(ItemElementName))
            throw new InvalidOperationException("Composite item element name must not be empty.");

        if (Slots.Count == 0)
            throw new InvalidOperationException("Composite item must declare at least one slot.");

        for (var i = 0; i < Slots.Count; i++)
            Slots[i].Validate();
    }
}
