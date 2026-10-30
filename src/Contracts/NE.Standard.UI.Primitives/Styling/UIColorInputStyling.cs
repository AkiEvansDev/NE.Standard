namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// How a colour input writes the colour it holds.
/// </summary>
public enum UIColorTextFormat
{
    /// <summary><c>#RRGGBB</c>, and <c>#RRGGBBAA</c> once the colour is not fully opaque.</summary>
    Hex = 0,

    /// <summary><c>rgb(r, g, b)</c>, and <c>rgba(r, g, b, a)</c> once the colour is not fully opaque.</summary>
    Rgb = 1
}
