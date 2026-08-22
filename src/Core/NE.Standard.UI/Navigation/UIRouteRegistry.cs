using System;
using System.Collections.Frozen;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using NE.Standard.UI.Shell.Navigation;

namespace NE.Standard.UI.Navigation;

internal sealed class UIRouteRegistry : IUIRouteRegistry
{
    private readonly FrozenDictionary<string, UIRouteEntry> _entriesByPath;
    private readonly UIRouteDefinition[] _routes;

    internal UIRouteRegistry(UIRouteEntry[] entries)
    {
        ArgumentNullException.ThrowIfNull(entries);

        Dictionary<string, UIRouteEntry> entriesByPath = new(entries.Length, StringComparer.OrdinalIgnoreCase);
        UIRouteDefinition[] routes = new UIRouteDefinition[entries.Length];

        for (var i = 0; i < entries.Length; i++)
        {
            UIRouteEntry entry = entries[i];

            ArgumentNullException.ThrowIfNull(entry);
            ArgumentNullException.ThrowIfNull(entry.Definition);
            ArgumentNullException.ThrowIfNull(entry.GetView);

            entry.Definition.Validate();

            var normalizedRoute = UIRoutePath.Normalize(entry.Definition.Route);

            if (!entriesByPath.TryAdd(normalizedRoute, entry))
                throw new InvalidOperationException($"Route '{entry.Definition.Route}' is already registered.");

            routes[i] = entry.Definition;
        }

        _entriesByPath = entriesByPath.ToFrozenDictionary(StringComparer.OrdinalIgnoreCase);
        _routes = routes;
    }

    /// <inheritdoc />
    public IReadOnlyList<UIRouteDefinition> Routes => _routes;

    /// <inheritdoc />
    public bool TryGet(Uri uri, [NotNullWhen(true)] out UIRouteDefinition? route)
    {
        ArgumentNullException.ThrowIfNull(uri);

        return TryGet(uri.IsAbsoluteUri ? uri.AbsolutePath : uri.OriginalString, out route);
    }

    internal bool TryGetEntry(string uri, [NotNullWhen(true)] out UIRouteEntry? entry)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(uri);

        return _entriesByPath.TryGetValue(UIRoutePath.Normalize(uri), out entry);
    }

    internal UIRouteEntry GetRequiredEntry(string uri)
    {
        return TryGetEntry(uri, out UIRouteEntry? entry)
            ? entry
            : throw new UIRouteNotFoundException(uri);
    }

    /// <inheritdoc />
    public bool TryGet(string uri, [NotNullWhen(true)] out UIRouteDefinition? route)
    {
        if (!TryGetEntry(uri, out UIRouteEntry? entry))
        {
            route = null;
            return false;
        }

        route = entry.Definition;
        return true;
    }
}
