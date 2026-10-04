using NE.Colors;

namespace NE.Standard.UI.Abstractions.Styling;

/// <summary>How two colours read against each other, by relative luminance as WCAG defines it.</summary>
/// <remarks>Whether a colour itself reads as light is NE.Colors' own <c>ColorVariant.IsLight()</c>.</remarks>
public static class UIColorContrast
{
    /// <summary>
    /// Whether dark text reads better on a colour drawn over a pale ground (e.g. a transparency checkerboard), whose opacity alone can
    /// flip the answer <c>ColorVariant.IsLight()</c> gives, since that one weighs no opacity.
    /// </summary>
    public static bool IsLightOverWhite(this ColorVariant variant)
    {
        System.Drawing.Color color = variant.ToColor();
        var alpha = color.A / 255d;

        return ColorVariant.FromRgb(Over(color.R, alpha), Over(color.G, alpha), Over(color.B, alpha)).IsLight();
    }

    private static byte Over(byte channel, double alpha)
        => (byte)System.Math.Round((channel * alpha) + (255 * (1 - alpha)));

    /// <summary>The WCAG contrast ratio of two colours, from 1 (the same) to 21 (black on white); opacity is not weighed.</summary>
    public static double Ratio(ColorVariant first, ColorVariant second)
    {
        var a = RelativeLuminance(first.ToColor());
        var b = RelativeLuminance(second.ToColor());

        return (System.Math.Max(a, b) + 0.05) / (System.Math.Min(a, b) + 0.05);
    }

    // NE.Colors keeps its own luminance internal.
    private static double RelativeLuminance(System.Drawing.Color color)
        => (0.2126 * Linear(color.R)) + (0.7152 * Linear(color.G)) + (0.0722 * Linear(color.B));

    private static double Linear(byte channel)
    {
        var value = channel / 255d;

        return value <= 0.04045 ? value / 12.92 : System.Math.Pow((value + 0.055) / 1.055, 2.4);
    }
}
