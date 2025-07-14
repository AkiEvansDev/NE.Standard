using NE.Standard.Types;
using System;
using System.Drawing;
using System.Globalization;

namespace NE.Standard.Extensions
{
    /// <summary>
    /// Provides extension methods for manipulating and analyzing <see cref="Color"/> instances, 
    /// including conversion, brightness evaluation, alpha adjustment, and tint/shade operations.
    /// </summary>
    public static class ColorExtensions
    {
        /// <summary>
        /// Converts the specified <paramref name="color"/> to a hexadecimal string representation in the format <c>#RRGGBBAA</c>.
        /// </summary>
        /// <param name="color">The <see cref="Color"/> to convert.</param>
        /// <returns>A hexadecimal string representing the color, including alpha channel.</returns>
        public static string ToHex(this Color color)
            => $"#{color.R:X2}{color.G:X2}{color.B:X2}{color.A:X2}";

        /// <summary>
        /// Creates a <see cref="Color"/> instance from a hexadecimal string in the format <c>#RRGGBBAA</c> or <c>#RRGGBB</c>.
        /// </summary>
        /// <param name="hex">The hexadecimal color string. May start with <c>#</c>.</param>
        /// <returns>A <see cref="Color"/> instance corresponding to the given hex string.</returns>
        /// <exception cref="ArgumentException">Thrown when the input string is null, empty, or whitespace.</exception>
        /// <exception cref="FormatException">Thrown when the string is not a valid 6- or 8-digit hex color format.</exception>
        public static Color FromHex(this string hex)
        {
            if (string.IsNullOrWhiteSpace(hex))
                throw new ArgumentException("Hex string cannot be null or empty.");

            hex = hex.TrimStart('#');

            return hex.Length switch
            {
                6 => Color.FromArgb(
                    255,
                    int.Parse(hex[..2], NumberStyles.HexNumber),
                    int.Parse(hex[2..4], NumberStyles.HexNumber),
                    int.Parse(hex[4..6], NumberStyles.HexNumber)
                ),
                8 => Color.FromArgb(
                    int.Parse(hex[6..8], NumberStyles.HexNumber),
                    int.Parse(hex[..2], NumberStyles.HexNumber),
                    int.Parse(hex[2..4], NumberStyles.HexNumber),
                    int.Parse(hex[4..6], NumberStyles.HexNumber)
                ),
                _ => throw new FormatException("Hex string must be in format #RRGGBB or #RRGGBBAA.")
            };
        }

        /// <summary>
        /// Creates a new <see cref="Color"/> instance based on the current one, but with the specified <paramref name="alpha"/> channel value.
        /// </summary>
        /// <param name="color">The source color.</param>
        /// <param name="alpha">The new alpha (opacity) value to apply.</param>
        /// <returns>A <see cref="Color"/> with updated alpha and original RGB values.</returns>
        public static Color WithAlpha(this Color color, byte alpha)
            => Color.FromArgb(alpha, color.R, color.G, color.B);

        /// <summary>
        /// Determines whether the specified <paramref name="color"/> is considered light based on its perceived brightness.
        /// </summary>
        /// <param name="color">The color to evaluate.</param>
        /// <returns><c>true</c> if the brightness is greater than 128; otherwise, <c>false</c>.</returns>
        public static bool IsLight(this Color color)
        {
            var brightness = color.R * 0.299 + color.G * 0.587 + color.B * 0.114;
            return brightness > 128;
        }

        /// <summary>
        /// Applies a tint or shade transformation to the specified <paramref name="color"/> using a given intensity <paramref name="factor"/>.
        /// </summary>
        /// <param name="color">The color to adjust.</param>
        /// <param name="adjustment">The type of adjustment to apply: <see cref="ColorAdjustment.Tint"/> or <see cref="ColorAdjustment.Shade"/>.</param>
        /// <param name="factor">The adjustment intensity ranging from 0 (no change) to 10 (maximum adjustment).</param>
        /// <returns>A new <see cref="Color"/> with the applied tint or shade.</returns>
        /// <exception cref="ArgumentOutOfRangeException">Thrown when <paramref name="factor"/> is outside the range 0–10.</exception>
        public static Color AdjustColor(this Color color, ColorAdjustment adjustment, int factor)
        {
            if (factor < 0 || factor > 10)
                throw new ArgumentOutOfRangeException(nameof(factor));

            byte a = color.A;
            byte r = color.R;
            byte g = color.G;
            byte b = color.B;

            if (adjustment == ColorAdjustment.Shade)
            {
                var f = (10 - factor) / 10.0;

                r = (byte)Math.Round(r * f);
                g = (byte)Math.Round(g * f);
                b = (byte)Math.Round(b * f);
            }
            else if (adjustment == ColorAdjustment.Tint)
            {
                var f = factor / 10.0;

                r = (byte)Math.Round(r + (255 - r) * f);
                g = (byte)Math.Round(g + (255 - g) * f);
                b = (byte)Math.Round(b + (255 - b) * f);
            }

            return Color.FromArgb(a, r, g, b);
        }
    }
}
