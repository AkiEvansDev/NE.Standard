using System;
using System.Collections.Generic;

namespace NE.Standard.UI.Web.Abstractions.Rendering;

/// <summary>
/// Describes an item whose rendered shape is composed of several named template variants at once
/// (<c>KeyValueActionComponent</c>'s row: a structural host element carrying the "row" variant's compiled
/// identity, containing the "key"/"value"/"action" variants each in their own wrapper) rather than a
/// single per-item template chosen by key — the shape
/// <c>ItemsCollectionRendererBase.RenderNamedTemplateSlot</c>/<c>StampTemplateSlotAsHost</c> render
/// server-side, carried to the client so a bound collection can compose the same row.
/// </summary>
/// <remarks>
/// Distinct from <see cref="WebRenderItemsTemplateMetadata.ItemWrapperElementName"/>, which wraps the
/// single already-rendered template root in one extra shell: here the item element is created from
/// nothing and every visible part comes from a slot.
/// </remarks>
public sealed class WebRenderItemsCompositeMetadata
{
    /// <summary>
    /// The class applied to the created item element (<c>KeyValueActionComponentRenderer</c>'s
    /// <c>ui-key-value-action__row</c>).
    /// </summary>
    public required string ItemClassName { get; init; }

    /// <summary>
    /// The template-variant key whose compiled identity (<c>data-ui-id</c>/<c>data-ui-context</c>/
    /// <c>data-ui-pc</c>) is stamped onto the item element instead of being rendered as its own node —
    /// the client mirror of <c>StampTemplateSlotAsHost</c>. That variant carries no visible content of its
    /// own (see <c>DefaultRowTemplate</c>); it exists so per-item events/interactions have an addressable
    /// scope. <see langword="null"/> when the composite item has no such host variant.
    /// </summary>
    public string? HostSlotVariantKey { get; init; }

    public string ItemElementName { get; init; } = "div";

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
