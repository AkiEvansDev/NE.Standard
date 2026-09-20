using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Authoring.Components;

/// <summary>
/// A track boundary the viewer drags. Which way it runs says whether its placement names a column or a row of its container.
/// </summary>
public interface IGridSplitterComponent : IVisualComponent
{
    /// <summary>
    /// Gets which way the bar runs: <c>Vertical</c> moves the columns either side, <c>Horizontal</c> the rows; unset is vertical.
    /// </summary>
    UIOrientation? Orientation { get; }
}
