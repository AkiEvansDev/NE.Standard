namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// How much room a control or a glyph takes, independent of what it holds: one scale for a button, a field, an icon and an indicator.
/// </summary>
public enum UISize
{
    /// <summary>Sized to sit inside a row, a toolbar, a list or a dense surface (a node on a canvas, a cell) without setting its height.</summary>
    Small = 0,

    /// <summary>The ordinary size — a button or a field standing on its own.</summary>
    Medium = 1,

    /// <summary>A call to action, where the control is the point of what it sits in.</summary>
    Large = 2,
}
