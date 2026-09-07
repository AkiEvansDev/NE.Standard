namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// How a colour input presents itself when it is closed.
/// </summary>
public enum UIColorInputVariant
{
    /// <summary>A field, reading the colour as text, with a swatch beside it and the picker's own button.</summary>
    Field = 0,

    /// <summary>A swatch alone, with the colour written across it.</summary>
    Swatch = 1
}

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
