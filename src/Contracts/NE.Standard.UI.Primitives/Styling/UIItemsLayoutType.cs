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
    /// Lays out items along an axis, wrapping onto new lines when space runs out.
    /// </summary>
    Wrap = 1,
}
