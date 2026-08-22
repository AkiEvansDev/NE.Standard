using System;
using System.Drawing;
using NE.Colors;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Design.Colors;

/// <summary>
/// The full named palette as a full-page swatch grid: one card per <see cref="ColorName"/> with its
/// hex/rgb values and every Shade/Tint factor as labeled chips — for picking colors.
/// </summary>
internal sealed class ColorsView : ColorsViewBase, IUIViewDefinition
{
    public static string ViewKey => "demo.design.colors";

    protected override string CurrentTabUrl => "/design/colors";

    protected override void DrawColorsContent(WrapPanelComponent container)
    {
        foreach (ColorName name in Enum.GetValues<ColorName>())
            _ = container.AddChild(CreateColorCard(name));
    }

    private static StackPanelComponent CreateColorCard(ColorName name)
    {
        ColorVariant baseVariant = new(name);
        Color color = baseVariant.ToColor();
        UIThemeColor textColor = ContrastText(baseVariant.IsLight());

        return new StackPanelComponent()
            .SetOrientation(UIOrientation.Vertical)
            .SetSpacing(4)
            .SetPlacement(1, 1, 24, 1, md: UIGridPlacement.At(1, 1, 12, 1), xl: UIGridPlacement.At(1, 1, 8, 1))
            .AddChild(new ContainerComponent()
                .SetBackground(UIThemeColor.FromColorVariant(baseVariant))
                .SetBorderRadius(UICornerRadius.Top(8))
                .SetHeight(UILayoutLength.Absolute(88))
                .SetPadding(UIThickness.All(12, 8, 12, 8))
                .AddRow(UIGridUnit.Star())
                .AddChild(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetHorizontalAlignment(UIAlignment.End)
                    .SetVerticalAlignment(UIAlignment.Start)
                    .SetPlacement(1, 1, 24, 1)
                    .AddChild(CreateSwatchLabel(name.ToString(), UITextAppearance.Body, textColor))
                    .AddChild(CreateSwatchLabel(baseVariant.ToHex()[..7], UITextAppearance.Caption, textColor))
                    .AddChild(CreateSwatchLabel($"rgb({color.R}, {color.G}, {color.B})", UITextAppearance.Caption, textColor))
                ))
            .AddChild(CreateAdjustmentRow("Shade", name, ColorAdjustment.Shade, "S"))
            .AddChild(CreateAdjustmentRow("Tint", name, ColorAdjustment.Tint, "T"));
    }

    private static TextComponent CreateSwatchLabel(string text, UITextAppearance type, UIThemeColor color)
        => new TextComponent()
            .SetTitle(text)
            .SetTitleType(type)
            .SetTitleColor(color)
            .SetHorizontalAlignment(UIAlignment.End)
            .SetTextAlignment(UITextAlignment.End);

    private static ContainerComponent CreateAdjustmentRow(string label, ColorName name, ColorAdjustment adjustment, string chipPrefix)
    {
        ContainerComponent row = new ContainerComponent()
            .SetVerticalAlignment(UIAlignment.Center)
            .SetColumn(1, UIGridUnit.Auto(min: 40))
            .SetColumn(16, UIGridUnit.Absolute(26))
            .SetColumn(17, UIGridUnit.Absolute(26))
            .SetColumn(18, UIGridUnit.Absolute(26))
            .SetColumn(19, UIGridUnit.Absolute(26))
            .SetColumn(20, UIGridUnit.Absolute(26))
            .SetColumn(21, UIGridUnit.Absolute(26))
            .SetColumn(22, UIGridUnit.Absolute(26))
            .SetColumn(23, UIGridUnit.Absolute(26))
            .SetColumn(24, UIGridUnit.Absolute(26))
            .AddChild(new TextComponent()
                .SetTitle(label)
                .SetTitleType(UITextAppearance.Overline)
                .SetTitleColor(UIThemeColor.Muted)
                .SetMinWidth(UILayoutLength.Absolute(40))
                .SetPlacement(1, 1, 1, 1)
            );

        for (var factor = 1; factor <= 9; factor++)
        {
            ColorVariant variant = new(name, adjustment, factor);

            _ = row.AddChild(new ContainerComponent()
                .SetBackground(UIThemeColor.FromColorVariant(variant))
                .SetBorderRadius(UICornerRadius.Uniform(4))
                .SetWidth(UILayoutLength.Absolute(24))
                .SetHeight(UILayoutLength.Absolute(24))
                .SetHorizontalAlignment(UIAlignment.Center)
                .SetVerticalAlignment(UIAlignment.Center)
                .SetPlacement(15 + factor, 1, 1, 1)
                .AddChild(new TextComponent()
                    .SetTitle($"{chipPrefix}{factor}")
                    .SetTitleType(UITextAppearance.Overline)
                    .SetTitleColor(ContrastText(variant.IsLight()))
                    .SetHorizontalAlignment(UIAlignment.Center)
                    .SetVerticalAlignment(UIAlignment.Center)
                    .SetTextAlignment(UITextAlignment.Center)
                    .SetPlacement(1, 1, 24, 1)
                ));
        }

        return row;
    }

    private static UIThemeColor ContrastText(bool onLightBackground)
        => onLightBackground
            ? UIThemeColor.FromColorVariant(ColorName.IronFog, ColorAdjustment.Shade, 10)
            : UIThemeColor.FromColorVariant(ColorName.IronFog, ColorAdjustment.Tint, 10);
}
