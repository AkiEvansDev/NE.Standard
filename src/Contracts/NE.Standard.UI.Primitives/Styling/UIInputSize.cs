namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// How much room a field takes, independent of what it holds.
/// </summary>
public enum UIInputSize
{
    /// <summary>A compact field in the caption's size, for a dense surface — a node on a canvas, a status bar, a cell.</summary>
    Small = 0,

    /// <summary>The ordinary control height — a field standing in a form.</summary>
    Medium = 1,

    /// <summary>A field that is the point of what it sits in.</summary>
    Large = 2,
}
