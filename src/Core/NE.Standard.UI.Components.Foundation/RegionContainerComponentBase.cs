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
    private readonly Dictionary<string, IVisualComponent> _regions = new(StringComparer.Ordinal);

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
    }
}
