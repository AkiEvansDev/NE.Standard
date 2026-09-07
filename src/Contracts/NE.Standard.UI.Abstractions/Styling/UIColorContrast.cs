using NE.Colors;

namespace NE.Standard.UI.Abstractions.Styling;

/// <summary>
/// Whether a colour reads as light, and therefore which of a theme's two text colours belongs on top of it.
/// </summary>
/// <remarks>
/// Relative luminance as WCAG defines it, not a plain channel average, which gets mid-tones wrong.
/// </remarks>
public static class UIColorContrast
{
    private const double Threshold = 0.1791;

    /// <summary>Whether dark text reads better on this colour than light text does.</summary>
    public static bool IsLight(this ColorVariant variant)
    {
        System.Drawing.Color color = variant.ToColor();

        return RelativeLuminance(color.R, color.G, color.B) > Threshold;
    }

    /// <summary>
    /// The same question for a colour drawn over a pale ground (e.g. a transparency checkerboard); opacity alone can flip the answer.
    /// </summary>
    public static bool IsLightOverWhite(this ColorVariant variant)
    {
        System.Drawing.Color color = variant.ToColor();
        var alpha = color.A / 255d;

        return RelativeLuminance(Over(color.R, alpha), Over(color.G, alpha), Over(color.B, alpha)) > Threshold;
    }

    private static double Over(byte channel, double alpha)
        => (channel * alpha) + (255 * (1 - alpha));

    private static double RelativeLuminance(double red, double green, double blue)
        => (0.2126 * Linear(red)) + (0.7152 * Linear(green)) + (0.0722 * Linear(blue));

    private static double Linear(double channel)
    {
        var value = channel / 255d;

        return value <= 0.03928 ? value / 12.92 : System.Math.Pow((value + 0.055) / 1.055, 2.4);
    }
}
