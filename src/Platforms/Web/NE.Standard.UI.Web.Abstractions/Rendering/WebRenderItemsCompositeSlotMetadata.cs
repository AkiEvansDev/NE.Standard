using System;

namespace NE.Standard.UI.Web.Abstractions.Rendering;

/// <summary>
/// One named template-variant slot of a composite item — see <see cref="WebRenderItemsCompositeMetadata"/>.
/// </summary>
public sealed class WebRenderItemsCompositeSlotMetadata
{
    public required string VariantKey { get; init; }

    public required string WrapperClassName { get; init; }

    public string WrapperElementName { get; init; } = "div";

    /// <summary>The ARIA role the slot wrapper carries (a table's <c>cell</c>); null for none.</summary>
    public string? WrapperRole { get; init; }

    /// <summary>
    /// Gets the item property whose value names a typed variant of this slot (<c>{VariantKey}:{value}</c>); the slot's own
    /// variant when the item names none or names one the list does not have.
    /// </summary>
    public string? VariantKeyPropertyName { get; init; }

    public void Validate()
    {
        if (string.IsNullOrWhiteSpace(VariantKey))
            throw new InvalidOperationException("Composite item slot variant key must not be empty.");

        if (string.IsNullOrWhiteSpace(WrapperClassName))
            throw new InvalidOperationException($"Composite item slot '{VariantKey}' wrapper class name must not be empty.");

        if (string.IsNullOrWhiteSpace(WrapperElementName))
            throw new InvalidOperationException($"Composite item slot '{VariantKey}' wrapper element name must not be empty.");
    }
}
