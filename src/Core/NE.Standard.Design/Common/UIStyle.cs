using NE.Standard.Extensions;
using NE.Standard.Serialization;
using NE.Standard.Types;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Drawing;

namespace NE.Standard.Design.Common
{
    public enum ColorName
    {
        [Description("Iron Fog")]
        IronFog = 0,
        [Description("Silver Night")]
        SilverNight = 1,
        [Description("Bronze Dusk")]
        BronzeDusk = 2,

        [Description("Stellar Red")]
        StellarRed = 10,
        [Description("Nebula Rose")]
        NebulaRose = 11,
        [Description("Lunar Pink")]
        LunarPink = 12,

        [Description("Aurora Green")]
        AuroraGreen = 20,
        [Description("Nebula Mint")]
        NebulaMint = 21,
        [Description("Lunar Fern")]
        LunarFern = 22,

        [Description("Quantum Blue")]
        QuantumBlue = 30,
        [Description("Nebula Aqua")]
        NebulaAqua = 31,
        [Description("Lunar Azure")]
        LunarAzure = 32,

        [Description("Nova Teal")]
        AstralTeal = 40,
        [Description("Nebula Cyan")]
        NebulaCyan = 41,
        [Description("Lunar Moss")]
        LunarMoss = 42,

        [Description("Nova Purple")]
        NovaPurple = 50,
        [Description("Nebula Violet")]
        NebulaViolet = 51,
        [Description("Lunar Lavender")]
        LunarLavender = 52,

        [Description("Solar Amber")]
        SolarAmber = 60,
        [Description("Nebula Gold")]
        NebulaGold = 61,
        [Description("Lunar Yellow")]
        LunarYellow = 62
    }

    [NEObject]
    public struct ColorVariant
    {
        public static IReadOnlyDictionary<ColorName, Color> Colors { get; } = new ReadOnlyDictionary<ColorName, Color>(
            new Dictionary<ColorName, Color>
            {
                { ColorName.IronFog,        Color.FromArgb(120, 120, 120)   },
                { ColorName.SilverNight,    Color.FromArgb(100, 120, 140)   },
                { ColorName.BronzeDusk,     Color.FromArgb(140, 120, 120)   },

                { ColorName.StellarRed,     Color.FromArgb(180, 40, 40)     },
                { ColorName.NebulaRose,     Color.FromArgb(240, 80, 120)    },
                { ColorName.LunarPink,      Color.FromArgb(240, 140, 180)   },

                { ColorName.AuroraGreen,    Color.FromArgb(40, 120, 40)     },
                { ColorName.NebulaMint,     Color.FromArgb(100, 160, 100)   },
                { ColorName.LunarFern,      Color.FromArgb(140, 180, 140)   },

                { ColorName.QuantumBlue,    Color.FromArgb(40, 80, 160)     },
                { ColorName.NebulaAqua,     Color.FromArgb(80, 140, 200)    },
                { ColorName.LunarAzure,     Color.FromArgb(160, 180, 220)   },

                { ColorName.AstralTeal,       Color.FromArgb(0, 110, 100)     },
                { ColorName.NebulaCyan,     Color.FromArgb(40, 180, 180)    },
                { ColorName.LunarMoss,      Color.FromArgb(120, 200, 200)   },

                { ColorName.NovaPurple,     Color.FromArgb(80, 60, 180)     },
                { ColorName.NebulaViolet,   Color.FromArgb(160, 100, 200)   },
                { ColorName.LunarLavender,  Color.FromArgb(180, 160, 220)   },

                { ColorName.SolarAmber,     Color.FromArgb(200, 100, 40)    },
                { ColorName.NebulaGold,     Color.FromArgb(240, 240, 80)    },
                { ColorName.LunarYellow,    Color.FromArgb(240, 240, 160)   },
            });

        public ColorName Name { get; set; }
        public ColorAdjustment Adjustment { get; set; }
        public int Factor { get; set; }
        public byte Opacity { get; set; }

        public ColorVariant(ColorName name, ColorAdjustment adjustment = ColorAdjustment.None, int factor = 0, byte opacity = 255)
        {
            if (!Colors.ContainsKey(name))
                throw new KeyNotFoundException(nameof(name));

            Name = name;
            Adjustment = adjustment;
            Factor = factor;
            Opacity = opacity;
        }

