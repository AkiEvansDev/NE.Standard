using System;

namespace NE.Standard.UI.Web.Abstractions.Rendering;

/// <summary>
/// One named template-variant slot of a composite item (see <see cref="WebRenderItemsCompositeMetadata"/>) —
/// the client clones the variant named <see cref="VariantKey"/> and appends it to the item element inside
/// a wrapper of this shape, mirroring <c>ItemsCollectionRendererBase.RenderNamedTemplateSlot</c>.
/// </summary>
public sealed class WebRenderItemsCompositeSlotMetadata
{
    public required string VariantKey { get; init; }

    public required string WrapperClassName { get; init; }

    public string WrapperElementName { get; init; } = "div";

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
