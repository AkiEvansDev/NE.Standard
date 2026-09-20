namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// Defines layout modes for items-based components.
/// </summary>
public enum UIItemsLayoutType
{
    /// <summary>
    /// Lays out items sequentially along a single axis.
    /// </summary>
    Stack = 0,

    /// <summary>
    /// Flows items left to right, wrapping when space runs out. An item takes its content's width; a template root with a
    /// placement takes that column span of the 24-column grid instead.
    /// </summary>
    Wrap = 1,
}
