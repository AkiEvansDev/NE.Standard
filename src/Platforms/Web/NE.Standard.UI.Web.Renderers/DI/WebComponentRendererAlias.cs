using System;
using NE.Standard.UI.Web.Abstractions.Rendering;

namespace NE.Standard.UI.Web.Renderers.DI;

/// <summary>Registers an additional component type key against an existing renderer instance, unchanged.</summary>
internal sealed class WebComponentRendererAlias(string componentTypeKey, IWebComponentRenderer inner) : IWebComponentRenderer
{
    public string ComponentTypeKey { get; } = !string.IsNullOrWhiteSpace(componentTypeKey)
        ? componentTypeKey
        : throw new ArgumentException("Component type key must not be empty.", nameof(componentTypeKey));

    private readonly IWebComponentRenderer _inner = inner ?? throw new ArgumentNullException(nameof(inner));

    public void Render(WebRenderContext context)
        => _inner.Render(context);
}
