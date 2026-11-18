using System;
using System.Collections.Generic;
using NE.Standard.UI.Authoring.Components;

namespace NE.Standard.UI.Components.Foundation;

internal sealed class ComponentRegionBag(IVisualComponent owner)
{
    private readonly Dictionary<string, IVisualComponent> _regions = [with(StringComparer.Ordinal)];
    private Dictionary<string, IVisualComponent>? _defaultRegions;
    private HashSet<string>? _authoredRegions;

    public IReadOnlyDictionary<string, IVisualComponent> Regions => _regions;

    public IDictionary<string, IVisualComponent> Entries => _regions;

    public bool HasRegions => _regions.Count > 0;

    public IVisualComponent? GetOrDefault(string regionName)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(regionName);
        return _regions.GetValueOrDefault(regionName);
    }

    public void Set(string regionName, IVisualComponent regionContent)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(regionName);
        ArgumentNullException.ThrowIfNull(regionContent);

        if (ReferenceEquals(regionContent, owner))
            throw new InvalidOperationException("A component cannot use itself as region content.");

        _regions[regionName] = regionContent;
        _ = (_authoredRegions ??= [with(StringComparer.Ordinal)]).Add(regionName);
    }

    public void SetDefault(string regionName, IVisualComponent regionContent)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(regionName);
        ArgumentNullException.ThrowIfNull(regionContent);

        if (ReferenceEquals(regionContent, owner))
            throw new InvalidOperationException("A component cannot use itself as region content.");

        _regions[regionName] = regionContent;
        (_defaultRegions ??= [with(StringComparer.Ordinal)])[regionName] = regionContent;
    }

    public void MarkAuthored(string regionName)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(regionName);
        _ = (_authoredRegions ??= [with(StringComparer.Ordinal)]).Add(regionName);
    }

    public Action? SnapshotWith(Action? restoreBase)
    {
        if (_authoredRegions is not { Count: > 0 })
            return restoreBase;

        List<(string Name, IVisualComponent Content, Action? Restore)> ownRegions = [with(_authoredRegions.Count)];

        foreach (var name in _authoredRegions)
        {
            if (!_regions.TryGetValue(name, out IVisualComponent? content))
                continue;

            ownRegions.Add((name, content, (content as ITemplateEventTarget)?.SnapshotComponentState()));

            if (_defaultRegions is not null && _defaultRegions.TryGetValue(name, out IVisualComponent? defaultContent))
                _regions[name] = defaultContent;
            else
                _ = _regions.Remove(name);
        }

        _authoredRegions.Clear();

        return () =>
        {
            restoreBase?.Invoke();

            for (var i = 0; i < ownRegions.Count; i++)
            {
                (var name, IVisualComponent content, Action? restore) = ownRegions[i];
                _regions[name] = content;
                _ = (_authoredRegions ??= [with(StringComparer.Ordinal)]).Add(name);
                restore?.Invoke();
            }
        };
    }
}
