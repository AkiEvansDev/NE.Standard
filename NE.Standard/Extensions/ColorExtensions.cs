using NE.Standard.Types;
using System;
using System.Drawing;
using System.Globalization;

namespace NE.Standard.Extensions
{
    /// <summary>
    /// Extensions for working with <see cref="Color"/> instances.
    /// </summary>
    public static class ColorExtensions
    {
        /// <summary>
        /// Converts the color to a hexadecimal string in the format #RRGGBBAA.
        /// </summary>
        public static string ToHex(this Color color)
            => $"#{color.R:X2}{color.G:X2}{color.B:X2}{color.A:X2}";

        /// <summary>
        /// Creates a <see cref="Color"/> from a hexadecimal string in the format #RRGGBBAA or #RRGGBB.
        /// </summary>
        /// <exception cref="ArgumentException"></exception>
        /// <exception cref="FormatException"></exception>
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
        /// Apply alpha to color
        /// </summary>
        public static Color WithAlpha(this Color color, byte alpha)
            => Color.FromArgb(alpha, color.R, color.G, color.B);

        /// <summary>
        /// Determines whether the color is considered "light" based on brightness.
        /// </summary>
        /// <param name="color">The background color.</param>
        /// <returns>True if the color is light (brightness > 128), otherwise false.</returns>
        public static bool IsLight(this Color color)
        {
            var brightness = color.R * 0.299 + color.G * 0.587 + color.B * 0.114;
            return brightness > 128;
        }

        /// <summary>
        /// Tint or Shade color with factor
        /// </summary>
        /// <param name="factor">[0..10]</param>
        /// <exception cref="ArgumentOutOfRangeException"></exception>
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
