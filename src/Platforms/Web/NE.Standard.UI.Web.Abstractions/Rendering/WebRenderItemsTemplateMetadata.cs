using System;
using NE.Standard.UI.Abstractions.Identity;

namespace NE.Standard.UI.Web.Abstractions.Rendering;

public sealed class WebRenderItemsTemplateMetadata
{
    public required UIComponentId ComponentId { get; init; }

    public string? TemplateKeyPropertyName { get; init; }

    public string? FallbackTemplateKeyPropertyName { get; init; }

    /// <summary>
    /// The element/class a cloned item gets wrapped in client-side, when a renderer's static item shape
    /// wraps its resolved template content in something extra (e.g. <c>RadioGroupComponentRenderer</c>'s
    /// <c>&lt;label class="ui-radio-group__item"&gt;</c>) — <see langword="null"/> for the common case
    /// (an item's rendered template root IS the item, no wrapper). Deliberately just the wrapper's own
    /// shape, not arbitrary decoration content: any per-item content beyond the shell (RadioGroup's hidden
    /// radio input) is injected by that renderer's own client-side sync engine after cloning, not carried
    /// here — see <c>ItemsTemplateRenderer.renderItem</c>/<c>RadioGroupSyncEngine</c>.
    /// </summary>
    public string? ItemWrapperElementName { get; init; }

    public string? ItemWrapperClassName { get; init; }

    /// <summary>
    /// Set when one item is composed of several named template variants at once instead of one
    /// key-selected template — see <see cref="WebRenderItemsCompositeMetadata"/>. Mutually exclusive with
    /// <see cref="ItemWrapperElementName"/> in practice: a composite item builds its own element, so it
    /// has nothing left for the single-template wrapper to wrap.
    /// </summary>
    public WebRenderItemsCompositeMetadata? Composite { get; init; }

    public void Validate()
    {
        if (ComponentId.IsEmpty)
            throw new InvalidOperationException("Items template component id must not be empty.");

        Composite?.Validate();
    }
}
