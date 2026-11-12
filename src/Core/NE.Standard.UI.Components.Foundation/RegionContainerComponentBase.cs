using System;
using System.Collections.Generic;
using NE.Standard.UI.Authoring.Components;

namespace NE.Standard.UI.Components.Foundation;

/// <summary>
/// Base class for visual components that expose named regions.
/// </summary>
public abstract class RegionContainerComponentBase<TComponent>(string? id = null) : VisualComponentBase<TComponent>(id), IRegionContainerComponent
    where TComponent : RegionContainerComponentBase<TComponent>, IUIComponentDefinition
{
    private readonly Dictionary<string, IVisualComponent> _regions = [with(StringComparer.Ordinal)];
    private Dictionary<string, IVisualComponent>? _defaultRegions;
    private HashSet<string>? _authoredRegions;

    /// <inheritdoc/>
    public IReadOnlyDictionary<string, IVisualComponent> Regions => _regions;

    /// <inheritdoc/>
    public bool HasRegions => _regions.Count > 0;

    /// <summary>
    /// Gets region content by name, or <see langword="null"/> when the region is not set.
    /// </summary>
    protected IVisualComponent? GetRegionOrDefault(string regionName)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(regionName);
        return _regions.GetValueOrDefault(regionName);
    }

    /// <summary>
    /// Sets content for a named region.
    /// </summary>
    protected void SetRegion(string regionName, IVisualComponent regionContent)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(regionName);
        ArgumentNullException.ThrowIfNull(regionContent);

        if (ReferenceEquals(regionContent, this))
            throw new InvalidOperationException("A component cannot use itself as region content.");

        _regions[regionName] = regionContent;
        _ = (_authoredRegions ??= [with(StringComparer.Ordinal)]).Add(regionName);
    }

    /// <summary>Installs built-in default content for a named region without marking it as authored.</summary>
    protected void SetDefaultRegion(string regionName, IVisualComponent regionContent)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(regionName);
        ArgumentNullException.ThrowIfNull(regionContent);

        if (ReferenceEquals(regionContent, this))
            throw new InvalidOperationException("A component cannot use itself as region content.");

        _regions[regionName] = regionContent;
        (_defaultRegions ??= [with(StringComparer.Ordinal)])[regionName] = regionContent;
    }

    /// <summary>Marks the named region as configured by the author.</summary>
    protected void MarkRegionAuthored(string regionName)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(regionName);
        _ = (_authoredRegions ??= [with(StringComparer.Ordinal)]).Add(regionName);
    }

    /// <inheritdoc/>
    protected override Action? SnapshotAuthoredState()
    {
        Action? restoreBase = base.SnapshotAuthoredState();

        if (_authoredRegions is not { Count: > 0 })
            return restoreBase;

        List<(string Name, IVisualComponent Content, Action? Restore)> ownRegions = [with(_authoredRegions.Count)];

        foreach (var name in _authoredRegions)
        {
            if (!_regions.TryGetValue(name, out IVisualComponent? content))
                continue;

            ownRegions.Add((name, content, (content as ITemplateEventTarget)?.SnapshotComponentState()));

            if (_defaultRegions is not null && _defaultRegions.TryGetValue(name, out IVisualComponent? defaultContent) && !ReferenceEquals(content, defaultContent))
                _regions[name] = defaultContent;
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
