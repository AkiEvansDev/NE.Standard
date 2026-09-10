using DemoApp.Views.Base;
using NE.Colors;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Styling;

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
        _ = container.AddChildren(DemoUI.CreateColumns(
            [CreateBrandingGroup()],
            [CreateSurfacesGroup()]
        ));

        _ = container.AddChild(CreateFormatGroup());
    }

    /// <summary>
    /// A handful of colours making up a theme, each labelled with what it paints rather than with what it is.
    /// </summary>
    /// <remarks>Both variants, because they are the two halves of one job: a field where the value is edited, swatches where it is chosen.</remarks>
    private static ContainerComponent CreateBrandingGroup()
    {
        return DemoUI.CreateGroup(null, "Where it is used",
            content => content.AddChild(DemoUI.CreateStack(16)
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
                .AddChild(DemoUI.CreateCaption("The chart's other series, as swatches")
                    .SetMargin(UIThickness.All(0, 8, 0, 0))
                )
                .AddChild(DemoUI.CreateRow(8)
                    .AddChild(CreateSwatch(ColorName.StellarRed))
                    .AddChild(CreateSwatch(ColorName.AuroraGreen))
                    .AddChild(CreateSwatch(ColorName.NebulaGold))
                    .AddChild(CreateSwatch(ColorName.NovaPurple))
                )
                .AddChild(new ParagraphComponent()
                    .SetDescription("The colour a person picks has nothing to do with **which theme is live**, so the text written across a swatch is judged against *the swatch itself* — see `UIColorContrast`.")
                    .SetDescriptionType(UITextAppearance.Caption)
                    .SetDescriptionColor(UIThemeColor.Muted)
                )
            )
        );
    }

    private static ColorInputComponent CreateSwatch(ColorName color)
        => new ColorInputComponent()
            .SetVariant(UIColorInputVariant.Swatch)
            .SetWidth(UILayoutLength.Absolute(120))
            .SetValue(UIThemeColor.FromColorVariant(color));

    /// <summary>
    /// The three ways of choosing, switched on one at a time; all off leaves the text box.
    /// </summary>
    private static ContainerComponent CreateSurfacesGroup()
    {
        return DemoUI.CreateGroup(null, "What it offers",
            content => content.AddChild(DemoUI.CreateStack(16)
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
            )
        );
    }

    /// <summary>
    /// The text the field writes back is read by something downstream, so the reader is what chooses the format.
    /// </summary>
    /// <remarks>Written out rather than walked over the enum: the point is which reader wants which, not that there are two.</remarks>
    private static ContainerComponent CreateFormatGroup()
    {
        return DemoUI.CreateGroup(null, "How it is written down",
            content => content.AddChild(DemoUI.CreateRow(24)
                .AddChild(DemoUI.CreateCaptionedItem("Hex — a stylesheet, a token file", CreateFormatted(UIColorTextFormat.Hex, opacity: null)))
                .AddChild(DemoUI.CreateCaptionedItem("Hex, once it is not opaque", CreateFormatted(UIColorTextFormat.Hex, opacity: 153)))
                .AddChild(DemoUI.CreateCaptionedItem("Rgb — anything that parses channels", CreateFormatted(UIColorTextFormat.Rgb, opacity: null)))
                .AddChild(DemoUI.CreateCaptionedItem("Rgb, once it is not opaque", CreateFormatted(UIColorTextFormat.Rgb, opacity: 153)))
                .SetPlacement(1, 1, 24, 1)
            ),
            columns: 24,
            note: "Opacity is not a format of its own: each of the two grows a fourth channel as soon as the colour stops being opaque."
        );
    }

    private static ColorInputComponent CreateFormatted(UIColorTextFormat format, byte? opacity)
    {
        ColorInputComponent field = new ColorInputComponent()
            .SetTextFormat(format)
            .SetWidth(UILayoutLength.Absolute(260))
            .SetValue(opacity is null
                ? UIThemeColor.FromColorVariant(ColorName.NebulaGold)
                : UIThemeColor.FromColorVariant(ColorName.NebulaGold, opacity: opacity.Value));

        return opacity is null ? field : field.SetShowOpacity(true);
    }
}
