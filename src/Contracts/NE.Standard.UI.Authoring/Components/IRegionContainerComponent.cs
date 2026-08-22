using System.Collections.Generic;

namespace NE.Standard.UI.Authoring.Components;

/// <summary>
/// Represents a visual component that exposes named content regions.
/// </summary>
public interface IRegionContainerComponent : IVisualComponent
{
    /// <summary>
    /// Gets the components assigned to named regions.
    /// </summary>
    IReadOnlyDictionary<string, IVisualComponent> Regions { get; }

    /// <summary>
    /// Gets whether one or more regions are assigned.
    /// </summary>
    bool HasRegions { get; }
}
