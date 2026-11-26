namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// How a single-value select trigger is drawn when closed.
/// </summary>
public enum UISelectVariant
{
    /// <summary>A framed input field showing the chosen option's full template.</summary>
    Field = 0,

    /// <summary>
    /// A compact borderless trigger fitted to its content, showing only the chosen option's icon and title with the chevron beside
    /// them while opening the full option list.
    /// </summary>
    Quiet = 1,
}
