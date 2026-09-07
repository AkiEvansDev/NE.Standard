using System.Collections.Generic;

namespace NE.Standard.UI.Authoring.Components;

/// <summary>
/// Represents a visual component that arranges child components in a grid-like layout.
/// </summary>
public interface IContainerComponent : IVisualComponent
{
    /// <summary>
    /// Gets the components added to this container, each positioned within the grid by its own Placement.
    /// </summary>
    IReadOnlyList<IVisualComponent> Children { get; }

    /// <summary>
    /// Gets whether the component contains at least one child.
    /// </summary>
    bool HasChildren { get; }
}
