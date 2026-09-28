using DemoApp.Views.Base;
using NE.Colors;

namespace DemoApp.Views.Inputs.ColorInput;

/// <summary>
/// A colour is picked off a palette, off a wheel or typed, and the control's properties say which it offers.
/// </summary>
internal sealed class ColorInputExamplesView : DemoExamplesView, IUIViewDefinition
{
    public static string ViewKey => "demo.inputs.color-input.examples";

    protected override string ComponentRoute => "/inputs/color-input";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.inputs.color-input.header";
    protected override string HeaderDescription => "demo.inputs.color-input.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container.AddChildren(DemoUI.CreateColumns([CreateBrandingGroup()], [CreateSurfacesGroup()]));

        _ = container.AddChild(CreateFormatGroup());
    }

    /// <summary>
    /// A handful of colours making up a theme, each labelled with what it paints rather than with what it is.
    /// </summary>
    /// <remarks>Both variants, because they are the two halves of one job: a field where the value is edited, swatches where it is chosen.</remarks>
    private static ContainerComponent CreateBrandingGroup()
    {
        return DemoUI.CreateExample("Where it is used",
            UILayout.Stack(16)
                .AddChild(new ColorInputComponent()
                    .SetTitle("Brand")
                    .SetIcon(DemoIcons.Palette)
                    .SetValue(UIThemeColor.FromColorVariant(ColorName.AstralTeal))
                )
                .AddChild(new ColorInputComponent()
                    .SetTitle("Accent")
                    .SetValue(UIThemeColor.FromColorVariant(ColorName.NovaPurple))
                )
                .AddChild(new ColorInputComponent()
                    .SetTitle("Chart series 1")
                    .SetValue(UIThemeColor.FromColorVariant(ColorName.QuantumBlue))
                    .SetBadgeText("also used by the legend")
                    .SetBadgeStyle(UIBadgeType.Info)
                )
                .AddChild(UIText.Label("The chart's other series, as swatches")
                    .SetMargin(UIThickness.All(0, 8, 0, 0))
                )
                .AddChild(UILayout.Row(8)
                    .AddChild(new ColorInputComponent()
                        .SetVariant(UIColorInputVariant.Swatch)
                        .SetWidth(UILayoutLength.Absolute(120))
                        .SetValue(UIThemeColor.FromColorVariant(ColorName.StellarRed))
                    )
                    .AddChild(new ColorInputComponent()
                        .SetVariant(UIColorInputVariant.Swatch)
                        .SetWidth(UILayoutLength.Absolute(120))
                        .SetValue(UIThemeColor.FromColorVariant(ColorName.AuroraGreen))
                    )
                    .AddChild(new ColorInputComponent()
                        .SetVariant(UIColorInputVariant.Swatch)
                        .SetWidth(UILayoutLength.Absolute(120))
                        .SetValue(UIThemeColor.FromColorVariant(ColorName.NebulaGold))
                    )
                    .AddChild(new ColorInputComponent()
                        .SetVariant(UIColorInputVariant.Swatch)
                        .SetWidth(UILayoutLength.Absolute(120))
                        .SetValue(UIThemeColor.FromColorVariant(ColorName.NovaPurple))
                    )
                )
                .AddChild(UIText.Note("The colour a person picks has nothing to do with **which theme is live**, so the text written across a swatch is judged against *the swatch itself* — see `UIColorContrast`."))
        );
    }

    /// <summary>
    /// The three ways of choosing, switched on one at a time; all off leaves the text box.
    /// </summary>
    private static ContainerComponent CreateSurfacesGroup()
    {
        return DemoUI.CreateExample("What it offers",
            UILayout.Stack(16)
                .AddChild(new ColorInputComponent()
                    .SetTitle("Palette only — a fixed set to choose from")
                    .SetShowPalette(true)
                    .SetShowPicker(false)
                    .SetValue(UIThemeColor.FromColorVariant(ColorName.AuroraGreen))
                )
                .AddChild(new ColorInputComponent()
                    .SetTitle("Picker only — anywhere in the wheel")
                    .SetShowPalette(false)
                    .SetShowPicker(true)
                    .SetValue(UIThemeColor.FromColorVariant(ColorName.AuroraGreen))
                )
                .AddChild(new ColorInputComponent()
                    .SetTitle("Picker, with opacity")
                    .SetShowPalette(false)
                    .SetShowPicker(true)
                    .SetShowOpacity(true)
                    .SetValue(UIThemeColor.FromColorVariant(ColorName.AuroraGreen, opacity: 128))
                )
                .AddChild(new ColorInputComponent()
                    .SetTitle("Neither — typed, and nothing else")
                    .SetShowPalette(false)
                    .SetShowPicker(false)
                    .SetValue(UIThemeColor.FromColorVariant(ColorName.AuroraGreen))
                )
        );
    }

    /// <summary>
    /// The text the field writes back is read by something downstream, so the reader is what chooses the format.
    /// </summary>
    /// <remarks>Written out rather than walked over the enum: the point is which reader wants which, not that there are two.</remarks>
    private static ContainerComponent CreateFormatGroup()
    {
        return DemoUI.CreateExample("How it is written down",
            UILayout.Row(24)
                .AddChild(UIPage.Labelled("Hex — a stylesheet, a token file", new ColorInputComponent()
                    .SetTextFormat(UIColorTextFormat.Hex)
                    .SetWidth(UILayoutLength.Absolute(260))
                    .SetValue(UIThemeColor.FromColorVariant(ColorName.NebulaGold))
                    )
                )
                .AddChild(UIPage.Labelled("Hex, once it is not opaque", new ColorInputComponent()
                    .SetTextFormat(UIColorTextFormat.Hex)
                    .SetWidth(UILayoutLength.Absolute(260))
                    .SetValue(UIThemeColor.FromColorVariant(ColorName.NebulaGold, opacity: 153))
                    .SetShowOpacity(true)
                    )
                )
                .AddChild(UIPage.Labelled("Rgb — anything that parses channels", new ColorInputComponent()
                    .SetTextFormat(UIColorTextFormat.Rgb)
                    .SetWidth(UILayoutLength.Absolute(260))
                    .SetValue(UIThemeColor.FromColorVariant(ColorName.NebulaGold))
                    )
                )
                .AddChild(UIPage.Labelled("Rgb, once it is not opaque", new ColorInputComponent()
                    .SetTextFormat(UIColorTextFormat.Rgb)
                    .SetWidth(UILayoutLength.Absolute(260))
                    .SetValue(UIThemeColor.FromColorVariant(ColorName.NebulaGold, opacity: 153))
                    .SetShowOpacity(true)
                    )
                ),
            columns: 24,
            note: "Opacity is not a format of its own: each of the two grows a fourth channel as soon as the colour stops being opaque."
        );
    }
}
