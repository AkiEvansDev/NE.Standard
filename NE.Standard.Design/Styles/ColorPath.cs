using NE.Standard.Serialization;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Drawing;
using System.Globalization;

namespace NE.Standard.Design.Styles
{
    public enum ColorKey
    {
        [Description("Silver Night")]
        SilverNight = 0,
        [Description("Crimson Red")]
        CrimsonRed = 1,
        [Description("Tropical Rain Forest")]
        TropicalRainForest = 2,
        [Description("Eucalyptus")]
        Eucalyptus = 3,
        [Description("Celadon")]
        Celadon = 4,
        [Description("Harlequin Green")]
        HarlequinGreen = 5,
        [Description("Pale Violet")]
        PaleViolet = 6,
        [Description("Shocking Pink")]
        ShockingPink = 7,
        [Description("Chinese Pink")]
        ChinesePink = 8,
        [Description("Ripe Mango")]
        RipeMango = 9,
        [Description("Blue Eyes")]
        BlueEyes = 10,
        [Description("Philippine Orange")]
        PhilippineOrange = 11,
        [Description("Absolute Zero")]
        AbsoluteZero = 12,
        [Description("Calamansi")]
        Calamansi = 13,
        [Description("Vivid Cerulean")]
        VividCerulean = 14,
    }

    public enum FactorType
    {
        Color = 0,
        Shade = 1,
        Tint = 2,
    }

    [ObjectSerializable]
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
            if (hex is null)
                throw new ArgumentNullException(nameof(hex));

            ReadOnlySpan<char> span = hex.AsSpan();
            if (span.Length > 0 && span[0] == '#')
                span = span[1..];

            if (span.Length == 6)
            {
                byte r = byte.Parse(span.Slice(0, 2), NumberStyles.HexNumber);
                byte g = byte.Parse(span.Slice(2, 2), NumberStyles.HexNumber);
                byte b = byte.Parse(span.Slice(4, 2), NumberStyles.HexNumber);
                return GetColor(255, r, g, b, factorType, factor);
            }

            if (span.Length == 8)
            {
                byte a = byte.Parse(span.Slice(0, 2), NumberStyles.HexNumber);
                byte r = byte.Parse(span.Slice(2, 2), NumberStyles.HexNumber);
                byte g = byte.Parse(span.Slice(4, 2), NumberStyles.HexNumber);
                byte b = byte.Parse(span.Slice(6, 2), NumberStyles.HexNumber);
                return GetColor(a, r, g, b, factorType, factor);
            }

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

                r = (byte)Math.Round(r + (255 - r) * f);
                g = (byte)Math.Round(g + (255 - g) * f);
                b = (byte)Math.Round(b + (255 - b) * f);
            }

            return Color.FromArgb(a, r, g, b);
        }
    }
}
