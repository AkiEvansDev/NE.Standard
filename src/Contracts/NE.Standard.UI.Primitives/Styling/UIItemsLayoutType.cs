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
    /// Flows items left to right, wrapping onto new lines when space runs out. An item takes its content's width; a template root
    /// with a placement takes that span of the 24-column grid instead (a span of 6 is four items to a line).
    /// </summary>
    Wrap = 1,
}