        public readonly Color ToColor()
        {
            return Colors[Name]
                .WithAlpha(Opacity)
                .AdjustColor(Adjustment, Factor);
        }
    }

    [NEObject]
    public class PaletteConfig
    {
        public ColorVariant Primary { get; set; }
        public ColorVariant Accent { get; set; }
        public ColorVariant Background { get; set; }
        public ColorVariant Surface { get; set; }

        public ColorVariant OnPrimary { get; set; }
        public ColorVariant OnAccent { get; set; }
        public ColorVariant OnBackground { get; set; }
        public ColorVariant OnSurface { get; set; }

        public ColorVariant Info { get; set; }
        public ColorVariant Warning { get; set; }
        public ColorVariant Success { get; set; }
        public ColorVariant Error { get; set; }

        public ColorVariant OnInfo { get; set; }
        public ColorVariant OnWarning { get; set; }
        public ColorVariant OnSuccess { get; set; }
        public ColorVariant OnError { get; set; }

        public ColorVariant Border { get; set; }
        public ColorVariant Shadow { get; set; }
        public ColorVariant Overlay { get; set; }

        public PaletteConfig()
        {
            Primary = new ColorVariant(ColorName.AstralTeal);
            OnPrimary = new ColorVariant(ColorName.IronFog, ColorAdjustment.Tint, 9);

            Accent = new ColorVariant(ColorName.AstralTeal, ColorAdjustment.Tint, 2);
            OnAccent = new ColorVariant(ColorName.IronFog, ColorAdjustment.Tint, 9);

            Background = new ColorVariant(ColorName.SilverNight, ColorAdjustment.Shade, 8);
            OnBackground = new ColorVariant(ColorName.IronFog, ColorAdjustment.Tint, 9);

            Surface = new ColorVariant(ColorName.SilverNight, ColorAdjustment.Shade, 7);
            OnSurface = new ColorVariant(ColorName.IronFog, ColorAdjustment.Tint, 7);

            Info = new ColorVariant(ColorName.QuantumBlue, ColorAdjustment.Tint, 1);
            OnInfo = new ColorVariant(ColorName.IronFog, ColorAdjustment.Tint, 9);

            Warning = new ColorVariant(ColorName.NebulaGold, ColorAdjustment.Tint, 1);
            OnWarning = new ColorVariant(ColorName.IronFog, ColorAdjustment.Tint, 9);

            Success = new ColorVariant(ColorName.AuroraGreen, ColorAdjustment.Tint, 1);
            OnSuccess = new ColorVariant(ColorName.IronFog, ColorAdjustment.Tint, 9);

            Error = new ColorVariant(ColorName.StellarRed, ColorAdjustment.Tint, 1);
            OnError = new ColorVariant(ColorName.IronFog, ColorAdjustment.Tint, 9);

            Border = new ColorVariant(ColorName.AstralTeal, ColorAdjustment.Shade, 4);
            Shadow = new ColorVariant(ColorName.IronFog, ColorAdjustment.Shade, 10);
            Overlay = new ColorVariant(ColorName.IronFog, ColorAdjustment.Tint, 10, 100);
        }
    }

    [NEObject]
    public class FontConfig
    {
        public string? FontFamily { get; set; }

        public double Default { get; set; }
        public double Title { get; set; }
        public double Header { get; set; }
        public double Caption { get; set; }

        public FontConfig()
        {
            Default = 14;
            Title = 22;
            Header = 18;
            Caption = 12;
        }
    }

    [NEObject]
    public class RadiusConfig
    {
        public double CardRadius { get; set; }
        public double ButtonRadius { get; set; }
        public double InputRadius { get; set; }

        public RadiusConfig()
        {
            CardRadius = 12;
            ButtonRadius = 6;
            InputRadius = 6;
        }
    }

    [NEObject]
    public class UIStyle
    {
        public PaletteConfig Dark { get; set; }
        public PaletteConfig Light { get; set; }

        public FontConfig FontConfig { get; set; }
        public RadiusConfig RadiusConfig { get; set; }

        public UIStyle()
        {
            Dark = new PaletteConfig();
            Light = new PaletteConfig();

            FontConfig = new FontConfig();
            RadiusConfig = new RadiusConfig();
        }
    }
}
