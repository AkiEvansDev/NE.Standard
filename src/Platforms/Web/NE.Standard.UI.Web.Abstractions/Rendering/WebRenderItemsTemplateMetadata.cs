using System;
using NE.Standard.UI.Abstractions.Identity;

namespace NE.Standard.UI.Web.Abstractions.Rendering;

public sealed class WebRenderItemsTemplateMetadata
{
    public required UIComponentId ComponentId { get; init; }

    public string? TemplateKeyPropertyName { get; init; }

    public string? FallbackTemplateKey { get; init; }

    /// <summary>
    /// The element/class a cloned item is wrapped in client-side; null when the item's template root is the item itself, with no wrapper.
    /// </summary>
    public string? ItemWrapperElementName { get; init; }

    public string? ItemWrapperClassName { get; init; }

    /// <summary>
    /// Set when the item is composed of several named template variants instead of one key-selected template; mutually exclusive
    /// with <see cref="ItemWrapperElementName"/> in practice.
    /// </summary>
    public WebRenderItemsCompositeMetadata? Composite { get; init; }

    /// <summary>
    /// The client-side decorator a row the client builds goes through after its template, named by kind: what the component's own
    /// renderer puts beside a row that its template cannot (a menu's sub-entries); null when a row is its template alone.
    /// </summary>
    public string? RowDecorator { get; init; }

    public void Validate()
    {
        if (ComponentId.IsEmpty)
            throw new InvalidOperationException("Items template component id must not be empty.");

        Composite?.Validate();
    }
}
