using System;
using System.Collections.Frozen;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using NE.Standard.UI.Web.Abstractions.Rendering;

namespace NE.Standard.UI.Web.Rendering;

internal sealed class WebRendererRegistry : IWebRendererRegistry
{
    private readonly FrozenDictionary<string, IWebComponentRenderer> _renderers;

    public WebRendererRegistry(IEnumerable<IWebComponentRenderer> renderers)
    {
        ArgumentNullException.ThrowIfNull(renderers);

        Dictionary<string, IWebComponentRenderer> builder = new(StringComparer.Ordinal);

        foreach (IWebComponentRenderer renderer in renderers)
        {
            ArgumentNullException.ThrowIfNull(renderer);
            ArgumentException.ThrowIfNullOrWhiteSpace(renderer.ComponentTypeKey);

            if (!builder.TryAdd(renderer.ComponentTypeKey, renderer))
                throw new InvalidOperationException($"Web renderer for component type '{renderer.ComponentTypeKey}' is already registered.");
        }

        _renderers = builder.ToFrozenDictionary(StringComparer.Ordinal);
    }

    public bool TryGet(string componentTypeKey, [NotNullWhen(true)] out IWebComponentRenderer? renderer)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(componentTypeKey);

        return _renderers.TryGetValue(componentTypeKey, out renderer);
    }

    public IWebComponentRenderer GetRequired(string componentTypeKey)
        => TryGet(componentTypeKey, out IWebComponentRenderer? renderer)
            ? renderer
            : throw new InvalidOperationException($"Web renderer for component type '{componentTypeKey}' was not registered.");
}
