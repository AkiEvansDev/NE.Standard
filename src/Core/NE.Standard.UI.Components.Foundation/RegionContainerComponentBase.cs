using System;
using System.Collections.Generic;
using NE.Standard.UI.Authoring.Components;

namespace NE.Standard.UI.Components.Foundation;

/// <summary>
/// Base class for visual components that expose named regions.
/// </summary>
public abstract class RegionContainerComponentBase<TComponent> : VisualComponentBase<TComponent>, IRegionContainerComponent
    where TComponent : RegionContainerComponentBase<TComponent>, IUIComponentDefinition
{
    private readonly ComponentRegionBag _regions;

    protected RegionContainerComponentBase(string? id = null) : base(id)
    {
        _regions = new ComponentRegionBag(this);
    }

    /// <inheritdoc/>
    public IReadOnlyDictionary<string, IVisualComponent> Regions => _regions.Regions;

    /// <inheritdoc/>
    public bool HasRegions => _regions.HasRegions;

    /// <summary>
    /// Mutable view of the component's named regions for subclasses whose own helpers maintain numbered or conditional region entries.
    /// </summary>
    protected IDictionary<string, IVisualComponent> RegionEntries => _regions.Entries;

    /// <summary>
    /// Gets region content by name, or <see langword="null"/> when the region is not set.
    /// </summary>
    protected IVisualComponent? GetRegionOrDefault(string regionName)
        => _regions.GetOrDefault(regionName);

    /// <summary>
    /// Sets content for a named region.
    /// </summary>
    protected void SetRegion(string regionName, IVisualComponent regionContent)
        => _regions.Set(regionName, regionContent);

    /// <summary>Installs built-in default content for a named region without marking it as authored.</summary>
    protected void SetDefaultRegion(string regionName, IVisualComponent regionContent)
        => _regions.SetDefault(regionName, regionContent);

    /// <summary>Marks the named region as configured by the author.</summary>
    protected void MarkRegionAuthored(string regionName)
        => _regions.MarkAuthored(regionName);

    /// <inheritdoc/>
    protected override Action? SnapshotAuthoredState()
        => _regions.SnapshotWith(base.SnapshotAuthoredState());
}
