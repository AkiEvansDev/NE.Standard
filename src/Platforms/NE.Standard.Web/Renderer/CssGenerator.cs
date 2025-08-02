using NE.Standard.Design.Common;
using NE.Standard.Design.Components;
using System.Drawing;
using System.Text;

namespace NE.Standard.Web.Renderer;

public static class CssGenerator
{
    public static string GenerateRootCss(UIStyle style)
    {
        var sb = new StringBuilder();

        sb.AppendLine(":root {");
        AppendFonts(sb, style.FontConfig);
        AppendRadius(sb, style.RadiusConfig);
        sb.AppendLine("}");

        sb.AppendLine(":root[data-theme='light'] {");
        AppendPalette(sb, style.Light);
        sb.AppendLine("}");

        sb.AppendLine(":root[data-theme='dark'] {");
        AppendPalette(sb, style.Dark);
        sb.AppendLine("}");

        return sb.ToString();
    }

    private static void AppendPalette(StringBuilder sb, PaletteConfig palette)
    {
        void Add(string name, ColorVariant color)
        {
            var cssColor = color.ToColor().ToCss();
            sb.AppendLine($"{name}:{cssColor};");
        }

        Add("--primary", palette.Primary);
        Add("--on-primary", palette.OnPrimary);

        Add("--accent", palette.Accent);
        Add("--on-accent", palette.OnAccent);

        Add("--background", palette.Background);
        Add("--on-background", palette.OnBackground);

        Add("--surface", palette.Surface);
        Add("--on-surface", palette.OnSurface);

        Add("--info", palette.Info);
        Add("--on-info", palette.OnInfo);

        Add("--warning", palette.Warning);
        Add("--on-warning", palette.OnWarning);

        Add("--success", palette.Success);
        Add("--on-success", palette.OnSuccess);

        Add("--error", palette.Error);
        Add("--on-error", palette.OnError);

        Add("--border", palette.Border);
        Add("--shadow", palette.Shadow);
        Add("--overlay", palette.Overlay);
    }

    private static void AppendFonts(StringBuilder sb, FontConfig font)
    {
        sb.AppendLine($"--font-family:'{font.FontFamily ?? "sans-serif"}';");
        sb.AppendLine($"--font-title:{font.Title}px;");
        sb.AppendLine($"--font-header:{font.Header}px;");
        sb.AppendLine($"--font-default:{font.Default}px;");
        sb.AppendLine($"--font-caption:{font.Caption}px;");
        sb.AppendLine($"--font-title-line:{font.TitleLine}px;");
        sb.AppendLine($"--font-header-line:{font.HeaderLine}px;");
        sb.AppendLine($"--font-default-line:{font.DefaultLine}px;");
        sb.AppendLine($"--font-caption-line:{font.CaptionLine}px;");
    }

    private static void AppendRadius(StringBuilder sb, RadiusConfig radius)
    {
        sb.AppendLine($"--radius-card:{radius.CardRadius}px;");
        sb.AppendLine($"--radius-button:{radius.ButtonRadius}px;");
        sb.AppendLine($"--radius-input:{radius.InputRadius}px;");
    }

    private static string ToCss(this Color color)
    {
        return $"rgba({color.R},{color.G},{color.B},{color.A / 255.0:F2})";
    }

    public static List<string> GenerateBlockStyles(IBlock block)
    {
        var styles = new List<string>();

        if (block.Margin is not { } margin)
            return styles;

        styles.Add($"margin:{margin.Top}px {margin.Right}px {margin.Bottom}px {margin.Left}px");
        return styles;
    }

    public static List<string> GenerateBlockClasses(IBlock block)
    {
        var classes = new List<string>
        {
            block.GetType().Name
        };

        void AddLayout(GridPlacement? layout, string prefix)
        {
            if (layout is not { } p) return;

            classes.Add($"col{prefix}{p.Column}-{p.ColumnSpan}");
            classes.Add($"row{prefix}{p.Row}-{p.RowSpan}");
        }

        AddLayout(block.Layout, "-");
        AddLayout(block.LayoutMD, "-md-");
        AddLayout(block.LayoutXL, "-xl-");

        classes.Add(block.HorizontalAlignment switch
        {
            Alignment.Start => "justify-start",
            Alignment.Center => "justify-center",
            Alignment.End => "justify-end",
            Alignment.Stretch => "justify-stretch",
            _ => ""
        });

        classes.Add(block.VerticalAlignment switch
        {
            Alignment.Start => "align-start",
            Alignment.Center => "align-center",
            Alignment.End => "align-end",
            Alignment.Stretch => "align-stretch",
            _ => ""
        });

        if (!block.Enabled) classes.Add("disabled");
        if (!block.Visible) classes.Add("hide");

        return classes;
    }
}
