using Microsoft.Extensions.Primitives;
using NE.Standard.Design.Elements;
using NE.Standard.Design.Elements.Base;
using NE.Standard.Design.Styles;
using NE.Standard.Extensions;
using System.Text;

namespace NE.Standard.Web;

public static class CssGenerator
{
    public static string GenerateRootCss(UIStyleConfig config)
    {
        var sb = new StringBuilder();

        sb.AppendLine(":root {");

        // Font
        if (config.Font != null && !config.Font.FontFamily.IsNull())
            sb.AppendLine($"  --font-family: '{config.Font.FontFamily}';");
        sb.AppendLine($"  --font-default: {config.Font?.Default ?? 14}px;");
        sb.AppendLine($"  --font-title: {config.Font?.Title ?? 24}px;");
        sb.AppendLine($"  --font-header: {config.Font?.Header ?? 16}px;");
        sb.AppendLine($"  --font-caption: {config.Font?.Caption ?? 12}px;");

        // Colors
        sb.AppendLine($"  --color-primary: {(config.Colors?.Primary ?? new ColorPath(ColorKey.HarlequinGreen)).ToHex()};");
        sb.AppendLine($"  --color-accent: {(config.Colors?.Accent ?? new ColorPath(ColorKey.HarlequinGreen, FactorType.Shade, 4)).ToHex()};");
        sb.AppendLine($"  --color-background: {(config.Colors?.Background ?? new ColorPath(ColorKey.SilverNight, FactorType.Shade, 10)).ToHex()};");
        sb.AppendLine($"  --color-foreground: {(config.Colors?.Foreground ?? new ColorPath(ColorKey.SilverNight, FactorType.Tint, 10, 200)).ToHex()};");
        sb.AppendLine($"  --color-success: {(config.Colors?.Success ?? new ColorPath(ColorKey.HarlequinGreen, FactorType.Tint, 2)).ToHex()};");
        sb.AppendLine($"  --color-warning: {(config.Colors?.Warning ?? new ColorPath(ColorKey.RipeMango, FactorType.Tint, 2)).ToHex()};");
        sb.AppendLine($"  --color-error: {(config.Colors?.Error ?? new ColorPath(ColorKey.CrimsonRed, FactorType.Tint, 2)).ToHex()};");
        sb.AppendLine($"  --color-border: {(config.Colors?.Border ?? new ColorPath(ColorKey.SilverNight, FactorType.Shade, 7, 200)).ToHex()};");

        // Radii
        sb.AppendLine($"  --radius-card: {config.CardRadius ?? 12}px;");
        sb.AppendLine($"  --radius-button: {config.ButtonRadius ?? 6}px;");
        sb.AppendLine($"  --radius-input: {config.InputRadius ?? 6}px;");

        sb.AppendLine("}");

        return sb.ToString();
    }

    public static string GetDefaultStyle(IUIElement el)
    {
        var sb = new StringBuilder();

        if (el.LayoutPlacement is { } placement)
        {
            var colStart = placement.Column + 1;
            var colEnd = colStart + placement.ColumnSpan;
            var rowStart = placement.Row + 1;
            var rowEnd = rowStart + placement.RowSpan;

            sb.Append($"grid-column:{colStart}/{colEnd};");
            sb.Append($"grid-row:{rowStart}/{rowEnd};");
        }

        if (!el.Visible)
            sb.Append("display:none;");

        if (!el.Enabled)
        {
            sb.Append("pointer-events:none;");
            sb.Append("opacity:0.6;");
        }

        sb.Append(el.HorizontalAlignment switch
        {
            Alignment.Start => "justify-self:start;",
            Alignment.Center => "justify-self:center;",
            Alignment.End => "justify-self:end;",
            Alignment.Stretch => "justify-self:stretch;",
            _ => ""
        });

        sb.Append(el.VerticalAlignment switch
        {
            Alignment.Start => "align-self:start;",
            Alignment.Center => "align-self:center;",
            Alignment.End => "align-self:end;",
            Alignment.Stretch => "align-self:stretch;",
            _ => ""
        });

        return sb.ToString();
    }
}
