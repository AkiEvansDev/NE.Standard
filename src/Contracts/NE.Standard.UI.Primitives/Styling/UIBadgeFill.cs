namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// Defines how a badge spends its colour: on its ground, on a light tint of it, or on its edge alone.
/// </summary>
public enum UIBadgeFill
{
    /// <summary>
    /// The colour as the ground, with the words in the colour that reads on it.
    /// </summary>
    Filled = 0,

    /// <summary>
    /// A light tint of the colour as the ground, with the words in the colour's ink.
    /// </summary>
    Tinted = 1,

    /// <summary>
    /// No ground, a thin edge in the colour, and the words in the colour's ink.
    /// </summary>
    Outline = 2,
}
