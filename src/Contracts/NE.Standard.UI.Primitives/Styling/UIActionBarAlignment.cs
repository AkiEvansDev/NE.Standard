namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// How a component's action bar lines up with it (<c>SetActionBar</c>): the bar floats above the component, under it where there is
/// no room above, aligned with its end, its start or its middle. Start and end follow the page's direction, so a right-to-left page
/// mirrors them.
/// </summary>
public enum UIActionBarAlignment
{
    /// <summary>
    /// Aligned with the end edge, where a messenger puts a message's actions.
    /// </summary>
    End = 0,

    /// <summary>
    /// Aligned with the start edge.
    /// </summary>
    Start = 1,

    /// <summary>
    /// Centred on the component, as over a node on a canvas.
    /// </summary>
    Center = 2,
}
