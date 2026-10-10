using NE.Colors;

namespace NE.Standard.UI.Abstractions.Styling;

/// <summary>How two colours read against each other, by relative luminance as WCAG defines it.</summary>
/// <remarks>Whether a colour itself reads as light is NE.Colors' own <c>ColorVariant.IsLight()</c>.</remarks>
public static class UIColorContrast
{
    private static readonly ColorVariant White = ColorVariant.FromRgb(byte.MaxValue, byte.MaxValue, byte.MaxValue);

    /// <summary>
    /// Whether dark text reads better on a colour drawn over a pale ground (e.g. a transparency checkerboard), whose opacity alone can
    /// flip the answer <c>ColorVariant.IsLight()</c> gives, since that one weighs no opacity.
    /// </summary>
    public static bool IsLightOverWhite(this ColorVariant variant)
    {
        System.Drawing.Color color = variant.ToColor();

        return Composite(color, color.A / 255d, White).IsLight();
    }

    /// <summary>A colour laid at a share over an opaque ground, channel by channel as the browser composites it, in whole levels.</summary>
    public static ColorVariant Composite(System.Drawing.Color top, double alpha, ColorVariant ground)
    {
        System.Drawing.Color under = ground.ToColor();

        return ColorVariant.FromRgb(Blend(top.R, under.R, alpha), Blend(top.G, under.G, alpha), Blend(top.B, under.B, alpha), ColorAdjustment.None, 0, byte.MaxValue);
    }

    private static byte Blend(byte top, byte under, double alpha)
        => (byte)System.Math.Round((top * alpha) + (under * (1 - alpha)));

    /// <summary>The WCAG contrast ratio of two colours, from 1 (the same) to 21 (black on white); opacity is not weighed.</summary>
    public static double Ratio(ColorVariant first, ColorVariant second)
    {
        var a = RelativeLuminance(first.ToColor());
        var b = RelativeLuminance(second.ToColor());

        return (System.Math.Max(a, b) + 0.05) / (System.Math.Min(a, b) + 0.05);
    }

    /// <summary>The WCAG relative luminance of a colour, from 0 (black) to 1 (white); opacity is not weighed.</summary>
    public static double Luminance(ColorVariant color)
        => RelativeLuminance(color.ToColor());

    // NE.Colors keeps its own luminance internal.
    private static double RelativeLuminance(System.Drawing.Color color)
        => (0.2126 * Linear(color.R)) + (0.7152 * Linear(color.G)) + (0.0722 * Linear(color.B));

    private static double Linear(byte channel)
    {
        var value = channel / 255d;

        return value <= 0.04045 ? value / 12.92 : System.Math.Pow((value + 0.055) / 1.055, 2.4);
    }
}
