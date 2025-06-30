using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Drawing;
using System.Globalization;

namespace NE.Standard.Design.Types
{
    public struct ColorPath
    {
        public static IReadOnlyDictionary<ColorKey, Color> Colors { get; } = new ReadOnlyDictionary<ColorKey, Color>(
            new Dictionary<ColorKey, Color>
            {
                { ColorKey.SilverNight,        Color.FromArgb(176, 181, 185) },
                { ColorKey.CrimsonRed,         Color.FromArgb(149, 0, 0)     },
                { ColorKey.TropicalRainForest, Color.FromArgb(0, 111, 101)   },
                { ColorKey.Eucalyptus,         Color.FromArgb(30, 227, 175)  },
                { ColorKey.Celadon,            Color.FromArgb(173, 227, 174) },
                { ColorKey.HarlequinGreen,     Color.FromArgb(55, 213, 0)    },
                { ColorKey.PaleViolet,         Color.FromArgb(205, 130, 254) },
                { ColorKey.ShockingPink,       Color.FromArgb(254, 0, 212)   },
                { ColorKey.ChinesePink,        Color.FromArgb(232, 124, 170) },
                { ColorKey.RipeMango,          Color.FromArgb(255, 202, 34)  },
                { ColorKey.BlueEyes,           Color.FromArgb(160, 180, 254) },
                { ColorKey.PhilippineOrange,   Color.FromArgb(254, 115, 0)   },
                { ColorKey.AbsoluteZero,       Color.FromArgb(0, 88, 203)    },
                { ColorKey.Calamansi,          Color.FromArgb(240, 252, 168) },
                { ColorKey.VividCerulean,      Color.FromArgb(0, 168, 242)   },
            });

        public ColorKey Key { get; set; }
        public FactorType Type { get; set; }
        public int Factor { get; set; }
        public byte Opacity { get; set; }

        public ColorPath(ColorKey key, FactorType type = FactorType.Color, int factor = 0, byte opacity = 255)
        {
            if (!Colors.ContainsKey(key))
                throw new KeyNotFoundException(nameof(key));

            Key = key;
            Type = type;
            Factor = factor;
            Opacity = opacity;
        }

        public readonly Color ToColor()
        {
            var color = Colors[Key];
            return GetColor(Opacity, color.R, color.G, color.B, Type, Factor);
        }

        /// <summary>
        /// Get color from HEX and change it with factor 
        /// </summary>
        /// <param name="hex"></param>
        /// <param name="factorType">Color = ignore factor</param>
        /// <param name="factor">[0..10]</param>
        /// <returns></returns>
        /// <exception cref="InvalidCastException"></exception>
        public static Color GetColor(string hex, FactorType factorType = FactorType.Color, int factor = 0)
        {
            hex = hex.TrimStart('#');

            if (hex.Length == 6)
                return GetColor(
                    255,
                    byte.Parse(hex.Substring(0, 2), NumberStyles.HexNumber),
                    byte.Parse(hex.Substring(2, 2), NumberStyles.HexNumber),
                    byte.Parse(hex.Substring(4, 2), NumberStyles.HexNumber),
                    factorType,
                    factor
                );
            else if (hex.Length == 8)
                return GetColor(
                    byte.Parse(hex.Substring(0, 2), NumberStyles.HexNumber),
                    byte.Parse(hex.Substring(2, 2), NumberStyles.HexNumber),
                    byte.Parse(hex.Substring(4, 2), NumberStyles.HexNumber),
                    byte.Parse(hex.Substring(6, 2), NumberStyles.HexNumber),
                    factorType,
                    factor
                );

            throw new InvalidCastException($"{hex} is not a valid HEX format!");
        }

        /// <summary>
        /// Get color from ARGB and change it with factor 
        /// </summary>
        /// <param name="a"></param>
        /// <param name="r"></param>
        /// <param name="g"></param>
        /// <param name="b"></param>
        /// <param name="factorType">Color = ignore factor</param>
        /// <param name="factor">[0..10]</param>
        /// <returns></returns>
        /// <exception cref="ArgumentOutOfRangeException"></exception>
        public static Color GetColor(byte a, byte r, byte g, byte b, FactorType factorType = FactorType.Color, int factor = 0)
        {
            if (factor < 0 || factor > 10)
                throw new ArgumentOutOfRangeException(nameof(factor));

            if (factorType == FactorType.Shade)
            {
                var f = (10 - factor) / 10.0;

                r = (byte)Math.Round(r * f);
                g = (byte)Math.Round(g * f);
                b = (byte)Math.Round(b * f);
            }
            else if (factorType == FactorType.Tint)
            {
                var f = factor / 10.0;

                r = (byte)Math.Round(r + ((255 - r) * f));
                g = (byte)Math.Round(g + ((255 - g) * f));
                b = (byte)Math.Round(b + ((255 - b) * f));
            }

            return Color.FromArgb(a, r, g, b);
        }
    }
}
